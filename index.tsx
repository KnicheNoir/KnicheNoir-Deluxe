import React, { FC, useState, memo } from 'react';
import { createRoot } from 'react-dom/client';
import { useAstrianSystem, useUserInterface } from './hooks';
import {
    ChatView, KaleidoscopicBackground, SubliminalGlyph, SessionUnlockView, MeditationView, 
    AyinGuide, StelaCalibrationView, InstructionalCompositionView, EntrainmentView, EmergentCTA,
    AstrianInterface,
    BootAnimationView,
    HomeView,
    LibraryView,
    OracleView,
    CameraView,
    VoiceRecorderView
} from './components';
import { AIMessage } from './types';

// =================================================================================================
// --- MEMOIZED CONTENT VIEW (PERFORMANCE OPTIMIZATION) ---
// =================================================================================================

interface CallSignContentViewProps {
    system: any; // A more specific type would be better, but for now, this works
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    onCommandSelect: (command: string) => void;
    onDirectCommand: (command: string) => void;
}

/**
 * This component encapsulates all content for the "So Below" view.
 * It is memoized to prevent re-renders on every keystroke from the parent App component,
 * which is a major performance optimization. It now acts as a router for the active view.
 */
const CallSignContentView: FC<CallSignContentViewProps> = memo((props) => {
    const { system, input, setInput, handleSend, onCommandSelect, onDirectCommand } = props;
    
    const chatProps = {
        history: system.sessionHistory,
        error: system.error,
        onRetry: system.handleRetry,
        onNumberInteract: system.handleNumberInteract,
        input: input,
        onInputChange: setInput,
        onSend: handleSend,
        onSpeak: system.speakText,
        isVoiceEnabled: system.ayinVoiceEnabled,
        isListening: system.isListening,
        onStartListening: system.startVoiceInput,
        onToggleFavorite: system.toggleFavoriteComposition,
        bookmarks: system.bookmarks,
        onToggleBookmark: system.toggleBookmark,
    };

    const guideProps = {
         onCommandSelect: handleSend, // Direct send for Ayin commands
         onOpenIngest: system.handleOpenIngestView,
         isAweComplete: system.isAweComplete,
         onStartTour: system.startTour,
         isFirstVisit: system.isFirstVisit,
         onDownloadArchive: system.handleDownloadArchive,
    };

    // Render specialized views based on the unified soBelowState from the reducer
    switch (system.soBelowState.view) {
        case 'home':
            return <HomeView 
                        customTools={system.customTools} 
                        widgets={system.widgets}
                        setWidgets={system.setWidgets}
                        handleSaveTool={system.handleSaveTool}
                        addToast={system.addToast}
                        onDirectCommand={onDirectCommand}
                    />;
        case 'library':
             return <LibraryView chatProps={chatProps} guideProps={guideProps} addToast={system.addToast} onDirectCommand={onDirectCommand} />;
        case 'oracle':
             return <OracleView chatProps={chatProps} guideProps={guideProps} addToast={system.addToast} onDirectCommand={onDirectCommand} />;
        case 'instructional':
            return <InstructionalCompositionView session={system.soBelowState.sessionData} onStop={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        case 'entrainment':
            return <EntrainmentView session={system.soBelowState.sessionData} onStop={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        case 'unlock':
            return <SessionUnlockView onUnlock={system.handleUnlockSession} challenge={system.soBelowState.sessionData.challenge} isLoading={system.isLoading} onRegenerate={system.generateVisualChallenge} />;
        case 'meditation':
            return <MeditationView script={system.soBelowState.sessionData.script} imagePrompts={system.soBelowState.sessionData.imagePrompts} onFinish={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        case 'palmistry_capture':
            return <CameraView onCapture={system.handlePalmImageCapture} onCancel={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        case 'voice_capture':
            return <VoiceRecorderView onRecord={system.handleVoiceRecording} onCancel={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        default: // 'chat'
            const lastMessage = system.sessionHistory.length > 0 ? system.sessionHistory[system.sessionHistory.length - 1] : null;

            return (
                <div className="app-content-wrapper">
                     <ChatView {...chatProps} />
                     <AyinGuide {...guideProps} />
                     <EmergentCTA onTrigger={system.handleSendMessage} lastMessage={lastMessage as AIMessage | null} />
                     <SubliminalGlyph seed={system.resonanceSeed} />
                </div>
            );
    }
});


// =================================================================================================
// --- MAIN APP COMPONENT ---
// =================================================================================================

const App: FC = () => {
    // Core application state and business logic
    const system = useAstrianSystem();
    
    // UI presentation state and interaction logic
    const ui = useUserInterface(system.addMessage, system.activeSolveSession.isActive, system.isCorporaInitialized, system.dispatchSoBelow);
    
    // State for the main chat input, managed at the top level
    const [input, setInput] = useState('');

    const handleCommandSelect = (command: string) => {
        const commandWithSpace = command.endsWith(' ') ? command : command + ' ';
        setInput(prev => prev ? `${prev} ${commandWithSpace}` : commandWithSpace);
    };

    const handleDirectCommand = (command: string) => {
        if (ui.viewMode === 'globe') {
            ui.setViewMode('callSign');
        }
        system.handleSendMessage(command);
        setInput('');
    };

    const handleSend = () => {
        if (input.trim()) {
            // If the user sends a message from the globe, switch them to the chat view
            // unless they are initiating a new solve session or going home.
            if (ui.viewMode === 'globe' && !input.toLowerCase().trim().startsWith('°solve') && !input.toLowerCase().trim().includes('home')) {
                ui.setViewMode('callSign');
            }
            // If we are in a call sign sandbox, sending a message should not change the view
            if (system.soBelowState.view !== 'home' && system.soBelowState.view !== 'library' && system.soBelowState.view !== 'oracle') {
                 system.dispatchSoBelow({ type: 'STOP_SESSION' });
            }
            system.handleSendMessage(input);
            setInput('');
        }
    };
    
    // The boot animation screen takes over until initialization is complete
    // AND the user has clicked the Ayin to enter the main application.
    if (!system.isCorporaInitialized || ui.viewMode === 'boot') {
        return (
            <>
                <KaleidoscopicBackground resonance={system.resonanceSeed} />
                <BootAnimationView
                    statusText={system.calibrationStatus}
                    subText={system.calibrationSubtext}
                    isComplete={system.isCorporaInitialized}
                    onEnter={ui.navigateToHome}
                />
            </>
        );
    }

    const isSolveActive = system.activeSolveSession.isActive;

    // The App component now delegates all "So Below" content rendering to the memoized
    // CallSignContentView component, preventing wasteful re-renders of the entire app.
    return (
        <>
            <KaleidoscopicBackground resonance={system.resonanceSeed} />
            <AstrianInterface
                {...system}
                {...ui}
                isSolveActive={isSolveActive}
                onCommandSelect={handleCommandSelect}
                onDirectCommand={handleDirectCommand}
                handleScreenshot={system.handleScreenshot}
                handleDownloadArchive={system.handleDownloadArchive}
            >
                <CallSignContentView 
                    system={system} 
                    input={input} 
                    setInput={setInput} 
                    handleSend={handleSend}
                    onCommandSelect={handleCommandSelect}
                    onDirectCommand={handleDirectCommand}
                />
            </AstrianInterface>
        </>
    );
};

// =================================================================================================
// --- APP INITIALIZATION ---
// =================================================================================================

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);