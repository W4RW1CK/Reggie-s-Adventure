export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
    // onComplete could be used if the screen itself drove the timer, 
    // but useScreenManager handles it. This is just View.
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <h1 className="text-4xl animate-pulse">LOADING...</h1>
        </div>
    );
}

export function TitleScreen({ onStart }: { onStart: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-900 text-white">
            <h1 className="text-4xl mb-8">REGGIE'S ADVENTURE</h1>
            <button
                onClick={onStart}
                className="px-6 py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400"
            >
                PRESS START
            </button>
        </div>
    );
}

export function StoryScreen({ onContinue }: { onContinue: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-8">
            <p className="mb-8 text-xl max-w-md text-center">
                "En un rincón olvidado... una señal se enciende."
            </p>
            <button
                onClick={onContinue}
                className="px-4 py-2 bg-white text-black"
            >
                CONTINUAR ▶
            </button>
        </div>
    );
}

export function CreationScreen({ onDespertar }: { onDespertar: (name: string, type: any) => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-purple-900 text-white">
            <h2 className="text-2xl mb-4">CREATION SCREEN</h2>
            <button
                onClick={() => onDespertar('Reggie', 'rayo')}
                className="px-4 py-2 bg-green-500 hover:bg-green-400"
            >
                ¡DESPERTAR! (Test)
            </button>
        </div>
    );
}

export function TransitionScreen({ onComplete }: { onComplete: () => void }) {
    return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
            <h2 className="text-xl animate-bounce">DESPERTANDO...</h2>
            <button onClick={onComplete} className="mt-4 text-xs text-gray-500">(Skip)</button>
        </div>
    );
}

export function GameScreen({ onReset }: { onReset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-green-800 text-white">
            <h1 className="text-4xl mb-4">GAME SCREEN</h1>
            <p>Your Regenmon is alive!</p>
            <button
                onClick={onReset}
                className="mt-8 px-4 py-2 bg-red-600 hover:bg-red-500"
            >
                RESET GAME
            </button>
        </div>
    );
}
