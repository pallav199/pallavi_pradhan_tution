'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon, FlaskIcon, BookOpenIcon, ClockIcon } from './Icons';

// Sparkle icon
const SparkleIcon = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
);

const HeroSection: React.FC = () => {
    return (
        <section style={{
            background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)',
            paddingTop: '140px',
            paddingBottom: '100px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background shapes */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 6s ease-in-out infinite',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '10%',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
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
                background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 7s ease-in-out infinite',
                pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px', position: 'relative' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    {/* Badge */}
                    <div
                        className="animate-fade-in"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 18px',
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
                            color: '#0369a1',
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            marginBottom: '28px',
                            boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)'
                        }}
                    >
                        <span style={{ color: '#0ea5e9' }}><SparkleIcon size={16} /></span>
                        Science Classes for CBSE Students
                    </div>

                    {/* Heading */}
                    <h1
                        className="animate-fade-in delay-100"
                        style={{
                            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
                            fontWeight: 800,
                            color: '#0f172a',
                            lineHeight: 1.15,
                            marginBottom: '24px'
                        }}
                    >
                        Welcome to{' '}
                        <span className="text-gradient">Pallavi Pradhan</span>
                        {' '}Science Tuition
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="animate-fade-in delay-200"
                        style={{
                            fontSize: '1.25rem',
                            color: '#475569',
                            lineHeight: 1.7,
                            marginBottom: '40px',
                            maxWidth: '650px',
                            margin: '0 auto 40px'
                        }}
                    >
                        Practice quizzes designed for Classes 8, 9, and 10 Science students.
                        Prepare for your exams with topic-wise questions aligned to your classroom lessons.
                    </p>

                    {/* CTA */}
                    <div
                        className="animate-fade-in delay-300"
                        style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <Link href="/login" className="btn btn-primary btn-lg animate-pulse-glow">
                            Student Login
                            <ArrowRightIcon size={18} />
                        </Link>
                    </div>

                    {/* Quick Info */}
                    <div
                        className="animate-fade-in delay-400"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '40px',
                            marginTop: '60px',
                            flexWrap: 'wrap'
                        }}
                    >
                        {[
                            { icon: BookOpenIcon, label: 'Classes 8, 9 & 10', color: '#0ea5e9' },
                            { icon: FlaskIcon, label: 'CBSE Science', color: '#8b5cf6' },
                            { icon: ClockIcon, label: 'Timed Quizzes', color: '#22c55e' }
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="hover-lift"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#475569',
                                    background: 'white',
                                    padding: '12px 20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <span style={{
                                    color: item.color,
                                    background: `${item.color}15`,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    display: 'flex'
                                }}>
                                    <item.icon size={20} />
                                </span>
                                <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
            `}</style>
        </section>
    );
};

export default HeroSection;
