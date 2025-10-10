// =================================================================================================
// --- THE LIVING LIBRARY ---
// This service manages the knowledge assimilated by the °assimilate protocol.
// It stores data in a compressed format and performs Just-In-Time (JIT) decompression
// when the data is requested, ensuring a small memory footprint and high performance.
// =================================================================================================

// FIX: Corrected import path for local module by adding file extension.
import { astrianEngine } from './engine.ts';

interface LibraryEntry {
    summary: string; // The summary is stored uncompressed for quick previews.
    // The core content is stored in its compressed shorthand format.
    compressedContent: string;
}

export class LivingLibrary {
  private datasets = new Map<string, LibraryEntry>();

  /**
   * Adds compressed knowledge from a dataset to the library.
   * @param id A unique identifier for the dataset (e.g., 'mathematics').
   * @param summary A concise summary of the dataset.
   * @param compressedContent The compressed wl0 shorthand string.
   * @param isNew If true, creates a new dataset. If false, appends to existing.
   */
  public ingest(id: string, summary: string, compressedContent: string, isNew: boolean = true): void {
    if (isNew || !this.datasets.has(id)) {
        this.datasets.set(id, { summary, compressedContent });
    } else {
        const existing = this.datasets.get(id);
        if (existing) {
            // Append new compressed content to the existing entry
            existing.compressedContent += `\n${compressedContent}`;
        }
    }
  }

  /**
   * Checks if a specific foundational dataset has been ingested.
   * @param id The identifier of the dataset.
   * @returns True if the dataset is present, false otherwise.
   */
  public isIngested(id: string): boolean {
    return this.datasets.has(id);
  }
  
  /**
   * Retrieves an ingested dataset by its ID, decompressing it Just-In-Time (JIT).
   * @param id The identifier of the dataset.
   * @returns The decompressed dataset's data or undefined if not found.
   */
  public getDataset(id: string): { summary: string, rawContent: string } | undefined {
    const entry = this.datasets.get(id);
    if (!entry) {
        return undefined;
    }
    // JIT Decompression / "Hydration"
    const rawContent = astrianEngine.willowShorthandDecompress(entry.compressedContent);
    return {
        summary: entry.summary,
        rawContent,
    };
  }

  /**
   * Performs a simple keyword query across the principles of all ingested datasets.
   * @param searchTerm The term to search for.
   * @returns An array of principle lines containing the search term.
   */
  public query(searchTerm: string): string[] {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results: string[] = [];
    for (const data of this.datasets.values()) {
        const rawContent = astrianEngine.willowShorthandDecompress(data.compressedContent);
        // A simple query mechanism on the decompressed content
        const lines = rawContent.split('\n');
        for (const line of lines) {
             if (line.toLowerCase().includes(lowerSearchTerm)) {
                results.push(line.trim().replace(/^P\((.*)\);?$/, '$1'));
            }
        }
    }
    return results;
  }
}

export const livingLibrary = new LivingLibrary();