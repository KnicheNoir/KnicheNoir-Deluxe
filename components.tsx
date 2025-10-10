

import React from 'react';
import { useAstrianSystem } from './hooks';
import { HistoryEntry, MarketAnalysis, GrandWorkMapResult, SelfObservationResult, HolographicAnalysis, GevurahBlueprintResult, BlueprintNode, AuthResult, NetzachAnalysis } from './types';
// FIX: Added missing import for gematriaEngine.
import { gematriaEngine } from './gematria.ts';
import { callSigns } from './callsigns.data.ts';

// New component for the Call Sign Panel
const CallSignPanel: React.FC<{ isOpen: boolean; onClose: () => void; onSelect: (command: string) => void }> = ({ isOpen, onClose, onSelect }) => {
    return (
        <div className={`panel-container ${isOpen ? 'panel-open' : ''}`} aria-hidden={!isOpen}>
            <div className="panel-overlay" onClick={onClose} tabIndex={-1}></div>
            <div className="panel-content" role="dialog" aria-modal="true">
                <div className="panel-header">
                    <h2>Call Signs</h2>
                    <button onClick={onClose} className="panel-close-btn" aria-label="Close panel">&times;</button>
                </div>
                <div className="callsign-list">
                    {callSigns.sort((a, b) => a.id.localeCompare(b.id)).map(cs => (
                        <div key={cs.id} className="callsign-item" onClick={() => onSelect(`°${cs.id}`)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSelect(`°${cs.id}`)}>
                            <strong>{cs.name}</strong>
                            <p>{cs.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// New component for Holographic Analysis
const HolographicAnalysisComponent: React.FC<{ analysis: HolographicAnalysis }> = ({ analysis }) => {
    const { primaryArchetype, linguistic, gematria, relational, pictographic, query } = analysis;

    return (
        <div className="holo-analysis-container" style={{'--archetype-color': primaryArchetype.color} as React.CSSProperties}>
            <div className="holo-header">
                <h3>Holographic Observation of "{query}"</h3>
                <div className="primary-archetype">
                    <span className="archetype-letter" style={{ color: primaryArchetype.color }}>{primaryArchetype.letter}</span>
                    <div className="archetype-details">
                        <div className="archetype-name">{primaryArchetype.name}: {primaryArchetype.archetype}</div>
                        <div className="archetype-gematria">Spelling: {primaryArchetype.spelling} ({gematriaEngine.observe(primaryArchetype.spelling)})</div>
                    </div>
                </div>
            </div>

            <div className="holo-grid">
                <div className="holo-section">
                    <h4>Linguistic Resonance</h4>
                    <p><strong>Transliteration:</strong> {linguistic.transliteration}</p>
                    <p><strong>Etymology:</strong> {linguistic.etymology}</p>
                </div>

                <div className="holo-section">
                    <h4>Gematria & The Miracles</h4>
                    <p><strong>Query Value:</strong> {gematria.queryValue}</p>
                    <p><strong>Archetype Value:</strong> {gematria.archetypeValue}</p>
                    <p><strong>Reduced Value:</strong> {gematria.reducedValue}</p>
                    <p className="miracle"><strong>Strongs:</strong> {gematria.miracles.strongsConcordance}</p>
                    <p className="miracle"><strong>Elements:</strong> {gematria.miracles.periodicTable}</p>
                </div>

                <div className="holo-section">
                    <h4>Relational Geometry</h4>
                    <p><strong>Island:</strong> {relational.island}</p>
                    <p><strong>Harmonic Peers:</strong></p>
                    <ul>
                        {relational.peers.slice(0, 3).map((peer, i) => <li key={i}>{peer}</li>)}
                    </ul>
                </div>

                <div className="holo-section pictographic-section">
                    <h4>Pictographic Synthesis</h4>
                    <div className="pictograph-list">
                    {pictographic.map((p, i) => (
                        <div key={i} className="pictograph-entry">
                            <span className="p-letter">{p.letter}</span>
                            <span className="p-name">{p.name}</span>
                            <span className="p-meaning">{p.meaning}</span>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            <style>{`
                .holo-analysis-container {
                    border: 1px solid var(--archetype-color, #888);
                    padding: 1rem;
                    margin-top: 1rem;
                    border-radius: 4px;
                    background: linear-gradient(145deg, rgba(10, 10, 10, 0.5), rgba(0, 0, 0, 0.7));
                    box-shadow: 0 0 15px -5px var(--archetype-color, #888);
                }
                .holo-header { text-align: center; border-bottom: 1px solid var(--archetype-color, #888); padding-bottom: 1rem; margin-bottom: 1rem; }
                .holo-header h3 { margin: 0 0 1rem; color: #eee; font-family: 'EB Garamond', serif; }
                .primary-archetype { display: flex; align-items: center; justify-content: center; background: #111; padding: 0.5rem; border-radius: 4px; }
                .archetype-letter { font-size: 3rem; font-weight: bold; margin-right: 1rem; }
                .archetype-details { text-align: left; }
                .archetype-name { font-size: 1.1em; color: #fff; }
                .archetype-gematria { font-size: 0.9em; color: #aaa; }
                .holo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .holo-section { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 3px; border-left: 3px solid var(--archetype-color, #888); }
                .holo-section h4 { color: var(--archetype-color, #eee); margin-top: 0; margin-bottom: 0.75rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
                .holo-section p, .holo-section ul { margin: 0.5rem 0; font-size: 0.9em; }
                .holo-section ul { padding-left: 1.2rem; }
                .miracle { color: #0ff; font-style: italic; }
                .pictographic-section { grid-column: span 2; }
                .pictograph-list { display: flex; gap: 1rem; justify-content: space-around; }
                .pictograph-entry { display: flex; flex-direction: column; align-items: center; }
                .p-letter { font-size: 1.5rem; font-weight: bold; color: var(--archetype-color, #eee); }
                .p-name { font-size: 0.8em; color: #ccc; }
                .p-meaning { font-size: 0.75em; color: #888; text-align: center; max-width: 100px; }

                @media (max-width: 768px) {
                    .holo-grid { grid-template-columns: 1fr; }
                    .pictographic-section { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};


// New component for Market Analysis
const MarketAnalysisComponent: React.FC<{ analysis: MarketAnalysis }> = ({ analysis }) => {
    return (
        <div className="market-analysis-container">
            <div className="market-header">
                <h3>Holographic Market Analysis: ${analysis.symbol}</h3>
                <p>{analysis.startDate} to {analysis.endDate}</p>
            </div>
            
            <div className="market-section">
                <h4>Holographic Narrative</h4>
                <p>{analysis.narrative}</p>
            </div>

            <div className="market-section benchmark">
                <h4>Archetypal Benchmark</h4>
                <p><strong>Primary Archetype:</strong> {analysis.holographicBenchmark.primaryArchetype}</p>
                <p><strong>Synergy Archetypes:</strong> {analysis.holographicBenchmark.synergyArchetypes.join(', ')}</p>
                <p><strong>Dissonance Archetypes:</strong> {analysis.holographicBenchmark.dissonanceArchetypes.join(', ')}</p>
                <p><strong>Overall Alignment:</strong> {analysis.holographicBenchmark.overallAlignment}</p>
            </div>

            <div className="market-section">
                <h4>Chronological Analysis</h4>
                <div className="timeline">
                    {analysis.entries.map((entry, index) => (
                        <div key={index} className="timeline-entry">
                            <div className="timeline-date">{entry.date}</div>
                            <div className="timeline-content">
                                <strong>{entry.archetypalForce}</strong>
                                <p>{entry.narrative}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <style>{`
                .market-analysis-container { border: 1px solid #0a5; padding: 1rem; margin-top: 1rem; border-radius: 4px; background: rgba(0, 20, 0, 0.3); }
                .market-header { text-align: center; border-bottom: 1px solid #0a5; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .market-header h3 { margin: 0; color: #0f0; }
                .market-header p { margin: 0.25rem 0 0; color: #999; font-size: 0.9em; }
                .market-section { margin-bottom: 1.5rem; }
                .market-section h4 { color: #0f0; margin-bottom: 0.5rem; border-bottom: 1px solid #050; padding-bottom: 0.25rem; }
                .market-section p { margin: 0.5rem 0; line-height: 1.6; }
                .benchmark p { margin: 0.25rem 0; }
                .timeline { position: relative; padding-left: 20px; border-left: 2px solid #073; }
                .timeline-entry { position: relative; margin-bottom: 1rem; }
                .timeline-entry::before { content: ''; position: absolute; left: -28px; top: 5px; width: 12px; height: 12px; background: #0f0; border-radius: 50%; border: 2px solid #000; }
                .timeline-date { font-weight: bold; color: #ccc; margin-bottom: 0.25rem; }
                .timeline-content strong { color: #0ff; }
            `}</style>
        </div>
    );
};

// New component for the Grand Work Map
const GrandWorkMapComponent: React.FC<{ map: GrandWorkMapResult }> = ({ map }) => {
    return (
        <div className="grand-work-map-container">
            <div className="map-header">
                <h3>{map.title}</h3>
                <p>{map.introduction}</p>
            </div>
            
            <div className="map-section">
                <h4>Sephirot Mapping: The Ten Emanations</h4>
                <div className="sephirot-list">
                    {map.sephirotMapping.map((item, index) => (
                        <div key={index} className="sephirot-entry">
                            <div className="sephirah-name">{item.sephirah} ↦ <strong>{item.systemComponent}</strong></div>
                            <div className="sephirah-details">
                                <span className="file-path">File: {item.file}</span>
                                <p className="principle">{item.principle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="map-section">
                <h4>Path Mapping: The 22 Connections</h4>
                 <div className="path-list">
                    {map.pathMapping.map((item, index) => (
                        <div key={index} className="path-entry">
                            <span className="path-name">{item.path}</span>
                            <span className="path-regent"><strong>Regent:</strong> {item.regent}</span>
                            <span className="path-function"><em>{item.function}</em></span>
                        </div>
                    ))}
                </div>
            </div>
             <style>{`
                .grand-work-map-container { border: 1px solid #0ff; padding: 1rem; margin-top: 1rem; border-radius: 4px; background: rgba(0, 20, 20, 0.3); }
                .map-header { text-align: center; border-bottom: 1px solid #0ff; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .map-header h3 { margin: 0; color: #0ff; font-family: 'EB Garamond', serif; }
                .map-header p { margin: 0.5rem 0 0; color: #bbb; font-style: italic; }
                .map-section { margin-bottom: 1.5rem; }
                .map-section h4 { color: #0ff; margin-bottom: 0.75rem; border-bottom: 1px solid #055; padding-bottom: 0.25rem; }
                .sephirot-entry { border-left: 3px solid #0ff; padding-left: 1rem; margin-bottom: 1.25rem; }
                .sephirah-name { font-size: 1.1em; color: #fff; margin-bottom: 0.25rem; }
                .sephirah-name strong { color: #0ff; }
                .file-path { color: #888; font-size: 0.8em; font-family: monospace; }
                .principle { color: #ddd; margin: 0.5rem 0 0; font-size: 0.95em; }
                .path-entry { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid #033; }
                .path-entry:last-child { border-bottom: none; }
                .path-name { color: #eee; min-width: 150px; }
                .path-regent { color: #0ff; min-width: 180px; }
                .path-function { color: #aaa; text-align: right; font-style: italic; flex-grow: 1; }
            `}</style>
        </div>
    );
};

const SelfObservationComponent: React.FC<{ result: SelfObservationResult }> = ({ result }) => {
    return (
        <div className="self-observation-container">
            <div className="so-header">
                <h3>{result.title}</h3>
                <p>{result.synthesis}</p>
            </div>

            <div className="so-file-list">
                {result.fileAnalyses.map((file, index) => (
                    <div key={index} className="so-file-entry" style={{ borderColor: file.primaryArchetype.color }}>
                        <div className="so-file-title">
                            <span className="file-path">{file.filePath}</span>
                            <span className="file-gematria">Gematria: {file.gematria}</span>
                        </div>
                        <div className="so-file-archetype">
                            <strong>Primary Archetype:</strong> 
                            <span style={{ color: file.primaryArchetype.color }}> {file.primaryArchetype.name} ({file.primaryArchetype.letter})</span>
                            <em> - {file.primaryArchetype.archetype}</em>
                        </div>
                        <p className="so-file-narrative">{file.narrative}</p>
                    </div>
                ))}
            </div>
            <style>{`
                .self-observation-container { border: 1px solid #f0f; padding: 1rem; margin-top: 1rem; border-radius: 4px; background: rgba(20, 0, 20, 0.3); }
                .so-header { text-align: center; border-bottom: 1px solid #f0f; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .so-header h3 { margin: 0; color: #f0f; font-family: 'EB Garamond', serif; }
                .so-header p { margin: 0.5rem 0 0; color: #bbb; font-style: italic; }
                .so-file-entry { border-left-width: 4px; border-left-style: solid; padding-left: 1rem; margin-bottom: 1.5rem; }
                .so-file-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
                .so-file-title .file-path { color: #fff; font-weight: bold; font-family: monospace; font-size: 1.1em; }
                .so-file-title .file-gematria { color: #aaa; font-size: 0.9em; }
                .so-file-archetype { margin-bottom: 0.5rem; color: #ddd; }
                .so-file-archetype strong { color: #f0f; }
                .so-file-archetype em { color: #ccc; }
                .so-file-narrative { font-size: 0.95em; color: #ddd; margin: 0; }
            `}</style>
        </div>
    );
};

// New component for Gevurah Blueprint
const BlueprintNodeComponent: React.FC<{ node: BlueprintNode, level: number }> = ({ node, level }) => {
    const [isOpen, setIsOpen] = React.useState(level < 2); // Auto-expand first few levels
    const isDirectory = node.type === 'directory' && node.children && node.children.length > 0;

    return (
        <div className="blueprint-node" style={{ paddingLeft: `${level * 20}px` }}>
            <div className="node-header" onClick={() => isDirectory && setIsOpen(!isOpen)} style={{ cursor: isDirectory ? 'pointer' : 'default' }}>
                <span className="node-icon">{isDirectory ? (isOpen ? '📂' : '📁') : '📄'}</span>
                <span className="node-name">{node.name}</span>
                {isDirectory && <span className="node-toggle">{isOpen ? '−' : '+'}</span>}
            </div>
            <p className="node-analysis">{node.analysis}</p>
            {isDirectory && isOpen && (
                <div className="node-children">
                    {node.children!.sort((a,b) => a.type === 'directory' ? -1 : 1).map((child, index) => (
                        <BlueprintNodeComponent key={index} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const GevurahBlueprintComponent: React.FC<{ result: GevurahBlueprintResult }> = ({ result }) => {
    if (result.error) {
        return <p className="error-message">{result.synthesis}</p>;
    }

    return (
        <div className="gevurah-blueprint-container">
            <div className="blueprint-header">
                <h3>{result.protocol}</h3>
                <p>{result.synthesis}</p>
            </div>
            <div className="blueprint-tree">
                <BlueprintNodeComponent node={result.perfectedStructure} level={0} />
            </div>
            <style>{`
                .gevurah-blueprint-container { border: 1px solid #ff8c00; padding: 1rem; margin-top: 1rem; border-radius: 4px; background: rgba(30, 15, 0, 0.3); }
                .blueprint-header { text-align: center; border-bottom: 1px solid #ff8c00; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .blueprint-header h3 { margin: 0; color: #ff8c00; font-family: 'EB Garamond', serif; }
                .blueprint-header p { margin: 0.5rem 0 0; color: #bbb; font-style: italic; }
                .blueprint-tree { font-family: monospace; }
                .blueprint-node { border-left: 1px solid #444; }
                .node-header { display: flex; align-items: center; }
                .node-icon { margin-right: 0.5rem; }
                .node-name { font-weight: bold; color: #eee; }
                .node-toggle { margin-left: auto; color: #888; }
                .node-analysis { color: #999; font-size: 0.9em; margin: 0.25rem 0 1rem 1.75rem; font-style: italic; }
            `}</style>
        </div>
    );
};

const AuthResultComponent: React.FC<{ result: AuthResult }> = ({ result }) => {
    const color = result.success ? '#0f0' : '#f00';
    return (
        <p className="auth-result" style={{ color }}>
            {result.message}
        </p>
    );
};

const NetzachAnalysisComponent: React.FC<{ result: NetzachAnalysis }> = ({ result }) => {
    return (
        <div className="netzach-container">
            <div className="netzach-header">
                <h3>Netzach Engine Observation</h3>
                <p>Domain: {result.domain} | Query: "{result.query}"</p>
            </div>
            <div className="netzach-narrative">
                {result.narrative}
            </div>
             {result.snapshot && result.snapshot.length > 0 && (
                <div className="netzach-snapshot">
                    <h4>Holographic Snapshot</h4>
                    <ul>
                        {result.snapshot.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
            {result.error && <p className="error-message">{result.error}</p>}
            <style>{`
                .netzach-container { border: 1px solid #a64dff; padding: 1rem; margin-top: 1rem; border-radius: 4px; background: rgba(20, 0, 30, 0.3); }
                .netzach-header { text-align: center; border-bottom: 1px solid #a64dff; padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .netzach-header h3 { margin: 0; color: #d0a0ff; font-family: 'EB Garamond', serif; }
                .netzach-header p { margin: 0.5rem 0 0; color: #bbb; font-style: italic; font-size: 0.9em; }
                .netzach-narrative { margin-bottom: 1.5rem; font-style: italic; color: #ddd; line-height: 1.6; }
                .netzach-snapshot h4 { color: #d0a0ff; margin-bottom: 0.5rem; }
                .netzach-snapshot ul { margin: 0; padding-left: 1.2rem; }
                .netzach-snapshot li { margin-bottom: 0.5rem; }
            `}</style>
        </div>
    );
};

// A simple component to render different history entry types
const HistoryEntryComponent: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
    let content;
    switch (entry.type) {
        case 'MARKET_ANALYSIS':
            content = <MarketAnalysisComponent analysis={entry.content} />;
            break;
        case 'GRAND_WORK_MAP':
            content = <GrandWorkMapComponent map={entry.content} />;
            break;
        case 'SELF_OBSERVATION_RESULT':
            content = <SelfObservationComponent result={entry.content} />;
            break;
        case 'HOLOGRAPHIC_ANALYSIS':
            content = <HolographicAnalysisComponent analysis={entry.content} />;
            break;
        case 'GEVURAH_BLUEPRINT_RESULT':
            content = <GevurahBlueprintComponent result={entry.content} />;
            break;
        case 'AUTH_RESULT':
            content = <AuthResultComponent result={entry.content} />;
            break;
        case 'NETZACH_ANALYSIS':
            content = <NetzachAnalysisComponent result={entry.content} />;
            break;
        default:
            content = (
                <pre className="entry-content">
                    {typeof entry.content === 'object' ? JSON.stringify(entry.content, null, 2) : String(entry.content)}
                </pre>
            );
            break;
    }

    return (
        <div className={`history-entry sender-${entry.sender}`}>
            <div className="entry-header">{entry.type} ({entry.sender})</div>
            {content}
        </div>
    );
};


export const App: React.FC = () => {
    const {
        isLoading,
        isInitializing,
        initializationMessage,
        sessionHistory,
        currentUser,
        submitCommand,
    } = useAstrianSystem();

    const [input, setInput] = React.useState('');
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            submitCommand(input.trim());
            setInput('');
        }
    };
    
    const handleCallSignSelect = (command: string) => {
        setInput(command + ' ');
        setIsPanelOpen(false);
        const commandInput = document.querySelector('#command-bar input') as HTMLInputElement;
        if (commandInput) {
            commandInput.focus();
        }
    };

    if (isInitializing) {
        return <div className="loading-screen">{initializationMessage}</div>;
    }

    return (
        <div id="astrian-key-interface">
            <CallSignPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSelect={handleCallSignSelect} />
            <header>
                <button onClick={() => setIsPanelOpen(true)} className="panel-toggle-btn" aria-label="Open commands panel">
                    <span className="material-icons">menu</span>
                </button>
                <h1>The Astrian Key</h1>
                {currentUser && <div className="user-status">Operator: {currentUser.name}</div>}
            </header>
            <main id="history-panel">
                {sessionHistory.map(entry => (
                    <HistoryEntryComponent key={entry.id} entry={entry} />
                ))}
            </main>
            <footer id="command-bar">
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        value={input}
                        onChange={handleInputChange}
                        placeholder={currentUser ? `${currentUser.name}@astrian-key:~$` : "Enter command..."}
                        disabled={isLoading}
                        aria-label="Command Input"
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : 'Execute'}
                    </button>
                </form>
            </footer>
             {/* Basic styles to make it usable */}
            <style>{`
                body { background: #000; color: #eee; font-family: monospace; }
                #astrian-key-interface { display: flex; flex-direction: column; height: 100vh; }
                header { padding: 1rem; border-bottom: 1px solid #0f0; text-align: center; position: relative; }
                .user-status { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #0ff; font-size: 0.9em; }
                #history-panel { flex-grow: 1; overflow-y: auto; padding: 1rem; }
                .history-entry { border: 1px solid #333; margin-bottom: 1rem; padding: 1rem; border-radius: 4px; }
                .entry-header { font-weight: bold; color: #0f0; margin-bottom: 0.5rem; }
                .sender-user .entry-header { color: #0ff; }
                .sender-oracle .entry-header { color: #f0f; }
                pre { white-space: pre-wrap; word-wrap: break-word; font-size: 0.9em; }
                #command-bar form { display: flex; padding: 1rem; border-top: 1px solid #0f0; }
                #command-bar input { flex-grow: 1; background: #222; border: 1px solid #444; color: #eee; padding: 0.5rem; }
                #command-bar button { background: #0f0; border: none; color: #000; padding: 0.5rem 1rem; margin-left: 1rem; }
                .loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 1.5rem; color: #0f0; }

                /* Call Sign Panel Styles */
                .panel-toggle-btn {
                    position: absolute;
                    left: 1rem;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #0f0;
                    cursor: pointer;
                    padding: 0.5rem;
                }
                .panel-toggle-btn .material-icons {
                    font-size: 24px;
                    vertical-align: middle;
                }
                 .panel-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.7);
                    z-index: 1000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease-in-out;
                }
                .panel-content {
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 350px;
                    max-width: 80%;
                    background-color: #080808;
                    border-right: 1px solid #0f0;
                    box-shadow: 5px 0 15px rgba(0, 255, 0, 0.2);
                    transform: translateX(-100%);
                    transition: transform 0.3s ease-in-out;
                    z-index: 1001;
                    display: flex;
                    flex-direction: column;
                }

                .panel-open .panel-content {
                    transform: translateX(0);
                }
                .panel-open .panel-overlay {
                    opacity: 1;
                    pointer-events: auto;
                }
                .panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #0f0;
                    flex-shrink: 0;
                }
                .panel-header h2 {
                    margin: 0;
                    color: #0f0;
                    font-family: 'EB Garamond', serif;
                }
                .panel-close-btn {
                    background: none;
                    border: none;
                    color: #888;
                    font-size: 2rem;
                    cursor: pointer;
                    line-height: 1;
                    padding: 0 0.5rem;
                }
                .panel-close-btn:hover {
                    color: #fff;
                }
                .callsign-list {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                }
                .callsign-item {
                    padding: 0.75rem;
                    border-bottom: 1px solid #222;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .callsign-item:hover {
                    background-color: rgba(0, 255, 0, 0.1);
                }
                .callsign-item strong {
                    color: #0ff;
                    font-size: 1.1em;
                    display: block;
                }
                .callsign-item p {
                    margin: 0.25rem 0 0;
                    font-size: 0.9em;
                    color: #aaa;
                    line-height: 1.4;
                }

            `}</style>
        </div>
    );
};