import React from 'react';

interface StatBarProps {
    label: string;
    value: number;
    max?: number;
    color: string; // Hex color for the bar
    icon: string;
}

export default function StatBar({ label, value, max = 100, color, icon }: StatBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className="w-full mb-2 flex flex-col">
            <div className="flex justify-between items-end mb-1 text-xs text-white px-1">
                <span className="flex items-center gap-2">
                    <span className="text-lg">{icon}</span>
                    <span className="uppercase tracking-wider">{label}</span>
                </span>
                <span className="opacity-80 font-mono">{Math.round(value)}/{max}</span>
            </div>

            {/* NES-style container for the bar */}
            <div className="w-full h-6 bg-[#212529] border-4 border-white relative">
                {/* Internal bar */}
                <div
                    className="h-full transition-all duration-500 ease-out relative"
                    style={{
                        width: `${percentage}%`,
                        backgroundColor: color,
                        boxShadow: `inset 0 -4px 0 rgba(0,0,0,0.2)`
                    }}
                >
                    {/* Shine effect */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white/30" />
                </div>
            </div>
        </div>
    );
}
