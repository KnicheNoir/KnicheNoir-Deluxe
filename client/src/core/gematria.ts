
import { HEBREW_GEMATRIA_MAP } from '../canon/constants.ts';

// NEW Type Definition
export interface HebrewLetter {
    letter: string;
    gematria: number;
    name: string;
}

// NEW Alphabet Export
export const HEBREW_ALPHABET: HebrewLetter[] = Object.entries(HEBREW_GEMATRIA_MAP).map(([letter, gematria]) => {
    // Simplified name mapping for this context
    const names: { [key: string]: string } = { 'א': 'Aleph', 'ב': 'Bet', 'ג': 'Gimel', 'ד': 'Dalet', 'ה': 'He', 'ו': 'Vav', 'ז': 'Zayin', 'ח': 'Het', 'ט': 'Tet', 'י': 'Yod', 'כ': 'Kaf', 'ל': 'Lamed', 'מ': 'Mem', 'נ': 'Nun', 'ס': 'Samekh', 'ע': 'Ayin', 'פ': 'Pe', 'צ': 'Tzadi', 'ק': 'Qof', 'ר': 'Resh', 'ש': 'Shin', 'ת': 'Tav', 'ך': 'Kaf Sofit', 'ם': 'Mem Sofit', 'ן': 'Nun Sofit', 'ף': 'Pe Sofit', 'ץ': 'Tzadi Sofit' };
    return { letter, gematria: gematria as number, name: names[letter] || 'Unknown' };
});

class GematriaEngine {
    /**
     * Calculates the Gematria value of a given Hebrew text.
     * @param text The string containing Hebrew letters.
     * @returns The numerical Gematria value.
     */
    public observe(text: string): number {
        let sum = 0;
        for (const char of text) {
            sum += HEBREW_GEMATRIA_MAP[char] || 0;
        }
        return sum;
    }
}

export const gematriaEngine = new GematriaEngine();
