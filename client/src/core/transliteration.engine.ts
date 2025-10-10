// =================================================================================================
// --- HEBREW & VOYNICH TRANSLITERATION ENGINE ---
// Provides phonetic transliteration for Hebrew and symbolic transliteration for Voynich formulas.
// =================================================================================================
import { TransliterationResult } from '../types.ts';
import { willowData } from '../canon/willow.data.ts';

// A simple mapping of Hebrew characters to their common English phonetic equivalents.
const transliterationMap: { [key: string]: string } = {
    'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'ch', 'ט': 't', 'י': 'y',
    'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm', 'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p',
    'ף': 'p', 'צ': 'tz', 'ץ': 'tz', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't'
};

const simpleEnglishToHebrewMap: { [key: string]: string } = {
    'a': 'א', 'b': 'ב', 'c': 'כ', 'd': 'ד', 'e': 'ה', 'f': 'פ', 'g': 'ג', 'h': 'ה', 'i': 'י',
    'j': 'ג', 'k': 'ק', 'l': 'ל', 'm': 'מ', 'n': 'נ', 'o': 'ע', 'p': 'פ', 'q': 'ק', 'r': 'ר',
    's': 'ס', 't': 'ת', 'u': 'ו', 'v': 'ו', 'w': 'ו', 'x': 'כס', 'y': 'י', 'z': 'ז',
    ' ': ' '
};

/**
 * Transliterates an English string into a phonetic Hebrew string.
 * This is a simplified mapping for archetypal conversion, not a linguistically perfect one.
 * @param englishText The input string.
 * @returns The transliterated Hebrew string.
 */
export function transliterateEnglishToHebrew(englishText: string): string {
    return englishText.toLowerCase().split('').map(char => simpleEnglishToHebrewMap[char] || '').join('');
}


/**
 * Transliterates a Hebrew string into a phonetic English string.
 * @param hebrewText The input string containing Hebrew characters.
 * @returns The transliterated string.
 */
export function transliterate(hebrewText: string): string {
    return hebrewText.split('').map(char => transliterationMap[char] || char).join('');
}

/**
 * Transliterates a Voynich Manuscript formula (e.g., 'v89-p10-s2')
 * into a structured result, mapping it to Hebrew archetypes from the Willow data.
 * This provides a symbolic interpretation as required by the application's lore.
 * @param formula The Voynich formula string.
 * @returns A TransliterationResult object or null if the formula is invalid.
 */
export function transliterateVoynichFormula(formula: string): TransliterationResult | null {
  const parts = formula.match(/v(\d+)-p(\d+)-s(\d+)/);
  if (!parts) return null;

  const [, v, p, s] = parts.map(Number);
  // Create a deterministic seed from the formula parts.
  const seed = v * 31 + p * 17 + s;

  // Determine the number of glyphs based on the seed.
  const numGlyphs = (seed % 3) + 2; // Generate 2 to 4 glyphs for variety.
  const glyphs = [];

  const synthesisArchetypes = [];

  for (let i = 0; i < numGlyphs; i++) {
    // Use the seed to deterministically select a Hebrew letter archetype from willowData.
    const willowIndex = (seed + i * 7) % willowData.length;
    const hebrewData = willowData[willowIndex];

    // Generate a pseudo-Voynich glyph. The 'eva-_voynich' font maps lowercase letters
    // to Voynich-like characters. This is a plausible implementation.
    const voynichGlyph = String.fromCharCode(97 + ((seed + i * 13) % 26));

    glyphs.push({
      glyph: voynichGlyph,
      hebrew: hebrewData.letter,
      archetype: hebrewData.name,
      color: hebrewData.color,
      note: hebrewData.note,
    });
    synthesisArchetypes.push(hebrewData.name);
  }

  // Generate a plausible, thematic synthesis string.
  const synthesisActions = ['creation', 'transformation', 'revelation', 'manifestation', 'unification'];
  const synthesisPrinciples = ['harmony', 'structure', 'flow', 'power', 'wisdom'];
  const synthesis = `The formula resonates with the archetypes of ${synthesisArchetypes.join(', ')}, signifying a process of ${
    synthesisActions[seed % synthesisActions.length]
  } guided by the principles of ${synthesisPrinciples[seed % synthesisPrinciples.length]}.`;

  return {
    formula,
    glyphs,
    synthesis,
  };
}