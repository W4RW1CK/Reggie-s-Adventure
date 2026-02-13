'use client';

import { useState } from 'react';
import { RegenmonType } from '@/lib/types';
import RegenmonSVG from '@/components/regenmon/RegenmonSVG';

interface CreationScreenProps {
    onDespertar: (name: string, type: RegenmonType) => void;
}

const TYPES: { type: RegenmonType; label: string; desc: string; color: string }[] = [
    { type: 'rayo', label: 'RAYO', desc: 'Ágil y enérgico', color: '#f5c542' },
    { type: 'flama', label: 'FLAMA', desc: 'Fuerte y apasionado', color: '#e74c3c' },
    { type: 'hielo', label: 'HIELO', desc: 'Calmado y resistente', color: '#3498db' },
];

export default function CreationScreen({ onDespertar }: CreationScreenProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const currentType = TYPES[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? TYPES.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === TYPES.length - 1 ? 0 : prev + 1));
    };

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

    const handleSubmit = () => {
        if (name.length < 2 || name.length > 15) {
            setError('Nombre inválido');
            return;
        }
        onDespertar(name, currentType.type);
    };

    return (
        <div className="creation-screen">
            <div className="creation-screen__scanlines" />

            <h1 className="creation-screen__title">CREA TU REGENMON</h1>

            {/* Carousel */}
            <div className="creation-screen__carousel">
                <button className="creation-screen__arrow" onClick={handlePrev}>◀</button>

                <div className="creation-screen__showcase">
                    <div className="creation-screen__svg-container" style={{ borderColor: currentType.color }}>
                        <RegenmonSVG type={currentType.type} size={150} />
                    </div>
                    <div className="creation-screen__info">
                        <h2 className="creation-screen__type-label" style={{ color: currentType.color }}>
                            {currentType.label}
                        </h2>
                        <p className="creation-screen__type-desc">{currentType.desc}</p>
                    </div>
                </div>

                <button className="creation-screen__arrow" onClick={handleNext}>▶</button>
            </div>

            {/* Form */}
            <div className="creation-screen__form">
                <label className="creation-screen__label">NOMBRE:</label>
                <input
                    type="text"
                    className={`creation-screen__input ${error ? 'creation-screen__input--error' : ''}`}
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Escribe un nombre..."
                    maxLength={15}
                />
                {error && <p className="creation-screen__error">{error}</p>}
            </div>

            {/* Action */}
            <button
                className="creation-screen__submit-btn"
                onClick={handleSubmit}
                disabled={name.length < 2 || name.length > 15}
            >
                ¡DESPERTAR!
            </button>
        </div>
    );
}
