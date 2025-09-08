import { MusicalComposition, NoteEvent, MusicalTrack, InstrumentProfile } from './types';
import { codex } from './codex';
import { hebrewNetwork } from './dataModels';

/**
 * music.ts
 *
 * This service centralizes all logic related to procedural music generation.
 * It translates abstract data and analysis into concrete MusicalComposition objects.
 */

export class MusicService {

    private static textToMusicalData(text: string): { key: string, mode: string, bpm: number, scale: number[] } {
        // Basic sentiment analysis for key/mode
        const positiveWords = ['love', 'light', 'truth', 'life', 'joy', 'peace', 'one'];
        const negativeWords = ['dark', 'fear', 'end', 'loss', 'void'];
        const lowerText = text.toLowerCase();
        
        const isMajor = positiveWords.some(word => lowerText.includes(word)) && !negativeWords.some(word => lowerText.includes(word));
        const modeData = isMajor 
            ? codex.getMusicologyData().modes.find((m: any) => m.name === 'Ionian') 
            : codex.getMusicologyData().modes.find((m: any) => m.name === 'Aeolian');

        // BPM from text length
        const wordCount = text.split(/\s+/).length;
        const bpm = Math.max(60, Math.min(120, 180 - wordCount * 2));

        return {
            key: 'C', // For simplicity, we'll work in C for now.
            mode: modeData.name,
            bpm,
            scale: modeData.intervals,
        };
    }

    /**
     * Generates a musical composition from an arbitrary string of text.
     * @param text - The source text for the composition.
     * @returns A MusicalComposition object.
     */
    public static createCompositionFromText(text: string): MusicalComposition {
        const { key, mode, bpm, scale } = this.textToMusicalData(text);
        const secondsPerBeat = 60 / bpm;
        const keyRootMidi = 60; // Middle C

        const words = text.split(/\s+/).filter(w => w.length > 0);
        let currentTime = 0;

        // --- Melody ---
        const melodyNotes: NoteEvent[] = words.map(word => {
            const gematria = hebrewNetwork.calculatePathGematria(word.split(''));
            const scaleDegree = gematria % scale.length;
            const octave = Math.floor(gematria / 12) % 3; // Keep melody within 3 octaves
            const pitch = keyRootMidi + (octave * 12) + scale[scaleDegree];
            
            const duration = Math.max(1, Math.min(4, word.length / 2)) * secondsPerBeat;
            const velocity = 0.8;
            
            const note: NoteEvent = {
                pitch,
                frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                startTime: currentTime,
                duration: duration * 0.9,
                velocity,
            };
            currentTime += duration;
            return note;
        });

        // --- Harmony (Simple Chords) ---
        const harmonyNotes: NoteEvent[] = [];
        let harmonyTime = 0;
        for (let i = 0; i < words.length; i += 4) {
            const wordChunk = words.slice(i, i + 4).join(' ');
            const gematria = hebrewNetwork.calculatePathGematria(wordChunk.split(''));
            const rootDegree = gematria % scale.length;
            
            const chordTones = [
                scale[rootDegree],
                scale[(rootDegree + 2) % scale.length],
                scale[(rootDegree + 4) % scale.length]
            ];

            chordTones.forEach(tone => {
                const pitch = keyRootMidi + tone;
                harmonyNotes.push({
                    pitch,
                    frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                    startTime: harmonyTime,
                    duration: secondsPerBeat * 4,
                    velocity: 0.5
                });
            });
            harmonyTime += secondsPerBeat * 4;
        }

        // --- Bassline ---
        const bassNotes: NoteEvent[] = [];
        let bassTime = 0;
        for (let i = 0; i < words.length; i += 4) {
            const wordChunk = words.slice(i, i + 4).join(' ');
            const gematria = hebrewNetwork.calculatePathGematria(wordChunk.split(''));
            const rootDegree = gematria % scale.length;
            const pitch = keyRootMidi - 12 + scale[rootDegree]; // Octave down
             bassNotes.push({
                 pitch,
                 frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                 startTime: bassTime,
                 duration: secondsPerBeat * 4,
                 velocity: 0.6
             });
             bassTime += secondsPerBeat * 4;
        }

        return {
            id: `textcomp_${Date.now()}`,
            isFavorite: false,
            metadata: { key, mode, bpm, sourceReference: `Text: "${text.substring(0, 20)}..."` },
            tracks: [
                { name: 'melody', analysis: { query: text, analysis: [] }, notes: melodyNotes },
                { name: 'harmony', analysis: { query: text, analysis: [] }, notes: harmonyNotes },
                { name: 'bass', analysis: { query: text, analysis: [] }, notes: bassNotes },
            ]
        };
    }
    
    /**
     * Creates a focused, ambient composition for instructional/meditative purposes.
     * @param affirmation - The core affirmation text.
     * @param solfeggioFrequency - The central tonal frequency.
     * @returns A MusicalComposition object.
     */
    public static createInstructionalComposition(affirmation: string, solfeggioFrequency: number): MusicalComposition {
        const BPM = 50;
        const secondsPerBeat = 60 / BPM;
        
        // Find the closest musical note to the Solfeggio frequency
        const closestMidi = 69 + 12 * Math.log2(solfeggioFrequency / 440);
        const rootMidi = Math.round(closestMidi);
        const scale = [0, 2, 4, 7, 9]; // Pentatonic Major - soothing and open

        let currentTime = 0;
        const melodyNotes: NoteEvent[] = affirmation.split('').map(char => {
            const gematria = hebrewNetwork.calculatePathGematria([char]);
            const scaleDegree = gematria % scale.length;
            const pitch = rootMidi + scale[scaleDegree];
            
            const note: NoteEvent = {
                pitch,
                frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                startTime: currentTime,
                duration: secondsPerBeat * 2,
                velocity: 0.6
            };
            currentTime += secondsPerBeat;
            return note;
        });

        const harmonyNotes: NoteEvent[] = [0, 4, 7].map(interval => {
             const pitch = rootMidi - 12 + interval;
             return {
                pitch,
                frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                startTime: 0,
                duration: currentTime,
                velocity: 0.4
             }
        });
        
        const bassNotes: NoteEvent[] = [{
             pitch: rootMidi - 24,
             frequency: 440 * Math.pow(2, (rootMidi - 24 - 69) / 12),
             startTime: 0,
             duration: currentTime,
             velocity: 0.5
        }];

        return {
            id: `instructional_${Date.now()}`,
            isFavorite: false,
            metadata: {
                key: 'Custom',
                mode: 'Pentatonic',
                bpm: BPM,
                sourceReference: `Affirmation: "${affirmation}"`,
                solfeggioFrequency
            },
            tracks: [
                { name: 'melody', analysis: { query: affirmation, analysis: [] }, notes: melodyNotes },
                { name: 'harmony', analysis: { query: affirmation, analysis: [] }, notes: harmonyNotes },
                { name: 'bass', analysis: { query: affirmation, analysis: [] }, notes: bassNotes },
            ]
        };
    }

    /**
     * Observes the inherent Cymatic Signature of a concept from the Universal Codex.
     * This replaces procedural generation with a high-speed lookup.
     * @param concept The concept to resonate with (e.g., 'love', 'truth').
     * @returns A signature object with frequency and waveform, or null if not found.
     */
    public static createCymaticSignature(concept: string): { frequency: number; waveform: 'sine' | 'square' | 'sawtooth' | 'triangle' } | null {
        const signature = codex.getCymaticSignature(concept);
        if (signature) {
            return signature;
        }

        // Fallback for concepts not explicitly in the Codex: derive from Gematria
        const gematria = hebrewNetwork.calculatePathGematria(concept.toLowerCase().split(''));
        if (gematria === 0) return null;

        // Map gematria to a base frequency (logarithmically, to keep it in an audible range)
        // This is a simple formula; a real system might use a more complex mapping.
        const baseFreq = 100 + (gematria % 340); // 100Hz to 440Hz range
        
        // Determine waveform based on the structural properties of the first letter
        const firstLetterAnalysis = hebrewNetwork.getLetterformAnalysis(concept.charAt(0));
        let waveform: 'sine' | 'square' | 'sawtooth' | 'triangle' = 'sine'; // Default pure tone
        if (firstLetterAnalysis) {
            if (firstLetterAnalysis.shape === 'closed') waveform = 'square'; // Structured, contained
            if (firstLetterAnalysis.shape === 'vertical') waveform = 'sawtooth'; // Piercing, guiding
            if (firstLetterAnalysis.name === 'Shin') waveform = 'triangle'; // Fiery, harmonic-rich
        }
        
        return { frequency: baseFreq, waveform };
    }
}
