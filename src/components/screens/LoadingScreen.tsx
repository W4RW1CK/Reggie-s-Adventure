'use client';

import { useState, useEffect } from 'react';

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [fadeOut, setFadeOut] = useState(false);
    const [dotsCount, setDotsCount] = useState(0);

    // Animate the loading dots
    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDotsCount((prev) => (prev + 1) % 4);
        }, 400);
        return () => clearInterval(dotsInterval);
    }, []);

    // 3-second timer → fade out → transition
    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2500); // Start fade at 2.5s

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3000); // Complete at 3s

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    const dots = '.'.repeat(dotsCount);

    return (
        <div
            className={`loading-screen ${fadeOut ? 'loading-screen--fade-out' : ''}`}
        >
            {/* Scanline overlay for CRT effect */}
            <div className="loading-screen__scanlines" />

            {/* Main content */}
            <div className="loading-screen__content">
                {/* Decorative top stars */}
                <div className="loading-screen__stars">
                    <span className="loading-screen__star loading-screen__star--1">✦</span>
                    <span className="loading-screen__star loading-screen__star--2">✦</span>
                    <span className="loading-screen__star loading-screen__star--3">✦</span>
                </div>

                {/* Logo / Title */}
                <div className="loading-screen__logo">
                    <div className="loading-screen__logo-top">REGGIE&apos;S</div>
                    <div className="loading-screen__logo-bottom">ADVENTURE</div>
                </div>

                {/* Decorative pixel divider */}
                <div className="loading-screen__divider">
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel loading-screen__pixel--accent" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                </div>

                {/* Loading text */}
                <div className="loading-screen__loading-text">
                    LOADING{dots}
                </div>

                {/* NES-style progress bar */}
                <div className="loading-screen__progress-container">
                    <div className="loading-screen__progress-bar" />
                </div>

                {/* Version tag */}
                <div className="loading-screen__version">
                    v0.1 — El Despertar
                </div>
            </div>
        </div>
    );
}
