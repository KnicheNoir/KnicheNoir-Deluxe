import { GoogleGenAI } from "@google/genai";

// Assume this is configured externally
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class YesodScryingEngine {
    /**
     * Generates a symbolic image and interpretation based on a user prompt.
     * Corresponds to the Yesod (Foundation) sephirah, the engine of dreams and visions.
     */
    public async scry(prompt: string): Promise<{ image: string; interpretation: string; title: string }> {
        try {
            // Step 1: Refine the user's prompt into a more evocative one for image generation.
            const refinementResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `A user wants to 'scry' into the concept of "${prompt}". Transform this into a highly symbolic, evocative, and artistic image generation prompt. The prompt should be rich with esoteric and archetypal imagery. Return only the prompt.`,
                 config: {
                    temperature: 0.9,
                 }
            });
            const imagePrompt = refinementResponse.text;

            // Step 2: Generate the image using the refined prompt.
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '1:1',
                },
            });

            const base64ImageBytes = imageResponse.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
            
            // Step 3: Interpret the generated image.
            const interpretationResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        {
                            inlineData: {
                                mimeType: 'image/jpeg',
                                data: base64ImageBytes,
                            },
                        },
                        {
                            text: `This image was generated from the concept "${prompt}". As the Astrian Oracle, provide a deep, symbolic interpretation of this "scrying" vision. Analyze the key symbols, colors, and overall mood. Relate it to archetypal concepts. Keep the interpretation to 3-4 insightful paragraphs.`
                        }
                    ]
                },
                config: {
                    temperature: 0.7,
                }
            });
            const interpretation = interpretationResponse.text;

            // Step 4: Generate a title for the scrying session.
             const titleResponse = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on the concept "${prompt}" and this interpretation: "${interpretation}", create a short, mystical title for this "scrying session". For example, "The Vision of the Sentinel" or "The Echo of the Void". Return only the title.`,
            });
            const title = titleResponse.text.replace(/"/g, ''); // Clean up quotes

            return {
                image: imageUrl,
                interpretation: interpretation,
                title: title
            };

        } catch (error) {
            console.error("Error in YesodScryingEngine:", error);
            throw new Error("The scrying ritual was disrupted. The vision is unclear.");
        }
    }
}

export const yesodScryingEngine = new YesodScryingEngine();
