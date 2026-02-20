import { CHAT_MAX_CHARS } from '@/lib/constants';
import classNames from 'classnames';
import { KeyboardEvent, useRef, useEffect } from 'react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onPhotoClick?: () => void;
    isLoading: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ value, onChange, onSend, onPhotoClick, isLoading, disabled, placeholder }: ChatInputProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea to fit content
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, [value]);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && !isLoading && value.trim()) {
                onSend();
            }
        }
    };

    const charCount = value.length;
    const canSend = !disabled && !isLoading && value.trim().length > 0;

    return (
        <div className="chat-input-bar">
            {/* Clip/Photo button */}
            {onPhotoClick && (
                <button
                    type="button"
                    className="chat-input-bar__clip"
                    onClick={onPhotoClick}
                    aria-label="Adjuntar foto"
                >
                    📎
                </button>
            )}

            {/* Input field */}
            <div className="chat-input-bar__field">
                <textarea
                    ref={textareaRef}
                    className="chat-input-bar__input"
                    placeholder={placeholder || "Escribe algo..."}
                    value={value}
                    onChange={(e) => onChange(e.target.value.slice(0, CHAT_MAX_CHARS))}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isLoading}
                    maxLength={CHAT_MAX_CHARS}
                    rows={1}
                    aria-label="Mensaje para tu Regenmon"
                />
                <span className={classNames(
                    "chat-input-bar__counter",
                    charCount > CHAT_MAX_CHARS * 0.9 && "chat-input-bar__counter--warn"
                )}>
                    {charCount}/{CHAT_MAX_CHARS}
                </span>
            </div>

            {/* Send button */}
            <button
                type="button"
                className={classNames(
                    "chat-input-bar__send",
                    canSend && "chat-input-bar__send--active"
                )}
                onClick={onSend}
                disabled={!canSend}
                aria-label="Enviar mensaje"
            >
                {isLoading ? "…" : "→"}
            </button>
        </div>
    );
}
