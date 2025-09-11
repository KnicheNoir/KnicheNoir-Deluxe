import React, { FC, useState, memo } from 'react';
import { createRoot } from 'react-dom/client';
// FIX: Removed file extensions from imports to resolve module errors.
import { useAstrianSystem, useUserInterface } from './hooks';
import {
    TimelineView, KaleidoscopicBackground, SubliminalGlyph, SessionUnlockView, MeditationView, 
    CommandGuide, InstructionalCompositionView, EntrainmentView, EmergentCTA,
    AstrianInterface,
    BootAnimationView,
    HomeView,
    LibraryView,
    OracleView,
    CameraView,
    VoiceRecorderView,
    IngestionView,
    BIP39DecryptorView,
    SolveProtocolView,
    HokmahForgingProtocolView,
    BinahUnravelingView,
    EinSofInversionView
// FIX: Removed file extensions from imports to resolve module errors.
} from './components';
// FIX: Removed file extensions from imports to resolve module errors.
import { AIMessage } from './types';

// =================================================================================================
// --- MEMOIZED CONTENT VIEW (PERFORMANCE OPTIMIZATION) ---
// =================================================================================================

interface CallSignContentViewProps {
    system: any; 
    input: string;
    setInput: (value: string) => void;
    handleSend: () => void;
    homeInput: string;
    setHomeInput: (value: string) => void;
    handleHomeSend: () => void;
    onCommandSelect: (command: string) => void;
    onDirectCommand: (command: string) => void;
}

/**
 * This component encapsulates all content for the "So Below" view.
 * It is memoized to prevent re-renders on every keystroke from the parent App component,
 * which is a major performance optimization. It now acts as a router for the active view.
 */
const CallSignContentView: FC<CallSignContentViewProps> = memo((props) => {
    const { system, input, setInput, handleSend, homeInput, setHomeInput, handleHomeSend, onCommandSelect, onDirectCommand } = props;
    
    const timelineProps = {
        history: system.sessionHistory,
        error: system.error,
        onRetry: system.handleRetry,
        input: input,
        onInputChange: setInput,
        onSend: handleSend,
        // FIX: Added missing `isLoading` prop required by TimelineView.
        isLoading: system.isLoading,
        isListening: system.isListening,
        onStartListening: system.startVoiceInput,
        bookmarks: system.bookmarks,
        onToggleBookmark: system.toggleBookmark,
        isVoiceEnabled: system.ayinVoiceEnabled,
        onNumberInteract: system.handleNumberInteract,
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
            const homeTimelineProps = {
                ...timelineProps, // Inherit common props
                history: system.homeSessionHistory,
                input: homeInput,
                onInputChange: setHomeInput,
                onSend: handleHomeSend,
            };
            // FIX: Removed props that are not available on the 'system' object or used by the component.
            return <HomeView 
                        customTools={system.customTools} 
                        onDirectCommand={onDirectCommand}
                        homeTimelineProps={homeTimelineProps}
                    />;
        case 'library':
             // FIX: Removed 'addToast' prop which is not available on the 'system' object.
             return <LibraryView chatProps={timelineProps} guideProps={guideProps} onDirectCommand={onDirectCommand} />;
        case 'oracle':
             // FIX: Removed 'addToast' prop which is not available on the 'system' object.
             return <OracleView chatProps={timelineProps} guideProps={guideProps} onDirectCommand={onDirectCommand} />;
        case 'instructional':
            return <InstructionalCompositionView 
                        session={system.soBelowState.sessionData} 
                        onStop={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} 
                        favoriteCompositions={system.favoriteCompositions}
                        onToggleFavorite={system.toggleFavoriteComposition}
                    />;
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
        case 'bip39_decryptor':
            return <BIP39DecryptorView session={system.soBelowState.sessionData} onStop={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        case 'solve_protocol':
            return <SolveProtocolView session={system.activeSolveSession} onStop={system.endSolveSession} />;
        case 'forging_protocol':
            return <HokmahForgingProtocolView session={system.soBelowState.sessionData} onStop={() => system.dispatchSoBelow({ type: 'STOP_SESSION' })} />;
        case 'unraveling_protocol':
            return <BinahUnravelingView session={system.activeUnravelSession} onStop={system.endUnravelSession} />;
        case 'inversion_protocol':
            return <EinSofInversionView session={system.activeInversionSession} onStop={system.endInversionSession} />;
        default: // 'chat'
            const lastMessage = system.sessionHistory.length > 0 ? system.sessionHistory[system.sessionHistory.length - 1] : null;

            return (
                <div className="app-content-wrapper">
                     <TimelineView {...timelineProps} />
                     <CommandGuide {...guideProps} onCommandSelect={onCommandSelect} />
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
    // FIX: The `useUserInterface` hook does not accept any arguments.
    const ui = useUserInterface();
    
    // State for the main chat input and the sandboxed home input
    const [input, setInput] = useState('');
    const [homeInput, setHomeInput] = useState('');

    const handleCommandSelect = (command: string) => {
        const commandWithSpace = command.endsWith(' ') ? command : command + ' ';
        setInput(prev => prev ? `${prev} ${commandWithSpace}` : commandWithSpace);
    };
    
    const handleCallSignInplaceQuery = (callSignName: string) => {
        setInput(prev => `${prev} @${callSignName} `);
        ui.setIsCallSignMenuOpen(false); // Close menu after selection
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
            system.handleSendMessage(input);
            setInput('');
        }
    };

    const handleHomeSend = () => {
        if (homeInput.trim()) {
            system.handleHomeSendMessage(homeInput);
            setHomeInput('');
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
            {/* FIX: Correctly spread system and UI props and pass handlers to AstrianInterface. The component's prop types have been updated to accept these. */}
            <AstrianInterface
                {...system}
                {...ui}
                isSolveActive={isSolveActive}
                onDirectCommand={handleDirectCommand}
                handleScreenshot={system.handleScreenshot}
                handleCallSignInplaceQuery={handleCallSignInplaceQuery}
            >
                <CallSignContentView 
                    system={system} 
                    input={input} 
                    setInput={setInput} 
                    handleSend={handleSend}
                    homeInput={homeInput}
                    setHomeInput={setHomeInput}
                    handleHomeSend={handleHomeSend}
                    onCommandSelect={handleCommandSelect}
                    onDirectCommand={handleDirectCommand}
                />
            </AstrianInterface>

            {/* Da'at Ingestion Protocol Modal */}
            {system.isIngestionViewOpen && (
                <IngestionView 
                    onClose={system.handleCloseIngestView}
                    // FIX: Fix `onIngest` prop type mismatch for `IngestionView`. The `system.handleIngestData` function expects a third argument (`addMessageFunc`), but the `onIngest` prop is called with only two. This change wraps the call in a lambda function to provide the required `system.addMessage` function, ensuring ingestion messages are added to the main chat log.
                    onIngest={(metadata, data) => system.handleIngestData(metadata, data, system.addMessage)}
                />
            )}
        </>
    );
};

// =================================================================================================
// --- APP INITIALIZATION ---
// =================================================================================================

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);