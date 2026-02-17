import { CHAT_MAX_CHARS } from '@/lib/constants';
import classNames from 'classnames';
import { KeyboardEvent } from 'react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ value, onChange, onSend, isLoading, disabled, placeholder }: ChatInputProps) {
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!disabled && !isLoading && value.trim()) {
                onSend();
            }
        }
    };

    const charCount = value.length;
    const isOverLimit = charCount > CHAT_MAX_CHARS;

    return (
        <div className="flex flex-col gap-2 mt-4">
            <div className="relative">
                <textarea
                    className={classNames(
                        "nes-textarea w-full h-[80px] text-[10px] resize-none p-2 font-['Press_Start_2P'] leading-relaxed",
                        "border-2 outline-none",
                        "focus:border-[#f5c542]"
                    )}
                    placeholder={placeholder || "¿Qué le quieres decir?"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled || isLoading}
                    maxLength={CHAT_MAX_CHARS}
                    aria-label="Mensaje para tu Regenmon"
                    style={{ backgroundColor: 'var(--theme-input-bg)', color: 'var(--theme-input-text)', borderColor: 'var(--theme-border)' }}
                />
                <span className={classNames(
                    "absolute bottom-2 right-2 text-[8px]",
                    isOverLimit ? "text-[#e74c3c]" : "text-[#a0a0a0]"
                )}>
                    {charCount}/{CHAT_MAX_CHARS}
                </span>
            </div>

            <button
                type="button"
                className={classNames(
                    "nes-btn w-full text-[10px] py-2",
                    isLoading || disabled || !value.trim()
                        ? "is-disabled opacity-50 cursor-not-allowed bg-[#555555] text-[#a0a0a0]"
                        : "is-success bg-[#4caf50] text-white hover:bg-[#66bb6a]"
                )}
                onClick={onSend}
                disabled={disabled || isLoading || !value.trim()}
                aria-label="Enviar mensaje"
            >
                {isLoading ? "Enviando..." : "Enviar >"}
            </button>
        </div>
    );
}
