import { NextRequest, NextResponse } from 'next/server';
import { VisionRequest, VisionResponse, ResonanceLevel, RegenmonMemory } from '@/lib/types';
import { getVisionProvider } from '@/lib/ai/vision-provider';
import { buildVisionPrompt } from '@/lib/ai/vision-prompts';

// Rate limiting: max 5 evaluations per minute per IP
const rateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_EVALUATIONS = 5;

// ~5MB binary → ~6.67MB base64 string length
const MAX_BASE64_LENGTH = 6_700_000;

const VALID_TYPES = ['rayo', 'flama', 'hielo'] as const;
const VALID_RESONANCE: ResonanceLevel[] = ['weak', 'medium', 'strong', 'penalizing'];

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimit.get(ip) || [];
    const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);

    if (recent.length >= MAX_EVALUATIONS) {
        return true;
    }

    recent.push(now);
    rateLimit.set(ip, recent);
    return false;
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function clampResponse(raw: VisionResponse): VisionResponse {
    return {
        fragments: clamp(raw.fragments ?? 2, 0, 12),
        spiritChange: clamp(raw.spiritChange ?? 0, -5, 5),
        pulseChange: clamp(raw.pulseChange ?? -1, -3, 3),
        essenceChange: clamp(raw.essenceChange ?? -1, -2, -1),
        diaryEntry: (raw.diaryEntry || 'Vi algo... pero no logro recordarlo bien.').slice(0, 150),
        resonanceLevel: VALID_RESONANCE.includes(raw.resonanceLevel) ? raw.resonanceLevel : 'weak',
        resonanceReason: raw.resonanceReason || 'unknown',
    };
}

function getFallbackResponse(): VisionResponse {
    return {
        fragments: Math.floor(Math.random() * 3) + 2,
        spiritChange: 0,
        pulseChange: -1,
        essenceChange: -1,
        diaryEntry: 'Vi algo... pero no logro recordarlo bien.',
        resonanceLevel: 'weak',
        resonanceReason: 'evaluation_fallback',
    };
}

function extractKeywords(text: string): string[] {
    return text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
}

function calculateCoherenceBonus(memories: RegenmonMemory[], currentReason: string): number {
    // Look at recent memories for recurring theme keywords
    const recentMemories = memories.slice(-5);
    if (recentMemories.length < 3) return 0;

    const memoryTexts = recentMemories.map(m => m.value.toLowerCase());
    const currentWords = extractKeywords(currentReason);

    // Count how many memory values share keywords with the current reason
    let matchCount = 0;
    for (const memText of memoryTexts) {
        const memWords = extractKeywords(memText);
        const hasOverlap = currentWords.some(w => memWords.includes(w));
        if (hasOverlap) matchCount++;
    }

    // 3+ matching memories = +1, 4+ = +2
    if (matchCount >= 4) return 2;
    if (matchCount >= 3) return 1;
    return 0;
}

export async function POST(req: NextRequest) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Tu Regenmon necesita tiempo para procesar lo que vio...' },
                { status: 429 }
            );
        }

        // 2. Parse Request
        const body = await req.json() as VisionRequest;
        const { imageBase64, regenmonType, regenmonName, stats, memories } = body;

        // 3. Validate input
        if (!imageBase64) {
            return NextResponse.json(
                { error: 'Invalid request: imageBase64 is required' },
                { status: 400 }
            );
        }

        if (imageBase64.length > MAX_BASE64_LENGTH) {
            return NextResponse.json(
                { error: 'Image too large. Maximum size is ~5MB.' },
                { status: 413 }
            );
        }

        if (!VALID_TYPES.includes(regenmonType as typeof VALID_TYPES[number])) {
            return NextResponse.json(
                { error: 'Invalid regenmonType. Must be rayo, flama, or hielo.' },
                { status: 400 }
            );
        }

        if (!regenmonName || !stats) {
            return NextResponse.json(
                { error: 'Invalid request: regenmonName and stats are required' },
                { status: 400 }
            );
        }

        // 4. Get Vision Provider
        let provider;
        try {
            provider = getVisionProvider();
        } catch {
            return NextResponse.json(
                { error: 'Vision AI provider not configured.' },
                { status: 500 }
            );
        }

        // 5. Build system prompt for vision evaluation
        const safeMemories = memories || [];
        const systemPrompt = buildVisionPrompt(regenmonType, regenmonName, stats, safeMemories);

        // 6. Call Vision API
        let response: VisionResponse;
        try {
            response = await provider.evaluate(imageBase64, systemPrompt);
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.error('Vision API call failed:', error);
            }
            // Return fallback instead of error
            return NextResponse.json(clampResponse(getFallbackResponse()));
        }

        // 7. Clamp and validate response
        const clamped = clampResponse(response);

        // 8. Coherence bonus: reward consistent memory themes
        const coherenceBonus = calculateCoherenceBonus(safeMemories, clamped.resonanceReason);
        if (coherenceBonus > 0 && clamped.resonanceLevel !== 'penalizing') {
            clamped.fragments = clamp(clamped.fragments + coherenceBonus, 0, 12);
        }

        if (process.env.NODE_ENV === 'development') {
            console.log('Vision evaluation:', { raw: response, clamped, coherenceBonus });
        }

        return NextResponse.json(clamped);

    } catch (error) {
        console.error('Evaluate API Error:', error);

        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: 'Invalid JSON in request body.' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Tu Regenmon no puede evaluar esto ahora... (Internal Error)' },
            { status: 502 }
        );
    }
}
