'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FlaskIcon, ArrowRightIcon } from '../components/Icons';

interface RegisteredStudent {
    id: number;
    name: string;
    class: number;
    password: string;
}

export default function LoginPage() {
    const [name, setName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const storedStudents = localStorage.getItem('registeredStudents');
        const students: RegisteredStudent[] = storedStudents ? JSON.parse(storedStudents) : [];

        const student = students.find(
            s => s.name.toLowerCase() === name.toLowerCase() &&
                s.class === parseInt(studentClass) &&
                s.password === password
        );

        setTimeout(() => {
            if (student) {
                localStorage.setItem('loggedInStudent', JSON.stringify({
                    id: student.id,
                    name: student.name,
                    class: student.class
                }));
                window.location.href = '/quiz';
            } else {
                setError('Invalid credentials. Please check your name, class, and password.');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background shapes */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '15%',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse',
                pointerEvents: 'none'
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <Link
                    href="/"
                    className="animate-fade-in hover-lift"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        textDecoration: 'none',
                        marginBottom: '32px'
                    }}
                >
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 25px rgba(14, 165, 233, 0.3)'
                    }}>
                        <FlaskIcon className="text-white" size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                            Pallavi Pradhan
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                            Science Tuition
                        </div>
                    </div>
                </Link>

                {/* Login Card */}
                <div className="card animate-scale-in" style={{ padding: '36px' }}>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        textAlign: 'center',
                        marginBottom: '8px'
                    }}>
                        Student Login
                    </h1>
                    <p style={{
                        color: '#64748b',
                        textAlign: 'center',
                        marginBottom: '28px'
                    }}>
                        Enter your credentials provided by your teacher
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="animate-fade-in" style={{
                            padding: '14px',
                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1px solid #fecaca',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '8px', fontSize: '0.875rem' }}>
                                Name
                            </label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '8px', fontSize: '0.875rem' }}>
                                Class
                            </label>
                            <select
                                className="input"
                                value={studentClass}
                                onChange={(e) => setStudentClass(e.target.value)}
                                required
                            >
                                <option value="">Select your class</option>
                                <option value="8">Class 8</option>
                                <option value="9">Class 9</option>
                                <option value="10">Class 10</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '8px', fontSize: '0.875rem' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '14px', opacity: isLoading ? 0.7 : 1 }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Login
                                    <ArrowRightIcon size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: '24px',
                        fontSize: '0.8125rem',
                        color: '#94a3b8'
                    }}>
                        Don&apos;t have an account? Contact your teacher.
                    </p>
                </div>

                {/* Back to Home */}
                <p className="animate-fade-in delay-300" style={{ textAlign: 'center', marginTop: '28px' }}>
                    <Link
                        href="/"
                        style={{
                            color: '#64748b',
                            textDecoration: 'none',
                            fontSize: '0.9375rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'color 0.3s ease'
                        }}
                    >
                        ← Back to Home
                    </Link>
                </p>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
            `}</style>
        </div>
    );
}
