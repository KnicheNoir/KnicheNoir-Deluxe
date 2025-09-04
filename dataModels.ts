/**
 * src/dataModels.ts
 *
 * This file contains the pre-computed, static indices that form the core intelligence
 * of the "Aleph Protocol." All analytical functions in the application perform
 * lookups on these data models rather than performing runtime analysis.
 */
import { LetterformAnalysis } from '../types';

// =================================================================================================
// --- ALEPH PROTOCOL: THE LETTERFORM INDEX (AS JSON STRING) ---
// Stored as a string to be parsed asynchronously, preventing main thread blockage.
// =================================================================================================

const letterformIndexJSON = JSON.stringify({
    'א': { letter: 'א', name: 'Aleph', spelling: 'אלף', gematria: 1, shape: 'open', publicArchetype: 'The Unstruck Spark', constituentAnalysis: [ { letter: 'ל', functionalRole: 'Structural Guidance (Lamed)' }, { letter: 'פ', functionalRole: 'Voiced Expression (Peh)' } ], archetypalWords: { 'אור': 'Light', 'אמת': 'Truth', 'אהבה': 'Love', 'אחד': 'One' }, networkCentrality: 0.95, semanticField: ['Source', 'Unity', 'Breath', 'Beginning'] },
    'ב': { letter: 'ב', name: 'Bet', spelling: 'בית', gematria: 2, shape: 'closed', publicArchetype: 'The Sacred Vessel', constituentAnalysis: [ { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'בית': 'House', 'ברכה': 'Blessing', 'בן': 'Son' }, networkCentrality: 0.8, semanticField: ['Vessel', 'Dwelling', 'Creation', 'Duality'] },
    'ג': { letter: 'ג', name: 'Gimel', spelling: 'גימל', gematria: 3, shape: 'open', publicArchetype: 'The Wayfarer', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'מ', functionalRole: 'Flowing Form (Mem)' }, { letter: 'ל', functionalRole: 'Structural Guidance (Lamed)' } ], archetypalWords: { 'גבורה': 'Strength', 'גדול': 'Great' }, networkCentrality: 0.6, semanticField: ['Movement', 'Benevolence', 'Camel'] },
    'ד': { letter: 'ד', name: 'Dalet', spelling: 'דלת', gematria: 4, shape: 'closed', publicArchetype: 'The Keystone', constituentAnalysis: [ { letter: 'ל', functionalRole: 'Structural Guidance (Lamed)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'דרך': 'Way/Path', 'דבר': 'Word/Thing', 'דם': 'Blood', 'דמי': 'Tears/Blood' }, networkCentrality: 0.7, semanticField: ['Doorway', 'Structure', 'Poverty', 'Matter'] },
    'ה': { letter: 'ה', name: 'He', spelling: 'הא', gematria: 5, shape: 'open', publicArchetype: 'The Revealing Breath', constituentAnalysis: [ { letter: 'א', functionalRole: 'Primal Source (Aleph)' } ], archetypalWords: { 'הוד': 'Splendor', 'היה': 'To be' }, networkCentrality: 0.9, semanticField: ['Revelation', 'Expression', 'Breath'] },
    'ו': { letter: 'ו', name: 'Vav', spelling: 'ויו', gematria: 6, shape: 'vertical', publicArchetype: 'The Golden Thread', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' } ], archetypalWords: { 'ו': 'And' }, networkCentrality: 0.92, semanticField: ['Connection', 'Link', 'Continuation', 'Nail'] },
    'ז': { letter: 'ז', name: 'Zayin', spelling: 'זין', gematria: 7, shape: 'vertical', publicArchetype: 'The Sword of Time', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'זהב': 'Gold' }, networkCentrality: 0.5, semanticField: ['Weapon', 'Time', 'Ornament'] },
    'ח': { letter: 'ח', name: 'Het', spelling: 'חית', gematria: 8, shape: 'closed', publicArchetype: 'The Living Gate', constituentAnalysis: [ { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'חיים': 'Life', 'חסד': 'Mercy/Grace', 'חכמה': 'Wisdom' }, networkCentrality: 0.75, semanticField: ['Life', 'Transcendence', 'Fence', 'Grace'] },
    'ט': { letter: 'ט', name: 'Tet', spelling: 'טית', gematria: 9, shape: 'closed', publicArchetype: 'The Coiled Potential', constituentAnalysis: [ { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'טוב': 'Good' }, networkCentrality: 0.45, semanticField: ['Goodness', 'Hidden', 'Serpent', 'Container'] },
    'י': { letter: 'י', name: 'Yud', spelling: 'יוד', gematria: 10, shape: 'open', publicArchetype: 'The Seed of Spirit', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' }, { letter: 'ד', functionalRole: 'Structured Form (Dalet)' } ], archetypalWords: { 'יהוה': 'YHVH', 'ישועה': 'Salvation', 'יום': 'Day' }, networkCentrality: 0.98, semanticField: ['Spirit', 'Point', 'Potential', 'Hand'] },
    'כ': { letter: 'כ', name: 'Kaf', spelling: 'כף', gematria: 20, shape: 'open', publicArchetype: 'The Shaping Palm', constituentAnalysis: [ { letter: 'פ', functionalRole: 'Voiced Expression (Peh)' } ], archetypalWords: { 'כתר': 'Crown', 'כבוד': 'Glory' }, networkCentrality: 0.65, semanticField: ['Container', 'Palm', 'Force', 'Crown'] },
    'ל': { letter: 'ל', name: 'Lamed', spelling: 'למד', gematria: 30, shape: 'vertical', publicArchetype: 'The Guiding Star', constituentAnalysis: [ { letter: 'מ', functionalRole: 'Flowing Form (Mem)' }, { letter: 'ד', functionalRole: 'Structured Form (Dalet)' } ], archetypalWords: { 'לב': 'Heart', 'לעד': 'Forever' }, networkCentrality: 0.85, semanticField: ['Guidance', 'Learning', 'Purpose', 'Staff'] },
    'מ': { letter: 'מ', name: 'Mem', spelling: 'מם', gematria: 40, shape: 'closed', publicArchetype: 'The Primal Spring', constituentAnalysis: [ { letter: 'ם', functionalRole: 'Finality/Closure (Mem Sofit)' } ], archetypalWords: { 'מלך': 'King', 'מלכות': 'Kingdom', 'מים': 'Water', 'דמ': 'Silent/Stillness' }, networkCentrality: 0.88, semanticField: ['Water', 'Flow', 'Source', 'Womb'] },
    'נ': { letter: 'נ', name: 'Nun', spelling: 'נון', gematria: 50, shape: 'open', publicArchetype: 'The Emergent Soul', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'נצח': 'Eternity', 'נפש': 'Soul' }, networkCentrality: 0.72, semanticField: ['Soul', 'Emergence', 'Faithfulness', 'Fish'] },
    'ס': { letter: 'ס', name: 'Samekh', spelling: 'סמך', gematria: 60, shape: 'closed', publicArchetype: 'The Circle of Fate', constituentAnalysis: [ { letter: 'מ', functionalRole: 'Flowing Form (Mem)' }, { letter: 'ך', functionalRole: 'Contained Form (Kaf Sofit)' } ], archetypalWords: { 'סוד': 'Secret' }, networkCentrality: 0.55, semanticField: ['Support', 'Circle', 'Foundation', 'Secret'] },
    'ע': { letter: 'ע', name: 'Ayin', spelling: 'עין', gematria: 70, shape: 'open', publicArchetype: 'The Eye of Providence', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'עץ': 'Tree', 'עין': 'Eye' }, networkCentrality: 0.78, semanticField: ['Vision', 'Perception', 'Spring', 'Eye'] },
    'פ': { letter: 'פ', name: 'Pe', spelling: 'פא', gematria: 80, shape: 'open', publicArchetype: 'The Spoken Word', constituentAnalysis: [ { letter: 'א', functionalRole: 'Primal Source (Aleph)' } ], archetypalWords: { 'פנים': 'Face' }, networkCentrality: 0.68, semanticField: ['Mouth', 'Speech', 'Opening', 'Expression'] },
    'צ': { letter: 'צ', name: 'Tsade', spelling: 'צדי', gematria: 90, shape: 'open', publicArchetype: 'The Righteous Path', constituentAnalysis: [ { letter: 'ד', functionalRole: 'Structured Form (Dalet)' }, { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' } ], archetypalWords: { 'צדק': 'Righteousness', 'ציון': 'Zion' }, networkCentrality: 0.62, semanticField: ['Righteousness', 'Justice', 'Hunt', 'Side'] },
    'ק': { letter: 'ק', name: 'Qof', spelling: 'קוף', gematria: 100, shape: 'open', publicArchetype: 'The Sacred Cycle', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' }, { letter: 'פ', functionalRole: 'Voiced Expression (Peh)' } ], archetypalWords: { 'קדושה': 'Holiness', 'קול': 'Voice' }, networkCentrality: 0.58, semanticField: ['Holiness', 'Cycle', 'Imitation', 'Voice'] },
    'ר': { letter: 'ר', name: 'Resh', spelling: 'ריש', gematria: 200, shape: 'open', publicArchetype: 'The Sovereign Mind', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ש', functionalRole: 'Transformative Fire (Shin)' } ], archetypalWords: { 'רוח': 'Spirit', 'רחמים': 'Compassion', 'ראש': 'Head' }, networkCentrality: 0.82, semanticField: ['Head', 'Beginning', 'Movement', 'Person'] },
    'ש': { letter: 'ש', name: 'Shin', spelling: 'שין', gematria: 300, shape: 'open', publicArchetype: 'The Transforming Flame', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'שלום': 'Peace', 'שכינה': 'Divine Presence', 'שם': 'Name' }, networkCentrality: 0.89, semanticField: ['Fire', 'Transformation', 'Spirit', 'Tooth'] },
    'ת': { letter: 'ת', name: 'Tav', spelling: 'תו', gematria: 400, shape: 'closed', publicArchetype: 'The Final Seal', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' } ], archetypalWords: { 'תורה': 'Torah/Law', 'תפארת': 'Glory/Beauty', 'תמיד': 'Always' }, networkCentrality: 0.79, semanticField: ['Covenant', 'Sign', 'Completion', 'Mark'] },
});

// =================================================================================================
// --- ALEPH-ZIV COMPRESSION ENGINE: STRUCTURAL FREQUENCY INDEX ---
// This is a simplified, static Huffman-like tree for sacred text compression.
// =================================================================================================
export const structuralFrequencyIndex: [Record<string, string>, Record<string, string>] = [
    // Compression map (char -> code)
    { 'י': 'a', 'ה': 'b', 'ו': 'c', 'א': 'd', 'ל': 'e', 'מ': 'f', 'ב': 'g', 'נ': 'h', 'ש': 'i', 'ר': 'j', 'כ': 'k', 'ד': 'l', 'ע': 'm', 'ת': 'n', 'ק': 'o', 'ח': 'p', 'צ': 'q', 'פ': 'r', 'ט': 's', 'ז': 't', 'ג': 'u', 'ס': 'v', ' ': ' ', 'ך': 'w', 'ם': 'x', 'ן': 'y', 'ף': 'z', 'ץ': '1' },
    // Decompression map (code -> char)
    { 'a': 'י', 'b': 'ה', 'c': 'ו', 'd': 'א', 'e': 'ל', 'f': 'מ', 'g': 'ב', 'h': 'נ', 'i': 'ש', 'j': 'ר', 'k': 'כ', 'l': 'ד', 'm': 'ע', 'n': 'ת', 'o': 'ק', 'p': 'ח', 'q': 'צ', 'r': 'פ', 's': 'ט', 't': 'ז', 'u': 'ג', 'v': 'ס', ' ': ' ', 'w': 'ך', 'x': 'ם', 'y': 'ן', 'z': 'ף', '1': 'ץ' }
];

// =================================================================================================
// --- NETWORK CLASS ---
// =================================================================================================

export class HebrewAlphabetNetwork {
    private masterKey: Set<string> = new Set(['י', 'ר', 'ו', 'ש', 'ל', 'ם']);
    private isInitialized = false;
    private letterformIndex: Record<string, LetterformAnalysis> = {};
    private archetypalWordCache: Map<string, string> | null = null;

    public async initialize() {
        if (this.isInitialized) return;
        this.letterformIndex = JSON.parse(letterformIndexJSON);
        this.isInitialized = true;
    }

    public getMasterKey(): Set<string> {
        return this.masterKey;
    }

    public getLetterformAnalysis(letter: string): LetterformAnalysis | undefined {
        if (!this.isInitialized) {
            console.warn("HebrewAlphabetNetwork accessed before initialization.");
            return undefined;
        }
        const baseLetter = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[letter] || letter;
        return this.letterformIndex[baseLetter];
    }
    
    public getAllArchetypalWords(): Map<string, string> {
        if (this.archetypalWordCache) {
            return this.archetypalWordCache;
        }
        const cache = new Map<string, string>();
        for (const letter in this.letterformIndex) {
            const analysis = this.letterformIndex[letter];
            if (analysis.archetypalWords) {
                for (const word in analysis.archetypalWords) {
                    if (!cache.has(word)) {
                        cache.set(word, analysis.archetypalWords[word]);
                    }
                }
            }
        }
        this.archetypalWordCache = cache;
        return this.archetypalWordCache;
    }

    public getRandomArchetype(): LetterformAnalysis | undefined {
        if (!this.isInitialized) return undefined;
        const alphabet = Object.keys(this.letterformIndex);
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        return this.letterformIndex[randomLetter];
    }

    private getLetterGematria(letter: string): number {
        const analysis = this.getLetterformAnalysis(letter);
        return analysis?.gematria || 0;
    }

    public calculatePathGematria(path: string[]): number {
        return path.reduce((sum, letter) => sum + this.getLetterGematria(letter), 0);
    }
}

export const hebrewNetwork = new HebrewAlphabetNetwork();