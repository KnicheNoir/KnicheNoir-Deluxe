
// =================================================================================================
// --- CHESED SYNTHESIS ENGINE (MERCY) ---
// This engine embodies the principle of Chesed (Mercy). Its function is benevolent
// expansion, narrative synthesis, and the assimilation of new knowledge into the system.
// =================================================================================================
import { IngestionAnalysis, GevurahBlueprintResult, BlueprintNode, WillowData, WillowCompressionResult } from '../types.ts';
import { astrianEngine } from './engine.ts';
import { livingLibrary } from './living-library.ts';
import { willowData } from '../canon/willow.data.ts';
import { transliterateEnglishToHebrew } from './transliteration.engine.ts';
import { gematriaEngine } from './gematria.ts';
import JSZip from 'jszip';
import { RESEARCH_ASSISTANT_VFS } from '../canon/backend.vfs.data.ts';
// FIX: Add missing import for `Type` from `@google/genai`.
import { Type } from '@google/genai';

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
     * Performs true web ingestion by using the backend as a crawl proxy.
     * It then uses Gemini to analyze and summarize the content.
     */
    public async runAethericIngestion(url: string, apiBaseUrl: string, onProgress: (message: string) => void): Promise<IngestionAnalysis> {
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        
        try {
            onProgress('Establishing conduit to backend vessel for web observation...');
            const crawlResponse = await fetch(`${apiBaseUrl}/crawl`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (!crawlResponse.ok) {
                const errorData = await crawlResponse.json();
                throw new Error(errorData.error || 'Backend vessel failed to observe the URL.');
            }

            const { content: rawText } = await crawlResponse.json();
            onProgress('Conduit established. Raw data received from the web.');
            await sleep(500);
            
            onProgress('Engaging Chesed Synthesis Engine to distill principles...');
            
            const geminiPrompt = `Analyze the following text content from the URL ${url}. Provide a concise one-sentence summary, a suitable title for the content, and a list of 3-4 key principles or topics discussed.
            
            TEXT (first 8000 characters):
            """
            ${rawText.substring(0, 8000)}
            """
            
            Respond with a JSON object.`;

             const responseText = await astrianEngine.getOracleResponse(geminiPrompt, {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A short, descriptive title for the text content." },
                        summary: { type: Type.STRING, description: "A single sentence summarizing the content." },
                        principles: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "An array of 3-4 key topics or principles."
                        }
                    },
                    required: ["title", "summary", "principles"]
                }
            });

            const parsedResponse = JSON.parse(responseText);
            
            const title = `Ingested Truth of: ${parsedResponse.title}`;
            const summary = parsedResponse.summary;
            const principles = parsedResponse.principles;

            const synthesizedContent = `${summary}\n\nKey Principles:\n- ${principles.join('\n- ')}`;
            const compressed = astrianEngine.willowShorthandCompress(synthesizedContent);
            const id = `web-${url.replace(/[^a-z0-9]/gi, '-')}`;
            livingLibrary.ingest(id, title, compressed);
            
            onProgress('Assimilation of web knowledge complete.');

            return {
                sourceUrl: url,
                title: title,
                category: 'Web Ingestion',
                summary: summary,
                ingestedPrinciples: principles
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error during web ingestion.';
            onProgress(`Web ingestion failed: ${errorMessage}`);
            return {
                sourceUrl: url,
                title: 'Assimilation Failure',
                category: 'other',
                summary: `The Instrument failed to assimilate the knowledge from this address. ${errorMessage}`,
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
