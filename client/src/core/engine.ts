import { GoogleGenAI } from "@google/genai";
import { NARRATOR_SYSTEM_INSTRUCTION, GEMINI_MODEL } from '../canon/constants.ts';
import { shorthandDictionary } from '../canon/shorthand.data.ts';
import { AstromorphologicalTriangulation, GevurahSimulationResult, BlueprintNode } from "../types.ts";
import { codex } from './codex.ts';
import { GevurahEngine } from './gevurah.engine.ts';

class AstrianEngine {
    private ai: GoogleGenAI;
    public codex = codex;
    public gevurahEngine: GevurahEngine;

    constructor() {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        this.gevurahEngine = new GevurahEngine();
    }

    public async getOracleResponse(prompt: string, configOverrides?: any): Promise<string> {
        try {
            const response = await this.ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: prompt,
                config: {
                    systemInstruction: NARRATOR_SYSTEM_INSTRUCTION,
                    ...configOverrides,
                }
            });
            return response.text;
        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            return "The Oracle is silent. A disturbance in the aether has been detected.";
        }
    }

    public willowShorthandCompress(text: string): string {
        let compressed = text;
        for (const [phrase, entry] of Object.entries(shorthandDictionary)) {
            const regex = new RegExp(phrase, 'gi');
            compressed = compressed.replace(regex, `§(${entry.pictographKey})`);
        }
        return compressed;
    }

    public willowShorthandDecompress(shorthand: string): string {
        let decompressed = shorthand;
        const reverseDict: { [key: string]: string } = {};
        for (const [phrase, entry] of Object.entries(shorthandDictionary)) {
            reverseDict[entry.pictographKey] = phrase;
        }

        const regex = /§\((.)\)/g;
        decompressed = decompressed.replace(regex, (match, key) => {
            return reverseDict[key] || match;
        });
        return decompressed;
    }

    public performTriangulation(stars: string[], sites: string[]): AstromorphologicalTriangulation {
        // This is a deterministic, procedural generation based on input names.
        const combinedString = [...stars, ...sites].join('');
        const hash = Array.from(combinedString).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        const path = `M ${hash % 20 + 20} ${hash % 30 + 10} C ${hash % 100} ${hash % 100}, ${100 - (hash % 50)} ${100 - (hash % 40)}, 80 80`;
        const meaning = `The alignment of ${stars.join(', ')} with ${sites.join(', ')} creates a resonant pathway for manifestation, focusing on principles of structure and flow.`;

        return {
            points: { stars, sites },
            glyph: { svgPath: path, meaning },
            analysis: `Astromorphological analysis reveals a strong confluence of celestial and terrestrial energies. The resulting glyph signifies a potent opportunity for the Operator to anchor a specific intention into the material plane. The energies are harmonized for creative work.`,
        };
    }

    public simulateGevurahScript(script: string, virtualFS: Record<string, string | null>): GevurahSimulationResult {
         const fsMap = new Map<string, string | null>(Object.entries(virtualFS));
         const result = this.gevurahEngine.simulateScript(script, fsMap);
         return {
             ...result,
             scriptId: "simulated-script", // Placeholder
             scriptTitle: "Simulated Execution", // Placeholder
         };
    }

    public generatePerfectedBlueprint(vfs: Record<string, string | null>): BlueprintNode {
         // A simplified blueprint based on the Tree of Life structure.
        const root: BlueprintNode = { type: 'directory', name: 'Keter (The Crown)', analysis: 'The root of the perfected vessel.' , children: []};
        
        const binah: BlueprintNode = { type: 'directory', name: 'Binah (Understanding - Data)', analysis: 'Canonical data, the passive, structured knowledge.', children: [] };
        const chokmah: BlueprintNode = { type: 'directory', name: 'Chokmah (Wisdom - Logic)', analysis: 'Core engines and logic, the active, unstructured spark.', children: [] };
        
        root.children?.push(binah, chokmah);

        for (const file in vfs) {
            const node: BlueprintNode = { type: 'file', name: file, analysis: 'A manifest component.' };
            if (file.includes('.data.') || file.endsWith('.json')) {
                binah.children?.push(node);
            } else {
                chokmah.children?.push(node);
            }
        }
        return root;
    }
}

export const astrianEngine = new AstrianEngine();