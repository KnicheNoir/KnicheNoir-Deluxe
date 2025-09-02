import React, { useState, useMemo, useEffect, useRef, useCallback, memo, FC, ReactNode } from 'react';
import { SessionRecord, Toast, AIMessage, UserMessage, SystemMessage, VisualChallenge, InstructionalCompositionSession, ActiveEntrainmentSession, SolveFinding, VoynichAnalysisResult, ComponentMessage, VoynichDeepAnalysisResult, CallSign, VoynichTranslationResult, ActiveSolveSession, ViewMode, MusicalComposition, MeditationResult, VeracityEntry, GlyphStateEntry, OperatorManual, OperatorProtocol, BealeCipherSolution } from './types';
import { codex } from './codex';
import { toPng } from 'html-to-image';

// =================================================================================================
// --- UI FRAMEWORK & PRESENTATION LOGIC ---
// =================================================================================================

// FIX: Added and exported the CALL_SIGNS constant to be used in the `useUserInterface` hook, resolving the import error.
export const CALL_SIGNS: CallSign[] = [
    { name: 'Home', lat: 31.7683, lon: 35.2137, color: 'primary' }, // Jerusalem
    { name: 'The Library', lat: 30.0444, lon: 31.2357, color: 'secondary' }, // Cairo
    { name: 'The Oracle', lat: 38.4824, lon: 22.5212, color: 'secondary' }, // Delphi
];

/**
 * The root presentation component for the Astrian Key.
 * It takes the state from the system and UI hooks and orchestrates the
 * rendering of all primary views, overlays, and global elements.
 */
interface AstrianInterfaceProps {
    // From useAstrianSystem
    isSolveActive: boolean;
    chakraTheme: string;
    activeSolveSession: ActiveSolveSession;
    toasts: Toast[];
    dismissToast: (id: string) => void;
    showWelcomeOffer: boolean;
    startTour: () => void;
    handleDismissWelcomeOffer: () => void;
    isTourActive: boolean;
    tourStep: number;
    setTourStep: (step: number) => void;
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

// Helper components used by AstrianInterface (placeholders to ensure compilation)
const ORACLE_COMMANDS = [
    '°solve the voynich manuscript',
    '°meditate on unity',
    '°compose a song from Genesis 1:1',
    '°entrain theta wave',
    '°instruct me on overcoming fear'
];

export const StatusTicker: FC<{findings: SolveFinding[]}> = memo(({ findings }) => {
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
export const SoBelowView: FC<any> = ({ children, onCompassDoubleClick }) => <div className="so-below-view">{children}<div className="caduceus-compass-wrapper" onDoubleClick={onCompassDoubleClick}><span className="caduceus-compass">☤</span></div></div>;
export const SystemHeartbeat: FC = () => <div className="system-heartbeat">♥</div>;
export const SolveEKGOverlay: FC = () => <div className="solve-ekg-overlay"><div className="ekg-line" /></div>;

// NEW COMPONENT
interface AsAboveMenuProps {
    onOpenBookmarks: () => void;
    onOpenArchive: () => void;
    onOpenManual: () => void;
    onOpenWhiteboard: () => void;
}
export const AsAboveMenu: FC<AsAboveMenuProps> = ({ onOpenBookmarks, onOpenArchive, onOpenManual, onOpenWhiteboard }) => {
    return (
        <div className="as-above-menu">
            <button onClick={onOpenWhiteboard} aria-label="Open Whiteboard" title="Open Whiteboard">🔬</button>
            <button onClick={onOpenManual} aria-label="Open Operator's Manual" title="Open Operator's Manual">🔧</button>
            <button onClick={onOpenArchive} aria-label="Open Session Archive" title="Open Session Archive">📜</button>
            <button onClick={onOpenBookmarks} aria-label="Open Bookmarks" title="Open Bookmarks">📖</button>
        </div>
    );
};

const Starscape: FC = () => {
    const [stars, setStars] = useState<any[]>([]);
    const [meteors, setMeteors] = useState<any[]>([]);

    useEffect(() => {
        const generatedStars = Array.from({ length: 150 }).map(() => ({
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
        }));
        setStars(generatedStars);

        const meteorInterval = setInterval(() => {
            const id = Date.now();
            const duration = Math.random() * 2 + 1;
            const newMeteor = {
                id,
                top: `${Math.random() * 60}%`,
                left: '-10%',
                animationDuration: `${duration}s`,
            };
            setMeteors(prev => [...prev, newMeteor]);

            setTimeout(() => {
                setMeteors(prev => prev.filter(m => m.id !== id));
            }, duration * 1000);

        }, 7000);

        return () => clearInterval(meteorInterval);
    }, []);

    return (
        <div className="starscape">
            {stars.map((star, i) => (
                <div
                    key={i}
                    className="star"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        animationDelay: star.animationDelay,
                        animationDuration: star.animationDuration,
                    }}
                />
            ))}
            {meteors.map(meteor => (
                 <div
                    key={meteor.id}
                    className="meteor"
                    style={{
                        top: meteor.top,
                        left: meteor.left,
                        animationDuration: meteor.animationDuration,
                    }}
                 />
            ))}
        </div>
    );
};

const WireframeGlobe: FC<{ rotation: { x: number, y: number }, onCallSignSelect: (callSign: CallSign) => void }> = ({ rotation, onCallSignSelect }) => {
    const size = 400;
    const center = size / 2;
    const radius = size * 0.45;

    const project = useCallback((lat: number, lon: number) => {
        const latRad = lat * Math.PI / 180;
        const lonRad = lon * Math.PI / 180;
        const rotYRad = rotation.y * Math.PI / 180;
        const rotXRad = rotation.x * Math.PI / 180;

        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        const cosLon = Math.cos(lonRad - rotYRad);
        const sinLon = Math.sin(lonRad - rotYRad);
        const cosRotX = Math.cos(rotXRad);
        const sinRotX = Math.sin(rotXRad);

        const x = cosLat * sinLon;
        const y = cosRotX * sinLat - sinRotX * cosLat * cosLon;
        const z = sinRotX * sinLat + cosRotX * cosLat * cosLon;

        return {
            x: center + radius * x,
            y: center - radius * y,
            z: z,
        };
    }, [rotation, center, radius]);

    const projectedCallSigns = useMemo(() => {
        return CALL_SIGNS.map(cs => ({
            ...cs,
            projection: project(cs.lat, cs.lon)
        })).sort((a, b) => a.projection.z - b.projection.z);
    }, [project]);

    const renderGrid = () => {
        const lines = [];
        const numLines = 12;

        // Longitude lines
        for (let i = 0; i < numLines; i++) {
            const lon = (i / numLines) * 360 - 180;
            let d = "M";
            for (let j = -90; j <= 90; j += 5) {
                const { x, y, z } = project(j, lon);
                if (z > 0) {
                    d += `${x},${y} `;
                }
            }
            lines.push(<path key={`lon-${i}`} d={d.trim()} className="globe-line" />);
        }

        // Latitude lines
        for (let i = 1; i < numLines / 2; i++) {
            const lat = i * (180 / numLines);
            let d1 = "M";
            let d2 = "M";
            for (let j = 0; j <= 360; j += 5) {
                const { x, y, z } = project(lat, j);
                if (z > 0) d1 += `${x},${y} `;
                const { x: x2, y: y2, z: z2 } = project(-lat, j);
                if (z2 > 0) d2 += `${x},${y} `;
            }
            lines.push(<path key={`lat-${i}`} d={d1.trim()} className="globe-line" />);
            lines.push(<path key={`lat--${i}`} d={d2.trim()} className="globe-line" />);
        }
        return lines;
    };

    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="globe-svg">
            <defs>
                <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx={center} cy={center} r={radius} fill="url(#glow)" />
            {renderGrid()}
            <circle cx={center} cy={center} r={radius} className="globe-outline" />
            {projectedCallSigns.map(cs => {
                if (cs.projection.z <= 0) return null;
                const color = cs.color === 'primary' ? 'var(--color-primary)' : 'var(--color-secondary)';
                return (
                    <g key={cs.name} className="call-sign-point" onClick={() => onCallSignSelect(cs)} style={{ opacity: cs.projection.z }}>
                        <title>{cs.name}</title>
                        <circle cx={cs.projection.x} cy={cs.projection.y} r="8" fill={color} fillOpacity="0.2" />
                        <circle className="call-sign-point-glow" cx={cs.projection.x} cy={cs.projection.y} r="4" stroke={color} fill="none" />
                        <circle className="call-sign-point-core" cx={cs.projection.x} cy={cs.projection.y} r="1.5" />
                        <text className="call-sign-label" x={cs.projection.x} y={cs.projection.y - 10}>{cs.name}</text>
                    </g>
                );
            })}
        </svg>
    );
};

export const GlobeView: FC<any> = ({ onCompassDoubleClick, onOpenBookmarks, onOpenArchive, onOpenManual, handleCallSignSelect, onOpenWhiteboard }) => {
    const DRAG_SENSITIVITY = 0.25;
    const INERTIA_DAMPING = 0.95;
    const INERTIA_STOP_THRESHOLD = 0.1;
    const CLICK_DRAG_THRESHOLD = 5; // pixels

    const [rotation, setRotation] = useState({ x: 15, y: -45 });
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0, rotX: 0, rotY: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const lastPosRef = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number | null>(null);

    const inertiaLoop = useCallback(() => {
        if (Math.abs(velocityRef.current.x) < INERTIA_STOP_THRESHOLD && Math.abs(velocityRef.current.y) < INERTIA_STOP_THRESHOLD) {
            stopInertia();
            return;
        }

        setRotation(prev => ({
            x: Math.max(-90, Math.min(90, prev.x - velocityRef.current.y)),
            y: prev.y + velocityRef.current.x
        }));

        velocityRef.current.x *= INERTIA_DAMPING;
        velocityRef.current.y *= INERTIA_DAMPING;
        animationFrameRef.current = requestAnimationFrame(inertiaLoop);
    }, []);

    const stopInertia = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        stopInertia();
        isDraggingRef.current = false; // Not a drag until mouse moves
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            rotX: rotation.x,
            rotY: rotation.y
        };
        lastPosRef.current = { x: e.clientX, y: e.clientY };
        velocityRef.current = { x: 0, y: 0 };
    };

    const handleMouseUp = useCallback(() => {
        if (isDraggingRef.current) {
            isDraggingRef.current = false;
            animationFrameRef.current = requestAnimationFrame(inertiaLoop);
        }
    }, [inertiaLoop]);
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (e.buttons !== 1) { // Check if primary mouse button is pressed
            if (isDraggingRef.current) handleMouseUp(); // End drag if button was released outside window
            return;
        }

        const { x: startX, y: startY } = dragStartRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!isDraggingRef.current && (Math.abs(dx) > CLICK_DRAG_THRESHOLD || Math.abs(dy) > CLICK_DRAG_THRESHOLD)) {
            isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
            setRotation({
                x: Math.max(-90, Math.min(90, dragStartRef.current.rotX - dy * DRAG_SENSITIVITY)),
                y: dragStartRef.current.rotY + dx * DRAG_SENSITIVITY
            });

            velocityRef.current = {
                x: (e.clientX - lastPosRef.current.x) * DRAG_SENSITIVITY,
                y: (e.clientY - lastPosRef.current.y) * DRAG_SENSITIVITY
            };
            lastPosRef.current = { x: e.clientX, y: e.clientY };
        }
    };
    
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDraggingRef.current) {
                handleMouseUp();
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            stopInertia();
        };
    }, [handleMouseUp]);

    return (
        <div className="globe-view" onMouseMove={handleMouseMove}>
            <Starscape />
            <AsAboveMenu onOpenBookmarks={onOpenBookmarks} onOpenArchive={onOpenArchive} onOpenManual={onOpenManual} onOpenWhiteboard={onOpenWhiteboard} />
            <div className="globe-container" onMouseDown={handleMouseDown}>
                 <WireframeGlobe rotation={rotation} onCallSignSelect={handleCallSignSelect} />
            </div>
             <div className="caduceus-compass-wrapper" onDoubleClick={onCompassDoubleClick}>
                <span className="caduceus-compass">☤</span>
            </div>
        </div>
    );
};

// NEW COMPONENT
interface BookmarksViewProps {
    isOpen: boolean;
    onClose: () => void;
    bookmarks: AIMessage[];
    onNumberInteract: (num: number) => void;
    onToggleBookmark: (id: string) => void;
}
export const BookmarksView: FC<BookmarksViewProps> = ({ isOpen, onClose, bookmarks, onNumberInteract, onToggleBookmark }) => {
    if (!isOpen) return null;

    return (
        <div className="bookmarks-overlay" onClick={onClose}>
            <div className="bookmarks-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close Bookmarks">×</button>
                <h2>Bookmarks</h2>
                <div className="bookmarks-list">
                    {bookmarks.length > 0 ? (
                        [...bookmarks].reverse().map(bookmark => ( // Show newest first
                            <div key={bookmark.id} className="bookmark-item">
                                <AIMessageContent
                                    message={bookmark}
                                    onNumberInteract={onNumberInteract}
                                    isBookmarked={true}
                                    onToggleBookmark={onToggleBookmark}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No bookmarks yet. Click the ☆ icon on an analysis to save it here.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// NEW COMPONENT: SessionArchiveView
interface SessionArchiveViewProps {
    isOpen: boolean;
    onClose: () => void;
    history: SessionRecord[];
    onNumberInteract: (num: number) => void;
    onToggleBookmark: (id: string) => void;
    bookmarks: AIMessage[];
}

export const SessionArchiveView: FC<SessionArchiveViewProps> = ({ isOpen, onClose, history, onNumberInteract, onToggleBookmark, bookmarks }) => {
    if (!isOpen) return null;

    const archivedAnalyses = useMemo(() => {
        return history.filter(record => 
            record.type === 'ai' && record.analysisType && record.analysisType !== 'chat'
        ) as AIMessage[];
    }, [history]);

    return (
        <div className="archive-overlay" onClick={onClose}>
            <div className="archive-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close Archive">×</button>
                <h2>Session Archive</h2>
                <div className="archive-list">
                    {archivedAnalyses.length > 0 ? (
                        [...archivedAnalyses].reverse().map(message => {
                            const isBookmarked = bookmarks.some(b => b.id === message.id);
                            return (
                                <div key={message.id} className="archive-item">
                                    <div className="archive-item-header">
                                        <span className="archive-item-timestamp">{message.timestamp.toLocaleString()}</span>
                                        <span className="archive-item-type">{message.analysisType?.replace(/_/g, ' ')}</span>
                                    </div>
                                    <AIMessageContent
                                        message={message}
                                        onNumberInteract={onNumberInteract}
                                        isBookmarked={isBookmarked}
                                        onToggleBookmark={onToggleBookmark}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <p>No major analyses have been performed in this session yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// NEW COMPONENT: OperatorManualView
interface OperatorManualViewProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OperatorManualView: FC<OperatorManualViewProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const manualData = codex.getOperatorsManual();

    return (
        <div className="manual-overlay" onClick={onClose}>
            <div className="manual-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close Manual">×</button>
                <h2>Operator's Manual</h2>
                <div className="manual-list">
                    {manualData && manualData.protocols.length > 0 ? (
                        manualData.protocols.map((protocol: OperatorProtocol) => (
                            <div key={protocol.title} className="protocol-item">
                                <h3>{protocol.title}</h3>
                                <p className="protocol-purpose">{protocol.purpose}</p>
                                <ul className="protocol-principles-list">
                                    {protocol.principles.map(principle => (
                                        <li key={principle.name} className="protocol-principle">
                                            <strong>{principle.name}</strong>
                                            <p>{principle.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <p>No operational protocols have been derived yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// NEW COMPONENT: WhiteboardView
interface WhiteboardViewProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WhiteboardView: FC<WhiteboardViewProps> = memo(({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [voynichInput, setVoynichInput] = useState('v89.v12.c1.v56');
    const [hebrewOutput, setHebrewOutput] = useState('');
    const [transliterationResult, setTransliterationResult] = useState('');
    const whiteboardRef = useRef<HTMLDivElement>(null);

    const analysisData = useMemo(() => {
        const data = codex.getLiberPrimusData('voynichInitialAnalysis') as VoynichAnalysisResult | null;
        if (!data) return { mappings: new Map(), sample: null, fullMappings: [] };
        
        const mappings = new Map<string, { hebrew: string, archetype: string }>();
        data.glyphMappings.forEach(m => {
            const hebrewLetter = m.hebrewMapping.split(' ')[0];
            const archetype = m.publicArchetype || m.hebrewMapping.split('(')[1]?.replace(')','') || '';
            mappings.set(m.glyphId, { hebrew: hebrewLetter, archetype: archetype });
        });
        return { mappings, sample: data.decryptionSample, fullMappings: data.glyphMappings };
    }, []);

    useEffect(() => {
        const glyphIds = voynichInput.trim().split(/[.\s,]+/);
        const hebrewString = glyphIds.map(id => analysisData.mappings.get(id)?.hebrew || '�').join('');
        setHebrewOutput(hebrewString);
        
        if (voynichInput.trim().toLowerCase() === analysisData.sample?.original.toLowerCase()) {
             setTransliterationResult(`Known Sample Match: "${analysisData.sample.decrypted}"`);
        } else {
             setTransliterationResult('');
        }
    }, [voynichInput, analysisData]);

    const handleGenerateImage = useCallback(() => {
        if (whiteboardRef.current === null) {
            return;
        }
        toPng(whiteboardRef.current, { cacheBust: true, backgroundColor: '#030617', style: { padding: '1rem' } })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'voynich-transliteration-workbench.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Whiteboard image generation failed:', err);
            });
    }, []);

    return (
        <div className="whiteboard-overlay" onClick={onClose}>
            <div className="whiteboard-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose} aria-label="Close Whiteboard">×</button>
                <h2>Glyph Transliteration Workbench</h2>
                <div className="whiteboard-content" ref={whiteboardRef}>
                    <div className="glyph-key-section">
                        <h4>Glyph Mapping Key</h4>
                        <div className="glyph-key-grid">
                            {analysisData.fullMappings.map(m => (
                                <div key={m.glyphId} className="glyph-key-item">
                                    <span className="glyph-id">{m.glyphId}</span>
                                    <span className="arrow">→</span>
                                    <span className="hebrew-map">{m.hebrewMapping.split(' ')[0]}</span>
                                    <span className="archetype">{m.publicArchetype ? `(${m.publicArchetype})` : ''}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="transliteration-section">
                        <h4>Interactive Transliteration</h4>
                        <div className="transliteration-io">
                            <label htmlFor="voynich-input">Voynich Input (dot-separated IDs):</label>
                            <textarea
                                id="voynich-input"
                                value={voynichInput}
                                onChange={(e) => setVoynichInput(e.target.value)}
                                rows={4}
                                placeholder="Enter glyph IDs e.g., v89.v12.c1.v56"
                            />
                            <label>Live Hebrew Transliteration:</label>
                            <div className="transliteration-output" dir="rtl" lang="he">
                                {hebrewOutput || <span className="placeholder">Output will appear here...</span>}
                            </div>
                            {transliterationResult && (
                                <div className="transliteration-result">{transliterationResult}</div>
                            )}
                        </div>
                    </div>
                </div>
                 <div className="whiteboard-actions">
                    <button onClick={() => setVoynichInput('')}>Clear</button>
                    <button onClick={handleGenerateImage}>Export as PNG</button>
                </div>
            </div>
        </div>
    );
});


export const AstrianInterface: FC<AstrianInterfaceProps> = ({
    isSolveActive, chakraTheme, activeSolveSession, toasts, dismissToast,
    showWelcomeOffer, startTour, handleDismissWelcomeOffer, isTourActive,
    tourStep, setTourStep, endTour, speakText, isModalOpen, crossRefValue,
    sessionHistory, setIsModalOpen, handleSynthesizeConnections, isSynthesizing,
    synthesisResult, solveIntensity, isCallSignMenuOpen, setIsCallSignMenuOpen, handleCallSignSelect,
    transitionText, activeTool, setActiveTool, viewMode, handleCompassDoubleClick,
    handleBookmarkSelect, onCommandSelect, onDirectCommand, children,
    bookmarks, toggleBookmark, isBookmarksOpen, setIsBookmarksOpen, handleNumberInteract,
    isArchiveOpen, setIsArchiveOpen, isManualOpen, setIsManualOpen, isWhiteboardOpen, setIsWhiteboardOpen
}) => {
    const containerStyle = useMemo(() => ({
        '--solve-intensity': isSolveActive ? solveIntensity : 0,
    }) as React.CSSProperties, [isSolveActive, solveIntensity]);

    return (
        <div
            className={`app-container ${isSolveActive ? 'solve-active' : ''}`}
            data-chakra-theme={chakraTheme}
            style={containerStyle}
        >
            {isSolveActive ? (
                <StatusTicker findings={activeSolveSession.findings} />
            ) : (
                <OracleTicker onSelect={onCommandSelect} />
            )}
            
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />

            <BookmarksView 
                isOpen={isBookmarksOpen}
                onClose={() => setIsBookmarksOpen(false)}
                bookmarks={bookmarks}
                onNumberInteract={handleNumberInteract}
                onToggleBookmark={toggleBookmark}
            />

            <SessionArchiveView
                isOpen={isArchiveOpen}
                onClose={() => setIsArchiveOpen(false)}
                history={sessionHistory}
                onNumberInteract={handleNumberInteract}
                onToggleBookmark={toggleBookmark}
                bookmarks={bookmarks}
            />

            <OperatorManualView
                isOpen={isManualOpen}
                onClose={() => setIsManualOpen(false)}
            />
            
            <WhiteboardView
                isOpen={isWhiteboardOpen}
                onClose={() => setIsWhiteboardOpen(false)}
            />

            {showWelcomeOffer && <WelcomeOfferView onStartTour={startTour} onDismiss={handleDismissWelcomeOffer} />}
            {isTourActive && <GuidedTour step={tourStep} onNext={setTourStep} onSkip={endTour} speak={speakText} />}
            {isModalOpen && crossRefValue !== null && <CrossReferenceModal value={crossRefValue} history={sessionHistory} onClose={() => setIsModalOpen(false)} onSynthesize={handleSynthesizeConnections} isSynthesizing={isSynthesizing} synthesisResult={synthesisResult} />}
            <CallSignMenu 
                isOpen={isCallSignMenuOpen} 
                onClose={() => setIsCallSignMenuOpen(false)} 
                onSelect={handleCallSignSelect}
            />
            <TransitionOverlay text={transitionText} />
            {activeTool && <ToolWidget toolName={activeTool} onClose={() => setActiveTool(null)} />}

            <div className={`dual-hemisphere-container view-mode-${viewMode}`}>
                <GlobeView 
                    onCompassDoubleClick={handleCompassDoubleClick} 
                    isSolveActive={isSolveActive} 
                    handleCallSignSelect={handleCallSignSelect}
                    onCommandSelect={onCommandSelect}
                    onDirectCommand={onDirectCommand}
                    onOpenBookmarks={() => setIsBookmarksOpen(true)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                    onOpenManual={() => setIsManualOpen(true)}
                    onOpenWhiteboard={() => setIsWhiteboardOpen(true)}
                />
                <SoBelowView isSolveActive={isSolveActive} onCompassDoubleClick={handleCompassDoubleClick} onBookmarkSelect={handleBookmarkSelect}>
                    {children}
                </SoBelowView>
            </div>

            {isSolveActive && <SystemHeartbeat />}
            {isSolveActive && <SolveEKGOverlay />}
        </div>
    );
};

// =================================================================================================
// --- VOYnich & CHAT COMPONENTS RESTORATION ---
// =================================================================================================

const getThemeClass = (text: string): string => {
    if (!text) return 'theme-default';
    const lowerText = text.toLowerCase();
    if (lowerText.includes('botanical') || lowerText.includes('plant')) return 'theme-botanical';
    if (lowerText.includes('cosmological') || lowerText.includes('astronomical') || lowerText.includes('zodiac')) return 'theme-cosmological';
    if (lowerText.includes('biological') || lowerText.includes('human figures') || lowerText.includes('anatomy')) return 'theme-biological';
    if (lowerText.includes('alchemical') || lowerText.includes('pharmaceutical') || lowerText.includes('recipe')) return 'theme-alchemical';
    return 'theme-default';
};

const VeracityDetails: FC<{ data: VeracityEntry[] }> = ({ data }) => {
    return (
        <div className="veracity-details">
            <h5>Veracity Protocol</h5>
            {data.map((entry, index) => (
                <div key={index} className="veracity-entry">
                    <strong>{entry.finding}</strong>
                    <code>{entry.crossReference}</code>
                    <p>{entry.explanation}</p>
                </div>
            ))}
        </div>
    );
};

const VoynichAnalysisView: FC<{ result: VoynichAnalysisResult; messageId: string; isBookmarked: boolean; onToggleBookmark: (id: string) => void; }> = ({ result, messageId, isBookmarked, onToggleBookmark }) => {
    const themeClass = getThemeClass(result.overview);
    const [isVeracityVisible, setIsVeracityVisible] = useState(false);
    
    return (
        <div className={`voynich-analysis-view message-bubble ${themeClass}`}>
            <div className="analysis-actions">
                 {result.veracityData && (
                    <button className="analysis-action-btn" onClick={() => setIsVeracityVisible(v => !v)} title="Verify" aria-label="Verify Analysis">
                        ⚖️
                    </button>
                )}
                <button className={`analysis-action-btn ${isBookmarked ? 'bookmarked' : ''}`} onClick={() => onToggleBookmark(messageId)} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                    {isBookmarked ? '★' : '☆'}
                </button>
            </div>
            <h3>Initial Analysis: Voynich Manuscript</h3>
            <p className="overview">{result.overview}</p>

            <h4>Glyph Mappings</h4>
            <ul className="glyph-list">
                {result.glyphMappings.map((mapping, index) => (
                    <li key={index}>
                        <span className="glyph-map">
                            Glyph {mapping.glyphId} → {mapping.hebrewMapping.split(' ')[0]} {mapping.publicArchetype ? `(${mapping.publicArchetype})` : ''}
                        </span>
                        <span className="justification">{mapping.justification}</span>
                    </li>
                ))}
            </ul>

            <h4>Decryption Sample</h4>
            <div className="decryption-sample">
                <code>{result.decryptionSample.original}</code>
                <span className="arrow">→</span>
                <code>{result.decryptionSample.decrypted}</code>
            </div>
             {isVeracityVisible && result.veracityData && <VeracityDetails data={result.veracityData} />}
        </div>
    );
};

const VoynichDeepAnalysisView: FC<{ result: VoynichDeepAnalysisResult; messageId: string; isBookmarked: boolean; onToggleBookmark: (id: string) => void; }> = ({ result, messageId, isBookmarked, onToggleBookmark }) => {
    const themeClass = getThemeClass(result.overview);
    const [isVeracityVisible, setIsVeracityVisible] = useState(false);
    
    const renderSection = (title: string, content: ReactNode) => {
        if (!content) return null;
        return (
            <div className="analysis-section">
                <h4>{title}</h4>
                {content}
            </div>
        );
    };

    const renderAstrianSection = (title: string, content: ReactNode) => {
        if (!content) return null;
        return (
             <div className="analysis-section astrian-analysis-section">
                <h4>{title}</h4>
                {content}
            </div>
        )
    }

    return (
        <div className={`voynich-deep-analysis-view message-bubble ${themeClass}`}>
            <div className="analysis-actions">
                 {result.veracityData && (
                    <button className="analysis-action-btn" onClick={() => setIsVeracityVisible(v => !v)} title="Verify" aria-label="Verify Analysis">
                        ⚖️
                    </button>
                )}
                <button className={`analysis-action-btn ${isBookmarked ? 'bookmarked' : ''}`} onClick={() => onToggleBookmark(messageId)} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                    {isBookmarked ? '★' : '☆'}
                </button>
            </div>
            <h3>
                Deep Analysis: {result.folioReference}
                {result.isCanonized && <span className="canonized-status">CANONIZED</span>}
            </h3>
            <p className="overview">{result.overview}</p>

            {result.inversionAnalysis && renderSection(result.inversionAnalysis.title, <div><p><strong>Solar:</strong> {result.inversionAnalysis.solarCadence}</p><p><strong>Lunar:</strong> {result.inversionAnalysis.lunarCadence}</p></div>)}
            
            {result.glyphNetworkAnalysis?.coOccurrenceClusters && renderSection(result.glyphNetworkAnalysis.coOccurrenceClusters.clusterName, 
                <p>{result.glyphNetworkAnalysis.coOccurrenceClusters.interpretation} (Glyphs: {result.glyphNetworkAnalysis.coOccurrenceClusters.glyphs.join(', ')})</p>
            )}

            {result.hebraicKeyAnalysis && renderSection(result.hebraicKeyAnalysis.title,
                <ul className="glyph-list">
                    {result.hebraicKeyAnalysis.keys.map(key => (
                        <li key={key.name}><strong>{key.name}:</strong> {key.interpretation}</li>
                    ))}
                </ul>
            )}

            {result.operationalModes && renderSection(result.operationalModes.title,
                <div>
                    <p>{result.operationalModes.explanation}</p>
                    <div className="operational-modes-container">
                        {result.operationalModes.modes.map(mode => (
                            <div key={mode.name} className="operational-mode-card">
                                <h5>{mode.name}</h5>
                                <p className="mode-numerology">Numerological Signature: {mode.numerology}</p>
                                <p>{mode.description}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mode-synthesis"><strong>Synthesis:</strong> {result.operationalModes.synthesis}</p>
                </div>
            )}

            {result.shadowAlphabetAnalysis && renderSection(result.shadowAlphabetAnalysis.title,
                <div className="shadow-alphabet-container">
                    <p className="explanation">{result.shadowAlphabetAnalysis.explanation}</p>
                    <div className="shadow-alphabet-list">
                         {result.shadowAlphabetAnalysis.unmappedLetters.map(letter => (
                             <div key={letter.name} className="shadow-letter-card">
                                 <div className="letter-header">
                                     <span className="letter-char">{letter.letter}</span>
                                     <span className="letter-name">{letter.name}</span>
                                     <span className="letter-gematria">({letter.gematria})</span>
                                 </div>
                                 <p className="letter-placement">{letter.willowPlacement}</p>
                             </div>
                         ))}
                    </div>
                    <div className="shadow-synthesis">
                        <p><strong>Gematria Sum ({result.shadowAlphabetAnalysis.gematriaSum.value}):</strong> {result.shadowAlphabetAnalysis.gematriaSum.interpretation}</p>
                        <h5>{result.shadowAlphabetAnalysis.wordSynthesis.title}</h5>
                        <p>{result.shadowAlphabetAnalysis.wordSynthesis.synthesis}</p>
                    </div>
                </div>
            )}

            {result.astrianAnalysis && renderAstrianSection(result.astrianAnalysis.title, 
                <div>
                    <p><strong>Shadow Glyphs:</strong> {result.astrianAnalysis.shadowGlyphFunction}</p>
                    <p><strong>Israel Key:</strong> {result.astrianAnalysis.israelKeyMapping}</p>
                    <p><strong>Heartbeat:</strong> Fibonacci Resonance - {result.astrianAnalysis.rhythmicHeartbeat.fibonacciResonance}</p>
                </div>
            )}

            {result.emergentSynthesis && renderSection(result.emergentSynthesis.title, <p>{result.emergentSynthesis.theory}</p>)}

            {result.glyphStateLog && (
                <div className="analysis-section glyph-state-log">
                    <h4>Glyph State Log</h4>
                    <div className="log-entries">
                        {result.glyphStateLog.map((entry, index) => (
                            <div key={index} className="log-entry">
                                <p className="log-timestamp">[{entry.timestamp}]</p>
                                <p className="log-description"><strong>{entry.stateDescription}</strong></p>
                                <p className="log-details">{entry.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {isVeracityVisible && result.veracityData && <VeracityDetails data={result.veracityData} />}
        </div>
    );
};

const VoynichTranslationView: FC<{ result: VoynichTranslationResult; messageId: string; isBookmarked: boolean; onToggleBookmark: (id: string) => void; }> = ({ result, messageId, isBookmarked, onToggleBookmark }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const filteredEntries = useMemo(() => {
        if (!searchTerm.trim()) return result.entries;
        const lowerSearch = searchTerm.toLowerCase().trim();
        return result.entries.filter(entry =>
            entry.folio.toLowerCase().includes(lowerSearch) ||
            entry.theme.toLowerCase().includes(lowerSearch) ||
            entry.translation.toLowerCase().includes(lowerSearch)
        );
    }, [searchTerm, result.entries]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [searchTerm]);

    const handleNext = () => setCurrentIndex(prev => Math.min(prev + 1, filteredEntries.length - 1));
    const handlePrev = () => setCurrentIndex(prev => Math.max(prev - 1, 0));
    
    const currentEntry = filteredEntries.length > 0 ? filteredEntries[currentIndex] : null;
    const themeClass = currentEntry ? getThemeClass(currentEntry.theme) : 'theme-default';

    return (
        <div className={`voynich-translation-view message-bubble ${themeClass}`}>
            <div className="analysis-actions">
                <button className={`analysis-action-btn ${isBookmarked ? 'bookmarked' : ''}`} onClick={() => onToggleBookmark(messageId)} aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}>
                    {isBookmarked ? '★' : '☆'}
                </button>
            </div>
            <h3>Folio-by-Folio Translation</h3>
            <div className="voynich-translation-controls">
                <input
                    type="search"
                    className="search-bar"
                    placeholder="Search folio or theme..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search folios"
                />
                {filteredEntries.length > 1 && (
                    <div className="folio-navigation">
                         <button onClick={handlePrev} disabled={currentIndex === 0}>‹ Prev</button>
                         <span className="folio-counter" aria-live="polite">{currentIndex + 1} / {filteredEntries.length}</span>
                         <button onClick={handleNext} disabled={currentIndex >= filteredEntries.length - 1}>Next ›</button>
                    </div>
                )}
            </div>

            {currentEntry ? (
                 <div key={currentIndex} className="folio-entry">
                    <h4>Folio {currentEntry.folio}</h4>
                    <p className="folio-theme">{currentEntry.theme}</p>
                    <p className="translation-text">{currentEntry.translation}</p>
                    {currentEntry.notes && currentEntry.notes.length > 0 &&
                        <div className="translation-notes">
                            <h5>Notes:</h5>
                            <ul>
                                {currentEntry.notes.map((note, noteIndex) => (
                                    <li key={noteIndex}>
                                        <strong>{note.term}:</strong> {note.explanation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }
                </div>
            ) : (
                <p>No matching folios found.</p>
            )}
        </div>
    );
};

const AIMessageContent: FC<{ message: AIMessage; onNumberInteract: (num: number) => void; isBookmarked: boolean; onToggleBookmark: (id: string) => void; }> = ({ message, onNumberInteract, isBookmarked, onToggleBookmark }) => {
    const renderTextWithInteractions = (text: string) => {
        const parts = text.split(/(\b\d+\b)/g);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return <span key={index} className="interactive-number" onClick={() => onNumberInteract(parseInt(part, 10))}>{part}</span>;
            }
            return part;
        });
    };

    switch (message.analysisType) {
        case 'voynich_analysis':
            return <VoynichAnalysisView result={message.result as VoynichAnalysisResult} messageId={message.id} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} />;
        case 'voynich_deep_analysis':
            return <VoynichDeepAnalysisView result={message.result as VoynichDeepAnalysisResult} messageId={message.id} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} />;
        case 'voynich_translation':
             return <VoynichTranslationView result={message.result as VoynichTranslationResult} messageId={message.id} isBookmarked={isBookmarked} onToggleBookmark={onToggleBookmark} />;
        case 'beale_cipher_solution':
            // This case might be used if a direct solve is ever re-implemented.
            // For now, it will not be hit by the new °solve logic.
            const result = message.result as BealeCipherSolution;
            return (
                 <div className="beale-cipher-solution-view message-bubble">
                     <h3>{result.title}</h3>
                     <p>{result.summary}</p>
                     {/* Abridged for brevity */}
                 </div>
            );
        default:
            return <div className="message-bubble">{renderTextWithInteractions(message.text)}</div>;
    }
};

interface ChatViewProps {
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
    bookmarks: AIMessage[];
    onToggleBookmark: (id: string) => void;
}

export const ChatView: FC<ChatViewProps> = ({
    history,
    isLoading,
    error,
    onRetry,
    onNumberInteract,
    input,
    onInputChange,
    onSend,
    onSpeak,
    isVoiceEnabled,
    isListening,
    onStartListening,
    onToggleFavorite,
    bookmarks,
    onToggleBookmark
}) => {
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [history]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSend();
        }
    };
    
    const handleVoiceInput = () => {
        onStartListening((transcript) => {
            onInputChange(transcript);
        });
    };

    return (
        <div className="chat-view-container">
            <div className="chat-history" ref={chatHistoryRef}>
                {history.map(record => {
                    const isBookmarked = record.type === 'ai' && bookmarks.some(b => b.id === record.id);
                    return (
                        <div key={record.id} className={`chat-message ${record.type}`}>
                            {record.type === 'user' && (
                                <div className="message-bubble">{(record as UserMessage).text}</div>
                            )}
                            {record.type === 'ai' && (
                                <AIMessageContent 
                                    message={record as AIMessage} 
                                    onNumberInteract={onNumberInteract} 
                                    isBookmarked={isBookmarked}
                                    onToggleBookmark={onToggleBookmark}
                                />
                            )}
                            {record.type === 'system' && (
                                <div className="message-bubble system-message">{(record as SystemMessage).text}</div>
                            )}
                        </div>
                    );
                })}
                {isLoading && (
                    <div className="chat-message ai">
                        <div className="message-bubble loading-bubble">
                            <div className="loading-glyph">°</div>
                        </div>
                    </div>
                )}
                 {error && (
                    <div className="chat-message system">
                        <div className="message-bubble error-bubble">
                            <p>{error}</p>
                            <button onClick={onRetry}>Retry</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="chat-input-area">
                <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
                     <button
                        type="button"
                        className={`voice-input-btn ${isListening ? 'listening' : ''}`}
                        onClick={handleVoiceInput}
                        disabled={!isVoiceEnabled || isListening}
                        aria-label={isListening ? "Listening..." : "Start voice input"}
                    >
                        🎙
                    </button>
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Ask..."
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        aria-label="Chat input"
                    />
                    <button type="submit" className="chat-submit-btn" disabled={isLoading || !input.trim()} aria-label="Send message">
                        ›
                    </button>
                </form>
            </div>
        </div>
    );
};

// =================================================================================================
// --- OTHER MISSING COMPONENTS (PLACEHOLDERS) ---
// =================================================================================================

export const KaleidoscopicBackground: FC<{resonance: number}> = ({ resonance }) => <div className="kaleidoscopic-background" style={{ '--seed': resonance } as React.CSSProperties}></div>;
export const SubliminalGlyph: FC<{seed: number}> = () => <div style={{display: 'none'}}>SubliminalGlyph</div>;
export const SessionUnlockView: FC<any> = ({ onUnlock }) => <div className="session-unlock-view card"><h2>Session Locked</h2><button onClick={onUnlock}>Unlock Session</button></div>;
export const MeditationView: FC<any> = ({ onFinish }) => <div className="meditation-view card"><h2>Meditation in Progress</h2><button onClick={onFinish}>Finish Meditation</button></div>;
export const AyinGuide: FC<any> = () => <div style={{display: 'none'}}>AyinGuide</div>;
export const StelaCalibrationView: FC<any> = () => <div className="stela-calibration-view">Stela Calibration</div>;

export const InstructionalCompositionView: FC<{ session: InstructionalCompositionSession, onStop: () => void }> = ({ session, onStop }) => {
    return (
        <div className="instructional-composition-view card">
            <h2>
                {session.title ? `Playing: ${session.title}` : `Instructional Composition: ${session.coreEmotion}`}
            </h2>
            {session.symbolicMantra && <p>Mantra: {session.symbolicMantra}</p>}
            {session.audioUrl && <audio src={session.audioUrl} controls autoPlay loop style={{width: '100%', marginTop: '1rem'}} />}
            <button onClick={onStop} style={{marginTop: '1rem'}}>Stop Composition</button>
        </div>
    );
};

export const EntrainmentView: FC<any> = ({ onStop }) => <div className="entrainment-view card"><h2>Entrainment in Progress</h2><button onClick={onStop}>Stop Entrainment</button></div>;
export const EmergentCTA: FC<any> = () => <div style={{display: 'none'}}>EmergentCTA</div>;
export const BootAnimationView: FC<any> = ({ onEnter, isComplete, statusText, subText }) => (
    <div className="boot-animation-view">
        <div className="vortex-container">
            <div className="vortex-layer"></div>
            <div className="vortex-layer"></div>
            <div className="vortex-layer"></div>
        </div>
         <button className="boot-ayin" onClick={onEnter} disabled={!isComplete} aria-label="Enter Application">°</button>
        <div className="boot-summary-container">
            <div className="boot-summary-scroll">
                <p>{statusText}</p>
                <p>{subText}</p>
            </div>
        </div>
    </div>
);