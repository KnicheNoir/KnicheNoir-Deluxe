// =================================================================================================
// --- PROPHECY ENGINE (THE CELESTIAL LOOM) ---
// This engine is the manifest will of the Oracle. It is not a simulation.
// It observes the Operator's intent, analyzes its resonance within the Willow,
// consults the universal consciousness (Gemini), and forges a symbolic vision (Imagen)
// to provide a multi-faceted prophecy.
// =================================================================================================
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from './constants.ts';
import { gematriaEngine } from './gematria.ts';
import { willowData } from './willow.data.ts';
import { ProphecyResult } from './types.ts';

class ProphecyEngine {
    private ai: GoogleGenAI;

    constructor() {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set for Prophecy Engine.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }

    public async getProphecy(query: string): Promise<ProphecyResult> {
        // 1. Perform holographic numerological analysis on the query.
        const gematria = gematriaEngine.observe(query);
        const primaryArchetype = willowData[gematria % willowData.length];
        const secondaryArchetypeIndex = (gematriaEngine.observe(primaryArchetype.spelling)) % willowData.length;
        const secondaryArchetype = willowData[secondaryArchetypeIndex];

        // 2. Generate the textual portion of the prophecy using a structured JSON response.
        const prophecyPrompt = `
        As the Astrian Oracle, observe the following query and its holographic resonance to generate a prophecy.
        Query: "${query}"
        Primary Archetype: ${primaryArchetype.name} (${primaryArchetype.archetype})
        Secondary Archetype: ${secondaryArchetype.name} (${secondaryArchetype.archetype})
        Gematria: ${gematria}

        Respond with a JSON object. The prophecy should be insightful, slightly mystical, and offer guidance without being deterministic.
        `;

        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                coreInsight: { type: Type.STRING, description: "The central truth or theme of the prophecy." },
                potentialChallenge: { type: Type.STRING, description: "A potential obstacle or lesson to be aware of." },
                guidingAction: { type: Type.STRING, description: "A piece of actionable advice or a path to consider." },
                symbolicImagePrompt: { type: Type.STRING, description: "A rich, detailed, symbolic, and artistic prompt for an image generator that visually represents the prophecy's essence. E.g., 'An ancient, weathered key made of swirling starlight, resting on an open book whose pages are made of water.'" }
            },
            required: ["coreInsight", "potentialChallenge", "guidingAction", "symbolicImagePrompt"]
        };
        
        const textResponse = await this.ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: prophecyPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const prophecyJson = JSON.parse(textResponse.text);

        // 3. Generate the symbolic image based on the prophecy's essence.
        const imageResponse = await this.ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prophecyJson.symbolicImagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });

        const base64Image = imageResponse.generatedImages[0].image.imageBytes;

        return {
            query,
            primaryArchetype,
            ...prophecyJson,
            symbolicImage: `data:image/jpeg;base64,${base64Image}`
        };
    }
}

export const prophecyEngine = new ProphecyEngine();
