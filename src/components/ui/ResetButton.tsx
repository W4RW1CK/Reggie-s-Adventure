import React, { useState, useEffect, useCallback } from 'react';

interface ResetButtonProps {
    onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirm = () => {
        setShowConfirm(false);
        onReset();
    };

    const handleCancel = useCallback(() => {
        setShowConfirm(false);
    }, []);

    // Keyboard: Enter/Space/Escape = cancel when modal is open
    useEffect(() => {
        if (!showConfirm) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Only cancel keys — NOT confirm
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                // Don't cancel if the user explicitly clicked BORRAR TODO (button has focus)
                const target = e.target as HTMLElement;
                if (target?.textContent?.includes('BORRAR TODO')) return;

                e.preventDefault();
                handleCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showConfirm, handleCancel]);

    // Click on backdrop = cancel
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="text-[10px] text-red-400 opacity-80 hover:opacity-100 hover:text-red-300 transition-all border-b border-transparent hover:border-red-400 pb-0.5"
                aria-label="Reiniciar aventura"
            >
                REINICIAR AVENTURA
            </button>

            {showConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="reset-title"
                    onClick={handleBackdropClick}
                >
                    <div className="nes-container is-dark with-title max-w-sm w-full animate-popIn border-red-500">
                        <p id="reset-title" className="title text-red-500">⚠ ZONA DE PELIGRO</p>

                        <div className="flex flex-col gap-4 text-center">
                            <p className="text-sm">
                                ¿Estás seguro de que quieres romper La Conexión?
                            </p>
                            <p className="text-xs text-red-400">
                                Tu Regenmon volverá a ser un fragmento perdido en La Red Primordial. No recordará nada.
                            </p>
                            <p className="text-xs text-red-500 font-bold blink mb-2">
                                ESTA ACCIÓN ES IRREVERSIBLE
                            </p>

                            <div className="flex gap-4 justify-center mt-2">
                                <button
                                    onClick={handleCancel}
                                    className="nes-btn w-1/2 text-xs"
                                    autoFocus
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="nes-btn is-error w-1/2 text-xs"
                                >
                                    BORRAR TODO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
