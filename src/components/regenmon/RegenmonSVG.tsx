'use client';

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

export type SpriteState = 'euphoric' | 'happy' | 'neutral' | 'sad' | 'critical' | 'no_hope' | 'no_energy' | 'no_nutrition';

export function getSpriteState(stats: { espiritu: number; pulso: number; esencia: number }): SpriteState {
    const { espiritu, pulso, esencia } = stats;

    const criticals = [
        { stat: 'espiritu', value: espiritu, state: 'no_hope' as SpriteState },
        { stat: 'pulso', value: pulso, state: 'no_energy' as SpriteState },
        { stat: 'esencia', value: esencia, state: 'no_nutrition' as SpriteState },
    ].filter(s => s.value < 10);

    if (criticals.length > 0) {
        criticals.sort((a, b) => a.value - b.value);
        return criticals[0].state;
    }

    const avg = (espiritu + pulso + esencia) / 3;
    if (avg >= 90) return 'euphoric';
    if (avg >= 70) return 'happy';
    if (avg >= 30) return 'neutral';
    if (avg >= 10) return 'sad';
    return 'critical';
}

// ── Color palettes per type ──
const TYPE_COLORS = {
    rayo: { primary: '#f5c542', secondary: '#d4a017', accent: '#fff7a1', dark: '#8a6d00' },
    flama: { primary: '#e74c3c', secondary: '#c0392b', accent: '#f39c12', dark: '#7a1a0e' },
    hielo: { primary: '#3498db', secondary: '#2980b9', accent: '#a8e6ff', dark: '#1a4a6e' },
};

// ── SVG filter definitions ──
function SpriteFilters({ state, type }: { state: SpriteState; type: RegenmonType }) {
    const id = `${type}-${state}`;
    return (
        <defs>
            <filter id={`glow-${id}`}>
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id={`grayscale-${id}`}>
                <feColorMatrix type="matrix" values="
                    0.2 0.2 0.2 0 0.05
                    0.2 0.2 0.2 0 0.05
                    0.2 0.2 0.2 0 0.05
                    0   0   0   0.5 0" />
            </filter>
            <filter id={`no-hope-${id}`}>
                <feColorMatrix type="matrix" values="
                    0.3 0.1 0.4 0 0.15
                    0.1 0.05 0.3 0 0.05
                    0.3 0.15 0.7 0 0.2
                    0   0   0   0.85 0" />
            </filter>
            <filter id={`no-energy-${id}`}>
                <feColorMatrix type="matrix" values="
                    0.6 0.3 0.1 0 0.1
                    0.5 0.5 0.1 0 0.05
                    0.1 0.1 0.2 0 0
                    0   0   0   1 0" />
            </filter>
            <filter id={`no-nutrition-${id}`}>
                <feColorMatrix type="matrix" values="
                    0.3 0.2 0.1 0 0
                    0.2 0.5 0.2 0 0.1
                    0.1 0.3 0.3 0 0.05
                    0   0   0   1 0" />
            </filter>
            <filter id={`sad-${id}`}>
                <feColorMatrix type="saturate" values="0.5" />
            </filter>
            <radialGradient id={`euphoric-glow-${id}`} cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor={TYPE_COLORS[type].accent} stopOpacity="0.6" />
                <stop offset="100%" stopColor={TYPE_COLORS[type].primary} stopOpacity="0" />
            </radialGradient>
        </defs>
    );
}

// ── Filter for group based on state ──
function getGroupFilter(state: SpriteState, type: RegenmonType): string {
    const id = `${type}-${state}`;
    switch (state) {
        case 'critical': return `url(#grayscale-${id})`;
        case 'no_hope': return `url(#no-hope-${id})`;
        case 'no_energy': return `url(#no-energy-${id})`;
        case 'no_nutrition': return `url(#no-nutrition-${id})`;
        case 'sad': return `url(#sad-${id})`;
        case 'euphoric': return `url(#glow-${id})`;
        default: return '';
    }
}

// ── Animation class ──
function getAnimationClass(state: SpriteState): string {
    switch (state) {
        case 'euphoric': return 'animate-bounce-subtle';
        case 'happy': return 'animate-float-idle';
        case 'neutral': return 'animate-float-idle';
        case 'sad': return 'animate-droop';
        case 'critical': return 'animate-flicker';
        case 'no_hope': return 'animate-sway-lost';
        case 'no_energy': return 'animate-pulse-slow';
        case 'no_nutrition': return 'animate-pulse-slow';
        default: return 'animate-float-idle';
    }
}

// ── Eyes per state ──
function Eyes({ state }: { state: SpriteState }) {
    switch (state) {
        case 'euphoric':
            return (
                <>
                    {/* Big sparkly eyes */}
                    <circle cx="36" cy="44" r="7" fill="black" opacity="0.8" />
                    <circle cx="64" cy="44" r="7" fill="black" opacity="0.8" />
                    <circle cx="38" cy="41" r="3" fill="white" />
                    <circle cx="66" cy="41" r="3" fill="white" />
                    <circle cx="34" cy="46" r="1.5" fill="white" opacity="0.7" />
                    <circle cx="62" cy="46" r="1.5" fill="white" opacity="0.7" />
                    {/* Star sparkles */}
                    <text x="28" y="38" fontSize="6" fill="#fff7a1" opacity="0.9">✦</text>
                    <text x="68" y="38" fontSize="6" fill="#fff7a1" opacity="0.9">✦</text>
                </>
            );
        case 'happy':
            return (
                <>
                    <path d="M30 45 Q35 39 40 45" stroke="black" strokeWidth="3" fill="none" opacity="0.8" />
                    <path d="M60 45 Q65 39 70 45" stroke="black" strokeWidth="3" fill="none" opacity="0.8" />
                </>
            );
        case 'neutral':
            return (
                <>
                    <circle cx="36" cy="45" r="5" fill="black" opacity="0.7" />
                    <circle cx="64" cy="45" r="5" fill="black" opacity="0.7" />
                    <circle cx="38" cy="43" r="1.5" fill="white" />
                    <circle cx="66" cy="43" r="1.5" fill="white" />
                </>
            );
        case 'sad':
            return (
                <>
                    <line x1="30" y1="42" x2="40" y2="46" stroke="black" strokeWidth="2" opacity="0.5" />
                    <line x1="60" y1="46" x2="70" y2="42" stroke="black" strokeWidth="2" opacity="0.5" />
                    <circle cx="36" cy="48" r="4" fill="black" opacity="0.5" />
                    <circle cx="64" cy="48" r="4" fill="black" opacity="0.5" />
                </>
            );
        case 'critical':
            return (
                <>
                    {/* Tiny dim dots — barely alive */}
                    <circle cx="36" cy="45" r="2.5" fill="#555" opacity="0.4" />
                    <circle cx="64" cy="45" r="2.5" fill="#555" opacity="0.4" />
                    {/* Tear drop from left eye */}
                    <ellipse cx="36" cy="50" rx="1.5" ry="2.5" fill="#88aacc" opacity="0.5">
                        <animate attributeName="cy" values="50;56;50" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                    </ellipse>
                </>
            );
        case 'no_hope':
            return (
                <>
                    {/* Wide open eyes with spiral void — existential emptiness */}
                    <circle cx="36" cy="44" r="7" fill="#1a0a2e" opacity="0.8" />
                    <circle cx="64" cy="44" r="7" fill="#1a0a2e" opacity="0.8" />
                    {/* Spiral inside eyes */}
                    <path d="M36 44 Q38 41 40 44 Q38 47 36 44" stroke="#8844aa" strokeWidth="0.8" fill="none" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                    </path>
                    <path d="M64 44 Q66 41 68 44 Q66 47 64 44" stroke="#8844aa" strokeWidth="0.8" fill="none" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                    </path>
                    {/* No tear — emptiness, not sadness */}
                </>
            );
        case 'no_energy':
            return (
                <>
                    {/* Half-closed droopy eyes */}
                    <ellipse cx="36" cy="47" rx="5" ry="3" fill="black" opacity="0.4" />
                    <ellipse cx="64" cy="47" rx="5" ry="3" fill="black" opacity="0.4" />
                    <line x1="31" y1="45" x2="41" y2="45" stroke="black" strokeWidth="2" opacity="0.5" />
                    <line x1="59" y1="45" x2="69" y2="45" stroke="black" strokeWidth="2" opacity="0.5" />
                </>
            );
        case 'no_nutrition':
            return (
                <>
                    {/* Sunken small eyes */}
                    <circle cx="36" cy="46" r="3" fill="black" opacity="0.4" />
                    <circle cx="64" cy="46" r="3" fill="black" opacity="0.4" />
                    <path d="M30 42 Q36 40 42 42" stroke="#555" strokeWidth="1" fill="none" opacity="0.4" />
                    <path d="M58 42 Q64 40 70 42" stroke="#555" strokeWidth="1" fill="none" opacity="0.4" />
                </>
            );
    }
}

// ── Mouth per state ──
function Mouth({ state }: { state: SpriteState }) {
    switch (state) {
        case 'euphoric':
            return <path d="M40 58 Q50 68 60 58" stroke="black" strokeWidth="2" fill="none" opacity="0.7" />;
        case 'happy':
            return <path d="M43 59 Q50 65 57 59" stroke="black" strokeWidth="2" fill="none" opacity="0.6" />;
        case 'neutral':
            return <circle cx="50" cy="60" r="2" fill="black" opacity="0.5" />;
        case 'sad':
            return <path d="M43 63 Q50 58 57 63" stroke="black" strokeWidth="1.5" fill="none" opacity="0.4" />;
        case 'critical':
            return <path d="M43 62 L46 60 L50 63 L54 60 L57 62" stroke="#666" strokeWidth="1.5" fill="none" opacity="0.4" />;
        case 'no_hope':
            return <path d="M42 64 Q50 56 58 64" stroke="#6633aa" strokeWidth="2" fill="none" opacity="0.7" />;
        case 'no_energy':
            return <path d="M44 61 Q50 64 56 61" stroke="black" strokeWidth="1" fill="none" opacity="0.3" />;
        case 'no_nutrition':
            return <path d="M45 63 Q50 59 55 63" stroke="#555" strokeWidth="1" fill="none" opacity="0.4" />;
    }
}

// ── Decorations (sparkles, effects) ──
function Decorations({ state, type }: { state: SpriteState; type: RegenmonType }) {
    const colors = TYPE_COLORS[type];
    const id = `${type}-${state}`;

    if (state === 'euphoric') {
        return (
            <>
                <circle cx="50" cy="50" r="48" fill={`url(#euphoric-glow-${id})`} />
                {/* Floating sparkle particles */}
                <circle cx="18" cy="20" r="2" fill={colors.accent} opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="20;15;20" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="82" cy="25" r="1.5" fill={colors.accent} opacity="0.6">
                    <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="25;18;25" dur="2.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="75" cy="80" r="1.5" fill="white" opacity="0.5">
                    <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="78" r="2" fill={colors.accent} opacity="0.7">
                    <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.6s" repeatCount="indefinite" />
                </circle>
            </>
        );
    }

    if (state === 'happy') {
        return (
            <>
                {/* Subtle floating sparkles — content but not overwhelming */}
                <circle cx="22" cy="28" r="1.2" fill={colors.accent} opacity="0">
                    <animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="28;22;28" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="78" cy="32" r="1" fill={colors.accent} opacity="0">
                    <animate attributeName="opacity" values="0;0.4;0" dur="3.5s" begin="1s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="32;26;32" dur="3.5s" begin="1s" repeatCount="indefinite" />
                </circle>
            </>
        );
    }

    if (state === 'critical') {
        return (
            <>
                {/* Flickering opacity on the whole thing is handled via CSS class */}
                <rect x="0" y="0" width="100" height="100" fill="none" opacity="0">
                    <animate attributeName="opacity" values="0;0.05;0" dur="0.3s" repeatCount="indefinite" />
                </rect>
            </>
        );
    }

    if (state === 'no_energy') {
        return (
            <>
                {/* Slow breathing pulse ring */}
                <ellipse cx="50" cy="55" rx="30" ry="25" fill="none" stroke={colors.primary} strokeWidth="0.5" opacity="0.2">
                    <animate attributeName="rx" values="30;33;30" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="ry" values="25;28;25" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.05;0.2" dur="3s" repeatCount="indefinite" />
                </ellipse>
            </>
        );
    }

    return null;
}

// ── Rayo body shape ──
function RayoBody({ state }: { state: SpriteState }) {
    const c = TYPE_COLORS.rayo;
    const shrinkSmall = state === 'no_nutrition'; const shrinkTiny = state === 'critical';
    const transform = shrinkTiny ? 'translate(17,17) scale(0.65)' : shrinkSmall ? 'translate(10,10) scale(0.8)' : undefined;

    return (
        <g transform={transform}>
            {/* Main jagged electric body */}
            <path
                d="M40 10 L55 40 L85 40 L60 60 L75 90 L45 70 L25 100 L35 60 L5 50 L35 35 Z"
                fill={c.primary}
                stroke={c.secondary}
                strokeWidth="3"
            />
            {/* Inner highlight */}
            <path
                d="M42 20 L52 40 L70 42 L58 58 L68 80 L47 68 L34 88 L40 58 L18 52 L38 38 Z"
                fill={c.accent}
                opacity="0.25"
            />
            {/* Cheek blush */}
            {(state === 'euphoric' || state === 'happy') && (
                <>
                    <ellipse cx="26" cy="55" rx="5" ry="3" fill="#ffaaaa" opacity="0.4" />
                    <ellipse cx="74" cy="55" rx="5" ry="3" fill="#ffaaaa" opacity="0.4" />
                </>
            )}
        </g>
    );
}

// ── Flama body shape ──
function FlamaBody({ state }: { state: SpriteState }) {
    const c = TYPE_COLORS.flama;
    const shrinkSmall = state === 'no_nutrition'; const shrinkTiny = state === 'critical';
    const transform = shrinkTiny ? 'translate(17,17) scale(0.65)' : shrinkSmall ? 'translate(10,10) scale(0.8)' : undefined;

    return (
        <g transform={transform}>
            {/* Outer flame */}
            <path
                d="M50 5 Q75 25 85 50 Q90 80 50 95 Q10 80 15 50 Q25 25 50 5 Z"
                fill={c.primary}
                stroke={c.secondary}
                strokeWidth="3"
            />
            {/* Inner flame core */}
            <path
                d="M50 20 Q65 35 70 55 Q75 75 50 82 Q25 75 30 55 Q35 35 50 20 Z"
                fill={c.accent}
                opacity="0.7"
            />
            {/* Bright center */}
            <ellipse cx="50" cy="55" rx="12" ry="15" fill="#ffe0b2" opacity="0.3" />
            {/* Cheek blush */}
            {(state === 'euphoric' || state === 'happy') && (
                <>
                    <ellipse cx="30" cy="58" rx="5" ry="3" fill="#ff8a80" opacity="0.5" />
                    <ellipse cx="70" cy="58" rx="5" ry="3" fill="#ff8a80" opacity="0.5" />
                </>
            )}
        </g>
    );
}

// ── Hielo body shape ──
function HieloBody({ state }: { state: SpriteState }) {
    const c = TYPE_COLORS.hielo;
    const shrinkSmall = state === 'no_nutrition'; const shrinkTiny = state === 'critical';
    const transform = shrinkTiny ? 'translate(17,17) scale(0.65)' : shrinkSmall ? 'translate(10,10) scale(0.8)' : undefined;

    return (
        <g transform={transform}>
            {/* Crystalline hexagon */}
            <path
                d="M50 8 L87 28 L87 72 L50 92 L13 72 L13 28 Z"
                fill={c.primary}
                stroke={c.secondary}
                strokeWidth="3"
            />
            {/* Inner facet */}
            <path
                d="M50 18 L77 33 L77 67 L50 82 L23 67 L23 33 Z"
                fill={c.accent}
                opacity="0.2"
            />
            {/* Crystal shine line */}
            <line x1="30" y1="25" x2="50" y2="18" stroke="white" strokeWidth="1" opacity="0.4" />
            <line x1="50" y1="18" x2="70" y2="25" stroke="white" strokeWidth="0.5" opacity="0.3" />
            {/* Cheek blush */}
            {(state === 'euphoric' || state === 'happy') && (
                <>
                    <ellipse cx="30" cy="55" rx="5" ry="3" fill="#b3e5fc" opacity="0.5" />
                    <ellipse cx="70" cy="55" rx="5" ry="3" fill="#b3e5fc" opacity="0.5" />
                </>
            )}
        </g>
    );
}

export default function RegenmonSVG({ type, size = 120, className = '', stats }: RegenmonSVGProps) {
    const state = stats ? getSpriteState(stats) : 'neutral';
    const animClass = getAnimationClass(state);
    const svgFilter = getGroupFilter(state, type);

    // CSS filter fallback for states where SVG filters may not render
    const getCssFilter = (s: SpriteState): string => {
        switch (s) {
            case 'critical': return 'grayscale(1) brightness(0.5) opacity(0.6)';
            case 'no_hope': return 'hue-rotate(260deg) saturate(1.5) brightness(0.7)';
            case 'no_energy': return 'sepia(0.8) hue-rotate(10deg) brightness(0.8)';
            case 'no_nutrition': return 'hue-rotate(90deg) saturate(0.6) brightness(0.7)';
            case 'sad': return 'saturate(0.5) brightness(0.85)';
            default: return 'none';
        }
    };

    const cssFilter = getCssFilter(state);

    const BodyComponent = type === 'rayo' ? RayoBody : type === 'flama' ? FlamaBody : HieloBody;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`regenmon-svg ${animClass} ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', filter: cssFilter !== 'none' ? cssFilter : undefined }}
        >
            <SpriteFilters state={state} type={type} />
            <Decorations state={state} type={type} />
            <g filter={svgFilter || undefined}>
                <BodyComponent state={state} />
                <Eyes state={state} />
                <Mouth state={state} />
            </g>
        </svg>
    );
}
