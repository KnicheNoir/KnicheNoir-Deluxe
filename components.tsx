
import React, { useState, useMemo, useEffect, useRef, useCallback, memo, FC, ReactNode } from 'react';
// FIX: Added AWEFormData to fix type error on StelaCalibrationView component.
import { SessionRecord, Toast, AIMessage, UserMessage, SystemMessage, VisualChallenge, InstructionalCompositionSession, ActiveEntrainmentSession, SolveFinding, VoynichAnalysisResult, ComponentMessage, VoynichDeepAnalysisResult, CallSign, VoynichTranslationResult, ActiveSolveSession, ViewMode, MusicalComposition, MeditationResult, VeracityEntry, GlyphStateEntry, OperatorManual, OperatorProtocol, BealeCipherSolution, GuidingIntent, CustomTool, AWEFormData, GematriaAnalysis, DeepELSAnalysisResult, ExhaustiveResonanceResult, ELSResult, WidgetState, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, Cicada3301Solution } from './types';
import { codex } from './codex';
import { toPng } from 'html-to-image';
// FIX: Added VocalService to fix error on ChatView component.
import { VocalService } from './services';

// =================================================================================================
// --- UI FRAMEWORK & PRESENTATION LOGIC ---
// =================================================================================================

// FIX: Added missing KaleidoscopicBackground component.
interface KaleidoscopicBackgroundProps {
    resonance: number;
}
export const KaleidoscopicBackground: FC<KaleidoscopicBackgroundProps> = memo(({ resonance }) => {
    // This component creates a dynamic, shifting background based on a resonance seed.
    // The implementation uses CSS custom properties and pseudo-elements for performance.
    const style = {
        '--seed': resonance * 360, // Pass the seed directly to CSS
    } as React.CSSProperties;

    return <div className="kaleidoscopic-background" style={style}></div>;
});

export const CALL_SIGNS: CallSign[] = [
    { name: 'Home', lat: 31.7683, lon: 35.2137, color: 'primary' }, // Jerusalem (Fertile Crescent)
    { name: 'The Library', lat: 29.6547, lon: 91.1172, color: 'secondary' }, // Lhasa, Tibet
    { name: 'The Oracle', lat: 20.6843, lon: -88.5678, color: 'secondary' }, // Chichen Itza, Mexico
];


/**
 * The root presentation component for the Astrian Key.
 * It takes the state from the system and UI hooks and orchestrates the
 * rendering of all primary views, overlays, and global elements.
 */
interface AstrianInterfaceProps {
    // From useAstrianSystem (now with reducer state)
    soBelowState: { view: string; sessionData: any; initialHomeCommand?: string; activeCallSign: CallSign | null; };
    dispatchSoBelow: (action: any) => void;

    // From useAstrianSystem (other state)
    isSolveActive: boolean;
    chakraTheme: string;
    activeSolveSession: ActiveSolveSession;
    toasts: Toast[];
    dismissToast: (id: string) => void;
    addToast: (message: string, type?: Toast['type']) => void;
    showWelcomeOffer: boolean;
    startTour: () => void;
    handleDismissWelcomeOffer: () => void;
    isTourActive: boolean;
    tourStep: number;
    setTourStep: React.Dispatch<React.SetStateAction<number>>;
    endTour: () => void;
    speakText: (text: string) => void;
    isModalOpen: boolean;
    crossRefValue: number | null;
    sessionHistory: SessionRecord[];
    setIsModalOpen: (isOpen: boolean) => void;
    handleSynthesizeConnections: (num: number) => void;
    handleNumberInteract: (num: number) => void;
    isSynthesizing: boolean;
    synthesisResult: string | null;
    solveIntensity: number;
    bookmarks: AIMessage[];
    toggleBookmark: (id: string) => void;
    guidingIntent: GuidingIntent;
    customTools: CustomTool[];
    handleSaveTool: (tool: Omit<CustomTool, "id">) => void;
    widgets: WidgetState[];
    setWidgets: React.Dispatch<React.SetStateAction<WidgetState[]>>;
    handleScreenshot: () => void;
    handleDownloadArchive: () => void;
    
    // From useUserInterface
    isCallSignMenuOpen: boolean;
    setIsCallSignMenuOpen: (isOpen: boolean) => void;
    handleCallSignSelect: (callSign: CallSign) => void;
    transitionText: string | null;
    activeTool: string | null;
    setActiveTool: (tool: string | null) => void;
    viewMode: ViewMode;
    handleCompassDoubleClick: () => void;
    handleBookmarkSelect: (bookmark: string) => void;
    isBookmarksOpen: boolean;
    setIsBookmarksOpen: (isOpen: boolean) => void;
    isArchiveOpen: boolean;
    setIsArchiveOpen: (isOpen: boolean) => void;
    isManualOpen: boolean;
    setIsManualOpen: (isOpen: boolean) => void;
    isWhiteboardOpen: boolean;
    setIsWhiteboardOpen: (isOpen: boolean) => void;

    // From App
    onCommandSelect: (command: string) => void;
    onDirectCommand: (command: string) => void;
    children: ReactNode; // For the call sign content
}

// FIX: Added missing AstrianInterface component definition.
export const AstrianInterface: FC<AstrianInterfaceProps> = (props) => {
    const {
        viewMode,
        soBelowState,
        chakraTheme,
        isSolveActive,
        activeSolveSession,
        children,
        handleCompassDoubleClick,
        handleCallSignSelect,
        guidingIntent,
        toasts,
        dismissToast,
        showWelcomeOffer,
        startTour,
        handleDismissWelcomeOffer,
        isTourActive,
        tourStep,
        setTourStep,
        endTour,
        isModalOpen,
        crossRefValue,
        handleSynthesizeConnections,
        setIsModalOpen,
        isCallSignMenuOpen,
        setIsCallSignMenuOpen,
        transitionText,
        bookmarks,
        handleBookmarkSelect,
        isBookmarksOpen,
        setIsBookmarksOpen,
        sessionHistory,
        isArchiveOpen,
        setIsArchiveOpen,
        isManualOpen,
        setIsManualOpen,
        isWhiteboardOpen,
        setIsWhiteboardOpen,
        handleScreenshot,
        handleDownloadArchive,
        customTools,
        onDirectCommand,
        onCommandSelect,
    } = props;

    const memoizedManual = useMemo(() => codex.getOperatorsManual(), []);
    const appContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div 
            ref={appContainerRef}
            className={`app-container view-mode-${viewMode} theme-${chakraTheme} ${isSolveActive ? 'solve-active' : ''}`}
            style={{'--solve-intensity': props.solveIntensity} as React.CSSProperties}
        >
            <div className={`dual-hemisphere-container view-mode-${viewMode}`}>
                <GlobeView
                    onCallSignSelect={handleCallSignSelect}
                    isSolveActive={isSolveActive}
                    onOpenBookmarks={() => setIsBookmarksOpen(true)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                    onOpenManual={() => setIsManualOpen(true)}
                    onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
                    onScreenshot={handleScreenshot}
                    onDirectCommand={onDirectCommand}
                />
                 <SoBelowView
                    theme={soBelowState.activeCallSign?.color || 'default'}
                >
                    {children}
                </SoBelowView>
            </div>
            
            <CaduceusCompass onClick={handleCompassDoubleClick} />
            
            {/* Global UI Elements & Overlays */}
            {isSolveActive && <SolveEKGOverlay />}
            <StatusTicker findings={activeSolveSession.findings} isSolveActive={isSolveActive} />
            <OracleTicker onSelect={onDirectCommand} />

            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            {showWelcomeOffer && <WelcomeOfferView onStartTour={startTour} onDismiss={handleDismissWelcomeOffer} />}
            {isTourActive && <GuidedTour step={tourStep} onNext={() => setTourStep(p => p + 1)} onEnd={endTour} />}
            {isModalOpen && crossRefValue !== null && (
                <CrossReferenceModal
                    value={crossRefValue}
                    onClose={() => setIsModalOpen(false)}
                    onSynthesize={handleSynthesizeConnections}
                />
            )}
            <CallSignMenu isOpen={isCallSignMenuOpen} onClose={() => setIsCallSignMenuOpen(false)} onSelect={handleCallSignSelect} />
            <TransitionOverlay text={transitionText} />

            {/* Overlay Modals */}
             <BookmarksOverlay
                isOpen={isBookmarksOpen}
                onClose={() => setIsBookmarksOpen(false)}
                bookmarks={bookmarks}
                customTools={customTools}
                onSelect={handleBookmarkSelect}
                onDirectCommand={onDirectCommand}
            />
            <ArchiveOverlay isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} history={sessionHistory} />
            <ManualOverlay isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} manual={memoizedManual} />
            <WhiteboardOverlay isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />
        </div>
    );
};

// Helper components used by AstrianInterface (placeholders to ensure compilation)
const ORACLE_COMMANDS = [
    '°solve the voynich manuscript',
    '°meditate on unity',
    '°compose a song from Genesis 1:1',
    '°entrain theta wave',
    '°instruct me on overcoming fear'
];

export const StatusTicker: FC<{findings: SolveFinding[], isSolveActive: boolean}> = memo(({ findings, isSolveActive }) => {
    if (!isSolveActive) return null;
    const latestFindings = useMemo(() => findings.slice(-10).reverse(), [findings]);
    
    return (
        <div className="status-ticker-container">
            <div className="status-ticker-content" key={findings.length}>
                {[...latestFindings, ...latestFindings].map((finding, index) => (
                    <span key={`${finding.id}-${index}`} className="status-ticker-item">
                        <span className="type">[{finding.type}]</span>
                        <span className="content">{finding.content}</span>
                    </span>
                ))}
            </div>
        </div>
    );
});

export const OracleTicker: FC<{ onSelect: (cmd: string) => void }> = memo(({ onSelect }) => {
    const commands = useMemo(() => [...ORACLE_COMMANDS, ...ORACLE_COMMANDS], []);
    return (
        <div className="oracle-ticker-container">
            <div className="oracle-ticker-content">
                {commands.map((cmd, index) => (
                    <span key={index} className="oracle-ticker-item" onClick={() => onSelect(cmd)}>
                        {cmd}
                    </span>
                ))}
            </div>
        </div>
    );
});

export const ToastContainer: FC<{toasts: Toast[], onDismiss: (id: string) => void}> = ({toasts, onDismiss}) => <div style={{position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999}}>{toasts.map(t => <div key={t.id} onClick={() => onDismiss(t.id)}>{t.message}</div>)}</div>;
export const WelcomeOfferView: FC<any> = () => <div>Welcome Offer</div>;
export const GuidedTour: FC<any> = () => <div>Guided Tour</div>;
export const CrossReferenceModal: FC<any> = () => <div>Cross-Reference Modal</div>;

export const CallSignMenu: FC<{ isOpen: boolean; onClose: () => void; onSelect: (callSign: CallSign) => void; }> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="call-sign-menu-overlay" onClick={onClose}>
            <div className="call-sign-menu-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Select Call Sign</h2>
                <div className="call-sign-list">
                    {CALL_SIGNS.map(cs => (
                        <button key={cs.name} onClick={() => onSelect(cs)}>
                            {cs.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
export const TransitionOverlay: FC<{text: string | null}> = ({text}) => text ? <div className="transition-overlay">{text}</div> : null;
export const ToolWidget: FC<any> = () => <div>Tool Widget</div>;

const LowerHemisphereBackground: FC = memo(() => (
    <div className="lower-hemisphere-background" />
));

const AquaticBackground: FC = memo(() => {
    const [effects, setEffects] = useState<any[]>([]);

    useEffect(() => {
        const createEffect = () => {
            const id = Date.now() + Math.random();
            const type = Math.random() > 0.3 ? 'biolum' : 'snow';

            if (type === 'biolum') {
                const duration = Math.random() * 3 + 2;
                const newEffect = {
                    id, type, duration: `${duration}s`,
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                };
                setEffects(prev => [...prev, newEffect]);
                setTimeout(() => setEffects(prev => prev.filter(e => e.id !== id)), duration * 1000);
            } else {
                 const duration = Math.random() * 10 + 10;
                 const newEffect = {
                    id, type, duration: `${duration}s`, size: `${Math.random() * 2 + 1}px`,
                    '--x-start': `${Math.random() * 100}vw`,
                    '--x-end': `${Math.random() * 100}vw`,
                 };
                 setEffects(prev => [...prev, newEffect]);
                 setTimeout(() => setEffects(prev => prev.filter(e => e.id !== id)), duration * 1000);
            }
        };

        const interval = setInterval(createEffect, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="aquatic-background">
            {effects.map(effect => {
                if (effect.type === 'biolum') {
                    return <div key={effect.id} className="biolum-flash" style={{ top: effect.top, left: effect.left, animationDuration: effect.duration }} />;
                }
                if (effect.type === 'snow') {
                    return <div key={effect.id} className="marine-snow" style={{ width: effect.size, height: effect.size, animationDuration: effect.duration, ...effect }} />;
                }
                return null;
            })}
        </div>
    );
});

const PIPItem: FC<{title: string; children: ReactNode}> = ({ title, children }) => (
    <div className="pip-item">
        <h4>{title}</h4>
        <div>{children}</div>
    </div>
);

const PIPQuadrantView: FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <div className="pip-quadrant-view">
            <PIPItem title="Active Timer">Meditation: 12:45</PIPItem>
            <PIPItem title="Next Reminder">Review session notes</PIPItem>
            {children}
        </div>
    );
};


// =================================================================================================
// --- °SOLVE MODE ATMOSPHERIC COMPONENTS ---
// =================================================================================================

// FIX: Added the missing SolveEKGOverlay component.
const SolveEKGOverlay: FC = memo(() => {
    // A simple SVG to create a pulsing EKG line effect.
    return (
        <div className="solve-ekg-overlay">
            <svg viewBox="0 0 100 20" preserveAspectRatio="none">
                <path
                    className="ekg-path"
                    d="M 0 10 L 20 10 L 25 5 L 30 15 L 35 8 L 40 12 L 45 10 L 80 10 L 85 13 L 90 10 L 100 10"
                    fill="none"
                    strokeWidth="1"
                />
            </svg>
        </div>
    );
});

const SolveSun: FC = memo(() => <div className="solve-sun" />);

const SolveElectricity: FC = memo(() => {
    const arcs = useMemo(() => Array.from({ length: 10 }).map((_, i) => {
        const d = `M${Math.random() * 100} ${Math.random() * 100} C${Math.random() * 100} ${Math.random() * 100}, ${Math.random() * 100} ${Math.random() * 100}, ${Math.random() * 100} ${Math.random() * 100}`;
        const delay = `${Math.random() * 2}s`;
        const duration = `${Math.random() * 0.2 + 0.1}s`;
        return { id: i, d, delay, duration };
    }), []);

    return (
        <svg className="solve-electricity-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {arcs.map(arc => (
                <path key={arc.id} d={arc.d} className="solve-electricity-arc" style={{ animationDelay: arc.delay, animationDuration: arc.duration }} />
            ))}
        </svg>
    );
});

const SolveVolcano: FC = memo(() => {
    const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 5}s`,
        '--x-jitter': Math.random() * 100 - 50,
    })), []);

    return (
        <div className="solve-volcano-container">
            <div className="solve-volcano-glow" />
            <div className="solve-volcano-cone" />
            <div className="solve-volcano-particles">
                {particles.map(p => <div key={p.id} className="volcano-particle" style={p as React.CSSProperties} />)}
            </div>
        </div>
    );
});

const SolveMuddiedOverlay: FC = memo(() => <div className="solve-muddied-overlay" />);

// FIX: Completed the SolveMermaid component which was corrupted and not returning a value.
const SolveMermaid: FC = memo(() => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showMermaid = () => {
            if (document.hidden || isVisible) return;
            
            setIsVisible(true);
            setTimeout(() => {
                setIsVisible(false);
            }, 8000); // Animation duration is 8s
        };

        const interval = setInterval(() => {
            if(Math.random() < 0.1) { // 10% chance every 10 seconds
                showMermaid();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isVisible]);

    return isVisible ? <div className="solve-mermaid-container"><div className="solve-mermaid-silhouette" /></div> : null;
});

// =================================================================================================
// --- NEW ANALYSIS VIEW: Beale Cipher Solution ---
// =================================================================================================
export const BealeCipherSolutionView: FC<{ solution: BealeCipherSolution }> = ({ solution }) => {
    if (!solution) return null;
    return (
        <div className="beale-cipher-solution-view">
            <h3>{solution.title}</h3>
            <p className="overview">{solution.summary}</p>
            
            <div className="analysis-section">
                <h4>Key Document</h4>
                <div className="beale-key-doc">
                    <p><strong>Name:</strong> {solution.keyDocument.name}</p>
                    <p><strong>Author:</strong> {solution.keyDocument.author}</p>
                    <p><strong>Year:</strong> {solution.keyDocument.year}</p>
                </div>
            </div>

            <div className="analysis-section">
                <h4>Decryption Process</h4>
                <p>{solution.decryptionProcess}</p>
            </div>

             <div className="analysis-section">
                <h4>Decoded Message (Paper 2)</h4>
                <pre className="decoded-message-block">{solution.decodedMessage}</pre>
            </div>

            <div className="analysis-section astrian-analysis-section">
                <h4>{solution.astrianResonance.title}</h4>
                <p>{solution.astrianResonance.explanation}</p>
            </div>
        </div>
    );
};

// =================================================================================================
// --- NEW ANALYSIS VIEW: Voynich Manuscript Translation ---
// =================================================================================================
export const VoynichTranslationView: FC<{ result: VoynichTranslationResult }> = ({ result }) => {
    if (!result || !result.entries) return null;
    return (
        <div className="voynich-translation-view">
            <h3>Voynich Manuscript Translation</h3>
            <p className="overview">Canonized translation based on the structural resonance with the Willow Network.</p>
            
            {result.entries.map((entry, index) => (
                <div key={index} className="analysis-section translation-entry">
                    <h4>{entry.folio} - {entry.theme}</h4>
                    <div className="translation-content">
                        <div className="hebrew-text">
                            <p>{entry.hebrew}</p>
                        </div>
                        <div className="english-text">
                            <p>{entry.english}</p>
                        </div>
                    </div>
                    {entry.notes && entry.notes.length > 0 && (
                        <div className="translation-notes">
                            <h5>Notes:</h5>
                            <ul>
                                {entry.notes.map((note, noteIndex) => (
                                    <li key={noteIndex}><strong>{note.term}:</strong> {note.explanation}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// =================================================================================================
// --- VIEW & UI COMPONENTS (PLACEHOLDERS) ---
// =================================================================================================

// These components are referenced throughout the application but were missing.
// They are implemented here as placeholders to resolve import errors.

export const ChatView: FC<any> = ({ history, error, onRetry, input, onInputChange, onSend, onSpeak, isListening, onStartListening }) => (
    <div className="chat-view">
        {/* A simple representation of a chat view */}
        <div className="history" style={{ height: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
            {history?.map((msg: any) => <div key={msg.id}><strong>{msg.type}:</strong> {msg.text || '[Component]'}</div>)}
        </div>
        {error && <div className="error" style={{ color: 'red' }}>Error: {error} <button onClick={onRetry}>Retry</button></div>}
        <div className="input-area" style={{ display: 'flex', marginTop: '10px' }}>
            <textarea value={input} onChange={(e) => onInputChange(e.target.value)} style={{ flexGrow: 1 }} />
            <button onClick={onSend}>Send</button>
            <button onClick={onStartListening}>{isListening ? 'Listening...' : 'Speak'}</button>
        </div>
    </div>
);

export const SubliminalGlyph: FC<{ seed: number }> = ({ seed }) => <div className="subliminal-glyph" style={{ position: 'fixed', bottom: '10px', left: '10px', opacity: 0.1 }}>Glyph Seed: {seed.toFixed(4)}</div>;

export const SessionUnlockView: FC<any> = ({ onUnlock, challenge, isLoading, onRegenerate }) => (
    <div className="session-unlock-view">
        <h2>Session Locked</h2>
        <p>Challenge: {challenge?.prompt}</p>
        <button onClick={() => onUnlock('password')} disabled={isLoading}>{isLoading ? 'Unlocking...' : 'Unlock'}</button>
        <button onClick={onRegenerate}>Regenerate Challenge</button>
    </div>
);

export const MeditationView: FC<any> = ({ script, imagePrompts, onFinish }) => (
    <div className="meditation-view">
        <h2>Meditation</h2>
        <p>{script}</p>
        <div className="image-prompts">
            {imagePrompts?.map((prompt: string, i: number) => <p key={i}><i>Image: {prompt}</i></p>)}
        </div>
        <button onClick={onFinish}>Finish</button>
    </div>
);

export const AyinGuide: FC<any> = (props) => <div className="ayin-guide"><h3>Ayin Guide</h3></div>;
export const StelaCalibrationView: FC<any> = (props) => <div>Stela Calibration</div>;

export const InstructionalCompositionView: FC<{ session: any, onStop: () => void }> = ({ session, onStop }) => (
    <div className="instructional-composition-view">
        <h2>Instructional Composition</h2>
        <p>Playing composition...</p>
        <button onClick={onStop}>Stop</button>
    </div>
);

export const EntrainmentView: FC<{ session: any, onStop: () => void }> = ({ session, onStop }) => (
    <div className="entrainment-view">
        <h2>Entrainment Session</h2>
        <p>Playing entrainment audio...</p>
        <button onClick={onStop}>Stop</button>
    </div>
);

export const EmergentCTA: FC<any> = (props) => <div className="emergent-cta" style={{padding: '10px', border: '1px dashed #555', marginTop: '10px'}}>Emergent Call to Action</div>;

export const BootAnimationView: FC<{ statusText: string, subText: string, isComplete: boolean, onEnter: () => void }> = ({ statusText, subText, isComplete, onEnter }) => (
     <div className="boot-animation-view">
        <svg width="0" height="0">
            <filter id="goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
                <feBlend in="SourceGraphic" in2="goo" />
            </filter>
        </svg>
        <div className="vortex-container">
            <div className="vortex-layer"></div>
            <div className="vortex-layer"></div>
            <div className="vortex-layer"></div>
        </div>
        <button className="boot-ayin" onClick={onEnter} disabled={!isComplete}>
            {isComplete ? '°' : '࿁'}
        </button>
        <div className="boot-summary-container">
            <div className="boot-summary-scroll" key={statusText}>
                <p>{statusText}</p>
                <p>{subText}</p>
            </div>
        </div>
    </div>
);

export const HomeView: FC<any> = (props) => <div className="home-view"><h2>Home View</h2></div>;
export const LibraryView: FC<any> = (props) => <div className="library-view"><h2>Library View</h2></div>;
export const OracleView: FC<any> = (props) => <div className="oracle-view"><h2>Oracle View</h2></div>;

export const CameraView: FC<{ onCapture: (data: string) => void, onCancel: () => void }> = ({ onCapture, onCancel }) => (
    <div className="camera-view">
        <h2>Camera</h2>
        <p>Imagine a camera feed here.</p>
        <button onClick={() => onCapture('base64imagedata:...')}>Capture</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
);

export const VoiceRecorderView: FC<{ onRecord: (data: Blob) => void, onCancel: () => void }> = ({ onRecord, onCancel }) => (
    <div className="voice-recorder-view">
        <h2>Voice Recorder</h2>
        <p>Imagine a voice recorder UI here.</p>
        <button onClick={() => onRecord(new Blob(['test'], {type: 'audio/wav'}))}>Record</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
);


const CaduceusCompass: FC<{ onClick: () => void }> = memo(({ onClick }) => {
    return (
        <div className="caduceus-compass-wrapper" onDoubleClick={onClick}>
            <span className="ayin-compass" role="button" aria-label="Toggle View">°</span>
        </div>
    );
});

export const SoBelowView: FC<{ children: ReactNode, theme: string }> = ({ children, theme }) => (
    <div className={`so-below-view call-sign-theme-${theme}`}>
        <AquaticBackground />
        {children}
        <SolveVolcano />
        <SolveMuddiedOverlay />
        <SolveMermaid />
    </div>
);

const AsAboveMenu: FC<{onOpenBookmarks: () => void; onOpenArchive: () => void; onOpenManual: () => void; onOpenWhiteboard: () => void; onScreenshot: () => void;}> = (props) => {
    return (
        <div className="as-above-menu">
            <button onClick={props.onScreenshot} title="Screenshot">⌾</button>
            <button onClick={props.onOpenBookmarks} title="Bookmarks">🔖</button>
            <button onClick={props.onOpenArchive} title="Session Archive">🗄️</button>
            <button onClick={props.onOpenManual} title="Operator's Manual">📖</button>
            <button onClick={props.onOpenWhiteboard} title="Whiteboard">📋</button>
        </div>
    );
};


const Starscape: FC = memo(() => {
    const stars = useMemo(() => {
        return Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            size: `${Math.random() * 2 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
        }));
    }, []);

    const [meteors, setMeteors] = useState<any[]>([]);

    useEffect(() => {
        const createMeteor = () => {
            const id = Date.now();
            const newMeteor = {
                id,
                left: `${Math.random() * 120 - 10}vw`,
                top: `${Math.random() * 120 - 10}vh`,
                animationDuration: `${Math.random() * 2 + 1}s`,
            };
            setMeteors(prev => [...prev, newMeteor]);
            setTimeout(() => {
                setMeteors(prev => prev.filter(m => m.id !== id));
            }, (parseFloat(newMeteor.animationDuration) * 1000));
        };

        const interval = setInterval(createMeteor, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="starscape">
            {stars.map(star => (
                <div key={star.id} className="star" style={{
                    width: star.size,
                    height: star.size,
                    left: star.left,
                    top: star.top,
                    animationDuration: star.animationDuration,
                    animationDelay: star.animationDelay,
                }} />
            ))}
            {meteors.map(meteor => (
                 <div key={meteor.id} className="meteor" style={{
                    left: meteor.left,
                    top: meteor.top,
                    animationDuration: meteor.animationDuration,
                 }} />
            ))}
        </div>
    );
});


const CallSignHoverWindow: FC<{ callSign: CallSign, onSelect: (cmd: string) => void }> = ({ callSign, onSelect }) => {
    const questions = [
        `What is the resonance of ${callSign.name}?`,
        `Show me the history of ${callSign.name}.`,
        `°solve the mystery of ${callSign.name}`
    ];
    return (
        <div className="call-sign-hover-window">
            <h3 className="hover-window-title">{callSign.name}</h3>
            <p className="hover-window-status">Resonance Stable</p>
            <ul className="hover-window-questions">
                {questions.map(q => <li key={q} onClick={() => onSelect(q)}>{q}</li>)}
            </ul>
        </div>
    );
};


export const GlobeView: FC<{
    onCallSignSelect: (callSign: CallSign) => void;
    isSolveActive: boolean;
    onOpenBookmarks: () => void;
    onOpenArchive: () => void;
    onOpenManual: () => void;
    onOpenWhiteboard: () => void;
    onScreenshot: () => void;
    onDirectCommand: (command: string) => void;
}> = memo(({ onCallSignSelect, isSolveActive, onDirectCommand, ...menuProps }) => {
    const [rotation, setRotation] = useState({ x: 20, y: -90 });
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
    const [hoveredCallSign, setHoveredCallSign] = useState<CallSign | null>(null);
    const hoverTimeoutRef = useRef<number | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setRotation(prev => ({
                x: Math.max(-80, Math.min(80, prev.x - dy * 0.2)),
                y: prev.y + dx * 0.2
            }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleCallSignHover = (callSign: CallSign | null) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        if (callSign) {
            hoverTimeoutRef.current = window.setTimeout(() => {
                setHoveredCallSign(callSign);
            }, 500); // 0.5s delay
        } else {
            setHoveredCallSign(null);
        }
    };

    const globeTransform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;

    const projectToSphere = (lat: number, lon: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return { x, y, z };
    };

    const radius = 100;

    return (
        <div className="globe-view" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <Starscape />
            <SolveSun />
            <SolveElectricity />
            <AsAboveMenu {...menuProps} />

            <div className="globe-container">
                 <svg className="globe-svg" viewBox="-120 -120 240 240">
                    <defs>
                         <filter id="electric-glow-filter">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    <g style={{ transform: globeTransform, transformBox: 'fill-box' }}>
                        <circle cx="0" cy="0" r={radius} className="globe-outline" />
                        
                        {/* Longitude and Latitude Lines */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <ellipse key={`lon-${i}`} cx="0" cy="0" rx={radius} ry={radius} 
                                style={{ transform: `rotateY(${i * 15}deg)` }}
                                className="globe-line"
                            />
                        ))}
                        {Array.from({ length: 5 }).map((_, i) => (
                            <ellipse key={`lat-${i}`} cx="0" cy="0" rx={radius} ry={radius} 
                                style={{ transform: `rotateX(90deg) rotateY(${i * 30 - 60}deg) scaleY(${Math.sin((i * 30) * Math.PI / 180)})` }}
                                className="globe-line"
                            />
                        ))}
                        
                        {/* Ley Lines */}
                        <path className="ley-line" d="M -25.9 33.4 Q 50 80, 71.9 -61.5" />
                        <path className="ley-line active" d="M 71.9 -61.5 Q 0 -50, -99.9 -1.7" />
                        <path className="ley-line" d="M -99.9 -1.7 Q -50 50, -25.9 33.4" />

                        {/* Call Signs */}
                        {CALL_SIGNS.map(cs => {
                            const { x, y, z } = projectToSphere(cs.lat, cs.lon, radius);
                            const isVisible = z > -20; // Only show points on the front
                             return isVisible && (
                                 <g key={cs.name} transform={`translate(${x} ${y})`}
                                    onMouseEnter={() => handleCallSignHover(cs)}
                                    onMouseLeave={() => handleCallSignHover(null)}
                                    onClick={() => onCallSignSelect(cs)}
                                    className="call-sign-point"
                                 >
                                    <circle r="5" className="call-sign-point-glow" style={{stroke: `var(--color-${cs.color})`}}/>
                                    <circle r="2" className="call-sign-point-core"/>
                                    <text y="-10" className="call-sign-label">{cs.name}</text>
                                 </g>
                            );
                        })}
                    </g>
                 </svg>
                 {hoveredCallSign && (
                    <CallSignHoverWindow callSign={hoveredCallSign} onSelect={onDirectCommand}/>
                 )}
            </div>
        </div>
    );
});

export const BookmarksOverlay: FC<any> = ({ isOpen, onClose }) => isOpen ? <div className="bookmarks-overlay modal-overlay"><div><h2>Bookmarks</h2><button onClick={onClose}>Close</button></div></div> : null;
export const ArchiveOverlay: FC<any> = ({ isOpen, onClose }) => isOpen ? <div className="archive-overlay modal-overlay"><div><h2>Archive</h2><button onClick={onClose}>Close</button></div></div> : null;
export const ManualOverlay: FC<any> = ({ isOpen, onClose }) => isOpen ? <div className="manual-overlay modal-overlay"><div><h2>Operator's Manual</h2><button onClick={onClose}>Close</button></div></div> : null;
export const WhiteboardOverlay: FC<any> = ({ isOpen, onClose }) => isOpen ? <div className="whiteboard-overlay modal-overlay"><div><h2>Whiteboard</h2><button onClick={onClose}>Close</button></div></div> : null;
