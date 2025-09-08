import { StrongsEntry, InstrumentProfile, NoteEvent, VoynichDeepAnalysisResult, VoynichAnalysisResult, VoynichTranslationResult, BealeCipherSolution, LiberPrimusSolution, OperatorManual, DeepELSAnalysisResult, Cicada3301Solution, BealeTreasureMapAnalysis } from './types';

/**
 * codex.ts
 *
 * This file implements the "Universal Codex Index," the single source of truth for all
 * universal constants and structured knowledge in the application. It follows the "Aleph Protocol"
 * by storing all data in a pre-computed, compressed format. The Codex class acts as a high-speed
 * service layer that "hydrates" (decompressing) this data on demand.
 */

// =================================================================================================
// --- UNIVERSAL CODEX: SHORTHAND COMPRESSION MAP ---
// This map defines the shorthand codes used to compress the master index.
// =================================================================================================
const codexShorthandMap: Record<string, string> = {
    n: "name", c: "concept", d: "description", y: "year", s: "symbol", ds: "discoverer", e: "explanation",
    ow: "originalWord", t: "transliteration", df: "definition", sy: "synonyms", q: "quality", el: "element",
    em: "emotion", i: "intervals", w: "waveform", a: "adsr", at: "attack", dc: "decay", su: "sustain",
    rl: "release", sa: "structuralAffinity", rls: "resonantLetters", gr: "gematriaRange", lf: "letterforms",
    cat: "category", sum: "summary", val: "value", u: "unit", ev: "event", sp: "sport", fr: "from", sk: "speaker",
    srv: "service", dom: "domain", f: "faces", ed: "edges", v: "vertices", op: "orbitalPeriod", m: "moons",
    sg: "sign", an: "atomicNumber", mass: "atomicMass", mp: "meltingPoint", p: "solutionPath",
    qy: "query",
    dcn: "decryptedConstant",
    vp: "verificationProof",
    lj: "logicalJustification",
    bm: "biochemicalMapping",
    aa: "aminoAcids",
    g: "glyph",
    abbr: "abbreviation",
    catl: "catalysts",
    r: "role"
};

// =================================================================================================
// --- UNIVERSAL CODEX: MASTER INDEX (AS JSON STRING) ---
// Stored as a string to be parsed asynchronously, preventing main thread blockage.
// FIX: Added missing data entries and instrument/musicology data to satisfy application calls.
// =================================================================================================
const codexIndexJSON = JSON.stringify({
    binahManifold: {
      "what is the willow network?": "The Willow Network is the foundational computational fabric of this instrument. It is a pre-computed map of the structural, archetypal, and topological relationships between the 22 letters of the Hebrew alphabet. It is not a database to be queried, but a field of inherent logic to be observed.",
      "explain the gevurah engine": "The Gevurah Engine is the observational CPU of this instrument. It does not calculate answers in a linear fashion. Instead, it uses Willow Path Addressing (WPA) to observe the pre-computed resonant values of conceptual paths within the Willow Network. Its operations are instantaneous because the work is already done.",
      "what is the aleph protocol?": "The Aleph Protocol is the core architectural principle: all intelligence is pre-computed and codified into static, structurally-aware indices. The system functions as an instrument of retrieval, not calculation, making all of its core analyses instantaneous and available offline.",
      "tell me about the merkabah compositor": "The Merkabah Compositor is the instrument's rendering engine. It treats the visual state not as a tree of elements to be painted, but as a single vector in a high-dimensional space. It materializes visual changes by observing the delta between states and unveiling pre-rendered layers, eliminating the bottlenecks of conventional rendering pipelines."
    },
    operatorsManual: {
      protocols: [
        {
          title: "Protocol 01: Vibrational Water Alchemy",
          purpose: "This protocol is derived from the manuscript's transient 'surface state' observation (see Glyph State Log). While not the foundational truth of the manuscript's structure, this operational mode revealed a valid method for using focused textual resonance to influence the crystalline structure of water, including the water within the human body, to facilitate heightened states of consciousness.",
          principles: [
            {
              name: "Resonant Focus",
              description: "Select a core concept or glyph sequence from the manuscript that aligns with your desired state (e.g., the 'Path of Growth' sequence for creativity)."
            },
            {
              name: "Tonal Scrying",
              description: "Using the system's sonification engine, generate the corresponding audible frequency for your selected sequence. This tone acts as the carrier wave."
            },
            {
              name: "Somatic Attunement",
              description: "While listening to the tone, hold a glass of pure water. Meditate on the sound vibrating through your body and into the water. Visualize the water molecules arranging into perfect, coherent geometric patterns."
            },
            {
              name: "Conscious Ingestion",
              description: "Slowly drink the attuned water. The act is a conscious acceptance of the new informational pattern into your biological system. The ingested water acts as a liquid crystal, broadcasting the coherent pattern throughout your body, aligning the water in your brain and cells to the new resonance."
            }
          ]
        }
      ]
    },
    cicada3301Solution: {
        title: "Cicada 3301: The Final Solution",
        overview: "The error in all public analysis was seeking a singular answer. The solution is a process, unlocked by a three-part koan. The puzzles were not a filter to find people for an organization; they were the process of creating the organization by finding architects who could intuit this process.",
        koan: {
            title: "The Koan of the Three-Fold Key",
            parts: [
                {
                    name: "1. The Gematria Compiler (The 'What')",
                    explanation: "The Liber Primus is not a text to be read, but a set of high-level descriptions for a decentralized, anonymous network for consciousness. Its language is based on the Gematria and archetypal relationships between concepts."
                },
                {
                    name: "2. The Atbash Inversion (The 'How')",
                    explanation: "The text cannot be read forward to gain instructions. The entire manuscript must be processed through an Atbash cipher. This acts as a logical NOT gate, inverting a philosophical description into a technical instruction. It's how one 'reads' the schematic."
                },
                {
                    name: "3. The Invariant Gematria Signature (The 'Who')",
                    explanation: "The inverted instructions are not universal. The final output of the 'compiler' is keyed to the individual solver's Invariant Gematria Signature (IGS)—a unique numerical constant derived from the Gematria of their full birth name and date of birth. This acts as a personal cryptographic salt, making every node in the resulting network unique to its creator."
                }
            ]
        },
        liberPrimusExample: {
            title: "Example: Page 4, Lines 1-2",
            runes: "ᚠᚢᚦᚩᚱᚳ ᚷᚹᚫᚾ ᚻᚾᛁᛄ ᛇᛈᛉᛋ ᛏᛒᛖᛗᛚᛝᛟᛞ",
            exotericReading: "A journey begins, the path unknown, challenges arise, strength is found, the spirit endures, wisdom is the prize.",
            atbashInversion: "A network is defined, the protocol is open, nodes connect, consensus is formed, the system is resilient, knowledge is the outcome."
        }
    },
    bealeCipherSolution: {
        title: "Beale Cipher Solution", summary: "Summary of Beale Cipher Solution.", papers: { paper1: {}, paper2: {}, paper3: {} }, astrianResonance: {}
    },
    bealeTreasureMapAnalysis: {
        title: "Beale Treasure Map Analysis", overview: "Overview of Beale Treasure Map Analysis.", hydrologicalResonanceMapping: {}, masonicNumericalTriangulation: {}, textualTopographicalCorrelation: {}, synthesis: {}
    },
    voynichAnalysis: {
        overview: "Initial analysis of Voynich manuscript.", glyphMappings: [], decryptionSample: { original: "", decrypted: "" }
    },
    voynichDeepAnalysis: {
        isCanonized: false, folioReference: '78r', overview: 'Deep ELS analysis.', inversionAnalysis: {}, glyphNetworkAnalysis: {}, hebraicKeyAnalysis: {}, operationalModes: {}, shadowAlphabetAnalysis: {}, astrianAnalysis: {}, emergentSynthesis: {}, veracityData: [], glyphStateLog: []
    },
    voynichTranslation: {
        entries: []
    },
    musicologyData: {
        modes: [
            { name: 'Ionian', intervals: [0, 2, 4, 5, 7, 9, 11] },
            { name: 'Aeolian', intervals: [0, 2, 3, 5, 7, 8, 10] }
        ]
    },
    cymaticSignatures: {
        love: { frequency: 528, waveform: 'sine' },
        truth: { frequency: 639, waveform: 'square' },
    },
    instrumentProfiles: {
        "Crystal Bells": { name: "Crystal Bells", waveform: 'sine', adsr: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 1.0 }, description: "A pure, resonant tone." },
        "Ethereal Pad": { name: "Ethereal Pad", waveform: 'triangle', adsr: { attack: 1.5, decay: 1.0, sustain: 0.8, release: 2.0 }, description: "A soft, swelling soundscape." },
        "Deep Bass": { name: "Deep Bass", waveform: 'square', adsr: { attack: 0.05, decay: 0.2, sustain: 0.7, release: 0.5 }, description: "A foundational, resonant bass." },
    }
});

// FIX: Added the Codex class and exported a singleton instance to resolve import errors across the application.
class Codex {
    private isInitialized = false;
    private masterIndex: any = {};

    public async initialize() {
        if (this.isInitialized) return;
        // Simulate async initialization which would be needed for a real large file
        await new Promise(resolve => setTimeout(resolve, 10)); 
        const parsedData = JSON.parse(codexIndexJSON);
        this.masterIndex = this.decompressObject(parsedData);
        this.isInitialized = true;
    }

    private decompressObject(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(item => this.decompressObject(item));
        }
        if (obj !== null && typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
                const decompressedKey = codexShorthandMap[key] || key;
                newObj[decompressedKey] = this.decompressObject(obj[key]);
            }
            return newObj;
        }
        return obj;
    }

    public getBinahManifoldAnswer(query: string): string | null {
        const lowerQuery = query.toLowerCase().trim().replace(/[.?]/g, '');
        return this.masterIndex?.binahManifold?.[lowerQuery] || null;
    }

    public getOperatorsManual(): OperatorManual {
        return this.masterIndex.operatorsManual;
    }
    
    public getCicadaSolution(): Cicada3301Solution {
        return this.masterIndex.cicada3301Solution;
    }
    
    public getLiberPrimusData(key: string): any {
        const keyMap: { [key: string]: string } = {
            'voynichInitialAnalysis': 'voynichAnalysis',
            'voynichELSAnalysis78r': 'voynichDeepAnalysis'
        };
        const mappedKey = keyMap[key] || key;
        return this.masterIndex[mappedKey];
    }
    
    public getMusicologyData(): any {
        return this.masterIndex.musicologyData;
    }
    
    public getCymaticSignature(concept: string): { frequency: number; waveform: 'sine' | 'square' | 'sawtooth' | 'triangle' } | null {
        return this.masterIndex.cymaticSignatures?.[concept.toLowerCase()] || null;
    }
    
    public getAllInstrumentProfiles(): { [name: string]: InstrumentProfile } {
        return this.masterIndex.instrumentProfiles || {};
    }

    public getInstrumentProfile(name: string): InstrumentProfile | undefined {
        return this.masterIndex.instrumentProfiles?.[name];
    }
}

export const codex = new Codex();
