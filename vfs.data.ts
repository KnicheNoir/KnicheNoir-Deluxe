// =================================================================================================
// --- VIRTUAL FILE SYSTEM SNAPSHOT ---
// This file contains a snapshot of the application's source code as raw strings.
// It serves as the in-memory file system for the Gevurah simulation engine, allowing it
// to "read" and "write" files without violating browser security constraints.
// This is a cornerstone of the "Architectural Honesty" principle.
// =================================================================================================

export const VIRTUAL_FILE_SYSTEM_SNAPSHOT: Record<string, string | null> = {
    // Files to be consolidated
    'landmark.content.ts': `// Content of landmark.content.ts`,
    'readme.content.ts': `// Content of readme.content.ts`,
    'rituals.content.ts': `// Content of rituals.content.ts`,
    'codex.data.ts': `// Content of codex.data.ts`,
    'dataModels.ts': `// Content of dataModels.ts`,
    'unimatic.kernel.ts': `// Content of unimatic.kernel.ts`,
    'landmark.txt': `// Content of landmark.txt`,
    'home.data.ts': `// Content of home.data.ts`,
    'rituals.ts': `// Content of rituals.ts`,
    'rituals.data.ts': `// Content of rituals.data.ts`,
    'cymatics.data.ts': `// Content of cymatics.data.ts`,

    // Files to be modified
    'chronicles.data.ts': `// This file consolidates the content of the project's canonical markdown files
// to make them easily importable by the Scribe's Press compiler.

const landmarkContent = \`## The Astrian Key: Prime Directive & Grand Unified Architecture (Canon v4.0)
...
\`;

const readmeContent = \`# The Astrian Key™: The Instrument of "I Am"
...
\`;

export const canonLog = \`[This chronicle has not yet been written. The path continues.]\`;

export const conversationHistory = \`The user then provided a critical insight...\`;

export const landmark = landmarkContent;
export const readme = readmeContent;
`,
    'willow.ts': `import { ... } from './types.ts'; 
import { ... } from './dataModels.ts'; // <--- To be changed

class WillowNetwork {
    public async initialize(): Promise<void> {
        const data = JSON.parse(willowSchema); // <--- To be changed
        // ...
    }
}
export const willowNetwork = new WillowNetwork();
`,
    'codex.ts': `import { CodexEntry } from './types.ts';
import { codexData } from './codex.data.ts'; // <--- To be changed

class Codex {
    public async initialize(): Promise<void> {
        codexData.forEach(entry => { // <--- To be changed
            // ...
        });
    }
}
export const codex = new Codex();
`,
    'universal_codex.data.ts': `import { CodexEntry } from './types.ts';
import { bookOfLifeContent } from './rituals.content.ts'; // <--- To be changed

export const UNIVERSAL_CODEX_RAW: CodexEntry[] = [
    // ...
];
`,
    'gevurah.engine.ts': `export class GevurahEngine {
    public runScript(script: string): { output: string[], finalState: GevurahEngineState } {
        const { program, labels } = parseGevurahScript(script);
        // ... engine logic ...
        while (state.pc >= 0 && state.pc < program.length) {
            // ...
        }
        // POTENTIAL BUG: No return if program is empty!
    }
}`,
    'unimatics.kernel.ts': `
export function calculateDerivative(node: AstNode, variable: string): AstNode {
    switch (node.type) {
        // ...
        case 'unaryOp': {
            const opName = node.op;
            switch (node.op) { // Mismatch here, might cause issues
                case 'asin': {
                     const one = { type: 'number', value: 1 };
                     // BUG: 'one' is not defined here.
                     const one_minus_u2: AstNode = { type: 'binaryOp', op: '-', left: one, ... };
                }
                // BUG: Missing sinh, cosh, tanh cases
                default:
                    const _: never = node.op; // BUG: This will throw error if cases are missing
            }
        }
    }
}
`
};