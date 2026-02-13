import React, { useState } from 'react';

interface ResetButtonProps {
    onReset: () => void;
}

export default function ResetButton({ onReset }: ResetButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);

    const handleConfirm = () => {
        setShowConfirm(false);
        onReset();
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="text-[10px] text-red-400 opacity-60 hover:opacity-100 hover:text-red-300 transition-all border-b border-transparent hover:border-red-400 pb-0.5"
            >
                REINICIAR AVENTURA
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn p-4">
                    <div className="nes-container is-dark with-title max-w-sm w-full animate-popIn border-red-500">
                        <p className="title text-red-500">⚠ ZONA DE PELIGRO</p>

                        <div className="flex flex-col gap-4 text-center">
                            <p className="text-sm">
                                ¿Estás seguro de que quieres abandonar este mundo?
                            </p>
                            <p className="text-xs text-red-400">
                                Tu Regenmon y todo su progreso se perderán para siempre en el vacío digital.
                            </p>
                            <p className="text-xs text-red-500 font-bold blink mb-2">
                                ESTA ACCIÓN ES IRREVERSIBLE
                            </p>

                            <div className="flex gap-4 justify-center mt-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="nes-btn w-1/2 text-xs"
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
