// =================================================================================================
// --- GEVURAH INSTRUCTION SET ARCHITECTURE (ISA) ---
// This file canonizes the 22 fundamental operations of the Reality Engine.
// Each instruction corresponds to a Hebrew letter, embodying its archetypal function
// as a computational process.
// =================================================================================================

import { GevurahInstruction } from '../types.ts';

export const gevurahInstructionSet: GevurahInstruction[] = [
    // --- CORE & MEMORY ---
    { opcode: 'INIT', letter: 'א', name: 'Initialize', category: 'Core', description: 'Initializes a register with a value or copies from another register.', syntax: 'INIT <register>, <value|register>' },
    { opcode: 'STORE', letter: 'ב', name: 'Store', category: 'Memory', description: 'Stores a value from a register or literal into a numeric memory address.', syntax: 'STORE <address>, <value|register>' },
    { opcode: 'FETCH', letter: 'כ', name: 'Fetch', category: 'Memory', description: 'Fetches a value from a numeric memory address into a register.', syntax: 'FETCH <register>, <address>' },
    { opcode: 'PUSH', letter: 'י', name: 'Push', category: 'Stack', description: 'Pushes a value or register onto the stack.', syntax: 'PUSH <value|register>' },
    { opcode: 'POP', letter: 'נ', name: 'Pop', category: 'Stack', description: 'Pops a value from the stack into a register.', syntax: 'POP <register>' },
    
    // --- CONTROL FLOW ---
    { opcode: 'JMP', letter: 'ל', name: 'Jump', category: 'Control Flow', description: 'Unconditionally jumps to a label.', syntax: 'JMP <label>' },
    { opcode: 'GATE', letter: 'ד', name: 'Gate', category: 'Control Flow', description: 'Jumps to a label if the last comparison met the condition. Conditions: EQUAL, NOT_EQUAL, GREATER, LESS, ABOVE, BELOW.', syntax: 'GATE <label>, <condition>' },
    { opcode: 'CALL', letter: 'ק', name: 'Call Subroutine', category: 'Control Flow', description: 'Pushes the address of the next instruction to the call stack and jumps to the specified label, beginning a subroutine.', syntax: 'CALL <label>' },
    { opcode: 'RET', letter: 'ת', name: 'Return from Subroutine', category: 'Control Flow', description: 'Pops a return address from the call stack and jumps to it, ending a subroutine.', syntax: 'RET' },
    { opcode: 'HALT', letter: 'ת', name: 'Halt', category: 'Core', description: 'Seals the process, halting execution.', syntax: 'HALT' },

    // --- I/O & SYSTEM ---
    { opcode: 'OUT', letter: 'פ', name: 'Output', category: 'I/O', description: 'Outputs a string literal or the value of a register.', syntax: 'OUT <"string"|register>' },
    { opcode: 'MANIFEST', letter: 'ה', name: 'Manifest', category: 'I/O', description: 'Alias for OUT, making a value observable.', syntax: 'MANIFEST <"string"|register>' },
    { opcode: 'OBSERVE', letter: 'ע', name: 'Observe', category: 'I/O', description: 'Pauses execution and waits for Operator input, storing it in a register.', syntax: 'OBSERVE <register>' },
    { opcode: 'SYSCALL', letter: 'ש', name: 'System Call', category: 'System', description: 'Executes a high-level system function, like calling another engine.', syntax: 'SYSCALL <engine_name>, <output_register>, <...args>' },

    // --- LOGIC & ARITHMETIC ---
    { opcode: 'ADD', letter: 'ו', name: 'Add', category: 'Arithmetic', description: 'Adds two values and stores the result.', syntax: 'ADD <dest_reg>, <reg|value>, <reg|value>' },
    { opcode: 'SUB', letter: 'ז', name: 'Subtract', category: 'Arithmetic', description: 'Subtracts the second value from the first.', syntax: 'SUB <dest_reg>, <reg|value>, <reg|value>' },
    { opcode: 'MUL', letter: 'ו', name: 'Multiply', category: 'Arithmetic', description: 'Multiplies two values.', syntax: 'MUL <dest_reg>, <reg|value>, <reg|value>' },
    { opcode: 'DIV', letter: 'ז', name: 'Divide', category: 'Arithmetic', description: 'Divides the first value by the second.', syntax: 'DIV <dest_reg>, <reg|value>, <reg|value>' },
    { opcode: 'CMP', letter: 'ט', name: 'Compare', category: 'Logic', description: 'Compares two values and sets the flags (ZF, SF, CF).', syntax: 'CMP <reg|value>, <reg|value>' },

    // --- WILLOW-NATIVE & CONCEPTUAL ---
    { opcode: 'FENCE', letter: 'ח', name: 'Fence', category: 'Conceptual', description: 'Establishes a protected memory or execution scope.', syntax: 'FENCE <scope_name>' },
    { opcode: 'QUERY', letter: 'מ', name: 'Query', category: 'Conceptual', description: 'Queries the Living Library and stores the result.', syntax: 'QUERY <dest_reg>, <query_string>' },
    { opcode: 'ANCHOR', letter: 'צ', name: 'Anchor', category: 'Conceptual', description: 'Anchors a register\'s value to a named concept for later retrieval.', syntax: 'ANCHOR <name>, <register>' },
    { opcode: 'CONCENTRATE', letter: 'י', name: 'Concentrate', category: 'Conceptual', description: 'Reduces a concept to its Gematria seed value and pushes to the stack.', syntax: 'CONCENTRATE <"string">' },
    { opcode: 'RESTRUCTURE', letter: 'ר', name: 'Restructure', category: 'Conceptual', description: 'Applies an Atbash-like cipher to a string register, inverting it.', syntax: 'RESTRUCTURE <register>' },
];