import { createGeminiVisionProvider } from './gemini-vision';
import { createOpenAIVisionProvider } from './openai-vision';
import { VisionProvider } from './vision-interface';

export function getVisionProvider(): VisionProvider {
    // 1. Check for Gemini Key
    if (process.env.GEMINI_API_KEY) {
        return createGeminiVisionProvider(process.env.GEMINI_API_KEY);
    }

    // 2. Check for OpenAI Key
    if (process.env.OPENAI_API_KEY) {
        return createOpenAIVisionProvider(process.env.OPENAI_API_KEY);
    }

    // 3. No provider available
    throw new Error('No Vision AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY.');
}
