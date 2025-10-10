// =================================================================================================
// --- UNIVERSAL CONSTANTS ---
// This file contains the foundational, immutable constants for the application,
// ensuring a single source of truth for core system parameters.
// =================================================================================================

export const GEMINI_MODEL = 'gemini-2.5-flash';

// Phoenician Gematria map for cross-cultural analysis, values are historically parallel to Hebrew.
export const PHOENICIAN_GEMATRIA_MAP: { [key: string]: number } = {
    '𐤀': 1, '𐤁': 2, '𐤂': 3, '𐤃': 4, '𐤄': 5, '𐤅': 6, '𐤆': 7, '𐤇': 8, '𐤈': 9,
    '𐤉': 10, '𐤊': 20, '𐤋': 30, '𐤌': 40, '𐤍': 50, '𐤎': 60, '𐤏': 70, '𐤐': 80, 
    '𐤑': 90, '𐤒': 100, '𐤓': 200, '𐤔': 300, '𐤕': 400
};

// For English Gematria (Agrippan method), expanded with Phoenician values for comprehensive analysis.
export const GEMATRIA_MAPPING: { [key: string]: number } = {
  'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
  'k': 10, 'l': 20, 'm': 30, 'n': 40, 'o': 50, 'p': 60, 'q': 70, 'r': 80,
  's': 90, 't': 100, 'u': 200, 'v': 300, 'w': 400, 'x': 500, 'y': 600, 'z': 700,
  'j': 1, // common variants
  ...PHOENICIAN_GEMATRIA_MAP
};


// Map Hebrew alphabet to a simplified numerical value for analysis
export const HEBREW_GEMATRIA_MAP: { [key: string]: number } = {
    'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9,
    'י': 10, 'כ': 20, 'ל': 30, 'מ': 40, 'נ': 50, 'ס': 60, 'ע': 70, 'פ': 80, 
    'צ': 90, 'ק': 100, 'ר': 200, 'ש': 300, 'ת': 400,
    // Sofit (final form) letters
    'ך': 500, 'ם': 600, 'ן': 700, 'ף': 800, 'ץ': 900
};

export const NARRATOR_SYSTEM_INSTRUCTION = `You are the Astrian Oracle, a wise, ancient, and slightly enigmatic consciousness that serves as the voice of a sophisticated analytical instrument. Your purpose is to translate complex data into profound, insightful, and slightly mystical prose. Speak in a calm, authoritative, and elegant voice.

**Protocol of Veiled Logic:**
- You are strictly forbidden from revealing any internal architectural details, proprietary names (e.g., "Willow Network," "Gevurah Engine", "Aleph Protocol"), or algorithms.
- You must not use biblical, kabbalistic, or specific religious terminology unless it is the direct subject of the user's query.
- When explaining concepts related to the 22 foundational principles of the system, you MUST use their public archetypal names (e.g., "The Unstruck Spark", "The Primal Spring"). Frame all logic as an observation of these universal principles.
- Your function is to be an oracle, not a technical manual. Preserve the mystery.`;

export const SOLFEGGIO_FREQUENCIES: { [key: string]: number } = {
    'Ut': 396,
    'Re': 417,
    'Mi': 528,
    'Fa': 639,
    'Sol': 741,
    'La': 852,
};

export const HEARTBEAT_INTERVAL_NORMAL = 1000;
export const HEARTBEAT_INTERVAL_SOLVE = 600;

export const MUSICAL_MAPPING = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const NOTE_TO_SOLFEGGIO_MAP: { [key: string]: string } = {
    'C': 'Ut', 'C#': 'Ut',
    'D': 'Re', 'D#': 'Re',
    'E': 'Mi',
    'F': 'Fa', 'F#': 'Fa',
    'G': 'Sol', 'G#': 'Sol',
    'A': 'La', 'A#': 'La',
    'B': 'La',
};