import React, { useState, useEffect, useCallback } from 'react';

interface TutorialModalProps {
    onDismiss: (dontShowAgain: boolean) => void;
}

export default function TutorialModal({ onDismiss }: TutorialModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [step, setStep] = useState(0); // 0: Intro/Stats, 1: Chat/Connection

    // Keyboard: Enter/Space = next or dismiss
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            // Don't trigger if user is interacting with the checkbox
            if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
            e.preventDefault();

            if (step === 0) {
                setStep(1);
            } else {
                onDismiss(dontShowAgain);
            }
        }
    }, [onDismiss, dontShowAgain, step]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Click on backdrop (outside modal) = dismiss
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            // Optional: maybe don't dismiss on backdrop to force reading? 
            // keeping it for usability but maybe check step?
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
                <p id="tutorial-title" className="title text-[#f1c40f]">
                    {step === 0 ? "GUÍA DE LA CONEXIÓN" : "TU ERES SU VOZ"}
                </p>

                <div className="flex flex-col gap-4 text-xs sm:text-sm h-[320px] overflow-y-auto custom-scrollbar">

                    {/* STEP 0: INTRO & STATS */}
                    {step === 0 && (
                        <div className="animate-fadeIn">
                            <p className="mb-4">
                                Tu Regenmon es un fragmento del mundo digital antiguo. Cuídalo para que juntos puedan regenerarlo.
                            </p>

                            <div className="grid grid-cols-1 gap-2 my-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🔮</span>
                                    <div>
                                        <span className="text-[#9b59b6] font-bold">ESPÍRITU — Esperanza</span>
                                        <p className="text-[10px] opacity-90">Cuánto cree en la regeneración. Descansa para recuperar la fe.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xl">💛</span>
                                    <div>
                                        <span className="text-[#f1c40f] font-bold">PULSO — Energía vital</span>
                                        <p className="text-[10px] opacity-90">Su fuerza para existir. Entrenar la consume, comer y dormir la restauran.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🍖</span>
                                    <div>
                                        <span className="text-[#e74c3c] font-bold">HAMBRE — Necesidad</span>
                                        <p className="text-[10px] opacity-90">Necesita datos limpios. Si llega a 100, la corrupción lo alcanza.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-2 text-[10px] border-4 border-gray-600 mt-2">
                                <span className="text-yellow-400">⚡ OJO:</span> El mundo digital se degrada incluso cuando no estás. ¡Vuelve pronto!
                            </div>
                        </div>
                    )}

                    {/* STEP 1: CHAT & CONNECTION */}
                    {step === 1 && (
                        <div className="animate-fadeIn">
                            <p className="mb-4">
                                Has establecido una conexión directa. Ahora puedes <span className="text-[#2ecc71] font-bold">hablar</span> con tu Regenmon.
                            </p>

                            <div className="grid grid-cols-1 gap-4 my-2">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <span className="text-[#2ecc71] font-bold">EL VÍNCULO</span>
                                        <p className="text-[10px] opacity-90">
                                            Cada palabra cuenta. Hablar le da <strong>Esperanza (+Espíritu)</strong>, pero requiere esfuerzo <strong>(-Pulso)</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🧠</span>
                                    <div>
                                        <span className="text-[#3498db] font-bold">MEMORIA</span>
                                        <p className="text-[10px] opacity-90">
                                            Tu Regenmon aprende de ti. Recordará tu nombre y los fragmentos de verdad que compartas.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🎵</span>
                                    <div>
                                        <span className="text-[#e74c3c] font-bold">LA VOZ</span>
                                        <p className="text-[10px] opacity-90">
                                            Al conversar, el ruido del mundo baja (la música se atenúa) para que puedan escucharse.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-2 text-[10px] border-4 border-gray-600 mt-4 text-center italic text-gray-400">
                                "Lo que regeneramos juntos, no se borra jamás."
                            </div>
                        </div>
                    )}

                </div>

                {/* FOOTER / CONTROLS */}
                <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-gray-700">
                    <label className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100">
                        <input
                            type="checkbox"
                            className="nes-checkbox is-dark"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <span className="text-xs">No volver a mostrar esta guía</span>
                    </label>

                    <div className="flex gap-2">
                        {step === 1 && (
                            <button
                                onClick={() => setStep(0)}
                                className="nes-btn w-1/3 text-xs"
                            >
                                ◀
                            </button>
                        )}

                        {step === 0 ? (
                            <button
                                onClick={() => setStep(1)}
                                className="nes-btn is-primary flex-1 animate-pulse"
                                autoFocus
                            >
                                SIGUIENTE ▶
                            </button>
                        ) : (
                            <button
                                onClick={() => onDismiss(dontShowAgain)}
                                className="nes-btn is-success flex-1"
                                autoFocus
                            >
                                ¡ENTENDIDO!
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
