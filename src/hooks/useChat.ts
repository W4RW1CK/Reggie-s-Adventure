import { useState, useEffect, useCallback } from 'react';
import {
    ChatMessage,
    ChatRequest,
    ChatResponse,
    RegenmonData,
    RegenmonStats
} from '@/lib/types';
import {
    saveChatHistory,
    loadChatHistory,
    savePlayerData,
    loadPlayerData
} from '@/lib/storage';
import {
    CHAT_COOLDOWN_MS,
    CHAT_SPIRIT_MAX_CHANGE,
    CHAT_PULSE_CHANGE,
    CHAT_ESENCIA_COST,
    CHAT_MAX_MESSAGES,
    CHAT_CRITICAL_THRESHOLD
} from '@/lib/constants';

interface UseChatProps {
    regenmon: RegenmonData | null;
    updateStatAction: (deltas: Partial<RegenmonStats>) => void;
}

export function useChat({ regenmon, updateStatAction }: UseChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastMessageTime, setLastMessageTime] = useState(0);

    // Load history on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const history = loadChatHistory();
            setMessages(history);
        }
    }, []);

    const toggleChat = () => setIsOpen(prev => !prev);

    const sendMessage = useCallback(async (text: string) => {
        if (!regenmon || isLoading) return;

        // Rate limit check (frontend)
        const now = Date.now();
        if (now - lastMessageTime < CHAT_COOLDOWN_MS) return;

        // Critical state check
        const { espiritu, pulso, esencia } = regenmon.stats;
        if (espiritu < CHAT_CRITICAL_THRESHOLD ||
            pulso < CHAT_CRITICAL_THRESHOLD ||
            esencia < CHAT_CRITICAL_THRESHOLD) {
            // Should be handled by UI disabling, but safety check
            return;
        }

        setIsLoading(true);
        setLastMessageTime(now);

        // 1. Optimistic User Message
        const userMsg: ChatMessage = {
            role: 'user',
            content: text,
            timestamp: now,
        };

        const updatedHistory = [...messages, userMsg].slice(-CHAT_MAX_MESSAGES);
        setMessages(updatedHistory);
        saveChatHistory(updatedHistory);

        try {
            // 2. Prepare Request
            const playerData = loadPlayerData();
            const request: ChatRequest = {
                message: text,
                history: updatedHistory.slice(-10), // Send updated history including current message
                regenmon: {
                    name: regenmon.name,
                    type: regenmon.type,
                    stats: regenmon.stats,
                    daysAlive: Math.floor((now - new Date(regenmon.createdAt).getTime()) / (1000 * 60 * 60 * 24))
                },
                playerName: playerData?.name
            };

            // 3. Call API
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!res.ok) {
                throw new Error(`API Error: ${res.status}`);
            }

            const data: ChatResponse = await res.json();

            // 4. Handle Response
            const aiMsg: ChatMessage = {
                role: 'assistant',
                content: data.message,
                timestamp: Date.now(),
            };

            const finalHistory = [...updatedHistory, aiMsg].slice(-CHAT_MAX_MESSAGES);
            setMessages(finalHistory);
            saveChatHistory(finalHistory);

            // 5. Update Stats
            updateStatAction({
                ...(data.statsChange || {}),
                pulso: CHAT_PULSE_CHANGE,
                esencia: CHAT_ESENCIA_COST
            });

            // 6. Handle Name Discovery
            if (data.playerName && !playerData) {
                savePlayerData({
                    name: data.playerName,
                    discoveredAt: Date.now()
                });
            }

        } catch (error) {
            console.error('Chat Error:', error);
            
            // Remove the optimistically added user message
            setMessages(prev => prev.slice(0, -1));
            
            // Add system error message
            const errorMsg: ChatMessage = {
                role: 'assistant',
                content: '... (ruido estático) ...',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMsg]);
            saveChatHistory([...messages, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    }, [regenmon, messages, isLoading, lastMessageTime, updateStatAction]);

    return {
        isOpen,
        toggleChat,
        messages,
        sendMessage,
        isLoading
    };
}
