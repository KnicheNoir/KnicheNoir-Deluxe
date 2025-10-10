import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ngrok from 'ngrok';
import { User, HistoryEntry } from './types';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
let publicUrl: string | null = null;

app.use(cors());
// FIX: To resolve a TypeScript overload error with app.use(), an explicit path
// parameter '/' is provided. This ensures the express.json() middleware is
// correctly interpreted as a RequestHandler.
app.use('/', express.json());

// --- In-Memory Database (The Well of Memory) ---
const users = new Map<string, string>(); // username -> password_hash
const sessions = new Map<string, HistoryEntry[]>(); // username -> history
let currentUser: User | null = null; // Simulates a single-user session token

app.get('/api/health', (req, res) => {
    res.json({ status: 'The vessel is operational.' });
});

// --- Broadcast Route ---
app.get('/api/broadcast', (req, res) => {
    if (publicUrl) {
        res.json({ url: publicUrl });
    } else {
        res.status(404).json({ error: 'Aetheric channel not established. Ensure NGROK_AUTHTOKEN is configured in the server environment.' });
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
    console.log(`The Research Assistant is listening on port ${PORT}`);

    // --- Initiate Aetheric Channeling ---
    if (process.env.NODE_ENV !== 'production' && process.env.NGROK_AUTHTOKEN) {
        (async function() {
            try {
                const url = await ngrok.connect({ addr: PORT, authtoken_from_env: true });
                publicUrl = url;
                console.log(`Aetheric channel established at: ${publicUrl}`);
            } catch (error) {
                console.error('Failed to establish aetheric channel:', error);
            }
        })();
    }
});