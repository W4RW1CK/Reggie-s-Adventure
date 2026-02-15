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
        const body = await req.json() as ChatRequest;
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

        return NextResponse.json(response);

    } catch (error: any) {
        console.error('Chat API Error:', error);

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
