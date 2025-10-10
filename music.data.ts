// FIX: Corrected import path for local module by adding file extension.
import { Emotion } from './types.ts';

// =================================================================================================
// --- THE CANON OF EMOTION & RHYTHM ---
// This file codifies the system's understanding of how music maps to emotion,
// as per the user's research directive. It also defines the foundational Dhol rhythms.
// =================================================================================================

// This map is the result of the system's analysis, as requested by the user.
// It links emotions to musical modes, keys, and common melodic patterns (as scale degrees).
export const emotionMap: { [key: string]: Emotion } = {
    'Sorrow': {
        name: 'Sorrow',
        description: 'Evokes feelings of loss, reflection, and melancholy.',
        mode: 'minor',
        key: 'A',
        patterns: [
            [0, 2, 3, 2],         // a -> c -> d -> c
            [5, 4, 3, 0],         // f -> e -> d -> a
            [3, 2, 0],            // d -> c -> a
        ],
        hebrewWords: [{ word: "יָגוֹן", meaning: "grief, sorrow", gematria: 69 }],
        instruments: { lead: 'sine', pad: 'triangle', bass: 'sine' }
    },
    'Hope': {
        name: 'Hope',
        description: 'A sense of optimism, uplift, and gentle striving.',
        mode: 'major',
        key: 'C',
        patterns: [
            [0, 4, 7],            // C -> E -> G (major triad arpeggio)
            [5, 4, 2, 0],         // F -> E -> D -> C
            [0, 2, 4, 5, 7],      // Upward pentatonic scale fragment
        ],
        hebrewWords: [{ word: "תִּקְוָה", meaning: "hope", gematria: 501 }],
        instruments: { lead: 'triangle', pad: 'sawtooth', bass: 'sine' }
    },
    'Peace': {
        name: 'Peace',
        description: 'Calmness, tranquility, and a sense of resolution.',
        mode: 'major',
        key: 'F',
        patterns: [
            [0, 2, 4],            // F -> G -> A (slow, simple movement)
            [7, 5, 4, 2, 0],      // C -> A -> G -> F (descending to root)
            [0, 0, 4, 4],         // F -> F -> A -> A (stable, repeating notes)
        ],
        hebrewWords: [{ word: "שָׁלוֹם", meaning: "peace, wholeness", gematria: 376 }],
        instruments: { lead: 'sine', pad: 'triangle', bass: 'sine' }
    },
    'Courage': {
        name: 'Courage',
        description: 'Feelings of strength, determination, and heroism.',
        mode: 'major',
        key: 'G',
        patterns: [
            [0, 7, 12, 7],        // G -> D -> G (octave jump)
            [0, 2, 4, 5],         // G -> A -> B -> C (strong upward march)
            [4, 2, 0],            // B -> A -> G (resolute descent)
        ],
        hebrewWords: [{ word: "גְּבוּרָה", meaning: "strength, courage", gematria: 216 }],
        instruments: { lead: 'sawtooth', pad: 'square', bass: 'sawtooth' }
    },
    'Tension': {
        name: 'Tension',
        description: 'A sense of unease, anticipation, or suspense.',
        mode: 'minor',
        key: 'C#',
        patterns: [
            [0, 1, 0],            // C# -> D -> C# (semitone dissonance)
            [6, 5],               // G# -> G (tritone interval)
            [0, 3, 2, 5, 4],      // Minor scale fragment with chromaticism
        ],
        hebrewWords: [{ word: "מְתִיחוּת", meaning: "tension", gematria: 854 }],
        instruments: { lead: 'square', pad: 'sawtooth', bass: 'sawtooth' }
    },
    'Neutral': {
        name: 'Neutral',
        description: 'A balanced, observational state.',
        mode: 'major',
        key: 'C',
        patterns: [[0, 2, 4, 5, 7]],
        hebrewWords: [],
        instruments: { lead: 'sine', pad: 'sine', bass: 'sine' }
    }
};

// Rhythmic patterns for Dhol drums (1=dagga/bass, 2=tilli/treble, 0=rest)
export const dholRhythms: { [key: string]: number[] } = {
    'chaal': [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0], // Basic 4/4 beat
    'bhangra': [1, 2, 0, 1, 2, 0, 1, 2, 1, 2, 0, 1, 2, 0, 1, 2], // Syncopated, driving
    'trance': [1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2], // Driving beat
    'meditative': [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Slow, heartbeat-like
};

export const RHYTHM_VARIATIONS = {
    fill: [1, 2, 1, 2, 1, 2, 1, 2],
    ending: [1, 0, 2, 0, 1, 0, 0, 0]
};


// =================================================================================================
// --- "ENTERTAINMENT MODE" DATA ---
// =================================================================================================

export const MOOD_SCALES: Record<string, any> = {
    peace: { key: 'F', mode: 'major', rootNoteOffset: 5 },
    focus: { key: 'A', mode: 'minor', rootNoteOffset: 9 },
    uplifting: { key: 'G', mode: 'major', rootNoteOffset: 7 },
    tension: { key: 'C', mode: 'minor', rootNoteOffset: 0 },
    contemplative: { key: 'D', mode: 'dorian', rootNoteOffset: 2 },
    neutral: { key: 'C', mode: 'major', rootNoteOffset: 0 },
};

export const INSTRUMENT_KITS: Record<string, {lead: string, pad: string, bass: string}> = {
    ambient: { lead: 'Mercy String', pad: 'Equilibrium Pad', bass: 'Root Bass' },
    cinematic: { lead: 'Severity Pluck', pad: 'Mercy String', bass: 'Root Bass' },
    default: { lead: 'Transverse Arp', pad: 'Equilibrium Pad', bass: 'Root Bass' },
}


// =================================================================================================
// --- HARMONIC & INSTRUMENTATION LOGIC (RITUAL MODE) ---
// =================================================================================================

export const KEY_SIGNATURE_MAP = [
    { range: [0, 150], key: 'C', mode: 'minor', rootNoteOffset: 0 },
    { range: [151, 300], key: 'G', mode: 'major', rootNoteOffset: 7 },
    { range: [301, 450], key: 'D', mode: 'minor', rootNoteOffset: 2 },
    { range: [451, 600], key: 'A', mode: 'major', rootNoteOffset: 9 },
    { range: [601, 750], key: 'E', mode: 'minor', rootNoteOffset: 4 },
    { range: [751, 900], key: 'B', mode: 'major', rootNoteOffset: 11 },
    { range: [901, Infinity], key: 'F#', mode: 'minor', rootNoteOffset: 6 },
];

export const INSTRUMENT_PATCHES = [
    { name: 'Equilibrium Pad', island: 1, type: 'triangle', envelope: { attack: 0.5, decay: 1.0, sustain: 0.3, release: 0.8 } },
    { name: 'Severity Pluck', island: 2, type: 'sawtooth', envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 } },
    { name: 'Transverse Arp', island: 3, type: 'square', envelope: { attack: 0.02, decay: 0.3, sustain: 0.2, release: 0.3 } },
    { name: 'Mercy String', island: 4, type: 'sine', envelope: { attack: 0.8, decay: 0.5, sustain: 0.5, release: 0.8 } },
    { name: 'Root Bass', island: 5, type: 'sine', envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.5 } },
] as const;

// Maps Gevurah opcodes to their letter's Willow Island for instrumentation
export const OPCODE_ISLAND_MAP: Record<string, number> = {
    'INIT': 4,      // Aleph
    'STORE': 1,     // Bet
    'FLOW': 1,      // Gimel (Gimel is on island 1 in willow.data.ts)
    'SEEK': 1,      // Gimel Alias
    'GATE': 1,      // Dalet
    'MANIFEST': 4,  // Heh
    'CONNECT': 3,   // Vav
    'BIND': 3,      // Vav Alias
    'DISCERN': 2,   // Zayin
    'DIFFER': 2,    // Zayin Alias
    'FENCE': 3,     // Het
    'INVERT': 3,    // Tet
    'SEED': 1,      // Yod
    'CONCENTRATE': 1, // Yod Alias
    'FETCH': 4,     // Kaf
    'DIRECT': 1,    // Lamed
    'QUERY': 1,     // Mem
    'EMERGE': 2,    // Nun
    'SUPPORT': 3,   // Samekh
    'OBSERVE': 2,   // Ayin
    'SPEAK': 4,     // Pe
    'DECLARE': 4,   // Pe Alias
    'ANCHOR': 5,    // Tzadi
    'UNIFY': 5,     // Qof
    'SANCTIFY': 5,  // Qof Alias
    'RESTRUCTURE': 2, // Resh
    'EXECUTE': 2,   // Shin
    'HALT': 1,      // Tav
    'SEAL': 1,      // Tav Alias
};

// =================================================================================================
// --- GEVURAH OPCODE MELODIC MOTIFS ---
// =================================================================================================
type NoteDefinition = { type: 'note', degree: number; duration: number, velocity: number } | { type: 'rest', duration: number };
export const GEVURAH_OPCODE_MOTIFS: Record<string, NoteDefinition[]> = {
    'INIT': [{ type: 'note', degree: 0, duration: 4, velocity: 0.8 }],
    'STORE': [{ type: 'note', degree: 0, duration: 2, velocity: 0.6 }, { type: 'note', degree: 4, duration: 2, velocity: 0.6 }],
    'FLOW': [{ type: 'note', degree: 0, duration: 1, velocity: 0.7 }, { type: 'note', degree: 2, duration: 1, velocity: 0.7 }, { type: 'note', degree: 4, duration: 1, velocity: 0.7 }],
    'GATE': [{ type: 'note', degree: 1, duration: 1.5, velocity: 0.9 }, { type: 'note', degree: 0, duration: 2.5, velocity: 0.7 }],
    'MANIFEST': [{ type: 'note', degree: 7, duration: 4, velocity: 0.9 }],
    'CONNECT': [{ type: 'note', degree: 0, duration: 1, velocity: 0.7 }, { type: 'note', degree: 4, duration: 3, velocity: 0.8 }],
    'DISCERN': [{ type: 'note', degree: 6, duration: 1, velocity: 0.9 }, { type: 'note', degree: 5, duration: 1, velocity: 0.9 }],
    'FENCE': [{ type: 'note', degree: 0, duration: 1, velocity: 0.6 }, { type: 'note', degree: 7, duration: 1, velocity: 0.6 }, { type: 'note', degree: 0, duration: 1, velocity: 0.6 }],
    'INVERT': [{ type: 'note', degree: 4, duration: 1, velocity: 0.8 }, { type: 'note', degree: 3, duration: 1, velocity: 0.8 }, { type: 'note', degree: 2, duration: 1, velocity: 0.8 }],
    'SEED': [{ type: 'note', degree: 12, duration: 1, velocity: 1.0 }, { type: 'rest', duration: 1 }],
    'FETCH': [{ type: 'note', degree: 4, duration: 1, velocity: 0.7 }, { type: 'note', degree: 2, duration: 1, velocity: 0.7 }],
    'DIRECT': [{ type: 'note', degree: 0, duration: 0.5, velocity: 0.8 }, { type: 'note', degree: 2, duration: 0.5, velocity: 0.8 }, { type: 'note', degree: 4, duration: 0.5, velocity: 0.8 }, { type: 'note', degree: 5, duration: 0.5, velocity: 0.8 }],
    'QUERY': [{ type: 'note', degree: -5, duration: 2, velocity: 0.7 }, { type: 'note', degree: -3, duration: 2, velocity: 0.7 }],
    'EMERGE': [{ type: 'note', degree: 5, duration: 1, velocity: 0.9 }, { type: 'note', degree: 7, duration: 1, velocity: 0.9 }, { type: 'note', degree: 9, duration: 2, velocity: 1.0 }],
    'SUPPORT': [{ type: 'note', degree: 0, duration: 1, velocity: 0.5 }, { type: 'note', degree: 0, duration: 1, velocity: 0.5 }, { type: 'note', degree: 0, duration: 1, velocity: 0.5 }, { type: 'note', degree: 0, duration: 1, velocity: 0.5 }],
    'OBSERVE': [{ type: 'note', degree: 6, duration: 4, velocity: 0.5 }, { type: 'rest', duration: 2 }],
    'SPEAK': [{ type: 'note', degree: 2, duration: 1, velocity: 0.9 }, { type: 'note', degree: 2, duration: 3, velocity: 0.7 }],
    'ANCHOR': [{ type: 'note', degree: -7, duration: 8, velocity: 0.8 }],
    'UNIFY': [{ type: 'note', degree: 0, duration: 1, velocity: 0.7 }, { type: 'note', degree: 2, duration: 1, velocity: 0.7 }, { type: 'note', degree: 4, duration: 2, velocity: 0.8 }],
    'RESTRUCTURE': [{ type: 'note', degree: 7, duration: 0.5, velocity: 0.9 }, { type: 'note', degree: 2, duration: 0.5, velocity: 0.9 }, { type: 'note', degree: 5, duration: 0.5, velocity: 0.9 }, { type: 'note', degree: 0, duration: 0.5, velocity: 0.9 }],
    'EXECUTE': [{ type: 'note', degree: 0, duration: 0.5, velocity: 1.0 }, { type: 'note', degree: 4, duration: 0.5, velocity: 1.0 }, { type: 'note', degree: 7, duration: 1, velocity: 1.0 }],
    'HALT': [{ type: 'rest', duration: 8 }],
    'CALL': [{ type: 'note', degree: 5, duration: 0.5, velocity: 1.0 }, { type: 'note', degree: 9, duration: 0.5, velocity: 1.0 }],
    'RET': [{ type: 'note', degree: 9, duration: 0.5, velocity: 0.8 }, { type: 'note', degree: 5, duration: 0.5, velocity: 0.8 }],
};