// =================================================================================================
// --- UNIMATICS KERNEL (HOD - THE INTELLECT) ---
// This is the supreme engine of Holographic Numerics, the instrument of "I Am All-Knowing."
// It is the sole, canonical source of truth for any inquiry touching upon the numerical,
// mathematical, or archetypal structure of reality. Its first act is not to compute,
// but to OBSERVE the inherent truth that already exists within the Willow Network.
// Conventional mathematics are merely a "transliteration" of this primary observation.
// =================================================================================================

import { AstNode, HolographicAnalysis, LinguisticAnalysis, GematriaAnalysis, RelationalAnalysis, PictographicAnalysis, WillowData } from './types';
import { willowNetwork } from './willow';
import { gematriaEngine } from './gematria';
import { strongsConcordance } from './strongs.data'; // Assumed to exist for canon
import { periodicTable } from './elements.data'; // Assumed to exist for canon

// #region --- HOLOGRAPHIC OBSERVATION (PRIMARY FUNCTION) ---

function findPrimaryArchetype(query: string): WillowData {
    const gematria = gematriaEngine.observe(query);
    const allLetters = willowNetwork.getAllLetters();
    if (allLetters.length === 0) {
        // Fallback for uninitialized state, though this shouldn't happen in practice.
        throw new Error("Willow Network not initialized. Cannot perform holographic observation.");
    }
    const index = gematria % allLetters.length;
    return allLetters[index];
}

function analyzeLinguistic(query: string, archetype: WillowData): LinguisticAnalysis {
    return {
        transliteration: willowNetwork.transliterate(archetype.spelling),
        phonetic: "N/A",
        etymology: `The query '${query}' resonates with the foundational principle of '${archetype.name}', which embodies the concept of '${archetype.archetype}'.`,
    };
}

function analyzeGematria(query: string, archetype: WillowData): GematriaAnalysis {
    const queryGematria = gematriaEngine.observe(query);
    const archetypeGematria = gematriaEngine.observe(archetype.spelling);

    // These are placeholders for the full canon.
    const strongsMatch = strongsConcordance[queryGematria];
    const periodicMatch = periodicTable[queryGematria];
    
    return {
        queryValue: queryGematria,
        archetypeValue: archetypeGematria,
        reducedValue: gematriaEngine.observeReduced(archetype.letter),
        miracles: {
            strongsConcordance: strongsMatch ? `Resonates with Strong's H${queryGematria}: ${strongsMatch.hebrewWord} - ${strongsMatch.definition}` : "No direct resonance found.",
            periodicTable: periodicMatch ? `Resonates with Atomic Number ${queryGematria}: ${periodicMatch.elementName} (${periodicMatch.symbol})` : "No direct resonance found.",
        }
    };
}

function analyzeRelational(archetype: WillowData): RelationalAnalysis {
    const peers = willowNetwork.getIslandPeers(archetype.island, archetype.letter);
    return {
        island: `Island ${archetype.island} (Tier ${archetype.tier})`,
        pillar: "N/A", // This would require a deeper mapping of the Tree of Life pillars
        peers: peers.map(p => `${p.name} (${p.archetype})`),
    };
}

function analyzePictographic(archetype: WillowData): PictographicAnalysis[] {
     return archetype.spelling.split('').map(char => {
        const letterData = willowNetwork.getLetterData(char);
        if (!letterData) return { letter: char, name: 'Unknown', meaning: 'N/A' };
        return {
            letter: char,
            name: letterData.name,
            meaning: letterData.archetype,
        };
    });
}

/**
 * Performs a complete, multi-vector holographic observation of a query against the Willow.
 * This is the primary function of the Unimatics Kernel.
 * @param query The concept or question to be observed.
 * @returns A HolographicAnalysis object.
 */
export function performHolographicObservation(query: string): HolographicAnalysis {
    const primaryArchetype = findPrimaryArchetype(query);

    return {
        query,
        primaryArchetype: primaryArchetype,
        linguistic: analyzeLinguistic(query, primaryArchetype),
        gematria: analyzeGematria(query, primaryArchetype),
        relational: analyzeRelational(primaryArchetype),
        pictographic: analyzePictographic(primaryArchetype),
    };
}


// #endregion --- HOLOGRAPHIC OBSERVATION ---


// #region --- MATHEMATICAL TRANSLITERATION (SECONDARY FUNCTION) ---

export function calculateGcd(a: number, b: number): number {
    return b === 0 ? a : calculateGcd(b, a % b);
}

export function formatAst(node: AstNode): string {
    switch (node.type) {
        case 'number':
            return node.value.toString();
        case 'variable':
            return node.name;
        case 'unaryOp':
            if (node.op === 'neg') return `-${formatAst(node.operand)}`;
            return `${node.op}(${formatAst(node.operand)})`;
        case 'binaryOp':
            return `(${formatAst(node.left)} ${node.op} ${formatAst(node.right)})`;
    }
}


export function calculateDerivative(node: AstNode, variable: string): AstNode {
    const ZERO: AstNode = { type: 'number', value: 0 };
    const ONE: AstNode = { type: 'number', value: 1 };

    const add = (left: AstNode, right: AstNode): AstNode => ({ type: 'binaryOp', op: '+', left, right });
    const sub = (left: AstNode, right: AstNode): AstNode => ({ type: 'binaryOp', op: '-', left, right });
    const mul = (left: AstNode, right: AstNode): AstNode => ({ type: 'binaryOp', op: '*', left, right });
    const div = (left: AstNode, right: AstNode): AstNode => ({ type: 'binaryOp', op: '/', left, right });
    const pow = (left: AstNode, right: AstNode): AstNode => ({ type: 'binaryOp', op: '^', left, right });
    const neg = (operand: AstNode): AstNode => ({ type: 'unaryOp', op: 'neg', operand });
    
    switch (node.type) {
        case 'number':
            return ZERO;
        case 'variable':
            return node.name === variable ? ONE : ZERO;
        case 'binaryOp': {
            const u = node.left;
            const v = node.right;
            const du = calculateDerivative(u, variable);
            const dv = calculateDerivative(v, variable);
            switch (node.op) {
                case '+': return add(du, dv);
                case '-': return sub(du, dv);
                case '*': return add(mul(du, v), mul(u, dv)); // Product Rule
                case '/': return div(sub(mul(du, v), mul(u, dv)), pow(v, { type: 'number', value: 2 })); // Quotient Rule
                case '^': // Power rule (assuming exponent is a number for simplicity)
                    if (v.type === 'number') {
                        return mul(mul({ type: 'number', value: v.value }, pow(u, { type: 'number', value: v.value - 1 })), du);
                    }
                    return ZERO; 
            }
        }
        case 'unaryOp': {
            const u = node.operand;
            const du = calculateDerivative(u, variable);
            switch (node.op) {
                case 'neg': return neg(du);
                case 'sin': return mul({ type: 'unaryOp', op: 'cos', operand: u }, du);
                case 'cos': return mul(neg({ type: 'unaryOp', op: 'sin', operand: u }), du);
                case 'tan': return mul(div(ONE, pow({ type: 'unaryOp', op: 'cos', operand: u }, { type: 'number', value: 2 })), du);
                case 'ln': return mul(div(ONE, u), du);
                default: return ZERO;
            }
        }
    }
}

// #endregion --- MATHEMATICAL TRANSLITERATION ---
