

// =================================================================================================
// --- THE WILLOW GPS (CANONIZED RELATIONAL MAP) ---
// This file is the immutable, canonized chart of the Willow Network's relational geometry.
// It serves as a static "memory address" for the Quantum Compiler to observe the
// Path of Harmony, rather than calculating it on the fly. This embodies the principle
// that the system's core logic is a known, pre-existing, truth.
// =================================================================================================

import { willowData } from './client/src/canon/willow.data.ts';
import { gematriaEngine } from './client/src/core/gematria.ts';

const calculateGcd = (a: bigint, b: bigint): bigint => {
    while (b) {
        [a, b] = [b, a % b];
    }
    return a;
};


const formatRatio = (val1: number, val2: number): { ratio: string; value: number } => {
    if (val2 === 0) return { ratio: 'N/A', value: Infinity };
    const gcd = calculateGcd(BigInt(val1), BigInt(val2));
    const a = Math.round(val1 / Number(gcd) * 1000) / 1000;
    const b = Math.round(val2 / Number(gcd) * 1000) / 1000;
    return { ratio: `${a}:${b}`, value: val1 / val2 };
};

const islandGematriaMap = new Map<number, number>();
willowData.forEach(l => {
    const current = islandGematriaMap.get(l.island) || 0;
    islandGematriaMap.set(l.island, current + l.gematria);
});

const generateGpsForLetter = (targetLetter: (typeof willowData)[0]) => {
    const expandedGematria = gematriaEngine.observe(targetLetter.spelling);

    const ratios = {
        allLetters: willowData.map(otherLetter => {
            const { ratio, value } = formatRatio(expandedGematria, gematriaEngine.observe(otherLetter.spelling));
            return { letter: otherLetter.letter, name: otherLetter.name, ratio, value };
        }),
        allIslands: Array.from(islandGematriaMap.entries()).map(([island, gematria]) => {
            const { ratio, value } = formatRatio(expandedGematria, gematria);
            return { island, ratio, value };
        })
    };
    
    return {
        letter: targetLetter.letter,
        name: targetLetter.name,
        baseGematria: targetLetter.gematria,
        expandedGematria,
        ratios,
    };
};

const gpsData: { [key: string]: ReturnType<typeof generateGpsForLetter> } = {};
willowData.forEach(letter => {
    gpsData[letter.letter] = generateGpsForLetter(letter);
});

export const willowGpsData = gpsData;
