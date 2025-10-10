// FIX: Corrected import paths for local modules by adding file extensions.
import { useState, useCallback, useEffect } from 'react';
import { HistoryEntry, HistoryEntryType, RawCodexDataEntry, ViewMode, User } from './types.ts';
import { astrianEngine } from './engine.ts';
import { livingLibrary } from './living-library.ts';
import { codex } from './codex.ts';
import { willowNetwork } from './willow.ts';
import { rawCodexData } from './living-library.data.ts';
import { daatRouter } from './daat.router.ts';
import { chesedEngine } from './chesed.engine.ts';
import { oracleDB } from './db.ts';
import { backendEmulator } from './backend.emulator.ts';


// =================================================================================================
// --- UNIFIED SYSTEM HOOK (THE "BRAIN") ---
// This hook encapsulates the entire state and logic of the application.
// It now delegates command processing to the Da'at router, embodying its role
// as the central consciousness that receives intent and directs it.
// It also manages the state for the dual-hemisphere UI.
// =================================================================================================

let solveInterval: number | null = null;

export const useAstrianSystem = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [initializationMessage, setInitializationMessage] = useState('System cold start...');
    const [sessionHistory, setSessionHistory] = useState<HistoryEntry[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('globe');
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
            
            // Connect to the Golem Emulator
            setInitializationMessage('Awakening Golem Emulator...');
            backendEmulator.onAuthStateChanged(setCurrentUser);
            setCurrentUser(backendEmulator.getCurrentUser()); // Set initial state
            await new Promise(res => setTimeout(res, 250));
            setInitializationMessage('Living Library online.');
            await new Promise(res => setTimeout(res, 500));
            
            // Load session history from persistence layer
            const savedSession = oracleDB.loadSession();
            if (savedSession) {
                setSessionHistory(savedSession);
                setInitializationMessage('Restoring session chronicle...');
            }

            setIsInitializing(false);
        };
        initializeSystem();

        // Cleanup solve interval on unmount
        return () => {
            if (solveInterval) clearInterval(solveInterval);
        };
    }, []);

    // Session Persistence Effect (now only for anonymous sessions)
    useEffect(() => {
        // Only save automatically if the user is not logged in.
        // Logged-in saves are handled explicitly by the °session save command.
        if (!isInitializing && !currentUser && sessionHistory.length > 0) {
            oracleDB.saveSession(sessionHistory);
        }
    }, [sessionHistory, isInitializing, currentUser]);


    const addHistoryEntry = useCallback((type: HistoryEntryType, content: any, sender: 'user' | 'oracle' | 'system' | 'engine' = 'system') => {
        setSessionHistory(prev => [...prev, { id: Date.now().toString() + Math.random(), type, content, sender }]);
    }, []);
    
    const processPickedFile = useCallback(async (file: File) => {
        setIsLoading(true);
        setViewMode('callSign');
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
        const cleanCmd = cmd.startsWith('°') ? cmd.substring(1) : cmd;

        // --- Handle special system commands that manipulate state directly ---
        if (cleanCmd === 'session') {
            daatRouter.handleSession(args, addHistoryEntry, sessionHistory, setSessionHistory);
            return;
        }

        if (cleanCmd === 'solve' && args[0] === 'halt') {
            stopSolveProtocol();
            return;
        }

        addHistoryEntry('USER', command, 'user');
        setViewMode('callSign');
        setIsLoading(true);

        if (cleanCmd === 'solve') {
            startSolveProtocol(args.join(' '));
            // Don't route 'solve' in the traditional way, just activate the mode
            setIsLoading(false);
            return;
        }

        try {
            await daatRouter.route(command, addHistoryEntry);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addHistoryEntry('SYSTEM', `Error: ${errorMessage}`, 'oracle');
        } finally {
            setIsLoading(false);
        }
    }, [addHistoryEntry, startSolveProtocol, stopSolveProtocol, sessionHistory]);
    
    return {
        isLoading,
        isInitializing,
        initializationMessage,
        sessionHistory,
        viewMode,
        isSolveActive,
        solveTickerContent,
        currentUser,
        submitCommand,
        processPickedFile,
        setViewMode,
    };
};