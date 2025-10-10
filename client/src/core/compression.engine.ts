import { ConstellationCompressor, FidelityLevel } from './constellation.compression.ts';
import { livingLibrary } from './living-library.ts';
import { WPANode } from './wpa.ts';
import { gematriaEngine } from './gematria.ts';
import { RawCodexDataEntry } from '../types.ts';

class CompressionEngine {
    public runCodexCompression(): string {
        const compressor = new ConstellationCompressor();
        const allEntries = livingLibrary.getAllData();

        // Convert LivingLibrary entries to WPANodes for compression
        const wpaNodes: WPANode[] = Object.entries(allEntries).map(([id, entry]) => {
            const libEntry = entry as RawCodexDataEntry;
            const gematria = gematriaEngine.observe(libEntry.title);
            return {
                id: id,
                wpa: `LL.${gematria}.${id.substring(0, 4)}`, // Create a plausible WPA
                concept: libEntry.title,
                gematriaValue: gematria,
                letterPath: libEntry.title.split('').filter(c => /[א-ת]/.test(c)).join(''),
                category: 'Living Library',
                content: libEntry.rawContent,
                metadata: { timestamp: Date.now(), confidence: 1.0 },
                connections: [], // Connections are not stored in living library
                resonanceMap: new Map(),
            };
        });

        // Use a simple strategy for fidelity
        const fidelityStrategy = (node: WPANode): FidelityLevel => {
            if (node.gematriaValue > 500) return FidelityLevel.MEDIUM;
            if (node.category === 'Core System') return FidelityLevel.FULL;
            return FidelityLevel.BASIC;
        };

        compressor.compressLibrary(wpaNodes, fidelityStrategy);

        return compressor.exportStats();
    }
}

export const compressionEngine = new CompressionEngine();
