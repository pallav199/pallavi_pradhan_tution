'use client';

import React from 'react';
import Link from 'next/link';
import { FlaskIcon } from './Icons';

// Heart icon for credits
const HeartIcon = ({ size = 16 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            color: 'white',
            padding: '48px 0 24px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 30%, rgba(14, 165, 233, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', position: 'relative' }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    {/* Logo */}
                    <Link
                        href="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            textDecoration: 'none',
                            marginBottom: '16px'
                        }}
                        className="hover-lift"
                    >
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 20px rgba(14, 165, 233, 0.4)'
                        }}>
                            <FlaskIcon className="text-white" size={24} />
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>
                            Pallavi Pradhan Science Tuition
                        </div>
                    </Link>

                    <p style={{
                        color: '#94a3b8',
                        fontSize: '0.9375rem',
                        maxWidth: '450px',
                        marginBottom: '28px',
                        lineHeight: 1.7
                    }}>
                        Helping CBSE students in Classes 8, 9, and 10 excel in Science through focused practice and guided learning.
                    </p>

                    {/* Links */}
                    <div style={{
                        display: 'flex',
                        gap: '32px',
                        marginBottom: '32px',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {[
                            { href: '/', label: 'Home' },
                            { href: '/login', label: 'Student Login' },
                            { href: '/live-quiz', label: 'Join Live Quiz' },
                            { href: '/teacher-login', label: 'Teacher Portal' }
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    color: '#94a3b8',
                                    fontSize: '0.875rem',
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    padding: '8px 16px',
                                    borderRadius: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#0ea5e9';
                                    e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#94a3b8';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{
                        width: '100%',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent)',
                        marginBottom: '24px'
                    }} />

                    {/* Copyright & Credits */}
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '12px' }}>
                            © {currentYear} Pallavi Pradhan Science Tuition. All rights reserved.
                        </p>
                        <p style={{
                            color: '#64748b',
                            fontSize: '0.8125rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}>
                            Made with <span style={{ color: '#ef4444', animation: 'pulse 1.5s ease-in-out infinite' }}><HeartIcon size={14} /></span> by{' '}
                            <span style={{
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                Pallav Pradhan
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                }
            `}</style>
        </footer>
    );
};

export default Footer;
