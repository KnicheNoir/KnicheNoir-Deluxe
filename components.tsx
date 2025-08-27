

import React, { useState, useMemo, useEffect, useRef, useCallback, memo, FC, ReactNode } from 'react';
import * as htmlToImage from 'html-to-image';
import { AudioService } from './services';
import {
    GematriaAnalysis, DeepELSAnalysisResult, AWEFormData,
    EntrainmentProfile, SessionRecord, Toast, AIMessage, ComponentMessage, UserMessage, SystemMessage,
    GuidingIntent, StrongsEntry,
    MusicalComposition,
    VisualChallenge,
    AttunementResult,
    InstructionalCompositionSession,
    ActiveEntrainmentSession
} from './types';

// =================================================================================================
// --- UTILITY & GENERIC UI COMPONENTS ---
// =================================================================================================

const LoadingIndicator: FC = () => (
    <div className="loading-indicator-inline">
        <div className="typing-indicator"><span></span><span></span><span></span></div>
        <span>Awaiting Resonance...</span>
    </div>
);

const ErrorMessage: FC<{ message: string; onRetry: () => void; }> = ({ message, onRetry }) => (
    <div className="error-message">
        <p>{message}</p>
        <button onClick={onRetry} className="action-btn error-action retry-btn">Retry</button>
    </div>
);

const CollapsibleCard: FC<{ title: string; children: ReactNode; startOpen?: boolean }> = ({ title, children, startOpen = false }) => {
    const [isOpen, setIsOpen] = useState(startOpen);
    return (
        <div className={`card collapsible-card ${isOpen ? 'open' : ''}`}>
            <div className="collapsible-title" onClick={() => setIsOpen(!isOpen)}>
                <h4>{title}</h4>
                <span className="collapsible-icon">▾</span>
            </div>
            <div className="content-container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
};

// =================================================================================================
// --- BACKGROUND & VISUALS ---
// =================================================================================================

export const StelaCalibrationView: FC<{ statusText: string, subText: string }> = ({ statusText, subText }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let frame = 0;
        let animFrameId: number;
        const draw = () => {
            frame++;
            const time = frame * 0.02;
            ctx.clearRect(0, 0, 300, 300);
            ctx.strokeStyle = 'rgba(180, 212, 255, 0.5)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                const rotation = time * (i % 2 === 0 ? 0.1 : -0.1);
                ctx.arc(150, 150, 20 + i * 20, rotation + i, rotation + i + Math.PI);
                ctx.stroke();
            }
            animFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animFrameId);
    }, []);

    return (
        <div className="stela-calibration-container">
            <canvas ref={canvasRef} width="300" height="300" className="stela-canvas"></canvas>
            <h2 className="stela-status-text">{statusText}</h2>
            {subText && <p className="calibration-subtext">{subText}</p>}
        </div>
    );
};

export const KaleidoscopicBackground: FC<{ resonance: number }> = memo(({ resonance }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl', { antialias: true, powerPreference: 'low-power' });
        if (!gl) return;

        const vertexShaderSource = `attribute vec2 a_position; void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;
        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 u_resolution; uniform float u_time; uniform float u_resonance;
            void main() {
                vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
                float time = u_time * 0.05;
                float zoom = 1.2 + sin(time) * 0.3;
                uv *= zoom;
                float angle = time * 0.2 * u_resonance;
                mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
                uv = rot * uv;
                int reflections = 6;
                float angle_step = 2.0 * 3.14159 / float(reflections);
                float a = atan(uv.y, uv.x) + angle_step / 2.0;
                float r = length(uv);
                a = mod(a, angle_step) - angle_step / 2.0;
                uv = r * vec2(cos(a), sin(a));
                float r_ch = 0.1 + 0.1 * sin(uv.x * 2.0 + time * 1.5);
                float g_ch = 0.05 + 0.05 * sin(uv.y * 3.0 - time * 0.8);
                float b_ch = 0.2 + 0.1 * cos(length(uv) * 4.0 + time);
                gl_FragColor = vec4(r_ch, g_ch, b_ch, 1.0);
            }
        `;

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
        const timeUniformLocation = gl.getUniformLocation(program, "u_time");
        const resonanceUniformLocation = gl.getUniformLocation(program, "u_resonance");

        let startTime = Date.now();
        let animFrameId: number;

        const render = () => {
            const currentTime = (Date.now() - startTime) / 1000;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
            gl.uniform1f(timeUniformLocation, currentTime);
            gl.uniform1f(resonanceUniformLocation, resonance);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animFrameId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animFrameId);
    }, [resonance]);

    return <canvas ref={canvasRef} className="kaleidoscopic-background" />;
});

export const SubliminalGlyph: FC<{ seed: number }> = memo(({ seed }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animFrameId: number;
        let frame = 0;
        const draw = () => {
            frame++;
            const time = frame * 0.01;
            ctx.clearRect(0, 0, 100, 100);
            ctx.strokeStyle = `rgba(230, 195, 92, ${0.5 + Math.sin(time) * 0.2})`;
            ctx.lineWidth = 0.5;
            const points = 3 + (seed % 5);
            for (let i = 0; i < points; i++) {
                ctx.beginPath();
                const angle1 = (i * 2 * Math.PI / points) + time;
                const angle2 = ((i + 2) % points * 2 * Math.PI / points) - time;
                ctx.moveTo(50 + Math.cos(angle1) * 45, 50 + Math.sin(angle1) * 45);
                ctx.lineTo(50 + Math.cos(angle2) * 45, 50 + Math.sin(angle2) * 45);
                ctx.stroke();
            }
            animFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animFrameId);
    }, [seed]);

    return <div className="subliminal-glyph-container"><canvas ref={canvasRef} width="100" height="100"></canvas></div>;
});

// =================================================================================================
// --- FULL SCREEN VIEWS ---
// =================================================================================================

export const InstructionalCompositionView: FC<{ session: InstructionalCompositionSession; onStop: () => void }> = ({ session, onStop }) => {
    const { analyserNode, audioUrl, coreEmotion, symbolicMantra } = session;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.src = audioUrl;
        audio.play().catch(e => console.error("Audio playback failed:", e));

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animFrameId: number;

        const draw = () => {
            animFrameId = requestAnimationFrame(draw);
            analyserNode.getByteTimeDomainData(dataArray);

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'rgba(180, 212, 255, 0.7)';

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) * 0.6;

            ctx.beginPath();
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const angle = (i / bufferLength) * 2 * Math.PI;
                const x = centerX + Math.cos(angle) * radius * v;
                const y = centerY + Math.sin(angle) * radius * v;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        };
        draw();
        return () => cancelAnimationFrame(animFrameId);
    }, [analyserNode, audioUrl]);

    return (
        <div className="instructional-composition-view">
            <canvas ref={canvasRef} className="composition-visualizer" />
            <div className="composition-overlay">
                <div className="composition-header">
                    <h2>{coreEmotion}</h2>
                    <p className="hebrew-text symbolic-mantra">{symbolicMantra}</p>
                </div>
                <div className="composition-controls">
                    <button onClick={onStop} className="action-btn">Conclude Session</button>
                    <audio ref={audioRef} onEnded={onStop} hidden />
                </div>
            </div>
        </div>
    );
};

export const EntrainmentView: FC<{ session: ActiveEntrainmentSession, onStop: () => void }> = ({ session, onStop }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;
        let animFrameId: number;
        const draw = () => {
            frame++;
            const time = frame * 0.02;
            const pulse = (Math.sin(time * session.profile.targetFrequency * 0.5) + 1) / 2;

            ctx.clearRect(0, 0, 400, 400);
            ctx.fillStyle = `rgba(230, 195, 92, ${0.1 + pulse * 0.3})`;
            ctx.beginPath();
            ctx.arc(200, 200, 100 + pulse * 50, 0, 2 * Math.PI);
            ctx.fill();

            ctx.strokeStyle = `rgba(180, 212, 255, ${0.2 + pulse * 0.5})`;
            ctx.lineWidth = 1 + pulse * 2;
            ctx.beginPath();
            ctx.arc(200, 200, 50 + (1-pulse) * 20, 0, 2 * Math.PI);
            ctx.stroke();

            animFrameId = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(animFrameId);
    }, [session.profile.targetFrequency]);

    return (
        <div className="entrainment-view">
            <h2>{session.profile.name}</h2>
            <p>{session.profile.description}</p>
            <div className="entrainment-display">
                <canvas ref={canvasRef} id="visual-entrainment" width="400" height="400"></canvas>
            </div>
            <button onClick={onStop} className="action-btn">Stop Session</button>
        </div>
    );
};

export const SessionUnlockView: FC<{ onUnlock: (selected: string[]) => void; challenge: VisualChallenge | null; isLoading: boolean, onRegenerate: () => void }> = ({ onUnlock, challenge, isLoading, onRegenerate }) => {
    const [selected, setSelected] = useState<string[]>([]);
    
    const handleSelect = (prompt: string) => {
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

    if (!challenge) return <div className="session-unlock-view card"><LoadingIndicator /></div>;

    return (
        <div className="session-unlock-view card">
            <h2>Confirm Signature</h2>
            <p>Select the three images that correspond to your visual cipher concepts to unlock the session.</p>
            <div className="verification-grid">
                {challenge.images.map((img, i) => (
                    <div key={i} className={`verification-image-wrapper ${selected.includes(img.prompt) ? 'selected' : ''}`} onClick={() => handleSelect(img.prompt)}>
                        <img src={img.url} alt={`Challenge image ${i + 1}`} className="verification-image" />
                    </div>
                ))}
            </div>
            <div className="form-actions">
                <button onClick={onRegenerate} className="action-btn secondary-action" disabled={isLoading}>Regenerate</button>
                <button onClick={() => onUnlock(selected)} className="action-btn" disabled={isLoading || selected.length !== 3}>
                    {isLoading ? 'Verifying...' : 'Unlock'}
                </button>
            </div>
        </div>
    );
};

export const MeditationView: FC<{ script: string; imagePrompts: string[], onFinish: () => void; }> = ({ script, imagePrompts, onFinish }) => {
    const [images, setImages] = useState<string[]>([]);
    
    // In a real implementation, you would generate images here based on prompts.
    // For now, we'll just use placeholders.
    useEffect(() => {
        // Placeholder image generation
        setImages(imagePrompts.map(() => `https://picsum.photos/seed/${Math.random()}/600/400`));
    }, [imagePrompts]);

    return (
        <div className="meditation-view">
            <div className="meditation-content">
                <div className="meditation-script">
                    {script.split(/\[GENERATE_IMAGE:.+?\]/g).map((part, i) => (
                        <React.Fragment key={i}>
                            <p>{part}</p>
                            {images[i] && (
                                <div className="meditation-image-container">
                                    <img src={images[i]} alt={`Meditation visual ${i + 1}`} />
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <button onClick={onFinish} className="action-btn">Conclude Meditation</button>
            </div>
        </div>
    );
};


// =================================================================================================
// --- MODALS & TOASTS ---
// =================================================================================================

export const CrossReferenceModal: FC<{ value: number; history: SessionRecord[]; onClose: () => void; onSynthesize: (num: number) => void; isSynthesizing: boolean; synthesisResult: string | null; }> = ({ value, history, onClose, onSynthesize, isSynthesizing, synthesisResult }) => {
    const relevantHistory = useMemo(() => history.filter(item => JSON.stringify(item).includes(String(value))), [history, value]);

    return (
        <div className="cross-ref-modal-overlay" onClick={onClose}>
            <div className="cross-ref-modal-content" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="cross-ref-modal-close">&times;</button>
                <h3>Cross-Reference for: {value}</h3>
                <div className="history-list">
                    {relevantHistory.map(item => (
                        <div key={item.id} className="history-item">
                            <p className="history-query"><strong>{item.type.toUpperCase()}:</strong> <span>{(item as any).text?.substring(0, 100) || `[${(item as any).component || 'component'}]`}</span></p>
                            <p className="history-timestamp">{item.timestamp.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                <div className="synthesis-section">
                    <button onClick={() => onSynthesize(value)} disabled={isSynthesizing} className="action-btn">
                        {isSynthesizing ? 'Synthesizing...' : 'Synthesize Connections'}
                    </button>
                    {synthesisResult && <div className="synthesis-result"><p>{synthesisResult}</p></div>}
                </div>
            </div>
        </div>
    );
};

const ToastComponent: FC<{ toast: Toast, onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => (
    <div className={`toast ${toast.type}`} onClick={() => onDismiss(toast.id)}>
        {toast.message}
    </div>
);

export const ToastContainer: FC<{ toasts: Toast[], onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => (
    <div className="toast-container">
        {toasts.map(toast => <ToastComponent key={toast.id} toast={toast} onDismiss={onDismiss} />)}
    </div>
);

// =================================================================================================
// --- IN-CHAT COMPONENT VIEWS ---
// =================================================================================================

const AttunementView: FC<AttunementResult> = ({ emotion, musicalMode, derivedLetters, scryedWords }) => (
    <div className="attunement-view-container">
        <h3>Attunement for: <span className="emotion-target">{emotion}</span></h3>
        <p>Musical Mode: <strong>{musicalMode.name}</strong> ({musicalMode.emotion})</p>
        <h4>Derived Letters:</h4>
        <div className="derived-letters-grid">
            {derivedLetters.map(l => <div key={l.letter} className="derived-letter-card"><p className="hebrew-letter">{l.letter}</p><p>{l.name}</p></div>)}
        </div>
        <h4>Scryed Words:</h4>
        <div className="scryed-words-grid">
            {scryedWords.map(w => <div key={w.word} className="scryed-word-card"><p className="hebrew-text">{w.word}</p><p>{w.meaning}</p></div>)}
        </div>
    </div>
);

const EntrainmentSelectionView: FC<{ profiles: EntrainmentProfile[], onSelect: (profile: EntrainmentProfile) => void }> = ({ profiles, onSelect }) => (
    <div className="entrainment-selection-grid">
        {profiles.map(p => (
            <div key={p.name} className="card entrainment-selection-card" onClick={() => onSelect(p)}>
                <h4>{p.name}</h4>
                <p>{p.description}</p>
            </div>
        ))}
    </div>
);

const EntrainmentInfoView: FC<{ profiles: EntrainmentProfile[] }> = ({ profiles }) => (
    <div className="entrainment-info-view">
        {profiles.map(p => (
            <div key={p.name} className="entrainment-info-item">
                <h4>{p.name}</h4>
                <p>{p.description}</p>
            </div>
        ))}
    </div>
);

// =================================================================================================
// --- MAIN CHAT VIEW ---
// =================================================================================================

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
}> = ({ history, isLoading, error, onRetry, guidingIntent, onIntentChange, onNumberInteract, addMessage, aweData, setAweData, palmistryDone, voiceDone, input, onInputChange, onSend }) => {
    const historyEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const renderMessageContent = (msg: AIMessage) => {
        // This could be expanded with more views for each analysis type
        if (msg.analysisType === 'attunement') {
            return <AttunementView {...msg.result} />;
        }
        return msg.text.split(/(\[\d+\])/g).map((part, i) => {
            const match = part.match(/\[(\d+)\]/);
            if (match) {
                const num = parseInt(match[1], 10);
                return <strong key={i} className="interactive-number" onClick={() => onNumberInteract(num)}>[{num}]</strong>;
            }
            return <span key={i}>{part}</span>;
        });
    };
    
    const renderComponent = (msg: ComponentMessage) => {
        switch (msg.component) {
            case 'entrainment_selection':
                return <EntrainmentSelectionView {...msg.props} />;
            case 'entrainment_info':
                return <EntrainmentInfoView {...msg.props} />;
            case 'attunement':
                return <AttunementView {...msg.props} />;
            default:
                return null;
        }
    }

    return (
        <div className="chat-view-container">
            <div className="chat-history">
                {history.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.type}`}>
                        <div className="message-bubble">
                            {msg.type === 'ai' && renderMessageContent(msg)}
                            {msg.type === 'user' && msg.text}
                            {msg.type === 'system' && msg.text}
                            {msg.type === 'component' && renderComponent(msg)}
                        </div>
                    </div>
                ))}
                {isLoading && <div className="chat-message ai"><div className="message-bubble"><LoadingIndicator /></div></div>}
                {error && <ErrorMessage message={error} onRetry={onRetry} />}
                <div ref={historyEndRef} />
            </div>
            <div className="chat-input-area">
                <div className="guiding-intent-selector-container">
                    <label htmlFor="guiding-intent">Guiding Intent:</label>
                    <select id="guiding-intent" className="guiding-intent-selector" value={guidingIntent} onChange={e => onIntentChange(e.target.value as GuidingIntent)}>
                        <option>Neutral</option>
                        <option>Analytical</option>
                        <option>Esoteric</option>
                        <option>Creative</option>
                        <option>Divinatory</option>
                    </select>
                </div>
                <form className="chat-input-form" onSubmit={e => { e.preventDefault(); onSend(); }}>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Transmit your query..."
                        value={input}
                        onChange={e => onInputChange(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="chat-submit-btn" disabled={isLoading || !input.trim()}>
                        &#10148;
                    </button>
                </form>
            </div>
        </div>
    );
};

// =================================================================================================
// --- AYIN GUIDE (MAIN MENU) ---
// =================================================================================================

export const AyinGuide: FC<{
    onCommandSelect: (command: string) => void;
    onOpenIngest: () => void;
    onStartPalmistry: () => void;
    onStartVoiceAnalysis: () => void;
    isAweComplete: boolean;
    isPlannerUnlocked: boolean;
}> = ({ onCommandSelect, onOpenIngest, onStartPalmistry, onStartVoiceAnalysis, isAweComplete, isPlannerUnlocked }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const commands = [
        { cmd: '°instruct', arg: '<goal>', desc: 'Compose a therapeutic song to achieve a goal.', requiresAwe: true },
        { cmd: '°entrain', arg: '', desc: 'Access brainwave entrainment protocols.', requiresAwe: true },
        { cmd: '°attune', arg: '<emotion>', desc: 'Find musical/lexical resonance for an emotion.', requiresAwe: false },
        { cmd: '°meditate', arg: '', desc: 'Begin a guided meditation based on your AWE.', requiresAwe: true },
        { cmd: '°planner', arg: '', desc: 'Generate an esoteric day planner.', requiresPlanner: true },
    ];

    const isCommandDisabled = (cmd: typeof commands[0]) => {
        if (cmd.requiresAwe && !isAweComplete) return true;
        if (cmd.requiresPlanner && !isPlannerUnlocked) return true;
        return false;
    };
    
    return (
        <>
            <div className="ayin-guide-container" onClick={() => setIsOpen(!isOpen)}>
                <span>°</span>
            </div>
            {isOpen && (
                <div className="ayin-menu-container" ref={menuRef}>
                    <div className="card">
                        <div className="call-sign-menu">
                             <h3>Call Signs</h3>
                             <p className="ayin-intro">Select a protocol to begin.</p>
                             <ul>
                                {commands.map(c => (
                                    <li key={c.cmd} className={isCommandDisabled(c) ? 'disabled' : ''} onClick={() => !isCommandDisabled(c) && onCommandSelect(c.cmd + ' ')}>
                                        <strong>{c.cmd} <span className="cmd-arg">{c.arg}</span></strong>
                                        <p>{c.desc}</p>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};