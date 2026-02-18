import React, { useState, useEffect, useCallback } from 'react';

interface TutorialModalProps {
    onDismiss: (dontShowAgain: boolean) => void;
}

const TOTAL_STEPS = 3;

export default function TutorialModal({ onDismiss }: TutorialModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);
    const [step, setStep] = useState(0);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
            e.preventDefault();
            if (step < TOTAL_STEPS - 1) {
                setStep(s => s + 1);
            } else {
                onDismiss(dontShowAgain);
            }
        }
    }, [onDismiss, dontShowAgain, step]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onDismiss(dontShowAgain);
        }
    };

    const titles = [
        "GUÍA DE LA CONEXIÓN",
        "ACCIONES DEL VÍNCULO",
        "HERRAMIENTAS ARCANAS",
    ];

    return (
        <div
            className="fixed inset-0 z-40 flex items-start sm:items-center justify-center backdrop-blur-sm animate-fadeIn overflow-y-auto"
            style={{ padding: 'clamp(8px, 2vw, 16px)' }}
            style={{ backgroundColor: 'var(--theme-modal-overlay)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tutorial-title"
            onClick={handleBackdropClick}
        >
            <div className="nes-container is-dark with-title max-w-lg w-full animate-slideUp my-auto" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                <p id="tutorial-title" className="title text-[#f1c40f]">
                    {titles[step]}
                </p>

                <div className="flex flex-col gap-4 text-xs sm:text-sm overflow-y-auto custom-scrollbar" style={{ maxHeight: '55vh' }}>

                    {/* STEP 0: STATS & FRAGMENTOS */}
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
                                        <p className="text-[10px] opacity-90">Cuánto cree en la regeneración. Se restaura al Purificar.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xl">💛</span>
                                    <div>
                                        <span className="text-[#f1c40f] font-bold">PULSO — Energía vital</span>
                                        <p className="text-[10px] opacity-90">Su fuerza para existir. Conversar la consume, Purificar la restaura.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xl">✨</span>
                                    <div>
                                        <span className="text-[#2ecc71] font-bold">ESENCIA — Vitalidad</span>
                                        <p className="text-[10px] opacity-90">La energía primordial que lo mantiene vivo. Purificar la restaura.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-xl">💠</span>
                                    <div>
                                        <span className="text-[#3498db] font-bold">FRAGMENTOS — Moneda arcana</span>
                                        <p className="text-[10px] opacity-90">Restos de datos puros. Los ganas al conversar y los gastas para Purificar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 1: CHAT, PURIFICAR, BUSCAR */}
                    {step === 1 && (
                        <div className="animate-fadeIn">
                            <p className="mb-4">
                                Has establecido una conexión directa. Ahora puedes <span className="text-[#2ecc71] font-bold">hablar</span> y <span className="text-[#9b59b6] font-bold">purificar</span>.
                            </p>

                            <div className="grid grid-cols-1 gap-4 my-2">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">💬</span>
                                    <div>
                                        <span className="text-[#2ecc71] font-bold">EL VÍNCULO</span>
                                        <p className="text-[10px] opacity-90">
                                            Cada palabra cuenta. Hablar le da <strong>Esperanza (+Espíritu)</strong> y te otorga <strong>Fragmentos 💠</strong>, pero requiere esfuerzo <strong>(-Pulso)</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🌀</span>
                                    <div>
                                        <span className="text-[#9b59b6] font-bold">PURIFICAR</span>
                                        <p className="text-[10px] opacity-90">
                                            Canaliza 10💠 para limpiar los datos corruptos. Restaura <strong>Esencia, Espíritu y Pulso</strong> de golpe. Úsalo sabiamente.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🔍</span>
                                    <div>
                                        <span className="text-[#e67e22] font-bold">BUSCAR FRAGMENTOS</span>
                                        <p className="text-[10px] opacity-90">
                                            ¿Sin Fragmentos? Busca entre los restos digitales. Un último recurso cuando tus reservas llegan a cero.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🧠</span>
                                    <div>
                                        <span className="text-[#3498db] font-bold">MEMORIA</span>
                                        <p className="text-[10px] opacity-90">
                                            Tu Regenmon aprende de ti. Cada conversación deja huellas que lo hacen evolucionar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TOOLS & SETTINGS */}
                    {step === 2 && (
                        <div className="animate-fadeIn">
                            <p className="mb-4">
                                El mundo digital te ofrece herramientas para gestionar la conexión.
                            </p>

                            <div className="grid grid-cols-1 gap-4 my-2">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">⚙️</span>
                                    <div>
                                        <span className="text-[#95a5a6] font-bold">CONFIGURACIÓN</span>
                                        <p className="text-[10px] opacity-90">
                                            Abre el panel de ajustes para cambiar el tema visual, activar la música, ajustar el tamaño del texto, renombrar a tu Regenmon o vincular tu cuenta.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📜</span>
                                    <div>
                                        <span className="text-[#f39c12] font-bold">HISTORIAL</span>
                                        <p className="text-[10px] opacity-90">
                                            Un registro arcano de todo lo que ha sucedido: purificaciones, búsquedas, conversaciones. La memoria del mundo.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🎵</span>
                                    <div>
                                        <span className="text-[#e74c3c] font-bold">LA VOZ DEL MUNDO</span>
                                        <p className="text-[10px] opacity-90">
                                            Al conversar, el ruido del mundo baja para que puedan escucharse. La música se atenúa durante el vínculo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-800 p-2 text-[10px] border-4 border-gray-600 mt-4 text-center italic text-gray-400">
                                &ldquo;Lo que regeneramos juntos, no se borra jamás.&rdquo;
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
                        {step > 0 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="nes-btn w-1/3 text-xs"
                            >
                                ◀
                            </button>
                        )}

                        {step < TOTAL_STEPS - 1 ? (
                            <button
                                onClick={() => setStep(s => s + 1)}
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
