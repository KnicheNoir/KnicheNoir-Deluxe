import React, { FC, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useAstrianSystem } from './hooks';
import { Toast } from './types';
import {
    ChatView,
    KaleidoscopicBackground,
    CrossReferenceModal, SubliminalGlyph, ToastContainer, SessionUnlockView, MeditationView, AyinGuide,
    StelaCalibrationView,
    InstructionalCompositionView,
    EntrainmentView,
    OracleTicker,
    EmergentCTA,
    GuidedTour,
} from './components';

// =================================================================================================
// --- MAIN APP COMPONENT ---
// =================================================================================================

const App: FC = () => {
    const {
        sessionHistory, isLoading, error, isModalOpen, crossRefValue,
        guidingIntent, resonanceSeed, isSynthesizing, synthesisResult,
        isPlannerUnlocked, toasts,
        aweData, setAweData, isAweComplete, palmistryDone, voiceDone,
        isSessionLocked, activeMeditation, visualChallenge,
        isCorporaInitialized, calibrationStatus, calibrationSubtext,
        activeInstructionalComposition,
        activeEntrainment,
        chakraTheme,
        isTourActive, tourStep, isListening, ayinVoiceEnabled,
        isFirstVisit,
        handleSendMessage, handleRetry, setIsModalOpen, setGuidingIntent, handleSynthesizeConnections, dismissToast,
        handleNumberInteract, addMessage, handleUnlockSession, stopMeditation, generateVisualChallenge,
        handleOpenIngestView, handleStartPalmistry, handleStartVoiceAnalysis, stopInstructionalComposition,
        stopEntrainment, handlePlannerCommand,
        startTour, endTour, setTourStep, speakText, startVoiceInput,
        toggleFavoriteComposition,
        handleDownloadArchive,
    } = useAstrianSystem();
    
    const [input, setInput] = useState('');

    const handleCommandSelect = (command: string) => {
        const commandWithSpace = command.endsWith(' ') ? command : command + ' ';
        setInput(prev => prev ? `${prev} ${commandWithSpace}` : commandWithSpace);
    };

    const handleSend = () => {
        if (input.trim()) {
            handleSendMessage(input);
            setInput('');
        }
    };


    const renderContent = () => {
        if (activeInstructionalComposition) {
            return <InstructionalCompositionView session={activeInstructionalComposition} onStop={stopInstructionalComposition} />;
        }
        if (activeEntrainment) {
            return <EntrainmentView session={activeEntrainment} onStop={stopEntrainment} />;
        }
        if (!isCorporaInitialized) {
            return <StelaCalibrationView statusText={calibrationStatus} subText={calibrationSubtext} />;
        }
        if (isSessionLocked) {
            return <SessionUnlockView 
                        onUnlock={handleUnlockSession} 
                        challenge={visualChallenge}
                        isLoading={isLoading}
                        onRegenerate={generateVisualChallenge}
                    />;
        }
        if (activeMeditation) {
            return <MeditationView script={activeMeditation.script} imagePrompts={activeMeditation.imagePrompts} onFinish={stopMeditation} />;
        }
        return (
            <>
                <main>
                   {/* FIX: Removed invalid and unused props from ChatView. */}
                   <ChatView
                       history={sessionHistory}
                       isLoading={isLoading}
                       error={error}
                       onRetry={handleRetry}
                       onNumberInteract={handleNumberInteract}
                       input={input}
                       onInputChange={setInput}
                       onSend={handleSend}
                       onSpeak={speakText}
                       isVoiceEnabled={ayinVoiceEnabled}
                       isListening={isListening}
                       onStartListening={startVoiceInput}
                       onToggleFavorite={toggleFavoriteComposition}
                   />
                </main>
                {isModalOpen && crossRefValue !== null && (
                    <CrossReferenceModal 
                        value={crossRefValue} 
                        history={sessionHistory} 
                        onClose={() => setIsModalOpen(false)}
                        onSynthesize={handleSynthesizeConnections}
                        isSynthesizing={isSynthesizing}
                        synthesisResult={synthesisResult}
                    />
                )}
                <SubliminalGlyph seed={resonanceSeed} />
            </>
        );
    };

    return (
        <div className="app-content-wrapper" data-chakra-theme={chakraTheme}>
            <KaleidoscopicBackground resonance={resonanceSeed} />
            <OracleTicker onSelect={handleCommandSelect} />
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            
            {isTourActive && (
                <GuidedTour
                    step={tourStep}
                    onNext={setTourStep}
                    onSkip={endTour}
                    speak={speakText}
                />
            )}

            {renderContent()}

            {isCorporaInitialized && !isSessionLocked && !activeMeditation && !activeInstructionalComposition && !activeEntrainment && (
                <>
                    <AyinGuide
                        onCommandSelect={handleCommandSelect}
                        onOpenIngest={handleOpenIngestView}
                        onStartPalmistry={handleStartPalmistry}
                        onStartVoiceAnalysis={handleStartVoiceAnalysis}
                        onGeneratePlanner={handlePlannerCommand}
                        isAweComplete={isAweComplete}
                        isPlannerUnlocked={isPlannerUnlocked}
                        onStartTour={startTour}
                        isFirstVisit={isFirstVisit}
                        onDownloadArchive={handleDownloadArchive}
                    />
                    <EmergentCTA onTrigger={handleSendMessage} />
                </>
            )}
        </div>
    );
};

// =================================================================================================
// --- APP INITIALIZATION ---
// =================================================================================================

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);