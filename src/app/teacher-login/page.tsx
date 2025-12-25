'use client';

import React, { useState } from 'react';
import { FlaskIcon, ArrowRightIcon } from '../components/Icons';

// Shield icon for teacher portal
const ShieldIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export default function TeacherLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const TEACHER_PASSWORD = 'pallavi123';

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            if (password === TEACHER_PASSWORD) {
                localStorage.setItem('teacherAuth', 'true');
                localStorage.setItem('teacherAuthTime', Date.now().toString());
                window.location.href = '/admin';
            } else {
                setError('Incorrect password. Please try again.');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
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
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '250px',
                height: '250px',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 8s ease-in-out infinite reverse',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                top: '50%',
                right: '5%',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 7s ease-in-out infinite',
                pointerEvents: 'none'
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div
                    className="animate-fade-in"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '36px'
                    }}
                >
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 30px rgba(139, 92, 246, 0.4)'
                    }}>
                        <ShieldIcon size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.375rem', fontWeight: 700, color: 'white' }}>
                            Teacher Portal
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>
                            Pallavi Pradhan Science Tuition
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <div
                    className="animate-scale-in"
                    style={{
                        padding: '40px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
                    }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                            marginBottom: '16px',
                            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                        }}>
                            <FlaskIcon className="text-white" size={28} />
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        textAlign: 'center',
                        marginBottom: '8px'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        color: '#64748b',
                        textAlign: 'center',
                        marginBottom: '28px'
                    }}>
                        Enter your password to access the dashboard
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="animate-fade-in" style={{
                            padding: '14px',
                            background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1px solid #fecaca',
                            borderRadius: '12px',
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
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', fontWeight: 600, color: '#374151', marginBottom: '10px', fontSize: '0.9375rem' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                className="input"
                                placeholder="Enter teacher password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ padding: '14px 16px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                                color: 'white',
                                boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                                opacity: isLoading ? 0.7 : 1
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'white' }} />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRightIcon size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Back Link */}
                <p className="animate-fade-in delay-300" style={{ textAlign: 'center', marginTop: '28px' }}>
                    <a href="/" style={{
                        color: 'rgba(255,255,255,0.7)',
                        textDecoration: 'none',
                        fontSize: '0.9375rem',
                        transition: 'color 0.3s ease'
                    }}>
                        ← Back to Home
                    </a>
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
