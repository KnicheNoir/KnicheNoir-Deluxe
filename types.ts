/**
 * types.ts
 *
 * Centralized type definitions for the Astrian Key application.
 * This file provides a single source of truth for all data structures,
 * promoting consistency and ease of maintenance.
 */

// =================================================================================================
// --- CORE SESSION & MESSAGING TYPES (REPAIRED) ---
// These foundational types were being imported across the app but were missing from this file.
// Their inclusion repairs a critical structural issue.
// =================================================================================================

export interface SessionRecord {
    id: string;
    timestamp: Date;
    type: 'user' | 'ai' | 'system' | 'component';
}

export interface UserMessage extends SessionRecord {
    type: 'user';
    text: string;
}

export interface AIMessage extends SessionRecord {
    type: 'ai';
    text: string;
    analysisType: 'chat' | 'voynich_analysis' | 'voynich_deep_analysis' | 'voynich_translation' | 'beale_cipher_solution' | 'gematria' | 'els' | 'deep_els' | 'resonance' | 'palmistry' | 'voice' | 'cicada_3301_solution';
    result?: any;
    isFavorite?: boolean;
}

export interface SystemMessage extends SessionRecord {
    type: 'system';
    text: string;
}

export interface ComponentMessage extends SessionRecord {
    type: 'component';
    component: React.ReactNode;
}


// =================================================================================================
// --- NEW CORE UI TYPES ---
// =================================================================================================

/** Defines the primary application view: the macro 'globe' or the focused 'callSign'. */
export type ViewMode = 'boot' | 'globe' | 'callSign';

/** Defines a navigational point of interest on the globe. */
export interface CallSign {
    name: string;
    lat: number;
    lon: number;
    color: 'primary' | 'secondary';
}

/** Represents a user-created tool or widget in the Home view. */
export interface CustomTool {
    id: string;
    name: string;
    icon: string; // For simplicity, we'll use emoji or a specific string key for an icon set
    purpose: string;
}

/** Represents the state of a widget in the Home view's dynamic dashboard. */
export interface WidgetState {
    id: string;
    type: 'creator' | 'notepad';
    position: { x: number; y: number };
    size: { width: number; height: number };
    content?: string; // For notepad
}

/** Defines the types of toast notifications. */
export interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'error';
}

// =================================================================================================
// --- ASTRIAN KEY SPECIFIC DATA & SESSION TYPES ---
// =================================================================================================

/** Defines the possible intents behind a user query. */
export type GuidingIntent = 'Neutral' | 'Analytical' | 'Creative' | 'Divinatory';

/** The structure for AWE (Astrian Weighted Embodiment) data. */
export interface AWEFormData {
    fullNameAtBirth: string;
    currentNameUsed: string;
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    inflectionPoints: { description: string; date: string }[];
    relationalNodeHarmonious: string;
    relationalNodeChallenging: string;
    geographicAnchor: string;
    centralQuestion: string;
    visualCipherConcepts: string[];
}

/** The structure for an entrainment session profile. */
export interface EntrainmentProfile {
    name: string;
    description: string;
    type: 'binaural' | 'isochronic';
    baseFrequency: number;
    targetFrequency: number;
}

/** Defines an active entrainment session with a stop function. */
export interface ActiveEntrainmentSession {
    profile: EntrainmentProfile;
    stop: () => void;
}

/** Structure for the visual challenge in session unlocking. */
export interface VisualChallenge {
    prompt: string;
    images: string[]; // URLs or base64 strings
    correctIndices: number[];
}

// =================================================================================================
// --- ANALYSIS & COMPOSITION RESULT TYPES ---
// =================================================================================================

/** Represents a single finding during an active solve session. */
export interface SolveFinding {
    id: string;
    timestamp: Date;
    type: 'Pattern' | 'Resonance' | 'ELS' | 'Synthesis' | 'Query';
    content: string;
    confidence: number;
}

/** Structure for an active solve session. */
export interface ActiveSolveSession {
    isActive: boolean;
    target: string;
    startTime: Date;
    findings: SolveFinding[];
}

/** Structure for a single entry in an ELS analysis. */
export interface ELSResult {
    word: string;
    englishMeaning: string;
    transliteration: string;
    direction: string;
    skip: number;
    verses: string;
    path: { row: number; col: number }[];
}

/** Structure for a deep ELS analysis result. */
export interface DeepELSAnalysisResult {
    textGrid: {
        text: string;
        explanation: string;
    };
    elsAnalysis: ELSResult[];
}

/** A single correspondence found in a resonance analysis. */
export interface CascadeCorrespondence {
    domain: string;
    correspondence: string;
    explanation: string;
}

/** The full result of an exhaustive resonance analysis. */
export interface ExhaustiveResonanceResult {
    query: string;
    gematriaValue: number;
    resonanceCascade: CascadeCorrespondence[];
}

export interface GematriaAnalysis {
    word: string;
    englishMeaning: string;
    transliteration: string;
    standard: number;
    ordinal: number;
    reduced: number;
    kolel: number;
    atbashWord: string;
    atbashValue: number;
    milui: number;
}

/** The result of a palmistry analysis from an image. */
export interface PalmistryAnalysisResult {
    analysisTitle: string;
    overallReading: { title: string; explanation: string };
    lifeLine: { title: string; explanation: string };
    headLine: { title: string; explanation: string };
    heartLine: { title: string; explanation: string };
    fateLine?: { title: string; explanation: string };
    majorMounts: { title: string; explanation: string };
}

/** The result of a voice resonance analysis. */
export interface VoiceResonanceAnalysisResult {
    analysisTitle: string;
    coreVibrationalTone: { title: string; explanation: string };
    prosodicFlow: { title: string; explanation: string };
    expressivePower: { title: string; explanation: string };
}

/** An entry in a Strong's Concordance lookup. */
export interface StrongsEntry {
    number: number;
    lemma: string;
    transliteration: string;
    pronunciation: string;
    definition: string;
}

/** A single note event in a musical composition. */
export interface NoteEvent {
    pitch: number;
    frequency: number;
    startTime: number;
    duration: number;
    velocity: number;
}

/** A track within a musical composition. */
export interface MusicalTrack {
    name: 'melody' | 'harmony' | 'bass' | 'rhythm';
    analysis: {
        query: string;
        analysis: any[]; // Placeholder for future analysis data
    };
    notes: NoteEvent[];
}

/** A complete musical composition. */
export interface MusicalComposition {
    id: string;
    isFavorite: boolean;
    metadata: {
        key: string;
        mode: string;
        bpm: number;
        sourceReference: string;
        genre?: string;
        solfeggioFrequency?: number;
    };
    tracks: MusicalTrack[];
}

/** An active instructional composition session. */
export interface InstructionalCompositionSession {
    composition: MusicalComposition;
    stop: () => void;
    analyserNode: AnalyserNode;
    audioUrl: string;
}

/** AI-generated production notes for a composition. */
export interface AIProductionNotes {
    overallMood: string;
    instruments: {
        trackName: string;
        instrumentName: string;
        rationale: string;
    }[];
    arrangement: string;
    mixing: string;
    mastering: string;
}

/** Profile for a synthesized instrument. */
export interface InstrumentProfile {
    name: string;
    waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
    adsr: {
        attack: number;
        decay: number;
        sustain: number;
        release: number;
    };
    description: string;
    structuralAffinity: {
        gematriaRange?: [number, number];
        letterforms?: string[];
        resonantLetters?: string[];
    };
}

export interface ResonancePotentialMapResult {
    query: string;
    primaryInterpretation: string;
    structuralHubs: {
        letter: string;
        name: string;
        centrality: number | undefined;
    }[];
    entangledConcepts: string[];
}

export interface CompassCipherResult {
    mode: 'encode' | 'decode';
    offset: number;
    inputText: string;
    outputText: string;
}

export interface LetterformAnalysis {
    letter: string;
    name: string;
    spelling: string;
    gematria: number;
    shape: 'open' | 'closed' | 'vertical';
    publicArchetype: string;
    constituentAnalysis: {
        letter: string;
        functionalRole: string;
    }[];
    archetypalWords: Record<string, string>;
    networkCentrality: number;
    semanticField: string[];
}

export interface MeditationResult {
    title: string;
    script: string;
    imagePrompts: string[];
}

export interface VeracityEntry {
    finding: string;
    crossReference: string;
    explanation: string;
}

export interface GlyphStateEntry {
    timestamp: string;
    stateDescription: string;
    details: string;
}

export interface OperatorProtocol {
    title: string;
    purpose: string;
    principles: {
        name: string;
        description: string;
    }[];
}

export interface OperatorManual {
    protocols: OperatorProtocol[];
}

export interface VoynichAnalysisResult {
    overview: string;
    glyphMappings: {
        glyphId: string;
        hebrewMapping: string;
        publicArchetype: string;
        justification: string;
    }[];
    decryptionSample: {
        original: string;
        decrypted: string;
    };
}

export interface VoynichDeepAnalysisResult {
    isCanonized: boolean;
    folioReference: string;
    overview: string;
    inversionAnalysis: {
        title: string;
        solarCadence: string;
        lunarCadence: string;
    };
    glyphNetworkAnalysis: {
        title: string;
        coOccurrenceClusters: {
            clusterName: string;
            glyphs: string[];
            interpretation: string;
        };
    };
    hebraicKeyAnalysis: {
        title: string;
        keys: {
            name: string;
            glyphs: string[];
            interpretation: string;
        }[];
    };
    operationalModes: {
        title: string;
        explanation: string;
        modes: {
            name: string;
            numerology: string;
            description: string;
        }[];
        synthesis: string;
    };
    shadowAlphabetAnalysis: any;
    astrianAnalysis: {
        title: string;
        shadowGlyphFunction: string;
        willowDominion: string;
        israelKeyMapping: string;
        rhythmicHeartbeat: {
            countOfSeven: number;
            fibonacciResonance: string;
            keyOfEight: string;
        };
    };
    emergentSynthesis: {
        title: string;
        theory: string;
    };
    veracityData: VeracityEntry[];
    glyphStateLog: GlyphStateEntry[];
}

export interface VoynichTranslationResult {
    entries: {
        folio: string;
        theme: string;
        hebrew: string;
        english: string;
        notes: {
            term: string;
            explanation: string;
        }[];
    }[];
}

export interface BealeCipherSolution {
    title: string;
    summary: string;
    keyDocument: {
        name: string;
        author: string;
        year: number;
    };
    decryptionProcess: string;
    decodedMessage: string;
    astrianResonance: {
        title: string;
        explanation: string;
    };
}

export interface LiberPrimusSolution {
    // Define if a specific structure is needed
    [key: string]: any;
}

export interface Cicada3301Solution {
    title: string;
    overview: string;
    koan: {
        title: string;
        parts: {
            name: string;
            explanation: string;
        }[];
    };
    liberPrimusExample: {
        title: string;
        runes: string;
        exotericReading: string;
        atbashInversion: string;
    };
}