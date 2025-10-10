// =================================================================================================
// --- ORACLE'S VOICE (SPEECH SYNTHESIS) ---
// This service encapsulates the browser's SpeechSynthesis API to provide an audible voice
// for the Oracle's responses, enhancing the immersive experience.
// =================================================================================================

class SpeechEngine {
    private synth: SpeechSynthesis | null = null;
    private voice: SpeechSynthesisVoice | null = null;
    private isReady: Promise<void>;

    constructor() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            this.isReady = new Promise(resolve => {
                const loadVoices = () => {
                    const voices = this.synth!.getVoices();
                    if (voices.length > 0) {
                        this.voice = voices.find(v => v.name === 'Google UK English Female') ||
                                     voices.find(v => v.lang === 'en-GB' && v.name.includes('Female')) ||
                                     voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) ||
                                     voices.find(v => v.lang.startsWith('en-')) ||
                                     voices[0];
                        resolve();
                    }
                };

                if (this.synth.getVoices().length > 0) {
                    loadVoices();
                } else {
                    this.synth.onvoiceschanged = loadVoices;
                }
            });
        } else {
            this.isReady = Promise.reject("Speech synthesis not supported.");
        }
    }

    public async speak(text: string): Promise<void> {
        await this.isReady;
        if (!this.synth || !text) return;

        return new Promise((resolve, reject) => {
            if (this.synth!.speaking) {
                this.synth!.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            if (this.voice) {
                utterance.voice = this.voice;
            }
            utterance.pitch = 0.9;
            utterance.rate = 0.9;
            utterance.volume = 1.0;
            
            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(event.error);

            this.synth!.speak(utterance);
        });
    }

    public cancel(): void {
        if (this.synth && this.synth.speaking) {
            this.synth.cancel();
        }
    }
}

export const speechEngine = new SpeechEngine();