import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GenerateContentResponse } from "@google/genai";
import { View, SessionRecord, EntrainmentProfile, AWEFormData, ELSResult, GuidingIntent, GeneralAnalysisResult, ExhaustiveResonanceResult, Toast, UserMessage, AIMessage, SystemMessage, ComponentMessage, AWEAnalysisResult, PalmistryAnalysisResult, VoiceResonanceAnalysisResult, AstrianDayPlannerResult, NetworkPatternResult, MelodyPatternResult, ApocryphalAnalysisResult, DeepELSAnalysisResult, MeditationResult, CartographerAnalysisResults, MusicalComposition, AIProductionNotes, InstrumentProfile, ResonancePotentialMapResult, VisualChallenge, AttunementResult, InstructionalCompositionSession, ActiveEntrainmentSession, MusicComposerOptions } from './types';
import { GeminiService, AstrianEngine, AudioService, VocalService } from './services';
import { hebraicCartographerSchema, hellenisticCartographerSchema, apocryphalAnalysisSchema, aweSynthesisSchema, palmistryAnalysisSchema, astrianDayPlannerSchema, voiceResonanceAnalysisSchema, deepElsAnalysisSchema, meditationScriptSchema, aiProductionNotesSchema, instructionalCompositionAnalysisSchema, chakraThemeSchema } from './constants';
import { LibraryService } from './library';
import { hebrewNetwork } from './src/dataModels';
import { codex } from './codex';

/**
 * hooks.ts
 *
 * This file defines custom React hooks for the Astrian Key application.
 * The primary hook, `useAstrianSystem`, encapsulates the majority of the
 * application's state and logic, including session management, API calls,
 * and view routing. This greatly simplifies the main `App` component.
 */

const entrainmentProfiles: EntrainmentProfile[] = [
    { name: 'Hypnotic Induction (Alpha Wave)', description: 'A foundational state for focused relaxation and heightened suggestibility.', type: 'binaural', baseFrequency: 120, targetFrequency: 10 },
    { name: 'Deep Meditation (Theta Wave)', description: 'For profound meditative states, creativity, and subconscious exploration.', type: 'binaural', baseFrequency: 120, targetFrequency: 5 },
    { name: 'Gateway Process (Focus 10)', description: 'An homage to Monroe\'s "mind awake, body asleep" state for out-of-body exploration.', type: 'binaural', baseFrequency: 110, targetFrequency: 7.83 },
    { name: 'Visualization Catalyst (High Alpha)', description: 'Enhances mental imagery, creative focus, and light trance states.', type: 'binaural', baseFrequency: 130, targetFrequency: 12 },
    { name: 'Autosuggestion Matrix (Alpha/Theta)', description: 'Creates a receptive state ideal for affirmations and subconscious programming.', type: 'binaural', baseFrequency: 115, targetFrequency: 8 },
];

type AddMessageArg =
    | Omit<UserMessage, 'id' | 'timestamp'>
    | Omit<AIMessage, 'id' | 'timestamp'>
    | Omit<SystemMessage, 'id' | 'timestamp'>
    | Omit<ComponentMessage, 'id' | 'timestamp'>;

interface ParsedReference { 
    book: string; 
    chapter: number; 
    verse?: number;
    endVerse?: number;
    raw: string; 
}


export const useAstrianSystem = () => {
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
    const [willowKey, setWillowKey] = useState<string | null>(null);
    const [aweData, setAweData] = useState<AWEFormData>({ fullNameAtBirth: '', currentNameUsed: '', birthDate: '', birthTime: '', birthLocation: '', inflectionPoints: [], relationalNodeHarmonious: '', relationalNodeChallenging: '', geographicAnchor: '', centralQuestion: '', visualCipherConcepts: ['', '', ''] });
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [isSessionLocked, setIsSessionLocked] = useState(true);
    const [visualChallenge, setVisualChallenge] = useState<VisualChallenge | null>(null);
    const [activeMeditation, setActiveMeditation] = useState<{script: string, imagePrompts: string[]} | null>(null);
    const [activeEntrainment, setActiveEntrainment] = useState<ActiveEntrainmentSession | null>(null);
    const [activeInstructionalComposition, setActiveInstructionalComposition] = useState<InstructionalCompositionSession | null>(null);
    const [chakraTheme, setChakraTheme] = useState('neutral');
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [favoritedCompositions, setFavoritedCompositions] = useState<MusicalComposition[]>([]);


    const isAweComplete = useMemo(() => !!(aweData.fullNameAtBirth && aweData.birthDate && aweData.birthTime && aweData.centralQuestion && aweData.visualCipherConcepts.every(c => c.trim() !== '')), [aweData]);
    const palmistryDone = useMemo(() => sessionHistory.some(msg => msg.type === 'ai' && msg.analysisType === 'palmistry'), [sessionHistory]);
    const voiceDone = useMemo(() => sessionHistory.some(msg => msg.type === 'ai' && msg.analysisType === 'voice'), [sessionHistory]);
    const isPlannerUnlocked = useMemo(() => isAweComplete && palmistryDone && voiceDone, [isAweComplete, palmistryDone, voiceDone]);
    const ayinVoiceEnabled = useMemo(() => isAweComplete, [isAweComplete]);

    const addMessage = useCallback((message: AddMessageArg) => {
        const newMessage = { ...message, id: Date.now().toString(), timestamp: new Date() } as SessionRecord;
        setSessionHistory(prev => [...prev, newMessage]);
        return newMessage;
    }, []);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => dismissToast(id), 5000);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);
    
    useEffect(() => {
        const initializeSystem = async () => {
            try {
                setCalibrationStatus('Calibrating Quantum Resonance Engine...');
                setCalibrationSubtext('Please wait, this may take a moment on first launch.');
                
                await codex.initialize();
                setCalibrationStatus('Indexing Universal Codex...');
                await new Promise(res => setTimeout(res, 250));

                await hebrewNetwork.initialize();
                setCalibrationStatus('Indexing Letterform Matrix...');
                await new Promise(res => setTimeout(res, 250));

                setCalibrationStatus('Deriving Willow Library Key...');
                const key = AstrianEngine.getWillowLibraryKey();
                setWillowKey(key);
                await new Promise(res => setTimeout(res, 250));
                
                if (!VocalService.checkSupport()) {
                     addMessage({type: 'system', text: 'Vocal synthesis & recognition not supported in this browser.'});
                }

                setCalibrationStatus('System Online.');
                await new Promise(res => setTimeout(res, 500));
                
                setIsCorporaInitialized(true);

                const hasVisited = localStorage.getItem('astrian_has_visited');
                if (!hasVisited) {
                    setIsFirstVisit(true);
                    setIsTourActive(true);
                    localStorage.setItem('astrian_has_visited', 'true');
                }

            } catch (err) {
                console.error("Initialization failed:", err);
                setError("Critical system initialization failed. Please refresh.");
                setCalibrationStatus('Initialization Error');
            }
        };
        initializeSystem();
    }, [addMessage]); 
    
    useEffect(() => {
        const themes = ['neutral', 'root', 'sacral', 'solarPlexus', 'heart', 'throat', 'thirdEye', 'crown'];
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % themes.length;
            setChakraTheme(themes[currentIndex]);
        }, 30000); // Cycle every 30 seconds

        return () => clearInterval(intervalId);
    }, []);
    
    const startTour = useCallback(() => {
        VocalService.stopSpeaking();
        setTourStep(0);
        setIsTourActive(true);
    }, []);

    const endTour = useCallback(() => {
        VocalService.stopSpeaking();
        setIsTourActive(false);
    }, []);
    
    const speakText = useCallback((text: string) => {
        // Allow speaking for first tour, otherwise check if AWE is complete
        if (isFirstVisit || ayinVoiceEnabled) {
            VocalService.speak(text);
        }
    }, [ayinVoiceEnabled, isFirstVisit]);

    const startVoiceInput = useCallback((callback: (text: string) => void) => {
        if (!ayinVoiceEnabled || isListening) return;
        setIsListening(true);
        VocalService.startListening(callback, () => setIsListening(false));
    }, [ayinVoiceEnabled, isListening]);


    const stopInstructionalComposition = useCallback(() => {
        setActiveInstructionalComposition(prev => {
            if (prev?.stop) {
                prev.stop();
            }
            return null;
        });
        addMessage({ type: 'system', text: 'Instructional session concluded.' });
    }, [addMessage]);


    const handleInstructionCommand = useCallback(async (goal: string) => {
        if (!isAweComplete) {
            addMessage({ type: 'system', text: 'The °instruct protocol requires a complete AWE signature. Please complete the form first.' });
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Distill Intent
            addMessage({ type: 'system', text: 'Distilling Intent...' });
            const analysisPrompt = `Analyze the user's goal "${goal}" in the context of their AWE signature: ${JSON.stringify(aweData)}. Distill it into a core positive emotion, a short affirmation, and the most suitable Solfeggio frequency.`;
            const analysisResult = await GeminiService.generate(analysisPrompt, instructionalCompositionAnalysisSchema, sessionHistory, 'Analytical');
            const { coreEmotion, affirmation, solfeggioFrequency } = analysisResult;

            // Step 2: Musical Spelling
            addMessage({ type: 'system', text: 'Composing Carrier Wave (Melodic Motif)...' });
            const motif = codex.getNoteSequenceForText(affirmation);
            const symbolicMantra = hebrewNetwork.getAllArchetypalWords().get(affirmation.toLowerCase()) || affirmation.split('').map(c => hebrewNetwork.getLetterformAnalysis(c)?.letter || c).join('');


            // Step 3: AI Composition
            addMessage({ type: 'system', text: 'Generating Harmonic Structure...' });
            const compositionPrompt = `
                Compose a complete, therapeutic musical piece based on the following parameters. Return a valid JSON object matching the MusicalComposition structure.
                - User Goal: ${goal}
                - Core Emotion: ${coreEmotion}
                - Central Melodic Motif (musically spelled from "${affirmation}"): ${JSON.stringify(motif)}
                - Tonal Center: ${solfeggioFrequency} Hz Solfeggio frequency.
                - AWE Signature (for personalization): ${JSON.stringify(aweData)}
                
                The composition must have three tracks: 'melody', 'harmony', and 'bass'. The 'melody' track MUST incorporate the provided melodic motif. The harmony and bass should support the core emotion. Keep the composition simple, hypnotic, and around 60-90 seconds long.
            `;
            const compositionJSON = await GeminiService.generateTextOnly(compositionPrompt, sessionHistory, 'Creative');
            const composition: MusicalComposition = JSON.parse(compositionJSON);

            // Step 4: Audio Rendering
            addMessage({ type: 'system', text: 'Rendering Entrainment Audio...' });
            const productionNotesPrompt = `Generate production notes for the provided musical composition. Available instruments: ${Object.keys(codex.getMusicologyData().instruments).join(', ')}.`;
            const productionNotes = await GeminiService.generate(productionNotesPrompt, aiProductionNotesSchema, sessionHistory, 'Creative');
            
            const compositionBlob = await AudioService.sequenceAndRenderComposition(composition, { melody: codex.getInstrumentProfile('Crystal Bells'), harmony: codex.getInstrumentProfile('Ethereal Pad'), bass: codex.getInstrumentProfile('Deep Bass') });
            const { stop, analyserNode, audioUrl } = AudioService.renderAndPlayInstructionalComposition(compositionBlob, solfeggioFrequency);
            
            // Step 5: Launch UI
            setActiveInstructionalComposition({ stop, analyserNode, audioUrl, coreEmotion, symbolicMantra });

        } catch (e: any) {
            console.error("Instructional Composition failed:", e);
            setError(`Instructional Composition protocol failed: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, isAweComplete, aweData, sessionHistory]);

    const toggleFavoriteComposition = useCallback((compositionId: string) => {
        let targetComposition: MusicalComposition | null = null;
        
        const newHistory = sessionHistory.map(record => {
            if (record.type === 'ai' && record.analysisType === 'musical_composition' && record.result.id === compositionId) {
                const updatedComposition = { ...record.result, isFavorite: !record.result.isFavorite };
                targetComposition = updatedComposition;
                return { ...record, result: updatedComposition };
            }
            return record;
        });
        setSessionHistory(newHistory);

        if (targetComposition) {
            setFavoritedCompositions(prev => {
                if (targetComposition!.isFavorite) {
                    if (!prev.find(c => c.id === compositionId)) {
                        return [...prev, targetComposition!];
                    }
                } else {
                    return prev.filter(c => c.id !== compositionId);
                }
                return prev;
            });
            addToast(targetComposition.isFavorite ? 'Composition favorited!' : 'Composition unfavorited.', 'success');
        }
    }, [sessionHistory, addToast]);


    const generateAndDisplayComposition = useCallback(async (options: MusicComposerOptions) => {
        setIsLoading(true);
        setError(null);
        addMessage({ type: 'system', text: `Composing based on "${options.prompt}"...` });

        try {
            const prompt = `
                Compose a complete, therapeutic musical piece based on the following parameters. Return a valid JSON object matching the MusicalComposition structure (excluding id, isFavorite, audioUrl).
                - User's Core Prompt: "${options.prompt}"
                - Key: ${options.key}
                - Mode: ${options.mode}
                - Instruments to use: Melody (${options.instrumentProfiles.melody.name}), Harmony (${options.instrumentProfiles.harmony.name}), Bass (${options.instrumentProfiles.bass.name}).
                
                The composition must have three tracks: 'melody', 'harmony', and 'bass'. The music should reflect the mood of the core prompt. The composition should be around 60-90 seconds long.
            `;
            
            const compositionJSONString = await GeminiService.generateTextOnly(prompt, sessionHistory, 'Creative');
            const parsedComposition = JSON.parse(compositionJSONString);

            addMessage({ type: 'system', text: 'Rendering audio...' });
            
            const compositionBlob = await AudioService.sequenceAndRenderComposition(parsedComposition, options.instrumentProfiles);
            const audioUrl = URL.createObjectURL(compositionBlob);

            const finalComposition: MusicalComposition = {
                ...parsedComposition,
                id: `comp_${Date.now()}`,
                isFavorite: false,
                audioUrl: audioUrl,
            };

            addMessage({
                type: 'ai',
                text: `I have composed a piece for you based on "${options.prompt}".`,
                analysisType: 'musical_composition',
                result: finalComposition,
            });

        } catch (e: any) {
            console.error("Composition generation failed:", e);
            setError(`Composition protocol failed: ${e.message}`);
            addMessage({ type: 'system', text: `Error: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, sessionHistory]);

    const handleComposeCommand = useCallback((prompt: string) => {
        addMessage({
            type: 'component',
            component: 'music_composer',
            props: {
                prompt: prompt.trim(),
                onSubmit: generateAndDisplayComposition,
            }
        });
        setIsLoading(false); 
    }, [addMessage, generateAndDisplayComposition]);
    
    const startEntrainment = useCallback((profile: EntrainmentProfile) => {
        const { stop } = AudioService.startBinauralBeat(profile);
        setActiveEntrainment({ profile, stop });
    }, []);

    const stopEntrainment = useCallback(async () => {
        const sessionToStop = activeEntrainment;
        if (!sessionToStop) return;
    
        sessionToStop.stop();
        setActiveEntrainment(null);
        addMessage({ type: 'system', text: `Entrainment session '${sessionToStop.profile.name}' concluded. Generating post-session integration...` });
    
        setIsLoading(true);
        setError(null);
        try {
            const { profile } = sessionToStop;
            const prompt = `
                A user has just finished a brainwave entrainment session using the '${profile.name}' profile.
                - **Description**: "${profile.description}"
                - **Target Frequency**: ${profile.targetFrequency}Hz (${profile.name.match(/\(([^)]+)\)/)?.[1] || 'wave'})
                
                Generate a supportive follow-up to help them transition back and integrate the session's effects.
                Provide three sections with clear headings in markdown:
                1.  **Gentle Inquiry**: 2-3 open-ended questions for reflection on the state they achieved.
                2.  **Lingering Affirmations**: 2-3 short, positive affirmations related to the session's goal.
                3.  **Practical Integration**: 2-3 simple, actionable tips to maintain the benefits of the session.
                Your tone should be clear, calming, and encouraging.
            `;
            const responseText = await GeminiService.generateTextOnly(prompt, sessionHistory, 'Creative');
            addMessage({ type: 'ai', text: responseText });
        } catch (e: any) {
            setError(e.message);
            addMessage({ type: 'system', text: `Failed to generate post-session integration: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, activeEntrainment, sessionHistory]);

    const analyzeAndSetChakraTheme = useCallback(async (query: string) => {
        try {
            const prompt = `Analyze the user's query: "${query}". Based on its core theme (e.g., survival/grounding, emotions/creativity, intellect/power, love/connection, communication, intuition, spirituality), classify it into one of the seven chakras. Respond with a single JSON object: {"chakra": "theme_name"}, where theme_name is one of: "root", "sacral", "solarPlexus", "heart", "throat", "thirdEye", "crown". If the theme is neutral, abstract, or unclassifiable, use "neutral".`;
            const result = await GeminiService.generate(prompt, chakraThemeSchema);
            if (result && result.chakra) {
                setChakraTheme(result.chakra);
            }
        } catch (e) {
            console.warn("Chakra theme analysis failed:", e);
            // Fail silently to not interrupt user flow.
        }
    }, []);

    const handleSendMessage = useCallback(async (query: string) => {
        addMessage({ type: 'user', text: query });
        setIsLoading(true);
        setError(null);
        lastQueryRef.current = { query, prompt: query };

        analyzeAndSetChakraTheme(query); // Fire-and-forget theme analysis

        const commandMatch = query.trim().match(/^°(\w+)\s*(.*)/);
        if (commandMatch) {
            const [, command, args] = commandMatch;
            switch(command.toLowerCase()) {
                case 'compose':
                    handleComposeCommand(args);
                    return;
                case 'instruct':
                    await handleInstructionCommand(args);
                    return;
                case 'entrain':
                    if (isAweComplete) {
                        addMessage({
                            type: 'component',
                            component: 'entrainment_selection',
                            props: {
                                profiles: entrainmentProfiles,
                                onSelect: startEntrainment
                            }
                        });
                    } else {
                        addMessage({ type: 'system', text: 'The °entrain protocol requires a complete AWE signature for attunement. The protocols are explained below.' });
                        addMessage({
                            type: 'component',
                            component: 'entrainment_info',
                            props: {
                                profiles: entrainmentProfiles,
                            }
                        });
                    }
                    setIsLoading(false);
                    return;
                default:
                     addMessage({ type: 'system', text: `Unknown command: °${command}` });
                     setIsLoading(false); // Stop loading for unknown command
                     return;
            }
        }

        // Standard chat logic
        try {
            const responseText = await GeminiService.generateTextOnly(query, sessionHistory, guidingIntent);
            addMessage({ type: 'ai', text: responseText });
        } catch (e: any) {
            setError(e.message);
        }

        setIsLoading(false);
    }, [addMessage, sessionHistory, guidingIntent, handleInstructionCommand, startEntrainment, isAweComplete, analyzeAndSetChakraTheme, handleComposeCommand]);

    const handleRetry = useCallback(() => {
        if (lastQueryRef.current) {
            handleSendMessage(lastQueryRef.current.prompt);
        }
    }, [handleSendMessage]);

    const handleNumberInteract = useCallback((num: number) => {
        setIsModalOpen(true);
        setCrossRefValue(num);
    }, []);
    
    const handleSynthesizeConnections = useCallback(async (num: number) => {
        setIsSynthesizing(true);
        setSynthesisResult(null);
        try {
            const relevantHistory = sessionHistory.filter(item => JSON.stringify(item).includes(String(num)));
            const prompt = `Synthesize the connections related to the number ${num} based on this session history: ${JSON.stringify(relevantHistory)}`;
            const result = await GeminiService.generateTextOnly(prompt, sessionHistory, 'Analytical');
            setSynthesisResult(result);
        } catch(e: any) {
            addToast(`Synthesis failed: ${e.message}`, 'error');
        } finally {
            setIsSynthesizing(false);
        }
    }, [sessionHistory, addToast]);

    const generateVisualChallenge = useCallback(async () => {
        if (!isAweComplete) return;
        setIsLoading(true);
        try {
            const prompts = [...aweData.visualCipherConcepts];
            // To make it a challenge, we add some foils.
            const foilPrompts = ["a serene landscape", "a geometric pattern", "a bustling city street", "an abstract splash of color", "a quiet library", "a powerful ocean wave"];
            const selectedFoils = foilPrompts.sort(() => 0.5 - Math.random()).slice(0, 6);
            
            const allPrompts = [...prompts, ...selectedFoils].sort(() => 0.5 - Math.random());

            const images = await Promise.all(allPrompts.map(p => GeminiService.generateImages(p, 1)));
            const challenge: VisualChallenge = {
                images: images.map((imgData, i) => ({
                    url: `data:image/jpeg;base64,${imgData[0]}`,
                    prompt: allPrompts[i]
                }))
            };
            setVisualChallenge(challenge);
        } catch (e: any) {
            setError(`Failed to generate visual challenge: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [isAweComplete, aweData.visualCipherConcepts]);


    const handleUnlockSession = useCallback(async (selectedPrompts: string[]) => {
        setIsLoading(true);
        const originalPrompts = aweData.visualCipherConcepts.sort();
        const selectedSorted = [...selectedPrompts].sort();
        
        await new Promise(res => setTimeout(res, 1000));

        if (JSON.stringify(originalPrompts) === JSON.stringify(selectedSorted)) {
            setIsSessionLocked(false);
            setVisualChallenge(null);
            addMessage({ type: 'system', text: 'Signature confirmed. Session unlocked.' });
        } else {
            addToast('Signature mismatch. Please try again.', 'error');
            await generateVisualChallenge();
        }
        setIsLoading(false);
    }, [aweData.visualCipherConcepts, addMessage, addToast, generateVisualChallenge]);

    useEffect(() => {
        if (isCorporaInitialized && isSessionLocked && !visualChallenge) {
            generateVisualChallenge();
        }
    }, [isCorporaInitialized, isSessionLocked, visualChallenge, generateVisualChallenge]);


    const stopMeditation = useCallback(async () => {
        const sessionToStop = activeMeditation;
        if (!sessionToStop) return;
    
        setActiveMeditation(null);
        addMessage({type: 'system', text: 'Meditation concluded. Generating post-session integration...'});
    
        setIsLoading(true);
        setError(null);
        try {
            const prompt = `
                A user has just finished a guided meditation. Here is a snippet of the script they followed:
                ---
                ${sessionToStop.script.substring(0, 1500)}... 
                ---
                Generate a gentle and insightful follow-up to help them integrate the experience.
                Provide three sections with clear headings in markdown:
                1.  **Gentle Inquiry**: 2-3 open-ended questions for reflection.
                2.  **Lingering Affirmations**: 2-3 short, positive affirmations related to the meditation's theme.
                3.  **Practical Integration**: 2-3 simple, actionable tips to carry the feeling of the meditation into their day.
                Your tone should be supportive and grounding. Do not repeat parts of the script in your response.
            `;
            const responseText = await GeminiService.generateTextOnly(prompt, sessionHistory, 'Creative');
            addMessage({ type: 'ai', text: responseText });
        } catch (e: any) {
            setError(e.message);
            addMessage({ type: 'system', text: `Failed to generate post-session integration: ${e.message}` });
        } finally {
            setIsLoading(false);
        }
    }, [addMessage, activeMeditation, sessionHistory]);
    
    // Placeholder functions to satisfy App component
    const handleOpenIngestView = () => addToast('Ingest view not yet implemented.', 'info');
    const handleStartPalmistry = () => addToast('Palmistry module not yet implemented.', 'info');
    const handleStartVoiceAnalysis = () => addToast('Voice analysis module not yet implemented.', 'info');

    return {
        sessionHistory, isLoading, error, isModalOpen, crossRefValue,
        guidingIntent, resonanceSeed, isSynthesizing, synthesisResult,
        isPlannerUnlocked, toasts, aweData, isAweComplete, palmistryDone, voiceDone,
        isSessionLocked, activeMeditation, visualChallenge, isCorporaInitialized,
        calibrationStatus, calibrationSubtext, activeInstructionalComposition,
        activeEntrainment,
        chakraTheme,
        isTourActive, tourStep, isListening, ayinVoiceEnabled,
        favoritedCompositions,
        isFirstVisit,
        
        handleSendMessage, handleRetry, setIsModalOpen, setGuidingIntent, handleSynthesizeConnections,
        dismissToast, addMessage, handleNumberInteract, setAweData, handleUnlockSession,
        stopMeditation, generateVisualChallenge, handleOpenIngestView, handleStartPalmistry,
        handleStartVoiceAnalysis, stopInstructionalComposition, stopEntrainment,
        startTour, endTour, setTourStep, speakText, startVoiceInput,
        toggleFavoriteComposition,
    };
};