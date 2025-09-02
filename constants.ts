import { Type } from "@google/genai";

/**
 * constants.ts
 *
 * Houses all static, constant data for the Astrian Key application,
 * primarily the schemas for validating responses from the Gemini API.
 * This separation of concerns keeps the core logic files clean.
 */

// =================================================================================================
// --- API SCHEMAS ---
// =================================================================================================

export const solveFindingSchema = {
    type: Type.OBJECT,
    properties: {
        findings: {
            type: Type.ARRAY,
            description: "An array of 3-5 distinct, verbose, and insightful analytical findings about the target concept.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ['Pattern', 'Resonance', 'ELS', 'Synthesis', 'Query'],
                        description: "The category of the finding. 'Pattern' for structural/repeating elements. 'Resonance' for conceptual/thematic links. 'ELS' for textual sequences. 'Synthesis' for high-level conclusions. 'Query' for a new question this finding raises."
                    },
                    content: {
                        type: Type.STRING,
                        description: "A detailed, verbose description of the finding. Should be written as if from a terminal log."
                    },
                    confidence: {
                        type: Type.NUMBER,
                        description: "A confidence score from 0.0 to 1.0 representing the certainty of this finding."
                    }
                },
                required: ['type', 'content', 'confidence']
            }
        }
    },
    required: ['findings']
};

export const chakraThemeSchema = {
    type: Type.OBJECT,
    properties: {
        chakra: {
            type: Type.STRING,
            enum: ['root', 'sacral', 'solarPlexus', 'heart', 'throat', 'thirdEye', 'crown', 'neutral']
        }
    },
    required: ['chakra']
};

export const instructionalCompositionAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        coreEmotion: { type: Type.STRING, description: "A single, powerful emotion that is the positive opposite of the user's stated problem (e.g., 'stop smoking' -> 'Freedom')." },
        affirmation: { type: Type.STRING, description: "A very short, powerful, positive affirmation in ALL CAPS representing the desired state (e.g., 'I BREATHE FREE', 'MY MIND IS CLEAR')." },
        solfeggioFrequency: { type: Type.NUMBER, description: "The single most appropriate Solfeggio frequency (in Hz) from the provided list to act as the tonal center for this therapeutic composition.", enum: [174, 285, 396, 417, 528, 639, 741, 852, 963] }
    },
    required: ["coreEmotion", "affirmation", "solfeggioFrequency"]
};

export const deepElsAnalysisSchema = { type: Type.OBJECT, properties: { textGrid: { type: Type.OBJECT, properties: { text: { type: Type.STRING }, explanation: { type: Type.STRING } }, required: ["text", "explanation"] }, elsAnalysis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { word: { type: Type.STRING }, englishMeaning: { type: Type.STRING }, transliteration: { type: Type.STRING }, direction: { type: Type.STRING, description: "The direction of the find. Must be one of: E (East), W (West), S (South), N (North), SE, SW, NE, NW." }, skip: { type: Type.NUMBER }, verses: { type: Type.STRING }, path: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { row: { type: Type.NUMBER }, col: { type: Type.NUMBER } }, required: ["row", "col"] } } }, required: ["word", "englishMeaning", "transliteration", "direction", "skip", "verses", "path"] } } }, required: ["textGrid", "elsAnalysis"] };

export const aweExtractionSchema = {
    type: Type.OBJECT,
    properties: {
        fullNameAtBirth: { type: Type.STRING, description: "The user's full name at birth, if mentioned." },
        currentNameUsed: { type: Type.STRING, description: "The name the user currently goes by, if mentioned." },
        birthDate: { type: Type.STRING, description: "The user's birth date in YYYY-MM-DD format, if mentioned." },
        birthTime: { type: Type.STRING, description: "The user's birth time in HH:MM format, if mentioned." },
        birthLocation: { type: Type.STRING, description: "The user's birth location, if mentioned." },
        inflectionPoints: {
            type: Type.ARRAY,
            description: "Any significant life events mentioned by the user.",
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { type: Type.STRING },
                    date: { type: Type.STRING }
                },
                required: ["description", "date"]
            }
        },
        relationalNodeHarmonious: { type: Type.STRING, description: "A harmonious relationship mentioned by the user." },
        relationalNodeChallenging: { type: Type.STRING, description: "A challenging relationship mentioned by the user." },
        geographicAnchor: { type: Type.STRING, description: "A location of significance mentioned by the user." },
        centralQuestion: { type: Type.STRING, description: "A core question or intent expressed by the user." }
    }
};

export const meditationScriptSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A soothing title for the meditation." },
        script: { 
            type: Type.STRING, 
            description: "The full text of the guided meditation. It MUST include at least two special tokens in the format [GENERATE_IMAGE: a detailed, evocative prompt for an AI image generator]. These tokens should be placed at natural pauses in the script. The image prompts must be directly related to the user's AWE data provided in the prompt." 
        },
        imagePrompts: {
            type: Type.ARRAY,
            description: "An array of the exact image generation prompts that were embedded in the script, in the order they appear.",
            items: { type: Type.STRING }
        }
    },
    required: ['title', 'script', 'imagePrompts']
};


export const queryIntentSchema = {
    type: Type.OBJECT,
    properties: {
        intent: {
            type: Type.STRING,
            enum: ['chat', 'deep_analysis'],
            description: "Classify the user's query. Use 'chat' for simple conversation. Use 'deep_analysis' for any query that asks for analysis, interpretation, connections, or uses esoteric terms."
        },
        primaryConcept: {
            type: Type.STRING,
            description: "The primary subject of the query (e.g., 'Genesis 1:1', 'Challenger disaster', 'Tree of Life')."
        },
        scope: {
            type: Type.STRING,
            description: "The textual scope for analysis, if specified (e.g., a book like 'Genesis' or a corpus like 'Tanakh'). Defaults to 'full_corpus' if not specified."
        }
    },
    required: ['intent', 'primaryConcept', 'scope']
};


const unifiedFieldFindingSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['gematria', 'els', 'resonance', 'keyword', 'numeric'] },
        description: { type: Type.STRING, description: "A one-sentence description of the finding." },
        value: { type: Type.STRING, description: "The key value of the finding (e.g., the number, the word)." },
    },
    required: ['type', 'description', 'value']
};

const harmonicSignatureSchema = {
    type: Type.OBJECT,
    properties: {
        chordName: { type: Type.STRING, description: "The name of the musical chord (e.g., 'C Major 7th')." },
        explanation: { type: Type.STRING, description: "An esoteric explanation of what this chord's vibration signifies in this context." },
        notes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    noteName: { type: Type.STRING },
                    frequency: { type: Type.NUMBER },
                    role: { type: Type.STRING, enum: ['root', 'third', 'fifth', 'octave', 'other'] }
                },
                required: ['noteName', 'frequency', 'role']
            }
        }
    },
    required: ['chordName', 'explanation', 'notes']
};


export const unifiedFieldSynthesisSchema = {
    type: Type.OBJECT,
    properties: {
        query: { type: Type.STRING },
        unifiedFieldClusters: {
            type: Type.ARRAY,
            description: "An array of synthesized clusters, where each cluster represents a significant 'hotspot' of interconnected findings.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "A compelling title for this cluster of meaning." },
                    synthesis: { type: Type.STRING, description: "A detailed, insightful synthesis explaining the non-linear connection between the findings in this cluster." },
                    findings: {
                        type: Type.ARRAY,
                        description: "An array of the specific findings that make up this cluster.",
                        items: unifiedFieldFindingSchema
                    },
                    harmonicSignature: {
                        ...harmonicSignatureSchema,
                        description: "Optional. The musical chord representing the vibrational essence of this cluster, based on the provided Gematria ratios."
                    }
                },
                required: ["title", "synthesis", "findings"]
            }
        }
    },
    required: ["query", "unifiedFieldClusters"]
};

const explanatorySectionSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        explanation: { type: Type.STRING }
    },
    required: ["title", "explanation"]
};

export const aweSynthesisSchema = {
    type: Type.OBJECT,
    properties: {
        guidingQuestion: { type: Type.STRING },
        temporalMatrix: explanatorySectionSchema,
        karmicDharmicLedger: explanatorySectionSchema,
        collectiveNoosphere: explanatorySectionSchema,
        alchemicalBridge: explanatorySectionSchema,
        shortestRouteToInternalMastery: explanatorySectionSchema,
        entrainmentExplanation: { type: Type.STRING, description: "A simple explanation for the provided brainwave entrainment profile." }
    },
    required: ["guidingQuestion", "temporalMatrix", "karmicDharmicLedger", "collectiveNoosphere", "alchemicalBridge", "shortestRouteToInternalMastery", "entrainmentExplanation"]
};

export const apocryphalAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysisTitle: { type: Type.STRING },
        coreConcept: explanatorySectionSchema,
        angelicResonance: explanatorySectionSchema,
        cosmologicalImplication: explanatorySectionSchema,
        elsSynthesis: explanatorySectionSchema
    },
    required: ["analysisTitle", "coreConcept", "angelicResonance", "cosmologicalImplication", "elsSynthesis"]
};

export const palmistryAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysisTitle: { type: Type.STRING, description: "A fitting title for the reading, e.g., 'The Architect's Hand'." },
        overallReading: explanatorySectionSchema,
        lifeLine: explanatorySectionSchema,
        headLine: explanatorySectionSchema,
        heartLine: explanatorySectionSchema,
        fateLine: { ...explanatorySectionSchema, description: "Optional. Only include if a prominent fate line is visible." },
        majorMounts: explanatorySectionSchema
    },
    required: ["analysisTitle", "overallReading", "lifeLine", "headLine", "heartLine", "majorMounts"]
};

export const voiceResonanceAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysisTitle: { type: Type.STRING, description: "A fitting title for the analysis, e.g., 'The Resonant Voice'." },
        coreVibrationalTone: explanatorySectionSchema,
        prosodicFlow: explanatorySectionSchema,
        expressivePower: explanatorySectionSchema
    },
    required: ["analysisTitle", "coreVibrationalTone", "prosodicFlow", "expressivePower"]
};

export const astrianDayPlannerSchema = {
    type: Type.OBJECT,
    properties: {
        planTitle: { type: Type.STRING },
        overview: { type: Type.STRING },
        schedule: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    timeRange: { type: Type.STRING, description: "e.g., 'Morning (7am - 11am)'" },
                    activity: { type: Type.STRING },
                    esotericAdvice: { type: Type.STRING },
                    elementalAlignment: { type: Type.STRING }
                },
                required: ["timeRange", "activity", "esotericAdvice", "elementalAlignment"]
            }
        }
    },
    required: ["planTitle", "overview", "schedule"]
};

const vibrationalPhraseSchema = {
    type: Type.OBJECT,
    properties: {
        hebrewPhrase: { type: Type.STRING },
        transliteration: { type: Type.STRING },
        tonalFrequency: { type: Type.NUMBER, description: "A representative frequency in Hz." },
        rhythmicCadence: { type: Type.STRING, description: "A short description of the rhythm." },
        interpretation: { type: Type.STRING }
    },
    required: ["hebrewPhrase", "transliteration", "tonalFrequency", "rhythmicCadence", "interpretation"]
};

const baseCartographerSchema = {
    query: { type: Type.STRING },
    transliteration: { type: Type.STRING },
    englishTranslation: { type: Type.STRING },
    vibrationalAnalysis: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            keyPhrases: {
                type: Type.ARRAY,
                items: vibrationalPhraseSchema
            }
        },
        required: ["title", "explanation", "keyPhrases"]
    },
    cosmicArchitecture: explanatorySectionSchema,
    archetypalDrivers: explanatorySectionSchema,
    protocolUnflinchingTruth: {
        type: Type.OBJECT,
        properties: {
            challenge: { type: Type.STRING },
            softLanding: { type: Type.STRING }
        },
        required: ["challenge", "softLanding"]
    }
};

export const hebraicCartographerSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseCartographerSchema,
        hebrewText: { type: Type.STRING },
        gematriaAnalysis: {
            type: Type.ARRAY,
            description: "MUST be an exact copy of the Gematria data provided in the prompt.",
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    standard: { type: Type.NUMBER },
                    ordinal: { type: Type.NUMBER },
                    reduced: { type: Type.NUMBER },
                    kolel: { type: Type.NUMBER },
                    atbashWord: { type: Type.STRING },
                    atbashValue: { type: Type.NUMBER },
                    milui: { type: Type.NUMBER }
                },
                required: ["word", "standard", "ordinal", "reduced", "kolel", "atbashWord", "atbashValue", "milui"]
            }
        },
        hebraicKeysOfMastery: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                generatedText: { type: Type.STRING }
            },
            required: ["title", "generatedText"]
        }
    },
    required: Object.keys(baseCartographerSchema).concat(["hebrewText", "gematriaAnalysis", "hebraicKeysOfMastery"])
};

export const hellenisticCartographerSchema = {
    type: Type.OBJECT,
    properties: {
        ...baseCartographerSchema,
        greekText: { type: Type.STRING },
        isopsephyAnalysis: {
            type: Type.ARRAY,
            description: "MUST be an exact copy of the Isopsephy data provided in the prompt.",
            items: {
                type: Type.OBJECT,
                properties: {
                    word: { type: Type.STRING },
                    value: { type: Type.NUMBER }
                },
                required: ["word", "value"]
            }
        },
        gnosticSynthesis: explanatorySectionSchema
    },
    required: Object.keys(baseCartographerSchema).concat(["greekText", "isopsephyAnalysis", "gnosticSynthesis"])
};

export const aiProductionNotesSchema = {
    type: Type.OBJECT,
    properties: {
        overallMood: { type: Type.STRING, description: "A short, evocative description of the composition's overall feeling." },
        instruments: {
            type: Type.ARRAY,
            description: "An array assigning a specific instrument to each track from the provided list.",
            items: {
                type: Type.OBJECT,
                properties: {
                    trackName: { type: Type.STRING, description: "The name of the track being assigned (e.g., 'melody', 'harmony', 'bass')." },
                    instrumentName: { type: Type.STRING, description: "The name of the instrument chosen from the provided list." },
                    rationale: { type: Type.STRING, description: "A brief explanation for why this instrument was chosen for this track." }
                },
                required: ["trackName", "instrumentName", "rationale"]
            }
        },
        arrangement: { type: Type.STRING, description: "Notes on how the instruments should interact. For example, 'The ethereal pads should swell during the chorus section to lift the melody.'" },
        mixing: { type: Type.STRING, description: "Notes on the audio mix. For example, 'Pan the melody slightly to the right and the harmony to the left to create a wider stereo field. Use a gentle high-pass filter on the bass to avoid muddiness.'" },
        mastering: { type: Type.STRING, description: "Notes on the final mastering process. For example, 'Apply light compression to glue the tracks together and a subtle reverb to give the piece a sense of space.'" }
    },
    required: ["overallMood", "instruments", "arrangement", "mixing", "mastering"]
};