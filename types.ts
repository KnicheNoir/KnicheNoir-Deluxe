import { GenerateContentResponse } from "@google/genai";

/**
 * types.ts
 *
 * Centralized type definitions for the Astrian Key application.
 * This file provides a single source of truth for all data structures,
 * promoting consistency and ease of maintenance.
 */

// =================================================================================================
// --- CORE ANALYSIS TYPES ---
// =================================================================================================

/** The complete, pre-computed structural analysis of a single Hebrew letter, as defined in the Letterform Index. */
export interface LetterformAnalysis {
    letter: string;
    name: string;
    spelling: string;
    gematria: number;
    shape: 'open' | 'closed' | 'vertical';
    constituentAnalysis: {
        letter: string;
        functionalRole: string;
    }[];
    archetypalWords: Record<string, string>;
    networkCentrality: number;
    semanticField: string[];
}

/** The result of a structural analysis query, containing the analysis for multiple letters from the index. */
export interface StructuralAnalysisResult {
    query: string;
    analysis: LetterformAnalysis[];
}

/** The output of the Quantum Resonance Engine's observation. */
export interface ResonancePotentialMapResult {
    query: string;
    primaryInterpretation: string;
    structuralHubs: { letter: string; name: string; centrality: number }[];
    entangledConcepts: string[];
}


/** Represents a full Gematria analysis for a word. */
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

/** Represents a found Equidistant Letter Sequence (ELS). */
export interface ELSResult {
    word: string;
    englishMeaning?: string;
    transliteration?: string;
    direction: string;
    skip: number;
    verses?: string;
    path: { row: number, col: number }[];
    // FIX: Added optional numericalSignificance property to match usage in components and services.
    numericalSignificance?: string;
}

/** The complete result of a deep ELS analysis, including the character grid. */
export interface DeepELSAnalysisResult {
    textGrid: { text: string; explanation: string; };
    elsAnalysis: ELSResult[];
}

/** An entry from Strong's Concordance. */
export interface StrongsEntry {
    originalWord: string;
    transliteration: string;
    definition: string;
    synonyms?: string[];
}

/** A single correspondence in a Resonance Cascade. */
export interface CascadeCorrespondence {
    domain: string;
    correspondence: string;
    explanation: string;
}

/** The full result of an Exhaustive Resonance Check, including the cascade. */
export interface ExhaustiveResonanceResult {
    query: string;
    gematriaValue: number;
    resonanceCascade: CascadeCorrespondence[];
}

/** A generic, high-level analysis result. */
export interface GeneralAnalysisResult {
    title: string;
    summary: string;
    sections: { title: string; content: string; }[];
}

/** A generic section with a title and explanation, used across many analysis results. */
export interface ExplanatorySection {
    title: string;
    explanation: string;
}

/** Result of comparing two texts for harmonic resonance. */
export interface HarmonicResonanceResult {
    source1: { reference: string; gematria: number; };
    source2: { reference: string; gematria: number; };
    ratio: string;
    analysis: string;
}

/** Generic result for pattern analysis (placeholders). */
export interface NetworkPatternResult {
    pattern: string;
    significance: number;
}
export interface MelodyPatternResult {
    motif: string;
    recurrence: number;
}

/** The result of an apocryphal analysis. */
export interface ApocryphalAnalysisResult {
    analysisTitle: string;
    coreConcept: ExplanatorySection;
    angelicResonance: ExplanatorySection;
    cosmologicalImplication: ExplanatorySection;
    elsSynthesis: ExplanatorySection;
}

/** The result of a Hebraic textual cartography analysis. */
export interface HebraicCartographerAnalysisResult {
    // Structure based on hebraicCartographerSchema
    query: string;
    hebrewText: string;
    transliteration: string;
    englishTranslation: string;
    gematriaAnalysis: any[]; // simplified for brevity
    hebraicKeysOfMastery: { title: string; generatedText: string; };
    //... other fields from base schema
}

/** The result of a Hellenistic textual cartography analysis. */
export interface HellenisticCartographerAnalysisResult {
    // Structure based on hellenisticCartographerSchema
    query: string;
    greekText: string;
    transliteration: string;
    englishTranslation: string;
    isopsephyAnalysis: any[]; // simplified for brevity
    gnosticSynthesis: ExplanatorySection;
    //... other fields from base schema
}

/** A union type for any cartographer result. */
export type CartographerAnalysisResults = HebraicCartographerAnalysisResult | HellenisticCartographerAnalysisResult;

/** The result of an Attunement analysis. */
export interface AttunementResult {
    emotion: string;
    musicalMode: { name: string; emotion: string };
    derivedLetters: { letter: string; name: string }[];
    scryedWords: { word: string; meaning: string }[];
}

/** The result of a Compass Cipher operation. */
export interface CompassCipherResult {
    mode: 'encode' | 'decode';
    offset: number;
    inputText: string;
    outputText: string;
}


// =================================================================================================
// --- MUSICAL & COMPOSITION TYPES ---
// =================================================================================================

/** Represents a single musical note event in a track. */
export interface NoteEvent {
    pitch: number;      // MIDI pitch value (e.g., 60 for Middle C)
    frequency: number;  // Frequency in Hz
    startTime: number;  // Start time in seconds from the beginning of the composition
    duration: number;   // Duration in seconds
    velocity: number;   // Note velocity (0.0 to 1.0)
}

/** Represents a single track of music within a composition. */
export interface MusicalTrack {
    name: 'melody' | 'harmony' | 'bass' | 'rhythm';
    analysis: StructuralAnalysisResult;
    notes: NoteEvent[];
}

/** Represents a full musical composition generated from a text. */
export interface MusicalComposition {
    id: string;
    isFavorite: boolean;
    audioUrl?: string;
    metadata: {
        key: string;
        mode: string;
        bpm: number;
        sourceReference: string;
        genre?: string;
        frequencySet?: string;
        solfeggioFrequency?: number;
    };
    tracks: MusicalTrack[];
}

/** The ADSR (Attack, Decay, Sustain, Release) envelope for a synthesized sound. */
export interface ADSRProfile {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

/** Defines the properties of a virtual instrument. */
export interface InstrumentProfile {
    name: string;
    waveform: 'sine' | 'square' | 'sawtooth' | 'triangle';
    adsr: ADSRProfile;
    description: string;
    structuralAffinity?: {
        resonantLetters?: string[];
        gematriaRange?: [number, number];
        letterforms?: ('open' | 'closed' | 'vertical')[];
    }
}
// FIX: Added all missing types that were causing import errors across the application.
// =================================================================================================
// --- NEWLY ADDED & EXPORTED TYPES ---
// =================================================================================================

export interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'error';
}

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

export interface EntrainmentProfile {
    name: string;
    description: string;
    type: 'binaural';
    baseFrequency: number;
    targetFrequency: number;
}

export type GuidingIntent = 'Neutral' | 'Analytical' | 'Creative' | 'Divinatory';

export interface VisualChallenge {
    images: {
        url: string;
        prompt: string;
    }[];
}

export interface InstructionalCompositionSession {
    stop: () => void;
    analyserNode: AnalyserNode;
    audioUrl: string;
    coreEmotion: string;
    symbolicMantra: string;
}

export interface ActiveEntrainmentSession {
    profile: EntrainmentProfile;
    stop: () => void;
}

export interface MusicComposerOptions {
    prompt: string;
    key: string;
    mode: string;
    instrumentProfiles: {
        melody: InstrumentProfile;
        harmony: InstrumentProfile;
        bass: InstrumentProfile;
    };
}

export interface GevurahOperand {
    type: 'register' | 'memory' | 'literal' | 'path';
    value?: string | number;
    address?: string;
    path?: string[];
}

export interface GevurahInstruction {
    letter: string;
    opcode: string;
    operands: GevurahOperand[];
    explanation: string;
}

export interface GevurahEngineProgram {
    title: string;
    description: string;
    registers: Record<string, number>;
    memory: Record<string, number>;
    instructions: GevurahInstruction[];
}

export interface WhitepaperSection {
    title: string;
    content: string | { subtitle: string; text: string }[];
}

export interface Whitepaper {
    title: string;
    subtitle: string;
    abstract: string;
    sections: WhitepaperSection[];
}

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

export type View = 'calibration' | 'chat' | 'meditation' | 'unlock' | 'instructional' | 'entrainment';

export interface AWEAnalysisResult {
    guidingQuestion: string;
    temporalMatrix: ExplanatorySection;
    karmicDharmicLedger: ExplanatorySection;
    collectiveNoosphere: ExplanatorySection;
    alchemicalBridge: ExplanatorySection;
    shortestRouteToInternalMastery: ExplanatorySection;
    entrainmentExplanation: string;
}

export interface PalmistryAnalysisResult {
    analysisTitle: string;
    overallReading: ExplanatorySection;
    lifeLine: ExplanatorySection;
    headLine: ExplanatorySection;
    heartLine: ExplanatorySection;
    fateLine?: ExplanatorySection;
    majorMounts: ExplanatorySection;
}

export interface VoiceResonanceAnalysisResult {
    analysisTitle: string;
    coreVibrationalTone: ExplanatorySection;
    prosodicFlow: ExplanatorySection;
    expressivePower: ExplanatorySection;
}

export interface AstrianDayPlannerResult {
    planTitle: string;
    overview: string;
    schedule: {
        timeRange: string;
        activity: string;
        esotericAdvice: string;
        elementalAlignment: string;
    }[];
}

export interface MeditationResult {
    title: string;
    script: string;
    imagePrompts: string[];
}

// Session History Types
interface BaseSessionRecord {
    id: string;
    timestamp: Date;
}
export interface UserMessage extends BaseSessionRecord { type: 'user'; text: string; }
export interface SystemMessage extends BaseSessionRecord { type: 'system'; text: string; }
export interface ComponentMessage extends BaseSessionRecord { type: 'component'; component: string; props: any; }

export interface AIMessage extends BaseSessionRecord {
    type: 'ai';
    text: string;
    analysisType: 'chat' | 'gematria' | 'els' | 'deep_els' | 'resonance' | 'general' | 'awe' | 'apocryphal' | 'cartography' | 'palmistry' | 'voice' | 'day_planner' | 'musical_composition' | 'compass_cipher';
    result?: any;
}
export interface PalmistryAIMessage extends AIMessage {
    analysisType: 'palmistry';
    result: PalmistryAnalysisResult;
}
export interface VoiceAIMessage extends AIMessage {
    analysisType: 'voice';
    result: VoiceResonanceAnalysisResult;
}
export interface MusicalCompositionAIMessage extends AIMessage {
    analysisType: 'musical_composition';
    result: MusicalComposition;
}

export type SessionRecord = UserMessage | SystemMessage | AIMessage | ComponentMessage;
