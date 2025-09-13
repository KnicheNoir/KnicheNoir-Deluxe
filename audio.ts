/**
 * audio.ts - The Tiferet-Yesod Audio Protocol (Perfect Realization)
 *
 * This is the canonical audio engine for the Astrian Key. It is a "Dumb Hand"
 * that generates a procedural, multi-layered soundscape that is a direct,
 * living reflection of the central Kernel's state (ECHAD).
 */
import { SystemFocus, ActiveProtocol } from './hooks';

interface SystemAudioState {
    focus: SystemFocus;
    protocol: ActiveProtocol;
}

export class AudioEngine {
    private audioContext: AudioContext;
    private masterGain: GainNode;
    private activeSources: AudioScheduledSourceNode[] = [];
    
    // Gain nodes for each conceptual layer of the soundscape
    private ambientHumGain: GainNode;
    private solveHeartbeatGain: GainNode;

    constructor() {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        
        this.ambientHumGain = this.audioContext.createGain();
        this.solveHeartbeatGain = this.audioContext.createGain();

        this.initializeSoundLayers();
    }
    
    private initializeSoundLayers() {
        const now = this.audioContext.currentTime;

        // Connect gain nodes to the master gain
        this.ambientHumGain.connect(this.masterGain);
        this.solveHeartbeatGain.connect(this.masterGain);
        
        // Set initial gain to 0 (silent)
        this.ambientHumGain.gain.setValueAtTime(0, now);
        this.solveHeartbeatGain.gain.setValueAtTime(0, now);

        // --- Create and connect sources ---

        // "Schumann Pulse" Drone (Constant Ambient Hum)
        const ambientHum = this.audioContext.createOscillator();
        ambientHum.type = 'sine';
        ambientHum.frequency.setValueAtTime(40, now); // Deep, stable, audible hum
        ambientHum.connect(this.ambientHumGain);
        ambientHum.start(now);
        this.activeSources.push(ambientHum);

        // "Solve" Protocol Heartbeat
        const heartbeatOsc = this.audioContext.createOscillator();
        heartbeatOsc.type = 'sine';
        heartbeatOsc.frequency.setValueAtTime(50, now);

        const gainLFO = this.audioContext.createOscillator();
        gainLFO.type = 'square';
        gainLFO.frequency.setValueAtTime(1.2, now); // 72 bpm

        const heartbeatGainModulator = this.audioContext.createGain();
        heartbeatGainModulator.gain.setValueAtTime(1, now);
        
        gainLFO.connect(heartbeatGainModulator.gain);
        heartbeatOsc.connect(heartbeatGainModulator).connect(this.solveHeartbeatGain);

        heartbeatOsc.start(now);
        gainLFO.start(now);
        this.activeSources.push(heartbeatOsc, gainLFO);
    }
    
    /** Modulates the audio layers based on the kernel's singular state. */
    public updateState(state: SystemAudioState) {
        this.resumeContext();
        const now = this.audioContext.currentTime;
        const rampTime = now + 1.5; // Cinematic fade

        // Determine target gains based on state
        const ambientGain = state.protocol !== 'solve' ? 0.3 : 0;
        const solveGain = state.protocol === 'solve' ? 0.4 : 0;

        // Apply smooth transitions
        this.ambientHumGain.gain.linearRampToValueAtTime(ambientGain, rampTime);
        this.solveHeartbeatGain.gain.linearRampToValueAtTime(solveGain, rampTime);
    }

    public resumeContext() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(console.error);
        }
    }

    public setMuted(muted: boolean) {
        this.masterGain.gain.linearRampToValueAtTime(muted ? 0 : 1, this.audioContext.currentTime + 0.1);
    }
    
    public playNotificationSound() {
        this.resumeContext();
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
        osc.connect(gain).connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.1);
    }

    public destroy() {
        this.activeSources.forEach(source => {
            try {
                source.stop();
                source.disconnect();
            } catch (e) {
                console.warn("Could not stop or disconnect audio source.", e);
            }
        });
        if (this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(console.error);
        }
    }
}