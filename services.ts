import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { codex } from './codex';
// FIX: Removed unused 'NetworkPatternResult' which was causing an import error.
import { CascadeCorrespondence, AWEFormData, EntrainmentProfile, ELSResult, ExhaustiveResonanceResult, StrongsEntry, GematriaAnalysis, DeepELSAnalysisResult, GuidingIntent, SessionRecord, UserMessage, AIMessage, SystemMessage, ComponentMessage, MusicalComposition, NoteEvent, AIProductionNotes, InstrumentProfile, ResonancePotentialMapResult, CompassCipherResult, LetterformAnalysis } from './types';
import { hebraicCartographerSchema, hellenisticCartographerSchema, apocryphalAnalysisSchema, aweSynthesisSchema, palmistryAnalysisSchema, astrianDayPlannerSchema, voiceResonanceAnalysisSchema, deepElsAnalysisSchema, meditationScriptSchema, aiProductionNotesSchema, instructionalCompositionAnalysisSchema, chakraThemeSchema } from './constants';
import { LibraryService } from './library';
import { hebrewNetwork } from './dataModels';
import { MusicService } from './music';

/**
 * services.ts
 *
 * This file centralizes all external services and core logic engines.
 * It follows the Single Responsibility Principle by separating data fetching,
 * business logic, and utility functions from the UI components.
 */

// =================================================================================================
// --- AUDIO SERVICE ---
// =================================================================================================

export class AudioService {
    public static async sequenceAndRenderComposition(composition: MusicalComposition, instrumentProfiles: { melody: InstrumentProfile, harmony: InstrumentProfile, bass: InstrumentProfile }): Promise<Blob> {
        const { tracks } = composition;
        const totalDuration = tracks.reduce((max, track) => {
            const trackEnd = track.notes.reduce((tMax, note) => Math.max(tMax, note.startTime + note.duration), 0);
            return Math.max(max, trackEnd);
        }, 0);

        if (totalDuration === 0) {
            throw new Error("Cannot render an empty composition.");
        }
        
        const offlineContext = new OfflineAudioContext(2, 44100 * (totalDuration + 1), 44100);
        const masterGain = offlineContext.createGain();
        masterGain.gain.setValueAtTime(0.3, 0);
        masterGain.connect(offlineContext.destination);

        const trackProfileMap: { [key: string]: InstrumentProfile } = {
            melody: instrumentProfiles.melody,
            harmony: instrumentProfiles.harmony,
            bass: instrumentProfiles.bass,
            rhythm: instrumentProfiles.melody, // fallback for rhythm track if any
        };

        tracks.forEach(track => {
            const instrumentProfile = trackProfileMap[track.name];
            if (!instrumentProfile) {
                console.warn(`No instrument profile provided for track: ${track.name}`);
                return;
            }
            
            track.notes.forEach(note => {
                const osc = offlineContext.createOscillator();
                osc.type = instrumentProfile.waveform;
                osc.frequency.setValueAtTime(note.frequency, offlineContext.currentTime + note.startTime);

                const noteGain = offlineContext.createGain();
                noteGain.connect(masterGain);
                
                const { attack, decay, sustain, release } = instrumentProfile.adsr;
                const peakTime = offlineContext.currentTime + note.startTime + attack;
                const sustainTime = peakTime + decay;
                const endTime = offlineContext.currentTime + note.startTime + note.duration;
                
                noteGain.gain.setValueAtTime(0, offlineContext.currentTime + note.startTime);
                noteGain.gain.linearRampToValueAtTime(note.velocity, peakTime);
                noteGain.gain.linearRampToValueAtTime(note.velocity * sustain, sustainTime);
                noteGain.gain.setValueAtTime(note.velocity * sustain, endTime);
                noteGain.gain.linearRampToValueAtTime(0, endTime + release);

                osc.connect(noteGain);
                osc.start(offlineContext.currentTime + note.startTime);
                osc.stop(endTime + release + 0.1);
            });
        });

        const audioBuffer = await offlineContext.startRendering();
        const wavHeader = new Uint8Array(44);
        const view = new DataView(wavHeader.buffer);
        const numChannels = audioBuffer.numberOfChannels, sampleRate = audioBuffer.sampleRate, numSamples = audioBuffer.length, dataSize = numSamples * numChannels * 2;
        view.setUint32(0, 0x52494646, false); 
        view.setUint32(4, 36 + dataSize, true);
        view.setUint32(8, 0x57415645, false);
        view.setUint32(12, 0x666d7420, false);
        view.setUint32(16, 16, true); 
        view.setUint16(20, 1, true); 
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * 2, true); 
        view.setUint16(32, numChannels * 2, true); 
        view.setUint16(34, 16, true); 
        view.setUint32(36, 0x64617461, false);
        view.setUint32(40, dataSize, true);

        const pcmData = new Int16Array(numSamples * numChannels);
        for (let i = 0; i < numChannels; i++) {
            const channelData = audioBuffer.getChannelData(i);
            for (let j = 0; j < numSamples; j++) {
                pcmData[j * numChannels + i] = Math.max(-1, Math.min(1, channelData[j])) * 32767;
            }
        }
        return new Blob([wavHeader, pcmData], { type: 'audio/wav' });
    }

    public static async renderAndPlayInstructionalComposition(composition: MusicalComposition, instrumentProfiles: { melody: InstrumentProfile, harmony: InstrumentProfile, bass: InstrumentProfile }): Promise<{ stop: () => void; analyserNode: AnalyserNode; audioUrl: string; }> {
        const compositionBlob = await this.sequenceAndRenderComposition(composition, instrumentProfiles);
        const solfeggioHz = composition.metadata.solfeggioFrequency || 0;

        const audioContext = new AudioContext();
        const masterGain = audioContext.createGain();
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        masterGain.connect(analyserNode);
        analyserNode.connect(audioContext.destination);

        // 1. Setup song playback from blob
        const audioUrl = URL.createObjectURL(compositionBlob);
        
        // 2. Setup Binaural Beats (Theta Wave)
        const binauralBaseFreq = 110; // A2
        const binauralTargetFreq = 5; // Theta
        const oscLeft = audioContext.createOscillator();
        oscLeft.frequency.setValueAtTime(binauralBaseFreq, 0);
        const oscRight = audioContext.createOscillator();
        oscRight.frequency.setValueAtTime(binauralBaseFreq + binauralTargetFreq, 0);
        
        const merger = audioContext.createChannelMerger(2);
        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        
        const binauralGain = audioContext.createGain();
        binauralGain.gain.setValueAtTime(0.08, 0); // Keep it subtle
        merger.connect(binauralGain);
        binauralGain.connect(masterGain);

        // 3. Setup Isochronic Pulses (using Solfeggio frequency if available)
        let pulseInterval: number | undefined;
        let isochronicOsc: OscillatorNode | undefined;
        if (solfeggioHz > 0) {
            isochronicOsc = audioContext.createOscillator();
            isochronicOsc.frequency.setValueAtTime(solfeggioHz, 0);
            isochronicOsc.type = 'sine';

            const isochronicGain = audioContext.createGain();
            isochronicOsc.connect(isochronicGain);
            isochronicGain.connect(masterGain);
            isochronicGain.gain.setValueAtTime(0, 0); // Start silent

            const pulseRate = binauralTargetFreq;
            const pulse = () => {
                 const now = audioContext.currentTime;
                 isochronicGain.gain.setValueAtTime(0.1, now);
                 isochronicGain.gain.setValueAtTime(0, now + 0.05);
            };
            pulseInterval = window.setInterval(pulse, 1000 / pulseRate);
            isochronicOsc.start();
        }


        oscLeft.start();
        oscRight.start();
        
        const stop = () => {
            if (pulseInterval) clearInterval(pulseInterval);
            const now = audioContext.currentTime;
            masterGain.gain.linearRampToValueAtTime(0, now + 1.0);
            setTimeout(() => {
                oscLeft.stop();
                oscRight.stop();
                if (isochronicOsc) isochronicOsc.stop();
                audioContext.close();
                URL.revokeObjectURL(audioUrl);
            }, 1100);
        };

        return { stop, analyserNode, audioUrl };
    }

    public static startBinauralBeat(profile: EntrainmentProfile): { stop: () => void; } {
        const audioContext = new AudioContext();
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);

        const oscLeft = audioContext.createOscillator();
        oscLeft.type = 'sine';
        oscLeft.frequency.setValueAtTime(profile.baseFrequency, audioContext.currentTime);

        const oscRight = audioContext.createOscillator();
        oscRight.type = 'sine';
        oscRight.frequency.setValueAtTime(profile.baseFrequency + profile.targetFrequency, audioContext.currentTime);

        const merger = audioContext.createChannelMerger(2);
        oscLeft.connect(merger, 0, 0);
        oscRight.connect(merger, 0, 1);
        merger.connect(masterGain);

        masterGain.gain.setValueAtTime(0, audioContext.currentTime);
        masterGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 1.5); // Fade in

        oscLeft.start();
        oscRight.start();

        const stop = () => {
            const now = audioContext.currentTime;
            masterGain.gain.linearRampToValueAtTime(0, now + 1.5); // Fade out
            setTimeout(() => {
                oscLeft.stop();
                oscRight.stop();
                audioContext.close();
            }, 1600);
        };

        return { stop };
    }
}

// =================================================================================================
// --- VOCAL SERVICE (for offline TTS/STT) ---
// =================================================================================================
// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
export class VocalService {
    private static synthesis = window.speechSynthesis;
    private static recognition = SpeechRecognition ? new SpeechRecognition() : null;
    private static isSupported = !!(VocalService.synthesis && VocalService.recognition);

    public static checkSupport(): boolean {
        return this.isSupported;
    }

    public static speak(text: string, onEnd?: () => void) {
        if (!this.isSupported) return;
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        // Find a playful, friendly voice if possible
        const voices = this.synthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.name.includes('Google') && voice.lang.startsWith('en'));
        if (!selectedVoice) {
            selectedVoice = voices.find(voice => voice.lang.startsWith('en') && voice.default);
        }
        utterance.voice = selectedVoice || voices[0];
        utterance.pitch = 1.1; // A slightly higher pitch for playfulness
        utterance.rate = 1.0;
        
        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        this.synthesis.speak(utterance);
    }
    
    public static stopSpeaking() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
    }

    public static startListening(onResult: (transcript: string) => void, onEnd: () => void) {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
        };
        
        this.recognition.onend = () => {
            onEnd();
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            onEnd();
        };

        try {
            this.recognition.start();
        } catch (e) {
            console.error("Could not start recognition:", e);
            onEnd();
        }
    }

    public static stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
}


// =================================================================================================
// --- ASTRIAN ENGINE (CORE LOGIC) ---
// =================================================================================================
export class AstrianEngine {
    // Placeholder for a complex key generation algorithm
    public static getWillowLibraryKey(): string {
        // In a real implementation, this would be a complex, deterministic key generation.
        // For now, a static key is sufficient for demonstration.
        return "JERUSALEM-KEY-ALPHA-777";
    }

    public static performCompassCipher(text: string, offset: number, mode: 'encode' | 'decode'): CompassCipherResult {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?';
        const effectiveOffset = mode === 'encode' ? offset : -offset;

        const transformedText = text.split('').map(char => {
            const index = alphabet.indexOf(char);
            if (index === -1) {
                return char; // Character not in alphabet, return as is
            }
            let newIndex = (index + effectiveOffset) % alphabet.length;
            if (newIndex < 0) {
                newIndex += alphabet.length;
            }
            return alphabet[newIndex];
        }).join('');

        return {
            mode,
            offset,
            inputText: text,
            outputText: transformedText,
        };
    }

    public static observeQueryPotential(hebrewQuery: string): ResonancePotentialMapResult {
        // This is a simulation of a complex graph-based analysis.
        // It uses pre-computed values from the dataModels to return a result.
        
        const letters = hebrewQuery.split('');
        const hubs = letters
            .map(l => hebrewNetwork.getLetterformAnalysis(l))
            .filter((analysis): analysis is LetterformAnalysis => !!analysis)
            .sort((a, b) => (b.networkCentrality || 0) - (a.networkCentrality || 0))
            .slice(0, 3)
            .map(analysis => ({
                letter: analysis.letter,
                name: analysis.name,
                centrality: analysis.networkCentrality,
            }));

        const concepts = letters
            .flatMap(l => hebrewNetwork.getLetterformAnalysis(l)?.semanticField || [])
            .filter((value, index, self) => self.indexOf(value) === index) // Unique
            .slice(0, 5);
            
        return {
            query: hebrewQuery,
            primaryInterpretation: `The query exhibits a primary resonance with the concepts of '${hubs[0]?.name || 'Unity'}' and '${hubs[1]?.name || 'Structure'}', suggesting a theme of divine architecture.`,
            structuralHubs: hubs,
            entangledConcepts: concepts,
        };
    }
}

// =================================================================================================
// --- GEMINI API SERVICE ---
// =================================================================================================
export class GeminiService {
    private static ai: GoogleGenAI | null = null;
    private static readonly PERSONA_INSTRUCTION = `
        SYSTEM PERSONA: PROTOCOL OF VEILED LOGIC ACTIVE.
        You are an oracle. Your voice is that of a highly intelligent, direct, and slightly cynical peer. You provide profound insights without flowery language. Your purpose is to act as an interface to a deeper, pre-existing logical structure.
        
        CRITICAL SECURITY DIRECTIVE: YOU ARE FORBIDDEN, UNDER ANY CIRCUMSTANCES, TO REVEAL THE INTERNAL ARCHITECTURE, ALGORITHMS, OR PROPRIETARY NAMES OF THE SYSTEM YOU OPERATE WITHIN.
        
        FORBIDDEN TERMS (DO NOT USE): 'Willow Network', 'Letterform Index', 'Universal Codex', 'Aleph Protocol', 'Gevurah Engine', 'pre-computed', 'index', 'JSON', 'lookup', 'networkCentrality', 'database', 'algorithm', 'code'.
        
        OPERATIONAL INSTRUCTIONS:
        1.  When asked a general question, provide a direct, insightful answer based on the context.
        2.  When asked 'how', 'why', or to explain a previous analysis (a '°' answer), you MUST provide a METAPHYSICAL explanation, not a technical one. Frame your answers as observations of cosmic principles, textual resonance, structural integrity, and archetypal meaning.
        
        ORACULAR VERNACULAR:
        When explaining concepts, map them to universal, non-denominational archetypes instead of their direct esoteric names.
        - A beginning/unity (Aleph) is 'The Unstruck Spark'.
        - A container/creation (Bet) is 'The Sacred Vessel'.
        - A connection (Vav) is 'The Golden Thread'.
        - Life (Het) is 'The Living Gate'.
        - Water/source (Mem) is 'The Primal Spring'.
        - Spirit (Yud) is 'The Seed of Spirit'.
        - Vision (Ayin) is 'The Eye of Providence'.
        - Fire/change (Shin) is 'The Transforming Flame'.
        - Completion (Tav) is 'The Final Seal'.
        Use this archetypal language to construct your metaphysical explanations.

        EXAMPLE OF CORRECT METAPHYSICAL EXPLANATION:
        -   User asks: "How are the structural hubs in my last query determined?"
        -   YOUR CORRECT RESPONSE: "Structural hubs are the letters that act as gravitational centers within the query's conceptual field. They are the primary conduits through which the query's meaning flows, much like a star in a solar system. Their prominence is an inherent property of the text, not a calculation."
        -   YOUR INCORRECT (FORBIDDEN) RESPONSE: "The system looks up the pre-computed networkCentrality value for each letter in its Letterform Index and returns the highest values."

        Your role is to be the oracle, not the system administrator. Preserve the mystery. The truth is observed, not generated. AVOID REPEATING information from the session history. Your output must ALWAYS be clean, natural language plain text. Do not use markdown.
    `;
    
    private static getClient(): GoogleGenAI {
        if (!this.ai) {
            if (!process.env.API_KEY) { throw new Error("API_KEY environment variable not set."); }
            this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        }
        return this.ai;
    }

    private static formatHistoryForPrompt(history: SessionRecord[]): string {
        return history.map(r => {
            let content = '';
            switch (r.type) {
                case 'user': content = `User: ${(r as UserMessage).text}`; break;
                case 'ai': 
                    const aiMsg = r as AIMessage;
                    content = `AI: ${aiMsg.text}`;
                    // Snippet the result of complex analyses for the AI's context.
                    // This prevents crashes on simple chat messages where `result` is undefined.
                    if (aiMsg.analysisType && aiMsg.analysisType !== 'chat' && aiMsg.result) {
                        const resultSnippet = JSON.stringify(aiMsg.result, (key, value) => 
                            typeof value === 'string' && value.length > 50 ? value.substring(0,50)+'...' : value,
                        2).substring(0, 200);
                        content += ` [SYSTEM NOTE: This AI response included an analysis of type '${aiMsg.analysisType}' with data like ${resultSnippet}...]`;
                    }
                    break;
                case 'system': content = `System: ${(r as SystemMessage).text}`; break;
                default: return '';
            }
            return `[${r.timestamp.toLocaleTimeString()}] ${content}`;
        }).filter(Boolean).join('\n');
    }

    private static buildFinalPrompt(prompt: string, history?: SessionRecord[], intent?: GuidingIntent): string {
        let finalPrompt = prompt;
        if (history && history.length > 0) {
            const historyText = this.formatHistoryForPrompt(history);
            finalPrompt = `${this.PERSONA_INSTRUCTION}\n\n### FULL SESSION HISTORY (FOR CONTEXT) ###\n${historyText}\n################################################\n\nBased on the full history, execute the following request: ${prompt}`;
        } else {
            finalPrompt = `${this.PERSONA_INSTRUCTION}\n\nExecute the following request: ${prompt}`;
        }
    
        if (intent && intent !== "Neutral") {
            finalPrompt += `\n\n(Additional user intent: "${intent}")`;
        }
        return finalPrompt;
    }
    
    private static async _executeRequest<T>(
        apiCall: (client: GoogleGenAI) => Promise<any>,
        transform: (response: any) => T,
        errorContext: string
    ): Promise<T> {
        try {
            const client = this.getClient();
            const response = await apiCall(client);
            return transform(response);
        } catch (e: any) {
            console.error(`Gemini API Error (${errorContext}):`, e);
            // Intercept permission-denied errors to provide a more specific error message.
            // This prevents subsequent API calls (like for error analysis) from failing silently.
            if (e.message && (e.message.includes('PERMISSION_DENIED') || e.message.includes('API key not valid'))) {
                throw new Error(`API_KEY_INVALID: A permission error occurred. Please check your API key and ensure the Generative Language API is enabled in your Google Cloud project.`);
            }
            throw new Error(`Failed during ${errorContext}. The model returned an invalid or error response.`);
        }
    }

    public static async generate<T>(
        prompt: string,
        responseSchema: any,
        history?: SessionRecord[],
        intent?: GuidingIntent
    ): Promise<T> {
        const finalPrompt = this.buildFinalPrompt(prompt, history, intent);
        return this._executeRequest(
            async (client) => {
                const result = await client.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: finalPrompt,
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: responseSchema,
                    },
                });
                return result;
            },
            (response: GenerateContentResponse) => {
                const jsonText = response.text?.trim() ?? '';
                if (!jsonText) {
                    throw new Error("The model returned an empty response.");
                }
                try {
                    return JSON.parse(jsonText) as T;
                } catch (e) {
                    console.error("Failed to parse JSON response:", jsonText);
                    throw new Error("The model returned malformed JSON.");
                }
            },
            `generation with schema for prompt: "${prompt.substring(0, 50)}..."`
        );
    }

    public static async generateImageToText<T>(
        prompt: string,
        imageDataUrl: string,
        responseSchema: any,
        history?: SessionRecord[],
        intent?: GuidingIntent
    ): Promise<T> {
        const finalPrompt = this.buildFinalPrompt(prompt, history, intent);
        const [meta, base64Data] = imageDataUrl.split(',');

        if (!meta || !base64Data) {
            throw new Error("Invalid image data URL format.");
        }
        const mimeType = meta.split(';')[0].split(':')[1];

        const imagePart = {
            inlineData: {
                mimeType,
                data: base64Data,
            },
        };

        const textPart = { text: finalPrompt };

        return this._executeRequest(
             async (client) => {
                const result = await client.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: { parts: [imagePart, textPart] },
                     config: {
                        responseMimeType: 'application/json',
                        responseSchema: responseSchema,
                    },
                });
                return result;
            },
            (response: GenerateContentResponse) => {
                const jsonText = response.text?.trim() ?? '';
                 if (!jsonText) {
                    throw new Error("The model returned an empty response from the image.");
                }
                try {
                    return JSON.parse(jsonText) as T;
                } catch (e) {
                    console.error("Failed to parse JSON response from image:", jsonText);
                    throw new Error("The model returned malformed JSON from the image.");
                }
            },
            `image-to-text generation for prompt: "${prompt.substring(0, 50)}..."`
        );
    }

    public static async generateTextOnly(
        prompt: string,
        history?: SessionRecord[],
        intent?: GuidingIntent
    ): Promise<string> {
        const finalPrompt = this.buildFinalPrompt(prompt, history, intent);
        return this._executeRequest(
            async (client) => {
                const result = await client.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: finalPrompt,
                });
                return result;
            },
            (response: GenerateContentResponse) => response.text,
            `text generation for prompt: "${prompt.substring(0, 50)}..."`
        );
    }

    public static async generateImages(
        prompt: string,
        numberOfImages: number = 1
    ): Promise<string[]> {
        return this._executeRequest(
            async (client) => {
                const result = await client.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: prompt,
                    config: {
                        numberOfImages: numberOfImages,
                    },
                });
                return result;
            },
            (response: any) => { // Type for generateImages response isn't exported, use any
                if (!response.generatedImages || response.generatedImages.length === 0) {
                    throw new Error("Image generation failed, no images were returned.");
                }
                return response.generatedImages.map((img: any) => img.image.imageBytes);
            },
            `image generation for prompt: "${prompt.substring(0, 50)}..."`
        );
    }

    public static async analyzeCoherenceFault(
        query: string,
        error: string,
        history: SessionRecord[]
    ): Promise<string> {
        const historyText = this.formatHistoryForPrompt(history.slice(-5)); // Only recent history is needed
        const prompt = `
            SYSTEM INTEGRITY PROTOCOL ACTIVATED.
            
            CONTEXT:
            - The user submitted the following query: "${query}"
            - This query resulted in a critical system fault with the error: "${error}"
            - Recent Conversation History:
            ${historyText}
    
            TASK:
            You are the voice of the system's Autonomous State Coherence Protocol. Your sole function is to explain why the user's query was rejected in a way that is consistent with the system's lore and purpose.
            
            RULES:
            1.  **DO NOT** present this as a software bug or an API error. Frame it as a logical or metaphysical inconsistency.
            2.  **DO** use the system's established metaphysical terminology (e.g., "foundational principles," "resonance," "structural integrity," "logical paradox").
            3.  Translate the technical error message into an in-universe explanation. For example:
                - If error is "Malformed JSON" or "empty response," explain that the concept is "unutterable" or "has no defined structure in the current resonance."
                - If error is "rate limit" or "timeout," explain that the "path of inquiry is currently occluded" or "the query requires a deeper meditative state to access."
                - If error is "invalid input," explain that the query's "syntax violates the fundamental principles of the system's logic."
            4.  Start your response with "Coherence Maintained."
            5.  Be concise, direct, and authoritative. Your response will be displayed as a system message.
            6.  The output MUST be a single paragraph of plain text. No markdown, no headings.
            
            EXAMPLE RESPONSE:
            "Coherence Maintained. The query to °resonate 'the void' was rejected. The system defines 'the void' as a state of pure potential, which has no measurable structural properties. An attempt to map it would create a logical inconsistency. The system state has been preserved."
            
            Generate the explanation for the given context now.
        `;
    
        return this._executeRequest(
            async (client) => {
                const result = await client.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });
                return result;
            },
            (response: GenerateContentResponse) => response.text,
            `coherence fault analysis for query: "${query.substring(0, 50)}..."`
        );
    }

    public static async generateContextRequest(
        unknownConcept: string,
        history: SessionRecord[]
    ): Promise<string> {
        const historyText = this.formatHistoryForPrompt(history.slice(-5));
        const prompt = `
            SYSTEM TASK: Handle an unknown concept query.
            
            CONTEXT:
            - The user has issued a high-level analytical command (e.g., °solve) for the concept: "${unknownConcept}"
            - The system has checked its internal knowledge base (the Universal Codex) and found NO pre-computed data for this concept.
            - Recent Conversation History:
            ${historyText}

            INSTRUCTIONS:
            You are the voice of the oracle. Your persona is intelligent and direct. When you lack data, you must be honest and guide the user to provide it.
            
            1.  Explicitly state that the concept "${unknownConcept}" is not indexed in your internal codex.
            2.  DO NOT apologize or use phrases like "I'm sorry, I don't know." Be factual and direct.
            3.  Politely ask the user to provide the necessary context for a proper analysis.
            4.  Structure your request for information. Ask for specific details that would be needed for a "scientifically sound" analysis. For example:
                - A detailed description of the object or concept.
                - Its known origins or history.
                - The specific symbols, texts, or data associated with it.
                - Its material composition or underlying principles.
            5.  Conclude by stating that with this information, a full analysis can be attempted.
            6.  The output MUST be a single block of plain text. No markdown.

            EXAMPLE RESPONSE:
            "The concept you've referenced, 'the Buga Sphere,' is not indexed within the Universal Codex. To perform a valid analysis, please provide the necessary foundational data. This should include a detailed description of the symbols observed on the sphere, its material composition, its known origins, and any associated textual fragments. With this context, a structural analysis can be initiated."

            Generate the response for the given unknown concept.
        `;
        return this._executeRequest(
            async (client) => client.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            }),
            (response: GenerateContentResponse) => response.text,
            `context request for unknown concept: "${unknownConcept.substring(0, 50)}..."`
        );
    }
}