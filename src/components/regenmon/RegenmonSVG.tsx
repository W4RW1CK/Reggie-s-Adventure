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

    const avg = (espiritu + pulso + esencia) / 3;

    // If ALL three stats are critical (<10), it's a full collapse — not individual
    if (avg < 10) return 'critical';

    // Individual stat overrides (only when ONE or TWO are critical, not all three)
    const criticals = [
        { stat: 'espiritu', value: espiritu, state: 'no_hope' as SpriteState },
        { stat: 'pulso', value: pulso, state: 'no_energy' as SpriteState },
        { stat: 'esencia', value: esencia, state: 'no_nutrition' as SpriteState },
    ].filter(s => s.value < 10);

    if (criticals.length > 0) {
        criticals.sort((a, b) => a.value - b.value);
        return criticals[0].state;
    }

    if (avg >= 90) return 'euphoric';
    if (avg >= 70) return 'happy';
    if (avg >= 30) return 'neutral';
    return 'sad';
}

// ── Face viewBox per type ──
const FACE_VIEWBOX: Record<RegenmonType, string> = {
    rayo: '0 0 150 150',
    flama: '-4 -30 150 150',
    hielo: '-7 3 150 150',
};

function isNegativeState(s: SpriteState): boolean {
    return ['sad', 'critical', 'no_hope', 'no_energy', 'no_nutrition'].includes(s);
}

function isSevereState(s: SpriteState): boolean {
    return ['critical', 'no_hope', 'no_energy', 'no_nutrition'].includes(s);
}

// ── CSS filters per state ──
function getImgFilter(state: SpriteState): string {
    switch (state) {
        case 'euphoric': return 'brightness(1.15) saturate(1.3)';
        case 'sad': return 'saturate(0.4) brightness(0.7)';
        case 'critical': return 'grayscale(0.9) brightness(0.4) contrast(1.2)';
        case 'no_hope': return 'sepia(1) hue-rotate(230deg) saturate(2.5) brightness(0.55)';
        case 'no_energy': return 'sepia(0.8) hue-rotate(10deg) brightness(0.65) saturate(0.6)';
        case 'no_nutrition': return 'sepia(0.6) saturate(0.3) brightness(0.7) opacity(0.75)';
        default: return 'none';
    }
}

// ── Animation class per state ──
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

// ── Face Overlay ──
function FaceOverlay({ state, viewBox }: { state: SpriteState; viewBox: string }) {
    return (
        <svg width="100%" height="100%" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            {state === 'euphoric' && (
                <>
                    <circle cx="55" cy="62" r="12" fill="white" opacity="0.25"/>
                    <circle cx="95" cy="62" r="12" fill="white" opacity="0.25"/>
                    <circle cx="55" cy="62" r="8" fill="#1a1a2e" opacity="0.9"/>
                    <circle cx="95" cy="62" r="8" fill="#1a1a2e" opacity="0.9"/>
                    <circle cx="58" cy="59" r="3.5" fill="white"/>
                    <circle cx="98" cy="59" r="3.5" fill="white"/>
                    <circle cx="52" cy="65" r="2" fill="white" opacity="0.8"/>
                    <circle cx="92" cy="65" r="2" fill="white" opacity="0.8"/>
                    <text x="40" y="54" fontSize="9" fill="white" opacity="0.9">✦</text>
                    <text x="101" y="54" fontSize="9" fill="white" opacity="0.9">✦</text>
                    <path d="M58 80 Q75 94 92 80" stroke="white" strokeWidth="3.5" fill="none" opacity="0.2"/>
                    <path d="M58 80 Q75 94 92 80" stroke="#1a1a2e" strokeWidth="2.5" fill="none" opacity="0.85"/>
                </>
            )}
            {state === 'happy' && (
                <>
                    <circle cx="55" cy="63" r="10" fill="white" opacity="0.2"/>
                    <circle cx="95" cy="63" r="10" fill="white" opacity="0.2"/>
                    <path d="M47 65 Q55 57 63 65" stroke="white" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path d="M47 65 Q55 57 63 65" stroke="#1a1a2e" strokeWidth="3" fill="none" opacity="0.85"/>
                    <path d="M87 65 Q95 57 103 65" stroke="white" strokeWidth="4" fill="none" opacity="0.25"/>
                    <path d="M87 65 Q95 57 103 65" stroke="#1a1a2e" strokeWidth="3" fill="none" opacity="0.85"/>
                    <path d="M62 81 Q75 89 88 81" stroke="white" strokeWidth="3.5" fill="none" opacity="0.2"/>
                    <path d="M62 81 Q75 89 88 81" stroke="#1a1a2e" strokeWidth="2" fill="none" opacity="0.75"/>
                </>
            )}
            {state === 'neutral' && (
                <>
                    <circle cx="55" cy="63" r="10" fill="white" opacity="0.2"/>
                    <circle cx="95" cy="63" r="10" fill="white" opacity="0.2"/>
                    <circle cx="55" cy="63" r="6.5" fill="white" opacity="0.3"/>
                    <circle cx="55" cy="63" r="6" fill="#1a1a2e" opacity="0.85"/>
                    <circle cx="58" cy="61" r="2.2" fill="white"/>
                    <circle cx="95" cy="63" r="6.5" fill="white" opacity="0.3"/>
                    <circle cx="95" cy="63" r="6" fill="#1a1a2e" opacity="0.85"/>
                    <circle cx="98" cy="61" r="2.2" fill="white"/>
                    <circle cx="75" cy="83" r="3.5" fill="white" opacity="0.2"/>
                    <circle cx="75" cy="83" r="3" fill="#1a1a2e" opacity="0.6"/>
                </>
            )}
            {state === 'sad' && (
                <>
                    <line x1="45" y1="58" x2="63" y2="54" stroke="white" strokeWidth="2.5" opacity="0.7"/>
                    <line x1="87" y1="54" x2="105" y2="58" stroke="white" strokeWidth="2.5" opacity="0.7"/>
                    <circle cx="55" cy="67" r="7" fill="white" opacity="0.8"/>
                    <circle cx="55" cy="67" r="4" fill="#333" opacity="0.9"/>
                    <circle cx="95" cy="67" r="7" fill="white" opacity="0.8"/>
                    <circle cx="95" cy="67" r="4" fill="#333" opacity="0.9"/>
                    <path d="M62 87 Q75 81 88 87" stroke="white" strokeWidth="2.5" fill="none" opacity="0.75"/>
                </>
            )}
            {state === 'critical' && (
                <>
                    <line x1="48" y1="57" x2="62" y2="71" stroke="white" strokeWidth="3" opacity="0.9"/>
                    <line x1="62" y1="57" x2="48" y2="71" stroke="white" strokeWidth="3" opacity="0.9"/>
                    <line x1="88" y1="57" x2="102" y2="71" stroke="white" strokeWidth="3" opacity="0.9"/>
                    <line x1="102" y1="57" x2="88" y2="71" stroke="white" strokeWidth="3" opacity="0.9"/>
                    <path d="M58 85 L66 82 L75 86 L84 82 L92 85" stroke="white" strokeWidth="2.5" fill="none" opacity="0.8"/>
                    <ellipse cx="55" cy="76" rx="2.5" ry="4" fill="#aaddff" opacity="0.8">
                        <animate attributeName="cy" values="76;84;76" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
                    </ellipse>
                </>
            )}
            {state === 'no_hope' && (
                <>
                    <circle cx="55" cy="63" r="8" fill="#0a0020" opacity="0.95"/>
                    <circle cx="95" cy="63" r="8" fill="#0a0020" opacity="0.95"/>
                    <path d="M55 63 Q58 58 62 63 Q58 68 55 63" stroke="#cc88ff" strokeWidth="1.5" fill="none" opacity="0.85">
                        <animate attributeName="opacity" values="0.85;0.3;0.85" dur="3s" repeatCount="indefinite"/>
                    </path>
                    <path d="M95 63 Q98 58 102 63 Q98 68 95 63" stroke="#cc88ff" strokeWidth="1.5" fill="none" opacity="0.85">
                        <animate attributeName="opacity" values="0.85;0.3;0.85" dur="3s" repeatCount="indefinite"/>
                    </path>
                    <path d="M63 87 Q75 78 87 87" stroke="#cc88ff" strokeWidth="3" fill="none" opacity="0.9"/>
                </>
            )}
            {state === 'no_energy' && (
                <>
                    <ellipse cx="55" cy="67" rx="8" ry="5" fill="white" opacity="0.7"/>
                    <ellipse cx="95" cy="67" rx="8" ry="5" fill="white" opacity="0.7"/>
                    <line x1="46" y1="64" x2="64" y2="64" stroke="white" strokeWidth="3" opacity="0.9"/>
                    <rect x="46" y="58" width="18" height="7" fill="white" opacity="0.15" rx="2"/>
                    <line x1="86" y1="64" x2="104" y2="64" stroke="white" strokeWidth="3" opacity="0.9"/>
                    <rect x="86" y="58" width="18" height="7" fill="white" opacity="0.15" rx="2"/>
                    <circle cx="55" cy="66" r="2" fill="#333" opacity="0.6"/>
                    <circle cx="95" cy="66" r="2" fill="#333" opacity="0.6"/>
                    <path d="M66 84 Q75 89 84 84" stroke="white" strokeWidth="2" fill="none" opacity="0.65"/>
                </>
            )}
            {state === 'no_nutrition' && (
                <>
                    <circle cx="55" cy="66" r="6" fill="white" opacity="0.65"/>
                    <circle cx="55" cy="66" r="3.5" fill="#333" opacity="0.8"/>
                    <circle cx="95" cy="66" r="6" fill="white" opacity="0.65"/>
                    <circle cx="95" cy="66" r="3.5" fill="#333" opacity="0.8"/>
                    <path d="M47 59 Q55 55 63 59" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
                    <path d="M87 59 Q95 55 103 59" stroke="white" strokeWidth="2" fill="none" opacity="0.6"/>
                    <path d="M64 87 Q75 82 86 87" stroke="white" strokeWidth="2" fill="none" opacity="0.7"/>
                </>
            )}
        </svg>
    );
}

// ── Rayo Effects (electric sparks) ──
function RayoEffects({ state }: { state: SpriteState }) {
    if (isSevereState(state)) {
        return (
            <svg width="100%" height="100%" viewBox="0 0 150 150" style={{ overflow: 'visible' }}>
                <circle cx="10" cy="55" r="1.5" fill="#ffffff" opacity="0.08">
                    <animate attributeName="opacity" values="0.08;0;0.08" dur="4s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }
    if (state === 'sad') {
        return (
            <svg width="100%" height="100%" viewBox="0 0 150 150" style={{ overflow: 'visible' }}>
                <circle cx="10" cy="55" r="2" fill="#ffffff" opacity="0.15">
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="140" cy="50" r="1.5" fill="#ffff66" opacity="0.1">
                    <animate attributeName="opacity" values="0.1;0.03;0.1" dur="3.5s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }
    return (
        <svg width="100%" height="100%" viewBox="0 0 150 150" style={{ overflow: 'visible' }}>
            <path d="M8 40 L14 32 L6 26 L16 20" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.85">
                <animate attributeName="opacity" values="0.85;0.2;0.85" dur="1.2s" repeatCount="indefinite"/>
            </path>
            <path d="M142 35 L148 28 L140 22 L150 16" stroke="#ffff66" strokeWidth="1.8" fill="none" opacity="0.75">
                <animate attributeName="opacity" values="0.75;0.1;0.75" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <circle cx="10" cy="55" r="3" fill="#ffffff" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="140" cy="50" r="2.5" fill="#ffff66" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75" cy="5" r="2.5" fill="#ffffff" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="15" cy="85" r="2" fill="#00e5ff" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="135" cy="82" r="2" fill="#ffff66" opacity="0.65">
                <animate attributeName="opacity" values="0.65;0.05;0.65" dur="1.7s" repeatCount="indefinite"/>
            </circle>
            <path d="M5 70 L12 65" stroke="#00e5ff" strokeWidth="1.5" fill="none" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" repeatCount="indefinite"/>
            </path>
            <path d="M145 68 L138 63" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.55">
                <animate attributeName="opacity" values="0.55;0;0.55" dur="2.5s" repeatCount="indefinite"/>
            </path>
        </svg>
    );
}

// ── Flama Effects (fire embers) ──
function FlamaEffects({ state }: { state: SpriteState }) {
    if (isSevereState(state)) {
        return (
            <svg width="100%" height="100%" viewBox="0 0 150 150">
                <circle cx="25" cy="55" r="1.5" fill="#ff8c42" opacity="0.08">
                    <animate attributeName="opacity" values="0.08;0;0.08" dur="4s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }
    if (state === 'sad') {
        return (
            <svg width="100%" height="100%" viewBox="0 0 150 150">
                <circle cx="25" cy="55" r="2" fill="#ff8c42" opacity="0.1">
                    <animate attributeName="cy" values="55;45;55" dur="4s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.1;0.03;0.1" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="125" cy="50" r="1.5" fill="#ffaa33" opacity="0.08">
                    <animate attributeName="cy" values="50;42;50" dur="4.5s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.08;0.02;0.08" dur="4.5s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }
    return (
        <svg width="100%" height="100%" viewBox="0 0 150 150">
            <circle cx="25" cy="55" r="3" fill="#ff8c42" opacity="0.7">
                <animate attributeName="cy" values="55;35;20" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.7;0.3;0" dur="2s" repeatCount="indefinite"/>
                <animate attributeName="r" values="3;2;0.5" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="125" cy="50" r="2.5" fill="#ffaa33" opacity="0.6">
                <animate attributeName="cy" values="50;30;15" dur="2.3s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.6;0.25;0" dur="2.3s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2.5;1.5;0.3" dur="2.3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30" cy="40" r="2" fill="#ff6622" opacity="0.5">
                <animate attributeName="cy" values="40;22;10" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0.2;0" dur="1.8s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2;1.2;0.3" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="120" cy="42" r="2" fill="#ffcc44" opacity="0.5">
                <animate attributeName="cy" values="42;25;12" dur="2.1s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.5;0.2;0" dur="2.1s" repeatCount="indefinite"/>
                <animate attributeName="r" values="2;1;0.2" dur="2.1s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75" cy="18" r="2" fill="#ff7733" opacity="0.4">
                <animate attributeName="cy" values="18;5;-5" dur="2.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.4;0.15;0" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <path d="M35 48 Q32 40 28 35" stroke="#ff8844" strokeWidth="1.2" fill="none" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite"/>
            </path>
            <path d="M115 45 Q118 38 122 32" stroke="#ffaa55" strokeWidth="1.2" fill="none" opacity="0.45">
                <animate attributeName="opacity" values="0.45;0.1;0.45" dur="1.8s" repeatCount="indefinite"/>
            </path>
        </svg>
    );
}

// ── Hielo Effects (ice crystals) ──
function HieloEffects({ state }: { state: SpriteState }) {
    if (isSevereState(state)) {
        return (
            <svg width="100%" height="100%" viewBox="-7 3 150 150">
                <circle cx="22" cy="40" r="1.5" fill="#a8e6ff" opacity="0.08">
                    <animate attributeName="opacity" values="0.08;0;0.08" dur="4s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }
    if (state === 'sad') {
        return (
            <svg width="100%" height="100%" viewBox="-7 3 150 150">
                <circle cx="22" cy="40" r="2" fill="#a8e6ff" opacity="0.15">
                    <animate attributeName="opacity" values="0.15;0.03;0.15" dur="3.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="128" cy="35" r="1.5" fill="#c0f0ff" opacity="0.1">
                    <animate attributeName="opacity" values="0.1;0.02;0.1" dur="4s" repeatCount="indefinite"/>
                </circle>
            </svg>
        );
    }
    return (
        <svg width="100%" height="100%" viewBox="-7 3 150 150">
            <circle cx="22" cy="40" r="2.5" fill="#a8e6ff" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <circle cx="128" cy="35" r="2" fill="#c0f0ff" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite"/>
            </circle>
            <circle cx="75" cy="15" r="1.8" fill="white" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30" cy="25" r="1.5" fill="#a8e6ff" opacity="0.45">
                <animate attributeName="opacity" values="0.45;0.05;0.45" dur="3.2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="120" cy="28" r="1.8" fill="#c0f0ff" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.7s" repeatCount="indefinite"/>
            </circle>
            <path d="M25 50 L22 45 L28 47" stroke="#a8e6ff" strokeWidth="0.8" fill="none" opacity="0.35">
                <animate attributeName="opacity" values="0.35;0;0.35" dur="3s" repeatCount="indefinite"/>
            </path>
            <path d="M125 48 L128 43 L122 45" stroke="#c0f0ff" strokeWidth="0.8" fill="none" opacity="0.3">
                <animate attributeName="opacity" values="0.3;0;0.3" dur="3.5s" repeatCount="indefinite"/>
            </path>
        </svg>
    );
}

export default function RegenmonSVG({ type, size = 120, className = '', stats }: RegenmonSVGProps) {
    const state = stats ? getSpriteState(stats) : 'neutral';
    const animClass = getAnimationClass(state);
    const imgFilter = getImgFilter(state);

    return (
        <div
            className={`regenmon-sprite ${animClass} ${className}`}
            style={{
                width: size,
                height: size,
                aspectRatio: '1 / 1',
                position: 'relative',
            }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`/sprites/${type}-base.png`}
                alt={type}
                width={size}
                height={size}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    filter: imgFilter !== 'none' ? imgFilter : undefined,
                }}
            />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {type === 'rayo' && <RayoEffects state={state} />}
                {type === 'flama' && <FlamaEffects state={state} />}
                {type === 'hielo' && <HieloEffects state={state} />}
            </div>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <FaceOverlay state={state} viewBox={FACE_VIEWBOX[type]} />
            </div>
        </div>
    );
}
