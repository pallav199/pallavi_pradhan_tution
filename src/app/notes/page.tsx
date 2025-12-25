'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlaskIcon, BookOpenIcon, ClockIcon, ArrowRightIcon } from '../components/Icons';

interface Note {
    id: number;
    title: string;
    content: string;
    class: number;
    subject: 'Physics' | 'Chemistry' | 'Biology';
    createdAt: string;
}

interface LoggedInStudent {
    id: number;
    name: string;
    class: number;
}

export default function NotesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [loggedInStudent, setLoggedInStudent] = useState<LoggedInStudent | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    useEffect(() => {
        const studentData = localStorage.getItem('loggedInStudent');
        if (studentData) {
            const student = JSON.parse(studentData);
            setLoggedInStudent(student);

            // Load notes for this class
            const storedNotes = localStorage.getItem('teacherNotes');
            if (storedNotes) {
                const allNotes: Note[] = JSON.parse(storedNotes);
                setNotes(allNotes.filter(n => n.class === student.class));
            }
            setIsLoading(false);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('loggedInStudent');
        window.location.href = '/login';
    };

    const filteredNotes = selectedSubject === 'all'
        ? notes
        : notes.filter(n => n.subject === selectedSubject);

    const getSubjectColor = (subject: string) => {
        switch (subject) {
            case 'Physics': return { bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', text: '#1d4ed8', icon: '⚛️' };
            case 'Chemistry': return { bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', text: '#b45309', icon: '⚗️' };
            case 'Biology': return { bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', text: '#166534', icon: '🧬' };
            default: return { bg: '#f1f5f9', text: '#475569', icon: '📚' };
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)' }}>
                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: '#0ea5e9', marginBottom: '12px', display: 'block' }}><ClockIcon size={40} /></span>
                    <p style={{ color: '#64748b' }}>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)' }}>
            {/* Header */}
            <header style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '16px 0',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)'
                        }}>
                            <FlaskIcon className="text-white" size={24} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#0f172a' }}>Pallavi Pradhan Tuition</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link href="/quiz" className="btn btn-secondary btn-sm">
                            Practice Quiz
                        </Link>
                        <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            <strong style={{ color: '#0f172a' }}>{loggedInStudent?.name}</strong>
                        </span>
                        <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '40px 1rem' }}>
                {/* Page Title */}
                <div className="animate-fade-in" style={{ marginBottom: '32px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        📚 Study Notes
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.0625rem' }}>
                        Class {loggedInStudent?.class} • {notes.length} note{notes.length !== 1 ? 's' : ''} available
                    </p>
                </div>

                {/* Subject Filters */}
                <div className="animate-fade-in delay-100" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '32px', flexWrap: 'wrap' }}>
                    {['all', 'Physics', 'Chemistry', 'Biology'].map(subject => (
                        <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className="hover-lift"
                            style={{
                                padding: '12px 24px',
                                borderRadius: '50px',
                                border: selectedSubject === subject ? '2px solid #0ea5e9' : '2px solid transparent',
                                background: selectedSubject === subject
                                    ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
                                    : 'white',
                                color: selectedSubject === subject ? 'white' : '#475569',
                                fontWeight: 600,
                                fontSize: '0.9375rem',
                                cursor: 'pointer',
                                boxShadow: selectedSubject === subject
                                    ? '0 4px 15px rgba(14, 165, 233, 0.3)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {subject === 'all' ? '📖 All Subjects' : `${getSubjectColor(subject).icon} ${subject}`}
                        </button>
                    ))}
                </div>

                {/* Notes Grid */}
                {filteredNotes.length === 0 ? (
                    <div className="card animate-scale-in" style={{ padding: '60px', textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
                        <span style={{ fontSize: '4rem', marginBottom: '16px', display: 'block' }}>📭</span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>No Notes Available</h3>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>
                            Your teacher hasn&apos;t added any {selectedSubject !== 'all' ? selectedSubject : ''} notes for Class {loggedInStudent?.class} yet.
                        </p>
                        <Link href="/quiz" className="btn btn-primary">
                            Practice Quiz Instead
                            <ArrowRightIcon size={16} />
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                        {filteredNotes.map((note, index) => {
                            const colors = getSubjectColor(note.subject);
                            return (
                                <div
                                    key={note.id}
                                    className="card hover-lift animate-fade-in"
                                    style={{
                                        padding: '28px',
                                        cursor: 'pointer',
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                    onClick={() => setSelectedNote(note)}
                                >
                                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                                        <span style={{
                                            padding: '6px 14px',
                                            borderRadius: '50px',
                                            background: colors.bg,
                                            color: colors.text,
                                            fontSize: '0.8125rem',
                                            fontWeight: 600
                                        }}>
                                            {colors.icon} {note.subject}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '12px' }}>
                                        {note.title}
                                    </h3>
                                    <p style={{
                                        color: '#64748b',
                                        fontSize: '0.9375rem',
                                        lineHeight: 1.7,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {note.content}
                                    </p>
                                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                            {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <span style={{ color: '#0ea5e9', fontSize: '0.875rem', fontWeight: 500 }}>
                                            Read more →
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Note Detail Modal */}
            {selectedNote && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        padding: '24px'
                    }}
                    onClick={() => setSelectedNote(null)}
                >
                    <div
                        className="card animate-scale-in"
                        style={{
                            width: '100%',
                            maxWidth: '700px',
                            maxHeight: '85vh',
                            overflowY: 'auto',
                            padding: '36px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ marginBottom: '24px' }}>
                            <span style={{
                                padding: '8px 16px',
                                borderRadius: '50px',
                                background: getSubjectColor(selectedNote.subject).bg,
                                color: getSubjectColor(selectedNote.subject).text,
                                fontSize: '0.875rem',
                                fontWeight: 600
                            }}>
                                {getSubjectColor(selectedNote.subject).icon} {selectedNote.subject} • Class {selectedNote.class}
                            </span>
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
                            {selectedNote.title}
                        </h2>
                        <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '24px' }}>
                            Added on {new Date(selectedNote.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        <div style={{
                            color: '#374151',
                            fontSize: '1.0625rem',
                            lineHeight: 1.8,
                            whiteSpace: 'pre-wrap',
                            paddingBottom: '24px',
                            borderBottom: '1px solid #e2e8f0'
                        }}>
                            {selectedNote.content}
                        </div>
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: '24px' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
