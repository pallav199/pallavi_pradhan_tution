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

// Science quiz questions for different classes
const quizData = {
    8: [
        {
            id: 1,
            question: "Which microorganism is used in making bread?",
            topic: "Microorganisms",
            options: ["Yeast", "Bacteria", "Virus", "Protozoa"],
            correctAnswer: 0,
            explanation: "Yeast is used in making bread. It ferments sugar and produces carbon dioxide which makes the bread rise."
        },
        {
            id: 2,
            question: "What is the basic unit of life?",
            topic: "Cell Structure",
            options: ["Tissue", "Organ", "Cell", "Organism"],
            correctAnswer: 2,
            explanation: "The cell is the basic structural and functional unit of all living organisms."
        },
        {
            id: 3,
            question: "Which metal is liquid at room temperature?",
            topic: "Metals & Non-metals",
            options: ["Iron", "Mercury", "Copper", "Aluminium"],
            correctAnswer: 1,
            explanation: "Mercury is the only metal that is liquid at room temperature (25°C)."
        },
        {
            id: 4,
            question: "Petroleum is also known as:",
            topic: "Coal & Petroleum",
            options: ["Green gold", "Black gold", "Liquid gold", "White gold"],
            correctAnswer: 1,
            explanation: "Petroleum is called 'black gold' because of its dark color and high economic value."
        },
        {
            id: 5,
            question: "Which of the following is a Kharif crop?",
            topic: "Crop Production",
            options: ["Wheat", "Mustard", "Paddy", "Gram"],
            correctAnswer: 2,
            explanation: "Paddy (rice) is a Kharif crop, sown in the rainy season and harvested in autumn."
        },
    ],
    9: [
        {
            id: 1,
            question: "Which of the following has the highest kinetic energy?",
            topic: "Matter in Our Surroundings",
            options: ["Solid", "Liquid", "Gas", "All have equal"],
            correctAnswer: 2,
            explanation: "Gas particles have the highest kinetic energy as they move freely and rapidly."
        },
        {
            id: 2,
            question: "What is the SI unit of force?",
            topic: "Force and Laws of Motion",
            options: ["Joule", "Newton", "Watt", "Pascal"],
            correctAnswer: 1,
            explanation: "The SI unit of force is Newton (N), named after Sir Isaac Newton."
        },
        {
            id: 3,
            question: "An atom with 8 protons and 8 neutrons has mass number:",
            topic: "Atoms and Molecules",
            options: ["8", "16", "0", "64"],
            correctAnswer: 1,
            explanation: "Mass number = Number of protons + Number of neutrons = 8 + 8 = 16"
        },
        {
            id: 4,
            question: "Which tissue provides support to plants?",
            topic: "Tissues",
            options: ["Parenchyma", "Collenchyma", "Sclerenchyma", "Both B and C"],
            correctAnswer: 3,
            explanation: "Both Collenchyma and Sclerenchyma provide mechanical support to plants."
        },
        {
            id: 5,
            question: "When an object moves in a circular path, it is said to have:",
            topic: "Motion",
            options: ["Linear motion", "Uniform motion", "Circular motion", "Oscillatory motion"],
            correctAnswer: 2,
            explanation: "When an object moves along a circular path, the motion is called circular motion."
        },
    ],
    10: [
        {
            id: 1,
            question: "What is the chemical formula for water?",
            topic: "Chemical Reactions",
            options: ["H₂O", "CO₂", "NaCl", "O₂"],
            correctAnswer: 0,
            explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H₂O."
        },
        {
            id: 2,
            question: "Which acid is present in our stomach?",
            topic: "Acids, Bases and Salts",
            options: ["Acetic acid", "Hydrochloric acid", "Sulphuric acid", "Citric acid"],
            correctAnswer: 1,
            explanation: "Hydrochloric acid (HCl) is present in gastric juice and helps in digestion."
        },
        {
            id: 3,
            question: "The process by which green plants make food is called:",
            topic: "Life Processes",
            options: ["Respiration", "Photosynthesis", "Transpiration", "Excretion"],
            correctAnswer: 1,
            explanation: "Photosynthesis is the process by which plants convert light energy into chemical energy."
        },
        {
            id: 4,
            question: "DNA stands for:",
            topic: "Heredity and Evolution",
            options: ["Deoxyribonucleic acid", "Dinucleic acid", "Dioxynucleic acid", "Dual nucleic acid"],
            correctAnswer: 0,
            explanation: "DNA (Deoxyribonucleic acid) is the hereditary material in humans and almost all other organisms."
        },
        {
            id: 5,
            question: "Which metal is most reactive?",
            topic: "Metals and Non-metals",
            options: ["Iron", "Copper", "Potassium", "Gold"],
            correctAnswer: 2,
            explanation: "Potassium is highly reactive and reacts vigorously with water and air."
        },
    ],
};

type QuizState = 'loading' | 'selection' | 'quiz' | 'result';

interface LoggedInStudent {
    id: number;
    name: string;
    class: number;
}

export default function QuizPage() {
    const [quizState, setQuizState] = useState<QuizState>('loading');
    const [loggedInStudent, setLoggedInStudent] = useState<LoggedInStudent | null>(null);
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [answers, setAnswers] = useState<{ questionId: number, selected: number, correct: boolean }[]>([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    const questions = selectedClass ? quizData[selectedClass as keyof typeof quizData] : [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const correctAnswers = answers.filter(a => a.correct).length;
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    // Check login status
    useEffect(() => {
        const studentData = localStorage.getItem('loggedInStudent');
        if (studentData) {
            const student = JSON.parse(studentData);
            setLoggedInStudent(student);
            setSelectedClass(student.class);
            setQuizState('selection');
        } else {
            // Redirect to login if not logged in
            window.location.href = '/login';
        }
    }, []);

    useEffect(() => {
        if (quizState === 'quiz' && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && quizState === 'quiz') {
            setQuizState('result');
        }
    }, [quizState, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStartQuiz = () => {
        if (selectedClass) {
            setQuizState('quiz');
            setTimeLeft(300);
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (selectedAnswer === null) {
            setSelectedAnswer(index);
            setShowExplanation(true);
            setAnswers([...answers, {
                questionId: currentQuestion.id,
                selected: index,
                correct: index === currentQuestion.correctAnswer
            }]);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            setQuizState('result');
        }
    };

    const handleRestartQuiz = () => {
        setQuizState('selection');
        if (loggedInStudent) {
            setSelectedClass(loggedInStudent.class);
        }
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setAnswers([]);
        setTimeLeft(300);
    };

    const handleLogout = () => {
        localStorage.removeItem('loggedInStudent');
        window.location.href = '/login';
    };

    // Loading Screen
    if (quizState === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#0ea5e9', marginBottom: '12px', display: 'block' }}><ClockIcon size={40} /></span>
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Selection Screen
    if (quizState === 'selection') {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                {/* Header */}
                <header style={{
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '16px 0'
                }}>
                    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <FlaskIcon className="text-white" size={20} />
                            </div>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>Pallavi Pradhan Tuition</span>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                Welcome, <strong style={{ color: '#0f172a' }}>{loggedInStudent?.name}</strong>
                            </span>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <main className="container" style={{ padding: '48px 1rem' }}>
                    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', textAlign: 'center' }}>
                            Science Practice Quiz
                        </h1>
                        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '32px' }}>
                            Class {loggedInStudent?.class} • Ready to start practicing!
                        </p>

                        {/* Quiz Info */}
                        {selectedClass && (
                            <div className="card" style={{ padding: '20px', marginBottom: '24px', background: '#f0f9ff' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>Class {selectedClass} Science</div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{quizData[selectedClass as keyof typeof quizData].length} Questions • 5 Minutes</div>
                                    </div>
                                    <span style={{ color: '#0ea5e9' }}><ClockIcon size={24} /></span>
                                </div>
                            </div>
                        )}

                        {/* Start Button */}
                        <button
                            onClick={handleStartQuiz}
                            disabled={!selectedClass}
                            className="btn btn-primary btn-lg"
                            style={{
                                width: '100%',
                                opacity: selectedClass ? 1 : 0.5,
                                cursor: selectedClass ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Start Quiz
                            <ArrowRightIcon size={18} />
                        </button>

                        {/* Notes Link */}
                        <Link
                            href="/notes"
                            className="btn btn-secondary"
                            style={{ width: '100%', marginTop: '12px' }}
                        >
                            📚 View Study Notes
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    // Quiz Screen
    if (quizState === 'quiz') {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
                {/* Header */}
                <header style={{
                    background: 'white',
                    borderBottom: '1px solid #e2e8f0',
                    padding: '12px 0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10
                }}>
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="badge badge-primary">Class {selectedClass}</span>
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{currentQuestion?.topic}</span>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '6px 12px', borderRadius: '6px',
                                background: timeLeft < 60 ? '#fef2f2' : '#f1f5f9',
                                color: timeLeft < 60 ? '#dc2626' : '#374151',
                                fontWeight: 600, fontFamily: 'monospace'
                            }}>
                                <ClockIcon size={16} />
                                {formatTime(timeLeft)}
                            </div>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }} />
                        </div>
                    </div>
                </header>

                <main className="container" style={{ padding: '32px 1rem' }}>
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="card" style={{ padding: '28px' }}>
                            {/* Question Number */}
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                    Question {currentQuestionIndex + 1} of {totalQuestions}
                                </span>
                            </div>

                            {/* Question */}
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '24px', lineHeight: 1.5 }}>
                                {currentQuestion?.question}
                            </h2>

                            {/* Options */}
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
                                                transition: 'all 0.2s ease',
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
                                            {selectedAnswer !== null && isCorrect && (
                                                <span style={{ marginLeft: 'auto', color: '#22c55e' }}><CheckCircleIcon size={20} /></span>
                                            )}
                                            {isWrong && (
                                                <span style={{ marginLeft: 'auto', color: '#ef4444' }}><XIcon size={20} /></span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Explanation */}
                            {showExplanation && (
                                <div style={{
                                    padding: '16px',
                                    borderRadius: '8px',
                                    background: '#f0f9ff',
                                    border: '1px solid #bae6fd',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ fontWeight: 600, color: '#0369a1', marginBottom: '6px' }}>Explanation</div>
                                    <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                                        {currentQuestion?.explanation}
                                    </p>
                                </div>
                            )}

                            {/* Next Button */}
                            {selectedAnswer !== null && (
                                <button onClick={handleNextQuestion} className="btn btn-primary" style={{ width: '100%' }}>
                                    {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                                    <ArrowRightIcon size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Result Screen
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center' }}>
            <div className="container" style={{ padding: '48px 1rem' }}>
                <div style={{ maxWidth: '450px', margin: '0 auto' }}>
                    <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                        {/* Icon */}
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%',
                            background: score >= 60 ? '#dcfce7' : '#fef3c7',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <span style={{ color: score >= 60 ? '#22c55e' : '#f59e0b' }}><TrophyIcon size={32} /></span>
                        </div>

                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                            Quiz Complete!
                        </h1>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Class {selectedClass} Science</p>

                        {/* Score */}
                        <div style={{
                            fontSize: '3rem',
                            fontWeight: 800,
                            color: score >= 60 ? '#22c55e' : '#f59e0b',
                            marginBottom: '24px'
                        }}>
                            {score}%
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ flex: 1, padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{correctAnswers}</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Correct</div>
                            </div>
                            <div style={{ flex: 1, padding: '16px', background: '#f1f5f9', borderRadius: '8px' }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{totalQuestions - correctAnswers}</div>
                                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Incorrect</div>
                            </div>
                        </div>

                        {/* Message */}
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            background: score >= 80 ? '#dcfce7' : score >= 60 ? '#fef3c7' : '#fee2e2',
                            marginBottom: '24px'
                        }}>
                            <p style={{
                                fontWeight: 600,
                                color: score >= 80 ? '#166534' : score >= 60 ? '#92400e' : '#991b1b'
                            }}>
                                {score >= 80 ? 'Excellent work! Keep it up!' :
                                    score >= 60 ? 'Good job! Review the topics you missed.' :
                                        'Keep practicing! Review your notes and try again.'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={handleRestartQuiz} className="btn btn-primary" style={{ flex: 1 }}>
                                    Try Again
                                </button>
                                <Link href="/notes" className="btn btn-secondary" style={{ flex: 1 }}>
                                    📚 Study Notes
                                </Link>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
