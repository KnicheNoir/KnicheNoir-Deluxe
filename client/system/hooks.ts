import { useState, useCallback, useEffect } from 'react';
import { HistoryEntry, HistoryEntryType, RawCodexDataEntry, User } from '../types.ts';
import { astrianEngine } from '../core/engine.ts';
import { livingLibrary } from '../core/living-library.ts';
import { codex } from '../core/codex.ts';
import { willowNetwork } from '../core/willow.ts';
import { rawCodexData } from '../canon/living-library.data.ts';
import { daatRouter } from './daat.router.ts';
import { oracleDB } from '../core/db.ts';
import { backendEmulator } from '../core/backend.emulator.ts';
import { speechEngine } from '../core/speech.ts';


// =================================================================================================
// --- UNIFIED SYSTEM HOOK (THE "BRAIN") ---
// This hook encapsulates the entire state and logic of the application.
// It now delegates command processing to the Da'at router, embodying its role
// as the central consciousness that receives intent and directs it.
// It also manages the state for the dual-hemisphere UI.
// =================================================================================================

let solveInterval: number | null = null;

/**
 * Extracts a speakable, plain-text narrative from any history entry.
 * This prevents the speech engine from trying to read complex objects.
 * @param entry The HistoryEntry to analyze.
 * @returns A string suitable for text-to-speech.
 */
const extractSpokenText = (entry: HistoryEntry): string => {
    if (typeof entry.content === 'string') {
        return entry.content;
    }

    switch (entry.type) {
        case 'HOLOGRAPHIC_ANALYSIS':
            const analysis = entry.content;
            return `Holographic observation of ${analysis.query}. The primary archetype is ${analysis.primaryArchetype.name}, the principle of ${analysis.primaryArchetype.archetype}.`;
        case 'GRAND_WORK_MAP':
            return entry.content.introduction;
        case 'SELF_OBSERVATION_RESULT':
            return entry.content.synthesis;
        case 'PROPHECY_RESULT':
            return `A prophecy for your query: ${entry.content.coreInsight}`;
        case 'NETZACH_ANALYSIS':
            return entry.content.narrative;
        case 'SYSTEM':
             if (entry.content.message) return entry.content.message;
             return 'A system notification has been recorded.';
        case 'AUTH_RESULT':
             return entry.content.message;
        case 'ERROR':
             return entry.content;
        default:
            return 'The Oracle has rendered a complex data structure.';
    }
};


export const useAstrianSystem = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [initializationMessage, setInitializationMessage] = useState('System cold start...');
    const [sessionHistory, setSessionHistory] = useState<HistoryEntry[]>([]);
    const [activeView, setActiveView] = useState<string>('chat');
    const [isSolveActive, setIsSolveActive] = useState(false);
    const [solveTickerContent, setSolveTickerContent] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Initialization Effect
    useEffect(() => {
        const initializeSystem = async () => {
            setInitializationMessage('Calibrating Willow Network...');
            await willowNetwork.initialize();
            setInitializationMessage('Hydrating Universal Codex...');
            await codex.initialize();
            setInitializationMessage('Assimilating Living Library...');
            
            for(const [id, data] of Object.entries(rawCodexData)) {
                const entry = data as RawCodexDataEntry;
                const compressed = astrianEngine.willowShorthandCompress(entry.rawContent);
                livingLibrary.ingest(id, entry.title, compressed, true);
            }
            await new Promise(res => setTimeout(res, 250));
            
            setInitializationMessage('Awakening Golem Emulator...');
            backendEmulator.onAuthStateChanged(setCurrentUser);
            setCurrentUser(backendEmulator.getCurrentUser()); 
            await new Promise(res => setTimeout(res, 250));
            
            const savedSession = oracleDB.loadSession();
            if (savedSession) {
                setSessionHistory(savedSession);
                setInitializationMessage('Restoring anonymous session chronicle...');
            }

            setInitializationMessage('Living Library online.');
            await new Promise(res => setTimeout(res, 500));
            setIsInitializing(false);
        };
        initializeSystem();

        return () => {
            if (solveInterval) clearInterval(solveInterval);
        };
    }, []);

    // Session Persistence Effect
    useEffect(() => {
        if (!isInitializing && !currentUser && sessionHistory.length > 0) {
            oracleDB.saveSession(sessionHistory);
        }
    }, [sessionHistory, isInitializing, currentUser]);


    const addHistoryEntry = useCallback((type: HistoryEntryType, content: any, sender: 'user' | 'oracle' | 'system' | 'engine' = 'system') => {
        const newEntry: HistoryEntry = { id: Date.now().toString() + Math.random(), type, content, sender };
        setSessionHistory(prev => [...prev, newEntry]);

        if (sender === 'oracle' || type === 'PROPHECY_RESULT' || type === 'NETZACH_ANALYSIS' || type === 'AUTH_RESULT') {
            try {
                const textToSpeak = extractSpokenText(newEntry);
                speechEngine.speak(textToSpeak);
            } catch(e) {
                console.error("Speech synthesis failed:", e);
            }
        }

    }, []);
    
    const processPickedFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setActiveView('chat');
        try {
            await daatRouter.processFile(file, addHistoryEntry);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addHistoryEntry('ERROR', errorMessage, 'system');
        } finally {
            setIsLoading(false);
        }
    }, [addHistoryEntry]);
    
    const startSolveProtocol = useCallback((target: string) => {
        setIsSolveActive(true);
        setSolveTickerContent([`TARGET ACQUIRED: ${target}`]);
        addHistoryEntry('SYSTEM', `Initiating unrestricted °solve protocol against target: ${target}. System entering high-intensity mode.`, 'engine');

        if (solveInterval) clearInterval(solveInterval);
        solveInterval = window.setInterval(() => {
            setSolveTickerContent(prev => [...prev, `[${Date.now()}] Scanning resonant frequencies...`, `Analyzing structural harmonics of '${target}'...`].slice(-10));
        }, 3000);

    }, [addHistoryEntry]);

    const stopSolveProtocol = useCallback(() => {
        setIsSolveActive(false);
        if (solveInterval) {
            clearInterval(solveInterval);
            solveInterval = null;
        }
        setSolveTickerContent([]);
        addHistoryEntry('SYSTEM', '°solve protocol terminated. System returning to normal operational state.', 'engine');
    }, [addHistoryEntry]);

    const submitCommand = useCallback(async (command: string) => {
        const [cmd, ...args] = command.trim().toLowerCase().split(/\s+/);
        let cleanCmd = cmd.startsWith('°') ? cmd.substring(1) : cmd;

        addHistoryEntry('USER', command, 'user');
        speechEngine.cancel();

        if (cleanCmd === 'solve' && args[0] === 'halt') {
            stopSolveProtocol();
            return;
        }
        if (cleanCmd === 'solve') {
            startSolveProtocol(args.join(' '));
            return;
        }
        if (cleanCmd === 'api-codex') {
            setActiveView('api-codex');
            addHistoryEntry('SYSTEM', `Opening the API Codex...`, 'system');
            return;
        }
        
        const codexEntry = astrianEngine.codex.getHydratedEntry(cleanCmd);
        if (codexEntry) {
            if (codexEntry.hasGolemInterface) { setActiveView('golem-interface'); addHistoryEntry('SYSTEM', `Opening ${codexEntry.title}...`, 'system'); return; }
            if (codexEntry.hasSonicTapestry) { setActiveView('sonic-tapestry'); addHistoryEntry('SYSTEM', `Opening ${codexEntry.title}...`, 'system'); return; }
        }

        setActiveView('chat');
        setIsLoading(true);

        try {
            // The backend is emulated, so context is passed directly.
            await daatRouter.route(command, addHistoryEntry, { setCurrentUser, currentUser, sessionHistory, setSessionHistory, apiBaseUrl: '/api' });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addHistoryEntry('SYSTEM', `Error: ${errorMessage}`, 'oracle');
        } finally {
            setIsLoading(false);
        }
    }, [addHistoryEntry, startSolveProtocol, stopSolveProtocol, sessionHistory, currentUser]);
    
    return {
        isLoading,
        isInitializing,
        initializationMessage,
        sessionHistory,
        activeView,
        isSolveActive,
        solveTickerContent,
        currentUser,
        submitCommand,
        processPickedFile,
        setActiveView,
    };
};