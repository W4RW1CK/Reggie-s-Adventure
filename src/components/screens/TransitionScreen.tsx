'use client';

import { useEffect, useState } from 'react';

interface TransitionScreenProps {
    onComplete: () => void;
}

export default function TransitionScreen({ onComplete }: TransitionScreenProps) {
    const [dots, setDots] = useState('');
    const [fadeOut, setFadeOut] = useState(false);

    // Animate dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Timeline: 2.5s wait -> fade out -> 3.0s complete
    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 2500);

        const completeTimer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    return (
        <div className={`transition-screen ${fadeOut ? 'transition-screen--fade-out' : ''}`}>
            {/* Scanlines */}
            <div className="transition-screen__scanlines" />

            <div className="transition-screen__content">
                <div className="transition-screen__icon">
                    ⚡ 🔥 ❄️
                </div>
                <h2 className="transition-screen__text">
                    La Conexión se sella{dots}
                </h2>
            </div>
        </div>
    );
}
