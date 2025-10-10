// =================================================================================================
// --- THE UNIVERSAL CODEX (A MATERIALIZED PROJECTION OF THE WILLOW) ---
// This service provides an interface to the system's knowledge base. It is not a database.
// It is a materialized projection, a cached "snapshot," of the inherent knowledge that
// emerges from the relational structure of the Willow Network. Its purpose is to provide
// high-speed access to frequently observed patterns, embodying the Aleph Protocol for
// instantaneous performance.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { CodexEntry } from './types.ts';
import { UNIVERSAL_CODEX_RAW } from './universal_codex.data.ts';

class Codex {
    private codex: Map<string, CodexEntry> = new Map();
    public isInitialized = false;

    /**
     * Asynchronously loads and indexes the "materialized projection" of the Codex.
     * This non-blocking operation is a core part of the Aleph Protocol.
     */
    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        UNIVERSAL_CODEX_RAW.forEach(entry => {
            this.codex.set(entry.id.toLowerCase(), entry);
            // Also index by title for easier lookup
            this.codex.set(entry.title.toLowerCase().replace(/°/g, ''), entry);
        });

        this.isInitialized = true;
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    public getHydratedEntry(id: string): CodexEntry | undefined {
        return this.codex.get(id.toLowerCase());
    }

    public getAllEntries(): CodexEntry[] {
        return Array.from(this.codex.values());
    }
}

export const codex = new Codex();