'use client';

import { useState, useEffect } from 'react';
import { useAssetPreloader } from '@/hooks/useAssetPreloader';
import { useFullscreen } from '@/hooks/useFullscreen';

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const [fadeOut, setFadeOut] = useState(false);
    const [dotsCount, setDotsCount] = useState(0);
    const [showFullscreenInvite, setShowFullscreenInvite] = useState(false);

    const { progress, loaded } = useAssetPreloader();
    const { isSupported, requestFullscreen } = useFullscreen();

    // Animate loading dots
    useEffect(() => {
        const interval = setInterval(() => {
            setDotsCount((prev) => (prev + 1) % 4);
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const [barComplete, setBarComplete] = useState(false);

    // When assets are loaded, force bar to 100%, hold 0.8s, THEN show fullscreen invite
    useEffect(() => {
        if (loaded) {
            // Let the bar visually reach 100%
            setBarComplete(true);
            const timer = setTimeout(() => {
                setShowFullscreenInvite(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [loaded]);

    const handleFullscreen = async () => {
        await requestFullscreen();
        proceed();
    };

    const handleSkipFullscreen = () => {
        proceed();
    };

    const proceed = () => {
        setFadeOut(true);
        setTimeout(() => {
            onComplete();
        }, 500);
    };

    // If fullscreen not supported, auto-proceed after assets load
    useEffect(() => {
        if (loaded && !isSupported) {
            const timer = setTimeout(() => proceed(), 800);
            return () => clearTimeout(timer);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaded, isSupported]);

    const dots = '.'.repeat(dotsCount);

    return (
        <div className={`loading-screen ${fadeOut ? 'loading-screen--fade-out' : ''}`}>
            <div className="loading-screen__scanlines" />

            <div className="loading-screen__content">
                {/* Stars */}
                <div className="loading-screen__stars">
                    <span className="loading-screen__star loading-screen__star--1">✦</span>
                    <span className="loading-screen__star loading-screen__star--2">✦</span>
                    <span className="loading-screen__star loading-screen__star--3">✦</span>
                </div>

                {/* Logo */}
                <div className="loading-screen__logo">
                    <div className="loading-screen__logo-top">REGGIE&apos;S</div>
                    <div className="loading-screen__logo-bottom">ADVENTURE</div>
                </div>

                {/* Divider */}
                <div className="loading-screen__divider">
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel loading-screen__pixel--accent" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                    <span className="loading-screen__pixel" />
                </div>

                {/* Loading state vs Fullscreen invitation */}
                {!showFullscreenInvite ? (
                    <>
                        <div className="loading-screen__loading-text">
                            LOADING{dots}
                        </div>
                        <div className="loading-screen__progress-container">
                            <div
                                className="loading-screen__progress-bar loading-screen__progress-bar--real"
                                style={{ width: `${barComplete ? 100 : progress}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <div className="loading-screen__fullscreen-invite">
                        <div className="loading-screen__ready-text">
                            Todo listo.
                        </div>
                        <div className="loading-screen__invite-text">
                            Para la mejor experiencia:
                        </div>
                        <div className="loading-screen__invite-buttons">
                            {isSupported && (
                                <button
                                    className="loading-screen__fs-btn loading-screen__fs-btn--primary"
                                    onClick={handleFullscreen}
                                >
                                    🖥️ Pantalla completa
                                </button>
                            )}
                            <button
                                className="loading-screen__fs-btn loading-screen__fs-btn--secondary"
                                onClick={handleSkipFullscreen}
                            >
                                Continuar así
                            </button>
                        </div>
                    </div>
                )}

                {/* Version */}
                <div className="loading-screen__version">
                    v0.4 — La Evolución
                </div>
            </div>
        </div>
    );
}
