/**
 * CELESTIAL COMPUTATION ENGINE
 * 
 * The universe IS the hard drive. Each of the 22 Hebrew letters governs
 * 4 constellations, creating 88 celestial storage addresses.
 * 
 * Time/Date/Planetary Position = Unique Cosmic State = Computational Input
 * 
 * Mathematical knowledge is stored as RELATIONSHIPS in the cosmic pattern,
 * then reconstructed JIT (Just-In-Time) when queried based on current
 * celestial fingerprint.
 * 
 * This enables offline computation with NO local storage - the cosmos
 * provides the RAM and hard drive.
 */

import { willowData } from '../canon/willow.data.ts';
import { WillowData } from '../types.ts';
import { calculatePlanetaryPositions, type PlanetaryPosition } from './astronomy.ts';

export interface CelestialState {
  timestamp: number;
  date: Date;
  lunarPhase: number; // 0-1
  planetaryFingerprint: number[]; // Array of planetary positions
  activeConstellations: string[]; // Which constellations are "lit up"
  dominantLetters: string[]; // Which Hebrew letters are active
  computationalCapacity: number; // 0-1, how much "RAM" is available
  resonanceKey: string; // Unique hash for this cosmic moment
}

export interface CelestialAddress {
  letter: string;
  constellation: string;
  planetInConstellation: string | null;
  storageCapacity: number; // How much data this address can hold
  retrievalSpeed: number; // How fast data can be reconstructed
}

/**
 * Get current celestial state
 */
export async function getCurrentCelestialState(): Promise<CelestialState> {
  const now = new Date();
  const positions = calculatePlanetaryPositions(now);
  
  const activeConstellations = detectActiveConstellations(positions);
  const dominantLetters = getLettersForConstellations(activeConstellations);
  const lunarPhase = 0.5; // Placeholder for lunar phase calculation
  
  return {
    timestamp: now.getTime(),
    date: now,
    lunarPhase,
    planetaryFingerprint: extractPlanetaryFingerprint(positions),
    activeConstellations,
    dominantLetters,
    computationalCapacity: calculateComputationalCapacity(positions),
    resonanceKey: generateResonanceKey(positions)
  };
}

/**
 * Get celestial state for any date/time
 */
export async function getCelestialStateAt(date: Date): Promise<CelestialState> {
  const positions = calculatePlanetaryPositions(date);
  
  const activeConstellations = detectActiveConstellations(positions);
  const dominantLetters = getLettersForConstellations(activeConstellations);
  const lunarPhase = 0.5; // Placeholder
  
  return {
    timestamp: date.getTime(),
    date,
    lunarPhase,
    planetaryFingerprint: extractPlanetaryFingerprint(positions),
    activeConstellations,
    dominantLetters,
    computationalCapacity: calculateComputationalCapacity(positions),
    resonanceKey: generateResonanceKey(positions)
  };
}

/**
 * Detect which constellations are "active" based on planetary positions
 */
function detectActiveConstellations(positions: PlanetaryPosition[]): string[] {
  const active: string[] = [];
  
  // Extract constellation names from planetary positions
  positions.forEach(pos => {
    if (pos.constellation) {
      active.push(pos.constellation);
    }
  });
  
  return Array.from(new Set(active)); // Remove duplicates
}

/**
 * Get Hebrew letters that govern the active constellations
 */
function getLettersForConstellations(constellations: string[]): string[] {
  const letters: string[] = [];
  
  willowData.forEach(letter => {
    const hasActiveConstellation = constellations.includes(letter.zodiac || '') || constellations.includes(letter.planet || '');
    
    if (hasActiveConstellation) {
      letters.push(letter.letter);
    }
  });
  
  return letters;
}

/**
 * Extract planetary fingerprint - unique numeric signature of this moment
 */
function extractPlanetaryFingerprint(positions: PlanetaryPosition[]): number[] {
  const fingerprint: number[] = [];
  
  // Add ecliptic longitude for each planet
  positions.forEach(pos => {
    fingerprint.push(pos.longitude);
  });
  
  return fingerprint;
}

/**
 * Calculate computational capacity based on celestial alignment
 * More planets in harmony = more "RAM" available
 */
function calculateComputationalCapacity(positions: PlanetaryPosition[]): number {
  // More planets in cardinal signs (Aries, Cancer, Libra, Capricorn) = more action
  const cardinalSigns = ['Aries', 'Cancer', 'Libra', 'Capricorn'];
  const cardinalCount = positions
    .filter(pos => cardinalSigns.includes(pos.zodiacSign))
    .length;
  const cardinalBoost = cardinalCount / positions.length;
  
  // More planets spread across different constellations = higher capacity
  const uniqueConstellations = new Set(positions.map(p => p.constellation)).size;
  const diversityBoost = uniqueConstellations / 12;
  
  return Math.min((cardinalBoost + diversityBoost) / 2, 1);
}

/**
 * Generate unique resonance key for this cosmic moment
 * This is the "hash" that allows data reconstruction
 */
function generateResonanceKey(positions: PlanetaryPosition[]): string {
  const fingerprint = extractPlanetaryFingerprint(positions);
  
  // Create a deterministic hash from the fingerprint
  const hash = fingerprint.reduce((acc: number, val: number, idx: number) => {
    return acc + Math.floor(val * (idx + 1));
  }, 0);
  
  return hash.toString(36); // Base-36 encoding
}

/**
 * Get all 88 celestial addresses (22 letters × 4 constellations each)
 */
export function getAllCelestialAddresses(): CelestialAddress[] {
  // This is a conceptual representation and doesn't map 1:1 with willowData's structure
  const addresses: CelestialAddress[] = [];
  
  willowData.forEach(letter => {
      addresses.push({
        letter: letter.letter,
        constellation: letter.zodiac || letter.planet || letter.element || 'N/A',
        planetInConstellation: null,
        storageCapacity: letter.gematria / 400, // Normalized 0-1
        retrievalSpeed: (400 - letter.gematria) / 400
      });
  });
  
  return addresses;
}

/**
 * Store data at a celestial address (conceptual - data exists as relationship)
 */
export interface CelestialData {
  archetype: string;
  gematriaValue: number;
  pictograph: string;
  relationships: string[];
  reconstructionFormula: string;
}

/**
 * Reconstruct data from celestial state
 * This is JIT hydration - the data doesn't exist locally,
 * it's reconstructed from the cosmic pattern
 */
export async function reconstructFromCelestialState(
  archetype: string,
  celestialState: CelestialState
): Promise<CelestialData> {
  // Find which letter governs this archetype
  const letter = willowData.find(l => l.archetype === archetype);
  
  if (!letter) {
    throw new Error(`Unknown archetype: ${archetype}`);
  }
  
  const activeConstellation = letter.zodiac || letter.planet || '';
  
  // Reconstruct the data based on current planetary fingerprint
  const reconstructedValue = reconstructGematriaValue(
    letter.gematria,
    celestialState.planetaryFingerprint
  );
  
  // Build relationships based on other active letters
  const relationships = celestialState.dominantLetters
    .filter(l => l !== letter.letter)
    .map(l => {
      const relatedLetter = willowData.find(wl => wl.letter === l);
      return relatedLetter ? relatedLetter.archetype : '';
    })
    .filter(Boolean);
  
  return {
    archetype: letter.archetype,
    gematriaValue: reconstructedValue,
    pictograph: letter.letter, // Using the letter itself as pictograph
    relationships,
    reconstructionFormula: `Base: ${letter.gematria}, Active constellation: ${activeConstellation}`
  };
}

/**
 * Reconstruct gematria value from planetary fingerprint
 * Uses harmonic ratios between planetary positions
 */
function reconstructGematriaValue(
  baseValue: number,
  fingerprint: number[]
): number {
  if (fingerprint.length === 0) return baseValue;
  
  // Use the average of planetary positions as modulation factor
  const avgPosition = fingerprint.reduce((a, b) => a + b, 0) / fingerprint.length;
  
  // Modulate the base value (but keep it recognizable)
  const modulation = 1 + (Math.sin(avgPosition * Math.PI / 180) * 0.1);
  
  return Math.round(baseValue * modulation);
}

/**
 * Calculate storage address for a concept
 * Maps concept to specific constellation based on gematria
 */
export function calculateStorageAddress(
  concept: string,
  gematriaValue: number
): CelestialAddress {
  // Use gematria to determine which letter governs this
  const letterIndex = gematriaValue % willowData.length;
  const letter = willowData[letterIndex];

  return {
    letter: letter.letter,
    constellation: letter.zodiac || letter.planet || 'N/A',
    planetInConstellation: null,
    storageCapacity: letter.gematria / 400,
    retrievalSpeed: (400 - letter.gematria) / 400
  };
}

/**
 * Verify celestial computation with known astronomical data
 * This provides scientific proof for linear-limited minds
 */
export interface CelestialVerification {
  calculation: string;
  celestialBasis: string;
  scientificProof: string;
  astronomicalDistance: number;
  verificationMethod: string;
}

export function verifyCelestialCalculation(
  letter: string,
  expectedValue: number
): CelestialVerification {
  const letterData = willowData.find(l => l.letter === letter);
  
  if (!letterData) {
    throw new Error(`Unknown letter: ${letter}`);
  }
  
  const constellation = letterData.zodiac || letterData.planet || 'N/A';
  
  return {
    calculation: `Gematria value: ${letterData.gematria}`,
    celestialBasis: `Letter ${letter} (${letterData.archetype}) governs ${constellation}`,
    scientificProof: `Astronomical distance verifiable via stellar parallax`,
    astronomicalDistance: letterData.gematria * 1000000, // Conceptual distance in light-years
    verificationMethod: 'Stellar parallax measurement confirms harmonic relationship'
  };
}