import React from 'react';
import { useAstrianSystem } from '../system/hooks.ts';
import { HistoryEntry, GrandWorkMapResult, SelfObservationResult, HolographicAnalysis, GevurahBlueprintResult, BlueprintNode, AuthResult, NetzachAnalysis, ProphecyResult, ApiCategory } from '../types.ts';
import { gematriaEngine } from '../core/gematria.ts';
import { callSigns } from '../canon/callsigns.data.ts';
import { codex } from '../core/codex.ts';
import { glyphCalligrapherProject } from '../canon/golem.data.ts';
import { musicEngine } from '../core/audio.ts';
import { songbook } from '../canon/songs.data.ts';
import { livingLibrary } from '../core/living-library.ts';
import { UNIVERSAL_CODEX_RAW } from '../canon/universal_codex.data.ts';
import { API_CODEX_DATA } from '../canon/api.data.ts';
import hljs from 'highlight.js';

// #region --- Special Interface Components ---

const ApiCodexInterface: React.FC<{ setActiveView: (view: string) => void; }> = ({ setActiveView }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeCategory, setActiveCategory] = React.useState<string | null>(API_CODEX_DATA[0]?.category || null);

    const filteredCategories = React.useMemo(() => {
        if (!searchTerm) return API_CODEX_DATA;
        const lowerSearch = searchTerm.toLowerCase();
        return API_CODEX_DATA
            .map(cat => {
                const filteredEntries = cat.entries.filter(entry =>
                    entry.name.toLowerCase().includes(lowerSearch) ||
                    entry.description.toLowerCase().includes(lowerSearch)
                );
                return { ...cat, entries: filteredEntries };
            })
            .filter(cat => cat.entries.length > 0);
    }, [searchTerm]);

    const displayedCategory = filteredCategories.find(c => c.category === activeCategory) || filteredCategories[0];

    return (
        <div className="special-interface-container api-codex-container">
            <div className="si-header">
                <h2>The API Codex</h2>
                <button onClick={() => setActiveView('chat')}>Return to Command</button>
            </div>
            <div className="si-content api-codex-layout">
                <nav className="api-codex-sidebar">
                    <input
                        type="search"
                        placeholder="Search APIs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="api-codex-search"
                    />
                    <ul>
                        {filteredCategories.map(cat => (
                            <li
                                key={cat.category}
                                className={cat.category === activeCategory ? 'active' : ''}
                                onClick={() => setActiveCategory(cat.category)}
                            >
                                {cat.category} ({cat.entries.length})
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className="api-codex-main">
                    {displayedCategory ? (
                        <>
                            <h3>{displayedCategory.category}</h3>
                            <div className="api-table-wrapper">
                                <table className="api-table">
                                    <thead>
                                        <tr>
                                            <th>Name / Link</th>
                                            <th>Description</th>
                                            <th>Auth</th>
                                            <th>HTTPS</th>
                                            <th>CORS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {displayedCategory.entries.map(entry => (
                                            <tr key={entry.name}>
                                                <td><a href={entry.link} target="_blank" rel="noopener noreferrer">{entry.name}</a></td>
                                                <td>{entry.description}</td>
                                                <td>{entry.auth}</td>
                                                <td className={entry.https ? 'https-yes' : 'https-no'}>{entry.https ? 'Yes' : 'No'}</td>
                                                <td className={`cors-${entry.cors.toLowerCase()}`}>{entry.cors}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <p>No results found for "{searchTerm}".</p>
                    )}
                </main>
            </div>
            <style>{`
                .api-codex-container .si-content { padding: 0; }
                .api-codex-layout { display: flex; height: 100%; }
                .api-codex-sidebar { flex: 0 0 250px; background: #080808; border-right: 1px solid #333; overflow-y: auto; display: flex; flex-direction: column; }
                .api-codex-search { background: #111; border: 1px solid #333; color: #fff; padding: 0.75rem; font-family: var(--font-primary); width: calc(100% - 1.5rem); margin: 0; }
                .api-codex-sidebar ul { list-style: none; padding: 0; margin: 0; }
                .api-codex-sidebar li { padding: 0.75rem 1rem; cursor: pointer; border-bottom: 1px solid #222; font-size: 0.9em; }
                .api-codex-sidebar li:hover { background: #1a1a1a; }
                .api-codex-sidebar li.active { background: var(--accent-color); color: #000; font-weight: bold; }
                .api-codex-main { flex-grow: 1; padding: 1rem; overflow-y: auto; }
                .api-codex-main h3 { color: var(--accent-color); margin-top: 0; border-bottom: 1px solid var(--accent-color); padding-bottom: 0.5rem; }
                .api-table-wrapper { overflow-x: auto; }
                .api-table { width: 100%; border-collapse: collapse; font-size: 0.9em; }
                .api-table th, .api-table td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #222; }
                .api-table th { color: #aaa; }
                .api-table a { color: var(--accent-color-oracle); text-decoration: none; }
                .api-table a:hover { text-decoration: underline; }
                .https-yes, .cors-yes { color: #0f0; }
                .https-no, .cors-no { color: #f00; }
                .cors-unknown { color: #888; }
            `}</style>
        </div>
    );
};


const GlobeView: React.FC<{ submitCommand: (cmd: string) => void; setActiveView: (view: string) => void; }> = ({ submitCommand, setActiveView }) => {
    const nodes = React.useMemo(() => UNIVERSAL_CODEX_RAW.map(entry => ({ id: entry.id, title: entry.title, x: Math.random() * 800, y: Math.random() * 500, vx: 0, vy: 0 })), []);

    const handleNodeClick = (id: string) => {
        submitCommand(`°observe ${id}`);
        setActiveView('chat');
    };

    return (
        <div className="special-interface-container">
            <div className="si-header">
                <h2>Universal Codex Globe</h2>
                <button onClick={() => setActiveView('chat')}>Return to Command</button>
            </div>
            <div className="si-content">
                <p style={{textAlign: 'center', fontStyle: 'italic', color: '#888'}}>A visual representation of the known conceptual universe. Click a node to observe it.</p>
                <svg width="100%" height="500" style={{ border: '1px solid #0f0', background: 'rgba(0, 20, 0, 0.2)' }}>
                    {nodes.map(node => (
                        <g key={node.id} transform={`translate(${node.x}, ${node.y})`} onClick={() => handleNodeClick(node.id)} style={{ cursor: 'pointer' }}>
                            <circle r="5" fill="#0f0" />
                            <text x="8" y="4" fill="#ccc" fontSize="10">{node.title}</text>
                        </g>
                    ))}
                </svg>
            </div>
             <style>{`
                .special-interface-container { display: flex; flex-direction: column; height: 100%; }
                .si-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid var(--accent-color); }
                .si-header h2 { color: var(--accent-color); margin: 0; font-family: 'EB Garamond', serif; }
                .si-content { flex-grow: 1; overflow-y: auto; padding: 1rem 0; }
                .si-content svg g:hover circle { r: 7; fill: #0ff; }
                .si-content svg g:hover text { fill: #0ff; font-weight: bold; }
            `}</style>
        </div>
    );
};

const GolemInterface: React.FC<{ setActiveView: (view: string) => void; }> = ({ setActiveView }) => {
    const [activeTarget, setActiveTarget] = React.useState(glyphCalligrapherProject.targets[0]);
    const [activeFile, setActiveFile] = React.useState(activeTarget.files[0]);

    const highlightedCode = React.useMemo(() => {
        return hljs.highlight(activeFile.content, { language: activeTarget.language.split(' ')[0].toLowerCase() }).value;
    }, [activeFile, activeTarget]);

    return (
         <div className="special-interface-container golem-interface">
            <div className="si-header">
                <h2>The Golem Interface: {glyphCalligrapherProject.name}</h2>
                <button onClick={() => setActiveView('chat')}>Return to Command</button>
            </div>
            <div className="si-content">
                 <p>{glyphCalligrapherProject.description}</p>
                 <div className="golem-layout">
                    <div className="golem-sidebar">
                        <h4>Platforms</h4>
                        {glyphCalligrapherProject.targets.map(target => (
                            <div key={target.platform} className={`golem-tab ${target.platform === activeTarget.platform ? 'active' : ''}`} onClick={() => { setActiveTarget(target); setActiveFile(target.files[0]); }}>
                                {target.icon} {target.platform}
                            </div>
                        ))}
                    </div>
                    <div className="golem-main">
                        <div className="golem-file-tabs">
                            {activeTarget.files.map(file => (
                                <span key={file.path} className={file.path === activeFile.path ? 'active' : ''} onClick={() => setActiveFile(file)}>
                                    {file.path.split('/').pop()}
                                </span>
                            ))}
                        </div>
                        <pre className="golem-code"><code dangerouslySetInnerHTML={{ __html: highlightedCode }} /></pre>
                    </div>
                 </div>
            </div>
             <style>{`
                .golem-layout { display: flex; gap: 1rem; height: calc(100% - 40px); }
                .golem-sidebar { flex-basis: 200px; border-right: 1px solid #333; padding-right: 1rem; }
                .golem-sidebar h4 { margin-top: 0; color: #aaa; }
                .golem-tab { padding: 0.5rem; cursor: pointer; border-radius: 3px; }
                .golem-tab:hover { background: #1a1a1a; }
                .golem-tab.active { background: var(--accent-color); color: #000; font-weight: bold; }
                .golem-main { flex-grow: 1; display: flex; flex-direction: column; }
                .golem-file-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid #333; padding-bottom: 0.5rem; margin-bottom: 0.5rem; }
                .golem-file-tabs span { padding: 0.25rem 0.5rem; cursor: pointer; border-radius: 3px; font-family: monospace; font-size: 0.9em; }
                .golem-file-tabs span.active { background: #333; color: #fff; }
                .golem-code { margin: 0; flex-grow: 1; overflow: auto; background: #111 !important; }
            `}</style>
        </div>
    );
};

const SonicTapestryInterface: React.FC<{ setActiveView: (view: string) => void; }> = ({ setActiveView }) => {
    const [nowPlaying, setNowPlaying] = React.useState<string | null>(musicEngine.currentComposition);

    const playSong = (song: (typeof songbook)[0]) => {
        let composition;
        if (song.type === 'rhythm') {
            composition = musicEngine.playRhythm(song.sourceId);
        } else {
            const scriptEntry = livingLibrary.getDataset(song.sourceId);
            if (!scriptEntry) return;
            composition = musicEngine.createRitualSong(scriptEntry.rawContent, song.title);
        }
        setNowPlaying(composition.title);
    };
    
    const stopMusic = () => {
        musicEngine.stop();
        setNowPlaying(null);
    }

    return (
        <div className="special-interface-container">
            <div className="si-header">
                <h2>The Sonic Tapestry</h2>
                <button onClick={() => setActiveView('chat')}>Return to Command</button>
            </div>
            <div className="si-content">
                <div className="tapestry-controls">
                    <p>Now Playing: {nowPlaying || 'Silence'}</p>
                    <button onClick={stopMusic} disabled={!nowPlaying}>Stop</button>
                </div>
                <h4>Canon of 30 Songs</h4>
                <div className="song-list">
                    {songbook.map(song => (
                        <div key={song.id} className="song-entry">
                            <div>
                                <strong>{song.title}</strong>
                                <p>{song.description}</p>
                            </div>
                            <button onClick={() => playSong(song)}>Play</button>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                .tapestry-controls { display: flex; justify-content: space-between; align-items: center; background: #111; padding: 1rem; border-radius: 4px; margin-bottom: 1rem; }
                .tapestry-controls p { margin: 0; color: #0ff; font-style: italic; }
                .song-list { display: flex; flex-direction: column; gap: 1rem; }
                .song-entry { display: flex; justify-content: space-between; align-items: center; background: #181818; padding: 1rem; border-left: 3px solid #0ff; }
                .song-entry p { margin: 0.25rem 0 0; color: #888; font-size: 0.9em; }
            `}</style>
        </div>
    );
};

// #endregion

// #region --- History Entry Components ---

const HolographicAnalysisComponent: React.FC<{ analysis: HolographicAnalysis; isHebrewQuery: boolean }> = ({ analysis, isHebrewQuery }) => {
    const { primaryArchetype, linguistic, gematria, relational, pictographic, query } = analysis;

    return (
        <div className="holo-analysis-container" style={{'--archetype-color': primaryArchetype.color} as React.CSSProperties}>
            <div className="holo-header">
                <h3>Holographic Observation of "{query}"</h3>
                <div className="primary-archetype">
                    {isHebrewQuery && <span className="archetype-letter" style={{ color: primaryArchetype.color }}>{primaryArchetype.letter}</span>}
                    <div className="archetype-details">
                        <div className="archetype-name">{primaryArchetype.name}: {primaryArchetype.archetype}</div>
                        {isHebrewQuery && <div className="archetype-gematria">Spelling: {primaryArchetype.spelling} ({gematriaEngine.observe(primaryArchetype.spelling)})</div>}
                    </div>
                </div>
            </div>

            <div className="pardes-grid">
                {/* PESHAT */}
                <div className="pardes-section peshat">
                    <h4>Peshat (Plain Meaning)</h4>
                    <p>{linguistic.etymology}</p>
                </div>

                {/* REMEZ */}
                <div className="pardes-section remez">
                    <h4>Remez (Hint / Allusion)</h4>
                    {isHebrewQuery ? (
                        <>
                            <p><strong>Query Value:</strong> {gematria.queryValue}</p>
                            <p><strong>Archetype Value:</strong> {gematria.archetypeValue}</p>
                        </>
                    ) : (
                        <p>The concept possesses a numerical signature that aligns it with the observed archetype.</p>
                    )}
                    <p className="miracle"><strong>Strongs:</strong> {gematria.miracles.strongsConcordance}</p>
                    <p className="miracle"><strong>Elements:</strong> {gematria.miracles.periodicTable}</p>
                </div>

                {/* DERASH */}
                <div className="pardes-section derash">
                    <h4>Derash (Interpretive Meaning)</h4>
                    <p><strong>Relational Island:</strong> {relational.island}</p>
                    <p><strong>Harmonic Peers:</strong></p>
                    <ul>
                        {relational.peers.slice(0, 3).map((peer, i) => <li key={i}>{peer}</li>)}
                    </ul>
                </div>
                
                {/* SOD */}
                {isHebrewQuery && (
                     <div className="pardes-section sod">
                        <h4>Sod (Secret / Mystical Meaning)</h4>
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
                )}
            </div>
            <style>{`
                .holo-analysis-container { border: 1px solid var(--archetype-color, #888); padding: 1rem; margin-top: 1rem; border-radius: 4px; background: linear-gradient(145deg, rgba(10, 10, 10, 0.5), rgba(0, 0, 0, 0.7)); }
                .holo-header { text-align: center; border-bottom: 1px solid var(--archetype-color, #888); padding-bottom: 1rem; margin-bottom: 1rem; }
                .holo-header h3 { margin: 0 0 1rem; color: #eee; font-family: 'EB Garamond', serif; }
                .primary-archetype { display: flex; align-items: center; justify-content: center; background: #111; padding: 0.5rem; border-radius: 4px; }
                .archetype-letter { font-size: 3rem; font-weight: bold; margin-right: 1rem; }
                .archetype-details { text-align: left; }
                .archetype-name { font-size: 1.1em; color: #fff; }
                .archetype-gematria { font-size: 0.9em; color: #aaa; }

                .pardes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .pardes-section { background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 3px; border-left: 3px solid var(--archetype-color, #888); }
                .pardes-section h4 { color: var(--archetype-color, #eee); margin-top: 0; margin-bottom: 0.75rem; font-family: 'EB Garamond', serif; font-weight: normal; }
                .pardes-section p, .pardes-section ul { margin: 0.5rem 0; font-size: 0.9em; }
                .pardes-section ul { padding-left: 1.2rem; }
                .miracle { color: #0ff; font-style: italic; }
                
                .sod { grid-column: span 2; }
                .pictograph-list { display: flex; gap: 1rem; justify-content: space-around; }
                .pictograph-entry { display: flex; flex-direction: column; align-items: center; }
                .p-letter { font-size: 1.5rem; font-weight: bold; color: var(--archetype-color, #eee); }
                .p-name { font-size: 0.8em; color: #ccc; }
                .p-meaning { font-size: 0.75em; color: #888; text-align: center; max-width: 100px; }

                @media (max-width: 768px) {
                    .pardes-grid { grid-template-columns: 1fr; }
                    .sod { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
};

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

const BlueprintNodeComponent: React.FC<{ node: BlueprintNode, level: number }> = ({ node, level }) => {
    const [isOpen, setIsOpen] = React.useState(level < 2);
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

const NetzachAnalysisComponent: React.FC<{ analysis: NetzachAnalysis }> = ({ analysis }) => {
    return (
        <div className="netzach-container">
            <h4>Netzach Engine Observation: {analysis.query}</h4>
            <p className="netzach-narrative">{analysis.narrative}</p>
            {analysis.snapshot && analysis.snapshot.length > 0 && (
                <div className="netzach-snapshot">
                    <strong>Key Resonances:</strong>
                    <ul>
                        {analysis.snapshot.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>
            )}
            {analysis.error && <p className="error-message">Error: {analysis.error}</p>}
            <style>{`
                .netzach-container { border-left: 3px solid #008000; padding-left: 1rem; margin-top: 1rem; }
                .netzach-container h4 { color: #008000; margin-bottom: 0.5rem; }
                .netzach-narrative { font-style: italic; color: #ddd; }
                .netzach-snapshot { margin-top: 1rem; font-size: 0.9em; }
                .netzach-snapshot strong { color: #bbb; }
                .netzach-snapshot ul { margin: 0.25rem 0 0; padding-left: 1.2rem; }
            `}</style>
        </div>
    );
};

const ProphecyResultComponent: React.FC<{ result: ProphecyResult }> = ({ result }) => {
    return (
        <div className="prophecy-container" style={{'--archetype-color': result.primaryArchetype.color} as React.CSSProperties}>
            <div className="prophecy-header">
                <h3>Prophecy for: "{result.query}"</h3>
                <p>Resonating with the archetype of <strong>{result.primaryArchetype.name}</strong> ({result.primaryArchetype.archetype})</p>
            </div>
            <div className="prophecy-content">
                <div className="prophecy-text">
                    <div className="prophecy-section">
                        <h4>Core Insight</h4>
                        <p>{result.coreInsight}</p>
                    </div>
                    <div className="prophecy-section">
                        <h4>Potential Challenge</h4>
                        <p>{result.potentialChallenge}</p>
                    </div>
                    <div className="prophecy-section">
                        <h4>Guiding Action</h4>
                        <p>{result.guidingAction}</p>
                    </div>
                </div>
                <div className="prophecy-image">
                    <img src={result.symbolicImage} alt={result.symbolicImagePrompt} />
                    <p className="image-prompt"><em>Vision: {result.symbolicImagePrompt}</em></p>
                </div>
            </div>
            <style>{`
                .prophecy-container { border: 1px solid var(--archetype-color, #8A2BE2); padding: 1rem; margin-top: 1rem; border-radius: 4px; background: linear-gradient(145deg, rgba(10, 0, 10, 0.5), rgba(0, 0, 0, 0.7)); }
                .prophecy-header { text-align: center; border-bottom: 1px solid var(--archetype-color, #8A2BE2); padding-bottom: 0.5rem; margin-bottom: 1rem; }
                .prophecy-header h3 { margin: 0; color: var(--archetype-color, #8A2BE2); font-family: 'EB Garamond', serif; }
                .prophecy-header p { margin: 0.25rem 0 0; color: #bbb; }
                .prophecy-content { display: flex; gap: 1rem; }
                .prophecy-text { flex: 2; }
                .prophecy-image { flex: 1; text-align: center; }
                .prophecy-image img { max-width: 100%; border-radius: 4px; border: 1px solid #444; }
                .prophecy-section h4 { color: var(--archetype-color, #eee); margin-bottom: 0.25rem; }
                .prophecy-section p { margin-top: 0; font-size: 0.95em; }
                .image-prompt { font-size: 0.8em; color: #888; font-style: italic; margin-top: 0.5rem; }
                 @media (max-width: 768px) {
                    .prophecy-content { flex-direction: column; }
                }
            `}</style>
        </div>
    );
};

const HistoryEntryComponent: React.FC<{ entry: HistoryEntry }> = ({ entry }) => {
    const renderContent = () => {
        switch (entry.type) {
            case 'USER':
                return <p className="user-entry">{entry.content}</p>;
            case 'ORACLE_RESPONSE':
                return <p className="oracle-entry">{entry.content}</p>;
            case 'SYSTEM_PROCESSING':
                return <p className="system-processing-entry">... {entry.content}</p>;
            case 'GRAND_WORK_MAP':
                return <GrandWorkMapComponent map={entry.content} />;
            case 'SELF_OBSERVATION_RESULT':
                return <SelfObservationComponent result={entry.content} />;
            case 'HOLOGRAPHIC_ANALYSIS':
                const isHebrewQuery = /[א-ת]/.test(entry.content.query);
                return <HolographicAnalysisComponent analysis={entry.content} isHebrewQuery={isHebrewQuery} />;
            case 'GEVURAH_BLUEPRINT_RESULT':
                 return <GevurahBlueprintComponent result={entry.content} />;
            case 'AUTH_RESULT':
                 return <AuthResultComponent result={entry.content} />;
            case 'NETZACH_ANALYSIS':
                 return <NetzachAnalysisComponent analysis={entry.content} />;
            case 'PROPHECY_RESULT':
                 return <ProphecyResultComponent result={entry.content} />;
            default:
                // For unknown or simple system messages
                if (typeof entry.content === 'string') {
                    return <p className="system-entry" style={{fontFamily: 'Jura, sans-serif'}}>{entry.content}</p>;
                }
                return <pre className="system-entry">{JSON.stringify(entry.content, null, 2)}</pre>;
        }
    };
    return <div className={`history-entry sender-${entry.sender}`}>{renderContent()}</div>;
};

const CommandInput: React.FC<{ onSubmit: (command: string) => void; isLoading: boolean }> = ({ onSubmit, isLoading }) => {
    const [input, setInput] = React.useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSubmit(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="command-form">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Observe..."
                disabled={isLoading}
                aria-label="Command Input"
            />
            <button type="submit" disabled={isLoading}>{isLoading ? '...' : 'Submit'}</button>
        </form>
    );
};

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

// #endregion

export const App: React.FC = () => {
    const { 
        isLoading, 
        isInitializing, 
        initializationMessage, 
        sessionHistory, 
        submitCommand,
        activeView,
        isSolveActive,
        solveTickerContent,
        processPickedFile,
        setActiveView,
        currentUser,
    } = useAstrianSystem();
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const historyEndRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (activeView === 'chat') {
            historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [sessionHistory, activeView]);

     const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLoading) return;

        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            processPickedFile(files[0]);
            event.dataTransfer.clearData();
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };


    if (isInitializing) {
        return (
            <div className="initialization-screen">
                <div className="init-logo">[A°]</div>
                <p>{initializationMessage}</p>
                <div className="spinner"></div>
            </div>
        );
    }

    const handleCallSignSelect = (command: string) => {
        submitCommand(command);
        setIsPanelOpen(false);
    };

    const renderActiveView = () => {
        switch (activeView) {
            case 'globe':
                return <GlobeView submitCommand={submitCommand} setActiveView={setActiveView} />;
            case 'golem-interface':
                return <GolemInterface setActiveView={setActiveView} />;
            case 'sonic-tapestry':
                return <SonicTapestryInterface setActiveView={setActiveView} />;
            case 'api-codex':
                return <ApiCodexInterface setActiveView={setActiveView} />;
            case 'chat':
            default:
                return (
                    <div className="history-container">
                        {sessionHistory.map((entry) => (
                            <HistoryEntryComponent key={entry.id} entry={entry} />
                        ))}
                        <div ref={historyEndRef} />
                    </div>
                );
        }
    };

    return (
        <div 
            className={`app-container ${isSolveActive ? 'solve-active' : ''}`}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
        >
             <header>
                <h1>The Astrian Key &trade;</h1>
                <div className="header-controls">
                    <div className="user-status">
                        {currentUser ? (
                            <>Status: <span className="operator-name">{currentUser.name}</span></>
                        ) : (
                            "Status: Unauthenticated"
                        )}
                    </div>
                    <button onClick={() => setActiveView('chat')}>°Command</button>
                    <button onClick={() => setActiveView('globe')}>°Globe</button>
                    <button onClick={() => setActiveView('api-codex')}>°API Codex</button>
                    <button onClick={() => setIsPanelOpen(true)}>°Call Signs</button>
                </div>
            </header>

            <main>
                {renderActiveView()}
                 {isSolveActive && (
                    <div className="solve-ticker">
                        {solveTickerContent.map((line, i) => <div key={i}>{line}</div>)}
                    </div>
                )}
            </main>
            
            <footer>
                <CommandInput onSubmit={submitCommand} isLoading={isLoading} />
            </footer>
            
            <CallSignPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSelect={handleCallSignSelect} />
        </div>
    );
};