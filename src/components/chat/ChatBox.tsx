'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, RegenmonType, RegenmonStats } from '@/lib/types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { CHAT_MAX_MESSAGES } from '@/lib/constants';
import classNames from 'classnames';

interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    regenmonType: RegenmonType;
    regenmonName: string;
    stats: RegenmonStats; // For compact display (Session 2 requirement)
}

export function ChatBox({
    isOpen,
    onClose,
    messages,
    onSendMessage,
    isLoading,
    regenmonType,
    regenmonName,
    stats
}: ChatBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isLoading]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pointer-events-none"
            role="dialog"
            aria-label={`Chat con ${regenmonName}`}
        >
            <div className="w-full max-w-[600px] pointer-events-auto animate-fade-in-up">
                {/* Header / Config Bar */}
                <div className="flex justify-between items-center text-white p-2 border-b-4 border-black font-['Press_Start_2P'] text-[10px]" style={{ backgroundColor: 'var(--theme-chat-header)' }}>
                    <span>Conversando con {regenmonName}</span>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-black"
                        aria-label="Cerrar chat"
                    >
                        ✕
                    </button>
                </div>

                {/* Main Container */}
                <div className="border-4 p-4 flex flex-col gap-4 max-h-[70vh]" style={{ backgroundColor: 'var(--theme-chat-bg)', borderColor: 'var(--theme-border)' }}>

                    {/* Compact Stats (Session 2 Requirement) */}
                    <div className="flex justify-center gap-4 text-[8px] pb-2 font-['Press_Start_2P']" style={{ color: 'var(--theme-text-secondary)', borderBottom: '1px solid var(--theme-border)' }}>
                        <span>🔮 {stats.espiritu.toFixed(0)}</span>
                        <span>💛 {stats.pulso.toFixed(0)}</span>
                        <span>🌱 {stats.esencia.toFixed(0)}</span>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[400px] pr-2 scrollbar-nes flex flex-col">
                        {messages.length === 0 && (
                            <div className="text-center text-[8px] my-auto italic" style={{ color: 'var(--theme-muted)' }}>
                                {regenmonName} te está mirando con curiosidad...
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <ChatBubble
                                key={`${msg.timestamp}-${idx}`}
                                message={msg}
                                regenmonType={regenmonType}
                            />
                        ))}

                        {isLoading && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <ChatInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSend={handleSend}
                        isLoading={isLoading}
                        placeholder={`Dile algo a ${regenmonName}...`}
                    />
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.3s ease-out forwards;
                }
                .scrollbar-nes::-webkit-scrollbar {
                    width: 8px;
                }
                .scrollbar-nes::-webkit-scrollbar-track {
                    background: #2c2c2c; 
                }
                .scrollbar-nes::-webkit-scrollbar-thumb {
                    background: #4a4a4a; 
                    border: 2px solid #2c2c2c;
                }
            `}</style>
        </div>
    );
}
