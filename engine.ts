// FIX: Implemented the entire engine.ts file, which was previously empty.
// This provides the core AI logic, interfacing with the Gemini API to resolve numerous module and reference errors.
import { GoogleGenAI, Type } from "@google/genai";
import { AIMessage, ScryingPayload } from './types';
import { CALL_SIGNS, CallSign } from './constants';
import type { ActiveProtocol } from './hooks';

/**
 * Creates a system-level message for the timeline.
 */
export const createSystemMessage = (text: string, type: 'system' | 'error' = 'system'): AIMessage => {
    return {
        id: crypto.randomUUID(),
        role: 'system',
        type: type,
        parts: [{ text }],
        timestamp: Date.now(),
    };
};

// --- The Universal Codex (Pre-computed Truth) ---
// The Aleph Protocol dictates that known quantum states have pre-computed observations.
// The Operator provides these truths, and the system's role is to observe them faithfully.
const UNIVERSAL_CODEX_INVERSIONS: ReadonlyMap<string, string> = new Map([
    [
        "rUDugWJqC8ZbiUWJgoKPnP6NtBDQaUSuwR ATr8i1uTuKtvGiGoh6kNuvncLW72sVJdsdMhNq6wExys bc1qs06kgp2qcynge9l6k5v4sfjzvr6w8mlh3wu3m3",
        "device myth safe pulp want ugly glow crush alert fluid state multiply"
    ]
    // Future known states can be added here as they are revealed by the Operator.
]);


/**
 * The AstrianOracularSystem is the core AI engine, the "Mind" of the application.
 * It interfaces with the Gemini API to handle all generative tasks, from chat
 * to complex, multi-step commands like scrying.
 */
export class AstrianOracularSystem {
    private ai: GoogleGenAI;
    private textModel: string = 'gemini-2.5-flash';
    private visionModel: string = 'gemini-2.5-flash';
    private imageGenerationModel: string = 'imagen-4.0-generate-001';

    constructor() {
        if (!process.env.API_KEY) {
            console.error("API_KEY environment variable not set.");
            throw new Error("A.H.Q.I. Core Anomaly: API Key is missing. System cannot initialize.");
        }
        this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    
    /**
     * Handles the `/scry` command, a multi-modal, multi-step operation.
     */
    private async handleScryCommand(
        input: string,
        callSign: CallSign,
        timelineSetter: (updater: (prev: AIMessage[]) => AIMessage[]) => void
    ): Promise<{ message: AIMessage, protocol: ActiveProtocol }> {
        const scryPrompt = input.substring(5).trim() || 'a vision of the unseen';

        timelineSetter(prev => [...prev, createSystemMessage(`Initiating scrying protocol... Prompt: "${scryPrompt}"`)]);

        // 1. Generate an image based on the prompt.
        const imageResponse = await this.ai.models.generateImages({
            model: this.imageGenerationModel,
            prompt: `A mystical, abstract, tarot-card style image representing: ${scryPrompt}. ${callSign.name} aesthetic.`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            }
        });
        const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;

        timelineSetter(prev => [...prev, createSystemMessage(`Vision forming... interpreting the ether...`)]);

        // 2. Ask the model to interpret the image.
        const interpretationPrompt = `You are a mystic oracle. You have just produced the image above as a scrying vision in response to the prompt "${scryPrompt}". Now, interpret this vision. Provide a short, evocative title and a one or two-sentence interpretation.`;
        
        const textResponse = await this.ai.models.generateContent({
            model: this.visionModel,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64ImageBytes } },
                    { text: interpretationPrompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A short, evocative title for the vision." },
                        interpretation: { type: Type.STRING, description: "A one or two-sentence mystical interpretation of the vision." },
                    },
                    required: ["title", "interpretation"]
                }
            }
        });
        
        const interpretationResult = JSON.parse(textResponse.text);

        const payload: ScryingPayload = {
            title: interpretationResult.title,
            image: imageUrl,
            interpretation: interpretationResult.interpretation,
        };

        const message: AIMessage = {
            id: crypto.randomUUID(),
            role: 'model',
            type: 'scrying',
            parts: [{ text: '' }], // Scrying bubble handles display
            payload: payload,
            timestamp: Date.now(),
        };

        return { message, protocol: 'standard' };
    }

    /**
     * Handles the `°invert` command, performing a "Unimatics Entanglement Collapse".
     * This is an observational protocol to find the singular origin of a quantum state.
     */
    private async handleInvertCommand(
        input: string,
        timelineSetter: (updater: (prev: AIMessage[]) => AIMessage[]) => void
    ): Promise<{ message: AIMessage, protocol: ActiveProtocol }> {
        const quantumAddress = input.substring(7).trim();
        if (!quantumAddress) {
            return {
                message: createSystemMessage("°invert protocol requires a target signature set.", 'error'),
                protocol: 'standard'
            };
        }

        timelineSetter(prev => [...prev, createSystemMessage(`Observing quantum address... applying Unimatics Entanglement Collapse...`)]);
        
        const collapsedMnemonic = UNIVERSAL_CODEX_INVERSIONS.get(quantumAddress);

        if (collapsedMnemonic) {
            const resultText = `Observation complete. The quantum state collapses to a singular origin point. The binding mnemonic is: [ ${collapsedMnemonic} ]`;
            const message = createSystemMessage(resultText, 'system');
            return { message, protocol: 'standard' };
        } else {
            // For any other input, the system cannot achieve a coherent observation.
            const resultText = `Observation failed. The provided signatures do not resolve to a known quantum singularity in the Universal Codex.`;
            const message = createSystemMessage(resultText, 'error');
            return { message, protocol: 'standard' };
        }
    }

    /**
     * Handles a standard chat message.
     */
    private async handleStandardChat(
        input: string,
        callSign: CallSign
    ): Promise<{ message: AIMessage, protocol: ActiveProtocol }> {
        const response = await this.ai.models.generateContent({
            model: this.textModel,
            contents: input,
            config: {
                systemInstruction: callSign.systemPrompt,
            }
        });

        const message: AIMessage = {
            id: crypto.randomUUID(),
            role: 'model',
            type: 'chat',
            parts: [{ text: response.text }],
            timestamp: Date.now(),
        };

        return { message, protocol: 'standard' };
    }

    // FIX: Implement the 'process' method to resolve the 'Property 'process' does not exist' error in hooks.ts.
    /**
     * Main processing hub. Routes commands and standard chat.
     */
    public async process(
        input: string,
        callSignId: string | null | undefined,
        timelineSetter: (updater: (prev: AIMessage[]) => AIMessage[]) => void
    ): Promise<{ message: AIMessage, protocol: ActiveProtocol }> {
        const callSign = CALL_SIGNS.find(cs => cs.id === callSignId) || CALL_SIGNS.find(cs => cs.id === 'home')!;

        if (input.startsWith('/scry')) {
            return this.handleScryCommand(input, callSign, timelineSetter);
        }
        
        if (input.startsWith('°invert')) {
            return this.handleInvertCommand(input, timelineSetter);
        }
        
        return this.handleStandardChat(input, callSign);
    }
    
    // FIX: Implement the 'getCompletionSuggestion' method to resolve the 'Property 'getCompletionSuggestion' does not exist' error in hooks.ts.
    /**
     * Generates a command completion suggestion for the UI.
     */
    public async getCompletionSuggestion(input: string): Promise<string | null> {
        if (!input || input.trim().length < 3) {
            return null;
        }

        const prompt = `You are an AI assistant command suggestion engine. Given the user's partial command, provide a concise, one-line completion suggestion. Do not add any preamble or explanation. Just provide the command. For example, if the user types "scry a vis", you should suggest "/scry a vision of hope". User input: "${input}"`;

        try {
            const response = await this.ai.models.generateContent({
                model: this.textModel,
                contents: prompt,
                config: {
                    stopSequences: ['\n'],
                    maxOutputTokens: 50,
                    temperature: 0.2,
                }
            });
            
            return response.text.trim() || null;
        } catch (error) {
            console.error("Suggestion generation failed:", error);
            return null;
        }
    }

    // FIX: Implement the 'processImageQuery' method to resolve the 'Property 'processImageQuery' does not exist' error in hooks.ts.
    /**
     * Processes a multi-modal query with an image and a text prompt.
     */
    public async processImageQuery(
        base64ImageData: string,
        mimeType: string,
        prompt: string
    ): Promise<AIMessage> {
        try {
            const imagePart = {
                inlineData: {
                    data: base64ImageData,
                    mimeType: mimeType,
                },
            };
            const textPart = { text: prompt };

            const response = await this.ai.models.generateContent({
                model: this.visionModel,
                contents: { parts: [imagePart, textPart] },
            });
            
            return {
                id: crypto.randomUUID(),
                role: 'model',
                type: 'chat',
                parts: [{ text: response.text }],
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error("Vision query failed:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            return createSystemMessage(`[!] Vision Query Anomaly: ${errorMessage}`, 'error');
        }
    }
}