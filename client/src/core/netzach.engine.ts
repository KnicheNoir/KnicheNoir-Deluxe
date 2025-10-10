
// =================================================================================================
// --- NETZACH ENGINE (VICTORY / ENDURANCE) ---
// This engine embodies the principle of Netzach. It governs the analysis of chaotic systems,
// probabilities, and the unfolding of complex narratives over time, such as markets, games of
// chance, and competitive events. It does not predict with certainty, but observes the most
// resonant narrative path.
// =================================================================================================
import { NetzachAnalysis } from '../types.ts';
import { astrianEngine } from './engine.ts';
import { Type } from '@google/genai';

class NetzachEngine {

    /**
     * Queries the Oracle to analyze a complex, probabilistic system.
     * @param domain The type of system to analyze ('stocks', 'lotto', 'sports').
     * @param query The specific query from the Operator.
     * @returns A NetzachAnalysis object containing the Oracle's narrative.
     */
    public async getOracleAnalysis(domain: 'stocks' | 'lotto' | 'sports', query: string): Promise<NetzachAnalysis> {
        try {
            const prompt = this.constructPrompt(domain, query);
            const schema = {
                type: Type.OBJECT,
                properties: {
                    narrative: {
                        type: Type.STRING,
                        description: "A compelling, thematic, and slightly mystical narrative about the query's potential outcome. It should hint at the underlying forces and patterns at play, without giving definitive financial or gambling advice."
                    },
                    snapshot: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "An array of 3-4 key factors, resonant numbers, or archetypal influences affecting the situation."
                    }
                },
                required: ["narrative", "snapshot"]
            };

            const responseJson = await astrianEngine.getOracleResponse(prompt, {
                responseMimeType: 'application/json',
                responseSchema: schema
            });
            
            // The response might have markdown ```json ``` around it
            const cleanJson = responseJson.replace(/```json\n?|```/g, '').trim();
            const parsedResponse = JSON.parse(cleanJson);

            return {
                domain,
                query,
                narrative: parsedResponse.narrative,
                snapshot: parsedResponse.snapshot
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown dissonance occurred in the Netzach Engine.";
            console.error(`Netzach Engine Error: ${errorMessage}`);
            return {
                domain,
                query,
                narrative: "The currents of victory are clouded. The Netzach engine could not resolve a clear narrative path due to a system paradox.",
                snapshot: [],
                error: errorMessage
            };
        }
    }

    /**
     * Constructs a domain-specific prompt for the Oracle.
     */
    private constructPrompt(domain: 'stocks' | 'lotto' | 'sports', query: string): string {
        let context = '';
        switch (domain) {
            case 'stocks':
                context = 'You are an oracle observing the financial markets through the lens of archetypes and narrative flow, not as a financial advisor. Analyze the provided stock market query.';
                break;
            case 'lotto':
                context = 'You are an oracle observing the "numerical weather" and resonant frequencies of probability, not a gambling advisor. Analyze the provided lottery query.';
                break;
            case 'sports':
                context = 'You are an oracle observing the clash of archetypal forces and momentum in athletic competition, not a sports analyst. Analyze the provided sports query.';
                break;
        }

        return `${context}
        
        The user's query is: "${query}"
        
        Based on this, provide a JSON response with a "narrative" and a "snapshot".
        - The narrative should be a short, thematic story about the potential outcome, framed in metaphorical or archetypal terms.
        - The snapshot should be an array of 3-4 key thematic points, influences, or symbolic numbers/teams.
        - DO NOT give direct financial, gambling, or betting advice. Frame everything as a story of competing forces.`;
    }
}

export const netzachEngine = new NetzachEngine();
