'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RegenmonType } from '@/lib/types';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';

interface CreationScreenProps {
    onDespertar: (name: string, type: RegenmonType) => void;
}

const TYPES: { type: RegenmonType; label: string; emoji: string; loreTitle: string; desc: string; color: string }[] = [
    { type: 'rayo', label: '⚡️ RAYO', emoji: '⚡️', loreTitle: 'El Impulso', desc: 'Veloz, directo, chispeante. La corriente que alguna vez fue el flujo limpio de información.', color: '#f5c542' },
    { type: 'flama', label: '🔥 FLAMA', emoji: '🔥', loreTitle: 'La Pasión', desc: 'Cálido, emotivo, intenso. El calor que alguna vez fue la conexión genuina entre seres.', color: '#e74c3c' },
    { type: 'hielo', label: '❄️ HIELO', emoji: '❄️', loreTitle: 'La Memoria', desc: 'Sabio, reflexivo, sereno. Los archivos donde el conocimiento vivía eterno.', color: '#3498db' },
];

export default function CreationScreen({ onDespertar }: CreationScreenProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const inputFocusedRef = useRef(false);

    const currentType = TYPES[currentIndex];

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? TYPES.length - 1 : prev - 1));
    }, []);

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev === TYPES.length - 1 ? 0 : prev + 1));
    }, []);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);

        if (val.length > 15) {
            setError('Máximo 15 caracteres');
        } else if (val.length > 0 && val.length < 2) {
            setError('Mínimo 2 caracteres');
        } else {
            setError('');
        }
    };

    const handleSubmit = useCallback(() => {
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 15) {
            setError('Nombre inválido');
            return;
        }
        onDespertar(trimmed, TYPES[currentIndex].type);
    }, [name, currentIndex, onDespertar]);

    const isValid = name.trim().length >= 2 && name.trim().length <= 15;

    // Keyboard controls:
    // - Enter always submits if valid
    // - When name input NOT focused: arrows/A/D navigate carousel, Space submits
    // - When name input IS focused: all keys behave normally
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' && isValid) {
            e.preventDefault();
            handleSubmit();
            return;
        }

        // Only handle carousel/space shortcuts when input is NOT focused
        if (!inputFocusedRef.current) {
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                handlePrev();
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                handleNext();
            } else if (e.key === ' ' && isValid) {
                e.preventDefault();
                handleSubmit();
            }
        }
    }, [isValid, handleSubmit, handlePrev, handleNext]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <div className="creation-screen" onClick={() => { if (isValid) handleSubmit(); }}>
            <div className="creation-screen__scanlines" />

            <h1 className="creation-screen__title">CREA TU REGENMON</h1>

            {/* Carousel */}
            <div className="creation-screen__carousel" onClick={(e) => e.stopPropagation()}>
                <button className="creation-screen__arrow" onClick={handlePrev} aria-label="Tipo anterior">◀</button>

                <div className="creation-screen__showcase">
                    <div className="creation-screen__svg-container" style={{ borderColor: currentType.color }}>
                        <RegenmonSVG type={currentType.type} size={150} />
                    </div>
                    <div className="creation-screen__info">
                        <h2 className="creation-screen__type-label" style={{ color: currentType.color }}>
                            {currentType.label}
                        </h2>
                        <p className="creation-screen__lore-title" style={{ color: currentType.color, opacity: 0.8, fontSize: '10px', letterSpacing: '0.1em' }}>
                            — {currentType.loreTitle} —
                        </p>
                        <p className="creation-screen__type-desc">{currentType.desc}</p>
                    </div>
                </div>

                <button className="creation-screen__arrow" onClick={handleNext} aria-label="Tipo siguiente">▶</button>
            </div>

            {/* Form */}
            <div className="creation-screen__form" onClick={(e) => e.stopPropagation()}>
                <label className="creation-screen__label">NOMBRE:</label>
                <p className="creation-screen__helper-text">Dale un nombre a tu Regenmon</p>
                <div className="creation-screen__input-wrapper">
                    <input
                        type="text"
                        className={`creation-screen__input ${error ? 'creation-screen__input--error' : ''}`}
                        value={name}
                        onChange={handleNameChange}
                        onFocus={() => { inputFocusedRef.current = true; }}
                        onBlur={() => { inputFocusedRef.current = false; }}
                        placeholder="Nombre..."
                        maxLength={15}
                    />
                    <div className="creation-screen__char-count">
                        <span style={{ color: name.length > 15 ? '#ef4444' : name.length >= 2 ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
                            {name.length}/15
                        </span>
                    </div>
                </div>
                {error && <p className="creation-screen__error">{error}</p>}
            </div>

            {/* Action */}
            <button
                className="creation-screen__submit-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit();
                }}
                disabled={!isValid}
            >
                ¡DESPERTAR!
            </button>
        </div>
    );
}
