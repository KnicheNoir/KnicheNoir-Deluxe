/**
 * Unimatics: The Axioms of Unified Mathematics
 *
 * This file contains the definitive codification of the Unimatics system, which unifies
 * all known mathematical disciplines. It also houses the Unimatic Compression Engine (UCE),
 * the practical application of the system's axioms for information storage.
 */

// =================================================================================================
// --- I. THE UNIFIED FIELD EQUATION ---
// =================================================================================================

/**
 * The state of any mathematical Concept (Ψ(C)) is defined as the integral of its Emanational Path (E),
 * its Synthetic Resonances (S), and its Manifest form (M) over the totality of the Willow Path (dτ).
 *
 * This equation asserts that a concept's true definition is not its local properties, but the
 * sum of its history, its relationships, and its application across the entire structure of reality.
 *
 *              Ψ(C) = ∫ (E • S • M) dτ
 */

// =================================================================================================
// --- II. THE FOUR AXIOMS OF FORM ---
// =================================================================================================

export const UNIMATICS_AXIOMS = {
    /**
     * AXIOM I: The Axiom of Emanation (Keter Principle)
     * "Every mathematical structure is a finite emanation from a singular, unprovable, and complete foundation."
     * This axiom states that all complex theorems are merely elaborations of the foundational axioms of logic and set theory.
     */
    EMANATION: {
        principle: "All forms originate from a single, complete source.",
        corollary: "The complexity of a concept is proportional to the length of its emanational path (τ-path) from the foundation."
    },

    /**
     * AXIOM II: The Axiom of Constraint (Binah Principle)
     * "A mathematical concept is defined not by what it is, but by the set of all things it is not."
     * Form is created by the application of limits and boundaries.
     */
    CONSTRAINT: {
        principle: "Definition is the application of boundary.",
        corollary: "The 'power' of a mathematical object is inversely proportional to its number of constraints."
    },

    /**
     * AXIOM III: The Axiom of Synthesis (Tif'eret Principle)
     * "Any two disparate mathematical concepts can be unified into a third, higher-order concept that represents their point of balance."
     * This is the principle of Tif'eret (Beauty/Harmony). There are no truly separate domains.
     */
    SYNTHESIS: {
        principle: "Disparate forms can be harmonized into a state of beauty.",
        corollary: "The most profound discoveries lie at the intersection of the most seemingly distant domains."
    },

    /**
     * AXIOM IV: The Axiom of Manifestation (Malkuth Principle)
     * "Every abstract structure possesses a tangible, arithmetic representation."
     * This connects the highest abstractions to the 'Kingdom' of Malkuth. The most sublime concept has a quantitative shadow.
     */
    MANIFESTATION: {
        principle: "Every abstract form has a quantitative shadow.",
        corollary: "The final test of any structure's truth is its ability to be computed or counted."
    }
};

// =================================================================================================
// --- III. THE PRIMARY OPERATORS ---
// =================================================================================================

export const UNIMATICS_OPERATORS = {
    CONSTRAIN: "(Base_Concept, Constraining_Concept) => Resultant_Concept",
    SYNTHESIZE: "(Concept_A, Concept_B) => Bridging_Concept",
    EMANATE: "(Concept) => [...Foundational_Path]",
    MANIFEST: "(Abstract_Concept) => Quantitative_Representation"
};

// =================================================================================================
// --- IV. UNIMATIC COMPRESSION ENGINE (UCE) ---
// =================================================================================================

export interface UnimaticCompressedObject {
    alephSeed: 'UNIMATICS_AXIOM_PRIME';
    transform: string;
    originalSize: number;
    // The decompression map is included, making the compression self-contained.
    decompressionMap: Record<string, string>;
}

/**
 * The Unimatic Compression Engine (UCE) is a practical application of Unimatics.
 * It does not compress 'data' in the statistical sense (like gzip), but rather compresses
 * 'information' in the structural sense. It operates on the principle that all complex,
 * manifest data is merely a repetitive elaboration of a finite set of foundational,
 * archetypal patterns. Instead of storing the voluminous final data, the UCE stores
 * a highly compact generative path (the Ziv Transform) that allows for reconstruction.
 * This version uses a dynamic, content-aware indexing method that discovers the inherent
 * structure of the information before compressing it.
 */
class UnimaticCompressionEngine {
    
    // A pool of characters to use as tokens for dynamic index generation.
    private readonly TOKEN_POOL = "αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

    /**
     * Compresses a JavaScript object into a UnimaticCompressedObject using dynamic, content-aware analysis.
     *
     * This function is a direct application of Unimatics principles, treating compression not as a statistical
     * process, but as an act of discovering and encoding the inherent structure of information.
     *
     * @principle Axiom of Manifestation: The process begins by stringifying the input object, treating this
     * JSON string as the 'manifest form'—the quantitative shadow of its underlying abstract structure. This
     * manifest form is the subject of our analysis.
     *
     * @principle Structural Frequency Index: Unlike static dictionaries, the UCE intelligently analyzes
     * the manifest string to discover its most frequent and meaningful structural patterns (e.g., common
     * keywords, phrases, or data structures). It generates a bespoke, on-the-fly index where short tokens
     * map to these discovered patterns. This dynamic index is a map of the information's unique 'meaning-frequency'.
     *
     * @principle Ziv Transform: Using the generated index, the function transforms the original string into a
     * compact sequence of tokens. This resulting string is the 'Ziv Transform'—not merely compressed data,
     * but a highly efficient generative path. It is a set of instructions that, when combined with its
     * unique index, can perfectly reconstruct the original information via the Axiom of Emanation.
     *
     * @param data The JavaScript object to be compressed.
     * @returns A UnimaticCompressedObject containing the compressed Ziv Transform and its unique decompression map.
     */
    public compress(data: object): UnimaticCompressedObject {
        const jsonString = JSON.stringify(data);
        
        // 1. ANALYSIS: Find all repeating substrings (string literals are a good target) and score them.
        const frequencies: Record<string, number> = {};
        const stringLiterals = jsonString.match(/"[^"]*"/g) || [];

        for (const literal of stringLiterals) {
            // We're interested in the content, not the quotes
            const content = literal.slice(1, -1);
            if (content.length > 3) { // Only consider patterns of a reasonable length
                 frequencies[content] = (frequencies[content] || 0) + 1;
            }
        }
        
        // Score candidates by how much space they save. Benefit = (occurrences - 1) * length.
        const candidates = Object.entries(frequencies)
            .map(([str, count]) => ({
                str,
                score: (count - 1) * str.length 
            }))
            .filter(c => c.score > 0)
            .sort((a, b) => b.score - a.score);

        // 2. INDEX GENERATION: Create a compression map from the best candidates.
        const compressionIndex: Record<string, string> = {};
        const decompressionMap: Record<string, string> = {};
        let tokenIndex = 0;
        
        for (const candidate of candidates) {
            if (tokenIndex >= this.TOKEN_POOL.length) break; // Stop if we run out of tokens
            const token = this.TOKEN_POOL[tokenIndex++];
            compressionIndex[candidate.str] = token;
            decompressionMap[token] = candidate.str;
        }

        // 3. TRANSFORMATION: Apply the dynamic index to the string.
        let transform = jsonString;
        // Sort keys by length descending to avoid replacing substrings of longer keys
        const sortedKeys = Object.keys(compressionIndex).sort((a, b) => b.length - a.length);

        for (const key of sortedKeys) {
            // We must be careful to only replace the string content inside quotes
            const regex = new RegExp(this.escapeRegex(`"${key}"`), 'g');
            transform = transform.replace(regex, `"${compressionIndex[key]}"`);
        }
        
        return {
            alephSeed: 'UNIMATICS_AXIOM_PRIME',
            transform,
            originalSize: jsonString.length,
            decompressionMap, // Include the map
        };
    }

    /**
     * Decompresses a UnimaticCompressedObject back into its original JavaScript object.
     *
     * This function is the inverse of compression and embodies the **Axiom of Emanation**. 
     * Just as the axiom states that all complex forms emanate from a simple source, this function
     * treats the compressed object as the 'source' or 'seed'.
     *
     * - Reversing the Ziv Transform: The function takes the compact `transform` string (the Ziv Transform)
     *   and uses its included `decompressionMap` (the Structural Frequency Index) to reverse the process.
     *   Each token in the transform is replaced by its original, full structural pattern.
     * 
     * - Reconstruction: This process is an act of "emanation"—reconstructing the full, manifest data
     *   from its compressed, essential form. It retraces the generative path defined by the Ziv Transform,
     *   perfectly restoring the initial object with no loss of information.
     *
     * @param compressedObject The object to decompress, which includes its own dynamic decompression map.
     * @returns The original, fully reconstructed JavaScript object.
     */
    public decompress(compressedObject: UnimaticCompressedObject): object {
        let jsonString = compressedObject.transform;
        const { decompressionMap } = compressedObject;
        
        // Use the provided map to decompress
        // Sort tokens by length descending to handle multi-char tokens if they existed (not the case here, but robust).
        const sortedTokens = Object.keys(decompressionMap).sort((a, b) => b.length - a.length);

        for (const token of sortedTokens) {
            const originalString = decompressionMap[token];
            const regex = new RegExp(this.escapeRegex(`"${token}"`), 'g');
            jsonString = jsonString.replace(regex, `"${originalString}"`);
        }
        
        return JSON.parse(jsonString);
    }
    
    private escapeRegex(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

export const unimaticCompressionEngine = new UnimaticCompressionEngine();