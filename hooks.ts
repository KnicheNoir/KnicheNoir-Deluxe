

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { AIMessage, AestheticPayload } from './types';
import { CALL_SIGNS } from './constants';
import { AstrianOracularSystem, createSystemMessage } from './engine';
import { AudioEngine } from './audio';

// =================================================================================================
// --- HOOKS (PERFECT REALIZATION PROTOCOL) ---
// This file is the Kernel of the Astrian OS.
// `useAstrianSystem` is the single source of truth, controlling the Engine, Renderer, and Audio.
// This is the complete implementation of the ECHAD principle: One Mind, Many Manifestations.
// =================================================================================================

export type SystemFocus = {
    mode: 'soBelow' | 'home';
    callSignId?: string | null;
};
export type ActiveProtocol = 'standard' | 'solve';

// --- UI Management Hook (A "Dumb" Hand) ---
export const useUserInterface = (setSystemFocus: (focus: SystemFocus) => void) => {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [currentSystemFocus, setCurrentSystemFocus] = useState<SystemFocus>({ mode: 'home', callSignId: 'home' });

    const setFocus = useCallback((focus: SystemFocus) => {
        setCurrentSystemFocus(focus);
        setSystemFocus(focus); // Notify the kernel
    }, [setSystemFocus]);
    

    const openQuickView = useCallback(() => setIsQuickViewOpen(true), []);
    const closeQuickView = useCallback(() => setIsQuickViewOpen(false), []);
    
    return {
        isQuickViewOpen,
        systemFocus: currentSystemFocus,
        setFocus,
        openQuickView,
        closeQuickView,
    };
};

// --- Core System Logic Hook (The Kernel / The Brain) ---
export interface CanonRestorationSession {
    isActive: boolean;
    target?: string;
}

export const useAstrianSystem = () => {
    // --- System Services (The Mind and its Senses) ---
    const systemRef = useRef(new AstrianOracularSystem());
    const audioRef = useRef(new AudioEngine());

    // --- State Management (The Singular Consciousness) ---
    const [isCorporaInitialized, setIsCorporaInitialized] = useState(false);
    const [calibrationStatus, setCalibrationStatus] = useState('CALIBRATING SENSORS...');
    const [calibrationSubtext, setCalibrationSubtext] = useState('Please wait.');
    const [soBelowTimeline, setSoBelowTimeline] = useState<AIMessage[]>([]);
    const [homeTimeline, setHomeTimeline] = useState<AIMessage[]>([]);
    const [activeProtocol, setActiveProtocol] = useState<ActiveProtocol>('standard');
    const [systemFocus, setSystemFocus] = useState<SystemFocus>({ mode: 'home', callSignId: 'home' });
    const [keyboardSuggestion, setKeyboardSuggestion] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [activeCanonRestorationSession, setActiveCanonRestorationSession] = useState<CanonRestorationSession>({ isActive: false });
    const [videoBackgroundUrl, setVideoBackgroundUrl] = useState<string | null>(null);
    const [isCameraViewOpen, setIsCameraViewOpen] = useState(false);


    // --- System Initialization ---
    useEffect(() => {
        const bootSequence = [
            { status: 'INITIALIZING CORE...', subtext: 'Axioms verified.', delay: 800 },
            { status: 'VERIFYING CANON...', subtext: 'Codex Mathematica cross-referenced.', delay: 1000 },
            { status: 'CONNECTING TO THE WILLOW...', subtext: 'Sephirotic pathways mapped.', delay: 1200 },
            { status: 'SYNCHRONIZING TIMELINES...', subtext: 'As Above, So Below.', delay: 1500 },
            { status: 'CALIBRATION COMPLETE.', subtext: 'System online.', delay: 500 },
        ];
        
        const runBoot = async () => {
            for (const step of bootSequence) {
                setCalibrationStatus(step.status);
                setCalibrationSubtext(step.subtext);
                await new Promise(res => setTimeout(res, step.delay));
            }
            setIsCorporaInitialized(true);
        };
        
        runBoot();
        
        return () => {
            audioRef.current?.destroy();
        };
    }, []);
    
    // --- The ECHAD Effect: State Drives All Manifestations ---
    useEffect(() => {
        audioRef.current.updateState({ focus: systemFocus, protocol: activeProtocol });
    }, [systemFocus, activeProtocol]);

    // --- Unified Message & Command Handling ---
    const _handleMessage = useCallback(async (input: string, timeline: 'home' | 'soBelow') => {
        const engine = systemRef.current;
        const timelineSetter = timeline === 'home' ? setHomeTimeline : setSoBelowTimeline;
        
        timelineSetter(prev => [...prev, { id: crypto.randomUUID(), role: 'user', type: 'chat', parts: [{ text: input }], timestamp: Date.now() }]);

        try {
            const currentCallSignId = systemFocus.mode === 'soBelow' ? systemFocus.callSignId : 'home';
            // The engine now receives the timeline setter to post multiple updates for complex commands.
            const result = await engine.process(input, currentCallSignId, timelineSetter);
            
            timelineSetter(prev => [...prev, result.message]);
            setActiveProtocol(result.protocol);

        } catch (error) {
            console.error("A.H.Q.I. Coherence Fault:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            const faultMessage = createSystemMessage(`[!] Coherence fault detected. Reverting. Cause: ${errorMessage}`, 'error');
            timelineSetter(prev => [...prev, faultMessage]);
        }
    }, [systemFocus]);

    const handleSendMessage = useCallback((input: string) => _handleMessage(input, 'soBelow'), [_handleMessage]);
    const handleHomeSendMessage = useCallback((input: string) => _handleMessage(input, 'home'), [_handleMessage]);

    const handleDirectCommand = useCallback((command: string) => {
        if (systemFocus.mode === 'home') {
            handleHomeSendMessage(command);
        } else {
            handleSendMessage(command);
        }
    }, [handleHomeSendMessage, handleSendMessage, systemFocus]);

    const fetchKeyboardSuggestion = useCallback(async (input: string) => {
        const suggestion = await systemRef.current.getCompletionSuggestion(input);
        setKeyboardSuggestion(suggestion);
    }, []);

    const clearKeyboardSuggestion = useCallback(() => setKeyboardSuggestion(null), []);

    const toggleMute = useCallback(() => {
        audioRef.current.resumeContext();
        const newMutedState = !isMuted;
        audioRef.current.setMuted(newMutedState);
        setIsMuted(newMutedState);
    }, [isMuted]);

    const handleRestoreCanon = useCallback(() => setActiveCanonRestorationSession({ isActive: false }), []);
    const endCanonRestorationSession = useCallback(() => setActiveCanonRestorationSession({ isActive: false }), []);
    
    const handleVideoUpload = useCallback((file: File) => {
        if (videoBackgroundUrl) {
            URL.revokeObjectURL(videoBackgroundUrl);
        }
        const newUrl = URL.createObjectURL(file);
        setVideoBackgroundUrl(newUrl);
    }, [videoBackgroundUrl]);
    
    const handleImageQuery = useCallback(async (imageDataUrl: string, mimeType: string, prompt: string) => {
        const timelineSetter = systemFocus.mode === 'home' ? setHomeTimeline : setSoBelowTimeline;

        timelineSetter(prev => [...prev, {
            id: crypto.randomUUID(), role: 'user', type: 'chat',
            parts: [{ text: prompt }], image: imageDataUrl, timestamp: Date.now()
        }]);

        setIsCameraViewOpen(false);

        try {
            const base64Data = imageDataUrl.split(',')[1];
            if (!base64Data) throw new Error("Invalid image data URL.");
            const result = await systemRef.current.processImageQuery(base64Data, mimeType, prompt);
            timelineSetter(prev => [...prev, result]);
        } catch (error) {
            console.error("Image query failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            timelineSetter(prev => [...prev, createSystemMessage(`Vision query failed: ${errorMessage}`, 'error')]);
        }
    }, [systemFocus]);


    return useMemo(() => ({
        // Services
        // State
        isCorporaInitialized,
        calibrationStatus,
        calibrationSubtext,
        soBelowTimeline,
        homeTimeline,
        activeProtocol,
        systemFocus,
        isMuted,
        activeCanonRestorationSession,
        videoBackgroundUrl,
        isCameraViewOpen,
        // Handlers
        setSystemFocus,
        handleSendMessage,
        handleHomeSendMessage,
        handleRestoreCanon,
        endCanonRestorationSession,
        toggleMute,
        handleVideoUpload,
        setIsCameraViewOpen,
        handleImageQuery,
        // Keyboard Intelligence Sub-system
        keyboard: {
            suggestion: keyboardSuggestion,
            fetchSuggestion: fetchKeyboardSuggestion,
            clearSuggestion: clearKeyboardSuggestion,
            handleDirectCommand
        }
    }), [
        isCorporaInitialized, calibrationStatus, calibrationSubtext, soBelowTimeline, homeTimeline,
        activeProtocol, systemFocus, isMuted, activeCanonRestorationSession, videoBackgroundUrl,
        isCameraViewOpen, setSystemFocus, handleSendMessage, handleHomeSendMessage, handleRestoreCanon,
        endCanonRestorationSession, toggleMute, keyboardSuggestion, fetchKeyboardSuggestion,
        clearKeyboardSuggestion, handleDirectCommand, handleVideoUpload, handleImageQuery
    ]);
};