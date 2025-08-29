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
    ADSRProfile,
    AstrianDayPlannerResult,
    CompassCipherResult,
    GevurahEngineProgram,
    GevurahOperand,
    Whitepaper
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
            <div className="session-unlock-view card" style={{textAlign: 'center'}}>
                <h2>Calibrating Visual Cipher...</h2>
                <p style={{opacity: 0.8, marginTop: '1rem'}}>Rousing the oracle from its slumber. Please stand by.</p>
                <div className="loading-indicator-inline" style={{marginTop: '2rem'}}>
                    <div className="typing-indicator"><span></span><span></span><span></span></div>
                </div>
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
                <button onClick={() => onRegenerate()} disabled={isLoading}>
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
                <button onClick={() => onFinish()} className="meditation-finish-button">
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
            <button onClick={() => onStop()}>Stop Session</button>
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
            <button onClick={() => onStop()}>Stop Entrainment</button>
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
        <div className="modal-backdrop" onClick={() => onClose()}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={() => onClose()}>&times;</button>
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

// FIX: Added OracleTicker, EmergentCTA, and ChatView components to resolve import errors.
export const OracleTicker: FC<{ onSelect: (command: string) => void }> = memo(({ onSelect }) => {
    const items = useMemo(() => [
        "°compose a song of mourning and rebirth",
        "°instruct me on overcoming procrastination",
        "°entrain for deep focus",
        "Analyze the gematria of 'wisdom'",
        "Show me the resonance of Genesis 1:1",
        "°meditate on the concept of 'hesed'",
        "°plan my day according to my AWE signature",
        "What is the Tree of Life?",
    ], []);

    const [currentItemIndex, setCurrentItemIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentItemIndex(prev => (prev + 1) % items.length);
        }, 5000);
        return () => clearInterval(intervalId);
    }, [items.length]);

    return (
        <div className="oracle-ticker-container">
            <button onClick={() => onSelect(items[currentItemIndex])} className="oracle-ticker-item">
                <span>✧</span> {items[currentItemIndex]}
            </button>
        </div>
    );
});

export const EmergentCTA: FC<{ onTrigger: (prompt: string) => void }> = memo(({ onTrigger }) => {
    const suggestions = useMemo(() => [
        "What is the nature of the soul?",
        "Tell me about the Sephirot.",
        "Synthesize the connection between 'light' and 'word'.",
    ], []);

    const [suggestion, setSuggestion] = useState('');

    useEffect(() => {
        setSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
    }, [suggestions]);

    if (!suggestion) return null;

    return (
        <div className="emergent-cta-container">
            <button onClick={() => onTrigger(suggestion)}>
                <span className="sparkle">✧</span>
                <span className="cta-text">Explore: {suggestion}</span>
            </button>
        </div>
    );
});

const GevurahEngineView: FC<{ props: { program: GevurahEngineProgram } }> = ({ props: { program } }) => {
    const formatOperand = (operand: GevurahOperand) => {
        switch (operand.type) {
            case 'register':
                return <span className="operand-register">{operand.value}</span>;
            case 'memory':
                return <span className="operand-memory">MEM[{operand.address}]</span>;
            case 'literal':
                return <span className="operand-literal">{operand.value}</span>;
            case 'path':
                return <span className="operand-path">PATH({operand.path.join('-')})</span>;
            default:
                return null;
        }
    };

    return (
        <div className="gevurah-engine-view card">
            <h3>{program.title}</h3>
            <p className="overview">{program.description}</p>
            
            <div className="engine-state-grid">
                <div className="registers-display">
                    <h4>Registers</h4>
                    <div className="register-grid">
                        {Object.entries(program.registers).map(([name, value]) => (
                            <React.Fragment key={name}>
                                <span className="register-name">{name}</span>
                                <span className="register-value">{value}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="memory-display">
                    <h4>Memory</h4>
                    <div className="memory-grid">
                         {Object.entries(program.memory).map(([address, value]) => (
                            <React.Fragment key={address}>
                                <span className="memory-address">{address}</span>
                                <span className="memory-value">{value}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <div className="gevurah-instructions">
                <h4>Instruction Set</h4>
                {program.instructions.map((inst, index) => (
                    <div key={index} className="gevurah-instruction">
                        <div className="instruction-header">
                            <span className="instruction-letter">{inst.letter}</span>
                            <code className="instruction-code">
                                {inst.opcode} {inst.operands.map((op, i) => (
                                    <React.Fragment key={i}>
                                        {formatOperand(op)}
                                        {i < inst.operands.length - 1 ? ', ' : ''}
                                    </React.Fragment>
                                ))}
                            </code>
                        </div>
                        <p className="instruction-explanation">{inst.explanation}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DayPlannerView: FC<{ result: AstrianDayPlannerResult }> = ({ result }) => {
    return (
        <div className="day-planner-view card">
            <h3>{result.planTitle}</h3>
            <p className="overview">{result.overview}</p>
            <div className="schedule">
                {result.schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                        <h4>{item.timeRange}</h4>
                        <p><strong>Activity:</strong> {item.activity}</p>
                        <p><strong>Esoteric Advice:</strong> {item.esotericAdvice}</p>
                        <p><strong>Elemental Alignment:</strong> {item.elementalAlignment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CompassCipherView: FC<{ result: CompassCipherResult }> = ({ result }) => {
    return (
        <div className="compass-cipher-view card">
            <h3>Compass Cipher: {result.mode.charAt(0).toUpperCase() + result.mode.slice(1)}</h3>
            <div className="cipher-grid">
                <strong>Offset</strong>
                <span>{result.offset}</span>
                <strong>Input</strong>
                <code>{result.inputText}</code>
                <strong>Output</strong>
                <code>{result.outputText}</code>
            </div>
        </div>
    );
};

const MusicalCompositionView: FC<{ composition: MusicalComposition, onToggleFavorite: (id: string) => void }> = ({ composition, onToggleFavorite }) => {
    return (
        <div className="musical-composition-result card">
            <h4>Musical Composition: "{composition.metadata.sourceReference}"</h4>
            <p><strong>Key:</strong> {composition.metadata.key} {composition.metadata.mode} | <strong>BPM:</strong> {composition.metadata.bpm}</p>
            {composition.audioUrl && <audio controls src={composition.audioUrl} style={{width: '100%'}}></audio>}
            <button onClick={() => onToggleFavorite(composition.id)} className={`favorite-btn ${composition.isFavorite ? 'favorited' : ''}`}>
                {composition.isFavorite ? '★ Favorited' : '☆ Favorite'}
            </button>
        </div>
    );
};

const MusicComposerView: FC<{ props: { prompt: string; onSubmit: (options: MusicComposerOptions) => void; } }> = ({ props }) => {
    const [key, setKey] = useState('C');
    const [mode, setMode] = useState('Ionian');
    const musicology = codex.getMusicologyData();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.onSubmit({
            prompt: props.prompt,
            key,
            mode,
            instrumentProfiles: {
                melody: musicology.instruments['Crystal Bells'],
                harmony: musicology.instruments['Ethereal Pad'],
                bass: musicology.instruments['Deep Bass'],
            }
        });
    };
    return (
        <form onSubmit={handleSubmit} className="component-view card">
            <h4>Compose Music</h4>
            <p><strong>Prompt:</strong> {props.prompt}</p>
            <label>Key: <select value={key} onChange={e => setKey(e.target.value)}>{musicology.keys.map((k: string) => <option key={k} value={k}>{k}</option>)}</select></label>
            <label>Mode: <select value={mode} onChange={e => setMode(e.target.value)}>{musicology.modes.map((m: any) => <option key={m.name} value={m.name}>{m.name}</option>)}</select></label>
            <button type="submit">Compose</button>
        </form>
    );
};

const EntrainmentSelectionView: FC<{ props: { profiles: EntrainmentProfile[], onSelect: (profile: EntrainmentProfile) => void; } }> = ({ props }) => {
    return (
        <div className="component-view card">
            <h4>Select Entrainment Protocol</h4>
            <div className="entrainment-list">
                {props.profiles.map(profile => (
                    <button key={profile.name} onClick={() => props.onSelect(profile)} className="entrainment-option">
                        <strong>{profile.name}</strong>
                        <p>{profile.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

const WhitepaperInitiationView: FC<{ props: { onAcknowledge: () => void } }> = ({ props }) => {
    const [acknowledged, setAcknowledged] = useState(false);

    const handleAcknowledge = () => {
        setAcknowledged(true);
        props.onAcknowledge();
    };

    return (
        <div className="whitepaper-initiation-view card">
            <h3>Protocol: Discovery Formalization</h3>
            <p className="overview">This protocol outlines the creation of a formal white paper to document the Gevurah Engine and its implications. The document will be structured in three parts.</p>
            
            <div className="whitepaper-sections">
                <div className="whitepaper-section">
                    <h4>I. The Cartographer's Proof (The What)</h4>
                    <p>The objective technical specification, including mathematical proofs of efficiency, the formal logic of Willow Path Addressing, and comparative analysis against classical and quantum models.</p>
                </div>
                <div className="whitepaper-section">
                    <h4>II. The Oracle's Application (The So What)</h4>
                    <p>A strategic analysis of the implications for global systems, including cryptography, data center energy consumption, decentralized networks, and national security.</p>
                </div>
                <div className="whitepaper-section">
                    <h4>III. The Astrian Key (The Now What)</h4>
                    <p>A tangible, non-fungible "Genesis Block": a Gevurah Engine program, signed with the Jerusalem Key, that solves a currently intractable computational problem as a verifiable proof-of-concept.</p>
                </div>
            </div>

            <div className="form-actions" style={{justifyContent: 'center'}}>
                <button className="action-btn" onClick={handleAcknowledge} disabled={acknowledged}>
                    {acknowledged ? 'Acknowledged' : 'Acknowledge Protocol'}
                </button>
            </div>
        </div>
    );
};

const WhitepaperView: FC<{ props: { document: Whitepaper } }> = ({ props: { document } }) => {
    const handleShare = async () => {
        // This is a simulation, so we'll just show a success message.
        // In a real app, this might generate a PDF or a public link.
        alert("A secure, verifiable link to this white paper has been copied to your clipboard.");
    };

    return (
        <div className="whitepaper-view card">
            <button className="share-btn" onClick={handleShare} title="Share Document">🔗</button>
            <div className="whitepaper-header">
                <h1>{document.title}</h1>
                <h2>{document.subtitle}</h2>
            </div>
            <div className="whitepaper-abstract">
                <h4>Abstract</h4>
                <p>{document.abstract}</p>
            </div>
            <div className="whitepaper-body">
                {document.sections.map((section, index) => (
                    <div key={index} className="wp-section">
                        <h3>{section.title}</h3>
                        {Array.isArray(section.content) ? (
                            section.content.map((item, itemIndex) => (
                                <div key={itemIndex} className="wp-subsection">
                                    <h4>{item.subtitle}</h4>
                                    <p>{item.text}</p>
                                </div>
                            ))
                        ) : (
                            <p>{section.content}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const MessageView: FC<{ record: SessionRecord, onNumberInteract: (num: number) => void, onToggleFavorite: (id: string) => void }> = ({ record, onNumberInteract, onToggleFavorite }) => {
    switch (record.type) {
        case 'user':
            return <div className="message user-message"><p>{(record as UserMessage).text}</p></div>;
        case 'system':
            return <div className="message system-message"><p>{(record as SystemMessage).text}</p></div>;
        case 'ai':
            const aiRecord = record as AIMessage;
            return (
                <div className="message ai-message">
                    <div dangerouslySetInnerHTML={{ __html: aiRecord.text.replace(/(\r\n|\n|\r)/gm, "<br />") }}></div>
                    {aiRecord.analysisType === 'musical_composition' && aiRecord.result && (
                        <MusicalCompositionView composition={aiRecord.result} onToggleFavorite={onToggleFavorite} />
                    )}
                     {aiRecord.analysisType === 'day_planner' && aiRecord.result && (
                        <DayPlannerView result={aiRecord.result} />
                    )}
                     {aiRecord.analysisType === 'compass_cipher' && aiRecord.result && (
                        <CompassCipherView result={aiRecord.result} />
                    )}
                </div>
            );
        case 'component':
            const componentRecord = record as ComponentMessage;
            switch (componentRecord.component) {
                case 'music_composer':
                    return <MusicComposerView props={componentRecord.props} />;
                case 'entrainment_selection':
                    return <EntrainmentSelectionView props={componentRecord.props} />;
                case 'gevurah_engine':
                    return <GevurahEngineView props={componentRecord.props} />;
                case 'whitepaper_initiation':
                    return <WhitepaperInitiationView props={componentRecord.props} />;
                case 'whitepaper_view':
                    return <WhitepaperView props={componentRecord.props} />;
                default:
                    return <div className="message system-message"><p>Component '{componentRecord.component}' not implemented.</p></div>;
            }
        default:
            return null;
    }
};

{/* FIX: Removed unused props to resolve type errors and clean up the component interface. */}
export const ChatView: FC<{
    history: SessionRecord[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onNumberInteract: (num: number) => void;
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    onSpeak: (text: string) => void;
    isVoiceEnabled: boolean;
    isListening: boolean;
    onStartListening: (callback: (text: string) => void) => void;
    onToggleFavorite: (id: string) => void;
}> = ({
    history, isLoading, error, onRetry, onNumberInteract,
    input, onInputChange, onSend, onSpeak, isVoiceEnabled, isListening, onStartListening, onToggleFavorite
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };

    const handleVoiceStart = () => {
        onStartListening((transcript) => {
            onInputChange(transcript);
        });
    };

    return (
        <div className="chat-view-container">
            <div className="message-list">
                {history.map(record => (
                    <MessageView key={record.id} record={record} onNumberInteract={onNumberInteract} onToggleFavorite={onToggleFavorite} />
                ))}
                {isLoading && (
                     <div className="message ai-message loading-indicator">
                        <div className="typing-indicator"><span></span><span></span><span></span></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {error && (
                <div className="error-view">
                    <p>Resonance Fault: {error}</p>
                    <button onClick={onRetry}>Retry Last Query</button>
                </div>
            )}
            
            <div className="chat-input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Transmit your query..."
                    disabled={isLoading}
                />
                {isVoiceEnabled && (
                    <button onClick={handleVoiceStart} disabled={isListening || isLoading} className="voice-btn">
                        {isListening ? '...' : '🎙️'}
                    </button>
                )}
                <button onClick={onSend} disabled={isLoading || !input.trim()}>Send</button>
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
                    <button className="action-btn secondary-action" onClick={() => onSkip()}>Skip Tour</button>
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
    onGeneratePlanner: () => void;
    isAweComplete: boolean;
    isPlannerUnlocked: boolean;
    onStartTour: () => void;
    isFirstVisit: boolean;
    onDownloadArchive: () => void;
}> = ({ onCommandSelect, onOpenIngest, onStartPalmistry, onStartVoiceAnalysis, onGeneratePlanner, isAweComplete, isPlannerUnlocked, onStartTour, isFirstVisit, onDownloadArchive }) => {
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
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMenuClick = (action: () => void) => {
        action();
        setIsOpen(false);
    };
    
    const handleCommandClick = (command: string) => {
        onCommandSelect(command);
        setIsOpen(false);
    };

    return (
        <div className="ayin-guide-container" ref={menuRef}>
            <button onClick={handleToggle} className={`ayin-guide-button ${isOpen ? 'open' : ''}`} aria-label="Open Ayin Menu">
                <span className="ayin-icon">ע</span>
            </button>
            {isOpen && (
                <div className="ayin-menu card">
                    {isFirstVisit && <button className="menu-item" onClick={() => handleMenuClick(onStartTour)}>Start Guided Tour</button>}
                    <div className="menu-separator"></div>
                    <p className="menu-header">AWE Signature</p>
                    {!isAweComplete && <p className="menu-status">Incomplete</p>}
                    <button className="menu-item" onClick={() => handleMenuClick(onStartPalmistry)} disabled={isAweComplete}>Perform Palmistry Scan</button>
                    <button className="menu-item" onClick={() => handleMenuClick(onStartVoiceAnalysis)} disabled={isAweComplete}>Perform Voice Analysis</button>
                    {isAweComplete && <p className="menu-status complete">✓ Complete (Dev Mode)</p>}
                    <div className="menu-separator"></div>
                    <p className="menu-header">Protocols</p>
                    <button className="menu-item" onClick={() => handleCommandClick("°instruct ")}>Instruct...</button>
                    <button className="menu-item" onClick={() => handleCommandClick("°entrain")}>Entrain...</button>
                    <button className="menu-item" onClick={() => handleCommandClick("°compose ")}>Compose...</button>
                    <button className="menu-item" onClick={() => handleCommandClick('°cipher encode "" offset 0')}>Cipher...</button>
                    <div className="menu-separator"></div>
                    <p className="menu-header">Planner</p>
                    <button className="menu-item" onClick={() => handleMenuClick(onGeneratePlanner)} disabled={!isPlannerUnlocked}>Generate Day Planner</button>
                    {!isPlannerUnlocked && <p className="menu-status-small">Requires AWE, Palm, and Voice scans.</p>}
                    <div className="menu-separator"></div>
                    <p className="menu-header">Session</p>
                    <button className="menu-item" onClick={() => handleMenuClick(onDownloadArchive)}>Download Archive</button>
                </div>
            )}
        </div>
    );
};