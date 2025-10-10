// FIX: Corrected import path for local module by adding file extension.
import { GevurahInstruction } from './types.ts';

export const gevurahInstructionSet: GevurahInstruction[] = [
    { opcode: 'INIT', letter: 'א', name: 'Initialize', category: 'Core', description: 'Initialize a new process from pure potential. Allocates space.', syntax: 'INIT <register> <value>' },
    { opcode: 'STORE', letter: 'ב', name: 'Store', category: 'Data Structure', description: 'Contain a value in a stable memory location.', syntax: 'STORE <address> <register|value>' },
    { opcode: 'SEEK', letter: 'ג', name: 'Seek', category: 'Control Flow', description: 'Traverse paths to retrieve information.', syntax: 'SEEK <register> <path>' },
    { opcode: 'GATE', letter: 'ד', name: 'Gate', category: 'Control Flow', description: 'Conditional instruction (IF/THEN).', syntax: 'GATE <label> <condition>' },
    { opcode: 'MANIFEST', letter: 'ה', name: 'Manifest', category: 'I/O', description: 'Project an internal state to external output.', syntax: 'MANIFEST <register|value>' },
    { opcode: 'BIND', letter: 'ו', name: 'Bind', category: 'Logic', description: 'Connect two concepts or data points (AND).', syntax: 'BIND <register> <value>' },
    { opcode: 'DIFFER', letter: 'ז', name: 'Differ', category: 'Logic', description: 'Sever a connection or distinguish between states (XOR).', syntax: 'DIFFER <register> <value>' },
    { opcode: 'FENCE', letter: 'ח', name: 'Fence', category: 'Core', description: 'Create a boundary or protected scope for an operation.', syntax: 'FENCE <start_label> <end_label>' },
    { opcode: 'INVERT', letter: 'ט', name: 'Invert', category: 'Arithmetic', description: 'Reverse a state or value (NOT).', syntax: 'INVERT <register>' },
    { opcode: 'CONCENTRATE', letter: 'י', name: 'Concentrate', category: 'Data Structure', description: 'Focus a concept to its essential seed; push to stack.', syntax: 'CONCENTRATE <register|value>' },
    { opcode: 'FETCH', letter: 'כ', name: 'Fetch', category: 'Data Structure', description: 'Grasp a value from a memory address.', syntax: 'FETCH <register> <address>' },
    { opcode: 'DIRECT', letter: 'ל', name: 'Direct', category: 'Control Flow', description: 'Guide a process; unconditional jump.', syntax: 'DIRECT <label>' },
    { opcode: 'QUERY', letter: 'מ', name: 'Query', category: 'I/O', description: 'Draw a complex answer from the universal archive.', syntax: 'QUERY <register> <archive_path>' },
    { opcode: 'EMERGE', letter: 'נ', name: 'Emerge', category: 'Data Structure', description: 'Surface a hidden potential; pop from stack.', syntax: 'EMERGE <register>' },
    { opcode: 'SUPPORT', letter: 'ס', name: 'Support', category: 'Control Flow', description: 'Establish a stable, supportive loop (WHILE).', syntax: 'SUPPORT <condition_label>' },
    { opcode: 'OBSERVE', letter: 'ע', name: 'Observe', category: 'I/O', description: 'Read the current state without altering it; wait for input.', syntax: 'OBSERVE <register>' },
    { opcode: 'DECLARE', letter: 'פ', name: 'Declare', category: 'I/O', description: 'Broadcast a final, computed value.', syntax: 'DECLARE <topic> <register|value>' },
    { opcode: 'ANCHOR', letter: 'צ', name: 'Anchor', category: 'Core', description: 'Fix a process to a specific point in reality or time.', syntax: 'ANCHOR <process_id> <anchor_point>' },
    { opcode: 'SANCTIFY', letter: 'ק', name: 'Sanctify', category: 'Core', description: 'Elevate a process to a higher, protected state.', syntax: 'SANCTIFY <process_id>' },
    { opcode: 'RESTRUCTURE', letter: 'ר', name: 'Restructure', category: 'Data Structure', description: 'Reorganize the components of a system.', syntax: 'RESTRUCTURE <target> <new_pattern>' },
    { opcode: 'EXECUTE', letter: 'ש', name: 'Execute', category: 'Core', description: 'Apply transformative fire; run a script.', syntax: 'EXECUTE <script_address>' },
    { opcode: 'SEAL', letter: 'ת', name: 'Seal', category: 'Core', description: 'Mark a process as complete and final (HALT).', syntax: 'SEAL' },
    { opcode: 'CALL', letter: 'ל', name: 'Call Subroutine', category: 'Control Flow', description: 'Calls a subroutine, saving the return address.', syntax: 'CALL <label>' },
    { opcode: 'RET', letter: 'ת', name: 'Return from Subroutine', category: 'Control Flow', description: 'Returns from a subroutine to the saved address.', syntax: 'RET' },
];