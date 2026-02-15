export function TypingIndicator() {
    return (
        <div className="flex gap-1 p-2 mr-auto" aria-label="Tu Regenmon está pensando">
            <div className="w-1 h-1 bg-[#e8e8e8] animate-[typing-bounce_1.4s_infinite]"></div>
            <div className="w-1 h-1 bg-[#e8e8e8] animate-[typing-bounce_1.4s_infinite_0.2s]"></div>
            <div className="w-1 h-1 bg-[#e8e8e8] animate-[typing-bounce_1.4s_infinite_0.4s]"></div>
        </div>
    );
}
