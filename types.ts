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

/** Production notes generated by the AI producer for a musical composition. */
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

/** The session data for an active Instructional Composition. */
export interface InstructionalCompositionSession {
    stop: () => void;
    analyserNode: AnalyserNode;
    audioUrl: string;
    coreEmotion: string;
    symbolicMantra: string;
}


// =================================================================================================
// --- SESSION & CHAT TYPES ---
// =================================================================================================

/** The base interface for all records in the session history. */
export interface BaseSessionRecord {
    id: string;
    timestamp: Date;
    type: 'user' | 'ai' | 'system' | 'component';
}

/** A message sent by the user. */
export interface UserMessage extends BaseSessionRecord {
    type: 'user';
    text: string;
}

/** A message generated by the system (e.g., status updates). */
export interface SystemMessage extends BaseSessionRecord {
    type: 'system';
    text: string;
}

/** A message from the AI, which may contain analysis results. */
export interface AIMessage extends BaseSessionRecord {
    type: 'ai';
    text: string;
    analysisType?: string;
    result?: any;
}

// FIX: Refactored ComponentMessage into a discriminated union for type safety.
// This ensures that the `props` for each `component` type are correctly typed,
// resolving errors in the ChatView component.
interface AttunementComponentMessage extends BaseSessionRecord {
    type: 'component';
    component: 'attunement';
    props: AttunementResult;
    disabled?: boolean;
}

interface EntrainmentSelectionComponentMessage extends BaseSessionRecord {
    type: 'component';
    component: 'entrainment_selection';
    props: {
        profiles: EntrainmentProfile[];
        onSelect: (profile: EntrainmentProfile) => void;
    };
    disabled?: boolean;
}

interface EntrainmentInfoComponentMessage extends BaseSessionRecord {
    type: 'component';
    component: 'entrainment_info';
    props: {
        profiles: EntrainmentProfile[];
    };
    disabled?: boolean;
}

/** A message that renders a custom component instead of text. */
export type ComponentMessage =
    | AttunementComponentMessage
    | EntrainmentSelectionComponentMessage
    | EntrainmentInfoComponentMessage;

/** A union type representing any possible record in the session history. */
export type SessionRecord = UserMessage | AIMessage | SystemMessage | ComponentMessage;

/** The user's guiding intent for the AI's responses. */
export type GuidingIntent = 'Neutral' | 'Analytical' | 'Esoteric' | 'Creative' | 'Divinatory';

/** The application's main views. */
export type View = 'atcForm' | 'aweForm' | 'session' | 'elsInvestigator' | 'palmistry' | 'entrainmentSelection' | 'voiceAnalysis';

/** Data structure for a toast notification. */
export interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}


// =================================================================================================
// --- AWE & PERSONALIZATION TYPES ---
// =================================================================================================

/** Form data for the Astrian World-self Expression (AWE). */
export interface AWEFormData {
    fullNameAtBirth: string;
    currentNameUsed: string;
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    inflectionPoints: { description: string; date: string; }[];
    relationalNodeHarmonious: string;
    relationalNodeChallenging: string;
    geographicAnchor: string;
    centralQuestion: string;
    visualCipherConcepts: [string, string, string];
}

/** The result of an AWE data synthesis. */
export interface AWEAnalysisResult {
    guidingQuestion: string;
    temporalMatrix: ExplanatorySection;
    karmicDharmicLedger: ExplanatorySection;
    collectiveNoosphere: ExplanatorySection;
    alchemicalBridge: ExplanatorySection;
    shortestRouteToInternalMastery: ExplanatorySection;
    entrainmentExplanation: string;
}

/** The result of a palmistry analysis. */
export interface PalmistryAnalysisResult {
    analysisTitle: string;
    overallReading: ExplanatorySection;
    lifeLine: ExplanatorySection;
    headLine: ExplanatorySection;
    heartLine: ExplanatorySection;
    fateLine?: ExplanatorySection;
    majorMounts: ExplanatorySection;
}

/** The result of a voice resonance analysis. */
export interface VoiceResonanceAnalysisResult {
    analysisTitle: string;
    coreVibrationalTone: ExplanatorySection;
    prosodicFlow: ExplanatorySection;
    expressivePower: ExplanatorySection;
}

/** The result of generating a day planner. */
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

/** The data for a guided meditation session. */
export interface MeditationResult {
    title: string;
    script: string;
    imagePrompts: string[];
}

/** A profile for brainwave entrainment. */
export interface EntrainmentProfile {
    name: string;
    description: string;
    type: 'binaural' | 'isochronic';
    baseFrequency: number;
    targetFrequency: number;
}

/** Represents an active entrainment session. */
export interface ActiveEntrainmentSession {
    profile: EntrainmentProfile;
    stop: () => void;
}

/** The visual challenge for unlocking a session. */
export interface VisualChallenge {
    images: {
        url: string;
        prompt: string;
    }[];
}

/** A proactive suggestion from the system. */
export interface ProactiveSuggestion {
    id: string;
    title: string;
    description: string;
    action: () => void;
}

// =================================================================================================
// --- FORM DATA TYPES ---
// =================================================================================================

/** Form data for the Textual Cartographer. */
export interface TextualCartographerFormData {
    corpus: string;
    book: string;
    query: string;
}

/** Form data for the ELS Investigator. */
export interface ELSInvestigatorFormData {
    corpus: string;
    book: string;
    reference: string;
}

// =================================================================================================
// --- DEPRECATED/LEGACY (for reference) ---
// =================================================================================================

/** Replaced by StrongsEntry */
export type StrongsResult = StrongsEntry;
/** Replaced by NoteEvent */
export type MelodyNote = NoteEvent;
/** Generic resonance profile, not used */
export interface ResonanceProfile {
    primary: string;
    secondary: string[];
}
