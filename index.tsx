import React, { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useAstrianSystem } from './hooks';
import { AstrianInterface } from './components';

// =================================================================================================
// --- PRIMARY APPLICATION ROOT ---
// This component is now extremely lean, delegating all complexity to the unified system hooks
// and the main interface component, embodying the ECHAD architectural principle.
// =================================================================================================

const App: FC = () => {
    // Input state is managed at the top level and passed down.
    const [input, setInput] = useState('');
    const [homeInput, setHomeInput] = useState('');
    
    // The system hook represents the entire application's state and logic (the "Brain").
    const system = useAstrianSystem();

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

    // The main interface is the primary "Hand," receiving the entirety of the system state.
    return (
        <AstrianInterface
            system={system}
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            homeInput={homeInput}
            setHomeInput={setHomeInput}
            handleHomeSend={handleHomeSend}
        />
    );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
