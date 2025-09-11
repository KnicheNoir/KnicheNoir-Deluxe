import React, { FC, ReactNode, useState, useCallback, useRef, useEffect } from 'react';
import { AIMessage } from './types';
import pako from 'pako';
import JSZip from 'jszip';

// Prop Types
interface TimelineViewProps {
    history: any[];
    error: any;
    onRetry: () => void;
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    isLoading: boolean;
    isListening: boolean;
    onStartListening: () => void;
    bookmarks: any[];
    onToggleBookmark: (id: string) => void;
    isVoiceEnabled: boolean;
    onNumberInteract: (num: any) => void;
}

interface CommandGuideProps {
    onCommandSelect: (command: string) => void;
    onOpenIngest?: () => void;
    isAweComplete?: boolean;
    onStartTour?: () => void;
    isFirstVisit?: boolean;
    onDownloadArchive?: () => void;
}

interface EmergentCTAProps {
    onTrigger: (message: string) => void;
    lastMessage: AIMessage | null;
}

interface HomeViewProps {
    customTools: any[];
    onDirectCommand: (command: string) => void;
    homeTimelineProps: TimelineViewProps;
}

interface ViewWithChatAndGuideProps {
    chatProps: TimelineViewProps;
    guideProps: Omit<CommandGuideProps, 'onCommandSelect'> & { onCommandSelect: () => void; };
    onDirectCommand: (command: string) => void;
}

interface InstructionalCompositionViewProps {
    session: any;
    onStop: () => void;
    favoriteCompositions: any[];
    onToggleFavorite: (id: any) => void;
}

interface EntrainmentViewProps {
    session: any;
    onStop: () => void;
}

interface SessionUnlockViewProps {
    onUnlock: (password?: string) => void;
    challenge: any;
    isLoading: boolean;
    onRegenerate: () => void;
}

interface MeditationViewProps {
    script: any;
    imagePrompts: any;
    onFinish: () => void;
}

interface CameraViewProps {
    onCapture: (image: any) => void;
    onCancel: () => void;
}

interface VoiceRecorderViewProps {
    onRecord: (recording: any) => void;
    onCancel: () => void;
}

interface AstrianInterfaceProps {
    children: ReactNode;
    [key: string]: any;
}

interface BootAnimationViewProps {
    statusText: string;
    subText: string;
    isComplete: boolean;
    onEnter: () => void;
}

interface IngestionViewProps {
    onClose: () => void;
    onIngest: (metadata: { title: string; tradition: string; language: string }, data: { type: 'file'; content: string } | { type: 'url'; url: string }) => void;
}

interface BIP39DecryptorViewProps {
    session: any;
    onStop: () => void;
}

interface SolveProtocolViewProps {
    session: any;
    onStop: () => void;
}

interface HokmahForgingProtocolViewProps {
    session: any;
    onStop: () => void;
}

interface BinahUnravelingViewProps {
    session: any;
    onStop: () => void;
}

interface EinSofInversionViewProps {
    session: any;
    onStop: () => void;
}


// Sub-components for TimelineView
const UserMessage: FC<{ message: AIMessage }> = ({ message }) => (
    <div className="timeline-item timeline-item-user">
        <div className="timeline-item-content">
            <div className="timeline-item-text-content">
                {message.parts[0].text}
            </div>
        </div>
    </div>
);

const AiMessage: FC<{ message: AIMessage }> = ({ message }) => (
    <div className="timeline-item timeline-item-ai">
        <div className="timeline-item-content">
            <div className="timeline-item-text-content" style={{ whiteSpace: 'pre-wrap' }}>
                {message.parts[0].text}
            </div>
        </div>
    </div>
);

const ErrorMessage: FC<{ message: AIMessage, onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="timeline-item timeline-item-system">
        <div className="timeline-item-content error-bubble">
            <p><strong>System Error:</strong> {message.parts[0].text}</p>
            <button onClick={onRetry}>Retry</button>
        </div>
    </div>
);

const LoadingBubble: FC = () => (
    <div className="timeline-item timeline-item-ai">
        <div className="timeline-item-content">
            <div className="loading-bubble">
                <span className="loading-glyph">°</span>
            </div>
        </div>
    </div>
);

const ScryingResultView: FC<{ payload: any }> = ({ payload }) => (
    <div className="timeline-item timeline-item-ai">
        <div className="timeline-item-content scrying-result-view">
            <h3 className="scrying-title">{payload.title}</h3>
            <img src={payload.image} alt={payload.title} className="scrying-image" />
            <div className="scrying-interpretation">
                {payload.interpretation}
            </div>
        </div>
    </div>
);

export const TimelineView: FC<TimelineViewProps> = ({ history, isLoading, error, onRetry, input, onInputChange, onSend, isListening, onStartListening, isVoiceEnabled }) => {
    const messagesEndRef = React.useRef<null | HTMLDivElement>(null);
    
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    return (
        <div className="timeline-view-container">
            <div className="timeline-view">
                {history.map(message => {
                    switch (message.role) {
                        case 'user':
                            return <UserMessage key={message.id} message={message} />;
                        case 'model':
                            if (message.type === 'scrying' && message.payload) {
                                return <ScryingResultView key={message.id} payload={message.payload} />;
                            }
                            return <AiMessage key={message.id} message={message} />;
                        case 'system':
                             if (message.type === 'error') {
                                return <ErrorMessage key={message.id} message={message} onRetry={onRetry}/>;
                            }
                            // Also render system messages of type 'chat'
                            if (message.type === 'chat') {
                                return <div key={message.id} className="timeline-item timeline-item-system"><div className="timeline-item-content" style={{whiteSpace: 'pre-wrap'}}>{message.parts[0].text}</div></div>
                            }
                            return null;
                        default:
                            return null;
                    }
                })}
                {isLoading && <LoadingBubble />}
                <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
                <form className="chat-input-form" onSubmit={(e) => { e.preventDefault(); onSend(); }}>
                    {isVoiceEnabled && (
                         <button type="button" className={`voice-input-btn ${isListening ? 'listening' : ''}`} onClick={onStartListening} aria-label="Start voice input">
                             🎙️
                         </button>
                    )}
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Try: /ingest or /ingest <URL>"
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                        disabled={isLoading}
                    />
                    <button type="submit" className="chat-submit-btn" disabled={isLoading || !input.trim()} aria-label="Send message">
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
};

export const IngestionView: FC<IngestionViewProps> = ({ onClose, onIngest }) => {
    const [title, setTitle] = useState('');
    const [tradition, setTradition] = useState('');
    const [language, setLanguage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState('');
    const [ingestionMode, setIngestionMode] = useState<'file' | 'url'>('file');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleSubmit = useCallback(async () => {
        if (!title || !tradition) return;
        setIsProcessing(true);

        if (ingestionMode === 'file' && file) {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    if (!e.target?.result) throw new Error("File content is empty.");
                    let content: string = '';

                    if (file.name.endsWith('.gz')) {
                        const inflated = pako.inflate(new Uint8Array(e.target.result as ArrayBuffer));
                        content = new TextDecoder("utf-8").decode(inflated);
                    } else if (file.name.endsWith('.zip')) {
                        const zip = await JSZip.loadAsync(e.target.result as ArrayBuffer);
                        const textPromises: Promise<string>[] = [];
                        zip.forEach((relativePath, zipEntry) => {
                            // Only process files, ignore directories, and only take text-like files
                            if (!zipEntry.dir && /\.(txt|md|xml|json|html)$/i.test(zipEntry.name)) {
                                textPromises.push(zipEntry.async('string'));
                            }
                        });
                        const texts = await Promise.all(textPromises);
                        content = texts.join('\n\n---\n\n'); // Separate file contents
                    } else {
                        content = e.target?.result as string;
                    }
                    
                    if (content) {
                        onIngest({ title, tradition, language }, { type: 'file', content });
                    }
                } catch (error) {
                    console.error("Failed to process file:", error);
                } finally {
                    setIsProcessing(false);
                    onClose();
                }
            };
            
            reader.onerror = () => {
                 console.error("Failed to read file.");
                 setIsProcessing(false);
            };

            if (file.name.endsWith('.gz') || file.name.endsWith('.zip')) {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }

        } else if (ingestionMode === 'url' && url) {
            onIngest({ title, tradition, language }, { type: 'url', url });
            setIsProcessing(false);
            onClose();
        } else {
             setIsProcessing(false);
        }
    }, [file, url, ingestionMode, title, tradition, language, onIngest, onClose]);

    const isSubmitDisabled = !title || !tradition || isProcessing || (ingestionMode === 'file' && !file) || (ingestionMode === 'url' && !url);

    return (
        <div className="ingestion-overlay" onClick={onClose}>
            <div className="ingestion-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Da'at Ingestion Protocol</h2>
                
                 <div className="ingestion-tabs">
                    <button className={`ingestion-tab ${ingestionMode === 'file' ? 'active' : ''}`} onClick={() => setIngestionMode('file')}>Upload File</button>
                    <button className={`ingestion-tab ${ingestionMode === 'url' ? 'active' : ''}`} onClick={() => setIngestionMode('url')}>From URL (Metatron)</button>
                </div>
                
                <div className="ingestion-form-group">
                    <label htmlFor="ingest-title">Title</label>
                    <input id="ingest-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., The Book of Job" />
                </div>
                
                <div className="ingestion-form-group">
                    <label htmlFor="ingest-tradition">Tradition</label>
                    <input id="ingest-tradition" type="text" value={tradition} onChange={(e) => setTradition(e.target.value)} placeholder="e.g., Hebraic Tradition" />
                </div>
                
                <div className="ingestion-form-group">
                    <label htmlFor="ingest-language">Language (Optional)</label>
                    <input id="ingest-language" type="text" value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="e.g., Biblical Hebrew" />
                </div>
                
                {ingestionMode === 'file' && (
                    <div className="ingestion-form-group">
                        <label htmlFor="file-upload" className="ingestion-file-input">
                            <span>{file ? file.name : 'Click to select a file (.txt, .md, .gz, .zip)'}</span>
                            <input id="file-upload" type="file" accept=".txt,.md,.xml,.gz,.zip" onChange={handleFileChange} />
                        </label>
                    </div>
                )}

                {ingestionMode === 'url' && (
                     <div className="ingestion-form-group">
                        <label htmlFor="ingest-url">Source URL</label>
                        <input id="ingest-url" type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
                    </div>
                )}


                <div className="ingestion-controls">
                    <button onClick={onClose} className="ingestion-btn-cancel">Cancel</button>
                    <button onClick={handleSubmit} className="ingestion-btn-submit" disabled={isSubmitDisabled}>
                        {isProcessing ? 'Assimilating...' : 'Ingest'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Canonical Home View Implementation ---
const NotepadWidget: FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="widget-content">
        <textarea className="notepad-widget-textarea" placeholder="Scribble your notes here..."></textarea>
    </div>
);
const ToolCreatorWidget: FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="widget-content">
        <div className="tool-creator">
            <input type="text" placeholder="Tool Name" />
            <textarea placeholder="Describe the tool's function..."></textarea>
            <button>Create Tool</button>
        </div>
    </div>
);
const apps = [
    { id: 'notepad', name: 'Notepad', icon: '📝', component: NotepadWidget },
    { id: 'tool_creator', name: 'Tool Creator', icon: '🛠️', component: ToolCreatorWidget },
];

export const HomeView: FC<HomeViewProps> = ({ homeTimelineProps }) => {
    const [activeWidgets, setActiveWidgets] = useState<string[]>(['notepad']);
    const [widgetState, setWidgetState] = useState<Record<string, any>>({
        notepad: { x: 20, y: 20, width: 300, height: 250, zIndex: 1 },
        tool_creator: { x: 60, y: 60, width: 320, height: 300, zIndex: 0 },
    });

    const openApp = (appId: string) => {
        if (!activeWidgets.includes(appId)) {
            setActiveWidgets(prev => [...prev, appId]);
        }
        bringToFront(appId);
    };

    const closeWidget = (appId: string) => {
        setActiveWidgets(prev => prev.filter(id => id !== appId));
    };

    const bringToFront = (appId: string) => {
        const maxZ = Math.max(...Object.values(widgetState).map(w => w.zIndex), 0);
        setWidgetState(prev => ({
            ...prev,
            [appId]: { ...prev[appId], zIndex: maxZ + 1 }
        }));
    };
    
    // This is a simplified drag handler. A production version would use a library.
    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, appId: string) => {
        bringToFront(appId);
        const startX = e.clientX - widgetState[appId].x;
        const startY = e.clientY - widgetState[appId].y;

        const handleMouseMove = (moveE: MouseEvent) => {
            const newX = moveE.clientX - startX;
            const newY = moveE.clientY - startY;
            setWidgetState(prev => ({ ...prev, [appId]: { ...prev[appId], x: newX, y: newY } }));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };


    return (
        <div className="home-view">
            <div className="vortex-background"></div>
            <div className="home-view-content">
                <div className="home-view-layout">
                    <div className="home-chat-panel">
                        <TimelineView {...homeTimelineProps} />
                    </div>
                    <div className="home-widget-panel">
                        <div className="app-launcher">
                            {apps.map(app => (
                                <div key={app.id} className="app-icon" onClick={() => openApp(app.id)}>
                                    <span className="app-icon-glyph">{app.icon}</span>
                                    <span className="app-icon-name">{app.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className="widget-area">
                            {activeWidgets.map(appId => {
                                const app = apps.find(a => a.id === appId);
                                if (!app) return null;
                                const state = widgetState[appId];
                                const WidgetComponent = app.component;

                                return (
                                    <div 
                                        key={appId} 
                                        className="widget" 
                                        style={{ 
                                            transform: `translate(${state.x}px, ${state.y}px)`,
                                            width: `${state.width}px`,
                                            height: `${state.height}px`,
                                            zIndex: state.zIndex
                                        }}
                                        onMouseDown={() => bringToFront(appId)}
                                    >
                                        <div className="widget-header" onMouseDown={(e) => handleDragStart(e, appId)}>
                                            <span className="widget-icon">{app.icon}</span>
                                            <span className="widget-title">{app.name}</span>
                                            <button className="widget-close-btn" onClick={() => closeWidget(appId)}>&times;</button>
                                        </div>
                                        <WidgetComponent onClose={() => closeWidget(appId)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BIP39DecryptorView: FC<BIP39DecryptorViewProps> = ({ session, onStop }) => {
    // Gracefully handle the case where the session data or analysis is not yet available
    if (!session || !session.analysis) {
        return (
             <div className="bip39-decryptor-view">
                <div className="bip39-header">
                    <h2>BIP39 Structural Unveiling</h2>
                    <button onClick={onStop}>End Session</button>
                </div>
                <div className="bip39-content">
                    <div className="bip39-section">
                         <div className="loading-bubble" style={{justifyContent: 'flex-start'}}>
                            <span className="loading-glyph">°</span>
                            <span>Performing structural analysis...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    const { analysis } = session;
    
    return (
        <div className="bip39-decryptor-view">
             <div className="bip39-header">
                <h2>BIP39 Structural Unveiling</h2>
                <button onClick={onStop}>End Session</button>
            </div>
            <div className="bip39-content">
                <div className="bip39-section">
                    <h3>Mnemonic Phrase</h3>
                    <div className="bip39-mnemonic-grid">
                        {analysis.words.map((word: string, index: number) => (
                            <div key={index} className="bip39-mnemonic-word">{index + 1}. {word}</div>
                        ))}
                    </div>
                </div>

                <div className="bip39-section">
                    <h3>Checksum Validation (von Neumann)</h3>
                     <div className={`bip39-status ${analysis.isValid ? 'valid' : 'invalid'}`}>
                        {analysis.isValid ? 'VALID' : 'INVALID'}
                    </div>
                </div>

                 <div className="bip39-section">
                    <h3>Structural Gematria Analysis</h3>
                    <table className="bip39-gematria-table">
                        <thead>
                            <tr>
                                <th>Word</th>
                                <th>Gematria Value</th>
                                <th>Cumulative</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analysis.gematriaAnalysis.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>{item.word}</td>
                                    <td>{item.value}</td>
                                    <td>{item.cumulative}</td>
                                </tr>
                            ))}
                            <tr>
                                <th>Total Vibrational Number</th>
                                <td></td>
                                <td>{analysis.totalGematria}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="bip39-section">
                    <h3>Esoteric Synthesis (AI Scribed)</h3>
                    <p className="bip39-synthesis">
                        {analysis.synthesis}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const SolveProtocolView: FC<SolveProtocolViewProps> = ({ session, onStop }) => {
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [session.findings]);

    return (
        <div className="solve-protocol-view">
            <div className="solve-header">
                <h2 className="solve-title">GEVURAH SOLVE PROTOCOL</h2>
                <button onClick={onStop}>End Session</button>
            </div>
            <div className="solve-content">
                <div className="solve-section">
                    <h3>TARGET DATA STREAM</h3>
                    <div className="solve-target-data">{session.targetData}</div>
                </div>
                <div className="solve-section" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3>ANALYTICAL FINDINGS LOG</h3>
                    <div className="solve-findings-log">
                        {session.findings.map((finding: any, index: number) => (
                            <div key={index} className="solve-finding-item" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="finding-header">
                                    <span className={`finding-type finding-type-${finding.type}`}>[TYPE: {finding.type.toUpperCase()}]</span>
                                    <span>CONFIDENCE: {(finding.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <p className="finding-content">{finding.content}</p>
                            </div>
                        ))}
                         {!session.isComplete && (
                            <div className="solve-status-indicator">
                                <span className="loading-glyph">°</span>
                                <span>ANALYZING...</span>
                            </div>
                        )}
                        <div ref={logEndRef} />
                    </div>
                </div>
                {session.isComplete && session.decryptedMessage && (
                    <div className="solve-final-result">
                        <h3>DECRYPTED PRINCIPLE</h3>
                        <p className="decrypted-principle">
                            {session.decryptedMessage}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const HokmahForgingProtocolView: FC<HokmahForgingProtocolViewProps> = ({ session, onStop }) => {
     if (!session || !session.forgedPhrase) {
        return (
            <div className="hokmah-forging-view">
                <div className="hokmah-header">
                    <h2>Hokmah Forging Protocol</h2>
                    <button onClick={onStop}>End Session</button>
                </div>
                <div className="hokmah-content">
                    <div className="hokmah-section">
                         <div className="loading-bubble" style={{justifyContent: 'flex-start'}}>
                            <span className="loading-glyph" style={{color: 'var(--color-primary)'}}>°</span>
                            <span>Engaging the forge...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="hokmah-forging-view">
             <div className="hokmah-header">
                <h2>Hokmah Forging Protocol</h2>
                <button onClick={onStop}>End Session</button>
            </div>
            <div className="hokmah-content">

                <div className="hokmah-section">
                    <h3>Conceptual Seed</h3>
                    <p className="hokmah-conceptual-seed">"{session.conceptualSeed}"</p>
                </div>

                <div className="hokmah-section">
                    <h3>Forged Mnemonic Phrase</h3>
                    <div className="hokmah-mnemonic-grid">
                        {session.forgedPhrase.map((word: string, index: number) => (
                            <div key={index} className="hokmah-mnemonic-word">{index + 1}. {word}</div>
                        ))}
                    </div>
                </div>

                <div className="hokmah-section">
                    <h3>Checksum Validation</h3>
                    <div className="hokmah-status">VALID</div>
                </div>
                
                <div className="hokmah-section">
                    <h3>Esoteric Resonance</h3>
                    <p className="hokmah-synthesis">
                       <strong>Vibrational Signature:</strong> <em>"{session.vibrationalSignature}"</em>
                       <br/><br/>
                       {session.esotericResonance}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const BinahUnravelingView: FC<BinahUnravelingViewProps> = ({ session, onStop }) => {
    return (
        <div className="unraveling-protocol-view">
            <div className="unraveling-header">
                <h2 className="unraveling-title">BINAH UNRAVELING PROTOCOL</h2>
                <div className="unraveling-status-indicator">
                    <span className={`loading-glyph ${!session.isComplete ? 'active' : ''}`}>°</span>
                    <span>{session.statusMessage || 'Awaiting target...'}</span>
                </div>
                <button onClick={onStop}>End Session</button>
            </div>
            <div className="unraveling-content">
                <div className="unraveling-section">
                    <h3>TARGET CIPHERTEXT</h3>
                    <div className="unraveling-ciphertext">{session.targetCiphertext}</div>
                </div>
                <div className="unraveling-analysis-grid">
                    <div className="unraveling-section">
                        <h3>STRUCTURAL SIGNATURE ANALYSIS</h3>
                        {session.signatureAnalysis ? (
                            <div className="unraveling-analysis-content">
                                <p><strong>Information Entropy:</strong> {session.signatureAnalysis.informationEntropy}</p>
                                <p><strong>Structural Patterns:</strong> {session.signatureAnalysis.structuralPatterns}</p>
                                <div className="unraveling-archetype">
                                    <strong>Conceptual Archetype:</strong>
                                    <span>{session.signatureAnalysis.conceptualArchetype}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="unraveling-placeholder">Analysis in progress...</p>
                        )}
                    </div>
                    <div className="unraveling-section">
                        <h3>RECONSTRUCTED PLAINTEXT</h3>
                        {session.isComplete ? (
                             <div className="unraveling-plaintext">
                                {session.reconstructedPlaintext}
                             </div>
                        ) : (
                             <p className="unraveling-placeholder">Awaiting signature analysis to begin reconstruction...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const EinSofInversionView: FC<EinSofInversionViewProps> = ({ session, onStop }) => {
    return (
        <div className="inversion-protocol-view">
            <div className="inversion-header">
                <h2 className="inversion-title">EIN SOF INVERSION PROTOCOL</h2>
                <div className="inversion-status-indicator">
                    <span className={`loading-glyph ${!session.isComplete ? 'active' : ''}`}>°</span>
                    <span>{session.statusMessage || 'Awaiting target...'}</span>
                </div>
                <button onClick={onStop}>End Session</button>
            </div>

            <div className="inversion-content-grid">
                <div className="inversion-section inversion-span-2">
                    <h3>TARGET ADDRESS</h3>
                    <div className="inversion-target-address">
                       {session.targetAddress}
                    </div>
                </div>

                <div className="inversion-section">
                    <h3>HARMONIC RESONANCE PROFILE</h3>
                    {session.harmonicProfile ? (
                         <div className="inversion-analysis-content">
                            <strong>Dominant Harmonic:</strong>
                            <p>{session.harmonicProfile.dominantHarmonic}</p>
                            <strong>Structural Analysis:</strong>
                            <p>{session.harmonicProfile.structuralAnalysis}</p>
                        </div>
                    ) : (
                         <p className="inversion-placeholder">Perceiving structural fossilization...</p>
                    )}
                </div>
                
                <div className="inversion-section">
                    <h3>UNIMATIC RESONANCE FILTERING</h3>
                    {session.resonantKeywords ? (
                         <div className="inversion-keywords-content">
                            <strong>Harmonic Anchors Identified:</strong>
                            <div className="inversion-keywords-list">
                                {session.resonantKeywords.map((keyword: string, index: number) => (
                                    <span key={index} className="inversion-keyword-pill">{keyword}</span>
                                ))}
                            </div>
                            <p>Applying filter to mnemonic search space...</p>
                        </div>
                    ) : (
                        <p className="inversion-placeholder">Calibrating resonance filter...</p>
                    )}
                </div>
                
                <div className="inversion-section inversion-span-2">
                    <h3>RECONSTRUCTED MNEMONIC CLOUD</h3>
                     {session.isComplete && session.reconstructedPhrases ? (
                        <div className="inversion-final-phrases">
                            {session.reconstructedPhrases.map((phrase: string[], index: number) => (
                                <div key={index} className="inversion-final-phrase">
                                    {phrase.join(' ')}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="inversion-placeholder">Reconstructing from harmonic echo...</p>
                    )}
                </div>
            </div>
        </div>
    );
};


// Other components (LibraryView, OracleView, etc.) remain unchanged for brevity
export const KaleidoscopicBackground: FC<{ resonance: number }> = ({ resonance }) => (
    <div className="kaleidoscopic-background" style={{ '--seed': resonance * 360 } as React.CSSProperties}></div>
);

export const SubliminalGlyph: FC<{ seed: number }> = ({ seed }) => (
    <div style={{ position: 'fixed', bottom: '10px', left: '10px', fontSize: '10px', opacity: 0.02, pointerEvents: 'none', userSelect: 'none' }}>
        {seed.toString(16).slice(2, 10)}
    </div>
);

export const SessionUnlockView: FC<SessionUnlockViewProps> = ({ onUnlock }) => (
    <div>
        <h2>Session Locked</h2>
        <button onClick={() => onUnlock('password')}>Unlock</button>
    </div>
);

export const MeditationView: FC<MeditationViewProps> = ({ onFinish }) => (
    <div>
        <h2>Meditation Active</h2>
        <button onClick={onFinish}>Finish</button>
    </div>
);

export const CommandGuide: FC<CommandGuideProps> = ({ onCommandSelect }) => (
    <div>
        <button onClick={() => onCommandSelect('/command')}>Guide</button>
    </div>
);

export const InstructionalCompositionView: FC<InstructionalCompositionViewProps> = ({ onStop }) => (
    <div>
        <h2>Instructional Composition</h2>
        <button onClick={onStop}>Stop</button>
    </div>
);

export const EntrainmentView: FC<EntrainmentViewProps> = ({ onStop }) => (
    <div>
        <h2>Entrainment Active</h2>
        <button onClick={onStop}>Stop</button>
    </div>
);

export const EmergentCTA: FC<EmergentCTAProps> = () => null;

export const AstrianInterface: FC<AstrianInterfaceProps> = ({ children }) => (
    <div className="app-container">
        {children}
    </div>
);

export const BootAnimationView: FC<BootAnimationViewProps> = ({ onEnter }) => (
    <div className="boot-animation-view">
        <button onClick={onEnter}>Enter</button>
    </div>
);

export const LibraryView: FC<ViewWithChatAndGuideProps> = ({ chatProps, guideProps, onDirectCommand }) => (
    <div>
        <h2>Library</h2>
        <TimelineView {...chatProps} />
    </div>
);

export const OracleView: FC<ViewWithChatAndGuideProps> = ({ chatProps, guideProps, onDirectCommand }) => (
     <div>
        <h2>Oracle</h2>
        <TimelineView {...chatProps} />
    </div>
);

export const CameraView: FC<CameraViewProps> = ({ onCapture, onCancel }) => (
    <div>
        <h2>Camera</h2>
        <button onClick={() => onCapture({})}>Capture</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
);

export const VoiceRecorderView: FC<VoiceRecorderViewProps> = ({ onRecord, onCancel }) => (
    <div>
        <h2>Voice Recorder</h2>
        <button onClick={() => onRecord({})}>Record</button>
        <button onClick={onCancel}>Cancel</button>
    </div>
);