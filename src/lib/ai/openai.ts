import OpenAI from 'openai';
import { ChatMessage, ChatResponse } from '../types';
import { AIProvider } from './interface';

export function createOpenAIProvider(apiKey: string): AIProvider {
    const openai = new OpenAI({ apiKey });
    // Model is usually fixed by the platform/key, but we default to gpt-4o-mini as recommended
    const MODEL = 'gpt-4o-mini';

    return {
        async chat(systemPrompt: string, history: ChatMessage[], userMessage: string): Promise<ChatResponse> {
            try {
                const completion = await openai.chat.completions.create({
                    model: MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...history.map(msg => ({
                            role: msg.role,
                            content: msg.content,
                        })),
                        { role: 'user', content: userMessage },
                    ],
                    response_format: { type: 'json_object' }, // Enforce JSON if model supports it
                });

                const responseText = completion.choices[0].message.content || '{}';

                try {
                    const data = JSON.parse(responseText) as ChatResponse;
                    if (data.statsChange) {
                        const s = data.statsChange;
                        s.espiritu = Math.max(-3, Math.min(5, s.espiritu ?? 0));
                        s.pulso = Math.max(-2, Math.min(3, s.pulso ?? 0));
                        s.esencia = Math.max(-3, Math.min(-1, s.esencia ?? -1));
                        s.fragmentos = Math.max(0, Math.min(5, s.fragmentos ?? 0));
                    }
                    return data;
                } catch (e) {
                    console.error('Failed to parse OpenAI JSON response:', responseText, e);
                    return {
                        message: responseText.slice(0, 200),
                        statsChange: { espiritu: 0, esencia: -1, fragmentos: 1 },
                    };
                }

            } catch (error) {
                console.error('OpenAI API Error:', error);
                throw error;
            }
        },
    };
}
