'use client';

/**
 * useChiptuneAudio — Per-type chiptune music engine
 * Inspired by Kirby's Adventure (NES) composition techniques:
 * - Repetition with variation (same phrase start, different ending)
 * - Surprising harmonic shifts (modulations, chromatic neighbors)
 * - Active melodic basslines (octave skips, melodic movement)
 * - Arpeggiation for polyphony illusion
 * - ii-V-I progressions and secondary dominants
 * 
 * 3 unique themes mapped to Regenmon personalities:
 * - Rayo (ágil/enérgico): G major, ~150 BPM, bouncy Green Greens-like
 * - Flama (fuerte/apasionado): D minor→F major, ~130 BPM, bold/driving
 * - Hielo (calmado/resistente): Eb major, ~100 BPM, dreamy Grape Garden-like
 */

import { useEffect, useRef, useCallback } from 'react';
import { RegenmonType } from '@/lib/types';

// ─── Note Frequency Table (Hz) ──────────────────────────────
const N: Record<string, number> = {
    // Octave 2
    C2: 65.41, D2: 73.42, Eb2: 77.78, E2: 82.41, F2: 87.31,
    G2: 98.00, Ab2: 103.83, A2: 110.00, Bb2: 116.54, B2: 123.47,
    // Octave 3
    C3: 130.81, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61,
    Gb3: 185.00, G3: 196.00, Ab3: 207.65, A3: 220.00, Bb3: 233.08, B3: 246.94,
    // Octave 4
    C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63,
    F4: 349.23, Gb4: 369.99, G4: 392.00, Ab4: 415.30, A4: 440.00,
    Bb4: 466.16, B4: 493.88,
    // Octave 5
    C5: 523.25, D5: 587.33, Eb5: 622.25, E5: 659.25,
    F5: 698.46, G5: 783.99, A5: 880.00, Bb5: 932.33,
};

const R = 0; // Rest

// ─── Song Data Type ──────────────────────────────────────────
interface SongData {
    bpm: number;
    melody: number[];
    harmony: number[];
    bass: number[];
    perc: number[];  // 1 = kick, 2 = hihat, 3 = snare, 0 = rest
}

// ═══════════════════════════════════════════════════════════════
//  RAYO — "Spark Rush" (G major, ~150 BPM)
//  Personality: Ágil y enérgico
//  Inspired by: Green Greens / Vegetable Valley
//  Feel: Bouncy, playful leaps, upbeat ii-V-I resolutions
// ═══════════════════════════════════════════════════════════════

const rayoMelodyA: number[] = [
    // Phrase 1: bouncy ascending motif (bars 1-2)
    N.G4, R, N.B4, N.D5, N.B4, R, N.G4, R,
    // Phrase 2: same start, different ending (Kirby technique!) (bars 3-4)
    N.G4, R, N.B4, N.D5, N.E5, R, N.D5, N.B4,
    // Phrase 3: call-response, stepping down (bars 5-6)
    N.A4, R, N.B4, N.A4, N.G4, R, N.E4, R,
    // Phrase 4: resolution with ii-V-I feel (Am-D-G) (bars 7-8)
    N.A4, N.B4, N.D5, R, N.B4, R, N.G4, R,
];

const rayoMelodyB: number[] = [
    // B section: surprise modulation to E minor (relative minor)
    N.E4, R, N.G4, N.B4, N.A4, R, N.G4, N.E4,
    N.D4, R, N.E4, N.G4, N.A4, R, N.B4, R,
    // Back toward G major with a chromatic approach
    N.E4, N.G4, N.A4, N.B4, N.D5, R, N.C5, N.B4,
    N.A4, R, N.G4, R, N.B4, N.D5, N.G4, R,
];

const rayoHarmA: number[] = [
    // Arpeggiated chords: G major
    N.G3, N.B3, N.D4, N.B3, N.G3, N.B3, N.D4, N.B3,
    N.G3, N.B3, N.D4, N.B3, N.C4, N.E4, N.G4, N.E4,
    // Am → D (ii-V)
    N.A3, N.C4, N.E4, N.C4, N.A3, N.C4, N.E4, N.C4,
    N.D4, N.Gb4, N.A4, N.Gb4, N.D4, N.G4, N.B4, N.G4,
];

const rayoHarmB: number[] = [
    // Em arpeggios
    N.E3, N.G3, N.B3, N.G3, N.E3, N.G3, N.B3, N.G3,
    N.D3, N.G3, N.B3, N.G3, N.A3, N.C4, N.E4, N.C4,
    // C → D → G
    N.C4, N.E4, N.G4, N.E4, N.D4, N.Gb4, N.A4, N.Gb4,
    N.A3, N.C4, N.E4, N.C4, N.G3, N.B3, N.D4, N.B3,
];

const rayoBassA: number[] = [
    // Active melodic bass with octave skips
    N.G2, R, N.G3, R, N.G2, R, N.B2, N.D3,
    N.G2, R, N.G3, R, N.C3, R, N.E3, R,
    N.A2, R, N.A3, R, N.A2, R, N.C3, N.E3,
    N.D3, R, N.D2, R, N.G2, R, N.G3, R,
];

const rayoBassB: number[] = [
    N.E2, R, N.E3, R, N.E2, R, N.G2, N.B2,
    N.D2, R, N.D3, R, N.A2, R, N.A3, R,
    N.C3, R, N.C2, R, N.D3, R, N.D2, R,
    N.A2, R, N.A3, R, N.G2, R, N.G3, R,
];

const rayoPercA: number[] = [
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 2, 0, 3, 0, 2, 2,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 2, 2, 3, 0, 2, 0,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 2, 0, 3, 0, 2, 2,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 2, 3, 2, 1, 0, 2, 0,
];

const rayoPercB: number[] = [
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 2, 2, 3, 0, 2, 0,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 2, 0, 3, 2, 2, 0,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 2, 2, 0, 3, 0, 2, 0,
    1, 0, 2, 0, 3, 0, 2, 2, 1, 0, 3, 0, 1, 0, 2, 0,
];

const RAYO_SONG: SongData = {
    bpm: 150,
    melody: [...rayoMelodyA, ...rayoMelodyA, ...rayoMelodyB, ...rayoMelodyA],
    harmony: [...rayoHarmA, ...rayoHarmA, ...rayoHarmB, ...rayoHarmA],
    bass: [...rayoBassA, ...rayoBassA, ...rayoBassB, ...rayoBassA],
    perc: [...rayoPercA, ...rayoPercA, ...rayoPercB, ...rayoPercA],
};

// ═══════════════════════════════════════════════════════════════
//  FLAMA — "Ember Heart" (D minor → F major, ~130 BPM)
//  Personality: Fuerte y apasionado
//  Inspired by: Orange Ocean / boss themes
//  Feel: Bold, driving rhythm, minor-to-major shifts for drama
// ═══════════════════════════════════════════════════════════════

const flamaMelodyA: number[] = [
    // Phrase 1: bold D minor opening with power (bars 1-2)
    N.D4, R, N.F4, N.A4, N.G4, N.F4, N.D4, R,
    // Phrase 2: same start, driving upward (bars 3-4)
    N.D4, R, N.F4, N.A4, N.Bb4, R, N.A4, N.G4,
    // Phrase 3: passionate leap to C5 then resolution (bars 5-6)
    N.F4, R, N.A4, N.C5, N.Bb4, R, N.A4, R,
    // Phrase 4: strong cadence, Dm → A → Dm (bars 7-8)
    N.G4, N.A4, N.Bb4, N.A4, N.G4, N.F4, N.D4, R,
];

const flamaMelodyB: number[] = [
    // B section: surprise shift to F MAJOR — light breaks through!
    N.F4, R, N.A4, N.C5, N.A4, R, N.F4, R,
    N.G4, R, N.Bb4, N.C5, N.D5, R, N.C5, N.Bb4,
    // Chromatic approach back to D minor
    N.A4, R, N.Bb4, N.A4, N.G4, R, N.F4, N.E4,
    N.D4, N.F4, N.A4, R, N.G4, N.F4, N.D4, R,
];

const flamaHarmA: number[] = [
    // Dm arpeggios
    N.D3, N.F3, N.A3, N.F3, N.D3, N.F3, N.A3, N.F3,
    N.D3, N.F3, N.A3, N.F3, N.Bb3, N.D4, N.F4, N.D4,
    // Gm → A (iv-V in Dm)
    N.F3, N.A3, N.C4, N.A3, N.Bb3, N.D4, N.F4, N.D4,
    N.G3, N.Bb3, N.D4, N.Bb3, N.A3, N.D4, N.F4, N.D4,
];

const flamaHarmB: number[] = [
    // F major arpeggios — bright contrast!
    N.F3, N.A3, N.C4, N.A3, N.F3, N.A3, N.C4, N.A3,
    N.Bb3, N.D4, N.F4, N.D4, N.Bb3, N.D4, N.F4, N.D4,
    // Transition chords: C → Bb → A
    N.C4, N.E4, N.G4, N.E4, N.Bb3, N.D4, N.F4, N.D4,
    N.A3, N.D4, N.F4, N.D4, N.A3, N.D4, N.F4, N.D4,
];

const flamaBassA: number[] = [
    // Driving bass with power — octave hits
    N.D2, R, N.D3, R, N.D2, N.F2, N.A2, R,
    N.D2, R, N.D3, R, N.Bb2, R, N.A2, R,
    N.F2, R, N.F3, R, N.Bb2, R, N.Bb3, R,
    N.G2, R, N.A2, R, N.D2, R, N.D3, R,
];

const flamaBassB: number[] = [
    N.F2, R, N.F3, R, N.F2, R, N.C3, R,
    N.Bb2, R, N.Bb3, R, N.Bb2, R, N.F3, R,
    N.C3, R, N.C2, R, N.Bb2, R, N.Bb3, R,
    N.A2, R, N.A3, R, N.D2, R, N.D3, R,
];

const flamaPercA: number[] = [
    1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 2, 2,
    1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 2, 0, 3, 0, 0, 0,
    1, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 3, 0, 2, 2,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 3, 0, 1, 0, 0, 0,
];

const flamaPercB: number[] = [
    1, 0, 2, 0, 0, 0, 2, 0, 1, 0, 0, 0, 3, 0, 0, 0,
    1, 0, 2, 0, 0, 0, 2, 0, 1, 0, 0, 0, 3, 0, 2, 0,
    1, 0, 0, 0, 3, 0, 2, 0, 1, 0, 2, 0, 3, 0, 0, 0,
    1, 0, 2, 0, 3, 0, 2, 0, 1, 0, 3, 2, 1, 0, 0, 0,
];

const FLAMA_SONG: SongData = {
    bpm: 130,
    melody: [...flamaMelodyA, ...flamaMelodyA, ...flamaMelodyB, ...flamaMelodyA],
    harmony: [...flamaHarmA, ...flamaHarmA, ...flamaHarmB, ...flamaHarmA],
    bass: [...flamaBassA, ...flamaBassA, ...flamaBassB, ...flamaBassA],
    perc: [...flamaPercA, ...flamaPercA, ...flamaPercB, ...flamaPercA],
};

// ═══════════════════════════════════════════════════════════════
//  HIELO — "Crystal Lullaby" (Eb major, ~100 BPM)
//  Personality: Calmado y resistente
//  Inspired by: Grape Garden / Float Islands
//  Feel: Dreamy, flowing, chromatic chord shifts, waltz-like
// ═══════════════════════════════════════════════════════════════

const hieloMelodyA: number[] = [
    // Phrase 1: gentle, flowing Eb major (bars 1-2)
    N.Eb4, R, N.G4, R, N.Bb4, R, N.Ab4, N.G4,
    // Phrase 2: same start, floats higher (bars 3-4)
    N.Eb4, R, N.G4, R, N.C5, R, N.Bb4, R,
    // Phrase 3: chromatic surprise — Ab→G→Gb (Kirby shift!) (bars 5-6)
    N.Ab4, R, N.G4, N.F4, N.Eb4, R, N.D4, N.Eb4,
    // Phrase 4: gentle resolution (bars 7-8)
    N.F4, R, N.G4, N.Ab4, N.G4, R, N.Eb4, R,
];

const hieloMelodyB: number[] = [
    // B section: modulates to Cb/B major — dreamlike shift (chromatic mediant!)
    N.B4, R, N.E4, R, N.Gb4, R, N.E4, N.B4,
    N.A4, R, N.E4, N.Gb4, N.A4, R, N.B4, R,
    // Floating back toward Eb with Ab→Bb approach
    N.Ab4, R, N.Bb4, N.Ab4, N.G4, R, N.F4, R,
    N.Eb4, N.G4, N.Bb4, R, N.Ab4, N.G4, N.Eb4, R,
];

const hieloHarmA: number[] = [
    // Ebmaj7 arpeggios — lush, open
    N.Eb3, N.G3, N.Bb3, N.G3, N.Eb3, N.G3, N.Bb3, N.G3,
    N.Eb3, N.G3, N.Bb3, N.G3, N.Ab3, N.C4, N.Eb4, N.C4,
    // Ab → Eb/G (chromatic voice leading)
    N.Ab3, N.C4, N.Eb4, N.C4, N.Ab3, N.C4, N.Eb4, N.C4,
    N.Bb3, N.D4, N.F4, N.D4, N.Eb3, N.G3, N.Bb3, N.G3,
];

const hieloHarmB: number[] = [
    // B/Cb major arpeggios — magical shift
    N.B3, N.E4, N.Ab4, N.E4, N.B3, N.E4, N.Ab4, N.E4,
    N.A3, N.E4, N.A4, N.E4, N.A3, N.E4, N.A4, N.E4,
    // Transition: Ab → Bb7 → Eb
    N.Ab3, N.C4, N.Eb4, N.C4, N.Bb3, N.D4, N.F4, N.D4,
    N.Eb3, N.G3, N.Bb3, N.G3, N.Ab3, N.C4, N.Eb4, N.C4,
];

const hieloBassA: number[] = [
    // Gentle, wide bass — sustained feel with octave movement
    N.Eb2, R, R, R, N.Eb3, R, R, R,
    N.Eb2, R, R, R, N.Ab2, R, R, R,
    N.Ab2, R, R, R, N.Ab3, R, R, R,
    N.Bb2, R, R, R, N.Eb2, R, R, R,
];

const hieloBassB: number[] = [
    N.B2, R, R, R, N.E2, R, R, R,
    N.A2, R, R, R, N.E3, R, R, R,
    N.Ab2, R, R, R, N.Bb2, R, R, R,
    N.Eb2, R, R, R, N.Ab2, R, R, R,
];

const hieloPercA: number[] = [
    1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const hieloPercB: number[] = [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0,
    1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const HIELO_SONG: SongData = {
    bpm: 100,
    melody: [...hieloMelodyA, ...hieloMelodyA, ...hieloMelodyB, ...hieloMelodyA],
    harmony: [...hieloHarmA, ...hieloHarmA, ...hieloHarmB, ...hieloHarmA],
    bass: [...hieloBassA, ...hieloBassA, ...hieloBassB, ...hieloBassA],
    perc: [...hieloPercA, ...hieloPercA, ...hieloPercB, ...hieloPercA],
};

// ─── Song Selector ───────────────────────────────────────────
const SONGS: Record<RegenmonType, SongData> = {
    rayo: RAYO_SONG,
    flama: FLAMA_SONG,
    hielo: HIELO_SONG,
};

// ─── Audio Engine ────────────────────────────────────────────


interface UseChiptuneAudioProps {
    enabled: boolean;
    type: RegenmonType;
    volume?: number; // 0.0 to 1.0 (defaults to 1.0)
}

export function useChiptuneAudio({ enabled, type, volume = 1.0 }: UseChiptuneAudioProps) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const isPlayingRef = useRef(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const stepRef = useRef(0);
    const currentTypeRef = useRef<RegenmonType>(type);

    // ─ Play a pitched note ─
    const playNote = useCallback((
        ctx: AudioContext,
        dest: AudioNode,
        freq: number,
        waveform: OscillatorType,
        vol: number,
        dur: number,
        attack: number,
        release: number,
    ) => {
        if (!freq || freq === R) return;

        const osc = ctx.createOscillator();
        osc.type = waveform;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const env = ctx.createGain();
        const t = ctx.currentTime;

        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(vol, t + attack);
        env.gain.setValueAtTime(vol, t + Math.max(dur - release, attack + 0.001));
        env.gain.linearRampToValueAtTime(0, t + dur);

        osc.connect(env);
        env.connect(dest);
        osc.start(t);
        osc.stop(t + dur + 0.02);
    }, []);

    // ─ Play a percussion hit ─
    const playPerc = useCallback((
        ctx: AudioContext,
        dest: AudioNode,
        hit: number,
    ) => {
        if (hit === 0) return;
        const t = ctx.currentTime;

        if (hit === 1) {
            // Kick: short triangle burst pitched down
            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(30, t + 0.08);
            const env = ctx.createGain();
            env.gain.setValueAtTime(0.12, t);
            env.gain.linearRampToValueAtTime(0, t + 0.1);
            osc.connect(env);
            env.connect(dest);
            osc.start(t);
            osc.stop(t + 0.12);
        } else if (hit === 2) {
            // Hihat: short noise burst, high-passed
            const buf = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const env = ctx.createGain();
            env.gain.setValueAtTime(0.04, t);
            env.gain.linearRampToValueAtTime(0, t + 0.04);
            src.connect(env);
            env.connect(dest);
            src.start(t);
        } else if (hit === 3) {
            // Snare: noise + triangle combo
            const buf = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const env = ctx.createGain();
            env.gain.setValueAtTime(0.06, t);
            env.gain.linearRampToValueAtTime(0, t + 0.06);
            src.connect(env);
            env.connect(dest);
            src.start(t);

            const osc = ctx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, t);
            osc.frequency.exponentialRampToValueAtTime(80, t + 0.05);
            const oEnv = ctx.createGain();
            oEnv.gain.setValueAtTime(0.06, t);
            oEnv.gain.linearRampToValueAtTime(0, t + 0.06);
            osc.connect(oEnv);
            oEnv.connect(dest);
            osc.start(t);
            osc.stop(t + 0.08);
        }
    }, []);

    // ─ Step sequencer tick ─
    const tick = useCallback(() => {
        const ctx = audioContextRef.current;
        const master = masterGainRef.current;
        if (!ctx || !master || !isPlayingRef.current) return;

        const song = SONGS[currentTypeRef.current];
        const len = song.melody.length;
        const step = stepRef.current % len;
        const stepSec = (60 / song.bpm / 2); // eighth-note duration

        // Ch1: Melody (square wave — bright Kirby-like lead)
        const mel = song.melody[step];
        if (mel) playNote(ctx, master, mel, 'square', 0.09, stepSec * 0.8, 0.015, 0.04);

        // Ch2: Harmony/Arpeggios (square 25% feel via low volume — sparkle)
        const harm = song.harmony[step];
        if (harm) playNote(ctx, master, harm, 'square', 0.035, stepSec * 0.45, 0.01, 0.02);

        // Ch3: Bass (triangle — warm and round)
        const bass = song.bass[step];
        if (bass) playNote(ctx, master, bass, 'triangle', 0.10, stepSec * 0.85, 0.01, 0.03);

        // Ch4: Percussion (noise-based)
        const perc = song.perc[step];
        if (perc) playPerc(ctx, master, perc);

        stepRef.current += 1;
    }, [playNote, playPerc]);

    // ─ Start / Stop ─
    const startPlayback = useCallback(() => {
        if (isPlayingRef.current) return;

        const ctx = new AudioContext();
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.5 * volume, ctx.currentTime);
        masterGain.connect(ctx.destination);

        audioContextRef.current = ctx;
        masterGainRef.current = masterGain;
        isPlayingRef.current = true;
        currentTypeRef.current = type;
        stepRef.current = 0;

        const song = SONGS[type];
        const stepMs = (60 / song.bpm / 2) * 1000;

        tick();
        intervalRef.current = setInterval(tick, stepMs);
    }, [tick, type]);

    const stopPlayback = useCallback(() => {
        isPlayingRef.current = false;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        masterGainRef.current = null;
    }, []);

    // React to enabled/type changes
    useEffect(() => {
        // If type changed while playing, restart with new song
        if (enabled && isPlayingRef.current && currentTypeRef.current !== type) {
            stopPlayback();
            // Small delay to let AudioContext close cleanly
            const timer = setTimeout(() => startPlayback(), 50);
            return () => clearTimeout(timer);
        }

        if (enabled && !isPlayingRef.current) {
            startPlayback();
        } else if (!enabled && isPlayingRef.current) {
            stopPlayback();
        }

        return () => {
            stopPlayback();
        };
    }, [enabled, type, startPlayback, stopPlayback]);

    // React to volume changes smoothly
    useEffect(() => {
        if (masterGainRef.current && audioContextRef.current) {
            const ctx = audioContextRef.current;
            const targetVol = 0.5 * volume;
            masterGainRef.current.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 1.5);
        }
    }, [volume]);

    return {
        stopPlayback // Expose if needed
    };
}
