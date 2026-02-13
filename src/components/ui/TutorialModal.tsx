import React, { useState } from 'react';

interface TutorialModalProps {
    onDismiss: (dontShowAgain: boolean) => void;
}

export default function TutorialModal({ onDismiss }: TutorialModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn p-4">
            <div className="nes-container is-dark with-title max-w-md w-full animate-slideUp">
                <p className="title text-[#f1c40f]">GUÍA DE CUIDADO</p>

                <div className="flex flex-col gap-4 text-xs sm:text-sm">
                    <p>
                        Tu Regenmon necesita atención constante para sobrevivir y evolucionar.
                    </p>

                    <div className="grid grid-cols-1 gap-2 my-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🔮</span>
                            <div>
                                <span className="text-[#9b59b6] font-bold">ESPÍRITU</span>
                                <p className="text-[10px] opacity-70">Afecta su voluntad. Mejóralo descansando o jugando.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xl">💛</span>
                            <div>
                                <span className="text-[#f1c40f] font-bold">PULSO</span>
                                <p className="text-[10px] opacity-70">Su energía vital. Baja con el entrenamiento, sube con comida/sueño.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xl">🍖</span>
                            <div>
                                <span className="text-[#e74c3c] font-bold">HAMBRE</span>
                                <p className="text-[10px] opacity-70">Si llega a 100, tu Regenmon sufrirá. Mantenla bajo control.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-2 rounded text-[10px] border border-gray-600">
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
                        >
                            ¡ENTENDIDO!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
