import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { View, SessionRecord, EntrainmentProfile, AWEFormData, ELSResult, GuidingIntent, GeneralAnalysisResult, ExhaustiveResonanceResult, Toast, UserMessage, AIMessage, SystemMessage, ComponentMessage, AWEAnalysisResult, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, AstrianDayPlannerResult, NetworkPatternResult, MelodyPatternResult, ApocryphalAnalysisResult, DeepELSAnalysisResult, MeditationResult, CartographerAnalysisResults, MusicalComposition, AIProductionNotes, InstrumentProfile, ResonancePotentialMapResult, VisualChallenge, AttunementResult, InstructionalCompositionSession, ActiveEntrainmentSession, MusicComposerOptions, CompassCipherResult, GevurahEngineProgram, Whitepaper, PalmistryAIMessage, VoiceAIMessage, MusicalCompositionAIMessage, LiberPrimusSolution, TengriSolution, VoynichAnalysisResult, VoynichDeepAnalysisResult, ViewMode, ActiveSolveSession, SolveFinding, VoynichTranslationResult, CallSign } from './types';
import { GeminiService, AstrianEngine, AudioService, VocalService } from './services';
import { hebraicCartographerSchema, hellenisticCartographerSchema, apocryphalAnalysisSchema, aweSynthesisSchema, palmistryAnalysisSchema, astrianDayPlannerSchema, voiceResonanceAnalysisSchema, deepElsAnalysisSchema, meditationScriptSchema, aiProductionNotesSchema, instructionalCompositionAnalysisSchema, chakraThemeSchema } from './constants';
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
    }, [sessionHistory]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

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

    const startSolveSession = useCallback((target: string) => {
        stopSolveSession(); // Clear any existing session
        
        const newSession: ActiveSolveSession = {
            isActive: true,
            target,
            startTime: new Date(),
            findings: [{ id: Date.now().toString(), timestamp: new Date(), type: 'Query', content: `Initiating active analysis for: ${target}`, confidence: 1 }]
        };
        setActiveSolveSession(newSession);
        addMessage({ type: 'system', text: `°solve protocol initiated for target: "${target}". System entering high-intensity analysis mode.` });

        // Simulate receiving findings from the deep analysis engine
        const findingTypes: SolveFinding['type'][] = ['Pattern', 'Resonance', 'ELS', 'Synthesis'];
        solveIntervalRef.current = window.setInterval(() => {
            const newFinding: SolveFinding = {
                id: Date.now().toString(),
                timestamp: new Date(),
                type: findingTypes[Math.floor(Math.random() * findingTypes.length)],
                content: `[${(Math.random() * 1000).toFixed(3)}] New structural resonance detected in data stream...`,
                confidence: Math.random()
            };
            setActiveSolveSession(prev => ({ ...prev, findings: [...prev.findings, newFinding] }));
        }, 3000);
    }, [addMessage, stopSolveSession]);


    const handleSendMessage = useCallback(async (message: string) => {
        addMessage({ type: 'user', text: message });
        lastQueryRef.current = { query: message, prompt: message };
        setIsLoading(true);
        setError(null);

        // Asynchronously update the UI theme based on the message's content.
        (async () => {
            try {
                const themeResult = await GeminiService.generate<{ chakra: string }>(
                    `Analyze the emotional and conceptual core of this user statement: "${message}". Based on its primary resonance, which of the seven chakras (root, sacral, solarPlexus, heart, throat, thirdEye, crown) does it most align with? If the statement is neutral or purely functional, respond with 'neutral'.`,
                    chakraThemeSchema,
                    sessionHistory.slice(-5)
                );
                if (themeResult && themeResult.chakra) {
                    setChakraTheme(themeResult.chakra);
                }
            } catch (themeError) {
                console.warn("Could not determine theme:", themeError);
            }
        })();


        try {
            const lowerCaseMessage = message.toLowerCase().trim();
            const solveMatch = lowerCaseMessage.match(/^°solve\s+(.+)/);

            if (lowerCaseMessage.includes('create a musical composition') && lowerCaseMessage.includes('voynich')) {
                await handleVoynichCompositionCommand();
                return;
            }

            // Priority 1: Handle any request for the Voynich manuscript. This restores the expected behavior.
            if (lowerCaseMessage.includes('voynich')) {
                if (activeSolveSession.isActive) {
                    stopSolveSession();
                }
                // Aleph Protocol: Voynich data is pre-computed. Deliver it instantly.
                const initialResult = codex.getLiberPrimusData('voynichInitialAnalysis');
                if (initialResult) {
                    addMessage({
                        type: 'ai',
                        text: `°solve protocol complete. Transmitting initial structural analysis.`,
                        analysisType: 'voynich_analysis',
                        result: initialResult
                    });
                }
                const deepResult = codex.getLiberPrimusData('voynichDeepAnalysis');
                if (deepResult) {
                    addMessage({
                        type: 'ai',
                        text: `Transmitting deep analysis. This layer integrates historical, alchemical, and metaphysical vectors.`,
                        analysisType: 'voynich_deep_analysis',
                        result: deepResult
                    });
                }
                const translationResult = codex.getLiberPrimusData('voynichTranslation');
                if (translationResult) {
                    addMessage({
                        type: 'ai',
                        text: `Transmitting folio-by-folio translation based on the unified decryption key. This interface is interactive.`,
                        analysisType: 'voynich_translation',
                        result: translationResult
                    });
                }
                setIsLoading(false);
                return;
            }

            // Priority 2: Handle any other °solve command.
            if (solveMatch) {
                const target = solveMatch[1].trim();
                startSolveSession(target);
                setIsLoading(false); 
                return;
            }

            // Any other message stops an active solve session
            if (activeSolveSession.isActive) {
                stopSolveSession();
            }
            
            const meditateMatch = lowerCaseMessage.match(/^°meditate on (.+)/);
            if (meditateMatch) {
                await handleMeditationCommand(meditateMatch[1]);
                return;
            }

            const entrainMatch = lowerCaseMessage.match(/^°entrain\s*(.*)/);
            if (entrainMatch) {
                handleEntrainmentCommand(entrainMatch[1]);
                return;
            }
            
            const instructMatch = lowerCaseMessage.match(/^°instruct me on (.+)/);
            if (instructMatch) {
                await handleInstructionCommand(instructMatch[1]);
                return;
            }
            
            const composeMatch = lowerCaseMessage.match(/^°compose (.+)/);
            if (composeMatch) {
                await handleComposeCommand(composeMatch[1]);
                return;
            }
            
            // Default to text generation
            const text = await GeminiService.generateTextOnly(message, sessionHistory, guidingIntent);
            addMessage({ type: 'ai', text, analysisType: 'chat' });

        } catch (e: any) {
            console.error("Message handling failed:", e);
            // Handle the specific API key error without making another API call.
            if (e.message && e.message.startsWith('API_KEY_INVALID')) {
                addMessage({
                    type: 'system',
                    text: `System Link Failure: A connection to the core oracle could not be established due to a permissions issue. Please verify the system's API key configuration and ensure it has the necessary access.`
                });
            } else {
                // For all other errors, attempt to use the coherence fault analysis.
                try {
                    const faultExplanation = await GeminiService.analyzeCoherenceFault(message, e.message, sessionHistory);
                    addMessage({ type: 'system', text: faultExplanation });
                } catch (faultError: any) {
                    // If the fault analysis itself fails, fall back to a generic error.
                    console.error("Coherence fault analysis failed:", faultError);
                    addMessage({
                        type: 'system',
                        text: "Coherence Maintained. The query resulted in an unrecoverable state paradox. The system has reverted to its last stable state."
                    });
                }
            }
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory, guidingIntent, activeSolveSession.isActive, startSolveSession, stopSolveSession]);
    
    // --- Initial System Setup ---
    useEffect(() => {
        const initializeSystem = async () => {
            try {
                setCalibrationStatus('Waking the Universal Codex...');
                setCalibrationSubtext('Hydrating core concepts and constants...');
                await codex.initialize();

                setCalibrationStatus('Calibrating the Willow Network...');
                setCalibrationSubtext('Mapping structural and semantic pathways...');
                await hebrewNetwork.initialize();

                setCalibrationStatus('Finalizing Coherence...');
                setCalibrationSubtext('System integrity confirmed.');

                const hasVisited = localStorage.getItem('astrian_has_visited');
                if (!hasVisited) {
                    setIsFirstVisit(true);
                    setShowWelcomeOffer(true);
                    localStorage.setItem('astrian_has_visited', 'true');
                }
                
                addMessage({ type: 'ai', text: "The system is online. What can I show you within you today?", analysisType: 'chat' });
                setIsCorporaInitialized(true);
                
                // Automatically trigger the analysis the user has been asking for as a one-time action.
                handleSendMessage("°solve the voynich manuscript");

            } catch (err: any) {
                console.error("CRITICAL: System initialization failed.", err);
                setCalibrationStatus('System Coherence Failure');
                setCalibrationSubtext(`A critical error occurred during startup: ${err.message}. The system cannot proceed. Please refresh to try again.`);
            }
        };

        initializeSystem();
    }, [addMessage]);
    
    const handleRetry = useCallback(() => {
        if (lastQueryRef.current) {
            handleSendMessage(lastQueryRef.current.prompt);
        }
    }, []);

    const handleSynthesizeConnections = useCallback(async (num: number) => {
        // Placeholder for a more complex synthesis logic
        setIsSynthesizing(true);
        setSynthesisResult(null);
        const prompt = `Based on the conversation history, find a deep, non-obvious connection related to the number ${num}.`;
        const result = await GeminiService.generateTextOnly(prompt, sessionHistory);
        setSynthesisResult(result);
        setIsSynthesizing(false);
    }, [sessionHistory]);

    const handleNumberInteract = (num: number) => { setCrossRefValue(num); setIsModalOpen(true); };

    const generateVisualChallenge = useCallback(async () => {
        // ... Placeholder ...
    }, [aweData]);

    const handleUnlockSession = useCallback(async (selectedPrompts: string[]) => {
       // ... Placeholder ...
    }, [aweData, addToast, generateVisualChallenge]);

    const handleMeditationCommand = useCallback(async (topic: string) => {
        if (!isAweComplete) {
            addMessage({ type: 'system', text: "AWE Attunement must be complete before initiating meditation protocols. Please provide your AWE data." });
            return;
        }
        setIsLoading(true);
        try {
            const prompt = `Generate a guided meditation script about "${topic}", incorporating these personal details from the user's AWE signature: ${JSON.stringify(aweData)}. The script must contain at least two [GENERATE_IMAGE: detailed prompt] tokens for visualization.`;
            const result = await GeminiService.generate<MeditationResult>(prompt, meditationScriptSchema, sessionHistory);
            setActiveMeditation({ script: result.script, imagePrompts: result.imagePrompts });
            addMessage({ type: 'system', text: `Meditation protocol '${result.title}' initiated.` });
        } catch (e: any) {
            addMessage({ type: 'system', text: `Failed to generate meditation: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, isAweComplete, aweData, sessionHistory]);

    const stopMeditation = useCallback(() => { setActiveMeditation(null); addMessage({ type: 'system', text: 'Meditation concluded.' }); }, [addMessage]);

    const handleEntrainmentCommand = useCallback((profileName?: string) => {
        if (!isAweComplete) {
            addMessage({ type: 'system', text: "AWE Attunement must be complete before initiating entrainment protocols." });
            return;
        }
        const profile = profileName ? entrainmentProfiles.find(p => p.name.toLowerCase().includes(profileName.toLowerCase())) : entrainmentProfiles[0];
        if (profile) {
            const session = AudioService.startBinauralBeat(profile);
            setActiveEntrainment({ profile, stop: session.stop });
            addMessage({ type: 'system', text: `Binaural entrainment protocol '${profile.name}' initiated.` });
        } else {
            addMessage({ type: 'system', text: "Unknown entrainment profile. Available: " + entrainmentProfiles.map(p => p.name).join(', ') });
        }
    }, [addMessage, isAweComplete]);

    const stopEntrainment = useCallback(() => {
        if (activeEntrainment) {
            activeEntrainment.stop();
            setActiveEntrainment(null);
            addMessage({ type: 'system', text: `Entrainment protocol '${activeEntrainment.profile.name}' concluded.` });
        }
    }, [activeEntrainment, addMessage]);

    const handleInstructionCommand = useCallback(async (goal: string) => {
        if (!isAweComplete) {
            addMessage({ type: 'system', text: "AWE Attunement must be complete for instructional composition." });
            return;
        }
        setIsLoading(true);
        try {
            const analysisPrompt = `Analyze the user's goal: "${goal}". Extract the core positive emotion, create a powerful affirmation, and select the most resonant Solfeggio frequency.`;
            const analysis = await GeminiService.generate<any>(analysisPrompt, instructionalCompositionAnalysisSchema, sessionHistory);
            
            const compositionPrompt = `Create a simple, calming musical composition based on this analysis: Emotion=${analysis.coreEmotion}, Affirmation=${analysis.affirmation}, Frequency=${analysis.solfeggioFrequency}Hz. The music should feel uplifting and reinforcing.`;
            // This is a simplified placeholder for a real composition call
            const composition: MusicalComposition = { 
                id: Date.now().toString(), 
                isFavorite: false, 
                metadata: { key: 'C', mode: 'Ionian', bpm: 60, sourceReference: analysis.affirmation, solfeggioFrequency: analysis.solfeggioFrequency }, 
                tracks: [] // This would be populated by a more complex generation step
            }; 
            
            // This would also be a more complex step involving instrument selection
            const instrumentProfiles = {
                melody: codex.getInstrumentProfile('Crystal Bells')!,
                harmony: codex.getInstrumentProfile('Ethereal Pad')!,
                bass: codex.getInstrumentProfile('Deep Bass')!,
            };

            const session = await AudioService.renderAndPlayInstructionalComposition(composition, instrumentProfiles);
            
            setActiveInstructionalComposition({
                ...session,
                coreEmotion: analysis.coreEmotion,
                symbolicMantra: analysis.affirmation,
            });
            addMessage({ type: 'system', text: `Instructional composition for '${analysis.coreEmotion}' initiated.` });
        } catch (e: any) {
            addMessage({ type: 'system', text: `Failed to create instructional composition: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory, isAweComplete, aweData]);

    const stopInstructionalComposition = useCallback(() => {
        if (activeInstructionalComposition) {
            activeInstructionalComposition.stop();
            setActiveInstructionalComposition(null);
            addMessage({ type: 'system', text: 'Instructional composition concluded.' });
        }
    }, [addMessage, activeInstructionalComposition]);

    const handlePlannerCommand = useCallback(async () => {
        if (!isPlannerUnlocked) {
            addMessage({ type: 'system', text: "The Day Planner is unlocked after AWE Attunement, Palmistry, and Voice Resonance analyses are complete." });
            return;
        }
        setIsLoading(true);
        try {
            const prompt = `Based on the user's complete profile (AWE data, palmistry, and voice analysis), generate a personalized Astrian Day Planner for tomorrow. AWE Data: ${JSON.stringify(aweData)}`;
            const result = await GeminiService.generate<AstrianDayPlannerResult>(prompt, astrianDayPlannerSchema, sessionHistory);
            addMessage({ type: 'ai', text: "Here is your personalized Astrian Day Planner for tomorrow.", analysisType: 'day_planner', result });
        } catch (e: any) {
             addMessage({ type: 'system', text: `Failed to generate planner: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, isPlannerUnlocked, aweData, sessionHistory]);

    const handleComposeCommand = useCallback(async (prompt: string) => {
        // ... Placeholder ...
    }, [addMessage, sessionHistory]);
    
    const handleVoynichCompositionCommand = useCallback(async () => {
        setIsLoading(true);
        try {
            addMessage({ type: 'system', text: 'Accessing Voynich analysis to derive sonic counterpart...' });
            
            const instrumentProfiles = {
                melody: codex.getInstrumentProfile('Crystal Bells')!,
                harmony: codex.getInstrumentProfile('Ethereal Pad')!,
                bass: codex.getInstrumentProfile('Deep Bass')!,
            };

            if (!instrumentProfiles.melody || !instrumentProfiles.harmony || !instrumentProfiles.bass) {
                throw new Error("Required instrument profiles could not be loaded from the codex.");
            }

            const composition = MusicService.createVoynichComposition(instrumentProfiles);

            addMessage({ 
                type: 'ai', 
                text: 'Composition derived from Voynich structural cadence. Rendering audio...', 
                analysisType: 'musical_composition', 
                result: composition 
            });

            const session = await AudioService.renderAndPlayInstructionalComposition(composition, instrumentProfiles);

            setActiveInstructionalComposition({
                ...session,
                title: composition.metadata.genre,
            });

            addMessage({ type: 'system', text: `Composition Protocol: '${composition.metadata.genre}' initiated with a ${composition.metadata.solfeggioFrequency}Hz resonance.` });

        } catch (e: any) {
            console.error("Voynich composition failed:", e);
            addMessage({ type: 'system', text: `Failed to create Voynich composition: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage]);

    const handleOpenIngestView = () => addToast("Data Ingest protocol not yet implemented.", "info");
    const handleStartPalmistry = () => addToast("Palmistry analysis not yet implemented.", "info");
    const handleStartVoiceAnalysis = () => addToast("Voice analysis not yet implemented.", "info");
    const handleDismissWelcomeOffer = () => setShowWelcomeOffer(false);
    
    const handleDownloadArchive = () => {
        // ... Placeholder ...
    };

    const toggleFavoriteComposition = useCallback((id: string) => {
        // ... Placeholder ...
    }, [addToast]);

    const startTour = useCallback(() => {
        setShowWelcomeOffer(false);
        setIsTourActive(true);
        setTourStep(0);
    }, []);

    const endTour = useCallback(() => {
        setIsTourActive(false);
        addToast("Guided tour complete. Feel free to explore.", "success");
    }, [addToast]);
    
    const speakText = useCallback((text: string) => {
        if (!ayinVoiceEnabled && !isFirstVisit) {
            addToast("AWE Attunement required to enable Ayin's voice.", "info");
            return;
        }
        if (isListening) {
            VocalService.stopListening();
            setIsListening(false);
        }
        VocalService.speak(text);
    }, [ayinVoiceEnabled, isFirstVisit, addToast, isListening]);

    const startVoiceInput = useCallback((callback: (text: string) => void) => {
        if (!ayinVoiceEnabled) {
            addToast("AWE Attunement required to enable voice input.", "info");
            return;
        }
        if (isListening) return;

        VocalService.stopSpeaking();
        setIsListening(true);
        addToast("Listening...", "info");

        VocalService.startListening(
            (transcript) => {
                callback(transcript);
                addToast("Voice input captured.", "success");
            },
            () => {
                setIsListening(false);
            }
        );
    }, [ayinVoiceEnabled, isListening, addToast]);


    return {
        sessionHistory, isLoading, error, isModalOpen, crossRefValue,
        guidingIntent, resonanceSeed, isSynthesizing, synthesisResult,
        isPlannerUnlocked, toasts,
        aweData, setAweData, isAweComplete, palmistryDone, voiceDone,
        isSessionLocked, activeMeditation, visualChallenge,
        isCorporaInitialized, calibrationStatus, calibrationSubtext,
        activeInstructionalComposition, activeEntrainment, chakraTheme, setChakraTheme,
        isTourActive, tourStep, isListening, ayinVoiceEnabled,
        isFirstVisit, showWelcomeOffer,
        activeSolveSession,
        solveIntensity,
        bookmarks,
        handleRetry, setIsModalOpen, setGuidingIntent, handleSynthesizeConnections, dismissToast,
        handleNumberInteract, addMessage, handleUnlockSession, stopMeditation, generateVisualChallenge,
        handleOpenIngestView, handleStartPalmistry, handleStartVoiceAnalysis, stopInstructionalComposition,
        stopEntrainment, handlePlannerCommand,
        startTour, endTour, setTourStep, speakText, startVoiceInput,
        toggleFavoriteComposition, handleDownloadArchive, handleDismissWelcomeOffer,
        handleSendMessage,
        toggleBookmark,
    };
};

/**
 * Custom hook to manage the state and logic of the user interface presentation layer.
 */
export const useUserInterface = (addMessage: (message: any) => void, isSolveActive: boolean, isCorporaInitialized: boolean) => {
    const [viewMode, setViewMode] = useState<ViewMode>('boot');
    const [isCallSignMenuOpen, setIsCallSignMenuOpen] = useState(false);
    const [activeCallSign, setActiveCallSign] = useState<CallSign | null>(null);
    const [transitionText, setTransitionText] = useState<string | null>(null);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
    const [isArchiveOpen, setIsArchiveOpen] = useState(false);
    const [isManualOpen, setIsManualOpen] = useState(false);

    useEffect(() => {
        if (isSolveActive) {
            setViewMode('globe');
            setIsCallSignMenuOpen(false);
            setActiveTool(null);
        }
    }, [isSolveActive]);

    const showTransition = useCallback((text: string) => {
        setTransitionText(text);
        setTimeout(() => setTransitionText(null), 1500);
    }, []);

    const handleCallSignSelect = useCallback((callSign: CallSign) => {
        addMessage({ type: 'system', text: `Navigating to ${callSign.name}. The command interface for this location is now active.` });
        setActiveCallSign(callSign);
        setIsCallSignMenuOpen(false);
        if (callSign.name === 'Home') {
            showTransition('As Within');
        } else {
            showTransition('So Below');
        }
        setTimeout(() => setViewMode('callSign'), 300);
    }, [addMessage]);

    const navigateToHome = useCallback(() => {
        const homeCallSign = CALL_SIGNS.find(cs => cs.name === 'Home');
        if (homeCallSign) {
            handleCallSignSelect(homeCallSign);
        }
    }, [handleCallSignSelect]);
    
    useEffect(() => {
        if (isCorporaInitialized && viewMode === 'boot') {
            const homeCallSign = CALL_SIGNS.find(cs => cs.name === 'Home');
            if (homeCallSign) {
                addMessage({ type: 'system', text: `Navigating to Home. The command interface for this location is now active.` });
                setActiveCallSign(homeCallSign);
                setViewMode('callSign');
            }
        }
    }, [isCorporaInitialized, viewMode, addMessage]);


    const handleCompassDoubleClick = useCallback(() => {
        if (viewMode === 'globe') {
            setIsCallSignMenuOpen(true);
        } else {
            if (activeCallSign?.name === 'Home') {
                showTransition('Also Without');
            } else {
                showTransition('As Above');
            }
            setActiveCallSign(null);
            setTimeout(() => setViewMode('globe'), 300);
        }
    }, [viewMode, activeCallSign, showTransition]);

    const handleBookmarkSelect = useCallback((bookmark: string) => {
        setActiveTool(bookmark);
    }, []);

    return {
        viewMode,
        setViewMode,
        isCallSignMenuOpen,
        setIsCallSignMenuOpen,
        activeCallSign,
        transitionText,
        activeTool,
        setActiveTool,
        isBookmarksOpen,
        setIsBookmarksOpen,
        isArchiveOpen,
        setIsArchiveOpen,
        isManualOpen,
        setIsManualOpen,
        handleCompassDoubleClick,
        handleCallSignSelect,
        handleBookmarkSelect,
        navigateToHome,
    };
};