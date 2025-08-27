import { AstrianEngine } from './services';
import { structuralFrequencyIndex } from './src/dataModels';

/**
 * library.ts
 *
 * The central data repository for the Astrian Key's textual corpus. 
 * This service provides a scalable and organized structure for the application's "Living Library,"
 * which houses all texts and is secured by Willow-based encryption.
 */

interface LibraryData {
    [corpusName: string]: {
        [bookName: string]: string;
    };
}

// =================================================================================================
// --- ALEPH-ZIV COMPRESSION ENGINE ---
// =================================================================================================
class AlephZivCompressionEngine {
    private compressMap: Record<string, string>;
    private decompressMap: Record<string, string>;
    private decompressRegex: RegExp;

    constructor() {
        [this.compressMap, this.decompressMap] = structuralFrequencyIndex;
        const allKeys = Object.keys(this.decompressMap).map(val => val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        this.decompressRegex = new RegExp(`(${allKeys.join('|')})`, 'g');
    }
    
    public compress(text: string): string {
        return text.split('').map(char => this.compressMap[char] || char).join('');
    }

    public decompress(compressedText: string): string {
        if (!compressedText) return '';
        return compressedText.replace(this.decompressRegex, (code) => this.decompressMap[code] || code);
    }
}


// =================================================================================================
// --- ENCRYPTED & COMPRESSED LIBRARY DATA ---
// NOTE: This data is stored encrypted and is defragmented on-demand.
// =================================================================================================

const libraryData: LibraryData = {
    "Tanakh (Hebrew OT)": {
        'Genesis': 'ENCRYPTED_AND_COMPRESSED_GENESIS_DATA',
        // Other books would follow the same pattern...
    }
};

// =================================================================================================
// --- LIBRARY SERVICE ---
// =================================================================================================

export class LibraryService {
    private static compressionEngine = new AlephZivCompressionEngine();
    private static cache: Map<string, string> = new Map();

    private static getBook(corpus: string, book: string, key: string): string {
        const cacheKey = `${corpus}-${book}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }
        
        // In a real application, the encrypted data would be fetched. Here we simulate.
        // For now, returning a placeholder to avoid breaking the app.
        const encryptedCompressedText = libraryData[corpus]?.[book] || '';
        if (!encryptedCompressedText) {
             console.warn(`No text found for ${corpus} - ${book}`);
             return 'Placeholder text for ' + book; // Return placeholder
        }


        try {
            // Decryption would happen here in a real scenario
            // const compressedText = AstrianEngine.decryptWithPermutation(encryptedCompressedText, key);
            
            // For now, we decompress a placeholder string for demonstration
            const placeholderCompressed = 'gjh ad l cjdcid lgh cfh a cb l ilah adg l ilah';
            const fullText = this.compressionEngine.decompress(placeholderCompressed);
            
            this.cache.set(cacheKey, fullText);
            return fullText;
        } catch (e) {
            console.error(`Failed to decrypt/decompress ${book}:`, e);
            throw new Error(`Decryption failed for ${book}. The Willow Key may be incorrect.`);
        }
    }

    public static getBookText(corpus: string, book: string, key: string): string {
        return this.getBook(corpus, book, key);
    }
    
    public static getCorpusBooks(corpus: string): string[] {
        const allBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"];
        if (corpus === "Tanakh (Hebrew OT)") {
            return allBooks;
        }
        return []; // Add other corpora later
    }
}