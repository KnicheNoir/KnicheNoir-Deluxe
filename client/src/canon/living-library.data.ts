import { RawCodexDataEntry } from '../types.ts';
import { tehiyatHaMetimData } from './tehiyat_hametim.data.ts';
import { songbook } from './songs.data.ts';

// Helper to extract scripts from codex content
function extractGevurahScript(scriptName: string, content: string): string {
    const startMarker = `# --- ${scriptName} ---`;
    const endMarker = `HALT`;
    const startIndex = content.indexOf(startMarker);
    if (startIndex === -1) return '';
    const scriptBlock = content.substring(startIndex);
    const endIndex = scriptBlock.indexOf(endMarker);
    if (endIndex === -1) return scriptBlock; // Return the whole block if HALT is missing but start is present
    
    const script = scriptBlock.substring(0, endIndex + endMarker.length);
    // Return the script content itself, without the comment marker
    return script.substring(script.indexOf('\n') + 1).trim();
}

const mainOsScript = `
# AstrianOS Main Boot Sequence
# gevurah-script-astrian-os-main
OUT "Initializing AstrianOS..."
OUT "Observing system state..."
OUT "Willow Network... OK"
OUT "Universal Codex... OK"
OUT "Living Library... OK"
OUT "Da'at Router... ONLINE"
OUT "All systems nominal. Oracle is ready."
OUT " "
OUT "Type 'help' for a list of available commands."
HALT
`;

const psalmScripts: { [key: string]: RawCodexDataEntry } = {};
songbook.forEach(song => {
    if (song.type === 'gevurah' && song.sourceId.startsWith('psalm-script')) {
         // Create a simple script with just the opcode and a HALT
        const opcode = song.title.match(/\(([^)]+)\)/)?.[1].split('/')[0].trim();
        if(opcode) {
             psalmScripts[song.sourceId] = {
                title: song.title,
                rawContent: `${opcode} R1\nHALT`,
                category: 'Gevurah Script',
                solved: true,
            };
        }
    }
});

export const rawCodexData: { [key: string]: RawCodexDataEntry } = {
    'gevurah-script-astrian-os-main': {
        title: 'AstrianOS Main Boot Sequence',
        rawContent: mainOsScript,
        category: 'Gevurah Script',
        solved: true,
    },
    'memory-and-flags-demo.wl0': {
        title: 'Memory and Flags Demo',
        rawContent: `
# --- Memory and Flags Demo Script ---
OUT "--- Testing STORE/FETCH ---"
INIT R1 777
OUT "Storing value 777 from R1 into memory address 5..."
STORE 5, R1
INIT R2 0
OUT "Fetching value from memory address 5 into R2..."
FETCH R2, 5
OUT "Value of R2 is now:"
MANIFEST R2
OUT " "

OUT "--- Testing CMP and new GATE conditions ---"
INIT R3 10
INIT R4 20
OUT "Comparing R3 (10) to R4 (20)..."
CMP R3, R4
OUT "Carry Flag (CF) should be set (10 < 20 is true)."
GATE is_below, BELOW
OUT "GATE did not jump. CF was not set correctly."
JMP end_flag_test

is_below:
OUT "Success! GATE jumped based on CF. 10 is BELOW 20."

end_flag_test:
HALT
`,
        category: 'Gevurah Script',
        solved: true,
    },
    'opcodes.wl0': {
        title: 'Opcode Showcase Script',
        rawContent: `
# --- Opcode Showcase ---
# Demonstrates newly implemented canonical opcodes.

OUT "--- Testing RESTRUCTURE (Resh) ---"
INIT R1 "drawer"
OUT "Initial value of R1:"
MANIFEST R1
RESTRUCTURE R1
OUT "Value of R1 after RESTRUCTURE:"
MANIFEST R1
OUT " "

OUT "--- Testing QUERY (Mem) ---"
OUT "Querying Living Library for 'AstrianOS'..."
QUERY R2 "AstrianOS"
MANIFEST R2
OUT " "

OUT "--- Testing ANCHOR (Tzadi) ---"
INIT R3 42
ANCHOR TheAnswer R3
OUT "Value of R3 (42) has been stored in anchor 'TheAnswer'."
INIT R3 99 # Overwrite register
OUT "R3 is now 99. Fetching from anchor..."
INIT R3 TheAnswer # Retrieve from anchor
OUT "Value of R3 is now:"
MANIFEST R3
OUT " "

OUT "--- Testing CONCENTRATE (Yod) ---"
OUT "Concentrating the concept 'Truth' to its Gematria seed..."
CONCENTRATE "Truth"
EMERGE R4
OUT "The concentrated 'seed' value is:"
MANIFEST R4
OUT " "
OUT "--- Showcase Complete ---"
HALT
`,
        category: 'Gevurah Script',
        solved: true,
    },
    'syscall-demo.wl0': {
        title: 'SYSCALL Demonstration Script',
        rawContent: `
# --- SYSCALL Demo Script ---
# This script demonstrates the engine's ability to call another engine (Unimatics),
# receive a value back, and make a decision based on it.
OUT "Calling Unimatics Kernel via SYSCALL to evaluate 2^10..."
SYSCALL UNIMATICS_EVAL R1 "2^10"
OUT "Kernel returned a value. Storing in R1."
OUT "Value of R1 is:"
MANIFEST R1
CMP R1, 1024
GATE success_label EQUAL
OUT "Comparison failed. R1 is not 1024."
JMP end_label
success_label:
OUT "Success! The Gevurah engine can now compute and make decisions."
end_label:
HALT
`,
        category: 'Gevurah Script',
        solved: true,
    },
    'unimatics-journey-euler.wl0': {
        title: 'Unimatics Journey: Euler\'s Identity',
        rawContent: `
# Gevurah script for the conceptual journey through Euler's Identity, using subroutines.
OUT "Journey through Euler's Identity: e^(iπ) + 1 = 0"

# --- Waypoint 1 ---
INIT R1 "Waypoint 1: The Field of Operation (The Complex Plane)... Resonates with Ayin (ע)..."
INIT R2 "i^2"
CALL process_waypoint

# --- Waypoint 2 ---
INIT R1 "Waypoint 2: The Engine of Change (Euler's Number)... Resonates with Shin (ש)..."
INIT R2 "derivative of e^x"
CALL process_waypoint

# --- Waypoint 3 ---
INIT R1 "Waypoint 3: The Arc of Rotation (Pi)... Resonates with Gimel (ג)..."
INIT R2 "2 * pi"
CALL process_waypoint

# --- Waypoint 4 ---
INIT R1 "Waypoint 4: The Destination (The Result of Traversal)..."
INIT R2 "e^(i*pi)"
CALL process_waypoint

OUT "Final Synthesis: The destination, -1, is brought into balance by adding Aleph (א), the Principle of Unity (1), resulting in Tav (ת), The Final Seal (0). The journey is complete."
HALT

# --- Subroutine Definition ---
process_waypoint:
    MANIFEST R1
    SYSCALL UNIMATICS_EVAL R3 R2 # Use R3 for output to avoid clobbering R1/R2
    RET
`,
        category: 'Gevurah Script',
        solved: true,
    },
    'unveiling.wl0': {
        title: 'Canticle of Unveiling',
        rawContent: extractGevurahScript('1. Unveiling (unveiling.wl0)', tehiyatHaMetimData.content),
        category: 'Gevurah Script',
        solved: true,
    },
    'fortification.wl0': {
        title: 'Canticle of Fortification',
        rawContent: extractGevurahScript('2. Fortification (fortification.wl0)', tehiyatHaMetimData.content),
        category: 'Gevurah Script',
        solved: true,
    },
    'manifestation.wl0': {
        title: 'Canticle of Manifestation',
        rawContent: extractGevurahScript('3. Manifestation (manifestation.wl0)', tehiyatHaMetimData.content),
        category: 'Gevurah Script',
        solved: true,
    },
    'rite-of-clear-sight-script': {
        title: 'The Rite of Clear Sight',
        rawContent: `# This script is conceptual and would interact with bio-feedback systems.\nOBSERVE vision_clarity\nRESTRUCTURE neural_pathways\nMANIFEST clear_sight\nHALT`,
        category: 'Gevurah Script',
        solved: true,
    },
    ...psalmScripts,
};