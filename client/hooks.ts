// FIX: Corrected import paths for local modules by adding file extension.
import { useState, useCallback, useEffect } from 'react';
import { HistoryEntry, HistoryEntryType, RawCodexDataEntry, ViewMode, User } from './types.ts';
import { astrianEngine } from './engine.ts';
import { livingLibrary } from './living-library.ts';
import { codex } from './codex.ts';
import { willowNetwork } from './willow.ts';
import { rawCodexData } from './living-library.data.ts';
import { daatRouter } from './daat.router.ts';

// =================================================================================================
// --- UNIFIED SYSTEM HOOK (THE "BRAIN") ---
// This hook encapsulates the entire state and logic of the application.
// It now delegates command processing to the Da'at router and communicates with the
// real backend server for authentication and persistence.
// =================================================================================================

let solveInterval: number | null = null;
const BROADCAST_URL_KEY = 'astrian_broadcast_url';

export const useAstrianSystem = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [initializationMessage, setInitializationMessage] = useState('System cold start...');
    const [sessionHistory, setSessionHistory] = useState<HistoryEntry[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>('globe');
    const [isSolveActive, setIsSolveActive] = useState(false);
    const [solveTickerContent, setSolveTickerContent] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [apiBaseUrl, setApiBaseUrl] = useState('/api');


    // Initialization Effect
    useEffect(() => {
        const initializeSystem = async () => {
            // Set API base URL from storage if it exists
            const storedUrl = localStorage.getItem(BROADCAST_URL_KEY);
            if (storedUrl) {
                setApiBaseUrl(storedUrl);
            }

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
            
            // Check authentication status with the real backend
            setInitializationMessage('Contacting the Research Assistant...');
            try {
                const response = await fetch(`${storedUrl || '/api'}/whoami`);
                const data = await response.json();
                if (data.user) {
                    setCurrentUser(data.user);
                    setInitializationMessage(`Authenticated as Operator ${data.user.name}.`);
                } else {
                     setInitializationMessage('Awaiting Operator authentication.');
                }
            } catch (error) {
                setInitializationMessage('Could not connect to the Research Assistant backend.');
                addHistoryEntry('ERROR', 'Connection to the backend server failed. Please ensure the server is running.', 'system');
            }
             await new Promise(res => setTimeout(res, 500));
            
            setIsInitializing(false);
        };
        initializeSystem();

        // Cleanup solve interval on unmount
        return () => {
            if (solveInterval) clearInterval(solveInterval);
        };
    }, []);

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

        addHistoryEntry('USER', command, 'user');
        setViewMode('callSign');
        setIsLoading(true);

        // --- Handle special system commands that manipulate state directly ---
        if (cleanCmd === 'solve' && args[0] === 'halt') {
            stopSolveProtocol();
            setIsLoading(false);
            return;
        }

        if (cleanCmd === 'solve') {
            startSolveProtocol(args.join(' '));
            setIsLoading(false);
            return;
        }

        try {
            // Pass setCurrentUser to the router context for auth commands
            await daatRouter.route(command, addHistoryEntry, {
                setCurrentUser,
                currentUser,
                sessionHistory,
                setSessionHistory,
                apiBaseUrl,
                setApiBaseUrl,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            addHistoryEntry('SYSTEM', `Error: ${errorMessage}`, 'oracle');
        } finally {
            setIsLoading(false);
        }
    }, [addHistoryEntry, startSolveProtocol, stopSolveProtocol, currentUser, sessionHistory, apiBaseUrl]);
    
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