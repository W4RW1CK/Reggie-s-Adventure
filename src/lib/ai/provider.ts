import { ChatMessage, ChatResponse } from '../types';
import { createGeminiProvider } from './gemini';
import { createOpenAIProvider } from './openai';
import { createMockProvider } from './mock'; // [NEW]
import { AIProvider } from './interface';

export function getAIProvider(): AIProvider {
    // 1. Check for Gemini Key (Development/Local)
    if (process.env.GEMINI_API_KEY) {
        return createGeminiProvider(process.env.GEMINI_API_KEY);
    }

    // 2. Check for OpenAI Key (Production/Vercel)
    if (process.env.OPENAI_API_KEY) {
        return createOpenAIProvider(process.env.OPENAI_API_KEY);
    }

    // 3. Fallback to Mock Provider in Development
    if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ No valid API keys found. Using Mock AI Provider for testing.');
        return createMockProvider();
    }

    // 4. Error in Production
    throw new Error('No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY.');
}
