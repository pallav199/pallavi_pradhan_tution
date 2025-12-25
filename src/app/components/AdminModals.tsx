'use client';

import React, { useState } from 'react';
import { XIcon, CheckCircleIcon, EditIcon } from './Icons';

// Eye icon
const EyeIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

interface QuestionAnswer {
    questionId: number;
    question: string;
    options: string[];
    correctAnswer: number;
    selectedAnswer: number;
    isCorrect: boolean;
}

interface DetailedResult {
    id: number;
    studentId: number;
    studentName: string;
    quizTitle: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
    timeTaken: number;
    answers: QuestionAnswer[];
}

interface Student {
    id: number;
    name: string;
    class: number;
    email?: string;
    phone?: string;
    password?: string;
    quizzesTaken: number;
    avgScore: number;
}

// Sample detailed results with question-level data
export const sampleDetailedResults: DetailedResult[] = [
    {
        id: 1,
        studentId: 1,
        studentName: 'Aarav Sharma',
        quizTitle: 'Chemical Reactions',
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        completedAt: '2024-12-25 10:30',
        timeTaken: 420,
        answers: [
            { questionId: 1, question: 'What is the chemical formula for water?', options: ['H2O', 'CO2', 'NaCl', 'O2'], correctAnswer: 0, selectedAnswer: 0, isCorrect: true },
            { questionId: 2, question: 'Which gas is released during photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correctAnswer: 1, selectedAnswer: 1, isCorrect: true },
            { questionId: 3, question: 'What is the pH of a neutral solution?', options: ['0', '7', '14', '1'], correctAnswer: 1, selectedAnswer: 1, isCorrect: true },
            { questionId: 4, question: 'Which metal is liquid at room temperature?', options: ['Iron', 'Gold', 'Mercury', 'Silver'], correctAnswer: 2, selectedAnswer: 2, isCorrect: true },
            { questionId: 5, question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correctAnswer: 1, selectedAnswer: 0, isCorrect: false },
            { questionId: 6, question: 'Which is a noble gas?', options: ['Oxygen', 'Nitrogen', 'Helium', 'Hydrogen'], correctAnswer: 2, selectedAnswer: 2, isCorrect: true },
            { questionId: 7, question: 'What is the valency of Sodium?', options: ['1', '2', '3', '4'], correctAnswer: 0, selectedAnswer: 0, isCorrect: true },
            { questionId: 8, question: 'Which acid is present in vinegar?', options: ['Hydrochloric', 'Sulfuric', 'Acetic', 'Nitric'], correctAnswer: 2, selectedAnswer: 2, isCorrect: true },
            { questionId: 9, question: 'What is the molecular formula of glucose?', options: ['C6H12O6', 'C12H22O11', 'CH4', 'C2H5OH'], correctAnswer: 0, selectedAnswer: 1, isCorrect: false },
            { questionId: 10, question: 'Which element has symbol Fe?', options: ['Fluorine', 'Iron', 'Francium', 'Fermium'], correctAnswer: 1, selectedAnswer: 1, isCorrect: true },
        ]
    }
];

// View Detailed Result Modal
export function ViewResultModal({
    result,
    onClose
}: {
    result: DetailedResult;
    onClose: () => void;
}) {
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div className="card" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>{result.studentName}&apos;s Result</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>{result.quizTitle} • {result.completedAt}</p>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                        <XIcon size={24} />
                    </button>
                </div>

                {/* Score Summary */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ flex: 1, padding: '16px', background: '#f0fdf4', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{result.answers.filter(a => a.isCorrect).length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Correct</div>
                    </div>
                    <div style={{ flex: 1, padding: '16px', background: '#fef2f2', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{result.answers.filter(a => !a.isCorrect).length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Wrong</div>
                    </div>
                    <div style={{ flex: 1, padding: '16px', background: '#f0f9ff', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0ea5e9' }}>{result.percentage}%</div>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>Score</div>
                    </div>
                </div>

                {/* Question-by-Question Breakdown */}
                <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Question-by-Question Analysis</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {result.answers.map((answer, idx) => (
                        <div
                            key={answer.questionId}
                            style={{
                                padding: '16px',
                                borderRadius: '8px',
                                border: `1px solid ${answer.isCorrect ? '#86efac' : '#fecaca'}`,
                                background: answer.isCorrect ? '#f0fdf4' : '#fef2f2'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <span style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: answer.isCorrect ? '#22c55e' : '#ef4444',
                                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 600
                                }}>
                                    {idx + 1}
                                </span>
                                <span style={{ fontWeight: 500, color: '#0f172a', flex: 1 }}>{answer.question}</span>
                                {answer.isCorrect ? (
                                    <span style={{ color: '#22c55e' }}><CheckCircleIcon size={20} /></span>
                                ) : (
                                    <span style={{ color: '#ef4444' }}><XIcon size={20} /></span>
                                )}
                            </div>

                            <div style={{ marginLeft: '32px', fontSize: '0.875rem' }}>
                                <div style={{ color: '#64748b', marginBottom: '4px' }}>
                                    Student answered: <span style={{ fontWeight: 500, color: answer.isCorrect ? '#166534' : '#991b1b' }}>
                                        {answer.options[answer.selectedAnswer]}
                                    </span>
                                </div>
                                {!answer.isCorrect && (
                                    <div style={{ color: '#22c55e' }}>
                                        Correct answer: <span style={{ fontWeight: 500 }}>{answer.options[answer.correctAnswer]}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
                    Close
                </button>
            </div>
        </div>
    );
}

// Edit Student Modal
export function EditStudentModal({
    student,
    onSave,
    onClose
}: {
    student: Student;
    onSave: (student: Student) => void;
    onClose: () => void;
}) {
    const [editedStudent, setEditedStudent] = useState({
        ...student,
        email: student.email || '',
        phone: student.phone || '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...student,
            name: editedStudent.name,
            class: editedStudent.class,
            email: editedStudent.email,
            phone: editedStudent.phone,
            password: editedStudent.password || student.password
        });
        onClose();
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>Edit Student</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <XIcon size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                            Name *
                        </label>
                        <input
                            type="text"
                            className="input"
                            value={editedStudent.name}
                            onChange={(e) => setEditedStudent({ ...editedStudent, name: e.target.value })}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                            Class *
                        </label>
                        <select
                            className="input"
                            value={editedStudent.class}
                            onChange={(e) => setEditedStudent({ ...editedStudent, class: parseInt(e.target.value) })}
                        >
                            <option value={8}>Class 8</option>
                            <option value={9}>Class 9</option>
                            <option value={10}>Class 10</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                            Email (optional)
                        </label>
                        <input
                            type="email"
                            className="input"
                            placeholder="student@email.com"
                            value={editedStudent.email}
                            onChange={(e) => setEditedStudent({ ...editedStudent, email: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                            Phone (optional)
                        </label>
                        <input
                            type="tel"
                            className="input"
                            placeholder="+91 99999 99999"
                            value={editedStudent.phone}
                            onChange={(e) => setEditedStudent({ ...editedStudent, phone: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>
                            New Password (leave blank to keep current)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="input"
                                placeholder="Enter new password"
                                value={editedStudent.password}
                                onChange={(e) => setEditedStudent({ ...editedStudent, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#64748b'
                                }}
                            >
                                <EyeIcon size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Results Table Row with View Details Button
export function ResultsTableRow({
    result,
    quizTitle,
    formatTime,
    onViewDetails
}: {
    result: {
        id: number;
        studentName: string;
        score: number;
        totalQuestions: number;
        percentage: number;
        completedAt: string;
        timeTaken: number;
    };
    quizTitle: string;
    formatTime: (seconds: number) => string;
    onViewDetails: () => void;
}) {
    return (
        <tr style={{ borderTop: '1px solid #e2e8f0' }}>
            <td style={{ padding: '14px 16px', fontWeight: 500, color: '#0f172a' }}>{result.studentName}</td>
            <td style={{ padding: '14px 16px', color: '#475569' }}>{quizTitle}</td>
            <td style={{ padding: '14px 16px', textAlign: 'center', color: '#475569' }}>{result.score}/{result.totalQuestions}</td>
            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    background: result.percentage >= 80 ? '#dcfce7' : result.percentage >= 60 ? '#fef3c7' : '#fee2e2',
                    color: result.percentage >= 80 ? '#166534' : result.percentage >= 60 ? '#92400e' : '#991b1b'
                }}>
                    {result.percentage}%
                </span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'center', color: '#475569' }}>{formatTime(result.timeTaken)}</td>
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                    onClick={onViewDetails}
                    style={{
                        padding: '6px 12px',
                        background: '#f0f9ff',
                        color: '#0369a1',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '0.8125rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}
                >
                    <EyeIcon size={14} />
                    View
                </button>
            </td>
        </tr>
    );
}

// Students Table Row with Edit Button
export function StudentsTableRow({
    student,
    resultsCount,
    onEdit,
    onDelete
}: {
    student: Student;
    resultsCount: number;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <tr style={{ borderTop: '1px solid #e2e8f0' }}>
            <td style={{ padding: '14px 16px', fontWeight: 500, color: '#0f172a' }}>{student.name}</td>
            <td style={{ padding: '14px 16px' }}>
                <span className="badge badge-primary">Class {student.class}</span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'center', color: '#475569' }}>{resultsCount}</td>
            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                <span style={{
                    fontWeight: 600,
                    color: student.avgScore >= 75 ? '#22c55e' : student.avgScore >= 50 ? '#f59e0b' : '#ef4444'
                }}>
                    {student.avgScore}%
                </span>
            </td>
            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                <button
                    onClick={onEdit}
                    style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9' }}
                >
                    <EditIcon size={16} />
                </button>
                <button
                    onClick={onDelete}
                    style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                >
                    <XIcon size={16} />
                </button>
            </td>
        </tr>
    );
}
