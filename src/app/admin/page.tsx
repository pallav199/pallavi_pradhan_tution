'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FlaskIcon,
    UsersIcon,
    FileTextIcon,
    ChartIcon,
    SettingsIcon,
    PlusIcon,
    SearchIcon,
    EditIcon,
    TrashIcon,
    LogOutIcon,
    XIcon,
    UploadIcon,
    ClockIcon,
    CheckCircleIcon,
    TrophyIcon,
    BookOpenIcon
} from '../components/Icons';
import { ViewResultModal, EditStudentModal, sampleDetailedResults } from '../components/AdminModals';

// Play icon for live quiz
const PlayIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
);

// Stop icon
const StopIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
);

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

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizResult {
    id: number;
    studentId: number;
    studentName: string;
    quizId: number;
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
    timeTaken: number; // in seconds
}

interface Quiz {
    id: number;
    title: string;
    class: number;
    questions: number;
    attempts: number;
    difficulty?: string;
    questionList?: Question[];
    isLive?: boolean;
    liveStartTime?: string;
    liveEndTime?: string;
    liveCode?: string;
}

// Sample data
const initialStudents: Student[] = [
    { id: 1, name: 'Aarav Sharma', class: 10, quizzesTaken: 12, avgScore: 78 },
    { id: 2, name: 'Priya Patel', class: 9, quizzesTaken: 8, avgScore: 85 },
    { id: 3, name: 'Rohan Singh', class: 8, quizzesTaken: 15, avgScore: 72 },
    { id: 4, name: 'Ananya Gupta', class: 10, quizzesTaken: 10, avgScore: 90 },
    { id: 5, name: 'Vikram Raj', class: 9, quizzesTaken: 6, avgScore: 65 },
];

const initialQuizzes: Quiz[] = [
    { id: 1, title: 'Chemical Reactions', class: 10, questions: 10, attempts: 24, difficulty: 'Medium' },
    { id: 2, title: 'Force and Motion', class: 9, questions: 10, attempts: 18, difficulty: 'Easy' },
    { id: 3, title: 'Cell Structure', class: 8, questions: 10, attempts: 20, difficulty: 'Medium' },
    { id: 4, title: 'Acids and Bases', class: 10, questions: 10, attempts: 22, difficulty: 'Hard' },
];

const initialResults: QuizResult[] = [
    { id: 1, studentId: 1, studentName: 'Aarav Sharma', quizId: 1, score: 8, totalQuestions: 10, percentage: 80, completedAt: '2024-12-25 10:30', timeTaken: 420 },
    { id: 2, studentId: 2, studentName: 'Priya Patel', quizId: 1, score: 9, totalQuestions: 10, percentage: 90, completedAt: '2024-12-25 10:35', timeTaken: 380 },
    { id: 3, studentId: 3, studentName: 'Rohan Singh', quizId: 2, score: 7, totalQuestions: 10, percentage: 70, completedAt: '2024-12-25 11:00', timeTaken: 450 },
    { id: 4, studentId: 4, studentName: 'Ananya Gupta', quizId: 1, score: 10, totalQuestions: 10, percentage: 100, completedAt: '2024-12-25 10:28', timeTaken: 320 },
    { id: 5, studentId: 1, studentName: 'Aarav Sharma', quizId: 2, score: 6, totalQuestions: 10, percentage: 60, completedAt: '2024-12-25 11:15', timeTaken: 500 },
];

interface Note {
    id: number;
    title: string;
    content: string;
    class: number;
    subject: 'Physics' | 'Chemistry' | 'Biology';
    createdAt: string;
}

type Tab = 'overview' | 'students' | 'quizzes' | 'results' | 'live' | 'notes' | 'generate' | 'settings';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>(initialStudents);
    const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
    const [results, setResults] = useState<QuizResult[]>(initialResults);

    // Modal states
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [showAddQuiz, setShowAddQuiz] = useState(false);
    const [showEditQuiz, setShowEditQuiz] = useState(false);
    const [showCreateLive, setShowCreateLive] = useState(false);
    const [showEditStudent, setShowEditStudent] = useState(false);
    const [showResultDetails, setShowResultDetails] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [selectedResult, setSelectedResult] = useState<typeof sampleDetailedResults[0] | null>(null);
    const [selectedQuizResults, setSelectedQuizResults] = useState<number | null>(null);

    // Form states
    const [newStudent, setNewStudent] = useState({ name: '', class: '8', password: '' });
    const [newQuiz, setNewQuiz] = useState({ title: '', class: '8', questions: '10' });

    // Live quiz states
    const [liveQuizSettings, setLiveQuizSettings] = useState({
        quizId: '',
        duration: '10',
        startNow: true,
        scheduledTime: ''
    });
    const [activeLiveQuiz, setActiveLiveQuiz] = useState<Quiz | null>(null);
    const [liveTimeRemaining, setLiveTimeRemaining] = useState<number>(0);

    // Notes states
    const [notes, setNotes] = useState<Note[]>([]);
    const [showAddNote, setShowAddNote] = useState(false);
    const [newNote, setNewNote] = useState({ title: '', content: '', class: '8', subject: 'Physics' as 'Physics' | 'Chemistry' | 'Biology' });
    const [notesFilter, setNotesFilter] = useState({ class: 'all', subject: 'all' });

    // PDF Upload states
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [pdfQuizSettings, setPdfQuizSettings] = useState({
        title: '',
        class: '8',
        numQuestions: '5',
        difficulty: 'Medium'
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Check authentication on mount
    useEffect(() => {
        const authStatus = localStorage.getItem('teacherAuth');
        const authTime = localStorage.getItem('teacherAuthTime');

        if (authStatus === 'true' && authTime) {
            // Check if auth is less than 24 hours old
            const timeDiff = Date.now() - parseInt(authTime);
            if (timeDiff < 24 * 60 * 60 * 1000) {
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('teacherAuth');
                localStorage.removeItem('teacherAuthTime');
            }
        }
        setIsLoading(false);
    }, []);

    // Live quiz timer
    useEffect(() => {
        if (activeLiveQuiz && liveTimeRemaining > 0) {
            const timer = setInterval(() => {
                setLiveTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleStopLiveQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [activeLiveQuiz, liveTimeRemaining]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            window.location.href = '/teacher-login';
        }
    }, [isLoading, isAuthenticated]);

    // Load notes from localStorage
    useEffect(() => {
        const storedNotes = localStorage.getItem('teacherNotes');
        if (storedNotes) {
            setNotes(JSON.parse(storedNotes));
        }
    }, []);

    // Load students from localStorage
    useEffect(() => {
        const storedStudents = localStorage.getItem('adminStudents');
        if (storedStudents) {
            setStudents(JSON.parse(storedStudents));
        }
    }, []);

    // Load quizzes from localStorage
    useEffect(() => {
        const storedQuizzes = localStorage.getItem('adminQuizzes');
        if (storedQuizzes) {
            setQuizzes(JSON.parse(storedQuizzes));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('teacherAuth');
        localStorage.removeItem('teacherAuthTime');
        window.location.href = '/teacher-login';
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: ChartIcon },
        { id: 'students', label: 'Students', icon: UsersIcon },
        { id: 'quizzes', label: 'Quizzes', icon: FileTextIcon },
        { id: 'results', label: 'Results', icon: TrophyIcon },
        { id: 'live', label: 'Live Quiz', icon: PlayIcon },
        { id: 'notes', label: 'Notes', icon: BookOpenIcon },
        { id: 'generate', label: 'Generate Quiz', icon: UploadIcon },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
    ];

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudent.name.trim() && newStudent.password.trim()) {
            const student: Student = {
                id: Date.now(),
                name: newStudent.name,
                class: parseInt(newStudent.class),
                password: newStudent.password,
                quizzesTaken: 0,
                avgScore: 0
            };
            const updatedStudents = [...students, student];
            setStudents(updatedStudents);

            // Save full student data for admin panel persistence
            localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));

            // Save to localStorage for student login (minimal data)
            const registeredStudents = updatedStudents.map(s => ({
                id: s.id,
                name: s.name,
                class: s.class,
                password: s.password || ''
            }));
            localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));

            setNewStudent({ name: '', class: '8', password: '' });
            setShowAddStudent(false);
        }
    };

    const handleAddQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        if (newQuiz.title.trim()) {
            const quiz: Quiz = {
                id: Date.now(),
                title: newQuiz.title,
                class: parseInt(newQuiz.class),
                questions: parseInt(newQuiz.questions),
                attempts: 0,
                difficulty: 'Medium'
            };
            const updatedQuizzes = [...quizzes, quiz];
            setQuizzes(updatedQuizzes);
            localStorage.setItem('adminQuizzes', JSON.stringify(updatedQuizzes));
            setNewQuiz({ title: '', class: '8', questions: '10' });
            setShowAddQuiz(false);
        }
    };

    const handleEditQuiz = (quiz: Quiz) => {
        setEditingQuiz(quiz);
        setShowEditQuiz(true);
    };

    const handleSaveQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingQuiz) {
            const updatedQuizzes = quizzes.map(q => q.id === editingQuiz.id ? editingQuiz : q);
            setQuizzes(updatedQuizzes);
            localStorage.setItem('adminQuizzes', JSON.stringify(updatedQuizzes));
            setShowEditQuiz(false);
            setEditingQuiz(null);
        }
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (newNote.title.trim() && newNote.content.trim()) {
            const note: Note = {
                id: Date.now(),
                title: newNote.title,
                content: newNote.content,
                class: parseInt(newNote.class),
                subject: newNote.subject,
                createdAt: new Date().toISOString()
            };
            const updatedNotes = [...notes, note];
            setNotes(updatedNotes);
            localStorage.setItem('teacherNotes', JSON.stringify(updatedNotes));
            setNewNote({ title: '', content: '', class: '8', subject: 'Physics' });
            setShowAddNote(false);
        }
    };

    const handleDeleteNote = (noteId: number) => {
        const updatedNotes = notes.filter(n => n.id !== noteId);
        setNotes(updatedNotes);
        localStorage.setItem('teacherNotes', JSON.stringify(updatedNotes));
    };

    const filteredNotes = notes.filter(note => {
        if (notesFilter.class !== 'all' && note.class !== parseInt(notesFilter.class)) return false;
        if (notesFilter.subject !== 'all' && note.subject !== notesFilter.subject) return false;
        return true;
    });

    const handleDeleteStudent = (id: number) => {
        if (confirm('Are you sure you want to remove this student?')) {
            const updatedStudents = students.filter(s => s.id !== id);
            setStudents(updatedStudents);
            localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));

            // Also update registeredStudents for login
            const registeredStudents = updatedStudents.map(s => ({
                id: s.id,
                name: s.name,
                class: s.class,
                password: s.password || ''
            }));
            localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
        }
    };

    const handleDeleteQuiz = (id: number) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            const updatedQuizzes = quizzes.filter(q => q.id !== id);
            setQuizzes(updatedQuizzes);
            localStorage.setItem('adminQuizzes', JSON.stringify(updatedQuizzes));
        }
    };

    const handleStartLiveQuiz = () => {
        const quiz = quizzes.find(q => q.id === parseInt(liveQuizSettings.quizId));
        if (quiz) {
            const liveCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            const liveQuiz = {
                ...quiz,
                isLive: true,
                liveCode,
                liveStartTime: new Date().toISOString(),
                liveEndTime: new Date(Date.now() + parseInt(liveQuizSettings.duration) * 60 * 1000).toISOString()
            };
            setActiveLiveQuiz(liveQuiz);
            setLiveTimeRemaining(parseInt(liveQuizSettings.duration) * 60);
            setShowCreateLive(false);

            // Store in localStorage for students to access
            localStorage.setItem('liveQuiz', JSON.stringify(liveQuiz));
        }
    };

    const handleStopLiveQuiz = () => {
        setActiveLiveQuiz(null);
        setLiveTimeRemaining(0);
        localStorage.removeItem('liveQuiz');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadedFile(file);
            setErrorMessage('');
            const fileName = file.name.replace('.pdf', '');
            setPdfQuizSettings(prev => ({ ...prev, title: fileName }));
        }
    };

    const handleGenerateQuiz = async () => {
        if (!uploadedFile || !pdfQuizSettings.title.trim()) return;

        setIsGenerating(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            formData.append('pdf', uploadedFile);
            formData.append('title', pdfQuizSettings.title);
            formData.append('class', pdfQuizSettings.class);
            formData.append('numQuestions', pdfQuizSettings.numQuestions);
            formData.append('difficulty', pdfQuizSettings.difficulty);

            const response = await fetch('/api/generate-quiz', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate quiz');
            }

            const newGeneratedQuiz: Quiz = {
                id: quizzes.length + 1,
                title: data.quiz.title,
                class: data.quiz.class,
                questions: data.quiz.questions,
                attempts: 0,
                difficulty: data.quiz.difficulty,
                questionList: data.quiz.questionList
            };

            setGeneratedQuiz(newGeneratedQuiz);
        } catch (error) {
            console.error('Error generating quiz:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to generate quiz.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveGeneratedQuiz = () => {
        if (generatedQuiz) {
            setQuizzes([...quizzes, generatedQuiz]);
            setGeneratedQuiz(null);
            setUploadedFile(null);
            setPdfQuizSettings({ title: '', class: '8', numQuestions: '5', difficulty: 'Medium' });
            alert('Quiz saved successfully!');
        }
    };

    const getQuizResults = (quizId: number) => results.filter(r => r.quizId === quizId);
    const getQuizById = (id: number) => quizzes.find(q => q.id === id);

    // Show loading
    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#0ea5e9', marginBottom: '12px', display: 'block' }}><ClockIcon size={40} /></span>
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
            {/* Sidebar */}
            <aside style={{
                width: '240px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                bottom: 0,
                left: 0
            }}>
                <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FlaskIcon className="text-white" size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>Teacher Portal</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pallavi Pradhan</div>
                        </div>
                    </Link>
                </div>

                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                background: activeTab === item.id ? '#f0f9ff' : 'transparent',
                                color: activeTab === item.id ? '#0369a1' : '#475569',
                                fontWeight: activeTab === item.id ? 600 : 500,
                                cursor: 'pointer',
                                marginBottom: '4px',
                                fontSize: '0.9375rem',
                                textAlign: 'left'
                            }}
                        >
                            <item.icon size={18} />
                            {item.label}
                            {item.id === 'live' && activeLiveQuiz && (
                                <span style={{
                                    marginLeft: 'auto',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: '#22c55e',
                                    animation: 'pulse 2s infinite'
                                }} />
                            )}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#dc2626',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            width: '100%',
                            padding: '8px 0'
                        }}
                    >
                        <LogOutIcon size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, marginLeft: '240px', padding: '24px' }}>
                {/* Header */}
                <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', textTransform: 'capitalize' }}>
                            {activeTab === 'generate' ? 'Generate Quiz from PDF' : activeTab === 'live' ? 'Live Quiz' : activeTab === 'notes' ? 'Study Notes' : activeTab}
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                            {activeTab === 'overview' && 'View student progress and quiz statistics'}
                            {activeTab === 'students' && 'Manage your enrolled students'}
                            {activeTab === 'quizzes' && 'Create and manage quizzes'}
                            {activeTab === 'results' && 'View student performance on quizzes'}
                            {activeTab === 'live' && 'Start live quizzes for your class'}
                            {activeTab === 'notes' && 'Create and manage study notes for students'}
                            {activeTab === 'generate' && 'Upload PDF to generate quiz with AI'}
                            {activeTab === 'settings' && 'Configure your preferences'}
                        </p>
                    </div>

                    {activeTab === 'students' && (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><SearchIcon size={16} /></span>
                                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem', width: '180px' }} />
                            </div>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddStudent(true)}>
                                <PlusIcon size={16} /> Add Student
                            </button>
                        </div>
                    )}

                    {activeTab === 'quizzes' && (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowAddQuiz(true)}>
                                <PlusIcon size={16} /> Add Quiz
                            </button>
                        </div>
                    )}
                </header>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                            {[
                                { label: 'Total Students', value: students.length, color: '#0ea5e9' },
                                { label: 'Active Quizzes', value: quizzes.length, color: '#22c55e' },
                                { label: 'Total Attempts', value: results.length, color: '#f59e0b' },
                                { label: 'Avg. Score', value: results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length) + '%' : '0%', color: '#8b5cf6' },
                            ].map((stat) => (
                                <div key={stat.label} className="card" style={{ padding: '20px' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>{stat.value}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Live Quiz Alert */}
                        {activeLiveQuiz && (
                            <div style={{
                                padding: '16px 20px',
                                background: '#f0fdf4',
                                border: '1px solid #86efac',
                                borderRadius: '8px',
                                marginBottom: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#166534' }}>Live Quiz Active: {activeLiveQuiz.title}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#16a34a' }}>Code: {activeLiveQuiz.liveCode} • Time Remaining: {formatTime(liveTimeRemaining)}</div>
                                    </div>
                                </div>
                                <button onClick={handleStopLiveQuiz} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                                    Stop Quiz
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div className="card">
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a' }}>Recent Results</div>
                                <div style={{ padding: '12px 20px' }}>
                                    {results.slice(-5).reverse().map((result, i) => (
                                        <div key={result.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                                            <div>
                                                <div style={{ fontWeight: 500, color: '#0f172a' }}>{result.studentName}</div>
                                                <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{getQuizById(result.quizId)?.title}</div>
                                            </div>
                                            <span style={{ fontWeight: 600, color: result.percentage >= 70 ? '#22c55e' : result.percentage >= 50 ? '#f59e0b' : '#ef4444' }}>{result.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card">
                                <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#0f172a' }}>Top Performers</div>
                                <div style={{ padding: '12px 20px' }}>
                                    {students.sort((a, b) => b.avgScore - a.avgScore).slice(0, 5).map((student, i) => (
                                        <div key={student.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: i === 0 ? '#fbbf24' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c2e' : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: i < 3 ? 'white' : '#64748b' }}>
                                                    {i + 1}
                                                </span>
                                                <div style={{ fontWeight: 500, color: '#0f172a' }}>{student.name}</div>
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#22c55e' }}>{student.avgScore}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                    <div className="card" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Name</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Class</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Quizzes</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Avg Score</th>
                                    <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                                    <tr key={student.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                        <td style={{ padding: '14px 16px', fontWeight: 500, color: '#0f172a' }}>{student.name}</td>
                                        <td style={{ padding: '14px 16px' }}><span className="badge badge-primary">Class {student.class}</span></td>
                                        <td style={{ padding: '14px 16px', textAlign: 'center', color: '#475569' }}>{results.filter(r => r.studentId === student.id).length}</td>
                                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 600, color: student.avgScore >= 75 ? '#22c55e' : student.avgScore >= 50 ? '#f59e0b' : '#ef4444' }}>{student.avgScore}%</span>
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <button onClick={() => { setEditingStudent(student); setShowEditStudent(true); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#0ea5e9' }}><EditIcon size={16} /></button>
                                            <button onClick={() => handleDeleteStudent(student.id)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><TrashIcon size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'quizzes' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="card" style={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <h3 style={{ fontWeight: 600, color: '#0f172a' }}>{quiz.title}</h3>
                                    <span className="badge badge-primary">Class {quiz.class}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '0.875rem', color: '#64748b' }}>
                                    <span>{quiz.questions} Qs</span>
                                    <span>{quiz.difficulty}</span>
                                    <span>{getQuizResults(quiz.id).length} Attempts</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => handleEditQuiz(quiz)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                                        <EditIcon size={14} /> Edit
                                    </button>
                                    <button onClick={() => { setSelectedQuizResults(quiz.id); setActiveTab('results'); }} className="btn btn-sm" style={{ flex: 1, background: '#f0f9ff', color: '#0369a1', border: 'none' }}>
                                        Results
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div>
                        {/* Quiz Filter */}
                        <div style={{ marginBottom: '20px' }}>
                            <select
                                className="input"
                                style={{ maxWidth: '300px' }}
                                value={selectedQuizResults || ''}
                                onChange={(e) => setSelectedQuizResults(e.target.value ? parseInt(e.target.value) : null)}
                            >
                                <option value="">All Quizzes</option>
                                {quizzes.map(q => (
                                    <option key={q.id} value={q.id}>{q.title} (Class {q.class})</option>
                                ))}
                            </select>
                        </div>

                        <div className="card" style={{ overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc' }}>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Student</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Quiz</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Score</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Percentage</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Time</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '0.8125rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results
                                        .filter(r => !selectedQuizResults || r.quizId === selectedQuizResults)
                                        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                                        .map((result) => (
                                            <tr key={result.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '14px 16px', fontWeight: 500, color: '#0f172a' }}>{result.studentName}</td>
                                                <td style={{ padding: '14px 16px', color: '#475569' }}>{getQuizById(result.quizId)?.title}</td>
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
                                                        onClick={() => {
                                                            const detailedResult = sampleDetailedResults.find(dr => dr.studentId === result.studentId) || {
                                                                ...result,
                                                                quizTitle: getQuizById(result.quizId)?.title || 'Quiz',
                                                                answers: []
                                                            };
                                                            setSelectedResult(detailedResult as typeof sampleDetailedResults[0]);
                                                            setShowResultDetails(true);
                                                        }}
                                                        style={{
                                                            padding: '6px 12px',
                                                            background: '#f0f9ff',
                                                            color: '#0369a1',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontWeight: 500,
                                                            fontSize: '0.8125rem'
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {results.filter(r => !selectedQuizResults || r.quizId === selectedQuizResults).length === 0 && (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                                    No results found for this quiz.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Live Quiz Tab */}
                {activeTab === 'live' && (
                    <div style={{ maxWidth: '600px' }}>
                        {activeLiveQuiz ? (
                            /* Active Live Quiz */
                            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                    <span style={{ color: '#22c55e' }}><PlayIcon size={36} /></span>
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Live Quiz Active</h2>
                                <p style={{ color: '#64748b', marginBottom: '24px' }}>{activeLiveQuiz.title}</p>

                                <div style={{
                                    background: '#f0f9ff',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Join Code</div>
                                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0369a1', letterSpacing: '8px' }}>
                                        {activeLiveQuiz.liveCode}
                                    </div>
                                </div>

                                <div style={{
                                    background: '#f8fafc',
                                    padding: '20px',
                                    borderRadius: '8px',
                                    marginBottom: '24px'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>Time Remaining</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: liveTimeRemaining < 60 ? '#dc2626' : '#0f172a' }}>
                                        {formatTime(liveTimeRemaining)}
                                    </div>
                                </div>

                                <button
                                    onClick={handleStopLiveQuiz}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        background: '#dc2626',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <StopIcon size={18} />
                                    End Live Quiz
                                </button>
                            </div>
                        ) : (
                            /* Start New Live Quiz */
                            <div className="card" style={{ padding: '32px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Start a Live Quiz</h2>
                                <p style={{ color: '#64748b', marginBottom: '24px' }}>Students can join using a code and take the quiz in real-time.</p>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>Select Quiz</label>
                                    <select
                                        className="input"
                                        value={liveQuizSettings.quizId}
                                        onChange={(e) => setLiveQuizSettings({ ...liveQuizSettings, quizId: e.target.value })}
                                    >
                                        <option value="">Choose a quiz...</option>
                                        {quizzes.map(q => (
                                            <option key={q.id} value={q.id}>{q.title} (Class {q.class})</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>Duration (minutes)</label>
                                    <select
                                        className="input"
                                        value={liveQuizSettings.duration}
                                        onChange={(e) => setLiveQuizSettings({ ...liveQuizSettings, duration: e.target.value })}
                                    >
                                        <option value="5">5 minutes</option>
                                        <option value="10">10 minutes</option>
                                        <option value="15">15 minutes</option>
                                        <option value="20">20 minutes</option>
                                        <option value="30">30 minutes</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleStartLiveQuiz}
                                    disabled={!liveQuizSettings.quizId}
                                    className="btn btn-primary"
                                    style={{ width: '100%', opacity: liveQuizSettings.quizId ? 1 : 0.5 }}
                                >
                                    <PlayIcon size={18} />
                                    Start Live Quiz
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === 'notes' && (
                    <div>
                        {/* Filters and Add Button */}
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <select
                                className="input"
                                value={notesFilter.class}
                                onChange={(e) => setNotesFilter({ ...notesFilter, class: e.target.value })}
                                style={{ width: 'auto', minWidth: '140px' }}
                            >
                                <option value="all">All Classes</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                            </select>
                            <select
                                className="input"
                                value={notesFilter.subject}
                                onChange={(e) => setNotesFilter({ ...notesFilter, subject: e.target.value })}
                                style={{ width: 'auto', minWidth: '140px' }}
                            >
                                <option value="all">All Subjects</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="Biology">Biology</option>
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowAddNote(true)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <PlusIcon size={18} />
                                Add Note
                            </button>
                        </div>

                        {/* Notes Grid */}
                        {filteredNotes.length === 0 ? (
                            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                                <span style={{ color: '#0ea5e9', marginBottom: '12px', display: 'block' }}><BookOpenIcon size={48} /></span>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>No Notes Yet</h3>
                                <p style={{ color: '#64748b' }}>Create your first study note for students</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                                {filteredNotes.map(note => (
                                    <div key={note.id} className="card hover-lift" style={{ padding: '24px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <span className="badge" style={{
                                                    background: note.subject === 'Physics' ? '#dbeafe' : note.subject === 'Chemistry' ? '#fef3c7' : '#dcfce7',
                                                    color: note.subject === 'Physics' ? '#1d4ed8' : note.subject === 'Chemistry' ? '#b45309' : '#166534'
                                                }}>
                                                    {note.subject}
                                                </span>
                                                <span className="badge badge-primary">Class {note.class}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
                                            >
                                                <TrashIcon size={16} />
                                            </button>
                                        </div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>{note.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: '0.9375rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{note.content.length > 200 ? note.content.substring(0, 200) + '...' : note.content}</p>
                                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '12px' }}>
                                            {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Generate Quiz Tab */}
                {activeTab === 'generate' && (
                    <div style={{ maxWidth: '600px' }}>
                        {!generatedQuiz ? (
                            <div className="card" style={{ padding: '32px' }}>
                                {errorMessage && (
                                    <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '20px', color: '#dc2626', fontSize: '0.875rem' }}>
                                        {errorMessage}
                                    </div>
                                )}

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>Upload PDF</label>
                                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', borderRadius: '8px', border: uploadedFile ? '2px solid #22c55e' : '2px dashed #cbd5e1', background: uploadedFile ? '#f0fdf4' : '#f8fafc', cursor: 'pointer' }}>
                                        <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
                                        {uploadedFile ? (
                                            <>
                                                <span style={{ color: '#22c55e', marginBottom: '12px', display: 'block' }}><CheckCircleIcon size={40} /></span>
                                                <div style={{ fontWeight: 600, color: '#166534' }}>{uploadedFile.name}</div>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ color: '#94a3b8', marginBottom: '12px', display: 'block' }}><UploadIcon size={40} /></span>
                                                <div style={{ fontWeight: 600, color: '#374151' }}>Click to upload PDF</div>
                                            </>
                                        )}
                                    </label>
                                </div>

                                {uploadedFile && (
                                    <>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontWeight: 500, color: '#475569', marginBottom: '6px', fontSize: '0.875rem' }}>Quiz Title</label>
                                            <input type="text" className="input" value={pdfQuizSettings.title} onChange={(e) => setPdfQuizSettings({ ...pdfQuizSettings, title: e.target.value })} />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                                            <div>
                                                <label style={{ display: 'block', fontWeight: 500, color: '#475569', marginBottom: '6px', fontSize: '0.875rem' }}>Class</label>
                                                <select className="input" value={pdfQuizSettings.class} onChange={(e) => setPdfQuizSettings({ ...pdfQuizSettings, class: e.target.value })}>
                                                    <option value="8">Class 8</option>
                                                    <option value="9">Class 9</option>
                                                    <option value="10">Class 10</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontWeight: 500, color: '#475569', marginBottom: '6px', fontSize: '0.875rem' }}>Questions</label>
                                                <select className="input" value={pdfQuizSettings.numQuestions} onChange={(e) => setPdfQuizSettings({ ...pdfQuizSettings, numQuestions: e.target.value })}>
                                                    <option value="5">5</option>
                                                    <option value="10">10</option>
                                                    <option value="15">15</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontWeight: 500, color: '#475569', marginBottom: '6px', fontSize: '0.875rem' }}>Difficulty</label>
                                                <select className="input" value={pdfQuizSettings.difficulty} onChange={(e) => setPdfQuizSettings({ ...pdfQuizSettings, difficulty: e.target.value })}>
                                                    <option value="Easy">Easy</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Hard">Hard</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button onClick={handleGenerateQuiz} disabled={isGenerating} className="btn btn-primary" style={{ width: '100%' }}>
                                            {isGenerating ? <><ClockIcon size={18} /> Generating...</> : <><FlaskIcon size={18} /> Generate Quiz</>}
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="card" style={{ padding: '32px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>{generatedQuiz.title}</h2>
                                <p style={{ color: '#64748b', marginBottom: '20px' }}>Class {generatedQuiz.class} • {generatedQuiz.difficulty} • {generatedQuiz.questions} Questions</p>

                                {generatedQuiz.questionList?.slice(0, 3).map((q, i) => (
                                    <div key={i} style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginBottom: '12px' }}>
                                        <div style={{ fontWeight: 500, color: '#0f172a', marginBottom: '8px' }}>Q{i + 1}: {q.question}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#22c55e' }}>✓ {q.options[q.correctAnswer]}</div>
                                    </div>
                                ))}

                                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                    <button onClick={() => setGeneratedQuiz(null)} className="btn btn-secondary" style={{ flex: 1 }}>Start Over</button>
                                    <button onClick={handleSaveGeneratedQuiz} className="btn btn-primary" style={{ flex: 1 }}>Save Quiz</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="card" style={{ padding: '24px', maxWidth: '500px' }}>
                        <h3 style={{ fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Teacher Settings</h3>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>Change Password</label>
                            <input type="password" className="input" placeholder="New password" />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 500, color: '#374151', marginBottom: '6px', fontSize: '0.875rem' }}>Default Quiz Duration</label>
                            <select className="input">
                                <option>5 minutes</option>
                                <option>10 minutes</option>
                                <option>15 minutes</option>
                            </select>
                        </div>
                        <button className="btn btn-primary">Save Settings</button>
                    </div>
                )}
            </main>

            {/* Modals */}
            {showAddStudent && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add Student</h2>
                            <button onClick={() => setShowAddStudent(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XIcon size={20} /></button>
                        </div>
                        <form onSubmit={handleAddStudent}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Name *</label>
                                <input type="text" className="input" placeholder="Enter student name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Class *</label>
                                <select className="input" value={newStudent.class} onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}>
                                    <option value="8">Class 8</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Password *</label>
                                <input type="text" className="input" placeholder="Create a password for student" value={newStudent.password} onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} required />
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Share this password with the student for login</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowAddStudent(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Student</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showAddQuiz && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Add Quiz</h2>
                            <button onClick={() => setShowAddQuiz(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XIcon size={20} /></button>
                        </div>
                        <form onSubmit={handleAddQuiz}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Title</label>
                                <input type="text" className="input" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Class</label>
                                <select className="input" value={newQuiz.class} onChange={(e) => setNewQuiz({ ...newQuiz, class: e.target.value })}>
                                    <option value="8">Class 8</option>
                                    <option value="9">Class 9</option>
                                    <option value="10">Class 10</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Questions</label>
                                <select className="input" value={newQuiz.questions} onChange={(e) => setNewQuiz({ ...newQuiz, questions: e.target.value })}>
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowAddQuiz(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Note Modal */}
            {showAddNote && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card animate-scale-in" style={{ width: '100%', maxWidth: '500px', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.375rem', fontWeight: 600 }}>Add Study Note</h2>
                            <button onClick={() => setShowAddNote(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XIcon size={20} /></button>
                        </div>
                        <form onSubmit={handleAddNote}>
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9375rem' }}>Title *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="e.g., Newton's Laws of Motion"
                                    value={newNote.title}
                                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '18px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9375rem' }}>Class *</label>
                                    <select className="input" value={newNote.class} onChange={(e) => setNewNote({ ...newNote, class: e.target.value })}>
                                        <option value="8">Class 8</option>
                                        <option value="9">Class 9</option>
                                        <option value="10">Class 10</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9375rem' }}>Subject *</label>
                                    <select
                                        className="input"
                                        value={newNote.subject}
                                        onChange={(e) => setNewNote({ ...newNote, subject: e.target.value as 'Physics' | 'Chemistry' | 'Biology' })}
                                    >
                                        <option value="Physics">Physics</option>
                                        <option value="Chemistry">Chemistry</option>
                                        <option value="Biology">Biology</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '0.9375rem' }}>Content *</label>
                                <textarea
                                    className="input"
                                    placeholder="Write your study notes here..."
                                    value={newNote.content}
                                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                    required
                                    rows={8}
                                    style={{ resize: 'vertical', minHeight: '150px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowAddNote(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Note</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditQuiz && editingQuiz && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Edit Quiz</h2>
                            <button onClick={() => setShowEditQuiz(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><XIcon size={20} /></button>
                        </div>
                        <form onSubmit={handleSaveQuiz}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Title</label>
                                <input type="text" className="input" value={editingQuiz.title} onChange={(e) => setEditingQuiz({ ...editingQuiz, title: e.target.value })} required />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Class</label>
                                <select className="input" value={editingQuiz.class} onChange={(e) => setEditingQuiz({ ...editingQuiz, class: parseInt(e.target.value) })}>
                                    <option value={8}>Class 8</option>
                                    <option value={9}>Class 9</option>
                                    <option value={10}>Class 10</option>
                                </select>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px', fontSize: '0.875rem' }}>Difficulty</label>
                                <select className="input" value={editingQuiz.difficulty} onChange={(e) => setEditingQuiz({ ...editingQuiz, difficulty: e.target.value })}>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setShowEditQuiz(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View Result Details Modal */}
            {showResultDetails && selectedResult && (
                <ViewResultModal
                    result={selectedResult}
                    onClose={() => { setShowResultDetails(false); setSelectedResult(null); }}
                />
            )}

            {/* Edit Student Modal */}
            {showEditStudent && editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    onSave={(updatedStudent) => {
                        const updatedStudents = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
                        setStudents(updatedStudents);
                        localStorage.setItem('adminStudents', JSON.stringify(updatedStudents));

                        // Also update registeredStudents for login
                        const registeredStudents = updatedStudents.map(s => ({
                            id: s.id,
                            name: s.name,
                            class: s.class,
                            password: s.password || ''
                        }));
                        localStorage.setItem('registeredStudents', JSON.stringify(registeredStudents));
                    }}
                    onClose={() => { setShowEditStudent(false); setEditingStudent(null); }}
                />
            )}

            <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
