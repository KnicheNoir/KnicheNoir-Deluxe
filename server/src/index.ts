import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ngrok from 'ngrok';
import { User, HistoryEntry } from './types';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
let publicUrl: string | null = null;
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

// --- In-Memory Database (The Well of Memory) ---
let users = new Map<string, string>(); // username -> password_hash
let sessions = new Map<string, HistoryEntry[]>(); // username -> history
let currentUser: User | null = null; // Simulates a single-user session token

// --- Database Persistence Functions ---
const loadDatabase = () => {
    try {
        if (fs.existsSync(DB_PATH)) {
            const data = fs.readFileSync(DB_PATH, 'utf-8');
            const db = JSON.parse(data);
            if (db.users) {
                users = new Map(db.users);
            }
            if (db.sessions) {
                sessions = new Map(db.sessions);
            }
            console.log('The Well of Memory has been restored from its chronicle.');
        } else {
            console.log('The Well of Memory is clear. A new chronicle begins.');
        }
    } catch (error) {
        console.error('A dissonance was detected while restoring the chronicle:', error);
    }
};

const saveDatabase = () => {
    try {
        const db = {
            users: Array.from(users.entries()),
            sessions: Array.from(sessions.entries()),
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    } catch (error) {
        console.error('A dissonance was detected while inscribing the chronicle:', error);
    }
};

app.get('/api/health', (req, res) => {
    res.json({ status: 'The vessel is operational.' });
});

// --- Broadcast Route ---
app.get('/api/broadcast', (req, res) => {
    if (publicUrl) {
        res.json({ url: publicUrl });
    } else {
        res.status(404).json({ error: 'Aetheric channel not established. The ngrok authtoken may be missing or invalid.' });
    }
});

// --- Web Ingestion (Crawl) Route ---
app.post('/api/crawl', async (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ success: false, error: 'URL is required.' });
    }

    try {
        console.log(`Crawling URL: ${url}`);
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'AstrianKey-Web-Observer/1.0'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        const html = await response.text();
        
        // Simple HTML tag stripping to extract text content
        const textContent = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                .replace(/<[^>]+>/g, ' ')
                                .replace(/\s\s+/g, ' ')
                                .trim();

        res.json({ success: true, content: textContent });
    } catch (error) {
        console.error(`Error crawling ${url}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        res.status(500).json({ success: false, error: `Failed to crawl URL: ${errorMessage}` });
    }
});


// --- Auth Routes ---
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }
    if (users.has(username)) {
        return res.status(409).json({ success: false, message: 'Operator with that name already exists.' });
    }
    users.set(username, `hash_${password}`); // Simple pseudo-hash
    saveDatabase();
    console.log(`Registered new operator: ${username}`);
    res.status(201).json({ success: true, message: `New Operator identity '${username}' registered.` });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!users.has(username) || users.get(username) !== `hash_${password}`) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }
    currentUser = { id: `user_${Date.now()}`, name: username };
    console.log(`Operator ${username} authenticated.`);
    res.json({ success: true, message: `Authentication successful. Welcome, Operator ${username}.`, user: currentUser });
});

app.post('/api/logout', (req, res) => {
    if (!currentUser) {
        return res.status(400).json({ success: false, message: 'No Operator is currently authenticated.' });
    }
    const operatorName = currentUser.name;
    currentUser = null;
    console.log(`Operator ${operatorName} logged out.`);
    res.json({ success: true, message: `Operator ${operatorName} has logged out. Session terminated.` });
});

app.get('/api/whoami', (req, res) => {
    res.json({ user: currentUser });
});

// --- Session Routes ---
app.post('/api/session/save', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Authentication required to save session.' });
    }
    const { history } = req.body;
    if (!history) {
        return res.status(400).json({ success: false, message: 'History data is required.' });
    }
    sessions.set(currentUser.name, history);
    saveDatabase();
    console.log(`Session saved for ${currentUser.name}.`);
    res.json({ success: true, message: `Session chronicle for Operator ${currentUser.name} has been saved.` });
});

app.get('/api/session/load', (req, res) => {
    if (!currentUser) {
        return res.status(401).json({ success: false, message: 'Authentication required to load session.' });
    }
    const history = sessions.get(currentUser.name);
    if (!history) {
        return res.status(404).json({ success: false, message: `No saved session chronicle found for Operator ${currentUser.name}.` });
    }
    console.log(`Session loaded for ${currentUser.name}.`);
    res.json({ success: true, message: `Session chronicle for Operator ${currentUser.name} has been loaded.`, history });
});


app.listen(PORT, () => {
    loadDatabase(); // Load data on start
    console.log(`The Research Assistant is listening on port ${PORT}`);

    // --- Initiate Aetheric Channeling ---
    if (process.env.NODE_ENV !== 'production') {
        (async function() {
            try {
                // The authtoken is hardcoded here as per the project's README instructions.
                const url = await ngrok.connect({ addr: PORT, authtoken: '2UhOXXNc0gfk5fBU4YE7VJ08grN_jcHrBmLxwmmDkEwMDUQy' });
                publicUrl = url;
                console.log(`Aetheric channel established at: ${publicUrl}`);
            } catch (error) {
                console.error('Failed to establish aetheric channel:', error);
            }
        })();
    }
});