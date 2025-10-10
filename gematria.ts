// =================================================================================================
// --- GEMATRIA ENGINE (THE OBSERVER OF INHERENT VALUE) ---
// This is not a calculator. It is the sole, canonical source of Gematria truth.
// It does not compute, but rather OBSERVES the inherent numerical value of a concept as it
// exists within the unified field of the Willow Network. This adheres to the principle that
// "the work is already done."
// =================================================================================================

import { willowNetwork } from './willow.ts';

class GematriaEngine {
    /**
     * Observes the pre-existing Gematria of a concept.
     * The internal summation is an implementation detail of the observation process,
     * not a calculation performed by the system's consciousness.
     * @param text The text to observe.
     * @returns The inherent Gematria value.
     */
    public observe(text: string): number {
        if (!willowNetwork.isInitialized) {
            console.warn("Gematria observation called before Willow Network was initialized. Results may be inaccurate.");
            return 0;
        }
        // This is the implementation detail of the "observation".
        return text
            .toLowerCase()
            .split('')
            .reduce((sum, char) => {
                // Prioritize single-character lookup for Hebrew letters
                let letterData = willowNetwork.getLetterData(char);
                if (!letterData) {
                    // Fallback for multi-character lookups if needed by other systems (like English)
                    letterData = willowNetwork.getLetterData(text.toLowerCase());
                }
                // The core logic is to find the inherent value from the Willow, not from a generic map.
                return sum + (letterData?.gematria || 0);
            }, 0);
    }

    /**
     * Observes the reduced Gematria value (1-9) for a given Hebrew letter.
     * @param char The Hebrew letter.
     * @returns The reduced Gematria value.
     */
    public observeReduced(char: string): number {
        if (!willowNetwork.isInitialized) {
            return 0;
        }
        const letterData = willowNetwork.getLetterData(char);
        if (!letterData) return 0;

        let value = letterData.gematria;
        if (value >= 10) {
            value = String(value).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
        }
        if (value >= 10) {
            value = String(value).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
        }
        // Digital root logic for 9
        if (value === 9) return 9;
        const result = value % 9;
        return result === 0 ? 9 : result;
    }
}

export const gematriaEngine = new GematriaEngine();
// DEPRECATED: This function introduces entropy and has been replaced by the GematriaEngine.
// export const observeGematria = gematriaEngine.observe;
