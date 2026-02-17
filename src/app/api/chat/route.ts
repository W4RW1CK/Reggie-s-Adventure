import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/lib/types';
import { getAIProvider } from '@/lib/ai/provider';
import { buildSystemPrompt } from '@/lib/ai/prompts';

// Simple in-memory rate limiter (not persistent across restarts/serverless cold starts)
// For production, use Redis or Vercel KV
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimit.get(ip) || [];

    // Filter out old timestamps
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

    if (recent.length >= MAX_REQUESTS) {
        return true;
    }

    recent.push(now);
    rateLimit.set(ip, recent);
    return false;
}

export async function POST(req: NextRequest) {
    let body: ChatRequest | null = null;

    try {
        // 1. Rate Limiting
        // In Vercel, x-forwarded-for works, or fallback to unknown
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Tu Regenmon necesita un respiro... (Rate limit exceeded)' },
                { status: 429 }
            );
        }

        // 2. Parse Request
        body = await req.json() as ChatRequest;
        const { message, history, regenmon, playerName } = body;

        if (!message || !regenmon) {
            return NextResponse.json(
                { error: 'Invalid request: message and regenmon data required' },
                { status: 400 }
            );
        }

        // 3. Build System Prompt (The Core Lore)
        const systemPrompt = buildSystemPrompt(
            regenmon.name,
            regenmon.type,
            regenmon.stats,
            regenmon.daysAlive,
            playerName
        );

        // 4. Get AI Provider (Gemini or OpenAI)
        const provider = getAIProvider();

        // 5. Generate Response
        const response = await provider.chat(systemPrompt, history || [], message);

        // 6. Log in Development
        if (process.env.NODE_ENV === 'development') {
            console.log('--- CHAT DEBUG ---');
            console.log('System Prompt:', systemPrompt);
            console.log('User Message:', message);
            console.log('AI Response:', response);
            console.log('------------------');
        }

        // 7. Clamp statsChange values
        if (response.statsChange) {
            const s = response.statsChange;
            s.espiritu = Math.max(-5, Math.min(5, s.espiritu ?? 0));
            s.pulso = Math.max(-5, Math.min(5, s.pulso ?? 0));
            s.esencia = Math.max(-4, Math.min(-1, s.esencia ?? -1));
            s.fragmentos = Math.max(0, Math.min(5, s.fragmentos ?? 0));
        }

        return NextResponse.json(response);

    } catch (error: any) {
        console.error('Chat API Error:', error);

        // [FIX] Fallback to Mock Provider in Development if API fails
        if (process.env.NODE_ENV === 'development' && body) {
            console.warn('⚠️ API Request failed. Falling back to Mock Provider.');
            try {
                // Dynamic import to avoid circular deps if needed, or just import at top if clean
                const { createMockProvider } = require('@/lib/ai/mock');
                const mockProvider = createMockProvider();
                const response = await mockProvider.chat(
                    "SYSTEM_PROMPT_IGNORED_BY_MOCK",
                    [],
                    body.message || ""
                );
                return NextResponse.json(response);
            } catch (mockError) {
                console.error('Mock Fallback Error:', mockError);
            }
        }

        // Handle missing provider configuration specifically
        if (error.message.includes('No AI provider configured')) {
            return NextResponse.json(
                { error: 'Configuration Error: AI Provider not set up.' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Tu Regenmon no puede responder ahora... (Internal Error)' },
            { status: 500 }
        );
    }
}
