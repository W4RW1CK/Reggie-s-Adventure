import React, { useState, useEffect, useCallback } from 'react';

interface TutorialModalProps {
    onDismiss: (dontShowAgain: boolean) => void;
}

export default function TutorialModal({ onDismiss }: TutorialModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Keyboard: Enter/Space = dismiss
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            // Don't trigger if user is interacting with the checkbox
            if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
            e.preventDefault();
            onDismiss(dontShowAgain);
        }
    }, [onDismiss, dontShowAgain]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Click on backdrop (outside modal) = dismiss
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only if clicking the backdrop itself, not the modal content
        if (e.target === e.currentTarget) {
            onDismiss(dontShowAgain);
        }
    };

    return (
        <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-title"
            onClick={handleBackdropClick}
        >
            <div className="nes-container is-dark with-title max-w-md w-full animate-slideUp">
                <p id="tutorial-title" className="title text-[#f1c40f]">GUÍA DE CUIDADO</p>

                <div className="flex flex-col gap-4 text-xs sm:text-sm">
                    <p>
                        Tu Regenmon necesita atención constante para sobrevivir y evolucionar.
                    </p>

                    <div className="grid grid-cols-1 gap-2 my-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔮</span>
                            <div>
                                <span className="text-[#9b59b6] font-bold">ESPÍRITU</span>
                                <p className="text-[10px] opacity-90">Afecta su voluntad. Mejóralo descansando o jugando.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xl">💛</span>
                            <div>
                                <span className="text-[#f1c40f] font-bold">PULSO</span>
                                <p className="text-[10px] opacity-90">Su energía vital. Baja con el entrenamiento, sube con comida/sueño.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xl">🍖</span>
                            <div>
                                <span className="text-[#e74c3c] font-bold">HAMBRE</span>
                                <p className="text-[10px] opacity-90">Si llega a 100, tu Regenmon sufrirá. Mantenla bajo control.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-2 text-[10px] border-4 border-gray-600">
                        <span className="text-yellow-400">⚡ OJO:</span> Los stats decaen incluso cuando no estás. ¡Vuelve pronto!
                    </div>

                    <div className="mt-4 flex flex-col gap-3">
                        <label className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                            <input
                                type="checkbox"
                                className="nes-checkbox is-dark"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                            />
                            <span className="text-xs">No volver a mostrar esta guía</span>
                        </label>

                        <button
                            onClick={() => onDismiss(dontShowAgain)}
                            className="nes-btn is-primary w-full"
                            autoFocus
                        >
                            ¡ENTENDIDO!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
