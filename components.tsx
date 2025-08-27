import React, { useState, useMemo, useEffect, useRef, useCallback, memo, FC, ReactNode } from 'react';
import * as htmlToImage from 'html-to-image';
import { AudioService } from './services';
import { codex } from './codex';
import {
    GematriaAnalysis, DeepELSAnalysisResult, AWEFormData,
    EntrainmentProfile, SessionRecord, Toast, AIMessage, ComponentMessage, UserMessage, SystemMessage,
    GuidingIntent, StrongsEntry,
    MusicalComposition,
    VisualChallenge,
    AttunementResult,
    InstructionalCompositionSession,
    ActiveEntrainmentSession,
    MusicComposerOptions,
    InstrumentProfile,
    ADSRProfile
} from './types';

// =================================================================================================
// --- NEWLY ADDED COMPONENTS TO FIX ERRORS & ADD FEATURES ---
// =================================================================================================

// Fix: Added StelaCalibrationView component
export const StelaCalibrationView: FC<{ statusText: string; subText: string }> = ({ statusText, subText }) => (
    <div className="stela-calibration-view">
        <div className="calibration-content">
            <h1>ASTRIAN KEY</h1>
            <div className="calibration-status">{statusText}</div>
            <div className="calibration-subtext">{subText}</div>
            <div className="loading-glyph">✧</div>
        </div>
    </div>
);

// Fix: Added KaleidoscopicBackground component
export const KaleidoscopicBackground: FC<{ resonance: number }> = memo(({ resonance }) => {
    const style = {
        '--seed': resonance,
        animationDuration: `${20 + (resonance % 10)}s`,
    } as React.CSSProperties;

    return <div className="kaleidoscopic-background" style={style}></div>;
});

// Fix: Added SubliminalGlyph component
export const SubliminalGlyph: FC<{ seed: number }> = memo(({ seed }) => {
    const characters = 'אבגדהוזחטיכלמנסעפצקרשת';
    const char = characters[seed % characters.length];

    return (
        <div className="subliminal-glyph" aria-hidden="true">
            {char}
        </div>
    );
});

// Fix: Added ToastContainer component and its child
const ToastComponent: FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast, onDismiss]);

    return (
        <div className={`toast toast-${toast.type}`} onClick={() => onDismiss(toast.id)}>
            <p>{toast.message}</p>
            <button className="toast-dismiss">&times;</button>
        </div>
    );
};

export const ToastContainer: FC<{ toasts: Toast[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <ToastComponent key={toast.id} toast={toast} onDismiss={onDismiss} />
            ))}
        </div>
    );
};

// Fix: Added SessionUnlockView component
export const SessionUnlockView: FC<{
    onUnlock: (selectedPrompts: string[]) => void;
    challenge: VisualChallenge | null;
    isLoading: boolean;
    onRegenerate: () => void;
}> = ({ onUnlock, challenge, isLoading, onRegenerate }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const toggleSelection = (prompt: string) => {
        setSelected(prev => {
            if (prev.includes(prompt)) {
                return prev.filter(p => p !== prompt);
            }
            if (prev.length < 3) {
                return [...prev, prompt];
            }
            return prev;
        });
    };

    const handleUnlock = () => {
        if (selected.length === 3) {
            onUnlock(selected);
        }
    };

    if (!challenge) {
        return (
            <div className="session-unlock-view">
                <h2>Generating Visual Cipher...</h2>
                <div className="loading-spinner"></div>
            </div>
        );
    }
    
    return (
        <div className="session-unlock-view">
            <div className="unlock-header">
                <h2>AWE Signature Confirmation</h2>
                <p>Select the three images that correspond to your Visual Cipher concepts to unlock the session.</p>
            </div>
            <div className="challenge-grid">
                {challenge.images.map(({ url, prompt }, index) => (
                    <div
                        key={index}
                        className={`challenge-image-container ${selected.includes(prompt) ? 'selected' : ''}`}
                        onClick={() => toggleSelection(prompt)}
                    >
                        <img src={url} alt={`Visual challenge option ${index + 1}`} />
                        <div className="selection-overlay">✔</div>
                    </div>
                ))}
            </div>
            <div className="unlock-controls">
                <button onClick={onRegenerate} disabled={isLoading}>
                    Regenerate Cipher
                </button>
                <button onClick={handleUnlock} disabled={isLoading || selected.length !== 3}>
                    {isLoading ? 'Verifying...' : 'Unlock Session'}
                </button>
            </div>
        </div>
    );
};

// Fix: Added MeditationView component
export const MeditationView: FC<{
    script: string;
    imagePrompts: string[];
    onFinish: () => void;
}> = ({ script, imagePrompts, onFinish }) => {
    const formattedScript = useMemo(() => {
        let tempScript = script;
        imagePrompts.forEach((prompt, index) => {
            tempScript = tempScript.replace(`[GENERATE_IMAGE: ${prompt}]`, `<div class="meditation-image-prompt">Image Prompt ${index + 1}: "${prompt}"</div>`);
        });
        return tempScript.replace(/\n/g, '<br />');
    }, [script, imagePrompts]);

    return (
        <div className="meditation-view">
            <div className="meditation-content">
                <div className="meditation-script" dangerouslySetInnerHTML={{ __html: formattedScript }} />
                <button onClick={onFinish} className="meditation-finish-button">
                    Conclude Meditation
                </button>
            </div>
        </div>
    );
};

// Fix: Added helper component for audio visualization
const AudioVisualizer: FC<{ analyserNode: AnalyserNode }> = ({ analyserNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        analyserNode.fftSize = 256;
        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animationFrameId: number;

        const draw = () => {
            animationFrameId = requestAnimationFrame(draw);
            analyserNode.getByteFrequencyData(dataArray);
            canvasCtx.fillStyle = 'rgb(10, 10, 20)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                const r = barHeight + (25 * (i/bufferLength));
                const g = 250 * (i/bufferLength);
                const b = 50;
                canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
                canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
        };
        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [analyserNode]);

    return <canvas ref={canvasRef} className="audio-visualizer"></canvas>;
};

// Fix: Added InstructionalCompositionView component
export const InstructionalCompositionView: FC<{
    session: InstructionalCompositionSession;
    onStop: () => void;
}> = ({ session, onStop }) => {
    return (
        <div className="instructional-composition-view">
            <h2>Instructional Composition</h2>
            <div className="composition-details">
                <p><strong>Core Emotion:</strong> {session.coreEmotion}</p>
                <p><strong>Symbolic Mantra:</strong> {session.symbolicMantra}</p>
            </div>
            <AudioVisualizer analyserNode={session.analyserNode} />
             <audio src={session.audioUrl} autoPlay controls loop />
            <button onClick={onStop}>Stop Session</button>
        </div>
    );
};

// Fix: Added EntrainmentView component
export const EntrainmentView: FC<{
    session: ActiveEntrainmentSession;
    onStop: () => void;
}> = ({ session, onStop }) => {
    return (
        <div className="entrainment-view">
            <h2>Brainwave Entrainment Active</h2>
            <div className="entrainment-details">
                <h3>{session.profile.name}</h3>
                <p>{session.profile.description}</p>
                <p><strong>Frequencies:</strong> {session.profile.baseFrequency}Hz & {session.profile.baseFrequency + session.profile.targetFrequency}Hz (Target: {session.profile.targetFrequency}Hz)</p>
            </div>
            <div className="pulsing-orb-container">
                <div className="pulsing-orb" style={{ animationDuration: `${1 / session.profile.targetFrequency}s` }}></div>
            </div>
            <button onClick={onStop}>Stop Entrainment</button>
        </div>
    );
};

// Fix: Added CrossReferenceModal component
export const CrossReferenceModal: FC<{
    value: number;
    history: SessionRecord[];
    onClose: () => void;
    onSynthesize: (num: number) => void;
    isSynthesizing: boolean;
    synthesisResult: string | null;
}> = ({ value, history, onClose, onSynthesize, isSynthesizing, synthesisResult }) => {
    
    const relatedEntries = useMemo(() => {
        return history.filter(item => JSON.stringify(item).includes(String(value))).slice(0, 5);
    }, [history, value]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h2>Cross-Reference: {value}</h2>
                <div className="modal-section">
                    <h3>Related History</h3>
                    {relatedEntries.length > 0 ? (
                        <ul>
                            {relatedEntries.map(entry => (
                                <li key={entry.id}>
                                    <strong>[{entry.type.toUpperCase()}]</strong>: {JSON.stringify(entry).substring(0, 100)}...
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No direct references found in recent history.</p>
                    )}
                </div>
                <div className="modal-section">
                    <h3>Synthesize Connections</h3>
                    {synthesisResult ? (
                        <div className="synthesis-result">
                            <p>{synthesisResult}</p>
                        </div>
                    ) : (
                        <button onClick={() => onSynthesize(value)} disabled={isSynthesizing}>
                            {isSynthesizing ? 'Synthesizing...' : `Synthesize for ${value}`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// New: Add GuidedTour Component
const TOUR_STEPS = [
    {
        title: "Welcome to the Astrian Key",
        text: "I am Ayin. It's a pleasure to connect. I will be your guide through this system, which acts as a bridge between language, number, and consciousness. Let's begin.",
        selector: ".chat-view-container",
        speech: "Welcome to the Astrian Key. I am Ayin. It's a pleasure to connect. I will be your guide through this system, which acts as a bridge between language, number, and consciousness. Let's begin."
    },
    {
        title: "The Oracle Ticker",
        text: "Above, you'll find the Oracle Ticker. It constantly streams esoteric questions and command prompts. Click any of them to begin an inquiry.",
        selector: ".oracle-ticker-container",
        speech: "Above, you'll find the Oracle Ticker. It constantly streams esoteric questions and command prompts. Click any of them to begin an inquiry."
    },
    {
        title: "Your Query Terminal",
        text: "This is your primary interface. You can type any question or command here. Try asking about the 'Tree of Life' or the number '137'.",
        selector: ".chat-input-area",
        speech: "This is your primary interface. You can type any question or command here. Try asking about the Tree of Life, or the number 137."
    },
    {
        title: "AWE Signature & Ayin",
        text: "This is me. To unlock my full vocal capabilities and advanced protocols like personalized meditations, you'll need to complete your AWE signature. This attunes the system to your unique resonance.",
        selector: ".ayin-guide-container",
        speech: "This is me. To unlock my full vocal capabilities and advanced protocols, you'll need to complete your AWE signature. This attunes the system to your unique resonance."
    },
    {
        title: "Let's Begin",
        text: "That's the basics. The system is now yours to explore. Remember, every query is a step on a path. Where will you go?",
        selector: ".app-content-wrapper",
        speech: "That's the basics. The system is now yours to explore. Remember, every query is a step on a path. Where will you go?"
    }
];

export const GuidedTour: FC<{
    step: number;
    onNext: (step: number) => void;
    onSkip: () => void;
    speak: (text: string) => void;
}> = ({ step, onNext, onSkip, speak }) => {
    const currentStep = TOUR_STEPS[step];
    const targetRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if(currentStep?.speech) {
            setTimeout(() => speak(currentStep.speech), 300);
        }
    }, [step, speak, currentStep]);
    
    useEffect(() => {
        document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
        if (currentStep && currentStep.selector) {
            try {
                targetRef.current = document.querySelector(currentStep.selector);
                targetRef.current?.classList.add('tour-highlight');
            } catch (e) {
                console.error("Tour selector failed:", currentStep.selector, e);
            }
        }
        return () => {
             targetRef.current?.classList.remove('tour-highlight');
        }
    }, [step, currentStep]);


    if (!currentStep) return null;

    const isLastStep = step === TOUR_STEPS.length - 1;

    return (
        <div className="tour-overlay">
            <div className="tour-card card">
                <h3>{currentStep.title}</h3>
                <p>{currentStep.text}</p>
                <div className="form-actions tour-actions">
                    <button className="action-btn secondary-action" onClick={onSkip}>Skip Tour</button>
                    <button className="action-btn" onClick={() => isLastStep ? onSkip() : onNext(step + 1)}>
                        {isLastStep ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// Update: AyinGuide now an interactive menu
export const AyinGuide: FC<{
    onCommandSelect: (command: string) => void;
    onOpenIngest: () => void;
    onStartPalmistry: () => void;
    onStartVoiceAnalysis: () => void;
    isAweComplete: boolean;
    isPlannerUnlocked: boolean;
    onStartTour: () => void;
    isFirstVisit: boolean;
}> = ({ onCommandSelect, onOpenIngest, onStartPalmistry, onStartVoiceAnalysis, isAweComplete, isPlannerUnlocked, onStartTour, isFirstVisit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => setIsOpen(prev => !prev);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                const guideButton = document.querySelector('.ayin-guide-container');
                if (guideButton && !guideButton.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { label: 'Forge Composition', action: () => onCommandSelect('°compose '), isVisible: true, isDisabled: false, description: 'Open the Musical Composition Forge.' },
        { label: 'Open Ingest View', action: onOpenIngest, isVisible: true, isDisabled: true, description: 'This feature is not yet implemented.' },
        { label: 'Start Palmistry Scan', action: onStartPalmistry, isVisible: true, isDisabled: !isAweComplete, description: 'Requires a complete AWE signature.' },
        { label: 'Start Voice Analysis', action: onStartVoiceAnalysis, isVisible: true, isDisabled: !isAweComplete, description: 'Requires a complete AWE signature.' },
        { label: 'Plan My Day', action: () => onCommandSelect('°plan my day'), isVisible: true, isDisabled: !isPlannerUnlocked, description: 'Requires AWE signature, palmistry, and voice analysis.' },
        { label: 'Retake Guided Tour', action: onStartTour, isVisible: !isFirstVisit, isDisabled: false, description: 'Review the application introduction.' }
    ];


    return (
        <div ref={menuRef}>
            <div className="ayin-guide-container" onClick={handleToggle} aria-haspopup="true" aria-expanded={isOpen} role="button" aria-label="Open Ayin Guide Menu">
                <span>ע</span>
            </div>
            {isOpen && (
                <div className="ayin-menu-container">
                    <div className="card">
                        <p className="ayin-intro">Select a protocol or data source.</p>
                        <div className="call-sign-menu">
                            {menuItems.map(item => item.isVisible && (
                                <button
                                    key={item.label}
                                    onClick={() => {
                                        item.action();
                                        setIsOpen(false);
                                    }}
                                    disabled={item.isDisabled}
                                    title={item.isDisabled ? item.description : undefined}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


// --- NEW HELPER: AudioPlayerWithVisualizer ---
const AudioPlayerWithVisualizer: FC<{ src: string }> = ({ src }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number | undefined>();

    const draw = useCallback(() => {
        const analyser = analyserRef.current;
        const canvas = canvasRef.current;
        if (!analyser || !canvas) return;

        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(12, 10, 29, 0.5)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            const r = 92 + (barHeight / 2);
            const g = 149 + (barHeight / 2);
            const b = 230 + (barHeight / 2);
            canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }

        animationFrameRef.current = requestAnimationFrame(draw);
    }, []);

    const setupAudioContext = useCallback(() => {
        if (!audioRef.current) return;

        if (!audioContextRef.current) {
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            
            analyserRef.current = audioContext.createAnalyser();
            analyserRef.current.fftSize = 256;

            sourceRef.current = audioContext.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContext.destination);
        }

        if (animationFrameRef.current === undefined) {
            draw();
        }
    }, [draw]);

    const handlePauseOrEnd = useCallback(() => {
        if (animationFrameRef.current !== undefined) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = undefined;
        }
    }, []);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current !== undefined) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            audioContextRef.current?.close().catch(e => console.error("Error closing AudioContext:", e));
        };
    }, []);

    return (
        <div className="audio-player-container">
            <canvas ref={canvasRef} width="300" height="80"></canvas>
            {/* FIX: The onPlay, onPause, and onEnded event handlers were passed directly, creating a mismatch between the expected arguments (React SyntheticEvent) and the function definitions (no arguments). Wrapping them in arrow functions ensures they are called correctly without arguments. */}
            <audio ref={audioRef} src={src} controls onPlay={() => setupAudioContext()} onPause={() => handlePauseOrEnd()} onEnded={() => handlePauseOrEnd()}></audio>
        </div>
    );
};


// --- NEW COMPONENT: MusicalCompositionView ---
const MusicalCompositionView: FC<{ composition: MusicalComposition, onToggleFavorite: (id: string) => void }> = ({ composition, onToggleFavorite }) => {
    return (
        <div className="card musical-composition-view">
            <div className="composition-header">
                <h4>Composition: {composition.metadata.sourceReference}</h4>
                <button 
                    className={`favorite-btn ${composition.isFavorite ? 'favorited' : ''}`}
                    onClick={() => onToggleFavorite(composition.id)}
                    aria-label={composition.isFavorite ? 'Unfavorite composition' : 'Favorite composition'}
                >
                    ★
                </button>
            </div>
            <p><strong>Key:</strong> {composition.metadata.key} {composition.metadata.mode} | <strong>BPM:</strong> {composition.metadata.bpm}</p>
            {composition.audioUrl && <AudioPlayerWithVisualizer src={composition.audioUrl} />}
        </div>
    );
};


// --- NEW COMPONENT: MusicComposerView ---
const MusicComposerView: FC<{ 
    prompt: string, 
    onSubmit: (options: MusicComposerOptions) => void,
}> = ({ prompt, onSubmit }) => {
    const musicologyData = useMemo(() => codex.getMusicologyData() || { keys: [], modes: [], instruments: {} }, []);
    const { keys, modes, instruments } = musicologyData;
    const instrumentList = useMemo(() => Object.values(instruments) as InstrumentProfile[], [instruments]);

    const [key, setKey] = useState(keys[0] || 'C');
    const [mode, setMode] = useState(modes[0]?.name || 'Ionian');
    
    const [melodyInstrument, setMelodyInstrument] = useState(instrumentList[0] || {} as InstrumentProfile);
    const [harmonyInstrument, setHarmonyInstrument] = useState(instrumentList[1] || {} as InstrumentProfile);
    const [bassInstrument, setBassInstrument] = useState(instrumentList[3] || {} as InstrumentProfile);
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = () => {
        setIsSubmitted(true);
        onSubmit({
            prompt,
            key,
            mode,
            instrumentProfiles: {
                melody: melodyInstrument,
                harmony: harmonyInstrument,
                bass: bassInstrument,
            }
        });
    };
    
    const AdsrSliders: FC<{ 
        instrument: InstrumentProfile, 
        setInstrument: React.Dispatch<React.SetStateAction<InstrumentProfile>> 
    }> = ({ instrument, setInstrument }) => {
         const handleAdsrChange = (param: keyof ADSRProfile, value: number) => {
            setInstrument(prev => ({ ...prev, adsr: { ...prev.adsr, [param]: value } }));
        };
        
        if (!instrument?.adsr) return null;
        
        return (
            <div className="adsr-sliders">
                {(Object.keys(instrument.adsr) as Array<keyof ADSRProfile>).map(param => (
                    <div key={param} className="slider-control">
                        <label>{param}</label>
                        <input
                            type="range"
                            min="0.01" max="2" step="0.01"
                            value={instrument.adsr[param]}
                            onChange={(e) => handleAdsrChange(param, parseFloat(e.target.value))}
                            disabled={isSubmitted}
                        />
                        <span>{instrument.adsr[param].toFixed(2)}</span>
                    </div>
                ))}
            </div>
        )
    };
    
    return (
        <div className="card music-composer-view">
            <h4>Musical Composition Forge</h4>
            <p><strong>Prompt:</strong> "{prompt}"</p>
            
            <div className="composer-controls">
                 <div className="control-group">
                     <div className="form-field">
                        <label>Key</label>
                        <select value={key} onChange={e => setKey(e.target.value)} disabled={isSubmitted}>{keys.map((k: string) => <option key={k} value={k}>{k}</option>)}</select>
                     </div>
                     <div className="form-field">
                        <label>Mode</label>
                        <select value={mode} onChange={e => setMode(e.target.value)} disabled={isSubmitted}>{modes.map((m: {name: string}) => <option key={m.name} value={m.name}>{m.name}</option>)}</select>
                     </div>
                 </div>

                 <div className="control-group track-group">
                     <div className="form-field">
                        <label>Melody Instrument</label>
                        <select value={melodyInstrument.name} onChange={e => setMelodyInstrument(codex.getInstrumentProfile(e.target.value))} disabled={isSubmitted}>{instrumentList.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}</select>
                     </div>
                     <AdsrSliders instrument={melodyInstrument} setInstrument={setMelodyInstrument} />
                 </div>
                 
                 <div className="control-group track-group">
                     <div className="form-field">
                        <label>Harmony Instrument</label>
                        <select value={harmonyInstrument.name} onChange={e => setHarmonyInstrument(codex.getInstrumentProfile(e.target.value))} disabled={isSubmitted}>{instrumentList.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}</select>
                     </div>
                     <AdsrSliders instrument={harmonyInstrument} setInstrument={setHarmonyInstrument} />
                 </div>
                 
                 <div className="control-group track-group">
                     <div className="form-field">
                        <label>Bass Instrument</label>
                        <select value={bassInstrument.name} onChange={e => setBassInstrument(codex.getInstrumentProfile(e.target.value))} disabled={isSubmitted}>{instrumentList.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}</select>
                     </div>
                     <AdsrSliders instrument={bassInstrument} setInstrument={setBassInstrument} />
                 </div>

            </div>
            
            <div className="form-actions">
                <button className="action-btn" onClick={handleSubmit} disabled={isSubmitted}>Forge Composition</button>
            </div>
        </div>
    );
};


// Fix: ChatView component and its children
const Message: FC<{
    record: SessionRecord;
    onNumberInteract: (num: number) => void;
    onSpeak: (text: string) => void;
    isVoiceEnabled: boolean;
    onToggleFavorite: (id: string) => void;
}> = ({ record, onNumberInteract, onSpeak, isVoiceEnabled, onToggleFavorite }) => {
    
    const renderContent = (text: string) => {
        if (!text) return '';
        const parts = text.split(/(\b\d+\b)/g);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <button key={index} className="interactive-number" onClick={() => onNumberInteract(parseInt(part, 10))}>
                        {part}
                    </button>
                );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };
    
    switch (record.type) {
        case 'user':
             return <div className="chat-message user"><div className="message-bubble">{renderContent((record as UserMessage).text)}</div></div>;
        case 'ai':
            const aiMsg = record as AIMessage;
            if (aiMsg.analysisType === 'musical_composition' && aiMsg.result) {
                return (
                    <div className="chat-message ai">
                        <div className="message-bubble component-bubble">
                            <p>{renderContent(aiMsg.text)}</p>
                            <MusicalCompositionView composition={aiMsg.result} onToggleFavorite={onToggleFavorite} />
                        </div>
                    </div>
                );
            }
            return (
                <div className="chat-message ai">
                    <div className="message-bubble ai-message">
                        {renderContent(aiMsg.text)}
                        {isVoiceEnabled && aiMsg.text && (
                            <button className="speak-btn" onClick={() => onSpeak(aiMsg.text)} aria-label="Read message aloud">
                                🔊
                            </button>
                        )}
                    </div>
                </div>
            );
        case 'system':
            return <div className="chat-message system"><div className="message-bubble">{renderContent((record as SystemMessage).text)}</div></div>;
        case 'component':
            const compMsg = record as ComponentMessage;
            if (compMsg.component === 'music_composer') {
                const props = compMsg.props as { prompt: string; onSubmit: (options: MusicComposerOptions) => void; };
                return (
                    <div className="chat-message component">
                        <div className="message-bubble component-bubble">
                            <MusicComposerView {...props} />
                        </div>
                    </div>
                );
            }
            // Add other component types here as needed
            return <div className="chat-message system"><div className="message-bubble">Component message: {compMsg.component}</div></div>;
        default:
            return null;
    }
};

const ChatHistory: FC<{ 
    history: SessionRecord[]; 
    onNumberInteract: (num: number) => void;
    onSpeak: (text: string) => void;
    isVoiceEnabled: boolean;
    onToggleFavorite: (id: string) => void;
}> = memo(({ history, onNumberInteract, onSpeak, isVoiceEnabled, onToggleFavorite }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <div className="chat-history" ref={scrollRef}>
            {history.map(record => (
                <Message 
                    key={record.id} 
                    record={record} 
                    onNumberInteract={onNumberInteract}
                    onSpeak={onSpeak}
                    isVoiceEnabled={isVoiceEnabled}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
});

const LoadingIndicator = () => (
    <div className="loading-indicator">
        <span></span><span></span><span></span>
    </div>
);

const ChatInput: FC<{
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
    isListening: boolean;
    isVoiceEnabled: boolean;
    onStartListening: (callback: (text: string) => void) => void;
}> = ({ input, onInputChange, onSend, isLoading, isListening, isVoiceEnabled, onStartListening }) => {
    
    const handleVoiceResult = (transcript: string) => {
        onInputChange(transcript);
        // Automatically send after voice input
        setTimeout(() => onSend(), 100); 
    };
    
    return (
        <div className="chat-input-container">
            <input
                type="text"
                value={input}
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !isLoading && onSend()}
                placeholder="Ask, and the way shall be opened..."
                disabled={isLoading}
                aria-label="Chat input"
            />
             <button
                className={`voice-input-btn ${isListening ? 'listening' : ''}`}
                onClick={() => onStartListening(handleVoiceResult)}
                disabled={!isVoiceEnabled || isLoading}
                aria-label={isListening ? "Listening for voice input" : "Start voice input"}
            >
                🎤
            </button>
            <button onClick={() => onSend()} disabled={isLoading || !input.trim()} aria-label="Send message">
                ➢
            </button>
        </div>
    );
};

export const ChatView: FC<{
    history: SessionRecord[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    guidingIntent: GuidingIntent;
    onIntentChange: (intent: GuidingIntent) => void;
    onNumberInteract: (num: number) => void;
    addMessage: (msg: any) => void;
    aweData: AWEFormData;
    setAweData: (data: AWEFormData) => void;
    palmistryDone: boolean;
    voiceDone: boolean;
    input: string;
    onInputChange: (val: string) => void;
    onSend: () => void;
    onSpeak: (text: string) => void;
    isVoiceEnabled: boolean;
    isListening: boolean;
    onStartListening: (cb: (text: string) => void) => void;
    onToggleFavorite: (id: string) => void;
}> = (props) => {
    return (
        <div className="chat-view-container">
            <ChatHistory 
                history={props.history} 
                onNumberInteract={props.onNumberInteract} 
                onSpeak={props.onSpeak}
                isVoiceEnabled={props.isVoiceEnabled}
                onToggleFavorite={props.onToggleFavorite}
            />
            {props.isLoading && <LoadingIndicator />}
            {props.error && (
                <div className="error-message">
                    <p>Resonance Fault: {props.error}</p>
                    <button onClick={props.onRetry}>Retry</button>
                </div>
            )}
            <div className="chat-input-area">
                 <ChatInput
                     input={props.input}
                     onInputChange={props.onInputChange}
                     onSend={props.onSend}
                     isLoading={props.isLoading}
                     isListening={props.isListening}
                     isVoiceEnabled={props.isVoiceEnabled}
                     onStartListening={props.onStartListening}
                 />
            </div>
        </div>
    );
};


// --- Oracle Ticker ---
const ORACLE_ITEMS = [
    "°compose a soundtrack for lucid dreaming",
    "°instruct me to overcome procrastination",
    "°entrain for deep meditation",
    "What is the significance of the number 137?",
    "Analyze the spiritual meaning of the Challenger disaster.",
    "Show me the ELS for 'Torah' in Genesis.",
    "What is the relationship between the Hebrew alphabet and DNA?",
    "°compose a melody from the spelling of my name",
    "Tell me about the Golem of Prague.",
    "Explain the concept of Tzimtzum.",
    "°instruct me to find clarity",
    "What is the meaning of the philosopher's stone?",
];
export const OracleTicker: FC<{ onSelect: (command: string) => void }> = memo(({ onSelect }) => (
    <div className="oracle-ticker-container">
        <div className="oracle-ticker-content">
            {[...ORACLE_ITEMS, ...ORACLE_ITEMS].map((item, index) => (
                <span key={index} className="oracle-ticker-item" onClick={() => onSelect(item)}>
                    {item}
                </span>
            ))}
        </div>
    </div>
));

// --- Emergent CTA (Rabbit Hole) ---
export const EmergentCTA: FC<{ onTrigger: (query: string) => void }> = memo(({ onTrigger }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: '50%', left: '50%' });

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const showCTA = () => {
            setIsVisible(true);
            const top = `${20 + Math.random() * 60}%`;
            const left = `${20 + Math.random() * 60}%`;
            setPosition({ top, left });
            timeoutId = setTimeout(() => setIsVisible(false), 5000 + Math.random() * 5000);
        };

        const intervalId = setInterval(showCTA, 15000 + Math.random() * 15000);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="emergent-cta" style={position} onClick={() => onTrigger("Take me down the rabbit hole.")}>
            ✧
        </div>
    );
});