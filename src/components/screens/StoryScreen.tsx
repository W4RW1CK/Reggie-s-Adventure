'use client';

import { useState, useEffect, useRef } from 'react';

interface StoryScreenProps {
    onContinue: () => void;
}

const STORY_TEXT =
    'En un rincón olvidado del mundo digital, una señal se enciende... algo quiere despertar. Un fragmento de energía antigua espera a alguien que le dé forma. Ese alguien... eres tú.';

const CHAR_DELAY_MS = 50;

export default function StoryScreen({ onContinue }: StoryScreenProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const charIndexRef = useRef(0);

    // Typewriter effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (charIndexRef.current < STORY_TEXT.length) {
                charIndexRef.current += 1;
                setDisplayedText(STORY_TEXT.slice(0, charIndexRef.current));
            } else {
                setIsComplete(true);
                clearInterval(interval);
            }
        }, CHAR_DELAY_MS);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="story-screen">
            {/* Scanline overlay */}
            <div className="story-screen__scanlines" />

            {/* Ambient particles */}
            <div className="story-screen__particles">
                <span className="story-screen__particle story-screen__particle--1" />
                <span className="story-screen__particle story-screen__particle--2" />
                <span className="story-screen__particle story-screen__particle--3" />
                <span className="story-screen__particle story-screen__particle--4" />
                <span className="story-screen__particle story-screen__particle--5" />
                <span className="story-screen__particle story-screen__particle--6" />
            </div>

            {/* Main content */}
            <div className="story-screen__content">
                {/* NES-style dialog box */}
                <div className="story-screen__dialog">
                    {/* Dialog border (NES double-border effect) */}
                    <div className="story-screen__dialog-inner">
                        <p className="story-screen__text">
                            {displayedText}
                            {!isComplete && <span className="story-screen__cursor">▌</span>}
                        </p>
                    </div>
                </div>

                {/* Continue button — only visible after text is done */}
                <div className={`story-screen__continue-wrapper ${isComplete ? 'story-screen__continue-wrapper--visible' : ''}`}>
                    <button
                        className="story-screen__continue-btn"
                        onClick={onContinue}
                        disabled={!isComplete}
                    >
                        Continuar ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
