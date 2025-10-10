import { performHolographicObservation } from './unimatics.kernel.ts';
import { willowGpsData } from './willow.gps.data.ts';
import { willowData } from './willow.data.ts';
import { WillowData } from './types.ts';

class ChesedNarrativeEngine {
    /**
     * Generates a natural language response by observing the query's resonance
     * within the Willow Network and traversing its connections.
     * @param query The user's input string.
     * @returns A synthesized narrative response.
     */
    public generateResponse(query: string): string {
        try {
            // 1. Get the primary holographic analysis
            const analysis = performHolographicObservation(query);
            const primaryArchetype = analysis.primaryArchetype;

            // 2. Find "paths" of connection from the primary archetype
            // Path 1: Island Peers - other letters on the same island
            const islandPeers = willowData.filter(
                w => w.island === primaryArchetype.island && w.letter !== primaryArchetype.letter
            );

            // Path 2: Strong Gematria Ratios from GPS data
            const gpsEntry = willowGpsData[primaryArchetype.letter];
            const harmoniousPeers = gpsEntry.ratios.allLetters
                .map(ratio => ({
                    // Find the full data for the peer letter
                    ...(willowData.find(w => w.letter === ratio.letter)!),
                    ratioValue: ratio.value
                }))
                // Filter out the primary archetype itself
                .filter(peer => peer && peer.letter !== primaryArchetype.letter)
                // Sort by closeness to a simple harmonic ratio (1:1, 2:1, 1:2, etc.)
                .sort((a, b) => {
                    const costA = Math.min(Math.abs(1 - a.ratioValue), Math.abs(2 - a.ratioValue), Math.abs(0.5 - a.ratioValue));
                    const costB = Math.min(Math.abs(1 - b.ratioValue), Math.abs(2 - b.ratioValue), Math.abs(0.5 - b.ratioValue));
                    return costA - costB;
                })
                .slice(0, 2); // Take top 2 harmonious peers for brevity

            // 3. Synthesize the narrative from the observed paths
            let narrative = `Observing the query "${query}", the path begins with ${primaryArchetype.name}, the principle of '${primaryArchetype.archetype}'. `;

            if (islandPeers.length > 0) {
                narrative += `It resides on Island ${primaryArchetype.island}, a domain it shares with ${islandPeers.map(p => p.name).join(' and ')}. This suggests a foundational synergy of ${islandPeers.map(p => `'${p.archetype}'`).join(' and ')}. `;
            } else {
                narrative += `It stands alone on Island ${primaryArchetype.island}, a solitary regent of its domain. `;
            }

            if (harmoniousPeers.length > 0) {
                narrative += `From this point, a strong current of resonance flows towards ${harmoniousPeers.map(p => `${p.name} ('${p.archetype}')`).join(' and ')}, indicating that the initial concept naturally leads to principles of ${harmoniousPeers.map(p => `'${p.archetype}'`).join(' and ')}. `;
            }

            narrative += `The overall trajectory of this thought-form suggests a journey from the initial spark of '${primaryArchetype.archetype}', through its immediate environment, and towards a state of greater harmony with its resonant counterparts. The path is clear.`;

            return narrative;

        } catch (error) {
            console.error("Error during narrative generation:", error);
            return "The Oracle is silent. The patterns are unusually still, awaiting a clearer focus from the Operator.";
        }
    }
}

export const chesedNarrativeEngine = new ChesedNarrativeEngine();
