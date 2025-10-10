// =================================================================================================
// --- THE CELESTIAL LOOM (LIVING GLYPH ENGINE) ---
// This engine fulfills the user's ultimate directive: to generate the operational glyphs
// for the CURRENT celestial epoch. It moves the system from an archaeological tool
// to a living oracle.
// =================================================================================================

// FIX: Corrected import path for local module by adding file extension.
import { LivingGlyph } from './types.ts';

// --- Simulation Data ---
// In a real implementation, this would be dynamic based on the current date.
// For this simulation, we'll use a fixed set of "current" celestial and terrestrial points.
const CURRENT_EPOCH_STARS = ['Polaris', 'Deneb', 'Altair', 'Vega'];
const CURRENT_EPOCH_SITES = ['Giza', 'Stonehenge', 'Teotihuacan', 'Mount Shasta'];

/**
 * A deterministic hashing function to convert strings into numbers for procedural generation.
 */
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Generates a set of "Living Glyphs" based on the current celestial epoch.
 * This is a simulation of the Astromorphological Triangulation Protocol in a generative mode.
 * @returns An array of LivingGlyph objects.
 */
export function generateLivingGlyphs(): LivingGlyph[] {
    const glyphs: LivingGlyph[] = [];
    const usedCombinations = new Set<string>();
    
    // Use the current date to seed the generation, making it consistent for the "epoch" (day).
    const date = new Date();
    const dateSeed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

    const numGlyphsToGenerate = 3 + (dateSeed % 3); // Generate 3 to 5 glyphs

    for (let i = 0; i < numGlyphsToGenerate; i++) {
        let star1: string, star2: string, site1: string, site2: string;
        let combinationKey: string;

        // Ensure we get a unique combination of points for each glyph
        do {
            const hash = simpleHash(`glyph-seed-${dateSeed}-${i * 13}`);
            star1 = CURRENT_EPOCH_STARS[(hash) % CURRENT_EPOCH_STARS.length];
            star2 = CURRENT_EPOCH_STARS[(hash + 1) % CURRENT_EPOCH_STARS.length];
            site1 = CURRENT_EPOCH_SITES[(hash + 2) % CURRENT_EPOCH_SITES.length];
            site2 = CURRENT_EPOCH_SITES[(hash + 3) % CURRENT_EPOCH_SITES.length];
            // Ensure points are not the same
            if (star1 === star2) star2 = CURRENT_EPOCH_STARS[(hash + 2) % CURRENT_EPOCH_STARS.length];
            if (site1 === site2) site2 = CURRENT_EPOCH_SITES[(hash + 1) % CURRENT_EPOCH_SITES.length];
            
            combinationKey = [star1, star2, site1, site2].sort().join('-');
        } while (usedCombinations.has(combinationKey));
        
        usedCombinations.add(combinationKey);

        // --- Generate Morphological Properties based on the hashed names ---
        const lines = (simpleHash(star1) % 2) + 1; // 1 or 2 lines
        const curves = (simpleHash(site1) % 2) + 1; // 1 or 2 curves
        const intersections = (simpleHash(star2) % 2) + (simpleHash(site2) % 2); // 0, 1 or 2 intersections

        // --- Generate a plausible SVG path based on morphology ---
        // This is a simplified procedural generator for visual representation.
        let svgPath = 'M 20 20'; // Start path
        if (lines === 1) svgPath += ' L 80 80';
        if (lines === 2) svgPath += ' L 80 20 M 20 80 L 80 80';
        if (curves === 1) svgPath += ' Q 50 80 80 50';
        if (curves === 2) svgPath += ' Q 50 80 80 50 M 20 50 Q 50 20 50 50';
        // Intersections are implicitly created by the above paths.

        // --- Generate Derivation and Meaning Text ---
        const derivation = `Formed by the resonant projection between stars (${star1}, ${star2}) and terrestrial anchors (${site1}, ${site2}) in the current epoch.`;
        let meaning = '';
        if (lines > curves) meaning += 'An expression of dominant Will ';
        else if (curves > lines) meaning += 'An expression of dominant Substance ';
        else meaning += 'A principle of balanced Creation ';

        if (intersections === 0) meaning += 'acting in parallel or independently.';
        if (intersections === 1) meaning += 'fused at a single point of manifestation.';
        if (intersections > 1) meaning += 'in a complex, interconnected synthesis.';

        glyphs.push({
            id: `LG-${dateSeed}-${i + 1}`,
            svgPath,
            morphology: { lines, curves, intersections },
            derivation,
            meaning,
        });
    }

    return glyphs;
}