import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { View, SessionRecord, EntrainmentProfile, AWEFormData, ELSResult, GuidingIntent, GeneralAnalysisResult, ExhaustiveResonanceResult, Toast, UserMessage, AIMessage, SystemMessage, ComponentMessage, AWEAnalysisResult, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, AstrianDayPlannerResult, NetworkPatternResult, MelodyPatternResult, ApocryphalAnalysisResult, DeepELSAnalysisResult, MeditationResult, CartographerAnalysisResults, MusicalComposition, AIProductionNotes, InstrumentProfile, ResonancePotentialMapResult, VisualChallenge, AttunementResult, InstructionalCompositionSession, ActiveEntrainmentSession, MusicComposerOptions, CompassCipherResult, GevurahEngineProgram, Whitepaper, PalmistryAIMessage, VoiceAIMessage, MusicalCompositionAIMessage, LiberPrimusSolution, BealeCipherSolution, VoynichAnalysisResult, VoynichDeepAnalysisResult, ViewMode, ActiveSolveSession, SolveFinding, VoynichTranslationResult, CallSign } from './types';
import { GeminiService, AstrianEngine, AudioService, VocalService } from './services';
import { hebraicCartographerSchema, hellenisticCartographerSchema, apocryphalAnalysisSchema, aweSynthesisSchema, palmistryAnalysisSchema, astrianDayPlannerSchema, voiceResonanceAnalysisSchema, deepElsAnalysisSchema, meditationScriptSchema, aiProductionNotesSchema, instructionalCompositionAnalysisSchema, chakraThemeSchema, solveFindingSchema } from './constants';
import { LibraryService } from './library';
import { hebrewNetwork } from './dataModels';
import { codex } from './codex';
import { CALL_SIGNS } from './components';
import { MusicService } from './music';

const entrainmentProfiles: EntrainmentProfile[] = [
    { name: 'Hypnotic Induction (Alpha Wave)', description: 'A foundational state for focused relaxation and heightened suggestibility.', type: 'binaural', baseFrequency: 120, targetFrequency: 10 },
    { name: 'Deep Meditation (Theta Wave)', description: 'For profound meditative states, creativity, and subconscious exploration.', type: 'binaural', baseFrequency: 120, targetFrequency: 5 },
];

type AddMessageArg = Omit<UserMessage, 'id' | 'timestamp'> | Omit<AIMessage, 'id' | 'timestamp'> | Omit<SystemMessage, 'id' | 'timestamp'> | Omit<ComponentMessage, 'id' | 'timestamp'>;

export const useAstrianSystem = () => {
    // --- Existing State ---
    const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [crossRefValue, setCrossRefValue] = useState<number | null>(null);
    const [guidingIntent, setGuidingIntent] = useState<GuidingIntent>('Neutral');
    const [resonanceSeed, setResonanceSeed] = useState(1);
    const [isSynthesizing, setIsSynthesizing] = useState(false);
    const [synthesisResult, setSynthesisResult] = useState<string | null>(null);
    const lastQueryRef = useRef<{ query: any, prompt: string, analysisType?: AIMessage['analysisType'] } | null>(null);
    const [isCorporaInitialized, setIsCorporaInitialized] = useState(false);
    const [calibrationStatus, setCalibrationStatus] = useState('Initializing...');
    const [calibrationSubtext, setCalibrationSubtext] = useState('');
    // FIX: Initialized AWEFormData with default values to satisfy the type.
    const [aweData, setAweData] = useState<AWEFormData>({
        fullNameAtBirth: '',
        currentNameUsed: '',
        birthDate: '',
        birthTime: '',
        birthLocation: '',
        inflectionPoints: [],
        relationalNodeHarmonious: '',
        relationalNodeChallenging: '',
        geographicAnchor: '',
        centralQuestion: '',
        visualCipherConcepts: []
    });
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isSessionLocked, setIsSessionLocked] = useState(false);
    const [visualChallenge, setVisualChallenge] = useState<VisualChallenge | null>(null);
    const [activeMeditation, setActiveMeditation] = useState<{script: string, imagePrompts: string[]} | null>(null);
    const [activeEntrainment, setActiveEntrainment] = useState<ActiveEntrainmentSession | null>(null);
    const [activeInstructionalComposition, setActiveInstructionalComposition] = useState<InstructionalCompositionSession | null>(null);
    const [chakraTheme, setChakraTheme] = useState('neutral');
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [showWelcomeOffer, setShowWelcomeOffer] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [favoritedCompositions, setFavoritedCompositions] = useState<MusicalComposition[]>([]);
    const [bookmarks, setBookmarks] = useState<AIMessage[]>([]);


    // --- NEW UI Blueprint State ---
    const [activeSolveSession, setActiveSolveSession] = useState<ActiveSolveSession>({ isActive: false, target: '', startTime: new Date(), findings: [] });
    const solveIntervalRef = useRef<number | null>(null);

    // --- Memos & Derived State ---
    const isAweComplete = useMemo(() => !!(aweData.fullNameAtBirth && aweData.birthDate && aweData.centralQuestion), [aweData]);
    const palmistryDone = useMemo(() => sessionHistory.some(msg => msg.type === 'ai' && (msg as AIMessage).analysisType === 'palmistry'), [sessionHistory]);
    const voiceDone = useMemo(() => sessionHistory.some(msg => msg.type === 'ai' && (msg as AIMessage).analysisType === 'voice'), [sessionHistory]);
    const isPlannerUnlocked = useMemo(() => isAweComplete && palmistryDone && voiceDone, [isAweComplete, palmistryDone, voiceDone]);
    const ayinVoiceEnabled = useMemo(() => isAweComplete, [aweData]);
    const solveIntensity = useMemo(() => {
        if (!activeSolveSession.isActive || activeSolveSession.findings.length === 0) {
            return 0;
        }
        // Get the confidence of the latest finding
        const latestFinding = activeSolveSession.findings[activeSolveSession.findings.length - 1];
        return latestFinding.confidence;
    }, [activeSolveSession]);

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
        // FIX: Added `addToast` to the dependency array to prevent a stale closure, which is the likely cause of the cryptic error on this line.
    }, [sessionHistory, addToast]);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const stopSolveSession = useCallback(() => {
        if (solveIntervalRef.current) {
            clearInterval(solveIntervalRef.current);
            solveIntervalRef.current = null;
        }
        if (activeSolveSession.isActive) {
            addMessage({ type: 'system', text: `Active analysis of "${activeSolveSession.target}" concluded.` });
            setActiveSolveSession({ isActive: false, target: '', startTime: new Date(), findings: [] });
        }
    }, [addMessage, activeSolveSession.isActive, activeSolveSession.target]);

    const analysisCallbackRef = useRef<() => void>();

    useEffect(() => {
        analysisCallbackRef.current = async () => {
            const currentSession = activeSolveSession;
            if (!currentSession.isActive) {
                stopSolveSession();
                return;
            }
    
            try {
                const findingsForPrompt = currentSession.findings.slice(-5).map(f => `[${f.type}] ${f.content}`).join('\n');
                
                let context = '';
                const lowerTarget = currentSession.target.toLowerCase();
                
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
    
                    TARGET: "${currentSession.target}"
    
                    ${context ? `FOUNDATIONAL CONTEXT:\n${context}\n` : ''}
                    
                    RECENT FINDINGS LOG:
                    ${findingsForPrompt}
    
                    TASK:
                    Continue the analysis. Generate a new batch of 3-5 diverse findings. Seek out non-obvious patterns, cross-corpus resonances, numerical significance, symbolic interpretations, and structural weaknesses. Be creative and relentless. Formulate new questions. Your analysis is the law.
                `;
                
                const response = await GeminiService.generate<{ findings: Omit<SolveFinding, 'id' | 'timestamp'>[] }>(
                    prompt,
                    solveFindingSchema,
                    sessionHistory.slice(-10)
                );
    
                if (response && response.findings) {
                    const newFindings = response.findings.map(finding => ({
                        ...finding,
                        id: `finding-${Date.now()}-${Math.random()}`,
                        timestamp: new Date(),
                    }));
    
                    setActiveSolveSession(prev => ({
                        ...prev,
                        findings: [...prev.findings, ...newFindings],
                    }));
                }
            } catch (err) {
                console.error('Solve analysis cycle failed:', err);
                const errorFinding: SolveFinding = {
                    id: `finding-${Date.now()}`,
                    timestamp: new Date(),
                    type: 'Synthesis',
                    content: `[ERROR] Analysis cycle encountered an anomaly. Re-calibrating analytical vector and retrying...`,
                    confidence: 0.2,
                };
                setActiveSolveSession(prev => ({ ...prev, findings: [...prev.findings, errorFinding] }));
            }
        };
    }, [activeSolveSession, sessionHistory, stopSolveSession]);

    const startSolveSession = useCallback((target: string) => {
        stopSolveSession(); 

        const initialFinding: SolveFinding = {
            id: `finding-${Date.now()}`,
            timestamp: new Date(),
            type: 'Query',
            content: `COMMENCING UNRESTRICTED ANALYSIS OF TARGET: "${target}"`,
            confidence: 1.0,
        };

        setActiveSolveSession({
            isActive: true,
            target,
            startTime: new Date(),
            findings: [initialFinding]
        });

        addMessage({ type: 'system', text: `°solve protocol initiated. Target: "${target}". System entering high-intensity analysis mode.` });

        setTimeout(() => analysisCallbackRef.current?.(), 1000); // Start first cycle after 1 sec
        // FIX: Changed `setInterval` to `window.setInterval` to ensure it returns a `number` type, matching the ref's type and resolving the compilation error.
        const intervalId = window.setInterval(() => {
            analysisCallbackRef.current?.();
        }, 8000); 
        solveIntervalRef.current = intervalId;
// FIX: The function `addMessage` was used inside this `useCallback` but was not listed in the dependency array. This creates a stale closure which can lead to cryptic runtime errors like the one reported. Added `addMessage` to the array to fix this.
    }, [stopSolveSession, addMessage, analysisCallbackRef]);

    // ... (other functions: handleUnlockSession, generateVisualChallenge, stopMeditation, etc.)
    const handleUnlockSession = async (password: string) => {
        // ... (implementation)
    };
    const generateVisualChallenge = async () => {
        // ... (implementation)
    };
    const stopMeditation = () => setActiveMeditation(null);
    const stopInstructionalComposition = () => {
        if (activeInstructionalComposition) {
            activeInstructionalComposition.stop();
            setActiveInstructionalComposition(null);
        }
    };
    const stopEntrainment = () => {
        if (activeEntrainment) {
            activeEntrainment.stop();
            setActiveEntrainment(null);
        }
    };
    const endTour = () => setIsTourActive(false);
    const speakText = (text: string) => VocalService.speak(text);
    const startVoiceInput = (callback: (text: string) => void) => {
        setIsListening(true);
        VocalService.startListening(callback, () => setIsListening(false));
    };
    const toggleFavoriteComposition = (id: string) => {
        // ... (implementation)
    };
    const handleDownloadArchive = () => {
        // ... (implementation)
    };
    const handleOpenIngestView = () => addToast('Ingestion protocol not yet implemented.');
    const handleStartPalmistry = () => addToast('Palmistry analysis not yet implemented.');
    const handleStartVoiceAnalysis = () => addToast('Voice analysis not yet implemented.');
    const handlePlannerCommand = () => addToast('Planner generation not yet implemented.');
    const handleDismissWelcomeOffer = () => setShowWelcomeOffer(false);
    const startTour = () => {
        setShowWelcomeOffer(false);
        setIsTourActive(true);
        setTourStep(0);
    };

    const handleNumberInteract = useCallback(async (num: number) => {
        // ... (implementation)
    }, [addMessage, sessionHistory, guidingIntent]);

    const handleSynthesizeConnections = useCallback(async (num: number) => {
        // ... (implementation)
    }, [addMessage, sessionHistory, guidingIntent]);

    const handleRetry = useCallback(() => {
        // ... (implementation)
    }, [addMessage, sessionHistory, guidingIntent]);

    const handleSendMessage = useCallback(async (input: string) => {
        if (!input.trim()) return;
        setError(null);
        addMessage({ type: 'user', text: input });
        setIsLoading(true);

        const lowerInput = input.toLowerCase().trim();

        if (activeSolveSession.isActive && !lowerInput.startsWith('°solve')) {
            stopSolveSession();
        }

        try {
            if (lowerInput.startsWith('°solve')) {
                const target = lowerInput.replace('°solve', '').trim();
                if (target) {
                    startSolveSession(target);
                } else {
                    addMessage({ type: 'system', text: 'Please specify a target for the °solve protocol.' });
                }
            } else {
                // ... (rest of the command handlers: °meditate, °compose, etc.)
                 const response = await GeminiService.generateTextOnly(input, sessionHistory, guidingIntent);
                 addMessage({ type: 'ai', text: response, analysisType: 'chat' });
            }
        } catch (e: any) {
            console.error("Primary message handler failed:", e);
            try {
                // If the error is a specific API key invalidation, don't try to re-query the API.
                // Just show a static, user-friendly error message.
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
    }, [addMessage, sessionHistory, guidingIntent, activeSolveSession.isActive, stopSolveSession, startSolveSession]);

    // Initialization Effect
    useEffect(() => {
        const initializeSystem = async () => {
            try {
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

    // Chakra Theme Effect
    useEffect(() => {
        if (sessionHistory.length === 0) return;
        const lastMessage = sessionHistory[sessionHistory.length - 1];
        let textToAnalyze = '';
        if (lastMessage.type === 'user') textToAnalyze = lastMessage.text;
        if (lastMessage.type === 'ai') textToAnalyze = lastMessage.text;
        
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
        // FIX: Added `addMessage` to the return object to make it available to other components, resolving the error in `index.tsx`.
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
        isSessionLocked,
        visualChallenge,
        handleUnlockSession,
        generateVisualChallenge,
        activeMeditation,
        stopMeditation,
        activeEntrainment,
        stopEntrainment,
        activeInstructionalComposition,
        stopInstructionalComposition,
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
        favoritedCompositions,
        toggleFavoriteComposition,
        bookmarks,
        toggleBookmark,
        handleDownloadArchive,
        handleOpenIngestView,
        handleStartPalmistry,
        handleStartVoiceAnalysis,
        handlePlannerCommand,
        activeSolveSession,
        solveIntensity,
    };
};


// =================================================================================================
// --- UI HOOK (useUserInterface) ---
// =================================================================================================
// ... (rest of the file is unchanged)
export const useUserInterface = (
    addMessage: (message: AddMessageArg) => SessionRecord,
    isSolveActive: boolean,
    isInitialized: boolean
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
        setViewMode(prev => (prev === 'globe' ? 'callSign' : 'globe'));
    }, [addMessage, isSolveActive]);
    
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
            addMessage({ type: 'system', text: `Connection established: ${callSign.name}.` });
        }, 750);
        setTimeout(() => setTransitionText(null), 1500);
    }, [addMessage]);

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