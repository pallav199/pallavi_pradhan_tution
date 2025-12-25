'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FlaskIcon, MenuIcon, XIcon } from './Icons';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/login', label: 'Student Login' },
    ];

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                background: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: isScrolled ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'
            }}
        >
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '72px'
            }}>
                {/* Logo */}
                <Link
                    href="/"
                    className="hover-lift"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textDecoration: 'none'
                    }}
                >
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                        transition: 'transform 0.3s ease'
                    }}>
                        <FlaskIcon className="text-white" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                            Pallavi Pradhan
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '-2px' }}>
                            Science Tuition
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                fontSize: '0.9375rem',
                                fontWeight: 500,
                                color: '#475569',
                                textDecoration: 'none',
                                padding: '10px 18px',
                                borderRadius: '10px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
                                e.currentTarget.style.color = '#0ea5e9';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#475569';
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/teacher-login"
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: '8px' }}
                    >
                        Teacher Portal
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden"
                    style={{
                        padding: '10px',
                        color: '#475569',
                        background: isMobileMenuOpen ? 'rgba(14, 165, 233, 0.1)' : 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '10px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden animate-fade-in"
                    style={{
                        background: 'white',
                        borderTop: '1px solid #e2e8f0',
                        padding: '16px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`animate-fade-in delay-${(index + 1) * 100}`}
                            style={{
                                display: 'block',
                                padding: '14px 16px',
                                fontSize: '1rem',
                                fontWeight: 500,
                                color: '#475569',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                marginBottom: '4px',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/teacher-login"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '8px' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Teacher Portal
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
