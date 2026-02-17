import React from 'react';
import { RegenmonType } from '@/lib/types';

interface RegenmonSVGProps {
    type: RegenmonType;
    size?: number;
    className?: string;
    stats?: {
        espiritu: number;
        pulso: number;
        esencia: number;
    };
}

type RegenmonState = 'normal' | 'happy' | 'sad' | 'angry' | 'weak' | 'critical';

export default function RegenmonSVG({ type, size = 120, className = '', stats }: RegenmonSVGProps) {
    const getState = (): RegenmonState => {
        if (!stats) return 'normal';

        const { espiritu, pulso, esencia } = stats;

        // Priority order matters!
        if (pulso <= 10) return 'weak';
        if (esencia <= 10) return 'angry'; // Critical low esencia = angry/stressed
        if (espiritu <= 10) return 'sad';
        if (espiritu >= 80 || pulso >= 80) return 'happy';

        return 'normal';
    };

    const state = getState();

    // Animation class based on state
    const getAnimationClass = () => {
        switch (state) {
            case 'happy': return 'animate-bounce-subtle';
            case 'angry': return 'animate-shake-fast';
            case 'weak': return 'animate-pulse-slow';
            case 'sad': return 'animate-droop';
            case 'normal':
            default: return 'animate-float-idle';
        }
    };

    const getEyes = () => {
        switch (state) {
            case 'happy':
                // Inverted U shape for happy closed eyes or sparkly
                return (
                    <>
                        <path d="M30 45 Q35 40 40 45" stroke="black" strokeWidth="3" fill="none" opacity="0.8" />
                        <path d="M60 45 Q65 40 70 45" stroke="black" strokeWidth="3" fill="none" opacity="0.8" />
                    </>
                );
            case 'sad':
            case 'weak':
                // U shape for sad/tired
                return (
                    <>
                        <line x1="30" y1="45" x2="40" y2="48" stroke="black" strokeWidth="3" opacity="0.6" />
                        <line x1="60" y1="48" x2="70" y2="45" stroke="black" strokeWidth="3" opacity="0.6" />
                        <path d="M30 55 Q50 50 70 55" stroke="black" strokeWidth="1" fill="none" opacity="0.3" />
                    </>
                );
            case 'angry':
                // Slanted eyebrows
                return (
                    <>
                        <path d="M30 40 L45 48" stroke="black" strokeWidth="3" />
                        <path d="M70 40 L55 48" stroke="black" strokeWidth="3" />
                        <circle cx="35" cy="48" r="3" fill="black" />
                        <circle cx="65" cy="48" r="3" fill="black" />
                    </>
                );
            case 'normal':
            default:
                return (
                    <>
                        <circle cx="35" cy="45" r="5" fill="black" opacity="0.7" />
                        <circle cx="65" cy="45" r="5" fill="black" opacity="0.7" />
                        <circle cx="37" cy="43" r="1.5" fill="white" />
                        <circle cx="67" cy="43" r="1.5" fill="white" />
                    </>
                );
        }
    }

    const getMouth = () => {
        switch (state) {
            case 'happy':
                return <path d="M45 60 Q50 65 55 60" stroke="black" strokeWidth="2" fill="none" opacity="0.6" />;
            case 'angry':
                return <path d="M45 65 Q50 60 55 65" stroke="black" strokeWidth="2" fill="none" opacity="0.8" />;
            case 'sad':
            case 'weak':
                return <path d="M45 65 Q50 60 55 65" stroke="black" strokeWidth="1" fill="none" opacity="0.5" />;
            default:
                return <circle cx="50" cy="60" r="2" fill="black" opacity="0.5" />;
        }
    }

    const getBodyColor = (baseColor: string) => {
        switch (state) {
            case 'weak': return '#888888'; // Desaturated
            case 'angry': return '#ff0000'; // Red tint override? Or just filter. Let's keep logic simple.
            // For now, let's just stick to base colors but maybe modify opacity/filter in CSS provided
            default: return baseColor;
        }
    }

    // Helper for filter string
    const getFilter = () => {
        if (state === 'happy') return 'brightness(1.1)';
        if (state === 'weak') return 'grayscale(0.6)';
        if (state === 'angry') return 'sepia(0.3) hue-rotate(-50deg) saturate(3)'; // Reddish
        return 'none';
    }

    const getPath = () => {
        switch (type) {
            case 'rayo':
                // Jagged, electrical shape
                return (
                    <path
                        d="M40 10 L55 40 L85 40 L60 60 L75 90 L45 70 L25 100 L35 60 L5 50 L35 35 Z"
                        fill={getBodyColor("#f5c542")}
                        stroke="#d4a017"
                        strokeWidth="3"
                        style={{ filter: getFilter() }}
                    />
                );
            case 'flama':
                // Soft, curved flame shape
                return (
                    <g style={{ filter: getFilter() }}>
                        <path
                            d="M50 10 Q70 30 80 50 Q90 80 50 90 Q10 80 20 50 Q30 30 50 10 Z"
                            fill={getBodyColor("#e74c3c")}
                            stroke="#c0392b"
                            strokeWidth="3"
                        />
                        <path
                            d="M50 25 Q60 40 65 55 Q70 75 50 80 Q30 75 35 55 Q40 40 50 25 Z"
                            fill="#f39c12"
                            opacity="0.8"
                        />
                    </g>
                );
            case 'hielo':
                // Sharp, crystalline hexagon shape
                return (
                    <path
                        d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
                        fill={getBodyColor("#3498db")}
                        stroke="#2980b9"
                        strokeWidth="3"
                        style={{ filter: getFilter() }}
                    />
                );
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`regenmon-svg ${getAnimationClass()} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible' }} // Allow bouncy animations to not get clipped
        >
            <defs>
                <filter id="glow-filter">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter={state === 'happy' || type === 'rayo' ? "url(#glow-filter)" : ""}>
                {getPath()}
                {getEyes()}
                {getMouth()}
            </g>
        </svg>
    );
}
