// =================================================================================================
// --- ALCHEMICAL MUSIC ENGINE (HOD) ---
// This service embodies the principle of Hod (Splendor/Intellect). It provides the intricate,
// structured logic for transliterating the system's core principles into harmonized,
// multi-layered musical compositions.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { GEVURAH_OPCODE_MOTIFS, dholRhythms, MOOD_SCALES, KEY_SIGNATURE_MAP, INSTRUMENT_PATCHES, OPCODE_ISLAND_MAP, INSTRUMENT_KITS, RHYTHM_VARIATIONS } from './music.data.ts';
import { ParsedInstruction, MusicComposition } from './types.ts';
import { parseGevurahScript } from './gevurah.engine.ts';
import { gematriaEngine } from './gematria.ts';

const C4_FREQ = 261.63;
const SCHUMANN_RESONANCE = 7.83;

type Envelope = {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
};

class MusicEngine {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private activeSources: (AudioNode | { stop: () => void })[] = [];
    public isPlaying = false;
    public currentComposition: string | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    private initAudioContext() {
        if (!this.audioContext) return false;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(0.3, 0); // Set a master volume
        this.masterGain.connect(this.audioContext.destination);
        return true;
    }

    public playFrequency(frequency: number, duration: number = 1, type: OscillatorType = 'sine'): void {
        if (!this.initAudioContext() || !this.audioContext || !this.masterGain) return;
        this.playNoteWithEnvelope(frequency, this.audioContext.currentTime, duration, { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.2 }, 0.8, type);
    }
    
    public stop() {
        if (!this.audioContext) return;
        this.activeSources.forEach(source => {
            try {
                if ('stop' in source && typeof source.stop === 'function') {
                    source.stop();
                }
                if (source instanceof AudioNode) {
                    source.disconnect();
                }
            } catch (e) { /* already stopped or disconnected */ }
        });
        this.activeSources = [];
        this.isPlaying = false;
        this.currentComposition = null;

        if (this.masterGain) {
            const now = this.audioContext.currentTime;
            this.masterGain.gain.cancelScheduledValues(now);
            this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
            this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        }
    }
    
    private getNoteFrequency(semitonesFromC4: number): number {
        return C4_FREQ * Math.pow(2, semitonesFromC4 / 12);
    }

    private playNoteWithEnvelope(freq: number, startTime: number, duration: number, envelope: Envelope, velocity: number, type: OscillatorType | 'noise', filterFreq?: number) {
        if (!this.audioContext || !this.masterGain) return;
        
        let sourceNode: AudioScheduledSourceNode;
        const gain = velocity;

        if (type === 'noise') {
            const bufferSize = this.audioContext.sampleRate * 2;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            noise.loop = true;
            sourceNode = noise;
        } else {
             const osc = this.audioContext.createOscillator();
             osc.type = type;
             osc.frequency.value = freq;
             sourceNode = osc;
        }

        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(gain, startTime + envelope.attack);
        gainNode.gain.linearRampToValueAtTime(envelope.sustain * gain, startTime + envelope.attack + envelope.decay);
        gainNode.gain.setValueAtTime(envelope.sustain * gain, startTime + duration - envelope.release);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        let lastNode: AudioNode = sourceNode;
        if(filterFreq) {
            const filterNode = this.audioContext.createBiquadFilter();
            filterNode.type = 'lowpass';
            filterNode.frequency.value = filterFreq;
            sourceNode.connect(filterNode);
            lastNode = filterNode;
        }

        lastNode.connect(gainNode);
        gainNode.connect(this.masterGain);

        sourceNode.start(startTime);
        sourceNode.stop(startTime + duration);
        this.activeSources.push(sourceNode);
    }
    
    private scheduleRhythm(pattern: number[], startTime: number, duration: number, bpm: number) {
        if (!this.audioContext || !this.masterGain) return;
        const sixteenthNoteDuration = 60 / (bpm * 4);
        const totalSixteenths = Math.floor(duration / sixteenthNoteDuration);

        for (let i = 0; i < totalSixteenths; i++) {
            const beatType = pattern[i % pattern.length];
            const time = startTime + i * sixteenthNoteDuration;

            if (beatType === 1) { // Dagga (bass)
                this.playNoteWithEnvelope(60, time, 0.3, { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.1 }, 0.4, 'sine');
            } else if (beatType === 2) { // Tilli (treble)
                this.playNoteWithEnvelope(3000, time, 0.1, {attack: 0.01, decay: 0.09, sustain: 0, release: 0}, 0.5, 'noise', 3000);
            }
        }
    }
    
    private playChant(freq: number, duration: number) {
        if (!this.audioContext || !this.masterGain) return;
        const now = this.audioContext.currentTime;
        
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.value = freq;
        osc2.type = 'sawtooth';
        osc2.frequency.value = freq + 1;

        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 3);
        gain.gain.setValueAtTime(0.15, now + duration - 3);
        gain.gain.linearRampToValueAtTime(0, now + duration);

        osc1.start(now);
        osc1.stop(now + duration);
        osc2.start(now);
        osc2.stop(now + duration);
        this.activeSources.push(osc1, osc2);
    }

    public createEntertainmentSong(options: { genre?: string, mood?: string, key?: string, scale?: string, bpm?: number }): Omit<MusicComposition, 'sourceId' | 'disclaimer'> {
         if (!this.initAudioContext()) return { title: 'Error', keySignature: 'N/A', instrumentation: [], mode: 'entertainment', bpm: 0, tracks: [] };
        this.stop();

        const { genre = 'ambient', mood = 'neutral', key, scale, bpm = 80 } = options;

        const kit = INSTRUMENT_KITS[genre] || INSTRUMENT_KITS.default;
        const moodScale = MOOD_SCALES[mood] || MOOD_SCALES.neutral;
        
        const finalKey = key || moodScale.key;
        const finalScale = scale || moodScale.mode;
        
        const title = `${finalKey} ${finalScale} (${genre})`;
        this.isPlaying = true;
        this.currentComposition = title;

        let keyNotes: number[];
        switch (finalScale) {
            case 'major':
                keyNotes = [0, 2, 4, 5, 7, 9, 11];
                break;
            case 'minor':
                keyNotes = [0, 2, 3, 5, 7, 8, 10];
                break;
            case 'dorian':
                keyNotes = [0, 2, 3, 5, 7, 9, 10];
                break;
            default:
                keyNotes = [0, 2, 4, 5, 7, 9, 11]; // Default to major
        }
        
        const rootNote = KEY_SIGNATURE_MAP.find(k => k.key === finalKey)?.rootNoteOffset ?? 0;
        const secondsPerBeat = 60 / bpm;
        const totalDuration = 32 * secondsPerBeat;

        let currentTime = this.audioContext!.currentTime + 0.5;

        // More interesting procedural generation could go here...
        for (let i = 0; i < 32; i++) {
             if (Math.random() > 0.4) {
                 const degree = keyNotes[Math.floor(Math.random() * keyNotes.length)];
                 const freq = this.getNoteFrequency(degree + rootNote);
                 this.playNoteWithEnvelope(freq, currentTime + i * secondsPerBeat, secondsPerBeat, INSTRUMENT_PATCHES.find(p=>p.name===kit.lead)!.envelope, 0.7, INSTRUMENT_PATCHES.find(p=>p.name===kit.lead)!.type);
             }
        }

        // --- Layering ---
        this.playChant(this.getNoteFrequency(rootNote - 12), totalDuration);
        this.scheduleRhythm(dholRhythms.meditative, currentTime, totalDuration, bpm);

        const timeout = setTimeout(() => { if (this.currentComposition === title) this.stop(); }, totalDuration * 1000 + 1000);
        this.activeSources.push({ stop: () => clearTimeout(timeout) });
        
        const tracks = [kit.lead, kit.pad, kit.bass, 'Hebrew Chant', 'Dhol Drums'];
        return { title, keySignature: `${finalKey} ${finalScale}`, instrumentation: [], mode: 'entertainment', bpm, tracks };
    }

    public playRhythm(rhythmName: string): Omit<MusicComposition, 'sourceId' | 'disclaimer'> {
        if (!this.initAudioContext()) return { title: 'Error', keySignature: 'N/A', instrumentation: [], mode: 'rhythm', bpm: 0, tracks: [] };
        this.stop();
        
        const rhythm = dholRhythms[rhythmName];
        if (!rhythm) return { title: 'Unknown Rhythm', keySignature: 'N/A', instrumentation: [], mode: 'rhythm', bpm: 0, tracks: [] };
        
        const title = `Dhol Rhythm: ${rhythmName}`;
        this.isPlaying = true;
        this.currentComposition = title;
        const bpm = 120;
        const duration = 16 * (60/bpm);

        this.scheduleRhythm(rhythm, this.audioContext!.currentTime, duration, bpm);

        const timeout = setTimeout(() => { if (this.currentComposition === title) this.stop(); }, duration * 1000 + 500);
        this.activeSources.push({ stop: () => clearTimeout(timeout) });
        
        return { title, keySignature: 'N/A', instrumentation: ['Dhol Drums'], mode: 'rhythm', bpm, tracks: ['Dhol Drums'] };
    }

    public createRitualSong(script: string, title: string): Omit<MusicComposition, 'sourceId' | 'disclaimer'> {
        if (!this.initAudioContext()) return { title: 'Error', keySignature: 'N/A', instrumentation: [], mode: 'ritual', bpm: 0, tracks: [] };
        this.stop(); 
        this.isPlaying = true;
        this.currentComposition = title;

        const { program } = parseGevurahScript(script);
        
        const scriptText = program.map(p => p.opcode).join(' ');
        const gematria = gematriaEngine.observe(scriptText);
        const keySignature = KEY_SIGNATURE_MAP.find(k => gematria >= k.range[0] && gematria <= k.range[1]) || KEY_SIGNATURE_MAP[0];
        const keyNotes = keySignature.mode === 'major' ? [0, 2, 4, 5, 7, 9, 11] : [0, 2, 3, 5, 7, 8, 10];
        const rootNoteOffset = keySignature.rootNoteOffset;
        const bpm = 72;
        const secondsPerBeat = 60 / bpm;

        const instrumentsUsed = new Set<string>();
        let melodyTime = this.audioContext!.currentTime + 1.0; 
        let rhythmTime = this.audioContext!.currentTime + 1.0;

        // --- Melody & Bass Tracks ---
        program.forEach(instr => {
            const motif = GEVURAH_OPCODE_MOTIFS[instr.opcode];
            if (motif) {
                motif.forEach(noteDef => {
                    if (noteDef.type === 'note') {
                        const island = OPCODE_ISLAND_MAP[instr.opcode] || 1;
                        const instrumentPatch = INSTRUMENT_PATCHES.find(p => p.island === island) || INSTRUMENT_PATCHES[0];
                        instrumentsUsed.add(instrumentPatch.name);

                        const scaleDegree = noteDef.degree % 7;
                        const octave = Math.floor(noteDef.degree / 7);
                        const semitones = keyNotes[scaleDegree] + (octave * 12) + rootNoteOffset;
                        
                        this.playNoteWithEnvelope(this.getNoteFrequency(semitones), melodyTime, noteDef.duration * secondsPerBeat, instrumentPatch.envelope, noteDef.velocity, instrumentPatch.type);
                        
                        // Add bass note on downbeat
                        if (melodyTime - (this.audioContext!.currentTime + 1.0) % secondsPerBeat < 0.01) {
                            const bassPatch = INSTRUMENT_PATCHES.find(p=>p.name === 'Root Bass')!;
                            this.playNoteWithEnvelope(this.getNoteFrequency(rootNoteOffset - 12), melodyTime, secondsPerBeat, bassPatch.envelope, 0.6, bassPatch.type);
                        }
                    }
                    melodyTime += noteDef.duration * secondsPerBeat;
                });
            }
        });
        
        // --- Dynamic Rhythm Track ---
        program.forEach(instr => {
            const duration = (GEVURAH_OPCODE_MOTIFS[instr.opcode]?.reduce((d, n) => d + n.duration, 0) || 1) * secondsPerBeat;
            if (['EXECUTE', 'CALL'].includes(instr.opcode)) {
                this.scheduleRhythm(RHYTHM_VARIATIONS.fill, rhythmTime, duration, bpm);
            } else {
                this.scheduleRhythm(dholRhythms.meditative, rhythmTime, duration, bpm);
            }
             rhythmTime += duration;
        });

        const totalDuration = melodyTime - this.audioContext!.currentTime + 2.0;
        
        // Final cymbal crash
        this.playNoteWithEnvelope(8000, melodyTime - secondsPerBeat, secondsPerBeat * 2, {attack: 0.01, decay: 1.5, sustain: 0, release: 0}, 0.5, 'noise', 6000);


        // --- Layering ---
        this.playNoteWithEnvelope(SCHUMANN_RESONANCE * 16, this.audioContext!.currentTime, totalDuration, {attack: 4, decay: 1, sustain: 0.1, release: 4}, 0.5, 'sine');
        this.playChant(this.getNoteFrequency(rootNoteOffset - 12), totalDuration);
        
        const timeout = setTimeout(() => { if (this.currentComposition === title) this.stop(); }, totalDuration * 1000);
        this.activeSources.push({ stop: () => clearTimeout(timeout) });
        
        const tracks = [...Array.from(instrumentsUsed), 'Root Bass', 'Hebrew Chant', 'Dhol Drums', 'Schumann Drone'];
        return { title, keySignature: `${keySignature.key} ${keySignature.mode}`, instrumentation: [], mode: 'ritual', bpm, tracks };
    }
}

export const musicEngine = new MusicEngine();