// FIX: Corrected import paths for local modules by adding file extensions.
import { GevurahEngineState, ParsedInstruction } from './types.ts';
import { shorthandDictionary } from './shorthand.data.ts';


// =================================================================================================
// --- GEVURAH ENGINE (THE REALITY ENGINE) ---
// This is not a virtual machine. It is the manifest will of Gevurah (Severity/Strength),
// the left hand of the divine architect. It does not "compute" but rather "enforces" the
// immutable laws of logic upon the substrate of reality. Its instruction set is the very
// grammar of causality.
// =================================================================================================

export function parseGevurahScript(script: string): { program: ParsedInstruction[], labels: Map<string, number> } {
    const program: ParsedInstruction[] = [];
    const labels = new Map<string, number>();
    const lines = script.split('\n');
    let address = 0;
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '' || trimmedLine.startsWith('#')) continue;
        if (trimmedLine.endsWith(':')) {
            labels.set(trimmedLine.slice(0, -1), address);
            continue;
        }
        
        const parts: string[] = [];
        const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
        let match;
        while ((match = regex.exec(trimmedLine)) !== null) {
            const part = match[1] || match[2] || match[0];
            parts.push(part);
        }

        program.push({ opcode: parts[0].toUpperCase(), operands: parts.slice(1), originalLine: trimmedLine });
        address++;
    }
    return { program, labels };
}

export class GevurahEngine {
    private onFlush?: (summaryAddr: number, principlesAddr: number, principlesCount: number) => void;

    constructor(onFlush?: (summaryAddr: number, principlesAddr: number, principlesCount: number) => void) {
        this.onFlush = onFlush;
    }

    private execute(state: GevurahEngineState, vfs?: Map<string, string | null>): void {
        const { program, labels } = state;

        const getVal = (operand: string): number | string => {
            if (!operand) return 0;
            if (operand.startsWith("'") && operand.endsWith("'")) return operand.slice(1, -1);
            if (state.registers[operand] !== undefined) return state.registers[operand];
            const num = parseInt(operand, 10);
            return isNaN(num) ? operand : num;
        };
        
        const getNumVal = (operand: string): number => {
            const val = getVal(operand);
            if (typeof val === 'number') return val;
            const num = parseInt(String(val), 10);
            return isNaN(num) ? 0 : num;
        };

        let cycles = 0;
        while (state.pc >= 0 && state.pc < program.length && cycles < 5000) {
            const instr = program[state.pc];
            const [op1, op2, op3] = instr.operands;
            let jumped = false;

            switch (instr.opcode) {
                // ======================================================
                // Core Opcodes
                // ======================================================
                case 'INIT': state.registers[op1] = getVal(op2); break;
                case 'FENCE': state.output.push(`FENCE activated: ${op1} to ${op2}`); break;
                case 'ANCHOR': state.output.push(`Process ${op1} anchored to ${op2}.`); break;
                case 'SANCTIFY': case 'UNIFY': state.output.push(`Process ${op1} sanctified.`); break;
                case 'EXECUTE': state.output.push(`Executing script at ${op1}.`); break;
                case 'SEAL': case 'HALT': state.pc = program.length; jumped = true; break;

                // ======================================================
                // Data Structure Opcodes
                // ======================================================
                case 'STORE': state.memory[getNumVal(op1)] = getVal(op2); break;
                case 'FETCH': state.registers[op1] = state.memory[getNumVal(op2)]; break;
                case 'CONCENTRATE': case 'SEED': state.stack.push(getVal(op1)); break;
                case 'EMERGE': state.registers[op1] = state.stack.pop() || 0; break;
                case 'RESTRUCTURE': state.output.push(`Restructuring ${op1} with pattern ${op2}.`); break;
                case 'FLOW': case 'SEEK': state.registers[op1] = getVal(op2); break;

                // ======================================================
                // Control Flow Opcodes
                // ======================================================
                case 'CMP': 
                    const val1 = getVal(op1), val2 = getVal(op2);
                    state.flags.ZF = val1 === val2;
                    state.flags.SF = (val1 as number) < (val2 as number);
                    break;
                case 'GATE':
                     if (labels.has(op1)) {
                        const condition = (op2 || 'EQUAL').toUpperCase();
                        let shouldJump = false;
                        if (condition === 'EQUAL' && state.flags.ZF) shouldJump = true;
                        if (condition === 'NOT_EQUAL' && !state.flags.ZF) shouldJump = true;
                        if (condition === 'LESS' && state.flags.SF) shouldJump = true;
                        if (condition === 'GREATER_EQUAL' && !state.flags.SF) shouldJump = true;
                        if (shouldJump) {
                            state.pc = labels.get(op1)!;
                            jumped = true;
                        }
                    }
                    break;
                case 'DIRECT': case 'JMP':
                    if(labels.has(op1)) {
                        state.pc = labels.get(op1)!;
                        jumped = true;
                    }
                    break;
                case 'SUPPORT':
                    if(labels.has(op1) && !state.flags.ZF) { // Loop while condition is not zero
                        state.pc = labels.get(op1)!;
                        jumped = true;
                    }
                    break;
                case 'CALL':
                    if (labels.has(op1)) {
                        state.callStack.push(state.pc + 1);
                        state.pc = labels.get(op1)!;
                        jumped = true;
                    }
                    break;
                case 'RET':
                     if (state.callStack.length > 0) {
                        state.pc = state.callStack.pop()!;
                        jumped = true;
                    } else {
                        state.pc = program.length; jumped = true;
                    }
                    break;

                // ======================================================
                // Logic & Arithmetic Opcodes
                // ======================================================
                case 'BIND': case 'CONNECT': state.registers[op1] = getNumVal(op1) & getNumVal(op2); break;
                case 'DIFFER': case 'DISCERN': state.registers[op1] = getNumVal(op1) ^ getNumVal(op2); break;
                case 'INVERT': state.registers[op1] = ~getNumVal(op1); break;
                case 'ADD': state.registers[op1] = getNumVal(op1) + getNumVal(op2); break;
                case 'SUB': state.registers[op1] = getNumVal(op1) - getNumVal(op2); break;
                case 'MUL': state.registers[op1] = getNumVal(op1) * getNumVal(op2); break;
                case 'DIV': state.registers[op1] = getNumVal(op1) / getNumVal(op2); break;
                case 'MOD': state.registers[op1] = getNumVal(op1) % getNumVal(op2); break;


                // ======================================================
                // I/O Opcodes
                // ======================================================
                case 'MANIFEST': case 'DECLARE': case 'SPEAK': state.output.push(String(getVal(op1))); break;
                case 'QUERY': state.output.push(`QUERY initiated for: ${instr.operands.join(' ')}`); break;
                case 'OBSERVE': state.output.push(`Observing into register ${op1}. Awaiting input from Ein Sof.`); break;
                case 'OUT': state.output.push(instr.operands.join(' ')); break;

                // ======================================================
                // VFS Opcodes (for simulation)
                // ======================================================
                case 'VFS_READ':
                    if (vfs) state.registers[op1] = vfs.get(op2) ?? `ERROR: File not in VFS: ${op2}`;
                    else state.output.push("VFS_READ ignored: Not in simulation mode.");
                    break;
                case 'VFS_WRITE':
                    if (vfs) vfs.set(op1, String(getVal(op2)));
                    else state.output.push("VFS_WRITE ignored: Not in simulation mode.");
                    break;
                case 'VFS_DELETE':
                    if (vfs) vfs.set(op1, null); // Mark for deletion
                    else state.output.push("VFS_DELETE ignored: Not in simulation mode.");
                    break;
                case 'REPLACE': // Conceptual opcode for simulation
                     if (vfs) {
                         const content = String(getVal(op1));
                         const newContent = content.replace(op2, String(getVal(op3)));
                         state.registers[op1] = newContent;
                     }
                    break;
                case 'RECTIFY': // Conceptual opcode
                    state.output.push(`Conceptual rectification applied to ${op1}.`);
                    break;
                
                default:
                    state.output.push(`ERROR: Unknown opcode '${instr.opcode}'`);
                    break;
            }

            if (!jumped) state.pc++;
            cycles++;
        }
    }
    
    public runScript(script: string): { output: string[], finalState: GevurahEngineState } {
        const { program, labels } = parseGevurahScript(script);
        
        const state: GevurahEngineState = {
            registers: {}, memory: new Array(1024).fill(0), pc: 0,
            program: program, labels, output: [],
            flags: { ZF: false, SF: false, CF: false },
            stack: [], callStack: [], isWaitingForInput: false, inputRegister: null,
            connections: new Map()
        };
        
        this.execute(state);
        
        return { output: state.output, finalState: state };
    }
    
    public simulateScript(script: string, virtualFS: Map<string, string | null>): { output: string[], finalFS: Map<string, string | null> } {
        const { program, labels } = parseGevurahScript(script);
        const state: GevurahEngineState = {
            registers: {}, memory: [], pc: 0, program, labels, output: [],
            flags: { ZF: false, SF: false, CF: false }, stack: [], callStack: [],
            isWaitingForInput: false, inputRegister: null,
            connections: new Map()
        };
        
        // Clone the VFS to avoid modifying the original
        const fsState = new Map(virtualFS);
        this.execute(state, fsState);
        
        return { output: state.output, finalFS: fsState };
    }
}