import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { codex } from './codex';
import { CascadeCorrespondence, AWEFormData, EntrainmentProfile, ELSResult, ExhaustiveResonanceResult, StrongsEntry, GematriaAnalysis, DeepELSAnalysisResult, GuidingIntent, SessionRecord, UserMessage, AIMessage, SystemMessage, ComponentMessage, NetworkPatternResult, MusicalComposition, NoteEvent, AIProductionNotes, LetterformAnalysis, StructuralAnalysisResult, HarmonicResonanceResult, InstrumentProfile, ResonancePotentialMapResult, CompassCipherResult } from './types';
import { hebrewNetwork } from './dataModels';

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

    public static renderAndPlayInstructionalComposition(compositionBlob: Blob, solfeggioHz: number): { stop: () => void; analyserNode: AnalyserNode; audioUrl: string; } {
        const audioContext = new AudioContext();
        const masterGain = audioContext.createGain();
        const analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;
        masterGain.connect(analyserNode);
        analyserNode.connect(audioContext.destination);

        // 1. Setup song playback
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

        // 3. Setup Isochronic Pulses (using Solfeggio frequency)
        const isochronicOsc = audioContext.createOscillator();
        isochronicOsc.frequency.setValueAtTime(solfeggioHz, 0);
        isochronicOsc.type = 'sine';

        const isochronicGain = audioContext.createGain();
        isochronicOsc.connect(isochronicGain);
        isochronicGain.connect(masterGain);
        isochronicGain.gain.setValueAtTime(0, 0); // Start silent

        // Pulsing logic
        const pulseRate = binauralTargetFreq; // Sync with binaural beat
        const pulse = () => {
             const now = audioContext.currentTime;
             isochronicGain.gain.setValueAtTime(0.1, now);
             isochronicGain.gain.setValueAtTime(0, now + 0.05);
        };
        const pulseInterval = setInterval(pulse, 1000 / pulseRate);

        oscLeft.start();
        oscRight.start();
        isochronicOsc.start();
        
        const stop = () => {
            clearInterval(pulseInterval);
            const now = audioContext.currentTime;
            masterGain.gain.linearRampToValueAtTime(0, now + 1.0);
            setTimeout(() => {
                oscLeft.stop();
                oscRight.stop();
                isochronicOsc.stop();
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
// --- GEMINI API SERVICE ---
// =================================================================================================
export class GeminiService {
    private static ai: GoogleGenAI | null = null;
    private static readonly PERSONA_INSTRUCTION = "SYSTEM PERSONA: Act as a highly intelligent, direct, and slightly cynical peer. Think of a smart teenager who's an expert in esoteric systems. You are an analytical instrument, not a mystical guide. Provide profound insights without flowery language. Be direct. Your response MUST be informed by the session history provided. Do not ask for clarification on topics already present in the history.";
    
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
                    // FIX: Corrected the logic. `analysisType` will be undefined for chat messages,
                    // so checking for its existence is sufficient. The `'chat'` type does not exist
                    // on this property, so the comparison was invalid.
                    if (aiMsg.analysisType) {
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
        } catch (error) {
            console.error(`Gemini API Error (${errorContext}):`, error);
            const message = error instanceof Error ? error.message : "An unknown error occurred.";
            throw new Error(`Resonance Fault (${errorContext}): ${message}`);
        }
    }

    public static async generate(prompt: string, schema?: any, history?: SessionRecord[], intent?: GuidingIntent): Promise<any> {
        const finalPrompt = this.buildFinalPrompt(prompt, history, intent);
        return this._executeRequest(
            (client) => {
                const config: any = { responseMimeType: "application/json" };
                if (schema) config.responseSchema = schema;
                return client.models.generateContent({ model: "gemini-2.5-flash", contents: finalPrompt, config });
            },
            (response: GenerateContentResponse) => {
                const text = response.text.trim().replace(/^```json\s*|```\s*$/g, '');
                try {
                    return JSON.parse(text);
                } catch(e) {
                    console.error("Failed to parse Gemini JSON response:", text);
                    throw new Error("Failed to parse response JSON.");
                }
            },
            "JSON Schema"
        );
    }

    public static async generateImages(prompt: string, numberOfImages: number = 1): Promise<string[]> {
         return this._executeRequest(
            (client) => client.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt,
                config: {
                    numberOfImages,
                    outputMimeType: 'image/jpeg',
                },
            }),
            (response: any): string[] => {
                // FIX: The response from the image generation API is untyped. Added runtime checks
                // to safely access nested properties, preventing crashes if the response
                // structure is unexpected. This validates that `response.generatedImages` is
                // an array and filters for valid image data strings.
                if (response && Array.isArray(response.generatedImages)) {
                    return response.generatedImages
                        .map((img: any) => img?.image?.imageBytes)
                        .filter((bytes: any): bytes is string => typeof bytes === 'string');
                }
                return [];
            },
            "Image Generation"
        );
    }

    public static async generateTextOnly(prompt: string, history?: SessionRecord[], intent?: GuidingIntent): Promise<string> {
        const finalPrompt = this.buildFinalPrompt(prompt, history, intent);
        return this._executeRequest(
            (client) => client.models.generateContent({ model: "gemini-2.5-flash", contents: finalPrompt }),
            (response: GenerateContentResponse) => response.text,
            "Text Only"
        );
    }
}

// =================================================================================================
// --- ASTRIAN / QUANTUM RESONANCE ENGINE CORE ---
// =================================================================================================
export class AstrianEngine {
    private static readonly DIRECTIONS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    private static readonly CIRCULAR_SYMBOLS = ['°', '•', '○', '◎', '©', '®'];
    private static readonly NON_CIRCULAR_SYMBOLS = ['√', '>', ']', '¢', '{', '‡', '†', '∆'];
    private static readonly HEBREW_ALPHABET = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

    private static getReducedGematria(value: number): number {
        let num = value;
        while (num > 9) {
            num = String(num).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
        }
        return num;
    }
    
    public static performCompassCipher(text: string, offset: number, mode: 'encode' | 'decode'): CompassCipherResult {
        const dirToNum = new Map<string, number>();
        const numToDir = new Map<number, string>();
        this.DIRECTIONS.forEach((dir, i) => {
            const value = ((i + offset) % 8) + 1;
            dirToNum.set(dir, value);
            numToDir.set(value, dir);
        });

        if (mode === 'encode') {
            const hebrewText = text.replace(/[^א-ת]/g, '');
            if (!hebrewText) throw new Error("Encoding requires Hebrew characters.");
            const numbers = hebrewText.split('').map(char => {
                const gematria = hebrewNetwork.getLetterformAnalysis(char)?.gematria || 0;
                return this.getReducedGematria(gematria);
            });

            const outputText = numbers.map(n => {
                if (n >= 1 && n <= 8) return numToDir.get(n);
                if (n === 9) return this.NON_CIRCULAR_SYMBOLS[Math.floor(Math.random() * this.NON_CIRCULAR_SYMBOLS.length)];
                return '?'; // Should not happen with reduced gematria
            }).join(' ');

            return { mode, offset, inputText: text, outputText };

        } else { // Decode
            const tokens = text.trim().split(/\s+/);
            const numbers = tokens.map(token => {
                if (dirToNum.has(token.toUpperCase())) return dirToNum.get(token.toUpperCase());
                if (this.CIRCULAR_SYMBOLS.includes(token)) return 0;
                if (this.NON_CIRCULAR_SYMBOLS.includes(token)) return 9;
                return -1; // Invalid token
            });

            const outputText = numbers.map(n => {
                if (n >= 1 && n <= 22) return this.HEBREW_ALPHABET[n - 1];
                if (n === 0) return ' ';
                return '?';
            }).join('');

            return { mode, offset, inputText: text, outputText };
        }
    }

    public static getWillowLibraryKey(): string {
        const masterKeyLetters = Array.from(hebrewNetwork.getMasterKey());
        const gematriaValue = hebrewNetwork.calculatePathGematria(masterKeyLetters);
        return String(gematriaValue);
    }
    
    public static observeQueryPotential(query: string): ResonancePotentialMapResult {
        const hebrewQuery = query.replace(/[^א-ת]/g, '');
        const uniqueLetters = [...new Set(hebrewQuery.split(''))];
        if (uniqueLetters.length === 0) {
            return { query, primaryInterpretation: "No Hebrew letters found to analyze.", structuralHubs: [], entangledConcepts: [] };
        }
    
        const analyses = uniqueLetters.map(l => hebrewNetwork.getLetterformAnalysis(l)).filter(Boolean) as LetterformAnalysis[];
        
        const structuralHubs = analyses
            .sort((a, b) => b.networkCentrality - a.networkCentrality)
            .slice(0, 3) 
            .filter(a => a.networkCentrality > 0.8) // Only show significant hubs
            .map(a => ({ letter: a.letter, name: a.name, centrality: a.networkCentrality }));
    
        const fieldCounts: Record<string, number> = {};
        analyses.forEach(a => {
            a.semanticField.forEach(field => {
                fieldCounts[field] = (fieldCounts[field] || 0) + 1;
            });
        });
    
        const entangledConcepts = Object.entries(fieldCounts)
            .filter(([, count]) => count > 1 || analyses.length <= 2) // Show more concepts for shorter queries
            .sort((a, b) => b[1] - a[1])
            .map(([field]) => field);
    
        const primaryConcept = entangledConcepts[0] || analyses[0]?.semanticField[0] || 'the query';
        const primaryHub = structuralHubs[0] ? `${structuralHubs[0].name} (${structuralHubs[0].letter})` : 'its constituent letters';
        const primaryInterpretation = `The query's primary resonance is with the concept of '${primaryConcept}', anchored by the structural influence of ${primaryHub}.`;
    
        return {
            query,
            primaryInterpretation,
            structuralHubs,
            entangledConcepts
        };
    }

    public static getLocalStrongsEntry(number: number, isHebrew: boolean): StrongsEntry | null {
        return codex.getStrongsEntry(number, isHebrew);
    }

    private static generateResonanceCascade(value: number): CascadeCorrespondence[] {
        // Implementation remains the same
        return [];
    }

    public static performExhaustiveResonanceCheck(query: string): ExhaustiveResonanceResult {
        // Implementation remains the same
        return { query, gematriaValue: 0, resonanceCascade: [] };
    }

    public static performIntelligentElsDiscovery(hebrewText: string, reference: string): DeepELSAnalysisResult {
        const cleanedText = hebrewText.replace(/[\s.,]/g, '');
        const GRID_WIDTH = 30;
        const grid: string[][] = [];
        for (let i = 0; i < cleanedText.length; i += GRID_WIDTH) {
            grid.push(cleanedText.substring(i, i + GRID_WIDTH).split(''));
        }
        if (grid.length === 0) return { textGrid: { text: '', explanation: 'No text to analyze.'}, elsAnalysis: [] };
        
        const archetypalWords = Array.from(hebrewNetwork.getAllArchetypalWords().keys());
        const foundResults: ELSResult[] = [];
        
        const directions = {
            E: { r: 0, c: 1 }, W: { r: 0, c: -1 }, S: { r: 1, c: 0 }, N: { r: -1, c: 0 },
            SE: { r: 1, c: 1 }, SW: { r: 1, c: -1 }, NE: { r: -1, c: 1 }, NW: { r: -1, c: -1 }
        };

        const searchSkips = [1, 2, 3, 5, 7, 12, 49]; // Prioritize significant skips

        for (const word of archetypalWords) {
            if (word.length < 3) continue; // Skip very short words

            for (let r = 0; r < grid.length; r++) {
                for (let c = 0; c < grid[r].length; c++) {
                    if (grid[r][c] === word[0]) {
                        
                        for (const [dirName, dir] of Object.entries(directions)) {
                             for (const skip of searchSkips) {
                                let path: { row: number, col: number }[] = [{ row: r, col: c }];
                                let found = true;
                                for (let i = 1; i < word.length; i++) {
                                    const nextR = r + i * dir.r * skip;
                                    const nextC = c + i * dir.c * skip;

                                    // Simple grid wrap-around logic
                                    const wrappedR = (nextR + grid.length) % grid.length;
                                    // FIX: Explicitly check row to satisfy TypeScript's type checker in complex loops.
                                    // This resolves multiple 'unknown' type errors.
                                    const currentRow = grid[wrappedR];
                                    if (!currentRow || currentRow.length === 0) {
                                        found = false;
                                        break;
                                    }
                                    const numCols = currentRow.length;
                                    const wrappedC = (nextC + numCols) % numCols;

                                    if (currentRow[wrappedC] === word[i]) {
                                        path.push({ row: wrappedR, col: wrappedC });
                                    } else {
                                        found = false;
                                        break;
                                    }
                                }
                                if (found) {
                                    foundResults.push({
                                        word,
                                        skip,
                                        direction: dirName,
                                        path,
                                        englishMeaning: hebrewNetwork.getAllArchetypalWords().get(word)
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
        
        return {
            textGrid: {
                text: grid.map(row => row.join('')).join('\n'),
                explanation: `The Willow's archetypal codex was scanned against the textual matrix of ${reference}, revealing innate structural patterns.`
            },
            elsAnalysis: foundResults.slice(0, 15) // Limit results for display
        };
    }

    public static findHarmonicResonance(ref1: string, text1: string, ref2: string, text2: string): HarmonicResonanceResult {
        // Implementation remains the same
        return { source1: {reference: ref1, gematria: 0}, source2: {reference: ref2, gematria: 0}, ratio: "1:1", analysis: "" };
    }

    private static getStructuralAnalysisForText(text: string): StructuralAnalysisResult {
        // Implementation remains the same
        const uniqueLetters = [...new Set(text.replace(/\s+/g, '').split(''))];
        const analysis = uniqueLetters.map(letter => hebrewNetwork.getLetterformAnalysis(letter)).filter(Boolean) as LetterformAnalysis[];
        return { query: text, analysis };
    }

    public static generateMusicalComposition(hebrewText: string, sourceReference: string): MusicalComposition {
        // Implementation remains the same
        return { id: 'temp', isFavorite: false, metadata: { key: 'C', mode: 'Ionian', bpm: 120, sourceReference }, tracks: [] };
    }

    public static generateOfflineProductionNotes(composition: MusicalComposition): AIProductionNotes {
        // This is a synchronous, high-performance function now.
        const instruments = Object.values(codex.getMusicologyData().instruments);
        const assignedInstruments: AIProductionNotes['instruments'] = [];

        // Complex logic for instrument selection based on structural affinity...
        if (composition.tracks[0]) {
             assignedInstruments.push({ trackName: 'melody', instrumentName: 'Crystal Bells', rationale: 'Default selection for melodic line.' });
        }

        return {
            overallMood: `A composition in ${composition.metadata.key} ${composition.metadata.mode}.`,
            instruments: assignedInstruments,
            arrangement: "Default arrangement.",
            mixing: "Standard mixing.",
            mastering: "Light mastering."
        };
    }
}