// =================================================================================================
// --- ORACLE DB (LOCAL PERSISTENCE) ---
// This service provides a simple persistence layer for session data, allowing the Operator
// to save and restore analytical history between sessions. It embodies the principle that
// while knowledge is inherent, the path of observation is worthy of record.
// =================================================================================================

// FIX: Corrected import path for local module by adding file extension.
import { HistoryEntry } from './types.ts';

class OracleDB {
  private readonly storageKey = 'astrian_session_history_v1';

  /**
   * Saves the current session history to localStorage.
   * @param history The array of HistoryEntry objects to save.
   */
  public saveSession(history: HistoryEntry[]): void {
    try {
      const serializedHistory = JSON.stringify(history);
      localStorage.setItem(this.storageKey, serializedHistory);
    } catch (error) {
      console.error("Error saving session to OracleDB:", error);
    }
  }

  /**
   * Loads the session history from localStorage.
   * @returns The saved array of HistoryEntry objects, or null if none exists.
   */
  public loadSession(): HistoryEntry[] | null {
    try {
      const savedHistory = localStorage.getItem(this.storageKey);
      return savedHistory ? JSON.parse(savedHistory) : null;
    } catch (error) {
      console.error("Error loading session from OracleDB:", error);
      return null;
    }
  }

  /**
   * Clears any saved session history from localStorage.
   */
  public clearSession(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const oracleDB = new OracleDB();