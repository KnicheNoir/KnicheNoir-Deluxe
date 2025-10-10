// =================================================================================================
// --- ORACLE DB (LOCAL PERSISTENCE) ---
// This service provides a simple persistence layer for anonymous session data, allowing the
// Operator to restore an unauthenticated session. Authenticated sessions are managed by the server.
// =================================================================================================

import { HistoryEntry } from './types.ts';

class OracleDB {
  private readonly storageKey = 'astrian_anonymous_session_v1';

  /**
   * Saves the current session history for an anonymous user to localStorage.
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
   * Loads the anonymous session history from localStorage.
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
   * Clears any saved anonymous session history from localStorage.
   */
  public clearSession(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const oracleDB = new OracleDB();