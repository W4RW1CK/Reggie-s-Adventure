import React from 'react';
import { RegenmonStats } from '@/lib/types';

interface ActionButtonsProps {
    onAction: (action: 'train' | 'feed' | 'sleep') => void;
    stats: RegenmonStats;
    isSleeping?: boolean; // Future proofing
}

export default function ActionButtons({ onAction, stats, isSleeping = false }: ActionButtonsProps) {
    return (
        <div className="w-full max-w-md grid grid-cols-3 gap-2 px-2">
            <ActionButton
                label="ENTRENAR"
                icon="⚔️"
                onClick={() => onAction('train')}
                disabled={isSleeping || stats.pulso <= 10}
                color="is-warning" // NES.css class
            />
            <ActionButton
                label="COMER"
                icon="🍖"
                onClick={() => onAction('feed')}
                disabled={isSleeping || stats.esencia <= 0}
                color="is-success"
            />
            <ActionButton
                label="DORMIR"
                icon="💤"
                onClick={() => onAction('sleep')}
                disabled={isSleeping} // Or logic for fully rested
                color="is-primary"
            />
        </div>
    );
}

interface ActionButtonProps {
    label: string;
    icon: string;
    onClick: () => void;
    disabled?: boolean;
    color: string;
}

function ActionButton({ label, icon, onClick, disabled, color }: ActionButtonProps) {
    return (
        <button
            type="button"
            className={`nes-btn ${color} w-full flex flex-col items-center justify-center py-2 text-[10px] sm:text-xs leading-tight`}
            onClick={onClick}
            disabled={disabled}
            style={{ minHeight: '60px' }}
        >
            <span className="text-xl mb-1">{icon}</span>
            <span>{label}</span>
        </button>
    );
}
