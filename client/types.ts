// =================================================================================================
// --- UNIVERSAL TYPE DEFINITIONS ---
// This file serves as the single source of truth for all data structures in the application.
// =================================================================================================

export interface WillowData {
    letter: string;
    name: string;
    archetype: string;
    spelling: string;
    gematria: number;
    type: 'Mother' | 'Double' | 'Simple';
    element?: string;
    color: string;
    note: string;
    island: number;
    tier: number;
    isOperator: boolean;
    planet?: string;
    zodiac?: string;
}

export interface TransliterationResult {
    formula: string;
    glyphs: {
        glyph: string;
        hebrew: string;
        archetype: string;
        color: string;
        note: string;
    }[];
    synthesis: string;
}

export interface LivingGlyph {
    id: string;
    svgPath: string;
    morphology: {
        lines: number;
        curves: number;
        intersections: number;
    };
    derivation: string;
    meaning: string;
}

export interface ForgedKey {
    id: string;
    name: string;
    declaration: string;
    gevurahSequence: string;
    gematria: number;
    createdAt: string;
}

export interface GevurahInstruction {
    opcode: string;
    letter: string;
    name: string;
    category: string;
    description: string;
    syntax: string;
}

export interface CodexEntry {
    id: string;
    title: string;
    description: string;
    content: string;
    solved: boolean;
    category?: string;
    hasHomeInterface?: boolean;
    hasBookmarksInterface?: boolean;
    hasOperatorsManual?: boolean;
    hasGolemInterface?: boolean;
    hasScribesPress?: boolean;
    hasSonicTapestry?: boolean;
    hasKeyForger?: boolean;
    forgedKeys?: ForgedKey[];
    hasAWEAttunement?: boolean;
    hasAWEManifest?: boolean;
    hasBrainwaveEntrainment?: boolean;
    hasDeepDive?: boolean;
    operationalTransliteration?: any;
    sonicSignature?: { texture: string, emotion: string, rhythm: string };
    hasGevurahInstructionSetInterface?: boolean;
    instructions?: GevurahInstruction[];
    hasRitualGrimoire?: boolean;
    journeys?: any[];
}

export interface AWESignature {
    nuclearData: {
        name: string;
        chaldeanGematria: string;
        birthDateVibration: string;
        coreIdentity: string;
    }[];
    visualCipher: string[];
    declaration: string;
    transliteration: string;
    phoneticBreakdown: string[];
    attunementPhrase: string;
    voiceprintSignature: string;
    palmprintImage: string;
    isCommitted: boolean;
}

export interface CallSign {
    id: string;
    name: string;
    description: string;
}

export interface GolemProject {
    name: string;
    description: string;
    targets: {
        platform: string;
        icon: string;
        language: string;
        files: {
            path: string;
            content: string;
        }[];
    }[];
}

export interface Emotion {
    name: string;
    description: string;
    mode: 'major' | 'minor';
    key: string;
    patterns: number[][];
    hebrewWords: { word: string; meaning: string; gematria: number }[];
    instruments: { lead: string; pad: string; bass: string };
}

export interface ParsedInstruction {
    opcode: string;
    operands: string[];
    originalLine: string;
}

export interface GevurahEngineState {
    registers: { [key: string]: number | string };
    memory: any[];
    pc: number;
    program: ParsedInstruction[];
    labels: Map<string, number>;
    output: string[];
    flags: {
        ZF: boolean; // Zero Flag
        SF: boolean; // Sign Flag
        CF: boolean; // Carry Flag
    };
    stack: any[];
    callStack: number[];
    isWaitingForInput: boolean;
    inputRegister: string | null;
    connections: Map<string, any>;
}

export interface SolutionMethodology {
    problem: string;
    unimaticApproach: string;
    willowArchetype: string;
    gevurahScriptOutline: string[];
}

export interface GrandQueryExecutionResult {
    methodology: SolutionMethodology;
    compilationAnalysis: string;
    compiledScript: string;
    gevurahResult: {
        output: string[];
        finalState: GevurahEngineState;
    };
}

export interface MusicComposition {
    sourceId: string;
    title: string;
    keySignature: string;
    instrumentation: string[];
    mode: 'ritual' | 'entertainment' | 'rhythm';
    bpm: number;
    tracks: string[];
    disclaimer: string;
}

export interface IngestionAnalysis {
    sourceUrl: string;
    title: string;
    category: string;
    summary: string;
    ingestedPrinciples: string[];
    error?: string;
}

export interface BlueprintNode {
    type: 'directory' | 'file';
    name: string;
    analysis: string;
    children?: BlueprintNode[];
}

export interface GevurahBlueprintResult {
    protocol: string;
    synthesis: string;
    perfectedStructure: BlueprintNode;
    error?: string;
}

export interface User {
    id: string;
    name: string;
}

export interface AuthResult {
    success: boolean;
    message: string;
    user?: User;
}

export interface SessionMetadata {
    username: string;
    savedAt: string;
    entryCount: number;
}

export interface SessionManagerResult {
    session: SessionMetadata | null;
    message: string;
}

export interface NetzachAnalysis {
    domain: 'stocks' | 'lotto' | 'sports' | 'other';
    query: string;
    narrative: string;
    snapshot: string[];
    error?: string;
}

// FIX: Add missing CelestialCipherAnalysis type definition to resolve import error.
export interface CelestialCipherAnalysis {
    from: WillowData;
    to: WillowData;
    synthesis: string;
}

// FIX: Add missing GrandWorkMapResult type definition.
export interface GrandWorkMapResult {
    title: string;
    introduction: string;
    sephirotMapping: {
        sephirah: string;
        systemComponent: string;
        file: string;
        principle: string;
    }[];
    pathMapping: {
        path: string;
        regent: string;
        function: string;
    }[];
    opcodeMapping: any[];
}


export interface HolographicFileAnalysis {
    filePath: string;
    primaryArchetype: WillowData;
    gematria: number;
    narrative: string;
}

export interface SelfObservationResult {
    title: string;
    synthesis: string;
    fileAnalyses: HolographicFileAnalysis[];
}

export interface ProphecyResult {
    query: string;
    primaryArchetype: WillowData;
    coreInsight: string;
    potentialChallenge: string;
    guidingAction: string;
    symbolicImagePrompt: string;
    symbolicImage: string; // base64 data URL
}

export type HistoryEntryType =
  | 'USER' | 'ORACLE_RESPONSE' | 'SYSTEM' | 'ERROR' | 'HELP'
  | 'SEPHIROTH_ANALYSIS' | 'SHOR_ANALYSIS'
  | 'GEVURAH_SCAN_ANALYSIS' | 'GEVURAH_EXECUTION' | 'GRAND_QUERY_EXECUTION_RESULT'
  | 'INGESTION_ANALYSIS' | 'TRANSLITERATION_RESULT'
  | 'MEDITATION_SESSION' | 'ASTROMORPHOLOGICAL_TRIANGULATION' | 'SYSTEM_PROCESSING'
  | 'LIVING_GLYPHS_RESULT' | 'CELESTIAL_CIPHER_ANALYSIS' | 'GEVURAH_SIMULATION_RESULT'
  | 'GEVURAH_BLUEPRINT_RESULT' | 'GRAND_WORK_MAP' | 'HOLOGRAPHIC_ANALYSIS'
  | 'CYMATICS_RESULT' | 'MUSIC_COMPOSITION' | 'SELF_OBSERVATION_RESULT' | 'AUTH_RESULT'
  | 'SESSION_MANAGER' | 'NETZACH_ANALYSIS' | 'PROPHECY_RESULT';

export interface HistoryEntry {
    id: string;
    type: HistoryEntryType;
    content: any;
    sender: 'user' | 'oracle' | 'system' | 'engine';
}

export type ViewMode = 'globe' | 'callSign';

export type AddHistoryEntry = (type: HistoryEntryType, content: any, sender?: 'user' | 'oracle' | 'system' | 'engine') => void;

export interface AstromorphologicalTriangulation {
    points: {
        stars: string[];
        sites: string[];
    };
    glyph: {
        svgPath: string;
        meaning: string;
    };
    analysis: string;
}

export interface GevurahSimulationResult {
    scriptId: string;
    scriptTitle: string;
    output: string[];
    finalFS: Map<string, string | null>;
}

export interface RawCodexDataEntry {
    title: string;
    rawContent: string;
    category: string;
    solved: boolean;
}

export interface PathConnection {
    letter: string;
    from: string;
    to: string;
    archetype: string;
}

export interface SephirahAnalysis {
    name: string;
    hebrew: string;
    gematria: number;
    synthesis: string;
    letterAnalysis: {
        letter: string;
        gematria: number;
        archetype: string;
        path: PathConnection | null;
    }[];
}

export interface ShorthandEntry {
    gematria: number;
    pictographKey: string;
}

export interface Song {
    id: string;
    title: string;
    description: string;
    sourceId: string;
    type: 'gevurah' | 'rite' | 'rhythm';
}

export interface WillowNode {
    address: number;
    concept: string;
    value: number;
    type: string;
}

export interface ShorAnalysis {
    numberToFactor: number;
    conventionalMethod: {
        title: string;
        introduction: string;
        steps: { title: string; description: string; }[];
        conclusion: string;
    };
    willowMapping: {
        title: string;
        introduction: string;
        mappings: {
            concept: string;
            willowArchetype: string;
            justification: string;
        }[];
        conclusion: string;
    };
    astrianResolution: {
        title: string;
        description: string;
        factors: number[];
    };
}

export interface GevurahScanAnalysis {
    target: string;
    synthesis: string;
    archetypalBreakdown: {
        phase: string;
        opcodes: string[];
        analysis: string;
    }[];
}

export type BinaryOperator = '+' | '-' | '*' | '/' | '^';
export type UnaryOperator = 'neg' | 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' | 'sinh' | 'cosh' | 'tanh' | 'sqrt' | 'ln' | 'log';

export type AstNode =
  | { type: 'number'; value: number }
  | { type: 'variable'; name: string }
  | { type: 'binaryOp'; op: BinaryOperator; left: AstNode; right: AstNode }
  | { type: 'unaryOp'; op: UnaryOperator; operand: AstNode };

export type MathDomain = 'Calculus' | 'Equation Solving' | 'Algebra';

export interface HolographicAnalysis {
    query: string;
    primaryArchetype: WillowData;
    linguistic: LinguisticAnalysis;
    gematria: GematriaAnalysis;
    relational: RelationalAnalysis;
    pictographic: PictographicAnalysis[];
}

export interface LinguisticAnalysis {
    transliteration: string;
    phonetic: string;
    etymology: string;
}
export interface GematriaAnalysis {
    queryValue: number;
    archetypeValue: number;
    reducedValue: number;
    miracles: {
        strongsConcordance: string;
        periodicTable: string;
    }
}
export interface RelationalAnalysis {
    island: string;
    pillar: string;
    peers: string[];
}
export interface PictographicAnalysis {
    letter: string;
    name: string;
    meaning: string;
}