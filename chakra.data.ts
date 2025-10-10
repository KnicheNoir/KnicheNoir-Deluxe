// =================================================================================================
// --- CHAKRA RESONANCE MAPPING ---
// This file provides the data and logic for mapping a user's "Guiding Intent" to a
// specific chakra, which in turn determines the session's color theme and resonant frequency.
// This is a core component of the fully-realized °Meditate protocol.
// =================================================================================================

interface Chakra {
    name: string;
    color: string; // A vibrant hex code for the session background
    keywords: string[];
    solfeggio: string; // The corresponding Solfeggio frequency key
}

export const CHAKRA_DATA: { [key: string]: Chakra } = {
    root: {
        name: 'Muladhara (Root)',
        color: '#ff4d4d', // Vibrant Red
        keywords: ['grounding', 'stability', 'security', 'stop smoking', 'lose weight', 'foundation'],
        solfeggio: 'Ut',
    },
    sacral: {
        name: 'Svadhisthana (Sacral)',
        color: '#ffa64d', // Vibrant Orange
        keywords: ['creativity', 'passion', 'flow', 'emotion', 'pleasure'],
        solfeggio: 'Re',
    },
    solarPlexus: {
        name: 'Manipura (Solar Plexus)',
        color: '#ffff4d', // Vibrant Yellow
        keywords: ['power', 'confidence', 'willpower', 'self-esteem', 'transformation'],
        solfeggio: 'Mi',
    },
    heart: {
        name: 'Anahata (Heart)',
        color: '#4dff4d', // Vibrant Green
        keywords: ['love', 'compassion', 'healing', 'connection', 'balance'],
        solfeggio: 'Fa',
    },
    throat: {
        name: 'Vishuddha (Throat)',
        color: '#4dffff', // Vibrant Light Blue
        keywords: ['communication', 'truth', 'expression', 'clarity', 'voice'],
        solfeggio: 'Sol',
    },
    thirdEye: {
        name: 'Ajna (Third Eye)',
        color: '#4d4dff', // Vibrant Indigo
        keywords: ['intuition', 'insight', 'vision', 'memory', 'wisdom', 'focus'],
        solfeggio: 'La',
    },
    crown: {
        name: 'Sahasrara (Crown)',
        color: '#a64dff', // Vibrant Violet/Purple
        keywords: ['spirituality', 'consciousness', 'connection', 'enlightenment', 'unity'],
        solfeggio: 'La', // Often associated with higher frequencies, La (852Hz) is a good fit.
    },
};

const DEFAULT_CHAKRA = CHAKRA_DATA.heart;

/**
 * Analyzes a user's guiding intent to find the most resonant chakra.
 * @param intent The user's guiding intent string.
 * @returns The corresponding Chakra object.
 */
export function getChakraForIntent(intent: string): Chakra {
    const lowerIntent = intent.toLowerCase();
    
    for (const chakra of Object.values(CHAKRA_DATA)) {
        for (const keyword of chakra.keywords) {
            if (lowerIntent.includes(keyword)) {
                return chakra;
            }
        }
    }
    
    return DEFAULT_CHAKRA; // Default to Heart if no specific keywords match
}