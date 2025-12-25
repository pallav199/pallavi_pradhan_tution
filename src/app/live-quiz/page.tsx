'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FlaskIcon,
    ClockIcon,
    CheckCircleIcon,
    XIcon,
    ArrowRightIcon,
    HomeIcon,
    TrophyIcon
} from '../components/Icons';

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface LiveQuiz {
    id: number;
    title: string;
    class: number;
    liveCode: string;
    liveStartTime: string;
    liveEndTime: string;
    questionList?: Question[];
}

// Sample questions for live quiz (in production, fetch from API)
const sampleQuestions: Question[] = [
    {
        question: "What is the SI unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correctAnswer: 1,
        explanation: "The SI unit of force is Newton (N), named after Sir Isaac Newton."
    },
    {
        question: "Which gas is essential for respiration?",
        options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
        correctAnswer: 2,
        explanation: "Oxygen is essential for cellular respiration in living organisms."
    },
    {
        question: "What is the chemical formula for table salt?",
        options: ["NaCl", "KCl", "CaCl₂", "MgCl₂"],
        correctAnswer: 0,
        explanation: "Table salt is sodium chloride with the formula NaCl."
    },
    {
        question: "Which organelle is responsible for photosynthesis?",
        options: ["Mitochondria", "Ribosome", "Chloroplast", "Nucleus"],
        correctAnswer: 2,
        explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis."
    },
    {
        question: "What is the speed of light in vacuum?",
        options: ["3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s", "3 × 10⁴ m/s"],
        correctAnswer: 1,
        explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s."
    }
];

type QuizState = 'join' | 'waiting' | 'quiz' | 'result';

export default function LiveQuizPage() {
    const [quizState, setQuizState] = useState<QuizState>('join');
    const [joinCode, setJoinCode] = useState('');
    const [studentName, setStudentName] = useState('');
    const [error, setError] = useState('');
    const [liveQuiz, setLiveQuiz] = useState<LiveQuiz | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(0);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ questionId: number, selected: number, correct: boolean }[]>([]);
    const [questions, setQuestions] = useState<Question[]>(sampleQuestions);

    // Timer effect
    useEffect(() => {
        if (quizState === 'quiz' && timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setQuizState('result');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [quizState, timeRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleJoinQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!studentName.trim()) {
            setError('Please enter your name');
            return;
        }

        if (!joinCode.trim()) {
            setError('Please enter the quiz code');
            return;
        }

        // Check localStorage for active live quiz
        const storedQuiz = localStorage.getItem('liveQuiz');

        if (storedQuiz) {
            const quiz = JSON.parse(storedQuiz) as LiveQuiz;

            if (quiz.liveCode.toUpperCase() === joinCode.toUpperCase()) {
                const endTime = new Date(quiz.liveEndTime).getTime();
                const now = Date.now();

                if (endTime > now) {
                    setLiveQuiz(quiz);
                    setTimeRemaining(Math.floor((endTime - now) / 1000));
                    setQuizState('quiz');
                    return;
                } else {
                    setError('This quiz has ended.');
                    return;
                }
            }
        }

        setError('Invalid quiz code. Please check and try again.');
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer === null) {
            setSelectedAnswer(index);
            setAnswers([...answers, {
                questionId: currentQuestionIndex,
                selected: index,
                correct: index === questions[currentQuestionIndex].correctAnswer
            }]);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
        } else {
            setQuizState('result');
        }
    };

    const correctAnswers = answers.filter(a => a.correct).length;
    const score = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;
    const currentQuestion = questions[currentQuestionIndex];

    // Join Screen
    if (quizState === 'join') {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FlaskIcon className="text-white" size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>Live Quiz</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pallavi Pradhan Tuition</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '32px' }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', textAlign: 'center', marginBottom: '8px' }}>
                            Join Live Quiz
                        </h1>
                        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '24px' }}>
                            Enter the code provided by your teacher
                        </p>

                        {error && (
                            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '16px', color: '#dc2626', fontSize: '0.875rem', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleJoinQuiz}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Enter your name"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                                    Quiz Code
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., ABC123"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase' }}
                                    maxLength={6}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                                Join Quiz
                                <ArrowRightIcon size={18} />
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px' }}>
                        <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem' }}>
                            ← Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    // Quiz Screen
    if (quizState === 'quiz') {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                {/* Header */}
                <header style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '12px 0', position: 'sticky', top: 0, zIndex: 10 }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                                <span style={{ fontWeight: 600, color: '#22c55e', fontSize: '0.875rem' }}>LIVE</span>
                                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>• {liveQuiz?.title}</span>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', borderRadius: '6px',
                                background: timeRemaining < 60 ? '#fef2f2' : '#f1f5f9',
                                color: timeRemaining < 60 ? '#dc2626' : '#374151',
                                fontWeight: 600, fontFamily: 'monospace'
                            }}>
                                <ClockIcon size={16} />
                                {formatTime(timeRemaining)}
                            </div>
                        </div>
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
                            <div style={{ height: '100%', background: '#0ea5e9', borderRadius: '3px', transition: 'width 0.3s', width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }} />
                        </div>
                    </div>
                </header>

                <main style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 16px' }}>
                    <div className="card" style={{ padding: '28px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </span>
                        </div>

                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '24px', lineHeight: 1.5 }}>
                            {currentQuestion?.question}
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                            {currentQuestion?.options.map((option, index) => {
                                const isCorrect = index === currentQuestion.correctAnswer;
                                const isSelected = selectedAnswer === index;
                                const isWrong = isSelected && !isCorrect;

                                let bgColor = 'white';
                                let borderColor = '#e2e8f0';

                                if (selectedAnswer !== null) {
                                    if (isCorrect) {
                                        bgColor = '#dcfce7';
                                        borderColor = '#22c55e';
                                    } else if (isWrong) {
                                        bgColor = '#fee2e2';
                                        borderColor = '#ef4444';
                                    }
                                }

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        disabled={selectedAnswer !== null}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            border: `1px solid ${borderColor}`,
                                            background: bgColor,
                                            textAlign: 'left',
                                            cursor: selectedAnswer !== null ? 'default' : 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <span style={{
                                            width: '28px', height: '28px', borderRadius: '6px',
                                            background: isCorrect && selectedAnswer !== null ? '#22c55e' : isWrong ? '#ef4444' : '#f1f5f9',
                                            color: (isCorrect && selectedAnswer !== null) || isWrong ? 'white' : '#475569',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 600, fontSize: '0.875rem'
                                        }}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <span style={{ color: '#1e293b', fontWeight: 500 }}>{option}</span>
                                        {selectedAnswer !== null && isCorrect && <CheckCircleIcon size={20} style={{ marginLeft: 'auto', color: '#22c55e' }} />}
                                        {isWrong && <XIcon size={20} style={{ marginLeft: 'auto', color: '#ef4444' }} />}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedAnswer !== null && (
                            <button onClick={handleNextQuestion} className="btn btn-primary" style={{ width: '100%' }}>
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                                <ArrowRightIcon size={16} />
                            </button>
                        )}
                    </div>
                </main>

                <style jsx>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
            </div>
        );
    }

    // Result Screen
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: '450px', width: '100%', margin: '0 auto', padding: '24px' }}>
                <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: score >= 60 ? '#dcfce7' : '#fef3c7',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <TrophyIcon size={32} style={{ color: score >= 60 ? '#22c55e' : '#f59e0b' }} />
                    </div>

                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Quiz Complete!
                    </h1>
                    <p style={{ color: '#64748b', marginBottom: '24px' }}>{studentName}</p>

                    <div style={{ fontSize: '3rem', fontWeight: 800, color: score >= 60 ? '#22c55e' : '#f59e0b', marginBottom: '24px' }}>
                        {score}%
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ flex: 1, padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{correctAnswers}</div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Correct</div>
                        </div>
                        <div style={{ flex: 1, padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{questions.length - correctAnswers}</div>
                            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Incorrect</div>
                        </div>
                    </div>

                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2',
                        marginBottom: '24px'
                    }}>
                        <p style={{ fontWeight: 600, color: score >= 80 ? '#166534' : score >= 60 ? '#92400e' : '#991b1b' }}>
                            {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
                        </p>
                    </div>

                    <Link href="/" className="btn btn-primary" style={{ width: '100%' }}>
                        <HomeIcon size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
