import { GoogleGenerativeAI } from '@google/generative-ai';
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

export function createGeminiVisionProvider(apiKey: string): VisionProvider {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    return {
        async evaluate(imageBase64: string, systemPrompt: string): Promise<VisionResponse> {
            try {
                // Strip data URI prefix if present
                const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

                const result = await model.generateContent([
                    { text: systemPrompt },
                    {
                        inlineData: {
                            mimeType: 'image/jpeg',
                            data: base64Data,
                        },
                    },
                ]);

                const responseText = result.response.text();

                try {
                    const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
                    return JSON.parse(cleanText) as VisionResponse;
                } catch {
                    console.error('Failed to parse Gemini Vision JSON response:', responseText);
                    return { ...FALLBACK_RESPONSE, fragments: Math.floor(Math.random() * 3) + 2 };
                }
            } catch (error) {
                console.error('Gemini Vision API Error:', error);
                throw error;
            }
        },
    };
}
