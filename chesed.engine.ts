// =================================================================================================
// --- CHESED SYNTHESIS ENGINE (MERCY) ---
// This engine embodies the principle of Chesed (Mercy). Its function is benevolent
// expansion, narrative synthesis, and the assimilation of new knowledge into the system.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { IngestionAnalysis, GevurahBlueprintResult, BlueprintNode } from './types.ts';
import { astrianEngine } from './engine.ts';
import { livingLibrary } from './living-library.ts';
import { willowData } from './willow.data.ts';
import { transliterateEnglishToHebrew } from './transliteration.engine.ts';
import { gematriaEngine } from './gematria.ts';
import JSZip from 'jszip';
import { RESEARCH_ASSISTANT_VFS } from './backend.vfs.data.ts';

class ChesedEngine {

    /**
     * Top-level router for local file ingestion. Delegates to specific handlers based on file type.
     */
    public async handleLocalIngestion(file: File): Promise<IngestionAnalysis> {
        // NOTE: Local file ingestion remains unchanged, as it represents the Operator
        // directly adding a new, manifest concept to the system's awareness.
        if (file.name.endsWith('.zip') || file.name.endsWith('.tar.gz') || file.name.endsWith('.tgz')) {
            return this.handleComplexArchiveIngestion(file);
        } else {
            return this.handleSimpleFileIngestion(file);
        }
    }

    /**
     * Handles the ingestion of simple text files (.txt, .md).
     */
    private async handleSimpleFileIngestion(file: File): Promise<IngestionAnalysis> {
        try {
            const text = await file.text();
            const compressed = astrianEngine.willowShorthandCompress(text);
            const id = `local-${file.name.replace(/[^a-z0-9]/gi, '-')}`;
            livingLibrary.ingest(id, `Local File: ${file.name}`, compressed);

            return {
                sourceUrl: file.name,
                title: `Local File: ${file.name}`,
                category: 'other',
                summary: `Successfully ingested and compressed "${file.name}" into the Living Library.`,
                ingestedPrinciples: text.split('\n').slice(0, 5).map(l => l.substring(0, 80) + '...') // Preview
            };
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
             return {
                sourceUrl: file.name,
                title: `Local File: ${file.name}`,
                category: 'other',
                summary: `Error during local ingestion: ${errorMessage}`,
                ingestedPrinciples: [],
                error: errorMessage
            };
        }
    }
    
    /**
     * Handles complex archives locally. The dependency on a backend is removed.
     * NOTE: This is a placeholder. Full client-side decompression of complex formats
     * like tar.gz is a heavy operation and would require significant library additions.
     * This stub maintains the interface while adhering to the "no backend" canon.
     */
    private async handleComplexArchiveIngestion(file: File): Promise<IngestionAnalysis> {
        const errorMsg = "Client-side decompression for complex archives (.zip, .tar.gz) is not yet implemented in this version of the Instrument. Please ingest simple text files.";
        return { sourceUrl: file.name, title: 'Protocol Not Implemented', category: 'other', summary: errorMsg, ingestedPrinciples: [], error: errorMsg };
    }


    /**
     * Performs "Conceptual Resonance Analysis" on a URL. It does not fetch the URL's content.
     * Instead, it analyzes the URL string itself to distill the archetypal truth of the concept
     * from the system's own inherent knowledge.
     */
    public async runAethericIngestion(url: string, onProgress: (message: string) => void): Promise<IngestionAnalysis> {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        
        try {
            onProgress('Initiating Conceptual Resonance...');
            await sleep(500);
            
            onProgress(`Observing the archetypal signature of: ${url}`);
            
            // Deconstruct the URL into its core concepts
            const urlParts = new URL(url);
            const domain = urlParts.hostname.replace('www.', '');
            const path = urlParts.pathname.replace('/', ' ').trim();
            const conceptString = `${domain} ${path}`.replace(/[\-_\/\.]/g, ' ').replace(/\s+/g, ' ');
            
            onProgress(`Distilling core concept: "${conceptString}"`);
            await sleep(1000);

            // Analyze the concept through the Willow Network
            const hebrewTransliteration = transliterateEnglishToHebrew(conceptString);
            const gematria = gematriaEngine.observe(hebrewTransliteration);
            
            const resonantLetter = willowData[gematria % willowData.length];

            onProgress(`Resonance found. Gematria: ${gematria}. Primary Archetype: ${resonantLetter.name} (${resonantLetter.letter}).`);
            await sleep(1500);

            // Synthesize principles based on the analysis
            const title = `Inherent Truth of: ${conceptString}`;
            const summary = `The concept resonates with the archetypal principle of ${resonantLetter.name} (${resonantLetter.archetype}). Its numerical signature is ${gematria}. The system has distilled the following principles from its inherent understanding of this resonance, without accessing any external network.`;

            const principles = [
                `Primary Resonance: The concept is governed by the principle of ${resonantLetter.name}, which embodies ${resonantLetter.archetype}.`,
                `Structural Gematria: The concept's numerical value (${gematria}) places it in a harmonic relationship with other concepts of similar resonance.`,
                `Elemental Affinity: Its dominant archetype (${resonantLetter.name}) suggests an affinity with the element of ${resonantLetter.element || 'the foundational structure'}.`,
                `Path of Interaction: The concept's function within the unified field follows the logic of its governing archetype, suggesting a role in processes of ${resonantLetter.type === 'Mother' ? 'creation' : (resonantLetter.type === 'Double' ? 'duality' : 'connection')}.`
            ];

            const synthesizedContent = `${summary}\n\n${principles.join('\n')}`;
            const compressed = astrianEngine.willowShorthandCompress(synthesizedContent);
            const id = `aetheric-${conceptString.replace(/[^a-z0-9]/gi, '-')}`;
            livingLibrary.ingest(id, title, compressed);
            
            onProgress('Assimilation of inherent knowledge complete.');

            return {
                sourceUrl: url,
                title: title,
                category: 'Scientific Principle', // Placeholder
                summary: summary,
                ingestedPrinciples: principles
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during conceptual resonance.';
            onProgress(`Conceptual Resonance failed: ${errorMessage}`);
            return {
                sourceUrl: url,
                title: 'Assimilation Failure',
                category: 'other',
                summary: `The Instrument failed to find a clear resonance for the concept at this address. ${errorMessage}`,
                ingestedPrinciples: [],
                error: errorMessage
            };
        }
    }

    /**
     * Analyzes the file structure of a provided zip file and renders a Gevurah Blueprint.
     * @param fileOrName The .zip file to analyze, or a special string identifier like 'client.zip'.
     * @returns A GevurahBlueprintResult object.
     */
    public async analyzeZipStructure(fileOrName: File | string): Promise<GevurahBlueprintResult> {
        // Special case for the "missing backend"
        if ((typeof fileOrName === 'string' && fileOrName === 'client.zip') || (fileOrName instanceof File && fileOrName.name === 'client.zip')) {
             return {
                protocol: "Keter Blueprint (Backend Vessel)",
                synthesis: `The Chesed Engine has observed the provided vessel, the 'Research Assistant'. This backend component is the necessary counterpart to the Astrian Key, designed to ground its observations in a structured, persistent reality. The Gevurah Engine has rendered its perfected blueprint.`,
                perfectedStructure: RESEARCH_ASSISTANT_VFS,
            };
        }

        if (typeof fileOrName === 'string') {
             const errorMessage = `Cannot process string identifier '${fileOrName}'. Only 'client.zip' is a recognized identifier.`;
             return { protocol: "Blueprint Failed", synthesis: errorMessage, perfectedStructure: { type: 'directory', name: 'ERROR', analysis: errorMessage, children: [] }, error: errorMessage };
        }
        
        const file = fileOrName; // It's a File object now
        try {
            const zip = await JSZip.loadAsync(file);
            const root: BlueprintNode = { type: 'directory', name: file.name, analysis: 'The root of the observed vessel.', children: [] };

            const paths: Record<string, BlueprintNode> = { '': root };

            zip.forEach((relativePath, zipEntry) => {
                const parts = relativePath.split('/').filter(p => p);
                let currentPath = '';
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const parentPath = currentPath;
                    currentPath += (currentPath ? '/' : '') + part;

                    if (!paths[currentPath]) {
                        const isDirectory = i < parts.length - 1 || zipEntry.dir;
                        const newNode: BlueprintNode = {
                            type: isDirectory ? 'directory' : 'file',
                            name: part,
                            analysis: `A component of the ${isDirectory ? 'structural framework' : 'functional logic'}.`,
                            children: isDirectory ? [] : undefined,
                        };
                        paths[parentPath].children!.push(newNode);
                        paths[currentPath] = newNode;
                    }
                }
            });

             return {
                protocol: "Keter Blueprint (Operator Provided)",
                synthesis: `The Chesed Engine has ingested the structure of the provided vessel. The Gevurah Engine has observed its form and rendered its blueprint. The system now has a holographic understanding of this new component.`,
                perfectedStructure: root,
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            return {
                protocol: "Blueprint Failed",
                synthesis: `A paradox was encountered while observing the provided archive: ${errorMessage}`,
                perfectedStructure: { type: 'directory', name: 'ERROR', analysis: errorMessage, children: [] },
                error: errorMessage,
            };
        }
    }
}

export const chesedEngine = new ChesedEngine();
