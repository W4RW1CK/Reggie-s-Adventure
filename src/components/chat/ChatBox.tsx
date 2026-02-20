'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, RegenmonType, RegenmonStats } from '@/lib/types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { TypingIndicator } from './TypingIndicator';
import { loadMemories } from '@/lib/storage';

interface ChatBoxProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    isLoading: boolean;
    regenmonType: RegenmonType;
    regenmonName: string;
    stats: RegenmonStats;
    isDesktop?: boolean;
}

export function ChatBox({
    isOpen,
    onClose,
    messages,
    onSendMessage,
    isLoading,
    regenmonType,
    regenmonName,
    stats,
    isDesktop = false,
}: ChatBoxProps) {
    const [inputValue, setInputValue] = useState('');
    const [memoryCount, setMemoryCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setMemoryCount(loadMemories().length);
        }
    }, [messages]);

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

    // Mobile: require isOpen
    if (!isOpen && !isDesktop) return null;

    // Desktop: side panel (always visible when rightPanel=chat)
    if (isDesktop) {
        return (
            <div className="game-screen__chat-panel" role="dialog" aria-label={`Chat con ${regenmonName}`}>
                {/* Header */}
                <div className="chat-panel__header">
                    <span className="chat-panel__header-info">
                        <span className="chat-panel__type-icon">
                            {regenmonType === 'rayo' ? '⚡' : regenmonType === 'flama' ? '🔥' : '❄️'}
                        </span>
                        <span className="chat-panel__name">{regenmonName}</span>
                    </span>
                </div>

                {/* Messages */}
                <div className="chat-panel__messages">
                    {messages.length === 0 && (
                        <div className="chat-panel__empty">
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

                {/* Input bar */}
                <div className="chat-panel__input-bar">
                    <ChatInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSend={handleSend}
                        isLoading={isLoading}
                        placeholder={`Dile algo a ${regenmonName}...`}
                    />
                </div>
            </div>
        );
    }

    // Mobile/Tablet: full overlay (existing behavior)
    return (
        <div
            className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 pointer-events-none"
            role="dialog"
            aria-label={`Chat con ${regenmonName}`}
        >
            <div className="w-full max-w-[600px] pointer-events-auto animate-fade-in-up">
                {/* Header */}
                <div className="flex justify-between items-center text-white p-2 border-b-4 border-black font-['Press_Start_2P'] text-[10px]" style={{ backgroundColor: 'var(--theme-chat-header)' }}>
                    <span>
                        {regenmonType === 'rayo' ? '⚡' : regenmonType === 'flama' ? '🔥' : '❄️'}{' '}
                        {regenmonName}
                    </span>
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
                    background: var(--theme-stat-bar-bg); 
                }
                .scrollbar-nes::-webkit-scrollbar-thumb {
                    background: var(--theme-border); 
                    border: 2px solid var(--theme-stat-bar-bg);
                }
            `}</style>
        </div>
    );
}
