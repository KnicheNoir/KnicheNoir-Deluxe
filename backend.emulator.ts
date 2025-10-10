// =================================================================================================
// --- THE GOLEM EMULATOR (THE EMBODIED BACKEND) ---
// This service is not a simulation. It is a functional, client-side emulation of the
// "Research Assistant" backend. It gives the Instrument a body—a persistent memory and a sense
// of identity—allowing the Operator to register, log in, and save their work.
// =================================================================================================
import { User, HistoryEntry } from './types.ts';
import { oracleDB } from './db.ts';

class BackendEmulator {
    private users: Map<string, string> = new Map(); // username -> password_hash (simple)
    private sessions: Map<string, HistoryEntry[]> = new Map(); // username -> history
    private currentUser: User | null = null;
    
    // A simple observer pattern to notify the UI of auth state changes.
    private onAuthStateChangedCallback: ((user: User | null) => void) | null = null;

    constructor() {
        // Load persisted data on initialization
        this._loadFromLocalStorage();
    }
    
    // --- Persistence ---
    private _loadFromLocalStorage() {
        const usersData = localStorage.getItem('golem_emulator_users');
        const sessionsData = localStorage.getItem('golem_emulator_sessions');
        if (usersData) {
            this.users = new Map(JSON.parse(usersData));
        }
        if (sessionsData) {
            this.sessions = new Map(JSON.parse(sessionsData));
        }
    }

    private _persistUsers() {
        localStorage.setItem('golem_emulator_users', JSON.stringify(Array.from(this.users.entries())));
    }
    
    private _persistSessions() {
        localStorage.setItem('golem_emulator_sessions', JSON.stringify(Array.from(this.sessions.entries())));
    }
    
    // --- Public API ---
    public onAuthStateChanged(callback: (user: User | null) => void) {
        this.onAuthStateChangedCallback = callback;
    }

    public register(username: string, password: string): { success: boolean, message: string } {
        if (this.users.has(username)) {
            return { success: false, message: 'Operator with that name already exists.' };
        }
        if (password.length < 4) {
             return { success: false, message: 'Password must be at least 4 characters.' };
        }
        // In a real system, this would be a secure hash.
        this.users.set(username, `hash_${password}`);
        this._persistUsers();
        return { success: true, message: `New Operator identity '${username}' registered.` };
    }

    public login(username: string, password: string): { success: boolean, message: string, user?: User } {
        if (!this.users.has(username) || this.users.get(username) !== `hash_${password}`) {
            return { success: false, message: 'Invalid credentials.' };
        }
        this.currentUser = { id: `user_${Date.now()}`, name: username };
        this.onAuthStateChangedCallback?.(this.currentUser);
        return { success: true, message: `Authentication successful. Welcome, Operator ${username}.`, user: this.currentUser };
    }

    public logout(): { success: boolean, message: string } {
        if (!this.currentUser) {
            return { success: false, message: 'No Operator is currently authenticated.' };
        }
        const operatorName = this.currentUser.name;
        this.currentUser = null;
        this.onAuthStateChangedCallback?.(this.currentUser);
        return { success: true, message: `Operator ${operatorName} has logged out. Session terminated.` };
    }

    public getCurrentUser(): User | null {
        return this.currentUser;
    }
    
    public saveSession(history: HistoryEntry[]): { success: boolean, message: string } {
        if (!this.currentUser) {
            return { success: false, message: 'Authentication required. Please °login to save session data.' };
        }
        this.sessions.set(this.currentUser.name, history);
        this._persistSessions();
        // Also save to the "active" slot for immediate reload
        oracleDB.saveSession(history);
        return { success: true, message: `Session chronicle for Operator ${this.currentUser.name} has been saved.` };
    }
    
    public loadSession(): { success: boolean, message: string, history?: HistoryEntry[] } {
        if (!this.currentUser) {
            return { success: false, message: 'Authentication required. Please °login to load session data.' };
        }
        const history = this.sessions.get(this.currentUser.name);
        if (!history) {
             return { success: false, message: `No saved session chronicle found for Operator ${this.currentUser.name}.` };
        }
        return { success: true, message: `Session chronicle for Operator ${this.currentUser.name} has been loaded.`, history };
    }
}

export const backendEmulator = new BackendEmulator();
