
// =================================================================================================
// --- GEVURAH ENGINE (THE REALITY ENGINE) ---
// This is the core execution unit for the Astrian Key's low-level, Willow-native assembly
// language, wl0. It embodies the principle of Gevurah (Strength/Severity) through its
// unflinching, precise, and logical execution of compiled instructions.
// =================================================================================================
import { ParsedInstruction, GevurahEngineState, GevurahSimulationResult } from '../types.ts';
import { gematriaEngine } from './gematria.ts';
import { livingLibrary } from './living-library.ts';
import { astrianEngine } from './engine.ts';
import { unimaticsKernel } from './unimatics.kernel.ts';

export class GevurahEngine {
    private state: GevurahEngineState;
    private maxSteps: number;
    public onOutput: (line: string) => void = () => {};
    public onWaitingForInput: (isWaiting: boolean) => void = () => {};

    constructor(maxSteps = 5000) {
        this.maxSteps = maxSteps;
        this.state = this.getInitialState();
    }

    private getInitialState(): GevurahEngineState {
        return {
            registers: { R1: 0, R2: 0, R3: 0, R4: 0, R5: 0, R6: 0, R7: 0 },
            memory: [],
            pc: 0,
            program: [],
            labels: new Map(),
            output: [],
            flags: { ZF: false, SF: false, CF: false },
            stack: [],
            callStack: [],
            isWaitingForInput: false,
            inputRegister: null,
            connections: new Map(), // For future networking opcodes
        };
    }

    public reset(): void {
        this.state = this.getInitialState();
    }

    private parse(script: string): ParsedInstruction[] {
        const lines = script.split('\n').map(line => line.trim());
        const instructions: ParsedInstruction[] = [];
        this.state.labels.clear();

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            
            // Strip comments
            const commentIndex = line.indexOf('#');
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex).trim();
            }
            if (!line) continue;

            // Check for labels
            if (line.endsWith(':')) {
                const labelName = line.slice(0, -1);
                this.state.labels.set(labelName, instructions.length);
                continue;
            }

            const parts = line.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
            if (parts.length === 0) continue;

            const opcode = parts[0].toUpperCase();
            const operands = parts.slice(1).map(op => op.startsWith('"') && op.endsWith('"') ? op.slice(1, -1) : op);
            
            instructions.push({ opcode, operands, originalLine: lines[i] });
        }
        return instructions;
    }

    private getValue(operand: string): number | string {
        // Is it a register?
        if (this.state.registers.hasOwnProperty(operand)) {
            return this.state.registers[operand];
        }
        // Is it a number?
        if (!isNaN(Number(operand))) {
            return Number(operand);
        }
        // Is it an anchor?
        if(this.state.memory.hasOwnProperty(operand)) {
            return this.state.memory[operand as any];
        }
        // Otherwise, it's a string literal
        return operand;
    }

    private getNumericValue(operand: string): number {
        const value = this.getValue(operand);
        if(typeof value !== 'number') {
            const numVal = Number(value);
            if (isNaN(numVal)) throw new Error(`[${this.state.pc}] Expected numeric value for '${operand}', but got '${value}'.`);
            return numVal;
        }
        return value;
    }
    
    private getRegisterName(operand: string): string {
        if (!this.state.registers.hasOwnProperty(operand)) {
            throw new Error(`[${this.state.pc}] Invalid register: ${operand}`);
        }
        return operand;
    }


    public async run(script: string) {
        this.reset();
        this.state.program = this.parse(script);

        let steps = 0;
        while (this.state.pc < this.state.program.length && steps < this.maxSteps) {
            if (this.state.isWaitingForInput) {
                // Pause execution until input is provided
                await new Promise(resolve => setTimeout(resolve, 100));
                continue;
            }
            
            try {
                this.step();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                this.onOutput(`[RUNTIME ERROR] ${errorMessage}`);
                break;
            }

            steps++;
        }

        if (steps >= this.maxSteps) {
            this.onOutput(`[EXECUTION HALTED] Maximum step count (${this.maxSteps}) exceeded.`);
        }
    }

    public simulateScript(script: string, initialFS: Map<string, string | null>): GevurahSimulationResult {
        this.run(script); // Run synchronously for simulation
        return {
            scriptId: "simulated-script",
            scriptTitle: "Simulated Execution",
            output: this.state.output,
            finalFS: new Map() // Placeholder, as FS ops are not implemented yet
        };
    }
    
     public provideInput(input: string) {
        if (this.state.isWaitingForInput && this.state.inputRegister) {
            this.state.registers[this.state.inputRegister] = input;
            this.state.isWaitingForInput = false;
            this.state.inputRegister = null;
            this.onWaitingForInput(false);
        }
    }


    private step() {
        if (this.state.pc >= this.state.program.length) return;

        const instruction = this.state.program[this.state.pc];
        const { opcode, operands } = instruction;
        let nextPc = this.state.pc + 1;

        switch (opcode) {
            case 'INIT':
            case 'FLOW':
            case 'SEEK': {
                const [dest, src] = operands;
                this.state.registers[this.getRegisterName(dest)] = this.getValue(src);
                break;
            }
            case 'STORE': {
                const [address, valueOperand] = operands;
                const memAddress = this.getNumericValue(address);
                if (memAddress < 0) throw new Error("Memory address cannot be negative.");
                this.state.memory[memAddress] = this.getValue(valueOperand);
                break;
            }
            case 'FETCH': {
                const [dest, address] = operands;
                const memAddress = this.getNumericValue(address);
                if (memAddress < 0) throw new Error("Memory address cannot be negative.");
                this.state.registers[this.getRegisterName(dest)] = this.state.memory[memAddress] || 0; // Default to 0 if address is empty
                break;
            }
            case 'ADD':
            case 'CONNECT':
            case 'BIND': {
                const [dest, op1, op2] = operands;
                const val1 = this.getNumericValue(op1);
                const val2 = this.getNumericValue(op2);
                this.state.registers[this.getRegisterName(dest)] = val1 + val2;
                // Note: Carry Flag for ADD is complex with JS numbers and is omitted for now.
                break;
            }
            case 'SUB': {
                const [dest, op1, op2] = operands;
                const val1 = this.getNumericValue(op1);
                const val2 = this.getNumericValue(op2);
                this.state.registers[this.getRegisterName(dest)] = val1 - val2;
                this.state.flags.CF = val1 < val2; // Set Carry Flag if borrow occurs
                break;
            }
             case 'MUL': {
                const [dest, op1, op2] = operands;
                const val1 = this.getNumericValue(op1);
                const val2 = this.getNumericValue(op2);
                this.state.registers[this.getRegisterName(dest)] = val1 * val2;
                break;
            }
             case 'DIV': {
                const [dest, op1, op2] = operands;
                const val1 = this.getNumericValue(op1);
                const val2 = this.getNumericValue(op2);
                if (val2 === 0) throw new Error("Division by zero.");
                this.state.registers[this.getRegisterName(dest)] = val1 / val2;
                break;
            }
            case 'CMP': {
                const val1 = this.getNumericValue(operands[0]);
                const val2 = this.getNumericValue(operands[1]);
                const result = val1 - val2;
                this.state.flags.ZF = result === 0;
                this.state.flags.SF = result < 0;
                this.state.flags.CF = val1 < val2; // Set Carry Flag for unsigned comparison (is val1 "below" val2?)
                break;
            }
            case 'JMP': {
                const targetAddress = this.state.labels.get(operands[0]);
                if (targetAddress === undefined) throw new Error(`Label not found: ${operands[0]}`);
                nextPc = targetAddress;
                break;
            }
            case 'GATE': {
                const [label, condition] = operands;
                let conditionMet = false;
                switch (condition.toUpperCase()) {
                    // Signed comparisons
                    case 'EQUAL': conditionMet = this.state.flags.ZF; break;
                    case 'NOT_EQUAL': conditionMet = !this.state.flags.ZF; break;
                    case 'GREATER': conditionMet = !this.state.flags.SF && !this.state.flags.ZF; break;
                    case 'LESS': conditionMet = this.state.flags.SF; break;
                    // Unsigned comparisons
                    case 'ABOVE': conditionMet = !this.state.flags.CF && !this.state.flags.ZF; break; // Unsigned greater
                    case 'BELOW': conditionMet = this.state.flags.CF; break; // Unsigned less
                    default: throw new Error(`Invalid GATE condition: ${condition}`);
                }
                if (conditionMet) {
                    const targetAddress = this.state.labels.get(label);
                    if (targetAddress === undefined) throw new Error(`Label not found: ${label}`);
                    nextPc = targetAddress;
                }
                break;
            }
            case 'CALL': {
                const [labelName] = operands;
                if (!labelName) {
                    throw new Error(`[${this.state.pc}] CALL requires a label.`);
                }
                const targetAddress = this.state.labels.get(labelName);
                if (targetAddress === undefined) {
                    throw new Error(`[${this.state.pc}] Label not found: ${labelName}`);
                }
                this.state.callStack.push(this.state.pc + 1); // Push return address
                nextPc = targetAddress; // Jump to subroutine
                break;
            }
            case 'RET': {
                if (this.state.callStack.length === 0) {
                    throw new Error(`[${this.state.pc}] RET called with an empty call stack.`);
                }
                const returnAddress = this.state.callStack.pop()!;
                nextPc = returnAddress; // Return from subroutine
                break;
            }
            case 'PUSH': {
                this.state.stack.push(this.getValue(operands[0]));
                break;
            }
            case 'POP':
            case 'EMERGE': {
                if (this.state.stack.length === 0) throw new Error("Stack underflow.");
                this.state.registers[this.getRegisterName(operands[0])] = this.state.stack.pop();
                break;
            }
            case 'OUT':
            case 'MANIFEST':
            case 'DECLARE': {
                const value = this.getValue(operands[0]);
                const line = String(value);
                this.state.output.push(line);
                this.onOutput(line);
                break;
            }
             case 'OBSERVE': {
                this.state.isWaitingForInput = true;
                this.state.inputRegister = this.getRegisterName(operands[0]);
                this.onWaitingForInput(true);
                break;
            }
            case 'FENCE': {
                const line = `--- SCOPE [${operands[0]}] ENTERED ---`;
                this.state.output.push(line);
                this.onOutput(line);
                break;
            }
            case 'QUERY': {
                const [dest, queryString] = operands;
                const entry = livingLibrary.getDataset(queryString);
                this.state.registers[this.getRegisterName(dest)] = entry ? entry.rawContent : "NULL";
                break;
            }
            case 'ANCHOR': {
                const [name, reg] = operands;
                this.state.memory[name as any] = this.state.registers[this.getRegisterName(reg)];
                break;
            }
            case 'CONCENTRATE': {
                const value = this.getValue(operands[0]);
                const gematria = gematriaEngine.observe(String(value));
                this.state.stack.push(gematria);
                break;
            }
             case 'RESTRUCTURE': {
                const regName = this.getRegisterName(operands[0]);
                const value = String(this.state.registers[regName]);
                this.state.registers[regName] = value.split('').reverse().join('');
                break;
            }
            case 'SYSCALL': {
                const [engine, dest, ...args] = operands;
                if (engine === 'UNIMATICS_EVAL') {
                    const expression = String(this.getValue(args[0]));
                    const result = unimaticsKernel.evaluate(expression, {});
                    this.state.registers[this.getRegisterName(dest)] = result;
                } else {
                    throw new Error(`Unknown SYSCALL engine: ${engine}`);
                }
                break;
            }
            case 'HALT':
            case 'SEAL': {
                nextPc = this.state.program.length;
                break;
            }
            default:
                throw new Error(`Unknown opcode: ${opcode}`);
        }

        this.state.pc = nextPc;
    }
}
