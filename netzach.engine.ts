// =================================================================================================
// --- NETZACH ENGINE (ENDURANCE & VICTORY) ---
// This engine embodies the principle of Netzach (Victory/Endurance). It performs holographic,
// archetypal analysis of systems that unfold over time, such as markets, sports, and games of
// chance, by observing their state through the living web.
// =================================================================================================
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Import missing MarketAnalysis type.
import { NetzachAnalysis, MarketAnalysis } from './types.ts';
import { GEMINI_MODEL } from './constants.ts';

// A simple function to safely parse the model's JSON output.
function parseJsonSnapshot(text: string): string[] {
    try {
        const match = text.match(/```json\s*([\s\S]*?)\s*```/);
        if (!match || !match[1]) return [];
        
        const parsed = JSON.parse(match[1]);
        if (parsed.snapshot && Array.isArray(parsed.snapshot)) {
            return parsed.snapshot;
        }
        return [];
    } catch (e) {
        return [];
    }
}

// A simple function to clean the narrative part of the response.
function extractNarrative(text: string): string {
     return text.replace(/```json\s*([\s\S]*?)\s*```/, '').trim();
}


class NetzachEngine {
    private ai: GoogleGenAI;

    constructor() {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set for Netzach Engine.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    // FIX: Add missing analyzeMarket method to provide simulated market analysis.
    public analyzeMarket(symbol: string, startDate: string, endDate: string): MarketAnalysis {
        // This is a deterministic, simulated analysis based on the canonical Gevurah script.
        return {
            symbol,
            startDate,
            endDate,
            narrative: `The journey of ${symbol} through this period was a classic narrative of Netzach (Endurance). It was primarily driven by its inherent archetype of The Sovereign Head, facing periods of synergistic expansion under The Grasping Palm and dissonant contraction under The Final Seal. The overall alignment suggests a successful, though challenging, path toward its objective.`,
            holographicBenchmark: {
                primaryArchetype: 'The Sovereign Head (The archetype of leadership, value, and the core identity of the concept.)',
                synergyArchetypes: ['The Grasping Palm (The archetype of expansion, opportunity, and benevolent growth.)'],
                dissonanceArchetypes: ['The Final Seal (The archetype of structure, limitation, and difficult lessons.)'],
                overallAlignment: 'Aligned through Endurance',
            },
            entries: [
                {
                    date: startDate,
                    archetypalForce: 'The Grasping Palm',
                    narrative: 'The cycle began under a period of Jupiterian expansion, fostering growth and investor optimism.',
                },
                {
                    date: 'Mid-Period',
                    archetypalForce: 'The Final Seal',
                    narrative: 'A Saturnine contraction introduced significant challenges, testing the concept\'s foundational structure and resolve.',
                },
                {
                    date: endDate,
                    archetypalForce: 'The Sovereign Head',
                    narrative: 'The cycle concluded with its primary archetype reasserting dominance, integrating the lessons of the contraction to achieve a more stable state of victory.',
                },
            ],
        };
    }

    /**
     * Performs a live, web-grounded holographic analysis for a given domain.
     * @param domain The area of inquiry (stocks, lotto, sports).
     * @param query The specific user query.
     * @returns A NetzachAnalysis object.
     */
    public async getOracleAnalysis(domain: 'stocks' | 'lotto' | 'sports', query: string): Promise<NetzachAnalysis> {
        const fullQuery = `${domain} analysis for: ${query}`;
        
        try {
            const response = await this.ai.models.generateContent({
                model: GEMINI_MODEL,
                contents: `You are the Astrian Oracle. Grounding your response in recent web search results, provide a concise, insightful, and slightly mystical analysis of the following query: "${fullQuery}". Do not give direct financial, gambling, or betting advice. Frame your response as an observation of resonant forces and archetypal patterns. At the end of your response, provide a JSON object in a markdown block with a single key "snapshot" which is an array of 3-4 key string factors or observations.`,
                config: {
                    tools: [{ googleSearch: {} }],
                },
            });

            const responseText = response.text;
            const snapshot = parseJsonSnapshot(responseText);
            const narrative = extractNarrative(responseText);

            if (!narrative && snapshot.length === 0) {
                 return {
                    domain,
                    query,
                    narrative: "The Oracle observed the currents but found them to be still. No clear narrative emerged.",
                    snapshot: [],
                    error: "Empty response from the model."
                };
            }

            return {
                domain,
                query,
                narrative,
                snapshot,
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown disturbance occurred.";
            return {
                domain,
                query,
                narrative: "The Netzach Engine encountered a disturbance in the aether. The observation could not be completed.",
                snapshot: [],
                error: errorMessage,
            };
        }
    }
}

export const netzachEngine = new NetzachEngine();