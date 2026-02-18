export function TypingIndicator() {
    return (
        <div className="flex gap-1 p-2 mr-auto" aria-label="Tu Regenmon está pensando">
            <div className="w-1 h-1 animate-[typing-bounce_1.4s_infinite]" style={{ backgroundColor: 'var(--theme-text)' }}></div>
            <div className="w-1 h-1 animate-[typing-bounce_1.4s_infinite_0.2s]" style={{ backgroundColor: 'var(--theme-text)' }}></div>
            <div className="w-1 h-1 animate-[typing-bounce_1.4s_infinite_0.4s]" style={{ backgroundColor: 'var(--theme-text)' }}></div>
        </div>
    );
}
