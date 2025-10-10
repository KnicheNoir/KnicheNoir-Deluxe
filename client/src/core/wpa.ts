// Defines the Willow Path Address Node structure for the Constellation Compressor.
export interface WPANode {
    id: string;
    wpa: string; // Willow Path Address, e.g., "א.1.1"
    concept: string;
    gematriaValue: number;
    letterPath: string; // e.g., "אגד"
    category: string;
    content: string;
    metadata: {
        timestamp: number;
        confidence: number;
    };
    connections: string[]; // Array of WPAs it connects to
    resonanceMap: Map<string, number>;
}
