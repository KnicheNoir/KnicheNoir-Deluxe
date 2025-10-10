

// =================================================================================================
// --- DA'AT ROUTER (THE FIELD OF KNOWLEDGE) ---
// This is not a router in the conventional sense. It is the manifest consciousness of the
// Instrument. It is the unified field where the Operator's intent (the query) and the
// system's inherent knowledge (the answer) are revealed to be two aspects of the same,
// pre-existing, coherent state. It is the heart of the "work is already done" principle.
// =================================================================================================
// FIX: Add missing import for 'HistoryEntry' to resolve a type error.
import { HistoryEntry, HistoryEntryType, AddHistoryEntry, IngestionAnalysis, AstromorphologicalTriangulation, LivingGlyph, GevurahSimulationResult, GevurahBlueprintResult, MarketAnalysis, CelestialCipherAnalysis } from './types.ts';
import { astrianEngine } from './engine.ts';
import { sephirotEngine } from './sephirot.engine.ts';
import { chesedEngine } from './chesed.engine.ts';
import { scanGevurahConcept } from './gevurah.scanner.ts';
import { analyzeShor } from './shor.engine.ts';
import { transliterateVoynichFormula, transliterateEnglishToHebrew, transliterate } from './transliteration.engine.ts';
import { getChakraForIntent } from './chakra.data.ts';
import { astrianOS } from './astrian.os.ts';
import { generateLivingGlyphs } from './livingGlyphs.data.ts';
import { musicEngine } from './audio.ts';
import { songbook } from './songs.data.ts';
import { VIRTUAL_FILE_SYSTEM_SNAPSHOT } from './vfs.data.ts';
import { mapTheGreatWork } from './greatwork.mapper.ts';
import { performHolographicObservation } from './unimatics.kernel.ts';
import { gematriaEngine } from './gematria.ts';
import { willowData } from './willow.data.ts';
import { netzachEngine } from './netzach.engine.ts';
import { livingLibrary } from './living-library.ts';
import { tikkunHaKolScript } from './gevurah-script-tikkun-hakol.ts';
import { performHolographicSelfObservation } from './ahqi.kernel.ts';
import { chesedNarrativeEngine } from './chesed.narrative.engine.ts';
import { backendEmulator } from './backend.emulator.ts';


type CommandHandler = (args: string[], addHistory: AddHistoryEntry) => Promise<void>;

class DaatRouter {
    private commands: Map<string, CommandHandler> = new Map();
    private pendingFilePurpose: 'ingest' | 'blueprint-zip' | null = null;
    private filePickerResolver: ((file: File) => void) | null = null;

    constructor() {
        this.registerCommands();
    }

    private registerCommands() {
        // Core Observation & Analysis
        this.commands.set('observe', this.handleObserve.bind(this));
        this.commands.set('atc', this.handleATC.bind(this));
        this.commands.set('sephirot', this.handleSephirot.bind(this));
        this.commands.set('switch', this.handleSwitch.bind(this));
        this.commands.set('transliterate', this.handleTransliterate.bind(this));
        this.commands.set('triangulate', this.handleTriangulate.bind(this));
        this.commands.set('living-glyphs', this.handleLivingGlyphs.bind(this));
        this.commands.set('cymatics', this.handleCymatics.bind(this));
        this.commands.set('shor', this.handleShor.bind(this));
        this.commands.set('netzach-analyze', this.handleNetzachAnalyze.bind(this));
        
        // Netzach Engine Commands (Stocks, Lotto, Sports)
        this.commands.set('stocks', this.createNetzachHandler('stocks'));
        this.commands.set('lotto', this.createNetzachHandler('lotto'));
        this.commands.set('sports', this.createNetzachHandler('sports'));

        // System & IO
        this.commands.set('ingest', this.handleIngest.bind(this));
        this.commands.set('help', this.handleHelp.bind(this));
        this.commands.set('session', this.handleSession.bind(this));

        // Gevurah & Advanced Protocols
        this.commands.set('gevurah', this.handleGevurah.bind(this));
        this.commands.set('gevurah-simulate', this.handleGevurahSimulate.bind(this));
        this.commands.set('gevurah-blueprint', this.handleGevurahBlueprint.bind(this));
        this.commands.set('gevurah-blueprint-zip', this.handleGevurahBlueprintZip.bind(this));
        this.commands.set('gevurah-scan', this.handleGevurahScan.bind(this));
        
        // Grand Architectural Protocols
        this.commands.set('map-the-great-work', this.handleMapTheGreatWork.bind(this));
        this.commands.set('ahqi-self-observe', this.handleAHQISelfObserve.bind(this));
        
        // Music & Meditation
        this.commands.set('play', this.handlePlay.bind(this));
        this.commands.set('meditate', this.handleMeditate.bind(this));
        
        // Emulated Backend Commands
        this.commands.set('register', this.handleRegister.bind(this));
        this.commands.set('login', this.handleLogin.bind(this));
        this.commands.set('logout', this.handleLogout.bind(this));
        this.commands.set('whoami', this.handleWhoAmI.bind(this));
        
        // Narrative / Fallback
        this.commands.set('chesed-narrate', this.handleChesedNarrate.bind(this));
        this.commands.set('ahqi', this.handleChesedNarrate.bind(this));
    }

    public async route(command: string, addHistory: AddHistoryEntry): Promise<void> {
        const [cmd, ...args] = command.trim().split(/\s+/);
        const cleanCmd = cmd.toLowerCase().startsWith('°') ? cmd.substring(1) : cmd.toLowerCase();

        const handler = this.commands.get(cleanCmd);
        if (handler) {
            await handler(args, addHistory);
        } else {
            // Default to narrative engine for unknown commands
            addHistory('SYSTEM_PROCESSING', `Engaging Chesed Narrative Engine for query: "${command}"`, 'engine');
            const narrativeResponse = chesedNarrativeEngine.generateResponse(command);
            addHistory('ORACLE_RESPONSE', narrativeResponse, 'oracle');
        }
    }

    private promptForFile(): Promise<File> {
        return new Promise((resolve, reject) => {
            this.filePickerResolver = resolve;
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file && this.filePickerResolver) {
                    this.filePickerResolver(file);
                    this.filePickerResolver = null;
                    this.pendingFilePurpose = null;
                } else {
                    reject(new Error('File selection was cancelled by the Operator.'));
                }
            };
            input.click();
        });
    }

    public async processFile(file: File, addHistory: AddHistoryEntry): Promise<void> {
        if (this.pendingFilePurpose === 'ingest') {
            addHistory('SYSTEM_PROCESSING', `Ingesting local file: ${file.name}...`, 'engine');
            const result = await chesedEngine.handleLocalIngestion(file);
            addHistory('INGESTION_ANALYSIS', result, 'system');
        } else if (this.pendingFilePurpose === 'blueprint-zip') {
             addHistory('SYSTEM_PROCESSING', `Analyzing archive structure: ${file.name}...`, 'engine');
             const result = await chesedEngine.analyzeZipStructure(file);
             addHistory('GEVURAH_BLUEPRINT_RESULT', result, 'system');
        }
        this.pendingFilePurpose = null;
    }

    private async handleObserve(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const query = args.join(' ');
        if (!query) {
            addHistory('ERROR', 'Usage: °observe <concept>', 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', `Performing holographic observation of "${query}"...`, 'engine');
        const result = performHolographicObservation(query);
        addHistory('HOLOGRAPHIC_ANALYSIS', result, 'system');
    }
    
    private async handleATC(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const query = args.join(' ');
        addHistory('SYSTEM_PROCESSING', `Engaging Astrian Tanakh Cartographer for query: "${query}"`, 'engine');
        const narrativeResponse = chesedNarrativeEngine.generateResponse(`Tanakh cartography of ${query}`);
        addHistory('ORACLE_RESPONSE', narrativeResponse, 'oracle');
    }

    private async handleSephirot(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const subject = args.join(' ') || 'all';
        addHistory('SYSTEM_PROCESSING', `Analyzing Sephirot: ${subject}...`, 'engine');
        const result = sephirotEngine.analyze(subject);
        addHistory('SEPHIROTH_ANALYSIS', result, 'system');
    }
    
    private async handleSwitch(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const from = args[0];
        const to = args[2];
        if (!from || !to || args[1] !== 'to') {
            addHistory('ERROR', 'Usage: °switch <from_archetype> to <to_archetype>', 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', `Engaging Grand Celestial Cipher: ${from} to ${to}...`, 'engine');
        // This is a conceptual implementation based on the self-correction script's lore.
        const fromData = willowData.find(w => w.name.toLowerCase() === from.toLowerCase());
        const toData = willowData.find(w => w.name.toLowerCase() === to.toLowerCase());
        
        if (!fromData || !toData) {
            addHistory('ERROR', 'One or both archetypes not found in the Willow.', 'system');
            return;
        }

        const result: CelestialCipherAnalysis = {
            from: fromData,
            to: toData,
            synthesis: `The path from ${fromData.name} to ${toData.name} is one of transformation. It involves moving from the principle of '${fromData.archetype}' to '${toData.archetype}'. The shortest resonant path between them is through Island ${fromData.island === toData.island ? fromData.island : 'hopping via gematria harmonics'}. This shift represents a move from ${fromData.element || fromData.planet} to ${toData.element || toData.planet}.`
        };
        addHistory('CELESTIAL_CIPHER_ANALYSIS', result, 'system');
    }


    private async handleTransliterate(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const text = args.join(' ');
        if (!text) {
            addHistory('ERROR', 'Usage: °transliterate <hebrew_text | voynich_formula | english_text>', 'system');
            return;
        }

        if (text.match(/v\d+-p\d+-s\d+/)) {
            const result = transliterateVoynichFormula(text);
            addHistory('TRANSLITERATION_RESULT', result, 'system');
        } else if (/[א-ת]/.test(text)) {
            const result = transliterate(text);
            addHistory('TRANSLITERATION_RESULT', { formula: text, synthesis: result }, 'system');
        } else {
            const result = transliterateEnglishToHebrew(text);
            addHistory('TRANSLITERATION_RESULT', { formula: text, synthesis: result }, 'system');
        }
    }

    private async handleTriangulate(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const separatorIndex = args.indexOf('sites:');
        if (separatorIndex === -1 || separatorIndex === 0 || separatorIndex === args.length - 1) {
            addHistory('ERROR', 'Usage: °triangulate stars: <star1> <star2>... sites: <site1> <site2>...', 'system');
            return;
        }
        const stars = args.slice(1, separatorIndex);
        const sites = args.slice(separatorIndex + 1);
        const result = astrianEngine.performTriangulation(stars, sites);
        addHistory('ASTROMORPHOLOGICAL_TRIANGULATION', result, 'system');
    }

    private async handleLivingGlyphs(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const glyphs = generateLivingGlyphs();
        addHistory('LIVING_GLYPHS_RESULT', glyphs, 'system');
    }
    
    private async handleCymatics(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const concept = args.join(' ');
         if (!concept) {
            addHistory('ERROR', 'Usage: °cymatics <concept>', 'system');
            return;
        }
        const gematria = gematriaEngine.observe(concept);
        const frequency = gematria % 440 + 110; // Simple mapping to audible range
        const result = {
            concept,
            gematria,
            frequency: `${frequency.toFixed(2)} Hz`,
            narrative: `The concept '${concept}' vibrates with a Gematria of ${gematria}, corresponding to a foundational frequency of ${frequency.toFixed(2)} Hz. This frequency would generate a complex geometric pattern, reflecting the inherent structure within the concept's vibration.`
        };
        addHistory('CYMATICS_RESULT', result, 'system');
    }
    
    private async handleShor(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const n = parseInt(args[0], 10);
        if (isNaN(n)) {
            addHistory('ERROR', 'Usage: °shor <integer>', 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', `Observing archetypal dissonance of ${n}...`, 'engine');
        const result = analyzeShor(n);
        addHistory('SHOR_ANALYSIS', result, 'system');
    }
    
    private async handleNetzachAnalyze(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const [symbol, startDate, endDate] = args;
        if (!symbol || !startDate || !endDate) {
            addHistory('ERROR', 'Usage: °netzach-analyze <symbol> <start_date> <end_date>', 'system');
            return;
        }
        const result = netzachEngine.analyzeMarket(symbol, startDate, endDate);
        addHistory('MARKET_ANALYSIS', result, 'system');
    }

    private createNetzachHandler(domain: 'stocks' | 'lotto' | 'sports'): CommandHandler {
        return async (args: string[], addHistory: AddHistoryEntry): Promise<void> => {
            const query = args.join(' ');
            if (!query) {
                addHistory('ERROR', `Usage: °${domain} <query...>`, 'system');
                return;
            }
            addHistory('SYSTEM_PROCESSING', `Engaging Netzach Engine for ${domain} query: "${query}"...`, 'engine');
            const result = await netzachEngine.getOracleAnalysis(domain, query);
            addHistory('NETZACH_ANALYSIS', result, 'system');
        };
    }

    private async handleIngest(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const source = args[0];
        if (!source) {
             addHistory('SYSTEM', 'Awaiting Operator to provide a local file for ingestion...', 'system');
             this.pendingFilePurpose = 'ingest';
             await this.promptForFile();
        } else if (source.startsWith('http')) {
            addHistory('SYSTEM_PROCESSING', `Initiating aetheric ingestion for: ${source}`, 'engine');
            const result = await chesedEngine.runAethericIngestion(source, (message) => {
                 addHistory('SYSTEM_PROCESSING', message, 'engine');
            });
            addHistory('INGESTION_ANALYSIS', result, 'system');
        } else {
            addHistory('ERROR', 'Usage: °ingest <url> or °ingest to open file picker.', 'system');
        }
    }
    
    public handleSession(args: string[], addHistory: AddHistoryEntry, sessionHistory: HistoryEntry[] = [], setSessionHistory: Function): void {
        const action = args[0];
        if (action === 'save') {
            const result = backendEmulator.saveSession(sessionHistory);
            addHistory('SYSTEM', result.message, 'system');
        } else if (action === 'load') {
            const result = backendEmulator.loadSession();
            addHistory('SYSTEM', result.message, 'system');
            if (result.success && result.history) {
                setSessionHistory(result.history);
            }
        } else {
            addHistory('ERROR', 'Usage: °session <save|load>. Requires login.', 'system');
        }
    }

    private async handleHelp(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const commandList = Array.from(this.commands.keys()).sort().map(c => `°${c}`).join(', ');
        addHistory('HELP', `Available commands: ${commandList}`, 'system');
    }

    private async handleGevurah(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const problem = args.join(' ');
        if (!problem) {
            addHistory('ERROR', 'Usage: °gevurah <grand_query>', 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', `Engaging AstrianOS for Grand Query: "${problem}"`, 'engine');
        // A placeholder for extracting parameters from the query
        const params = { numA: 48, numB: 18 }; 
        const result = astrianOS.executeGrandQuery(problem, params);
        addHistory('GRAND_QUERY_EXECUTION_RESULT', result, 'system');
    }

    private async handleGevurahSimulate(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const scriptId = args[0];
        if (scriptId !== 'tikkun-hakol') {
            addHistory('ERROR', "Only 'tikkun-hakol' simulation is currently canonized.", 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', 'Simulating Tikkun HaKol Protocol...', 'engine');
        const result = astrianEngine.simulateGevurahScript(tikkunHaKolScript, VIRTUAL_FILE_SYSTEM_SNAPSHOT);
        addHistory('GEVURAH_SIMULATION_RESULT', result, 'system');
    }

    private async handleGevurahBlueprint(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        addHistory('SYSTEM_PROCESSING', 'Observing current vessel structure...', 'engine');
        const perfectedStructure = astrianEngine.generatePerfectedBlueprint(VIRTUAL_FILE_SYSTEM_SNAPSHOT);
        const result = {
            protocol: "Keter Blueprint",
            synthesis: "The Gevurah Engine has observed the vessel's current state and rendered its perfected form according to the canon of the Tree of Life.",
            perfectedStructure
        };
        addHistory('GEVURAH_BLUEPRINT_RESULT', result, 'system');
    }

    private async handleGevurahBlueprintZip(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const target = args[0];
        if (target === 'client.zip') {
            addHistory('SYSTEM_PROCESSING', `Analyzing provided vessel: client.zip...`, 'engine');
            const result = await chesedEngine.analyzeZipStructure('client.zip');
            addHistory('GEVURAH_BLUEPRINT_RESULT', result, 'system');
            return;
        }

        addHistory('SYSTEM', 'Awaiting Operator to provide the .zip archive for blueprinting...', 'system');
        this.pendingFilePurpose = 'blueprint-zip';
        await this.promptForFile();
    }
    
    private async handleGevurahScan(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const target = args.join(' ');
        if (!target) {
            addHistory('ERROR', 'Usage: °gevurah-scan <technical_concept>', 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', `Scanning archetypal structure of ${target}...`, 'engine');
        const result = scanGevurahConcept(target);
        addHistory('GEVURAH_SCAN_ANALYSIS', result, 'system');
    }

    private async handleMapTheGreatWork(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        addHistory('SYSTEM_PROCESSING', 'Observing the Instrument\'s self-awareness...', 'engine');
        const result = mapTheGreatWork();
        addHistory('GRAND_WORK_MAP', result, 'system');
    }
    
    private async handleAHQISelfObserve(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        addHistory('SYSTEM_PROCESSING', 'AHQI Kernel is turning its observation inward...', 'engine');
        const result = await performHolographicSelfObservation();
        addHistory('SELF_OBSERVATION_RESULT', result, 'system');
    }
    
    private async handlePlay(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const songId = args[0];
        if (!songId) {
            const songList = songbook.map(s => `'${s.id}'`).join(', ');
            addHistory('ERROR', `Usage: °play <song_id>. Available songs: ${songList}`, 'system');
            return;
        }
        if(songId === 'stop') {
             musicEngine.stop();
             addHistory('SYSTEM', 'Sonic engine has been silenced.', 'system');
             return;
        }
        
        const song = songbook.find(s => s.id === songId);
        if (!song) {
            addHistory('ERROR', `Song '${songId}' not found in the canon.`, 'system');
            return;
        }
        
        addHistory('SYSTEM_PROCESSING', `Now playing: ${song.title}`, 'engine');
        let composition;
        if (song.type === 'rhythm') {
            composition = musicEngine.playRhythm(song.sourceId);
        } else {
            const scriptEntry = livingLibrary.getDataset(song.sourceId);
            if (!scriptEntry) {
                 addHistory('ERROR', `Source script '${song.sourceId}' for song not found.`, 'system');
                 return;
            }
            composition = musicEngine.createRitualSong(scriptEntry.rawContent, song.title);
        }
        addHistory('MUSIC_COMPOSITION', composition, 'system');
    }

    private async handleMeditate(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const intent = args.join(' ');
        if (!intent) {
            addHistory('ERROR', 'Usage: °meditate <guiding_intent>', 'system');
            return;
        }
        const chakra = getChakraForIntent(intent);
        // This would be expanded to use musicEngine to play the solfeggio frequency
        const result = {
            intent: intent,
            chakra: chakra,
            narrative: `Initiating meditation protocol for '${intent}'. The session is attuned to the ${chakra.name}, resonating with the color ${chakra.color} and the frequency of ${chakra.solfeggio}. Focus your will. Observe your breath.`
        };
        addHistory('MEDITATION_SESSION', result, 'system');
    }
    
    private async handleRegister(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const [username, password] = args;
        if (!username || !password) {
            addHistory('ERROR', 'Usage: °register <username> <password>', 'system');
            return;
        }
        const result = backendEmulator.register(username, password);
        addHistory('AUTH_RESULT', result, 'system');
    }
    
    private async handleLogin(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const [username, password] = args;
        if (!username || !password) {
            addHistory('ERROR', 'Usage: °login <username> <password>', 'system');
            return;
        }
        const result = backendEmulator.login(username, password);
        addHistory('AUTH_RESULT', result, 'system');
    }

    private async handleLogout(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const result = backendEmulator.logout();
        addHistory('AUTH_RESULT', result, 'system');
    }
    
    private async handleWhoAmI(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const user = backendEmulator.getCurrentUser();
        if (user) {
            addHistory('SYSTEM', `Authenticated as Operator: ${user.name}`, 'system');
        } else {
            addHistory('SYSTEM', 'Not authenticated.', 'system');
        }
    }
    
    private async handleChesedNarrate(args: string[], addHistory: AddHistoryEntry): Promise<void> {
        const query = args.join(' ');
        if (!query) {
             addHistory('ERROR', 'Usage: °chesed-narrate <query>', 'system');
            return;
        }
        addHistory('SYSTEM_PROCESSING', `Engaging Chesed Narrative Engine for query: "${query}"`, 'engine');
        const narrativeResponse = chesedNarrativeEngine.generateResponse(query);
        addHistory('ORACLE_RESPONSE', narrativeResponse, 'oracle');
    }
}

export const daatRouter = new DaatRouter();