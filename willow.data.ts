// FIX: Corrected import paths for local modules by adding file extensions.
import { HEBREW_GEMATRIA_MAP } from './constants.ts';
import { WillowData } from './types.ts';

// The 7 Islands are a canonized abstraction of the network's structure.
// Tiers are based on the combined Gematria of the island's letters.
// Jerusalem (ירושלים) contains letters from Islands 1, 2, and 3, acting as a master key.

export const willowData: WillowData[] = [
    // Mother Letters
    { letter: 'א', name: 'Aleph', archetype: 'The Unstruck Spark', spelling: 'אלף', gematria: 1, type: 'Mother', element: 'Air', color: '#FFFF00', note: 'E', island: 6, tier: 3, isOperator: false },
    { letter: 'מ', name: 'Mem', archetype: 'The Primal Spring', spelling: 'מם', gematria: 40, type: 'Mother', element: 'Water', color: '#00BFFF', note: 'G', island: 1, tier: 1, isOperator: true },
    { letter: 'ש', name: 'Shin', archetype: 'The Transforming Fire', spelling: 'שין', gematria: 300, type: 'Mother', element: 'Fire', color: '#FF4500', note: 'C', island: 3, tier: 7, isOperator: false },

    // Double Letters
    { letter: 'ב', name: 'Bet', archetype: 'The Sacred House', spelling: 'בית', gematria: 2, type: 'Double', planet: 'Mercury', color: '#FFA500', note: 'E', island: 2, tier: 6, isOperator: false },
    { letter: 'ג', name: 'Gimel', archetype: 'The Winding Path', spelling: 'גימל', gematria: 3, type: 'Double', planet: 'Moon', color: '#E6E6FA', note: 'G#', island: 1, tier: 1, isOperator: false },
    { letter: 'ד', name: 'Dalet', archetype: 'The Open Door', spelling: 'דלת', gematria: 4, type: 'Double', planet: 'Venus', color: '#00FF7F', note: 'F#', island: 2, tier: 6, isOperator: false },
    { letter: 'כ', name: 'Kaf', archetype: 'The Grasping Palm', spelling: 'כף', gematria: 20, type: 'Double', planet: 'Jupiter', color: '#4169E1', note: 'A#', island: 6, tier: 3, isOperator: false },
    { letter: 'פ', name: 'Pe', archetype: 'The Speaking Mouth', spelling: 'פה', gematria: 80, type: 'Double', planet: 'Mars', color: '#DC143C', note: 'C#', island: 6, tier: 3, isOperator: false },
    { letter: 'ר', name: 'Resh', archetype: 'The Sovereign Head', spelling: 'ריש', gematria: 200, type: 'Double', planet: 'Sun', color: '#FFD700', note: 'D', island: 3, tier: 7, isOperator: false },
    { letter: 'ת', name: 'Tav', archetype: 'The Final Seal', spelling: 'תו', gematria: 400, type: 'Double', planet: 'Saturn', element: 'Earth', color: '#4B0082', note: 'F', island: 2, tier: 6, isOperator: false },

    // Simple Letters
    { letter: 'ה', name: 'He', archetype: 'The Manifest Breath', spelling: 'הא', gematria: 5, type: 'Simple', zodiac: 'Aries', color: '#FF0000', note: 'C#', island: 6, tier: 3, isOperator: false },
    { letter: 'ו', name: 'Vav', archetype: 'The Connecting Nail', spelling: 'ויו', gematria: 6, type: 'Simple', zodiac: 'Taurus', color: '#228B22', note: 'D', island: 5, tier: 2, isOperator: true },
    { letter: 'ז', name: 'Zayin', archetype: 'The Discerning Sword', spelling: 'זין', gematria: 7, type: 'Simple', zodiac: 'Gemini', color: '#FF8C00', note: 'D#', island: 4, tier: 4, isOperator: false },
    { letter: 'ח', name: 'Het', archetype: 'The Protective Fence', spelling: 'חית', gematria: 8, type: 'Simple', zodiac: 'Cancer', color: '#C0C0C0', note: 'E', island: 5, tier: 2, isOperator: false },
    { letter: 'ט', name: 'Tet', archetype: 'The Coiled Serpent', spelling: 'טית', gematria: 9, type: 'Simple', zodiac: 'Leo', color: '#FFBF00', note: 'F', island: 5, tier: 2, isOperator: false },
    { letter: 'י', name: 'Yod', archetype: 'The Seed of Will', spelling: 'יוד', gematria: 10, type: 'Simple', zodiac: 'Virgo', color: '#9ACD32', note: 'F#', island: 2, tier: 6, isOperator: false },
    { letter: 'ל', name: 'Lamed', archetype: 'The Guiding Staff', spelling: 'למד', gematria: 30, type: 'Simple', zodiac: 'Libra', color: '#32CD32', note: 'G', island: 1, tier: 1, isOperator: false },
    { letter: 'נ', name: 'Nun', archetype: 'The Emergent Fish', spelling: 'נון', gematria: 50, type: 'Simple', zodiac: 'Scorpio', color: '#B22222', note: 'G#', island: 4, tier: 4, isOperator: true },
    { letter: 'ס', name: 'Samekh', archetype: 'The Supporting Pillar', spelling: 'סמך', gematria: 60, type: 'Simple', zodiac: 'Sagittarius', color: '#1E90FF', note: 'A', island: 5, tier: 2, isOperator: false },
    { letter: 'ע', name: 'Ayin', archetype: 'The Perceptive Eye', spelling: 'עין', gematria: 70, type: 'Simple', zodiac: 'Capricorn', color: '#2F4F4F', note: 'A#', island: 4, tier: 4, isOperator: false },
    { letter: 'צ', name: 'Tzadi', archetype: 'The Root Anchor', spelling: 'צדי', gematria: 90, type: 'Simple', zodiac: 'Aquarius', color: '#8A2BE2', note: 'B', island: 7, tier: 5, isOperator: false },
    { letter: 'ק', name: 'Qof', archetype: 'The Unifying Thread', spelling: 'קוף', gematria: 100, type: 'Simple', zodiac: 'Pisces', color: '#DDA0DD', note: 'C', island: 7, tier: 5, isOperator: false },
];
