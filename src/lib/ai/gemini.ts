import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatMessage, ChatResponse } from '../types';
import { AIProvider } from './interface';

export function createGeminiProvider(apiKey: string): AIProvider {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    return {
        async chat(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<ChatResponse> {
            try {
                // Construct the chat history for Gemini
                // Gemini expects specific role mapping: 'user' -> 'user', 'assistant' -> 'model'
                const chat = model.startChat({
                    history: [
                        {
                            role: 'user',
                            parts: [{ text: `System Instruction: ${systemPrompt}` }],
                        },
                        {
                            role: 'model',
                            parts: [{ text: 'Understood. I am ready to embody the Regenmon.' }],
                        },
                        ...history.map(msg => ({
                            role: msg.role === 'user' ? 'user' : 'model',
                            parts: [{ text: msg.content }],
                        })),
                    ],
                });

                const result = await chat.sendMessage(userMessage);
                const responseText = result.response.text();

                // Parse JSON response
                try {
                    // Clean up code blocks if Present
                    const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
                    const data = JSON.parse(cleanText) as ChatResponse;
                    return data;
                } catch (e) {
                    console.error('Failed to parse Gemini JSON response:', responseText, e);
                    // Fallback
                    return {
                        message: responseText.slice(0, 200), // Limit length just in case
                        spiritChange: 0,
                    };
                }

            } catch (error) {
                console.error('Gemini API Error:', error);
                throw error;
            }
        },
    };
}
