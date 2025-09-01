import React, { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useAstrianSystem, useUserInterface } from './hooks';
import {
    ChatView, KaleidoscopicBackground, SubliminalGlyph, SessionUnlockView, MeditationView, 
    AyinGuide, StelaCalibrationView, InstructionalCompositionView, EntrainmentView, EmergentCTA,
    AstrianInterface,
    BootAnimationView
} from './components';

// =================================================================================================
// --- MAIN APP COMPONENT ---
// =================================================================================================

const App: FC = () => {
    // Core application state and business logic
    const system = useAstrianSystem();
    
    // UI presentation state and interaction logic
    const ui = useUserInterface(system.addMessage, system.activeSolveSession.isActive, system.isCorporaInitialized);
    
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
            // unless they are initiating a new solve session.
            if (ui.viewMode === 'globe' && !input.toLowerCase().trim().startsWith('°solve')) {
                ui.setViewMode('callSign');
            }
            system.handleSendMessage(input);
            setInput('');
        }
    };
    
    // This function encapsulates all the content rendered within the "So Below" view.
    // It remains here as it's a direct consumer of the `system` state.
    const renderCallSignContent = () => {
        if (system.activeInstructionalComposition) {
            return <InstructionalCompositionView session={system.activeInstructionalComposition} onStop={system.stopInstructionalComposition} />;
        }
        if (system.activeEntrainment) {
            return <EntrainmentView session={system.activeEntrainment} onStop={system.stopEntrainment} />;
        }
        if (system.isSessionLocked) {
            return <SessionUnlockView onUnlock={system.handleUnlockSession} challenge={system.visualChallenge} isLoading={system.isLoading} onRegenerate={system.generateVisualChallenge} />;
        }
        if (system.activeMeditation) {
            return <MeditationView script={system.activeMeditation.script} imagePrompts={system.activeMeditation.imagePrompts} onFinish={system.stopMeditation} />;
        }
        
        const lastMessage = system.sessionHistory.length > 0 ? system.sessionHistory[system.sessionHistory.length - 1] : null;

        return (
            <div className="app-content-wrapper">
                 <ChatView
                    history={system.sessionHistory}
                    isLoading={system.isLoading}
                    error={system.error}
                    onRetry={system.handleRetry}
                    onNumberInteract={system.handleNumberInteract}
                    input={input}
                    onInputChange={setInput}
                    onSend={handleSend}
                    onSpeak={system.speakText}
                    isVoiceEnabled={system.ayinVoiceEnabled}
                    isListening={system.isListening}
                    onStartListening={system.startVoiceInput}
                    onToggleFavorite={system.toggleFavoriteComposition}
                    bookmarks={system.bookmarks}
                    onToggleBookmark={system.toggleBookmark}
                 />
                 <AyinGuide
                    onCommandSelect={handleCommandSelect}
                    onOpenIngest={system.handleOpenIngestView}
                    onStartPalmistry={system.handleStartPalmistry}
                    /* FIX: Corrected a typo in the prop name. The hook provides 'handleStartVoiceAnalysis', not 'startVoiceAnalysis'. */
                    onStartVoiceAnalysis={system.handleStartVoiceAnalysis}
                    onGeneratePlanner={system.handlePlannerCommand}
                    isAweComplete={system.isAweComplete}
                    isPlannerUnlocked={system.isPlannerUnlocked}
                    onStartTour={system.startTour}
                    isFirstVisit={system.isFirstVisit}
                    onDownloadArchive={system.handleDownloadArchive}
                 />
                 <EmergentCTA onTrigger={system.handleSendMessage} lastMessage={lastMessage} />
                 <SubliminalGlyph seed={system.resonanceSeed} />
            </div>
        );
    };

    // The new boot animation screen takes over until initialization is complete
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

    // The App component now has a much cleaner return statement. It provides the foundational
    // background and then delegates all complex UI rendering to the AstrianInterface component,
    // passing in the state and handlers from both the system and UI hooks.
    return (
        <>
            <KaleidoscopicBackground resonance={system.resonanceSeed} />
            <AstrianInterface
                {...system}
                {...ui}
                isSolveActive={isSolveActive}
                onCommandSelect={handleCommandSelect}
                onDirectCommand={handleDirectCommand}
            >
                {renderCallSignContent()}
            </AstrianInterface>
        </>
    );
};

// =================================================================================================
// --- APP INITIALIZATION ---
// =================================================================================================

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);