import OpenAI from 'openai';
import { VisionResponse } from '../types';
import { VisionProvider } from './vision-interface';

const FALLBACK_RESPONSE: VisionResponse = {
    fragments: Math.floor(Math.random() * 3) + 2,
    spiritChange: 0,
    pulseChange: -1,
    essenceChange: -1,
    diaryEntry: 'Vi algo... pero no logro recordarlo bien.',
    resonanceLevel: 'weak',
    resonanceReason: 'evaluation_fallback',
};

export function createOpenAIVisionProvider(apiKey: string): VisionProvider {
    const openai = new OpenAI({ apiKey });
    const MODEL = 'gpt-4o';

    return {
        async evaluate(imageBase64: string, systemPrompt: string): Promise<VisionResponse> {
            try {
                // Ensure proper data URI format
                const dataUri = imageBase64.startsWith('data:')
                    ? imageBase64
                    : `data:image/jpeg;base64,${imageBase64}`;

                const completion = await openai.chat.completions.create({
                    model: MODEL,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image_url',
                                    image_url: { url: dataUri },
                                },
                            ],
                        },
                    ],
                    response_format: { type: 'json_object' },
                });

                const responseText = completion.choices[0].message.content || '{}';

                try {
                    return JSON.parse(responseText) as VisionResponse;
                } catch {
                    console.error('Failed to parse OpenAI Vision JSON response:', responseText);
                    return { ...FALLBACK_RESPONSE, fragments: Math.floor(Math.random() * 3) + 2 };
                }
            } catch (error) {
                console.error('OpenAI Vision API Error:', error);
                throw error;
            }
        },
    };
}
