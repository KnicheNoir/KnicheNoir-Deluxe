import React, { useState, useMemo, useEffect, useRef, useCallback, memo, FC, ReactNode } from 'react';
import { SessionRecord, Toast, AIMessage, UserMessage, SystemMessage, VisualChallenge, InstructionalCompositionSession, ActiveEntrainmentSession, SolveFinding, VoynichAnalysisResult, ComponentMessage, VoynichDeepAnalysisResult, CallSign, VoynichTranslationResult, ActiveSolveSession, ViewMode, MusicalComposition, MeditationResult, VeracityEntry, GlyphStateEntry, OperatorManual, OperatorProtocol, BealeCipherSolution, GuidingIntent, CustomTool, AWEFormData, GematriaAnalysis, DeepELSAnalysisResult, ExhaustiveResonanceResult, ELSResult, WidgetState, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, Cicada3301Solution, BealeTreasureMapAnalysis, ScriedImageResult, ChronovisedVideoResult } from './types';
import { codex } from './codex';
import { toPng } from 'html-to-image';
import { hebrewNetwork } from './dataModels';
import { useAstrianSystem, useUserInterface } from './hooks'; // For prop types

// =================================================================================================
// --- FORWARD-DECLARED & UTILITY COMPONENTS ---
// =================================================================================================

export const SubliminalGlyph: FC<{ seed: number }> = ({ seed }) => (
    <div className="subliminal-glyph" style={{ '--seed': seed } as React.CSSProperties}></div>
);

export const KaleidoscopicBackground: FC<{ resonance: number }> = ({ resonance }) => (
    <div className="kaleidoscopic-background" style={{ '--resonance': resonance } as React.CSSProperties}></div>
);

const Modal: FC<{ title: string, children: ReactNode, onClose: () => void }> = ({ title, children, onClose }) => (
    <div className="bookmarks-overlay" onClick={onClose}>
        <div className="bookmarks-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', alignItems: 'center' }}>
                <h2>{title}</h2>
                <button className="close-btn" onClick={onClose} aria-label="Close modal">&times;</button>
            </div>
            {children}
        </div>
    </div>
);

// =================================================================================================
// --- NEW ATMOSPHERIC & UI COMPONENTS ---
// =================================================================================================

const Starscape: FC = memo(() => {
    const stars = useMemo(() => Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`,
        duration: `${Math.random() * 3 + 2}s`,
        delay: `${Math.random() * 2}s`,
    })), []);

    const [meteors, setMeteors] = useState<{ id: number; top: string; left: string; duration: string; delay: string; }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMeteors(prev => [...prev, {
                id: Date.now(),
                top: `${Math.random() * 40 - 10}%`,
                left: `${Math.random() * 100 - 50}%`,
                duration: `${Math.random() * 2 + 1}s`,
                delay: '0s',
            }]);
            setTimeout(() => setMeteors(prev => prev.slice(1)), 3000);
        }, Math.random() * 5000 + 8000);
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="starscape">
            {stars.map(star => <div key={star.id} className="star" style={{ top: star.top, left: star.left, width: star.size, height: star.size, animationDuration: star.duration, animationDelay: star.delay }} />)}
            {meteors.map(meteor => <div key={meteor.id} className="meteor" style={{ top: meteor.top, left: meteor.left, animationDuration: meteor.duration }} />)}
        </div>
    );
});

const AquaticBackground: FC = memo(() => {
    const particles = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`,
        duration: `${Math.random() * 15 + 10}s`,
        delay: `${Math.random() * 10}s`,
        xStart: `${Math.random() * 20 - 10}vw`,
        xEnd: `${Math.random() * 20 - 10}vw`,
    })), []);

    const [flashes, setFlashes] = useState<{ id: number; top: string; left: string; duration: string; }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlashes(prev => [...prev, {
                id: Date.now(),
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                duration: `${Math.random() * 1 + 0.5}s`,
            }]);
            setTimeout(() => setFlashes(prev => prev.slice(1)), 2000);
        }, Math.random() * 4000 + 7000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="aquatic-background">
            {particles.map(p => <div key={p.id} className="marine-snow" style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.duration, animationDelay: p.delay, '--x-start': p.xStart, '--x-end': p.xEnd } as React.CSSProperties} />)}
            {flashes.map(f => <div key={f.id} className="biolum-flash" style={{ top: f.top, left: f.left, animationDuration: f.duration }} />)}
        </div>
    );
});

const PIPQuadrantView: FC = () => (
    <div className="pip-quadrant-view">
        <div className="pip-item">
            <h4>Cymatics</h4>
            <div className="cymatics-visualizer" />
        </div>
    </div>
);


const SolveAtmosphericsAsAbove: FC = () => (
    <>
        <div className="solve-sun" />
        <svg className="solve-electricity-svg" preserveAspectRatio="none">
            {Array.from({ length: 3 }).map((_, i) => (
                <path
                    key={i}
                    className="solve-electricity-arc"
                    d={`M 0 ${Math.random() * 100} C ${Math.random() * 100} ${Math.random() * 100}, ${Math.random() * 100} ${Math.random() * 100}, 100 ${Math.random() * 100}`}
                    style={{ animationDuration: `${Math.random() * 1 + 0.5}s`, animationDelay: `${Math.random() * 1}s` }}
                />
            ))}
        </svg>
    </>
);

const SolveAtmosphericsSoBelow: FC = () => {
    const particles = useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        delay: `${Math.random() * 3}s`,
        duration: `${Math.random() * 2 + 1}s`,
        xJitter: `${Math.random() * 100 - 50}`,
    })), []);

    const [showMermaid, setShowMermaid] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setShowMermaid(true), 5000); // Mermaid appears after 5s in solve mode
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="solve-volcano-container">
                <div className="solve-volcano-glow" />
                <div className="solve-volcano-cone" />
                <div className="solve-volcano-particles">
                    {particles.map(p => <div key={p.id} className="volcano-particle" style={{ animationDelay: p.delay, animationDuration: p.duration, '--x-jitter': p.xJitter } as React.CSSProperties} />)}
                </div>
            </div>
            <div className="solve-muddied-overlay" />
            <div className="solve-mermaid-container">
                {showMermaid && <div className="solve-mermaid-silhouette" onAnimationEnd={() => setShowMermaid(false)} />}
            </div>
        </>
    );
};

// =================================================================================================
// --- GLOBE & NAVIGATION COMPONENTS ---
// =================================================================================================

// This is a static list for now, but could be dynamic in the future.
export const CALL_SIGNS: CallSign[] = [
    { name: 'Home', lat: 31.76, lon: 35.21, color: 'primary' },
    { name: 'The Library', lat: 38.89, lon: -77.00, color: 'secondary' },
    { name: 'The Oracle', lat: 37.97, lon: 22.44, color: 'secondary' },
];

interface GlobeViewProps {
    onInplaceQuery: (callSignName: string) => void;
    onNavigate: (callSign: CallSign) => void;
    isSolveActive: boolean;
    onOpenBookmarks: () => void;
    onOpenArchive: () => void;
    onOpenManual: () => void;
    onOpenWhiteboard: () => void;
    onScreenshot: () => void;
    onDirectCommand: (command: string) => void;
}

export const GlobeView: FC<GlobeViewProps> = ({ onInplaceQuery, onNavigate, isSolveActive, onOpenBookmarks, onOpenArchive, onOpenManual, onOpenWhiteboard, onScreenshot, onDirectCommand }) => {
    const [hoveredSign, setHoveredSign] = useState<CallSign | null>(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const getPointPosition = (lat: number, lon: number) => {
        const x = (lon + 180) / 360 * 100;
        const y = (90 - lat) / 180 * 100;
        return { top: `${y}%`, left: `${x}%` };
    };

    return (
        <div className="globe-view" onMouseMove={handleMouseMove}>
            <Starscape />
            <div className="as-above-menu">
                <button onClick={onOpenBookmarks} aria-label="Open Bookmarks">📖</button>
                <button onClick={onOpenArchive} aria-label="Open Session Archive">🗄️</button>
                <button onClick={onOpenManual} aria-label="Open Operator's Manual">📜</button>
                <button onClick={onOpenWhiteboard} aria-label="Open Whiteboard">✒️</button>
                <button onClick={onScreenshot} aria-label="Take Screenshot">📸</button>
            </div>
            <div className="globe-container">
                 <svg className="globe-svg" viewBox="0 0 200 200">
                    <defs>
                        <filter id="electric-pulse-filter" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur1" />
                            <feFlood floodColor="var(--color-secondary)" floodOpacity="0.7" result="glowColor" />
                            <feComposite in="glowColor" in2="blur1" operator="in" result="coloredGlow1" />
                            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur2" />
                            <feFlood floodColor="#ffffff" result="coreColor" />
                            <feComposite in="coreColor" in2="blur2" operator="in" result="coloredGlow2" />
                            <feMerge>
                                <feMergeNode in="coloredGlow1" />
                                <feMergeNode in="coloredGlow2" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <path className="globe-coastline" d="M 10 50 C 20 30, 40 70, 60 50 S 100 80, 120 60 S 160 30, 180 50" />
                    <circle className="globe-outline" cx="100" cy="100" r="98" />
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ellipse className="globe-line" key={`long-${i}`} cx="100" cy="100" rx={Math.sin((i / 12) * Math.PI) * 98} ry="98" />
                    ))}
                    {Array.from({ length: 7 }).map((_, i) => (
                        <circle className="globe-line" key={`lat-${i}`} cx="100" cy={100 + ((i-3) * 28)} r={Math.cos(((i-3)*28)/98) * 98} />
                    ))}
                    <path className="ley-line" d="M 50 20 Q 100 50, 150 20" />
                    <path className="ley-line active" d="M 20 80 Q 50 150, 180 80" />
                    <path className="ley-line" d="M 180 150 C 100 180, 100 20, 20 50" />
                    <path className="ley-line" d="M 30 180 C 80 120, 120 120, 170 180" />
                    <path className="ley-line" d="M 175 40 Q 100 100, 25 160" />
                </svg>

                {CALL_SIGNS.map(sign => (
                    <div 
                        key={sign.name} 
                        className="call-sign-point-wrapper"
                        style={getPointPosition(sign.lat, sign.lon)}
                        onMouseEnter={() => !isSolveActive && setHoveredSign(sign)}
                        onMouseLeave={() => setHoveredSign(null)}
                        onClick={() => !isSolveActive && onInplaceQuery(sign.name)}
                        onDoubleClick={() => !isSolveActive && onNavigate(sign)}
                    >
                        <div className="call-sign-point">
                           <div className={`call-sign-point-glow color-${sign.color}`} />
                           <div className="call-sign-point-core" />
                        </div>
                        <div className="call-sign-label">{sign.name}</div>
                    </div>
                ))}

                {hoveredSign && (
                    <div className="call-sign-hover-window" style={{ top: hoverPosition.y + 20, left: hoverPosition.x + 20 }}>
                        <h3 className="hover-window-title">{hoveredSign.name}</h3>
                        <p className="hover-window-status">Resonance: Stable</p>
                        <ul className="hover-window-questions">
                            <li onClick={(e) => { e.stopPropagation(); onDirectCommand(`What is the core principle of ${hoveredSign.name}?`); }}>Core Principle?</li>
                            <li onClick={(e) => { e.stopPropagation(); onDirectCommand(`Summarize the last session in ${hoveredSign.name}.`); }}>Last Session?</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export const SoBelowView: FC<{ children: ReactNode }> = ({ children }) => (
    <div className="so-below-view">
        <AquaticBackground />
        {children}
        <PIPQuadrantView />
    </div>
);

export const CaduceusCompass: FC<{ onClick: () => void, onDoubleClick: () => void }> = ({ onClick, onDoubleClick }) => (
    <div className="caduceus-compass-container" onClick={onClick} onDoubleClick={onDoubleClick} title="Single-click for menu, double-click to toggle view">
        <svg className="caduceus-svg" viewBox="0 0 100 100">
            <line className="caduceus-staff" x1="50" y1="10" x2="50" y2="90" />
            <path className="caduceus-serpent" d="M50,90 C70,70 30,50 50,30 C70,10 30,10 50,10" />
            <path className="caduceus-serpent" d="M50,90 C30,70 70,50 50,30 C30,10 70,10 50,10" />
            <path className="caduceus-wing" d="M50,15 C40,5 20,10 20,25 C20,40 40,35 50,15" />
            <path className="caduceus-wing" d="M50,15 C60,5 80,10 80,25 C80,40 60,35 50,15" />
            <circle className="caduceus-lens" cx="50" cy="50" r="8" />
        </svg>
    </div>
);

export const SolveEKGOverlay: FC = () => (
    <div className="solve-ekg-overlay"><div className="ekg-line" /></div>
);

export const StatusTicker: FC<{ findings: SolveFinding[]; isSolveActive: boolean }> = ({ findings, isSolveActive }) => {
    if (!isSolveActive || findings.length === 0) return null;
    const content = [...findings].reverse().slice(0, 10);
    return (
        <div className="status-ticker-container">
            <div className="status-ticker-content">
                {[...content, ...content].map((finding, index) => (
                    <span key={`${finding.id}-${index}`} className="status-ticker-item">
                        <span className="type">{finding.type}:</span> {finding.content}
                    </span>
                ))}
            </div>
        </div>
    );
};

export const OracleTicker: FC<{ onSelect: (command: string) => void }> = ({ onSelect }) => {
    const questions = [
        "What is the nature of the Sephirot?", "Analyze the resonance of Genesis 1:1.", "Show me the path of the Fool in the Major Arcana.",
        "What is the relationship between 'Echad' and 'Ahavah'?", "Explain the principle of the Tetragrammaton.",
        "Compare the creation myths of Sumeria and ancient Egypt."
    ];
    const repeatedQuestions = [...questions, ...questions];

    return (
         <div className="oracle-ticker-container">
            <div className="oracle-ticker-content">
                {repeatedQuestions.map((q, i) => (
                    <span key={i} className="oracle-ticker-item" onClick={() => onSelect(q)}>
                       {q}
                    </span>
                ))}
            </div>
        </div>
    );
};


// =================================================================================================
// --- CORE UI & OVERLAYS ---
// =================================================================================================

const AlephSymbol: FC = () => (
    <svg viewBox="0 0 100 100" className="boot-entry-glyph">
        <path d="M 20 80 L 50 20 L 80 80" />
        <line x1="30" y1="60" x2="70" y2="60" />
    </svg>
);

export const BootAnimationView: FC<{ statusText: string; subText: string; isComplete: boolean; onEnter: () => void; }> = ({ statusText, subText, isComplete, onEnter }) => (
    <div className="boot-animation-view">
         <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter id="goo">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                    <feBlend in="SourceGraphic" in2="goo" />
                </filter>
            </defs>
        </svg>
        <div className="vortex-container">
            <div className="vortex-layer"></div>
            <div className="vortex-layer"></div>
            <div className="vortex-layer"></div>
        </div>
        <button className="boot-entry-button" onClick={onEnter} disabled={!isComplete} aria-label={isComplete ? "Enter the Astrian Key" : "Initializing"}>
            <AlephSymbol />
        </button>
        <div className="boot-summary-container">
            <div className="boot-summary-scroll">
                <p>{statusText}</p>
                <small>{subText}</small>
            </div>
        </div>
    </div>
);

export const ToastContainer: FC<{ toasts: Toast[]; onDismiss: (id: string) => void; }> = ({ toasts, onDismiss }) => (
    <div className="toast-container">
        {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
                {toast.message}
                <button onClick={() => onDismiss(toast.id)}>&times;</button>
            </div>
        ))}
    </div>
);

export const WelcomeOfferView: FC<{ onStartTour: () => void; onDismiss: () => void; }> = ({ onStartTour, onDismiss }) => (
    <Modal title="Welcome Inquisitor" onClose={onDismiss}>
        <div className="welcome-content">
            <p>Your instrument is calibrated. Would you like a brief tour of its core functions?</p>
            <div className="welcome-actions">
                <button onClick={onStartTour}>Begin Tour</button>
                <button onClick={onDismiss}>Proceed Unassisted</button>
            </div>
        </div>
    </Modal>
);

export const GuidedTour: FC<{ step: number; onNext: () => void; onEnd: () => void; }> = ({ step, onNext, onEnd }) => (
    <div className="guided-tour-overlay"><p>Tour Step {step + 1}</p><button onClick={onNext}>Next</button><button onClick={onEnd}>End Tour</button></div>
);

export const CrossReferenceModal: FC<{ value: number; onClose: () => void; onSynthesize: (num: number) => void; isSynthesizing: boolean; synthesisResult: string | null; }> = ({ value, onClose, onSynthesize, isSynthesizing, synthesisResult }) => (
    <Modal title={`Cross-Reference: ${value}`} onClose={onClose}>
        <div className="cross-ref-content">
            {synthesisResult ? (
                <div>
                    <h4>Synthesis Result:</h4>
                    <p>{synthesisResult}</p>
                </div>
            ) : (
                <div>
                    <p>Observe the resonance of the number <strong>{value}</strong> across the Universal Codex?</p>
                    <button onClick={() => onSynthesize(value)} disabled={isSynthesizing}>
                        {isSynthesizing ? 'Synthesizing...' : `Synthesize Connections for ${value}`}
                    </button>
                </div>
            )}
        </div>
    </Modal>
);

export const CallSignMenu: FC<{ isOpen: boolean; onClose: () => void; onSelect: (callSign: CallSign) => void; onInplaceQuery: (callSignName: string) => void; }> = ({ isOpen, onClose, onSelect, onInplaceQuery }) => {
    if (!isOpen) return null;
    return (
        <div className="call-sign-menu-overlay" onClick={onClose}>
            <div className="call-sign-menu-modal" onClick={e => e.stopPropagation()}>
                <h2>Select Destination</h2>
                <div className="call-sign-list">
                    {CALL_SIGNS.map(cs => (
                         <button key={cs.name} onDoubleClick={() => onSelect(cs)} onClick={() => onInplaceQuery(cs.name)} title={`Single-click for inplace query, double-click to navigate`}>
                           {cs.name}
                        </button>
                    ))}
                </div>
                 <small>Single-click to query, Double-click to navigate.</small>
            </div>
        </div>
    );
};

export const TransitionOverlay: FC<{ text: string | null }> = ({ text }) => {
    if (!text) return null;
    return <div className="transition-overlay"><p>{text}</p></div>;
};

// =================================================================================================
// --- FULLY IMPLEMENTED OVERLAY MODALS ---
// =================================================================================================

export const BookmarksOverlay: FC<{ isOpen: boolean; onClose: () => void; bookmarks: AIMessage[]; customTools: CustomTool[]; onSelect: (bookmark: string) => void; onDirectCommand: (command: string) => void; }> = ({ isOpen, onClose, bookmarks, customTools, onSelect, onDirectCommand }) => {
    if (!isOpen) return null;
    const favoriteCompositions = bookmarks.filter(b => b.analysisType === 'instructional');
    const otherBookmarks = bookmarks.filter(b => b.analysisType !== 'instructional');

    return (
        <Modal title="Bookmarks" onClose={onClose}>
            <div className="bookmarks-content">
                <h3 className="bookmarks-section-header">Custom Tools</h3>
                {customTools.length > 0 ? (
                    <div className="custom-tool-list">
                        {customTools.map(tool => (
                            <div key={tool.id} className="custom-tool-item" onClick={() => onDirectCommand(tool.purpose)}>
                                <span className="custom-tool-icon">{tool.icon}</span>
                                <span className="custom-tool-name">{tool.name}</span>
                            </div>
                        ))}
                    </div>
                ) : <p>No custom tools created yet.</p>}

                {otherBookmarks.length > 0 && <h3 className="bookmarks-section-header">Saved Analyses</h3>}
                {otherBookmarks.map(b => (
                    <div key={b.id} className="bookmark-item" onClick={() => onSelect(b.text)}>
                        <div className="archive-item-header">
                            <span>{b.analysisType.replace(/_/g, ' ')}</span>
                            <span>{b.timestamp.toLocaleString()}</span>
                        </div>
                        <div style={{ padding: '1rem' }}>{b.text.substring(0, 200)}...</div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export const ArchiveOverlay: FC<{ isOpen: boolean; onClose: () => void; history: SessionRecord[]; }> = ({ isOpen, onClose, history }) => {
    if (!isOpen) return null;
    const reversedHistory = [...history].reverse();
    return (
         <Modal title="Session Archive" onClose={onClose}>
            <div className="archive-list">
                {reversedHistory.map(rec => (
                    <div key={rec.id} className="archive-item">
                        <div className="archive-item-header">
                            <span>{rec.type}</span>
                            <span>{rec.timestamp.toLocaleString()}</span>
                        </div>
                         <div style={{ padding: '1rem' }}>
                            {rec.type === 'user' && (rec as UserMessage).text}
                            {rec.type === 'ai' && (rec as AIMessage).text.substring(0, 300) + '...'}
                            {rec.type === 'system' && <em>{(rec as SystemMessage).text}</em>}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export const ManualOverlay: FC<{ isOpen: boolean; onClose: () => void; manual: OperatorManual; }> = ({ isOpen, onClose, manual }) => {
    if (!isOpen) return null;
    return (
        <Modal title="Operator's Manual" onClose={onClose}>
            <div className="manual-list">
                {manual.protocols.map(p => (
                    <div key={p.title} className="protocol-item">
                        <h3>{p.title}</h3>
                        <p className="protocol-purpose">{p.purpose}</p>
                        <ul className="protocol-principles-list">
                            {p.principles.map(principle => (
                                <li key={principle.name} className="protocol-principle">
                                    <strong>{principle.name}:</strong> {principle.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export const WhiteboardOverlay: FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    const [hebrewInput, setHebrewInput] = useState('');
    const [gematriaValue, setGematriaValue] = useState(0);

    const handleTransliterate = () => {
        setGematriaValue(hebrewNetwork.calculatePathGematria(hebrewInput.split('')));
    };

    const glyphs = useMemo(() => Object.values(hebrewNetwork.getLetterformAnalysis('א') ? hebrewNetwork['letterformIndex'] : {}), []);


    return (
        <Modal title="Transliteration Whiteboard" onClose={onClose}>
            <div className="whiteboard-content">
                <div className="glyph-key-section">
                    <h3>Glyph Key</h3>
                    <div className="glyph-key-grid">
                        {glyphs.map(g => (
                            <div key={g.letter} className="glyph-key-item">
                                <span>{g.letter}</span>
                                <span>({g.gematria})</span>
                                <span>- {g.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="transliteration-section">
                    <h3>Transliteration</h3>
                     <div className="transliteration-io">
                        <textarea 
                            value={hebrewInput}
                            onChange={(e) => setHebrewInput(e.target.value)}
                            placeholder="Enter Hebrew text..."
                            rows={5}
                        />
                        <div className="transliteration-output" dir="rtl">{hebrewInput}</div>
                        <div className="gematria-output">Gematria: {gematriaValue}</div>
                    </div>
                    <div className="whiteboard-actions">
                        <button onClick={handleTransliterate}>Calculate Gematria</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

// =================================================================================================
// --- ASTRIAN INTERFACE (THE MAIN APP SHELL) ---
// =================================================================================================

// Define a type for the props that combines the return types of the two main hooks.
type AstrianInterfaceProps = ReturnType<typeof useAstrianSystem> &
  ReturnType<typeof useUserInterface> & {
    children: ReactNode;
    isSolveActive: boolean; // Explicitly pass for clarity
    onDirectCommand: (command: string) => void;
    handleCallSignInplaceQuery: (callSignName: string) => void;
    handleScreenshot: () => void;
};
  
export const AstrianInterface: FC<AstrianInterfaceProps> = (props) => {
    const {
        viewMode, isSolveActive, activeSolveSession, children, onDirectCommand,
        handleCompassClick, handleCompassDoubleClick, handleCallSignSelect,
        isBookmarksOpen, setIsBookmarksOpen, bookmarks, customTools, handleBookmarkSelect,
        isArchiveOpen, setIsArchiveOpen, sessionHistory,
        isManualOpen, setIsManualOpen,
        isWhiteboardOpen, setIsWhiteboardOpen,
        isCallSignMenuOpen, setIsCallSignMenuOpen, handleCallSignInplaceQuery,
        crossRefValue, setCrossRefValue, handleSynthesizeConnections, isSynthesizing, synthesisResult,
        handleScreenshot,
    } = props;
    
    const manual = useMemo(() => codex.getOperatorsManual(), []);

    const containerClasses = [
        'app-container',
        `view-mode-${viewMode === 'globe' ? 'globe' : 'callSign'}`,
        isSolveActive ? 'solve-active' : ''
    ].filter(Boolean).join(' ');
    
    return (
        <div className={containerClasses} style={{ '--solve-intensity': isSolveActive ? activeSolveSession.findings.slice(-1)[0]?.confidence ?? 0 : 0 } as React.CSSProperties}>
            <StatusTicker findings={activeSolveSession.findings} isSolveActive={isSolveActive} />
            
            <div className="dual-hemisphere-container">
                {isSolveActive && viewMode === 'globe' && <SolveAtmosphericsAsAbove />}
                {isSolveActive && viewMode === 'callSign' && <SolveAtmosphericsSoBelow />}
                
                <GlobeView 
                    onInplaceQuery={handleCallSignInplaceQuery}
                    onNavigate={handleCallSignSelect}
                    isSolveActive={isSolveActive}
                    onOpenBookmarks={() => setIsBookmarksOpen(true)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                    onOpenManual={() => setIsManualOpen(true)}
                    onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
                    onScreenshot={handleScreenshot}
                    onDirectCommand={onDirectCommand}
                />
                
                <SoBelowView>
                    <OracleTicker onSelect={onDirectCommand} />
                    {children}
                </SoBelowView>
            </div>
            
            <CaduceusCompass onClick={handleCompassClick} onDoubleClick={handleCompassDoubleClick} />
            
            {isSolveActive && <SolveEKGOverlay />}

            {/* Modals & Overlays */}
            <BookmarksOverlay isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} bookmarks={bookmarks} customTools={customTools} onSelect={handleBookmarkSelect} onDirectCommand={onDirectCommand} />
            <ArchiveOverlay isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} history={sessionHistory} />
            <ManualOverlay isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} manual={manual} />
            <WhiteboardOverlay isOpen={isWhiteboardOpen} onClose={() => setIsWhiteboardOpen(false)} />
            <CallSignMenu isOpen={isCallSignMenuOpen} onClose={() => setIsCallSignMenuOpen(false)} onSelect={handleCallSignSelect} onInplaceQuery={handleCallSignInplaceQuery} />
            
            {crossRefValue !== null && (
                <CrossReferenceModal 
                    value={crossRefValue} 
                    onClose={() => setCrossRefValue(null)} 
                    onSynthesize={handleSynthesizeConnections} 
                    isSynthesizing={isSynthesizing} 
                    synthesisResult={synthesisResult} 
                />
            )}
            
            <TransitionOverlay text={props.transitionText} />
        </div>
    );
};

// =================================================================================================
// --- SPECIALIZED & SESSION VIEWS ---
// =================================================================================================

export const SessionUnlockView: FC<{ onUnlock: (password: string) => void; challenge: VisualChallenge; isLoading: boolean; onRegenerate: () => void; }> = ({ onUnlock, challenge, isLoading, onRegenerate }) => {
    const [password, setPassword] = useState('');
    return (
        <div className="session-unlock-view">
            <h3>Session Locked</h3>
            <p>To continue, identify the core concept.</p>
            <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter passphrase..." />
            <button onClick={() => onUnlock(password)} disabled={isLoading}>{isLoading ? 'Verifying...' : 'Unlock'}</button>
            <button onClick={onRegenerate} disabled={isLoading}>Regenerate Challenge</button>
        </div>
    );
};
export const MeditationView: FC<{ script: string; imagePrompts: string[]; onFinish: () => void; }> = ({ script, onFinish }) => (
    <div className="meditation-view">
        <h2>Guided Meditation</h2>
        <p>{script}</p>
        <button onClick={onFinish}>Finish Meditation</button>
    </div>
);
export const StelaCalibrationView: FC<{ onComplete: (data: AWEFormData) => void; }> = ({ onComplete }) => (
    <div className="stela-calibration-view">
        <h2>Stela Calibration</h2>
        <p>Calibration required to proceed.</p>
    </div>
);
export const InstructionalCompositionView: FC<{ session: InstructionalCompositionSession; onStop: () => void; }> = ({ session, onStop }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { analyserNode, audioUrl, composition } = session;

    useEffect(() => {
        if (!canvasRef.current || !analyserNode) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
        
        const renderFrame = () => {
            analyserNode.getByteTimeDomainData(dataArray);
            
            ctx.fillStyle = '#030617';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#38bdf8';
            
            ctx.beginPath();
            const sliceWidth = canvas.width * 1.0 / analyserNode.frequencyBinCount;
            let x = 0;
            
            for(let i = 0; i < analyserNode.frequencyBinCount; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height/2;
        
                if(i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
        
                x += sliceWidth;
            }
            
            ctx.lineTo(canvas.width, canvas.height/2);
            ctx.stroke();

            animationFrameId = requestAnimationFrame(renderFrame);
        };
        renderFrame();
        return () => cancelAnimationFrame(animationFrameId);
    }, [analyserNode]);

    return (
        <div className="timeline-item timeline-item-ai">
            <div className="timeline-item-content">
                <div className="analysis-view-wrapper">
                    <h3>{composition.metadata.sourceReference}</h3>
                    <p>Playing at {composition.metadata.bpm} BPM in {composition.metadata.key} {composition.metadata.mode}</p>
                    <canvas ref={canvasRef} className="cymatics-visualizer" width="300" height="150" />
                    <audio src={audioUrl} controls autoPlay onEnded={onStop} />
                    <div className="composition-controls">
                        <button onClick={onStop}>Stop</button>
                        <a href={audioUrl} download={`${composition.metadata.sourceReference}.wav`}>Download</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
export const EntrainmentView: FC<{ session: ActiveEntrainmentSession; onStop: () => void; }> = ({ session, onStop }) => (
    <div className="entrainment-view">
        <h3>Entrainment Active</h3>
        <p>{session.profile.name}</p>
        <p>{session.profile.description}</p>
        <button onClick={onStop}>Stop Entrainment</button>
    </div>
);
export const EmergentCTA: FC<{ onTrigger: (command: string) => void; lastMessage: AIMessage | null; }> = ({ onTrigger, lastMessage }) => {
    if (!lastMessage || lastMessage.analysisType !== 'beale_cipher_solution') return null;
    return (
        <div className="emergent-cta">
            <button onClick={() => onTrigger('°narrow search grid')}>Refine Search Grid</button>
        </div>
    );
};
export const CameraView: FC<{ onCapture: (imageDataUrl: string) => void; onCancel: () => void; }> = ({ onCapture, onCancel }) => (
    <div className="camera-view"><h3>Camera Capture</h3><button onClick={() => onCapture('data:image/png;base64, ...')}>Capture</button><button onClick={onCancel}>Cancel</button></div>
);
export const VoiceRecorderView: FC<{ onRecord: (audioBlob: Blob) => void; onCancel: () => void; }> = ({ onRecord, onCancel }) => (
    <div className="voice-recorder-view"><h3>Voice Recorder</h3><button onClick={() => onRecord(new Blob())}>Stop Recording</button><button onClick={onCancel}>Cancel</button></div>
);


// =================================================================================================
// --- TIMELINE ITEM COMPONENTS ---
// =================================================================================================

const AnalysisActions: FC<{ message: AIMessage; onToggleBookmark: (id: string) => void; isBookmarked: boolean; }> = ({ message, onToggleBookmark, isBookmarked }) => (
    <div className="analysis-actions">
        <button onClick={() => onToggleBookmark(message.id)} className={`analysis-action-btn ${isBookmarked ? 'bookmarked' : ''}`} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
            {isBookmarked ? '★' : '☆'}
        </button>
    </div>
);

const GematriaAnalysisView: FC<{ analysis: GematriaAnalysis }> = ({ analysis }) => (
    <div className="analysis-view-wrapper">
        <h3>Gematria: {analysis.word}</h3>
        <div className="gematria-grid">
            <div className="gematria-item"><span>Standard</span><span>{analysis.standard}</span></div>
            <div className="gematria-item"><span>Kolel</span><span>{analysis.kolel}</span></div>
        </div>
    </div>
);

const InteractiveText: FC<{ text: string; onNumberClick: (num: number) => void; }> = ({ text, onNumberClick }) => {
    const parts = text.split(/(\b\d+\b)/g);
    return (
        <>
            {parts.map((part, i) =>
                /^\d+$/.test(part) ? (
                    <span key={i} className="interactive-number" onClick={() => onNumberClick(parseInt(part, 10))}>
                        {part}
                    </span>
                ) : (
                    <React.Fragment key={i}>{part}</React.Fragment>
                )
            )}
        </>
    );
};

const AnalysisRenderer: FC<{ message: AIMessage; onNumberClick: (num: number) => void; }> = ({ message, onNumberClick }) => {
    switch (message.analysisType) {
        case 'beale_cipher_solution':
            return <div className="analysis-view-wrapper"><BealeCipherSolutionView solution={message.result as BealeCipherSolution} /></div>;
        case 'beale_treasure_map':
            return <div className="analysis-view-wrapper"><BealeTreasureMapView analysis={message.result as BealeTreasureMapAnalysis} /></div>;
        case 'gematria':
            return <GematriaAnalysisView analysis={message.result as GematriaAnalysis} />;
        default:
            return <div className="timeline-item-text-content"><p><InteractiveText text={message.text} onNumberClick={onNumberClick} /></p></div>;
    }
};

const ImageTimelineItem: FC<{ result: ScriedImageResult }> = ({ result }) => (
    <div className="timeline-item-content">
        <img 
            src={`data:image/png;base64,${result.imageData}`} 
            alt={`Scried vision of: ${result.prompt}`} 
            className="timeline-item-media"
        />
        <p className="timeline-item-caption">A vision of: <em>{result.prompt}</em></p>
    </div>
);

const VideoTimelineItem: FC<{ result: ChronovisedVideoResult }> = ({ result }) => (
    <div className="timeline-item-content">
        <video 
            src={result.videoUrl} 
            controls 
            autoPlay 
            loop 
            muted
            className="timeline-item-media"
        />
         <p className="timeline-item-caption">A memory of: <em>{result.prompt}</em></p>
    </div>
);

// =================================================================================================
// --- TIMELINE VIEW & COMMAND GUIDE ---
// =================================================================================================

interface TimelineViewProps {
    history: SessionRecord[];
    error: string | null;
    onRetry: () => void;
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    isListening: boolean;
    onStartListening: (callback: (text: string) => void) => void;
    bookmarks: AIMessage[];
    onToggleBookmark: (id: string) => void;
    isVoiceEnabled: boolean;
    onNumberInteract: (num: number) => void;
}

export const TimelineView: FC<TimelineViewProps> = ({ history, error, onRetry, input, onInputChange, onSend, isListening, onStartListening, bookmarks, onToggleBookmark, isVoiceEnabled, onNumberInteract }) => {
    const timelineEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    return (
        <div className="timeline-view-container">
            <div className="timeline-view">
                {history.map((message) => {
                    switch (message.type) {
                        case 'user':
                            return (
                                <div key={message.id} className="timeline-item timeline-item-user">
                                    <div className="timeline-item-content"><div className="timeline-item-text-content">{(message as UserMessage).text}</div></div>
                                </div>
                            );
                        case 'system': {
                             const sysMessage = message as SystemMessage;
                             const isSuggestion = sysMessage.text.startsWith('Suggestion:');
                             const itemClass = isSuggestion ? 'timeline-item-suggestion' : 'timeline-item-system';
                             const content = isSuggestion ? (
                                 <>
                                     <span className="suggestion-header">System Resonance</span>
                                     {sysMessage.text.replace('Suggestion:', '').trim()}
                                 </>
                             ) : sysMessage.text;

                            return <div key={message.id} className={`timeline-item ${itemClass}`}><div className="timeline-item-content">{content}</div></div>;
                        }
                        case 'ai': {
                            const aiMessage = message as AIMessage;
                            const isBookmarked = bookmarks.some(b => b.id === aiMessage.id);
                            let itemClass = "timeline-item-ai";
                            if (aiMessage.analysisType === 'scried_image') itemClass += " timeline-item-image";
                            if (aiMessage.analysisType === 'chronovised_video') itemClass += " timeline-item-video";

                            return (
                                <div key={message.id} className={`timeline-item ${itemClass}`} role="log" aria-live="polite">
                                    {aiMessage.analysisType === 'scried_image' ? (
                                        <ImageTimelineItem result={aiMessage.result as ScriedImageResult} />
                                    ) : aiMessage.analysisType === 'chronovised_video' ? (
                                        <VideoTimelineItem result={aiMessage.result as ChronovisedVideoResult} />
                                    ) : (
                                        <div className="timeline-item-content">
                                            <AnalysisActions message={aiMessage} onToggleBookmark={onToggleBookmark} isBookmarked={isBookmarked} />
                                            <AnalysisRenderer message={aiMessage} onNumberClick={onNumberInteract} />
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        default:
                            return null;
                    }
                })}
                {error && <div className="timeline-item timeline-item-ai"><div className="error-bubble"><p>{error}</p><button onClick={onRetry}>Retry</button></div></div>}
                 <div ref={timelineEndRef} />
            </div>
            <div className="chat-input-area">
                <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
                     {isVoiceEnabled && <button type="button" className={`voice-input-btn ${isListening ? 'listening' : ''}`} onClick={() => onStartListening(onInputChange)} disabled={!isVoiceEnabled || isListening} aria-label="Start voice input">🎤</button>}
                    <input type="text" className="chat-input" value={input} onChange={(e) => onInputChange(e.target.value)} placeholder="Initiate query..." />
                    <button type="submit" className="chat-submit-btn" disabled={!input.trim()}>➤</button>
                </form>
            </div>
        </div>
    );
};


interface CommandGuideProps {
    onCommandSelect: (command: string) => void;
    onOpenIngest: () => void;
    isAweComplete: boolean;
    onStartTour: () => void;
    isFirstVisit: boolean;
    onDownloadArchive: () => void;
}

export const CommandGuide: FC<CommandGuideProps> = ({ onCommandSelect, onOpenIngest, isAweComplete, onStartTour, isFirstVisit, onDownloadArchive }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="command-guide-container">
            {isOpen && (
                <div className="command-guide-menu">
                    <button className="command-guide-item" onClick={() => { onCommandSelect('°solve '); setIsOpen(false); }}>°solve <small>Initiate deep analysis</small></button>
                    <button className="command-guide-item" onClick={() => { onCommandSelect('°compose '); setIsOpen(false); }}>°compose <small>Generate music from text</small></button>
                    <button className="command-guide-item" onClick={() => { onCommandSelect('°scry '); setIsOpen(false); }}>°scry <small>Transcribe a vision</small></button>
                    <button className="command-guide-item" onClick={() => { onCommandSelect('°chronovise '); setIsOpen(false); }}>°chronovise <small>Transcribe a memory</small></button>
                    <button className="command-guide-item" onClick={() => { onDownloadArchive(); setIsOpen(false); }}>Download Archive</button>
                    {isFirstVisit && <button className="command-guide-item" onClick={() => { onStartTour(); setIsOpen(false); }}>Start Tour</button>}
                </div>
            )}
            <button className="command-guide-button" onClick={() => setIsOpen(!isOpen)} aria-label="Open command guide">°</button>
        </div>
    );
};

// =================================================================================================
// --- FULLY IMPLEMENTED VIEWS (HOME, LIBRARY, ORACLE) ---
// =================================================================================================

const AppIcon: FC<{ name: string, icon: string, onClick: () => void }> = ({ name, icon, onClick }) => (
    <div className="app-icon" onClick={onClick}>
        <div className="app-icon-glyph">{icon}</div>
        <div className="app-icon-name">{name}</div>
    </div>
);

const ToolCreatorWidget: FC<{ onSave: (tool: Omit<CustomTool, "id">) => void; onClose: () => void }> = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('✨');
    const [purpose, setPurpose] = useState('');
    
    const handleSave = () => {
        if (name && purpose) {
            onSave({ name, icon, purpose });
            onClose();
        }
    };
    return (
        <div className="widget-content">
            <div className="tool-creator">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tool Name (e.g., Daily Tarot)" />
                <input type="text" value={icon} onChange={e => setIcon(e.target.value)} placeholder="Icon (e.g., ✨)" />
                <textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Purpose/Command (e.g., °tarot_pull)" rows={4}></textarea>
                <button onClick={handleSave}>Save Tool</button>
            </div>
        </div>
    );
};

const NotepadWidget: FC<{ content: string; onContentChange: (newContent: string) => void }> = ({ content, onContentChange }) => (
    <div className="widget-content">
        <textarea 
            className="notepad-widget-textarea"
            value={content}
            onChange={e => onContentChange(e.target.value)}
            placeholder="Scratchpad..."
        />
    </div>
);

const Widget: FC<{
    widget: WidgetState;
    children: ReactNode;
    onClose: (id: string) => void;
    onUpdate: (widget: WidgetState) => void;
}> = ({ widget, children, onClose, onUpdate }) => {
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const header = element.querySelector('.widget-header');
        if (!header) return;
        
        const onMouseDown = (e: MouseEvent) => {
            if (e.target !== header) return;
            const startX = e.clientX - element.offsetLeft;
            const startY = e.clientY - element.offsetTop;
            const onMouseMove = (moveEvent: MouseEvent) => {
                onUpdate({ ...widget, position: { x: moveEvent.clientX - startX, y: moveEvent.clientY - startY } });
            };
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };
        header.addEventListener('mousedown', onMouseDown as EventListener);
        return () => header.removeEventListener('mousedown', onMouseDown as EventListener);
    }, [widget, onUpdate]);

    return (
        <div ref={ref} className="widget" style={{ left: widget.position.x, top: widget.position.y, width: widget.size.width, height: widget.size.height }}>
            <div className="widget-header">
                <span className="widget-icon">{widget.type === 'creator' ? '🛠️' : '📝'}</span>
                <span className="widget-title">{widget.type === 'creator' ? 'Tool Creator' : 'Notepad'}</span>
                <button onClick={() => onClose(widget.id)} className="widget-close-btn">&times;</button>
            </div>
            {children}
        </div>
    );
};

interface HomeViewProps {
    customTools: CustomTool[];
    widgets: WidgetState[];
    setWidgets: (widgets: WidgetState[]) => void;
    handleSaveTool: (tool: Omit<CustomTool, "id">) => void;
    addToast: (message: string, type?: Toast['type']) => void;
    onDirectCommand: (command: string) => void;
    homeTimelineProps: TimelineViewProps;
}

export const HomeView: FC<HomeViewProps> = ({ customTools, widgets, setWidgets, handleSaveTool, addToast, onDirectCommand, homeTimelineProps }) => {
    
    const addWidget = (type: 'creator' | 'notepad') => {
        const newWidget: WidgetState = {
            id: `widget-${Date.now()}`,
            type,
            position: { x: Math.random() * 50, y: Math.random() * 50 },
            size: { width: 300, height: 220 },
            content: '',
        };
        setWidgets([...widgets, newWidget]);
    };

    const removeWidget = (id: string) => {
        setWidgets(widgets.filter(w => w.id !== id));
    };
    
    const updateWidget = (updatedWidget: WidgetState) => {
        setWidgets(widgets.map(w => w.id === updatedWidget.id ? updatedWidget : w));
    };

    return (
        <div className="home-view">
            <div className="vortex-background" />
            <div className="home-view-content">
                <div className="home-view-layout">
                    <div className="home-chat-panel">
                        <TimelineView {...homeTimelineProps} />
                    </div>
                    <div className="home-widget-panel">
                        <div className="app-launcher">
                            <AppIcon name="Tool Creator" icon="🛠️" onClick={() => addWidget('creator')} />
                            <AppIcon name="Notepad" icon="📝" onClick={() => addWidget('notepad')} />
                        </div>
                        <div className="widget-area">
                             {widgets.map(widget => (
                                 <Widget key={widget.id} widget={widget} onClose={removeWidget} onUpdate={updateWidget}>
                                    {widget.type === 'creator' && <ToolCreatorWidget onSave={handleSaveTool} onClose={() => removeWidget(widget.id)} />}
                                    {widget.type === 'notepad' && (
                                        <NotepadWidget 
                                            content={widget.content || ''} 
                                            onContentChange={(newContent) => updateWidget({ ...widget, content: newContent })} 
                                        />
                                    )}
                                </Widget>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface CallSignSandboxViewProps {
    callSign: 'Library' | 'Oracle';
    chatProps: TimelineViewProps;
    guideProps: CommandGuideProps;
    addToast: (message: string, type?: Toast['type']) => void;
    onDirectCommand: (command: string) => void;
}

const CallSignSandboxView: FC<CallSignSandboxViewProps> = ({ callSign, chatProps, guideProps, addToast, onDirectCommand }) => {
    const themeClass = callSign === 'Library' ? 'call-sign-theme-library' : 'call-sign-theme-oracle';
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            onDirectCommand(`Search the ${callSign} for: ${searchTerm}`);
            setSearchTerm('');
        } else {
            addToast('Please enter a search term.', 'info');
        }
    };

    return (
        <div className={`call-sign-sandbox-wrapper ${themeClass}`}>
            <div className="sandbox-container">
                <h3>The {callSign}</h3>
                 <div className="sandbox-tools">
                    <button onClick={() => onDirectCommand('°archetype_draw')}>Draw Archetype</button>
                    <button onClick={() => onDirectCommand('°gematria ')}>Gematria Calculator</button>
                    <input 
                        type="text" 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        placeholder={`Search the ${callSign}...`} 
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div className="app-content-wrapper">
                <TimelineView {...chatProps} />
                <CommandGuide {...guideProps} />
            </div>
        </div>
    );
};

export const LibraryView: FC<{ chatProps: TimelineViewProps; guideProps: CommandGuideProps; addToast: (message: string, type?: Toast['type']) => void; onDirectCommand: (command: string) => void; }> = (props) => (
    <CallSignSandboxView callSign="Library" {...props} />
);

export const OracleView: FC<{ chatProps: TimelineViewProps; guideProps: CommandGuideProps; addToast: (message: string, type?: Toast['type']) => void; onDirectCommand: (command: string) => void; }> = (props) => (
    <CallSignSandboxView callSign="Oracle" {...props} />
);

// =================================================================================================
// --- LEGACY ANALYSIS VIEW STUBS ---
// =================================================================================================
export const BealeCipherSolutionView: FC<{ solution: BealeCipherSolution; }> = ({ solution }) => (
    <div>
        <h3>{solution.title}</h3>
        <p className="overview">{solution.summary}</p>
    </div>
);

export const BealeTreasureMapView: FC<{ analysis: BealeTreasureMapAnalysis; }> = ({ analysis }) => (
    <div className="beale-treasure-map-view">
        <h3>{analysis.title}</h3>
        <p className="overview">{analysis.overview}</p>
    </div>
);
