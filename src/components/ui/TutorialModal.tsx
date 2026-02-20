'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

interface TutorialModalProps {
    onDismiss: (dontShowAgain: boolean) => void;
}

interface TutorialStep {
    id: string;
    title: string;
    description: string;
    targetSelector: string;
    badge?: string;
}

const NEW_PLAYER_STEPS: TutorialStep[] = [
    {
        id: 'sprite',
        title: 'Este es tu Regenmon',
        description: 'Un fragmento del mundo digital antiguo. Cuídalo y juntos regenerarán el mundo.',
        targetSelector: '.game-screen__regenmon-wrapper',
    },
    {
        id: 'chat',
        title: 'Habla con él',
        description: 'Escribe en el chat para establecer un vínculo. Cada palabra cuenta.',
        targetSelector: '.chat-input-bar, .chat-input-bar__input',
    },
    {
        id: 'purify',
        title: 'Cuídalo',
        description: 'Purifica con fragmentos para restaurar su energía vital.',
        targetSelector: '.sprite-stats-fixed__purify-btns, .purify-btn',
    },
    {
        id: 'photo',
        title: '📸 Comparte memorias',
        description: 'Toma fotos del mundo real y compártelas. Tu Regenmon las sentirá.',
        targetSelector: '.chat-input-bar__clip, .hud-bottom-nav__btn[aria-label="Foto"]',
        badge: '✨ Nuevo',
    },
    {
        id: 'evolution',
        title: 'Evoluciona',
        description: 'Cada interacción suma progreso. Cierra fracturas y evoluciona juntos.',
        targetSelector: '.fracture-overlay, .hud-compact__fragments',
        badge: '✨ Nuevo',
    },
];

const RETURNING_PLAYER_STEPS: TutorialStep[] = [
    {
        id: 'photo',
        title: '📸 Comparte memorias',
        description: '¡Nuevo! Toma fotos del mundo real y compártelas con tu Regenmon.',
        targetSelector: '.chat-input-bar__clip, .hud-bottom-nav__btn[aria-label="Foto"]',
        badge: '✨ Nuevo',
    },
    {
        id: 'evolution',
        title: 'Evoluciona',
        description: '¡Nuevo! Cada interacción suma progreso. Cierra fracturas y observa cómo evoluciona.',
        targetSelector: '.fracture-overlay, .hud-compact__fragments',
        badge: '✨ Nuevo',
    },
];

function isReturningPlayer(): boolean {
    if (typeof window === 'undefined') return false;
    // Check if there's existing regenmon data (S3 player)
    const data = localStorage.getItem(STORAGE_KEYS.DATA);
    if (!data) return false;
    try {
        const parsed = JSON.parse(data);
        // If they have chat history or memories, they're returning
        return !!(parsed.memories?.length > 0 || parsed.evolution?.totalMemories > 0);
    } catch {
        return false;
    }
}

function getSpotlightRect(selector: string): DOMRect | null {
    // Try each selector separated by comma
    const selectors = selector.split(',').map(s => s.trim());
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) {
            return el.getBoundingClientRect();
        }
    }
    return null;
}

export default function TutorialModal({ onDismiss }: TutorialModalProps) {
    const [step, setStep] = useState(0);
    const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
    const [isExiting, setIsExiting] = useState(false);
    const steps = useRef<TutorialStep[]>([]);

    // Determine steps on mount
    useEffect(() => {
        const completed = localStorage.getItem(STORAGE_KEYS.TUTORIAL_COMPLETED);
        if (completed) {
            // Tutorial was already completed, this is a restart from settings
            // Show full tutorial
            steps.current = NEW_PLAYER_STEPS;
        } else if (isReturningPlayer()) {
            steps.current = RETURNING_PLAYER_STEPS;
        } else {
            steps.current = NEW_PLAYER_STEPS;
        }
    }, []);

    const currentSteps = steps.current.length > 0 ? steps.current : NEW_PLAYER_STEPS;
    const currentStep = currentSteps[step];
    const totalSteps = currentSteps.length;

    // Update spotlight position
    useEffect(() => {
        if (!currentStep) return;
        const updateRect = () => {
            const rect = getSpotlightRect(currentStep.targetSelector);
            setSpotlightRect(rect);
        };
        updateRect();
        // Re-measure on resize
        window.addEventListener('resize', updateRect);
        const interval = setInterval(updateRect, 500); // Catch layout shifts
        return () => {
            window.removeEventListener('resize', updateRect);
            clearInterval(interval);
        };
    }, [step, currentStep]);

    const handleNext = useCallback(() => {
        if (step < totalSteps - 1) {
            setStep(s => s + 1);
        } else {
            handleFinish();
        }
    }, [step, totalSteps]);

    const handleFinish = useCallback(() => {
        setIsExiting(true);
        localStorage.setItem(STORAGE_KEYS.TUTORIAL_COMPLETED, 'true');
        setTimeout(() => {
            onDismiss(true);
        }, 300);
    }, [onDismiss]);

    const handleSkip = useCallback(() => {
        handleFinish();
    }, [handleFinish]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
                e.preventDefault();
                handleNext();
            } else if (e.key === 'Escape') {
                handleSkip();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleNext, handleSkip]);

    if (!currentStep) return null;

    const padding = 12;
    const hasSpotlight = spotlightRect !== null;
    const tooltipWidth = 280;
    const tooltipHeight = 180;
    const arrowSize = 10;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 768;

    // Calculate tooltip position relative to spotlight
    let tooltipTop: number;
    let tooltipLeft: number;
    let arrowDirection: 'up' | 'down' | 'none' = 'none';

    if (hasSpotlight) {
        const spotCenter = spotlightRect!.left + spotlightRect!.width / 2;
        // Horizontal: center on target, clamped to viewport
        tooltipLeft = Math.max(12, Math.min(vw - tooltipWidth - 12, spotCenter - tooltipWidth / 2));

        // Vertical: prefer below, go above if not enough space
        const spaceBelow = vh - (spotlightRect!.bottom + padding);
        if (spaceBelow >= tooltipHeight + arrowSize + 8) {
            tooltipTop = spotlightRect!.bottom + padding + arrowSize;
            arrowDirection = 'up';
        } else {
            tooltipTop = Math.max(8, spotlightRect!.top - padding - arrowSize - tooltipHeight);
            arrowDirection = 'down';
        }
    } else {
        tooltipTop = vh * 0.35;
        tooltipLeft = (vw - tooltipWidth) / 2;
    }

    // Arrow horizontal position (points to center of spotlight)
    const arrowLeft = hasSpotlight
        ? Math.max(20, Math.min(tooltipWidth - 20, (spotlightRect!.left + spotlightRect!.width / 2) - tooltipLeft))
        : tooltipWidth / 2;

    return (
        <div
            className={`tutorial-overlay ${isExiting ? 'tutorial-overlay--exiting' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Tutorial"
        >
            {/* Semi-transparent backdrop with spotlight cutout */}
            <svg className="tutorial-overlay__backdrop" width="100%" height="100%">
                <defs>
                    <mask id="tutorial-spotlight-mask">
                        <rect width="100%" height="100%" fill="white" />
                        {hasSpotlight && (
                            <rect
                                x={spotlightRect!.left - padding}
                                y={spotlightRect!.top - padding}
                                width={spotlightRect!.width + padding * 2}
                                height={spotlightRect!.height + padding * 2}
                                rx="12"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.75)"
                    mask="url(#tutorial-spotlight-mask)"
                />
            </svg>

            {/* Spotlight border glow */}
            {hasSpotlight && (
                <div
                    className="tutorial-spotlight-ring"
                    style={{
                        left: spotlightRect!.left - padding,
                        top: spotlightRect!.top - padding,
                        width: spotlightRect!.width + padding * 2,
                        height: spotlightRect!.height + padding * 2,
                    }}
                />
            )}

            {/* Tooltip card */}
            <div
                className="tutorial-tooltip"
                style={{
                    top: tooltipTop,
                    left: tooltipLeft,
                    transform: 'none',
                    maxWidth: tooltipWidth,
                }}
            >
                {/* Arrow pointing to target */}
                {arrowDirection === 'up' && (
                    <div
                        className="tutorial-tooltip__arrow tutorial-tooltip__arrow--up"
                        style={{ left: arrowLeft }}
                    />
                )}
                {arrowDirection === 'down' && (
                    <div
                        className="tutorial-tooltip__arrow tutorial-tooltip__arrow--down"
                        style={{ left: arrowLeft }}
                    />
                )}
                {currentStep.badge && (
                    <span className="tutorial-tooltip__badge">{currentStep.badge}</span>
                )}
                <h3 className="tutorial-tooltip__title">{currentStep.title}</h3>
                <p className="tutorial-tooltip__desc">{currentStep.description}</p>

                {/* Step indicator */}
                <div className="tutorial-tooltip__dots">
                    {currentSteps.map((_, i) => (
                        <span
                            key={i}
                            className={`tutorial-tooltip__dot ${i === step ? 'tutorial-tooltip__dot--active' : ''} ${i < step ? 'tutorial-tooltip__dot--done' : ''}`}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div className="tutorial-tooltip__actions">
                    <button className="tutorial-tooltip__skip" onClick={handleSkip}>
                        Saltar tutorial
                    </button>
                    <button className="tutorial-tooltip__next" onClick={handleNext} autoFocus>
                        {step < totalSteps - 1 ? 'Siguiente ▶' : '¡Entendido!'}
                    </button>
                </div>
            </div>
        </div>
    );
}
