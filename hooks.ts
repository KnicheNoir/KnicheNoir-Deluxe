import { useState, useCallback, useRef, useEffect, useMemo, useReducer } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { SessionRecord, EntrainmentProfile, AWEFormData, GuidingIntent, Toast, UserMessage, AIMessage, SystemMessage, ComponentMessage, VisualChallenge, InstructionalCompositionSession, ActiveEntrainmentSession, BealeCipherSolution, VoynichAnalysisResult, ViewMode, ActiveSolveSession, SolveFinding, VoynichTranslationResult, CallSign, CustomTool, DeepELSAnalysisResult, WidgetState, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, GematriaAnalysis } from './types';
import { GeminiService, AstrianEngine, AudioService, VocalService } from './services';
import { hebraicCartographerSchema, hellenisticCartographerSchema, apocryphalAnalysisSchema, aweSynthesisSchema, palmistryAnalysisSchema, astrianDayPlannerSchema, voiceResonanceAnalysisSchema, deepElsAnalysisSchema, meditationScriptSchema, aiProductionNotesSchema, instructionalCompositionAnalysisSchema, chakraThemeSchema, solveFindingSchema } from './constants';
import { LibraryService } from './library';
import { hebrewNetwork } from './dataModels';
import { codex } from './codex';
import { CALL_SIGNS } from './components';
import { toPng } from 'html-to-image';

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


export const useAstrianSystem = () => {
    // --- Centralized State ---
    const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
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
    const [aweData, setAweData] = useState<AWEFormData>({ fullNameAtBirth: '', currentNameUsed: '', birthDate: '', birthTime: '', birthLocation: '', inflectionPoints: [], relationalNodeHarmonious: '', relationalNodeChallenging: '', geographicAnchor: '', centralQuestion: '', visualCipherConcepts: [] });
    const [customTools, setCustomTools] = useState<CustomTool[]>([]);
    const [widgets, setWidgets] = useState<WidgetState[]>([]);

    // --- Refs ---
    const lastQueryRef = useRef<{ query: any, prompt: string, analysisType?: AIMessage['analysisType'] } | null>(null);
    const solveIntervalRef = useRef<number | null>(null);
    const analysisCallbackRef = useRef<(() => Promise<void>) | null>(null);

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
    const addMessage = useCallback((message: AddMessageArg) => {
        const newMessage = { ...message, id: Date.now().toString(), timestamp: new Date() } as SessionRecord;
        setSessionHistory(prev => [...prev, newMessage]);
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
                // FIX: Removed the spread operator '...' from errorFinding.
                // It's a single object, not an array, so it should be appended directly.
                setActiveSolveSession(prev => ({ ...prev, findings: [...prev.findings, errorFinding] }));
            }
        };
    }, [activeSolveSession, sessionHistory, stopSolveSession]);

    const startSolveSession = useCallback((target: string) => {
        stopSolveSession(); 

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
    }, [stopSolveSession, addMessage]);

    // --- Other Handlers ---
    const handleUnlockSession = async (password: string) => { /* ... implementation ... */ };
    const generateVisualChallenge = async () => { /* ... implementation ... */ };
    const endTour = () => setIsTourActive(false);
    const speakText = (text: string) => VocalService.speak(text);
    const startVoiceInput = (callback: (text: string) => void) => {
        setIsListening(true);
        VocalService.startListening(callback, () => setIsListening(false));
    };
    const toggleFavoriteComposition = (id: string) => { /* ... implementation ... */ };
    
    const handleScreenshot = useCallback(async () => {
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
    }, [addToast]);
    
    const handleDownloadArchive = useCallback(() => {
        try {
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
        } catch (err) {
            console.error('Archive download failed', err);
            addToast('Archive download failed.', 'error');
        }
    }, [sessionHistory, bookmarks, customTools, aweData, addToast]);

    const handleOpenIngestView = () => addToast('Ingestion protocol not yet implemented.');
    const handleDismissWelcomeOffer = () => setShowWelcomeOffer(false);
    const startTour = () => {
        setShowWelcomeOffer(false);
        setIsTourActive(true);
        setTourStep(0);
    };

    const handleNumberInteract = useCallback(async (num: number) => { /* ... implementation ... */ }, [addMessage, sessionHistory, guidingIntent]);
    const handleSynthesizeConnections = useCallback(async (num: number) => { /* ... implementation ... */ }, [addMessage, sessionHistory, guidingIntent]);
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


    const handleSendMessage = useCallback(async (input: string) => {
        if (!input.trim()) return;
        setError(null);
        const userMessage = addMessage({ type: 'user', text: input });
        setIsLoading(true);

        const lowerInput = input.toLowerCase().trim();

        if (activeSolveSession.isActive && !lowerInput.startsWith('°solve')) {
            stopSolveSession();
        }

        try {
             // Handle "Home" command for view switching and command passthrough
            if (lowerInput.includes('home')) {
                const commandPart = input.replace(/home/i, '').trim();
                dispatchSoBelow({ type: 'GO_HOME', payload: { command: commandPart } });
                // Don't return here if there's more to the command
                if (!commandPart) {
                    setIsLoading(false);
                    return;
                }
            }

            // --- Sandbox Tool Commands ---
            if (lowerInput.startsWith('°gematria ')) {
                const word = input.substring('°gematria '.length).trim();
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
             if (lowerInput.startsWith('°scry')) {
                const prompt = input.substring('°scry'.length).trim() || 'A swirling nebula in a crystal ball, revealing a hidden symbol.';
                addMessage({ type: 'system', text: `Scrying the aether for: "${prompt}"...` });
                try {
                    // We don't display the image, just get a description of it.
                    const descriptionResponse = await GeminiService.generateTextOnly(
                        `I have just had a vision based on the prompt: "${prompt}". Describe the vision in a mystical and evocative way, as if interpreting an omen.`,
                        sessionHistory
                    );
                    addMessage({
                        type: 'ai', text: `The aether reveals a vision:\n\n${descriptionResponse}`,
                        analysisType: 'chat'
                    });
                } catch (imgErr) {
                    addMessage({ type: 'system', text: `The scrying attempt failed. The aether is cloudy.` });
                } finally {
                    setIsLoading(false);
                    return;
                }
            }
            if (lowerInput.startsWith('°archetype_draw')) {
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

            // --- Sensory Commands ---
            if (lowerInput.startsWith('°analyze palm')) {
                dispatchSoBelow({ type: 'START_PALMISTRY_CAPTURE' });
                setIsLoading(false);
                return;
            }
            if (lowerInput.startsWith('°analyze voice')) {
                dispatchSoBelow({ type: 'START_VOICE_CAPTURE' });
                setIsLoading(false);
                return;
            }

            // --- Codex Lookups ---
            if (lowerInput.includes('cicada 3301')) {
                const cicadaSolution = codex.getCicadaSolution();
                if (cicadaSolution) {
                    addMessage({ type: 'ai', text: cicadaSolution.overview, analysisType: 'cicada_3301_solution', result: cicadaSolution });
                    setIsLoading(false);
                    return;
                }
            }
            if (lowerInput.includes('beale cipher')) {
                const bealeSolution = codex.getLiberPrimusData('bealeCipherSolution') as BealeCipherSolution;
                if (bealeSolution) {
                    addMessage({ type: 'ai', text: `Accessing codex entry for: ${bealeSolution.title}`, analysisType: 'beale_cipher_solution', result: bealeSolution });
                    setIsLoading(false);
                    return;
                }
            }
            if (lowerInput.includes('voynich') && lowerInput.includes('translation')) {
                const translationResult = codex.getLiberPrimusData('voynichTranslation') as VoynichTranslationResult;
                if (translationResult) {
                    addMessage({
                        type: 'ai',
                        text: `Accessing canonized translation of the Voynich Manuscript.`,
                        analysisType: 'voynich_translation',
                        result: translationResult
                    });
                    setIsLoading(false);
                    return;
                }
            }
            if (lowerInput.includes('voynich') && lowerInput.includes('els') && lowerInput.includes('78r')) {
                const elsResult = codex.getLiberPrimusData('voynichELSAnalysis78r') as DeepELSAnalysisResult;
                if (elsResult) {
                    addMessage({
                        type: 'ai',
                        text: `Executing deep ELS analysis on Voynich Folio 78r. Found significant sequences related to core structural keys.`,
                        analysisType: 'deep_els',
                        result: elsResult
                    });
                    setIsLoading(false);
                    return;
                }
            }
            
            // --- Core Protocols ---
            if (lowerInput.startsWith('°solve')) {
                const target = lowerInput.replace('°solve', '').trim();
                if (target) { startSolveSession(target); } 
                else { addMessage({ type: 'system', text: 'Please specify a target for the °solve protocol.' }); }
            } else {
                 const response = await GeminiService.generateTextOnly(input, sessionHistory, guidingIntent);
                 addMessage({ type: 'ai', text: response, analysisType: 'chat' });
            }
        } catch (e: any) {
            console.error("Primary message handler failed:", e);
            try {
                if (e.message && e.message.startsWith('API_KEY_INVALID')) {
                    setError("System Fault: A critical permission error occurred. The API key is invalid or the required API is not enabled. Please check the environment configuration.");
                } else {
                    const faultAnalysis = await GeminiService.analyzeCoherenceFault(input, e.message, sessionHistory);
                    setError(faultAnalysis);
                }
            } catch (faultErr) {
                console.error("Coherence fault analysis failed:", faultErr);
                setError("System Coherence Fault: A cascading error occurred. The system could not analyze the initial failure. Reverting to a stable state.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory, guidingIntent, activeSolveSession, stopSolveSession, startSolveSession]);

    // Initialization & Persistence Effects
    useEffect(() => {
        const initializeSystem = async () => {
            try {
                // Load user's custom tools & widgets from localStorage
                const savedTools = localStorage.getItem('astrian_custom_tools');
                if (savedTools) setCustomTools(JSON.parse(savedTools));
                
                const savedWidgets = localStorage.getItem('astrian_widgets');
                if (savedWidgets) setWidgets(JSON.parse(savedWidgets));

                setCalibrationStatus('Calibrating Willow Network...');
                setCalibrationSubtext('Observing inherent structural resonance...');
                await hebrewNetwork.initialize();

                setCalibrationStatus('Calibrating Universal Codex...');
                setCalibrationSubtext('Hydrating compressed knowledge indices...');
                await codex.initialize();

                setCalibrationStatus('Calibration Complete.');
                setCalibrationSubtext('The work is done. Ready for inquiry.');
                setIsCorporaInitialized(true);

                if (!localStorage.getItem('astrian_key_first_visit')) {
                    setIsFirstVisit(true);
                    setShowWelcomeOffer(true);
                    localStorage.setItem('astrian_key_first_visit', 'false');
                }
            } catch (error) {
                console.error("Initialization failed:", error);
                setCalibrationStatus('System Fault');
                setCalibrationSubtext('A critical error occurred during initialization.');
            }
        };
        initializeSystem();
    }, []);

    // Effect to save custom tools to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('astrian_custom_tools', JSON.stringify(customTools));
        } catch (e) {
            console.error("Failed to save custom tools:", e);
        }
    }, [customTools]);

    // Effect to save widgets to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('astrian_widgets', JSON.stringify(widgets));
        } catch (e) {
            console.error("Failed to save widgets:", e);
        }
    }, [widgets]);


    // Chakra Theme Effect
    useEffect(() => {
        if (sessionHistory.length === 0) return;
        const lastMessage = sessionHistory[sessionHistory.length - 1];
        let textToAnalyze = '';
        // FIX: Added explicit casting to UserMessage/AIMessage to access .text property.
        if (lastMessage.type === 'user') textToAnalyze = (lastMessage as UserMessage).text;
        // FIX: Added explicit casting to UserMessage/AIMessage to access .text property.
        if (lastMessage.type === 'ai') textToAnalyze = (lastMessage as AIMessage).text;
        
        if (textToAnalyze) {
            const getTheme = async () => {
                try {
                    const result = await GeminiService.generate<{ chakra: string }>(
                        `Analyze the emotional content of this text: "${textToAnalyze}". Respond with the corresponding chakra: root, sacral, solarPlexus, heart, throat, thirdEye, crown, or neutral.`,
                        chakraThemeSchema
                    );
                    setChakraTheme(result.chakra || 'neutral');
                } catch (e) {
                    console.error("Chakra theme analysis failed:", e);
                    setChakraTheme('neutral');
                }
            };
            getTheme();
        }
    }, [sessionHistory]);

    return {
        addMessage,
        sessionHistory,
        isLoading,
        error,
        handleSendMessage,
        handleRetry,
        isModalOpen,
        setIsModalOpen,
        crossRefValue,
        handleNumberInteract,
        handleSynthesizeConnections,
        isSynthesizing,
        synthesisResult,
        guidingIntent,
        setGuidingIntent,
        resonanceSeed,
        isCorporaInitialized,
        calibrationStatus,
        calibrationSubtext,
        aweData,
        setAweData,
        isAweComplete,
        isPlannerUnlocked,
        toasts,
        addToast,
        dismissToast,
        // Replace individual state exports with the reducer's state and dispatcher
        soBelowState,
        dispatchSoBelow,
        // Keep functions that dispatch actions
        generateVisualChallenge,
        handleUnlockSession,
        chakraTheme,
        isFirstVisit,
        showWelcomeOffer,
        handleDismissWelcomeOffer,
        isTourActive,
        tourStep,
        setTourStep,
        startTour,
        endTour,
        ayinVoiceEnabled,
        speakText,
        isListening,
        startVoiceInput,
        toggleFavoriteComposition: () => {}, // Placeholder
        bookmarks,
        toggleBookmark,
        handleDownloadArchive,
        handleScreenshot,
        handleOpenIngestView,
        // Replace placeholders with real handlers
        handlePalmImageCapture,
        handleVoiceRecording,
        handlePlannerCommand,
        activeSolveSession,
        solveIntensity,
        customTools,
        handleSaveTool,
        widgets,
        setWidgets,
    };
};


// =================================================================================================
// --- UI HOOK (useUserInterface) ---
// =================================================================================================
export const useUserInterface = (
    addMessage: (message: AddMessageArg) => SessionRecord,
    isSolveActive: boolean,
    isInitialized: boolean,
    dispatchSoBelow: React.Dispatch<SoBelowAction>
) => {
    const [viewMode, setViewMode] = useState<ViewMode>('boot');
    const [isCallSignMenuOpen, setIsCallSignMenuOpen] = useState(false);
    const [transitionText, setTransitionText] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);


    const handleCompassDoubleClick = useCallback(() => {
        if (isSolveActive) {
            addMessage({ type: 'system', text: 'Navigation is locked during active analysis.' });
            return;
        }
        
        const homeCallSign = CALL_SIGNS.find(cs => cs.name === 'Home');

        if (viewMode === 'callSign') {
            // If in a call sign, return to the globe
             setViewMode('globe');
             dispatchSoBelow({ type: 'STOP_SESSION' });
        } else {
            // If on the globe, go to the default 'Home' call sign
            if(homeCallSign) {
                handleCallSignSelect(homeCallSign);
            }
        }
    }, [addMessage, isSolveActive, viewMode, dispatchSoBelow]);
    
    const navigateToHome = useCallback(() => {
        if(isInitialized) {
            setViewMode('globe');
        }
    }, [isInitialized]);

    const handleCallSignSelect = useCallback((callSign: CallSign) => {
        setIsCallSignMenuOpen(false);
        setTransitionText(`Traversing to: ${callSign.name}`);
        setTimeout(() => {
            setViewMode('callSign');
            dispatchSoBelow({ type: 'SET_ACTIVE_CALL_SIGN', payload: callSign });
            addMessage({ type: 'system', text: `Connection established: ${callSign.name}.` });
        }, 750);
        setTimeout(() => setTransitionText(null), 1500);
    }, [addMessage, dispatchSoBelow]);

    const handleBookmarkSelect = useCallback((bookmark: string) => {
        addMessage({type: 'user', text: bookmark});
    }, [addMessage]);

    return {
        viewMode,
        setViewMode,
        isCallSignMenuOpen,
        setIsCallSignMenuOpen,
        handleCallSignSelect,
        transitionText,
        activeTool,
        setActiveTool,
        handleCompassDoubleClick,
        handleBookmarkSelect,
        navigateToHome,
        isBookmarksOpen, setIsBookmarksOpen,
        isArchiveOpen, setIsArchiveOpen,
        isManualOpen, setIsManualOpen,
        isWhiteboardOpen, setIsWhiteboardOpen,
    };
};