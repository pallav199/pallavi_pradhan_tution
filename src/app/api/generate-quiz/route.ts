import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfParse from 'pdf-parse';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('pdf') as File;
        const numQuestions = parseInt(formData.get('numQuestions') as string) || 5;
        const difficulty = formData.get('difficulty') as string || 'Medium';
        const classLevel = formData.get('class') as string || '10';
        const title = formData.get('title') as string || 'Quiz';

        if (!file) {
            return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.'
            }, { status: 500 });
        }

        // Read PDF file content
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF text
        let pdfText = '';
        try {
            const pdfData = await (pdfParse as any)(buffer);
            pdfText = pdfData.text;
        } catch {
            return NextResponse.json({
                error: 'Could not parse PDF. Please ensure it is a valid PDF file with text content.'
            }, { status: 400 });
        }

        if (!pdfText || pdfText.trim().length < 100) {
            return NextResponse.json({
                error: 'PDF does not contain enough text content to generate questions.'
            }, { status: 400 });
        }

        // Truncate text if too long (Gemini has token limits)
        const maxChars = 15000;
        const truncatedText = pdfText.length > maxChars ? pdfText.substring(0, maxChars) : pdfText;

        // Create prompt for Gemini
        const prompt = `You are an expert CBSE Science teacher creating a quiz for Class ${classLevel} students.

Based on the following study material, generate exactly ${numQuestions} multiple choice questions.

Difficulty Level: ${difficulty}
- Easy: Basic recall and understanding questions
- Medium: Application and analysis questions  
- Hard: Higher-order thinking and problem-solving questions

Study Material:
${truncatedText}

Generate questions in the following JSON format. Return ONLY valid JSON, no additional text:
{
  "questions": [
    {
      "question": "The question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Brief explanation of why this answer is correct"
    }
  ]
}

Important:
- Each question must have exactly 4 options
- correctAnswer is the index (0-3) of the correct option
- Questions should be based on the study material provided
- Ensure questions are appropriate for Class ${classLevel} CBSE Science curriculum
- Include a brief explanation for each answer`;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let questions;
        try {
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            const parsed = JSON.parse(jsonMatch[0]);
            questions = parsed.questions;
        } catch {
            return NextResponse.json({
                error: 'Failed to parse AI response. Please try again.'
            }, { status: 500 });
        }

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return NextResponse.json({
                error: 'No questions were generated. Please try with different content.'
            }, { status: 500 });
        }

        // Return the generated quiz
        return NextResponse.json({
            success: true,
            quiz: {
                title,
                class: parseInt(classLevel),
                difficulty,
                questions: questions.length,
                questionList: questions
            }
        });

    } catch (error) {
        console.error('Quiz generation error:', error);
        return NextResponse.json({
            error: 'An error occurred while generating the quiz. Please try again.'
        }, { status: 500 });
    }
}
