'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from './Icons';

const ClassesSection: React.FC = () => {
    const classes = [
        {
            classNumber: 8,
            topics: ['Crop Production', 'Microorganisms', 'Metals & Non-metals', 'Coal & Petroleum', 'Cell Structure'],
        },
        {
            classNumber: 9,
            topics: ['Matter in Our Surroundings', 'Atoms & Molecules', 'Motion', 'Force & Laws of Motion', 'Tissues'],
        },
        {
            classNumber: 10,
            topics: ['Chemical Reactions', 'Acids & Bases', 'Metals & Non-metals', 'Life Processes', 'Heredity'],
        },
    ];

    return (
        <section style={{ padding: '80px 0', background: 'white' }}>
            <div className="container">
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                        fontWeight: 700,
                        color: '#0f172a',
                        marginBottom: '12px'
                    }}>
                        Select Your Class
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#64748b', maxWidth: '500px', margin: '0 auto' }}>
                        Choose your class to access topic-wise practice quizzes for Science
                    </p>
                </div>

                {/* Class Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '24px',
                    maxWidth: '960px',
                    margin: '0 auto'
                }}>
                    {classes.map((cls) => (
                        <div key={cls.classNumber} className="card" style={{ padding: '28px' }}>
                            {/* Class Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '20px'
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 700,
                                        color: '#0f172a'
                                    }}>
                                        Class {cls.classNumber}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        CBSE Science
                                    </div>
                                </div>
                                <span className="badge badge-primary">
                                    {cls.topics.length} Topics
                                </span>
                            </div>

                            {/* Topics Preview */}
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '12px'
                                }}>
                                    Sample Topics
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {cls.topics.slice(0, 4).map((topic, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: '0.9375rem',
                                                color: '#475569',
                                                padding: '6px 0',
                                                borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none'
                                            }}
                                        >
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/quiz?class=${cls.classNumber}`}
                                className="btn btn-primary"
                                style={{ width: '100%' }}
                            >
                                Start Quiz
                                <ArrowRightIcon size={16} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClassesSection;
