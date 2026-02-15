import { ChatMessage, ChatResponse } from '../types';
import { createGeminiProvider } from './gemini';
import { createOpenAIProvider } from './openai';
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

    // 3. Fallback / Error
    throw new Error('No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY.');
}
