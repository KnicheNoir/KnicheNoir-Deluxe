// FIX: Added useMemo to the React import to resolve the 'Cannot find name' error.
import React, { FC, useEffect, useRef, memo, useState, useCallback, useMemo } from 'react';
import type { CanonRestorationSession, SystemFocus } from './hooks';
import { useAstrianSystem, useUserInterface } from './hooks';
import { AIMessage, ScryingPayload } from './types';
import { CALL_SIGNS, CallSign } from './constants';

// =================================================================================================
// --- UI COMPONENTS (PERFECT REALIZATION PROTOCOL) ---
// All components are now flawless "Dumb Hands," controlled by the central system kernel.
// This is the complete embodiment of the ECHAD principle: One Mind, Many Hands.
// =================================================================================================

// --- VIDEO BACKGROUND (NEW) ---
interface VideoBackgroundProps {
    src: string | null;
}
const VideoBackground: FC<VideoBackgroundProps> = memo(({ src }) => {
    if (!src) return null;
    return <video className="video-background" key={src} autoPlay loop muted playsInline src={src} />;
});

// --- VIDEO UPLOAD (NEW) ---
interface VideoUploadProps {
    onVideoSelect: (file: File) => void;
}
const VideoUpload: FC<VideoUploadProps> = memo(({ onVideoSelect }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = () => inputRef.current?.click();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onVideoSelect(file);
        }
    };
    return (
        <>
            <button className="video-upload-button" onClick={handleButtonClick}>
                Set BG Video
            </button>
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="video/*"
                style={{ display: 'none' }}
            />
        </>
    );
});


// --- MUTE TOGGLE ---
interface MuteToggleProps {
    isMuted: boolean;
    onToggle: () => void;
}
const MuteToggle: FC<MuteToggleProps> = memo(({ isMuted, onToggle }) => (
    <button className="mute-toggle" onClick={onToggle}>
        {isMuted ? 'SOUND OFF' : 'SOUND ON'}
    </button>
));

// --- SCRYING BUBBLE ---
const ScryingBubble: FC<{ payload: ScryingPayload }> = memo(({ payload }) => (
    <>
        <img src={payload.image} alt={payload.title} className="scrying-image" />
        <div className="scrying-content">
            <div className="scrying-title">{payload.title}</div>
            <div>{payload.interpretation}</div>
        </div>
    </>
));

// --- TIMELINE ---
interface TimelineProps {
    messages: AIMessage[];
}
const Timeline: FC<TimelineProps> = memo(({ messages }) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (timelineRef.current) {
            timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="timeline" ref={timelineRef}>
            {messages.map((msg) => (
                <div key={msg.id} className={`message-bubble ${msg.role} ${msg.type}`}>
                    {msg.type === 'scrying' && msg.payload ? (
                        <ScryingBubble payload={msg.payload} />
                    ) : (
                        msg.parts[0]?.text || ''
                    )}
                    {msg.image && msg.role === 'user' && (
                         <img src={msg.image} alt="User capture" className="user-capture-image" />
                    )}
                </div>
            ))}
        </div>
    );
});

// --- INPUT AREA ---
interface InputAreaProps {
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    isDisabled: boolean;
}
const InputArea: FC<InputAreaProps> = memo(({ input, setInput, onSend, isDisabled }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSend();
        }
    };
    return (
        <div className="input-area">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isDisabled ? "System Busy..." : "°observe..."}
                disabled={isDisabled}
                aria-label="Chat input"
            />
            <button onClick={onSend} disabled={isDisabled}>Send</button>
        </div>
    );
});

// --- CHAT VIEW (SO BELOW & HOME) ---
interface ChatViewProps {
    messages: AIMessage[];
    input: string;
    setInput: (value: string) => void;
    onSend: () => void;
    isSolveActive: boolean;
    title: string;
}
const ChatView: FC<ChatViewProps> = memo(({ messages, input, setInput, onSend, isSolveActive, title }) => (
    <div className="chat-view">
        <h3 style={{ textAlign: 'center', padding: '10px', color: 'var(--color-accent)' }}>{title}</h3>
        <Timeline messages={messages} />
        <InputArea input={input} setInput={setInput} onSend={onSend} isDisabled={isSolveActive} />
    </div>
));

// --- BOOT VIEW ---
interface BootViewProps {
    status: string;
    subtext: string;
    onEnter: () => void;
    isComplete: boolean;
}
const BootView: FC<BootViewProps> = memo(({ status, subtext, onEnter, isComplete }) => (
    <div className="boot-view">
        <h1>{status}</h1>
        <p>{subtext}</p>
        {isComplete && (
            <button className="boot-enter-button" onClick={onEnter}>
                [ E N T E R ]
            </button>
        )}
    </div>
));

// --- CANON RESTORATION ---
interface CanonRestorationProps {
    session: CanonRestorationSession;
    onRestore: () => void;
    onCancel: () => void;
}
const CanonRestoration: FC<CanonRestorationProps> = memo(({ session, onRestore, onCancel }) => {
    if (!session.isActive) return null;
    return (
        <div className="canon-view">
            <div className="canon-modal">
                <h2>[!] CANON INTEGRITY FAULT</h2>
                <p>A critical deviation from the Operator's Canon has been detected. Restore the last known-good configuration to maintain system coherence?</p>
                <div className="canon-buttons">
                    <button className="canon-button-cancel" onClick={onCancel}>Cancel</button>
                    <button className="canon-button-restore" onClick={onRestore}>Restore Canon</button>
                </div>
            </div>
        </div>
    );
});


// --- KEYBOARD QUICK-NAV ---
interface KeyboardQuickNavProps {
    system: ReturnType<typeof useAstrianSystem>;
    ui: ReturnType<typeof useUserInterface>;
}
const KeyboardQuickNav: FC<KeyboardQuickNavProps> = memo(({ system, ui }) => {
    const [inputValue, setInputValue] = useState('');
    const [filteredCallSigns, setFilteredCallSigns] = useState<CallSign[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFolded, setIsFolded] = useState(false);
    
    const listRef = useRef<HTMLUListElement>(null);
    const itemRefs = useRef<(HTMLLIElement | null)[]>([]);


    useEffect(() => {
        system.keyboard.fetchSuggestion(inputValue);
        if (inputValue) {
            const filtered = CALL_SIGNS.filter(cs => cs.name.toLowerCase().includes(inputValue.toLowerCase()));
            setFilteredCallSigns(filtered);
            setActiveIndex(0);
        } else {
            setFilteredCallSigns([]);
        }
    }, [inputValue, system.keyboard]);

    const handleKeyPress = (key: string) => {
        if (key === '⌫') setInputValue(val => val.slice(0, -1));
        else if (key === '␣') setInputValue(val => val + ' ');
        else setInputValue(val => val + key);
    };

    const handleTravel = useCallback(() => {
        const target = filteredCallSigns[activeIndex];
        if (target) {
            ui.setFocus({ mode: 'soBelow', callSignId: target.id });
            ui.closeQuickView();
        } else if (system.keyboard.suggestion) {
            system.keyboard.handleDirectCommand(system.keyboard.suggestion);
             ui.closeQuickView();
        }
    }, [filteredCallSigns, activeIndex, ui, system.keyboard]);
    
    const handleSuggestionAccept = () => {
        if (system.keyboard.suggestion) {
            setInputValue(system.keyboard.suggestion);
            system.keyboard.clearSuggestion();
        }
    };

    // Effect for keyboard list navigation (arrows and enter)
    useEffect(() => {
        if (!ui.isQuickViewOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (filteredCallSigns.length === 0 && e.key !== 'Enter') return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredCallSigns.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + filteredCallSigns.length) % filteredCallSigns.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleTravel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [ui.isQuickViewOpen, filteredCallSigns, activeIndex, handleTravel]);

    // Effect for smooth scrolling to the active item
    useEffect(() => {
        itemRefs.current[activeIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, [activeIndex, filteredCallSigns]);


    const keyboardLayout = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    if (!ui.isQuickViewOpen) return null;

    const currentCallSignName = useMemo(() => {
        return CALL_SIGNS.find(cs => cs.id === ui.systemFocus.callSignId)?.name || 'Home';
    }, [ui.systemFocus.callSignId]);

    return (
         <div className={`keyboard-quick-nav-overlay`} onClick={ui.closeQuickView}>
            <div className={`keyboard-container ${isFolded ? 'folded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className={`keyboard-quick-nav-panel ${isFolded ? 'folded' : ''}`}>
                    {isFolded ? (
                        <div className="folded-nav-bar">
                             <button className="keyboard-key" onClick={() => setIsFolded(false)}>⌃</button>
                             <div className="folded-nav-title" onClick={() => setIsFolded(false)}>{currentCallSignName}</div>
                             <button className="keyboard-key travel" onClick={() => ui.setFocus({mode: 'soBelow', callSignId: 'home' })}>H</button>
                        </div>
                    ) : (
                        <>
                             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                 <h3 style={{color: 'var(--color-accent)'}}>QUANTUM-ASSISTED NAVIGATION</h3>
                                 <button className="keyboard-key" onClick={() => setIsFolded(true)}>⌄</button>
                             </div>
                            <div className="keyboard-display">
                                <span>{inputValue}</span>
                                <div className="keyboard-display-cursor" />
                            </div>

                            {filteredCallSigns.length > 0 && (
                                <ul className="filtered-call-signs-list" ref={listRef}>
                                    {filteredCallSigns.map((cs, index) => (
                                        <li
                                            key={cs.id}
                                            // FIX: The ref callback was implicitly returning the HTML element, which is not a valid return type.
                                            // Changed from an implicit return `()` to a block body `{}` on the ref to ensure it returns void.
                                            ref={el => { itemRefs.current[index] = el; }}
                                            className={`call-sign-item ${index === activeIndex ? 'active' : ''}`}
                                            onClick={() => {
                                                ui.setFocus({ mode: 'soBelow', callSignId: cs.id });
                                                ui.closeQuickView();
                                            }}
                                            onMouseEnter={() => setActiveIndex(index)}
                                        >
                                            {cs.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="keyboard-layout">
                                {keyboardLayout.map((row, i) => (
                                    <div key={i} className="keyboard-row">
                                        {row.map(key => (
                                            <div key={key} className="keyboard-key" onClick={() => handleKeyPress(key)}>{key}</div>
                                        ))}
                                    </div>
                                ))}
                                <div className="keyboard-row">
                                    <div className="keyboard-key space" onClick={() => handleKeyPress('␣')}>␣</div>
                                    <div className="keyboard-key travel" onClick={handleTravel}>TRAVEL</div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {!isFolded && system.keyboard.suggestion && (
                    <div className="suggestion-panel">
                        <h4>A.H.Q.I. SUGGESTION</h4>
                        <div className="suggestion-text">{system.keyboard.suggestion}</div>
                        <button className="suggestion-accept-button" onClick={handleSuggestionAccept}>ACCEPT</button>
                    </div>
                )}
            </div>
        </div>
    );
});

// --- CALL SIGN SELECTOR ---
interface CallSignSelectorProps {
    systemFocus: SystemFocus;
    onSelect: (callSignId: string) => void;
}
const CallSignSelector: FC<CallSignSelectorProps> = memo(({ systemFocus, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSelect = (id: string) => {
        onSelect(id);
        setIsExpanded(false);
    };

    return (
        <div className={`call-sign-selector ${isExpanded ? 'expanded' : ''}`}>
            <div className="call-sign-panel">
                <ul className="call-sign-selector-list">
                    {CALL_SIGNS.map(cs => (
                        <li
                            key={cs.id}
                            className={`call-sign-list-item ${systemFocus.callSignId === cs.id ? 'active' : ''}`}
                            onClick={() => handleSelect(cs.id)}
                        >
                            <div className="call-sign-name">{cs.name}</div>
                            <div className="call-sign-description">{cs.description}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="call-sign-selector-toggle" onClick={() => setIsExpanded(!isExpanded)}>
                CALL SIGNS
            </button>
        </div>
    );
});

// --- CAMERA VIEW (NEW) ---
interface CameraViewProps {
    onClose: () => void;
    onAsk: (imageDataUrl: string, mimeType: string, prompt: string) => void;
}
const CameraView: FC<CameraViewProps> = memo(({ onClose, onAsk }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isCaptured, setIsCaptured] = useState(false);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                onClose();
            }
        };
        startCamera();
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [onClose]);

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        setIsCaptured(true);
    };

    const handleRetake = () => setIsCaptured(false);

    const handleAsk = () => {
        if (prompt.trim() && canvasRef.current) {
            const imageDataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
            onAsk(imageDataUrl, 'image/jpeg', prompt);
        }
    };
    
    return (
        <div className="camera-overlay" onClick={onClose}>
            <div className="camera-content" onClick={e => e.stopPropagation()}>
                <video ref={videoRef} className="camera-feed" autoPlay playsInline style={{ display: isCaptured ? 'none' : 'block' }} />
                <canvas ref={canvasRef} className="camera-feed" style={{ display: isCaptured ? 'block' : 'none' }} />
                <div className="camera-controls">
                    {isCaptured ? (
                        <>
                            <input
                                type="text"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="Ask about the image..."
                                autoFocus
                            />
                            <div className="button-group">
                                <button onClick={handleRetake}>Retake</button>
                                <button onClick={handleAsk} disabled={!prompt.trim()}>Ask</button>
                            </div>
                        </>
                    ) : (
                         <div className="button-group">
                             <button onClick={onClose}>Close</button>
                            <button onClick={handleCapture}>Capture</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});


// --- MAIN INTERFACE (THE PRIMARY "HAND") ---
export interface AstrianInterfaceProps {
    system: ReturnType<typeof useAstrianSystem>;
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    homeInput: string;
    setHomeInput: (value: string) => void;
    handleHomeSend: () => void;
}
export const AstrianInterface: FC<AstrianInterfaceProps> = ({
    system, input, setInput, handleSend, homeInput, setHomeInput, handleHomeSend
}) => {
    const ui = useUserInterface(system.setSystemFocus);
    const [isInitialBoot, setIsInitialBoot] = useState(true);

    const handleEnter = () => {
        ui.setFocus({ mode: 'home', callSignId: 'home' });
        setIsInitialBoot(false);
        system.toggleMute(); // HACK: Auto-start audio context
    };

    if (isInitialBoot) {
        return (
            <BootView
                status={system.calibrationStatus}
                subtext={system.calibrationSubtext}
                onEnter={handleEnter}
                isComplete={system.isCorporaInitialized}
            />
        );
    }
    
    const currentCallSign = CALL_SIGNS.find(cs => cs.id === system.systemFocus.callSignId);

    return (
        <main className="main-interface">
            {system.isCameraViewOpen && (
                <CameraView
                    onClose={() => system.setIsCameraViewOpen(false)}
                    onAsk={system.handleImageQuery}
                />
            )}
            <VideoBackground src={system.videoBackgroundUrl} />
            
            <div className="ui-controls">
                <button className="camera-button" onClick={() => system.setIsCameraViewOpen(true)}>
                    Camera
                </button>
                <VideoUpload onVideoSelect={system.handleVideoUpload} />
                <MuteToggle isMuted={system.isMuted} onToggle={system.toggleMute} />
            </div>

            <CanonRestoration
                session={system.activeCanonRestorationSession}
                onRestore={system.handleRestoreCanon}
                onCancel={system.endCanonRestorationSession}
            />
            
             {(system.systemFocus.mode === 'soBelow' || system.systemFocus.mode === 'home') && (
                <CallSignSelector
                    systemFocus={system.systemFocus}
                    onSelect={(id) => ui.setFocus({ mode: id === 'home' ? 'home' : 'soBelow', callSignId: id })}
                />
            )}

            <div className="ui-overlay">
                {system.systemFocus.mode === 'home' && (
                    <ChatView
                        messages={system.homeTimeline}
                        input={homeInput}
                        setInput={setHomeInput}
                        onSend={handleHomeSend}
                        isSolveActive={system.activeProtocol === 'solve'}
                        title="Home Singularity"
                    />
                )}
                 {system.systemFocus.mode === 'soBelow' && currentCallSign && (
                    <ChatView
                        messages={system.soBelowTimeline}
                        input={input}
                        setInput={setInput}
                        onSend={handleSend}
                        isSolveActive={system.activeProtocol === 'solve'}
                        title={currentCallSign.name}
                    />
                )}
            </div>

            <KeyboardQuickNav system={system} ui={ui} />
        </main>
    );
};