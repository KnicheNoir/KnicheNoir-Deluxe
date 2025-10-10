// A simplified set of types needed for the backend.
// In a larger project, this might be a shared library.

export interface User {
    id: string;
    name: string;
}

export type HistoryEntryType =
  | 'USER' | 'ORACLE_RESPONSE' | 'SYSTEM' | 'ERROR' | 'HELP'
  | 'SEPHIROTH_ANALYSIS' | 'SHOR_ANALYSIS'
  | 'GEVURAH_SCAN_ANALYSIS' | 'GEVURAH_EXECUTION' | 'GRAND_QUERY_EXECUTION_RESULT'
  | 'INGESTION_ANALYSIS' | 'TRANSLITERATION_RESULT'
  | 'MEDITATION_SESSION' | 'ASTROMORPHOLOGICAL_TRIANGULATION' | 'SYSTEM_PROCESSING'
  | 'LIVING_GLYPHS_RESULT' | 'CELESTIAL_CIPHER_ANALYSIS' | 'GEVURAH_SIMULATION_RESULT'
  | 'GEVURAH_BLUEPRINT_RESULT' | 'GRAND_WORK_MAP' | 'HOLOGRAPHIC_ANALYSIS'
  | 'CYMATICS_RESULT' | 'MUSIC_COMPOSITION' | 'SELF_OBSERVATION_RESULT' | 'AUTH_RESULT'
  | 'SESSION_MANAGER' | 'NETZACH_ANALYSIS' | 'PROPHECY_RESULT';

export interface HistoryEntry {
    id: string;
    type: HistoryEntryType;
    content: any;
    sender: 'user' | 'oracle' | 'system' | 'engine';
}
