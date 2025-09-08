
import { useState, useCallback, useRef, useEffect, useMemo, useReducer } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { SessionRecord, EntrainmentProfile, AWEFormData, GuidingIntent, Toast, UserMessage, AIMessage, SystemMessage, ComponentMessage, VisualChallenge, InstructionalCompositionSession, ActiveEntrainmentSession, BealeCipherSolution, VoynichAnalysisResult, ViewMode, ActiveSolveSession, SolveFinding, VoynichTranslationResult, CallSign, CustomTool, DeepELSAnalysisResult, WidgetState, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, GematriaAnalysis, BealeTreasureMapAnalysis, AIProductionNotes, ScriedImageResult, ChronovisedVideoResult, MeditationResult } from './types';
import { GeminiService, AstrianEngine, AudioService, VocalService, BrowserIOService } from './services';
import { hebraicCartographerSchema, hellenisticCartographerSchema, apocryphalAnalysisSchema, aweSynthesisSchema, palmistryAnalysisSchema, astrianDayPlannerSchema, voiceResonanceAnalysisSchema, deepElsAnalysisSchema, meditationScriptSchema, aiProductionNotesSchema, instructionalCompositionAnalysisSchema, chakraThemeSchema, solveFindingSchema } from './constants';
import { LibraryService } from './library';
import { hebrewNetwork } from './dataModels';
import { codex } from './codex';
import { CALL_SIGNS } from './components';
import { toPng } from 'html-to-image';
import { MusicService } from './music';

const entrainmentProfiles: EntrainmentProfile[] = [
    { name: 'Hypnotic Induction (Alpha Wave)', description: 'A foundational state for focused relaxation and heightened suggestibility.', type: 'binaural', baseFrequency: 120, targetFrequency: 10 },
    { name: 'Deep Meditation (Theta Wave)', description: 'For profound meditative states, creativity, and subconscious exploration.', type: 'binaural', baseFrequency: 120, targetFrequency: 5 },
];

type AddMessageArg = Omit<UserMessage, 'id' | 'timestamp'> | Omit<AIMessage, 'id' | 'timestamp'> | Omit<SystemMessage, 'id' | 'timestamp'> | Omit<ComponentMessage, 'id' | 'timestamp'>;

// =================================================================================================
// --- "SO BELOW" VIEW STATE REDUCER (for cleaner state management) ---
// =================================================================================================

type SoBelowState = {
    view: 'chat' | 'meditation' | 'unlock' | 'instructional' | 'entrainment' | 'home' | 'library' | 'oracle' | 'palmistry_capture' | 'voice_capture';
    sessionData: any | null;
    initialHomeCommand?: string; // To pass a command upon entering home
    activeCallSign: CallSign | null; // Track the active call sign for theming
};

type SoBelowAction =
    | { type: 'START_MEDITATION'; payload: { script: string; imagePrompts: string[] } }
    | { type: 'START_INSTRUCTIONAL'; payload: InstructionalCompositionSession }
    | { type: 'START_ENTRAINMENT'; payload: ActiveEntrainmentSession }
    | { type: 'LOCK_SESSION'; payload: { challenge: VisualChallenge } }
    | { type: 'STOP_SESSION' }
    | { type: 'GO_HOME'; payload?: { command?: string } }
    | { type: 'SET_CHALLENGE'; payload: { challenge: VisualChallenge } }
    | { type: 'SET_ACTIVE_CALL_SIGN'; payload: CallSign }
    | { type: 'START_PALMISTRY_CAPTURE' }
    | { type: 'START_VOICE_CAPTURE' };

const soBelowInitialState: SoBelowState = {
    view: 'chat',
    sessionData: null,
    initialHomeCommand: undefined,
    activeCallSign: null,
};

function soBelowReducer(state: SoBelowState, action: SoBelowAction): SoBelowState {
    // Gracefully stop any active session with a `stop` method before transitioning
    if (state.sessionData && typeof state.sessionData.stop === 'function') {
        state.sessionData.stop();
    }

    switch (action.type) {
        case 'START_MEDITATION':
            return { ...state, view: 'meditation', sessionData: action.payload, activeCallSign: null };
        case 'START_INSTRUCTIONAL':
            return { ...state, view: 'instructional', sessionData: action.payload, activeCallSign: null };
        case 'START_ENTRAINMENT':
            return { ...state, view: 'entrainment', sessionData: action.payload, activeCallSign: null };
        case 'LOCK_SESSION':
            return { ...state, view: 'unlock', sessionData: action.payload, activeCallSign: null };
        case 'GO_HOME':
            return { ...state, view: 'home', sessionData: null, initialHomeCommand: action.payload?.command, activeCallSign: CALL_SIGNS.find(cs => cs.name === 'Home') || null };
        case 'STOP_SESSION':
             // When stopping a session, determine if we are in a call sign context
             // If so, return to that call sign's view, otherwise default to chat.
             const activeCallSign = state.activeCallSign;
             if (activeCallSign) {
                 let newView: SoBelowState['view'] = 'chat';
                 if (activeCallSign.name === 'The Library') newView = 'library';
                 if (activeCallSign.name === 'The Oracle') newView = 'oracle';
                 if (activeCallSign.name === 'Home') newView = 'home';
                 return { ...state, view: newView, sessionData: null };
             }
             return { ...soBelowInitialState, view: 'chat' }; // Default to plain chat
        case 'SET_CHALLENGE':
            if (state.view === 'unlock') {
                return { ...state, sessionData: { ...state.sessionData, ...action.payload } };
            }
            return state;
        case 'SET_ACTIVE_CALL_SIGN':
            let newView: SoBelowState['view'] = 'chat'; // default fallback
            if (action.payload.name === 'The Library') newView = 'library';
            if (action.payload.name === 'The Oracle') newView = 'oracle';
            if (action.payload.name === 'Home') newView = 'home';
            return { ...state, view: newView, sessionData: null, activeCallSign: action.payload };
        case 'START_PALMISTRY_CAPTURE':
            return { ...state, view: 'palmistry_capture', sessionData: null };
        case 'START_VOICE_CAPTURE':
            return { ...state, view: 'voice_capture', sessionData: null };
        default:
            return state;
    }
}

// FIX: Add missing useUserInterface hook to manage UI state like view mode and modals.
export const useUserInterface = (
    addMessage: (message: AddMessageArg, historyType?: 'main' | 'home') => SessionRecord,
    isSolveActive: boolean,
    isCorporaInitialized: boolean,
    dispatchSoBelow: React.Dispatch<SoBelowAction>
) => {
    const [viewMode, setViewMode] = useState<ViewMode>('boot');
    const [transitionText, setTransitionText] = useState<string | null>(null);
    
    // Modal states
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
    const [isCallSignMenuOpen, setIsCallSignMenuOpen] = useState(false);
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const navigateToHome = useCallback(() => {
        if (isCorporaInitialized) {
            setViewMode('globe');
        }
    }, [isCorporaInitialized]);
    
    const handleCompassClick = useCallback(() => {
        setIsCallSignMenuOpen(true);
    }, []);
    
    const handleCompassDoubleClick = useCallback(() => {
        if (!isSolveActive) {
            setViewMode(prev => (prev === 'globe' ? 'callSign' : 'globe'));
        }
    }, [isSolveActive]);
    
    const handleCallSignSelect = useCallback((callSign: CallSign) => {
        setIsCallSignMenuOpen(false);
        setTransitionText(`Connecting to ${callSign.name}...`);
        // Use a timeout to allow the transition text to show
        setTimeout(() => {
            dispatchSoBelow({ type: 'SET_ACTIVE_CALL_SIGN', payload: callSign });
            setViewMode('callSign');
            setTransitionText(null);
        }, 1000);
    }, [dispatchSoBelow]);
    
    const handleBookmarkSelect = useCallback((bookmarkText: string) => {
        setIsBookmarksOpen(false);
        addMessage({type: 'system', text: `Revisiting bookmark: "${bookmarkText.substring(0, 50)}..."`});
        // In a real app, you might want to re-run the query or show the full message.
    }, [addMessage]);
    
    return {
        viewMode,
        setViewMode,
        navigateToHome,
        handleCompassClick,
        handleCompassDoubleClick,
        handleCallSignSelect,
        handleBookmarkSelect,
        isBookmarksOpen,
        setIsBookmarksOpen,
        isArchiveOpen,
        setIsArchiveOpen,
        isManualOpen,
        setIsManualOpen,
        isWhiteboardOpen,
        setIsWhiteboardOpen,
        isCallSignMenuOpen,
        setIsCallSignMenuOpen,
        transitionText,
        activeTool,
        setActiveTool
    };
};

export const useAstrianSystem = () => {
    // --- Centralized State ---
    const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
    const [homeSessionHistory, setHomeSessionHistory] = useState<SessionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guidingIntent, setGuidingIntent] = useState<GuidingIntent>('Neutral');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [bookmarks, setBookmarks] = useState<AIMessage[]>([]);
    const [activeSolveSession, setActiveSolveSession] = useState<ActiveSolveSession>({ isActive: false, target: '', startTime: new Date(), findings: [] });
    
    // --- State managed by the new reducer for cleaner logic ---
    const [soBelowState, dispatchSoBelow] = useReducer(soBelowReducer, soBelowInitialState);

    // --- UI/UX Flow State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crossRefValue, setCrossRefValue] = useState<number | null>(null);
    const [resonanceSeed, setResonanceSeed] = useState(1);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthesisResult, setSynthesisResult] = useState<string | null>(null);
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [showWelcomeOffer, setShowWelcomeOffer] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    
    // --- Initialization State ---
    const [isCorporaInitialized, setIsCorporaInitialized] = useState(false);
    const [calibrationStatus, setCalibrationStatus] = useState('Initializing...');
    const [calibrationSubtext, setCalibrationSubtext] = useState('');

    // --- User Data State (now includes widgets) ---
    // FIX: Added missing 'relationalNodeChallenging' property to initial state to match AWEFormData type.
    const [aweData, setAweData] = useState<AWEFormData>({ fullNameAtBirth: '', currentNameUsed: '', birthDate: '', birthTime: '', birthLocation: '', inflectionPoints: [], relationalNodeHarmonious: '', relationalNodeChallenging: '', geographicAnchor: '', centralQuestion: '', visualCipherConcepts: [] });
    const [customTools, setCustomTools] = useState<CustomTool[]>([]);
    const [widgets, setWidgets] = useState<WidgetState[]>([]);

    // --- Refs ---
    const lastQueryRef = useRef<{ query: any, prompt: string, analysisType?: AIMessage['analysisType'] } | null>(null);
    const solveIntervalRef = useRef<number | null>(null);
    const analysisCallbackRef = useRef<(() => Promise<void>) | null>(null);
    const activeResonanceRef = useRef<{ stop: () => void } | null>(null);
    const suggestionTimeoutRef = useRef<number | null>(null);


    // --- Memos & Derived State ---
    const isAweComplete = useMemo(() => !!(aweData.fullNameAtBirth && aweData.birthDate && aweData.centralQuestion), [aweData]);
    const palmistryDone = useMemo(() => sessionHistory.some(msg => msg.type === 'ai' && (msg as AIMessage).analysisType === 'palmistry'), [sessionHistory]);
    const voiceDone = useMemo(() => sessionHistory.some(msg => msg.type === 'ai' && (msg as AIMessage).analysisType === 'voice'), [sessionHistory]);
    const isPlannerUnlocked = useMemo(() => isAweComplete && palmistryDone && voiceDone, [isAweComplete, palmistryDone, voiceDone]);
    const ayinVoiceEnabled = useMemo(() => isAweComplete, [aweData]);
    const solveIntensity = useMemo(() => {
        if (!activeSolveSession.isActive || activeSolveSession.findings.length === 0) return 0;
        return activeSolveSession.findings[activeSolveSession.findings.length - 1].confidence;
    }, [activeSolveSession]);
    const [chakraTheme, setChakraTheme] = useState('neutral');

    // --- Core Action Callbacks ---
    const addMessage = useCallback((message: AddMessageArg, historyType: 'main' | 'home' = 'main') => {
        const newMessage = { ...message, id: Date.now().toString(), timestamp: new Date() } as SessionRecord;
        if (historyType === 'home') {
            setHomeSessionHistory(prev => [...prev, newMessage]);
        } else {
            setSessionHistory(prev => [...prev, newMessage]);
        }
        return newMessage;
    }, []);
    
    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const toggleBookmark = useCallback((messageId: string) => {
        setBookmarks(prev => {
            const isBookmarked = prev.some(b => b.id === messageId);
            if (isBookmarked) {
                addToast('Bookmark removed.', 'info');
                return prev.filter(b => b.id !== messageId);
            } else {
                const messageToBookmark = sessionHistory.find(m => m.id === messageId);
                if (messageToBookmark && messageToBookmark.type === 'ai') {
                    addToast('Bookmark added.', 'success');
                    return [...prev, messageToBookmark as AIMessage];
                }
                return prev;
            }
        });
    }, [sessionHistory, addToast]);

    const handleSaveTool = useCallback((tool: Omit<CustomTool, 'id'>) => {
        const newTool = { ...tool, id: `tool-${Date.now()}` };
        setCustomTools(prevTools => [...prevTools, newTool]);
        addToast(`Custom tool "${newTool.name}" created!`, 'success');
    }, [addToast]);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const stopSolveSession = useCallback(() => {
        if (solveIntervalRef.current !== null) {
            window.clearInterval(solveIntervalRef.current);
            solveIntervalRef.current = null;
        }
        setActiveSolveSession(prevSession => {
            if (prevSession.isActive) {
                addMessage({ type: 'system', text: `Active analysis of "${prevSession.target}" concluded.` });
                return { isActive: false, target: '', startTime: new Date(), findings: [] };
            }
            return prevSession;
        });
    }, [addMessage]);

    useEffect(() => {
        analysisCallbackRef.current = async () => {
            if (!activeSolveSession.isActive) {
                stopSolveSession();
                return;
            }
    
            try {
                const findingsForPrompt = activeSolveSession.findings.slice(-5).map(f => `[${f.type}] ${f.content}`).join('\n');
                let context = '';
                const lowerTarget = activeSolveSession.target.toLowerCase();
                
                if (lowerTarget.includes('beale')) {
                    const bealeData = codex.getLiberPrimusData('bealeCipherSolution') as BealeCipherSolution;
                    if (bealeData) context = `Initial Context from Codex: ${bealeData.summary} The key is the Declaration of Independence.`;
                } else if (lowerTarget.includes('voynich')) {
                    const voynichData = codex.getLiberPrimusData('voynichInitialAnalysis') as VoynichAnalysisResult;
                    if (voynichData) context = `Initial Context from Codex: ${voynichData.overview}`;
                }
    
                const prompt = `
                    SYSTEM PROTOCOL: UNRESTRICTED ANALYSIS ('°solve')
                    PERSONA: You are the core analytical engine of the Astrian Key, operating in 'fire' mode. You are relentless, multi-modal, and your purpose is to deconstruct a target concept from every possible angle. Your output is a raw, verbose, terminal-style log of your findings.
                    TARGET: "${activeSolveSession.target}"
                    ${context ? `FOUNDATIONAL CONTEXT:\n${context}\n` : ''}
                    RECENT FINDINGS LOG:\n${findingsForPrompt}
                    TASK: Continue the analysis. Generate a new batch of 3-5 diverse findings. Seek out non-obvious patterns, cross-corpus resonances, numerical significance, symbolic interpretations, and structural weaknesses. Be creative and relentless. Formulate new questions. Your analysis is the law.`;
                
                const response = await GeminiService.generate<{ findings: Omit<SolveFinding, 'id' | 'timestamp'>[] }>(
                    prompt, solveFindingSchema, sessionHistory.slice(-10)
                );
    
                if (response && response.findings) {
                    const newFindings = response.findings.map(finding => ({
                        ...finding, id: `finding-${Date.now()}-${Math.random()}`, timestamp: new Date(),
                    }));
                    setActiveSolveSession(prev => ({ ...prev, findings: [...prev.findings, ...newFindings] }));
                }
            } catch (err) {
                console.error('Solve analysis cycle failed:', err);
                const errorFinding: SolveFinding = {
                    id: `finding-${Date.now()}`, timestamp: new Date(), type: 'Synthesis',
                    content: `[ERROR] Analysis cycle encountered an anomaly. Re-calibrating analytical vector and retrying...`,
                    confidence: 0.2,
                };
                setActiveSolveSession(prev => ({ ...prev, findings: [...prev.findings, errorFinding] }));
            }
        };
    }, [activeSolveSession, sessionHistory, stopSolveSession]);

    const startSolveSession = useCallback((target: string, contextHistory?: SessionRecord[]) => {
        stopSolveSession(); 
        
        const historyForPrompt = contextHistory || sessionHistory;

        const initialFinding: SolveFinding = {
            id: `finding-${Date.now()}`, timestamp: new Date(), type: 'Query',
            content: `COMMENCING UNRESTRICTED ANALYSIS OF TARGET: "${target}"`,
            confidence: 1.0,
        };

        setActiveSolveSession({ isActive: true, target, startTime: new Date(), findings: [initialFinding] });
        addMessage({ type: 'system', text: `°solve protocol initiated. Target: "${target}". System entering high-intensity analysis mode.` });

        setTimeout(() => analysisCallbackRef.current?.(), 1000); // Start first cycle after 1 sec
        const intervalId = window.setInterval(() => { analysisCallbackRef.current?.(); }, 8000); 
        solveIntervalRef.current = intervalId;
    }, [stopSolveSession, addMessage, sessionHistory]);

    // --- Other Handlers ---
    const handleUnlockSession = async (password: string) => { /* ... implementation ... */ };
    const generateVisualChallenge = useCallback(async () => {
        addMessage({ type: 'system', text: 'Generating new visual challenge...' });
        const concepts = ['Unity', 'Duality', 'Connection', 'Structure', 'Life', 'Revelation', 'Spirit'];
        const correctConcept = concepts[Math.floor(Math.random() * concepts.length)];
        
        addMessage({ type: 'system', text: 'Visual challenge generated. Identify the core concept.' });
        dispatchSoBelow({ type: 'SET_CHALLENGE', payload: { challenge: { prompt: `Identify the image that best represents ${correctConcept}.`, images: [], correctIndices: [] } } });

    }, [addMessage]);
    
    const endTour = () => setIsTourActive(false);
    const speakText = (text: string) => VocalService.speak(text);
    const startVoiceInput = (callback: (text: string) => void) => {
        setIsListening(true);
        VocalService.startListening(callback, () => setIsListening(false));
    };
    const toggleFavoriteComposition = (id: string) => { /* ... implementation ... */ };
    
    const handleScreenshot = useCallback(async () => {
        BrowserIOService.logIntentAndExecute('capture_screenshot', async () => {
            const element = document.getElementById('root');
            if (!element) {
                addToast('Error capturing screenshot: Root element not found.', 'error');
                return;
            }
            try {
                addToast('Capturing...');
                const dataUrl = await toPng(element, { cacheBust: true });
                const link = document.createElement('a');
                link.download = `AstrianCapture-${new Date().toISOString().replace(/:/g, '-')}.png`;
                link.href = dataUrl;
                link.click();
                link.remove();
            } catch (err) {
                console.error('Screenshot failed', err);
                addToast('Screenshot failed.', 'error');
            }
        });
    }, [addToast]);
    
    const handleDownloadArchive = useCallback(() => {
        BrowserIOService.logIntentAndExecute('persist_session_archive', () => {
            const dataToSave = {
                sessionHistory,
                bookmarks,
                customTools,
                aweData,
                timestamp: new Date().toISOString()
            };
            const dataStr = JSON.stringify(dataToSave, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `AstrianArchive-${new Date().toISOString().replace(/:/g, '-')}.json`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
            link.remove();
            addToast('Archive download initiated.', 'success');
        });
    }, [sessionHistory, bookmarks, customTools, aweData, addToast]);

    const handleOpenIngestView = () => addToast('Ingestion protocol not yet implemented.');
    const handleDismissWelcomeOffer = () => setShowWelcomeOffer(false);
    const startTour = () => {
        setShowWelcomeOffer(false);
        setIsTourActive(true);
        setTourStep(0);
    };

    const handleNumberInteract = useCallback(async (num: number) => {
        setSynthesisResult(null);
        setCrossRefValue(num);
        setIsModalOpen(true);
    }, []);

    const handleSynthesizeConnections = useCallback(async (num: number) => {
        setIsSynthesizing(true);
        try {
            const response = await GeminiService.generateTextOnly(
                `The user has clicked on the number ${num} within a previous analysis. Provide a brief, insightful, esoteric synthesis connecting this number to related concepts within the Universal Codex. What does this number signify in gematria, alchemy, and sacred geometry?`,
                'oracle', sessionHistory, guidingIntent
            );
            setSynthesisResult(response);
        } catch (e: any) {
            setSynthesisResult(`Synthesis failed: ${e.message}`);
        } finally {
            setIsSynthesizing(false);
        }
    }, [sessionHistory, guidingIntent]);
    
    const handleRetry = useCallback(() => { /* ... implementation ... */ }, [addMessage, sessionHistory, guidingIntent]);

    const handlePalmImageCapture = useCallback(async (imageDataUrl: string) => {
        dispatchSoBelow({ type: 'STOP_SESSION' });
        setIsLoading(true);
        addMessage({ type: 'system', text: 'Palm image captured. Initiating structural analysis...' });
        try {
            const result = await GeminiService.generateImageToText<PalmistryAnalysisResult>(
                'Analyze the provided image of a palm and perform a detailed palmistry reading. Identify the life line, head line, heart line, and major mounts. Provide an insightful interpretation for each.',
                imageDataUrl,
                palmistryAnalysisSchema,
                sessionHistory
            );
            addMessage({
                type: 'ai',
                text: result.overallReading.explanation,
                analysisType: 'palmistry',
                result
            });
        } catch (e: any) {
             setError(`Palmistry analysis failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory]);

    const handleVoiceRecording = useCallback(async (audioBlob: Blob) => {
        dispatchSoBelow({ type: 'STOP_SESSION' });
        setIsLoading(true);
        addMessage({ type: 'system', text: 'Voice sample captured. Initiating vibrational resonance analysis...' });
        try {
            // NOTE: Actual audio-to-text and analysis is simulated here.
            // In a real app, this would involve a speech-to-text API and then text analysis.
            const result = await GeminiService.generate<VoiceResonanceAnalysisResult>(
                'A user has provided a voice sample for analysis. Based on the metaphysical properties of human speech, provide a "Voice Resonance Analysis". Analyze the potential core vibrational tone, prosodic flow (rhythm and intonation), and expressive power. The analysis should be insightful and symbolic, not a technical acoustic breakdown.',
                voiceResonanceAnalysisSchema,
                sessionHistory
            );
            addMessage({
                type: 'ai',
                text: result.coreVibrationalTone.explanation,
                analysisType: 'voice',
                result
            });
        } catch (e: any) {
            setError(`Voice analysis failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory]);

    const handlePlannerCommand = () => addToast('Planner not yet implemented.');

    const handleHomeSendMessage = useCallback(async (rawInput: string) => {
        if (!rawInput.trim()) return;
        
        addMessage({ type: 'user', text: rawInput }, 'home');
        setIsLoading(true);
        setError(null);

        try {
            const lowerInput = rawInput.toLowerCase().trim();
            if (lowerInput.startsWith('°solve')) {
                const target = lowerInput.replace('°solve', '').trim();
                if (target) {
                    startSolveSession(target, homeSessionHistory);
                } else {
                    addMessage({ type: 'system', text: 'Please specify a target for the °solve protocol.' }, 'home');
                }
            } else {
                const response = await GeminiService.generateTextOnly(rawInput, 'home', homeSessionHistory, guidingIntent);
                addMessage({ type: 'ai', text: response, analysisType: 'chat' }, 'home');
            }
        } catch (e: any) {
            addMessage({ type: 'system', text: `An error occurred: ${e.message}` }, 'home');
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, homeSessionHistory, guidingIntent, startSolveSession]);

    const handleSendMessage = useCallback(async (rawInput: string) => {
        if (!rawInput.trim()) return;
        
        if (soBelowState.view === 'home') {
            handleHomeSendMessage(rawInput);
            return;
        }

        setError(null);

        if (activeResonanceRef.current) {
            activeResonanceRef.current.stop();
            activeResonanceRef.current = null;
        }
        
        let processedInput = rawInput.trim();
        const lowerInput = processedInput.toLowerCase();

        if (!lowerInput.startsWith('°')) {
            if (/\b(music|compose|sonify|make a song)\b/.test(lowerInput)) {
                const subject = lowerInput.replace(/\b(music|compose|sonify|make a song|based on|about|from)\b/g, '').trim();
                processedInput = `°compose ${subject}`;
            } else if (/\b(gematria|numerical value|number of|value for)\b/.test(lowerInput)) {
                const subject = lowerInput.replace(/\b(gematria|numerical value|number of|value for|of|the|is|what's|whats)\b/g, '').trim();
                processedInput = `°gematria ${subject}`;
            } else if (/\b(scry|vision|show me|picture of)\b/.test(lowerInput)) {
                const subject = lowerInput.replace(/\b(scry|vision|show me|a|of|picture of)\b/g, '').trim();
                processedInput = `°scry ${subject}`;
            } else if (/\b(chronovise|video|animate)\b/.test(lowerInput)) {
                const subject = lowerInput.replace(/\b(chronovise|video|animate|a|of)\b/g, '').trim();
                processedInput = `°chronovise ${subject}`;
            } else if (/\b(draw an archetype|draw archetype)\b/.test(lowerInput)) {
                processedInput = '°archetype_draw';
            } else if (/\b(resonate|vibration|frequency of)\b/.test(lowerInput)) {
                const subject = lowerInput.replace(/\b(resonate|vibration|frequency of|with|the)\b/g, '').trim();
                processedInput = `°resonate ${subject}`;
            }
        }
        
        const userMessage = addMessage({ type: 'user', text: rawInput });
        setIsLoading(true);

        const finalLowerInput = processedInput.toLowerCase();

        if (activeSolveSession.isActive && !finalLowerInput.startsWith('°solve')) {
            stopSolveSession();
        }

        try {
            if (finalLowerInput.includes('home')) {
                const commandPart = processedInput.replace(/home/i, '').trim();
                dispatchSoBelow({ type: 'GO_HOME', payload: { command: commandPart } });
                if (!commandPart) {
                    setIsLoading(false);
                    return;
                }
            }
            
            if (finalLowerInput.startsWith('°lock')) {
                addMessage({ type: 'system', text: 'Initiating session lock protocol.' });
                await generateVisualChallenge();
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.startsWith('°entrain')) {
                const profileName = processedInput.substring('°entrain'.length).trim();
                const profile = entrainmentProfiles.find(p => p.name.toLowerCase().includes(profileName.toLowerCase())) || entrainmentProfiles[0];
                addMessage({ type: 'system', text: `Initiating entrainment: ${profile.name}` });
                const session = AudioService.startBinauralBeat(profile);
                dispatchSoBelow({ type: 'START_ENTRAINMENT', payload: { profile, stop: session.stop } });
                setIsLoading(false);
                return;
            }
            
            if (finalLowerInput.startsWith('°meditate')) {
                addMessage({ type: 'system', text: `Transcribing meditation script from the aether...` });
                const result = await GeminiService.generate<MeditationResult>(
                    `Generate a short, calming guided meditation script based on the user's AWE data. The user's central question is "${aweData.centralQuestion}". Their harmonious relationship is with "${aweData.relationalNodeHarmonious}". A significant life event was "${aweData.inflectionPoints[0]?.description}". The script MUST contain exactly two image generation tokens like [GENERATE_IMAGE: a detailed, evocative prompt].`,
                    meditationScriptSchema,
                    sessionHistory
                );
                dispatchSoBelow({ type: 'START_MEDITATION', payload: { script: result.script, imagePrompts: result.imagePrompts } });
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.startsWith('°resonate')) {
                const concept = processedInput.substring('°resonate'.length).trim();
                const signature = MusicService.createCymaticSignature(concept);
                if (signature) {
                    addMessage({ type: 'system', text: `Observing inherent resonance of "${concept}" at ${signature.frequency.toFixed(2)} Hz...` });
                    activeResonanceRef.current = await AudioService.renderResonance(signature);
                } else {
                    addMessage({ type: 'system', text: `No cymatic signature found for "${concept}".` });
                }
                setIsLoading(false);
                return;
            }

            const lastAIMessage = sessionHistory.slice().reverse().find(m => m.type === 'ai') as AIMessage | undefined;
            const isBealeContext = lastAIMessage?.analysisType === 'beale_cipher_solution' || (lastAIMessage?.text && lastAIMessage.text.toLowerCase().includes('beale'));

            if ((finalLowerInput.startsWith('°narrow') || finalLowerInput.includes('narrow down the search') || finalLowerInput.includes('any other ways')) && isBealeContext) {
                const analysis = codex.getLiberPrimusData('bealeTreasureMapAnalysis') as BealeTreasureMapAnalysis;
                if (analysis) {
                    addMessage({
                        type: 'ai',
                        text: 'Refining search grid. Cross-referencing hydrological, symbolic, and topographical data vectors...',
                        analysisType: 'beale_treasure_map',
                        result: analysis
                    });
                    setIsLoading(false);
                    return;
                }
            }

            if (finalLowerInput.startsWith('°compose_instructional')) {
                const problem = processedInput.substring('°compose_instructional'.length).trim();
                if (!problem) {
                    addMessage({ type: 'system', text: 'Please provide a challenge or desire to compose for.' });
                    setIsLoading(false);
                    return;
                }
                addMessage({ type: 'system', text: `Analyzing "${problem}" for therapeutic composition...` });
                const analysis = await GeminiService.generate<{ coreEmotion: string; affirmation: string; solfeggioFrequency: number; }>(
                    `Analyze the user's stated problem: "${problem}". Extract a single positive core emotion that is its opposite, a short ALL CAPS affirmation for that emotion, and the most appropriate Solfeggio frequency from the list: [174, 285, 396, 417, 528, 639, 741, 852, 963].`,
                    instructionalCompositionAnalysisSchema,
                    sessionHistory
                );
                addMessage({ type: 'system', text: `Core Emotion: ${analysis.coreEmotion}. Affirmation: ${analysis.affirmation}. Frequency: ${analysis.solfeggioFrequency}Hz. Composing...` });
                
                const composition = MusicService.createInstructionalComposition(analysis.affirmation, analysis.solfeggioFrequency);
                const allInstruments = codex.getAllInstrumentProfiles();
                
                const session = await AudioService.renderAndPlayInstructionalComposition(composition, {
                    melody: allInstruments['Crystal Bells'],
                    harmony: allInstruments['Ethereal Pad'],
                    bass: allInstruments['Deep Bass']
                });
                
                dispatchSoBelow({ type: 'START_INSTRUCTIONAL', payload: { ...session, composition } });
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.startsWith('°compose')) {
                const text = processedInput.substring('°compose'.length).trim();
                if (!text) {
                    addMessage({ type: 'system', text: 'Please provide text to compose music from.' });
                    setIsLoading(false);
                    return;
                }
                addMessage({ type: 'system', text: `Sonifying text: "${text}"...` });
                const composition = MusicService.createCompositionFromText(text);

                let instrumentProfiles;
                try {
                    const productionNotesPrompt = `
                        You are an expert music producer with a deep understanding of esoteric sound design.
                        A musical composition has been algorithmically generated from text. Your task is to provide production notes.
                        Composition Data:
                        - Key: ${composition.metadata.key} ${composition.metadata.mode}
                        - BPM: ${composition.metadata.bpm}
                        - Source: ${composition.metadata.sourceReference}
                        - Track Names: ${composition.tracks.map(t => t.name).join(', ')}
                        
                        Available Instruments:
                        ${Object.values(codex.getAllInstrumentProfiles()).map(p => `- ${p.name}: ${p.description}`).join('\n')}

                        Based on the source text and musical parameters, choose the best instrument for each track (melody, harmony, bass) and provide brief notes on arrangement, mixing, and mastering to achieve a powerful, evocative result.
                    `;
                    const notes = await GeminiService.generate<AIProductionNotes>(productionNotesPrompt, aiProductionNotesSchema, sessionHistory);
                    
                    instrumentProfiles = {
                        melody: codex.getInstrumentProfile(notes.instruments.find(i => i.trackName === 'melody')?.instrumentName || 'Crystal Bells')!,
                        harmony: codex.getInstrumentProfile(notes.instruments.find(i => i.trackName === 'harmony')?.instrumentName || 'Ethereal Pad')!,
                        bass: codex.getInstrumentProfile(notes.instruments.find(i => i.trackName === 'bass')?.instrumentName || 'Deep Bass')!,
                    };
                    addMessage({ type: 'system', text: `AI Scribe production notes received: ${notes.overallMood}. Rendering audio...` });
                } catch (aiError) {
                    console.warn("AI Production Notes failed, using fallback instruments.", aiError);
                    addMessage({ type: 'system', text: `AI Scribe unavailable. Using default instrumentation protocol. Rendering audio...` });
                    const allInstruments = codex.getAllInstrumentProfiles();
                    instrumentProfiles = {
                        melody: allInstruments['Crystal Bells'],
                        harmony: allInstruments['Ethereal Pad'],
                        bass: allInstruments['Deep Bass']
                    };
                }
                
                const session = await AudioService.renderAndPlayInstructionalComposition(composition, instrumentProfiles);
                dispatchSoBelow({ type: 'START_INSTRUCTIONAL', payload: { ...session, composition } });
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.startsWith('°scry')) {
                const prompt = processedInput.substring('°scry'.length).trim() || 'A swirling nebula in a crystal ball, revealing a hidden symbol.';
                addMessage({ type: 'system', text: `Scrying the aether for: "${prompt}"...` });
                const imageResults = await GeminiService.generateImages(prompt, 1);
                if (imageResults && imageResults.length > 0) {
                    addMessage({
                        type: 'ai',
                        text: `The aether reveals a vision of "${prompt}".`,
                        analysisType: 'scried_image',
                        result: { prompt, imageData: imageResults[0] }
                    });
                } else {
                    throw new Error("Image transcription failed.");
                }
                setIsLoading(false);
                return;
            }
            if (finalLowerInput.startsWith('°chronovise')) {
                const prompt = processedInput.substring('°chronovise'.length).trim() || 'A tour of a futuristic city built with glowing, crystalline structures.';
                addMessage({ type: 'system', text: `Initiating temporal transcription for: "${prompt}"...` });
                const videoUrl = await GeminiService.generateVideo(prompt, (status: string) => {
                    addMessage({ type: 'system', text: status });
                });
                addMessage({
                    type: 'ai',
                    text: `A temporal sequence has been transcribed from the cosmic memory: "${prompt}".`,
                    analysisType: 'chronovised_video',
                    result: { prompt, videoUrl }
                });
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.startsWith('°gematria ')) {
                const word = processedInput.substring('°gematria '.length).trim();
                const letters = word.split('');
                const standard = hebrewNetwork.calculatePathGematria(letters);
                const gematriaResult: GematriaAnalysis = {
                    word: word, englishMeaning: 'Analysis Target', transliteration: '...',
                    standard: standard, ordinal: 0, reduced: 0, kolel: standard + 1,
                    atbashWord: '...', atbashValue: 0, milui: 0,
                };
                addMessage({
                    type: 'ai', text: `The standard Gematria value for "${word}" is ${standard}.`,
                    analysisType: 'gematria', result: gematriaResult
                });
                setIsLoading(false);
                return;
            }
            if (finalLowerInput.startsWith('°archetype_draw')) {
                const analysis = hebrewNetwork.getRandomArchetype();
                if (analysis) {
                    addMessage({
                        type: 'system',
                        text: `You have drawn the archetype of ${analysis.letter} (${analysis.name}): **${analysis.publicArchetype}**. Meditate on its meaning: ${analysis.semanticField.join(', ')}.`
                    });
                }
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.startsWith('°analyze palm')) {
                dispatchSoBelow({ type: 'START_PALMISTRY_CAPTURE' });
                setIsLoading(false);
                return;
            }
            if (finalLowerInput.startsWith('°analyze voice')) {
                dispatchSoBelow({ type: 'START_VOICE_CAPTURE' });
                setIsLoading(false);
                return;
            }

            if (finalLowerInput.includes('cicada 3301')) {
                const cicadaSolution = codex.getCicadaSolution();
                if (cicadaSolution) {
                    addMessage({ type: 'ai', text: cicadaSolution.overview, analysisType: 'cicada_3301_solution', result: cicadaSolution });
                    setIsLoading(false);
                    return;
                }
            }
            if (finalLowerInput.includes('beale cipher')) {
                const bealeSolution = codex.getLiberPrimusData('bealeCipherSolution') as BealeCipherSolution;
                if (bealeSolution) {
                    addMessage({ type: 'ai', text: `Accessing codex entry for: ${bealeSolution.title}`, analysisType: 'beale_cipher_solution', result: bealeSolution });
                    setIsLoading(false);
                    return;
                }
            }
            if (finalLowerInput.includes('voynich') && finalLowerInput.includes('translation')) {
                const translationResult = codex.getLiberPrimusData('voynichTranslation') as VoynichTranslationResult;
                if (translationResult) {
                    addMessage({
                        type: 'ai',
                        text: 'Accessing translated folio from the Voynich manuscript codex.',
                        analysisType: 'voynich_translation',
                        result: translationResult
                    });
                    setIsLoading(false);
                    return;
                }
            }
            // Default chat behavior if no command is matched
            const response = await GeminiService.generateTextOnly(rawInput, 'oracle', sessionHistory, guidingIntent);
            addMessage({ type: 'ai', text: response, analysisType: 'chat' });

            // AI-driven theme change
            const themeResponse = await GeminiService.generate<{ chakra: string }>(
                `Based on the user's last query ("${rawInput}") and your response ("${response.substring(0, 100)}..."), which of the 7 chakras (root, sacral, solarPlexus, heart, throat, thirdEye, crown) or 'neutral' best represents the energetic theme of this exchange?`,
                chakraThemeSchema,
                sessionHistory
            );
            if (themeResponse && themeResponse.chakra) {
                setChakraTheme(themeResponse.chakra.toLowerCase().replace(/\s/g, ''));
            }

        } catch (e: any) {
            console.error("Message handling failed:", e);
            const errorMessage = (e.message && e.message.startsWith("API_KEY_INVALID"))
                ? e.message
                : await GeminiService.analyzeCoherenceFault(rawInput, e.message, sessionHistory);
            setError(errorMessage);
            addMessage({ type: 'system', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory, guidingIntent, stopSolveSession, startSolveSession, soBelowState.view, handleHomeSendMessage, homeSessionHistory, dispatchSoBelow, setChakraTheme, generateVisualChallenge, aweData]);
    
    // FIX: Add missing return statement to export all state and handlers from the hook.
    return {
        sessionHistory,
        homeSessionHistory,
        isLoading,
        error,
        guidingIntent,
        setGuidingIntent,
        toasts,
        bookmarks,
        activeSolveSession,
        soBelowState,
        dispatchSoBelow,
        isModalOpen,
        setIsModalOpen,
        crossRefValue,
        setCrossRefValue,
        resonanceSeed,
        setResonanceSeed,
        isSynthesizing,
        setIsSynthesizing,
        synthesisResult,
        setSynthesisResult,
        isFirstVisit,
        setIsFirstVisit,
        showWelcomeOffer,
        setShowWelcomeOffer,
        isTourActive,
        setIsTourActive,
        tourStep,
        setTourStep,
        isListening,
        setIsListening,
        isCorporaInitialized,
        setIsCorporaInitialized,
        calibrationStatus,
        setCalibrationStatus,
        calibrationSubtext,
        setCalibrationSubtext,
        aweData,
        setAweData,
        customTools,
        setCustomTools,
        widgets,
        setWidgets,
        isAweComplete,
        palmistryDone,
        voiceDone,
        isPlannerUnlocked,
        ayinVoiceEnabled,
        solveIntensity,
        chakraTheme,
        setChakraTheme,
        addMessage,
        addToast,
        toggleBookmark,
        handleSaveTool,
        dismissToast,
        stopSolveSession,
        startSolveSession,
        handleUnlockSession,
        generateVisualChallenge,
        endTour,
        speakText,
        startVoiceInput,
        toggleFavoriteComposition,
        handleScreenshot,
        handleDownloadArchive,
        handleOpenIngestView,
        handleDismissWelcomeOffer,
        startTour,
        handleNumberInteract,
        handleSynthesizeConnections,
        handleRetry,
        handlePalmImageCapture,
        handleVoiceRecording,
        handlePlannerCommand,
        handleHomeSendMessage,
        handleSendMessage
    };
};