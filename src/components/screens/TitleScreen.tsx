'use client';

import { useEffect, useCallback } from 'react';

interface TitleScreenProps {
    onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {

    // Capture keyboard input (Enter or Space)
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onStart();
        }
    }, [onStart]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="title-screen" onClick={onStart}>
            {/* Scanline overlay */}
            <div className="title-screen__scanlines" />

            {/* Decorative background Regenmon silhouettes */}
            <div className="title-screen__bg-creatures">
                <div className="title-screen__creature title-screen__creature--rayo">
                    <svg viewBox="0 0 80 80" fill="currentColor" opacity="0.08">
                        <ellipse cx="40" cy="45" rx="28" ry="24" />
                        <ellipse cx="40" cy="20" rx="20" ry="18" />
                        <circle cx="30" cy="17" r="5" />
                        <circle cx="50" cy="17" r="5" />
                        <polygon points="60,15 75,5 65,20" />
                        <polygon points="20,15 5,5 15,20" />
                    </svg>
                </div>
                <div className="title-screen__creature title-screen__creature--flama">
                    <svg viewBox="0 0 80 80" fill="currentColor" opacity="0.06">
                        <ellipse cx="40" cy="50" rx="25" ry="22" />
                        <ellipse cx="40" cy="28" rx="22" ry="20" />
                        <circle cx="32" cy="25" r="4" />
                        <circle cx="48" cy="25" r="4" />
                        <path d="M30,10 Q35,0 40,10 Q45,0 50,10" />
                    </svg>
                </div>
                <div className="title-screen__creature title-screen__creature--hielo">
                    <svg viewBox="0 0 80 80" fill="currentColor" opacity="0.07">
                        <ellipse cx="40" cy="48" rx="26" ry="24" />
                        <ellipse cx="40" cy="25" rx="20" ry="18" />
                        <circle cx="33" cy="22" r="4" />
                        <circle cx="47" cy="22" r="4" />
                        <polygon points="40,5 35,15 45,15" />
                    </svg>
                </div>
            </div>

            {/* Main content */}
            <div className="title-screen__content">
                {/* Decorative stars */}
                <div className="title-screen__stars-top">
                    <span className="title-screen__sparkle title-screen__sparkle--1">✦</span>
                    <span className="title-screen__sparkle title-screen__sparkle--2">✧</span>
                    <span className="title-screen__sparkle title-screen__sparkle--3">✦</span>
                    <span className="title-screen__sparkle title-screen__sparkle--4">✧</span>
                    <span className="title-screen__sparkle title-screen__sparkle--5">✦</span>
                </div>

                {/* Title */}
                <div className="title-screen__title">
                    <div className="title-screen__title-main">REGGIE&apos;S</div>
                    <div className="title-screen__title-sub">ADVENTURE</div>
                </div>

                {/* Decorative divider */}
                <div className="title-screen__divider">
                    <span className="title-screen__div-line" />
                    <span className="title-screen__div-diamond">◆</span>
                    <span className="title-screen__div-line" />
                </div>

                {/* Version */}
                <div className="title-screen__version">v0.1 — El Despertar</div>

                {/* Press Start - blinking */}
                <div className="title-screen__press-start">
                    PRESS START
                </div>

                {/* Hint */}
                <div className="title-screen__hint">
                    clic · tap · Enter · Space
                </div>
            </div>

            {/* Bottom copyright-style text */}
            <div className="title-screen__footer">
                © 2026 REGGIE&apos;S ADVENTURE
            </div>
        </div>
    );
}
