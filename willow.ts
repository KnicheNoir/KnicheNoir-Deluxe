// =================================================================================================
// --- WILLOW NETWORK ---
// The service layer for the Willow Network. It provides an interface for asynchronously
// loading and querying the pre-computed Letterform Index, which is the foundational
// dataset for all structural and gematria-based analysis in the system.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { WillowData, WillowNode } from './types.ts'; 
import { gematriaEngine } from './gematria.ts';
import { HEBREW_GEMATRIA_MAP } from './constants.ts';
import { willowData } from './willow.data.ts';

class WillowNetwork {
    private registry: Map<number, WillowNode> = new Map();
    private pathCache: Map<string, number> = new Map();
    private letterforms: Map<string, WillowData> = new Map();
    private gematriaMap: Map<number, string> = new Map();
    
    public isInitialized = false;

    /**
     * Asynchronously parses and loads the pre-computed Letterform Index.
     * This is a core part of the Aleph Protocol's non-blocking startup.
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) return;
        
        try {
            willowData.forEach((nodeData, index) => {
                this.letterforms.set(nodeData.letter, nodeData);
                this.letterforms.set(nodeData.name.toLowerCase(), nodeData);

                // For reverse lookups (e.g., in Compass Cipher)
                const reducedGematria = gematriaEngine.observeReduced(nodeData.letter);
                if (!this.gematriaMap.has(reducedGematria)) {
                    this.gematriaMap.set(reducedGematria, nodeData.letter);
                }

                const node: WillowNode = {
                    address: index + 1,
                    concept: nodeData.name,
                    value: nodeData.gematria,
                    type: 'principle'
                };
                this.registry.set(node.address, node);
            });
            this.isInitialized = true;
        } catch (e) {
            console.error("Failed to initialize Willow Network:", e);
        }
    }
    
    public getAllLetters(): WillowData[] {
        return willowData;
    }
    
    public getIslandPeers(island: number, excludeLetter: string): WillowData[] {
        return willowData.filter(w => w.island === island && w.letter !== excludeLetter);
    }
    
    public transliterate(hebrewText: string): string {
         const transliterationMap: { [key: string]: string } = {
            'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'ch', 'ט': 't', 'י': 'y',
            'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm', 'ם': 'm', 'נ': 'n', 'ן': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p',
            'ף': 'p', 'צ': 'tz', 'ץ': 'tz', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't'
        };
        return hebrewText.split('').map(char => transliterationMap[char] || char).join('');
    }

    public getLetterData(letter: string): WillowData | undefined {
        return this.letterforms.get(letter);
    }
    
    public getLetterByReducedGematria(value: number): string {
        return this.gematriaMap.get(value) || '?';
    }
    
    public resolvePath(path: string, modifiers: Set<string> = new Set()): number {
        const cacheKey = `${path}|${[...modifiers].sort().join(',')}`;
        if (this.pathCache.has(cacheKey)) {
            return this.pathCache.get(cacheKey)!;
        }

        let value = gematriaEngine.observe(path);

        // Apply logical operator modifiers
        if (modifiers.has('mem')) { // Mem (Water) - Invert, seek opposite
             value = Math.abs(1000 - value);
        }
        if (modifiers.has('nun')) { // Nun (Fish) - Emerge, surface potential
            value = value * 2;
        }
        if (modifiers.has('vav')) { // Vav (Nail) - Connect, amplify
            value = value + 6;
        }

        this.pathCache.set(cacheKey, value);
        return value;
    }
}

export const willowNetwork = new WillowNetwork();
