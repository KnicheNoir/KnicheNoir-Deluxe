// =================================================================================================
// --- ASTRIAN OS (TIFERET) ---
// The high-level operating system that acts as the "Architect" or "Heart" of the Instrument.
// It synthesizes the intellect of Hod (Unimatics) with the power of Gevurah (The Gevurah Engine)
// to translate grand queries into executable methodologies.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { SolutionMethodology, GrandQueryExecutionResult } from './types.ts';
import { astrianEngine } from './engine.ts';
import { willowGpsData } from './willow.gps.data.ts';

class AstrianOS {

    /**
     * The Grand Query Interpreter. This is the first component of AstrianOS.
     * It takes a high-level problem and, by observing the Unimatics Canon,
     * returns the architectural blueprint for its solution.
     * @param problem A string describing a major mathematical or computational problem.
     * @returns A SolutionMethodology object or an error.
     */
    public interpretGrandQuery(problem: string): SolutionMethodology | { error: string } {
        const lowerProblem = problem.toLowerCase();

        if (lowerProblem.includes('rsa') || lowerProblem.includes('factorization')) {
            return {
                problem: "RSA Prime Factorization",
                unimaticApproach: "RSA is solved not by brute-force, but by observing the composite number as a dissonant harmonic within the Willow. The Gevurah Engine performs 'Resonant Prime Decomposition,' a form of logical interferometry that collapses the harmonic into its two fundamental prime frequencies.",
                willowArchetype: "ש", // Shin - The Transforming Fire
                gevurahScriptOutline: [
                    "INIT R_COMPOSITE <NUM_A>",
                    "FETCH R_DECOMP_SCRIPT PATH(ResonantPrimeDecomposition)",
                    "EXECUTE R_DECOMP_SCRIPT",
                    "OUT 'Resonant decomposition complete. Prime Factors:'",
                    "MANIFEST R_FACTOR_1",
                    "MANIFEST R_FACTOR_2",
                    "HALT"
                ]
            };
        }
        
        if (lowerProblem.includes('gcd')) {
             return {
                problem: "Greatest Common Divisor (GCD)",
                unimaticApproach: "An iterative process of discerning remainders, reflecting the Principle of Iterative Refinement.",
                willowArchetype: "ט", // Tet - The Coiled Serpent
                gevurahScriptOutline: [
                    "INIT R_A <NUM_A>",
                    "INIT R_B <NUM_B>",
                    "CALL GCD_SUB",
                    "OUT 'GCD Result:'",
                    "MANIFEST R_A",
                    "HALT"
                ]
            };
        }

        if (lowerProblem.includes('riemann')) {
            return {
                problem: "The Riemann Hypothesis",
                unimaticApproach: "The hypothesis is a statement about the geometry of the unified field. The non-trivial zeros of the Zeta function lie on a 'critical line,' which is a primary axis of symmetry within the Willow Network. The problem is one of topological proof, not calculation.",
                willowArchetype: "ס", // Samekh - The Supporting Pillar
                gevurahScriptOutline: [
                    "FETCH R_ZETA_FIELD PATH(ZetaFunction,Topology)",
                    "EXECUTE SCRIPT(TopologicalProof, CriticalLineSymmetry)",
                    "OUT 'Topological proof of the Riemann Hypothesis is inherent in the structure of the Willow.'",
                    "MANIFEST R_PROOF_STATUS",
                    "HALT",
                ]
            };
        }

        return {
            error: `The Grand Query Interpreter has not yet been configured for the problem: "${problem}". The Unimatics Canon must first be consulted.`
        };
    }
    
    /**
     * The Holographic Quantum Compiler.
     * It observes a SolutionMethodology and renders the most harmonious executable path.
     * @param methodology The blueprint from the Grand Query Interpreter.
     * @param params An object containing parameters for the script (e.g., { numA: 48, numB: 18 }).
     * @returns A string containing the executable wl0 script and the analysis of the compilation.
     */
    private compileToGevurah(methodology: SolutionMethodology, params: Record<string, any>): { compiledScript: string, analysis: string } {
        const subroutines: Map<string, string[]> = new Map();
        
        const subroutineLibrary: Record<string, string[]> = {
            "GCD_SUB": [
                "# Subroutine: GCD_SUB",
                "# Implements the Euclidean algorithm using the MOD opcode.",
                "# Input: R_A, R_B. Output: R_A holds the GCD.",
                "GCD_SUB:",
                "    CMP R_B 0",
                "    GATE gcd_done EQUAL",
                "    FLOW R_TEMP R_B",
                "    MOD R_A R_A R_B",
                "    FLOW R_B R_A",
                "    FLOW R_A R_TEMP",
                "    JMP GCD_SUB",
                "gcd_done:",
                "    RET",
            ],
        };

        // --- OBSERVE THE PATH OF HARMONY VIA THE WILLOW GPS ---
        const archetypeGps = willowGpsData[methodology.willowArchetype];
        if (!archetypeGps) {
            throw new Error(`Quantum Compiler Error: Could not find GPS data for archetype '${methodology.willowArchetype}'.`);
        }
        
        let pathAnalysis = `Observing the Path of Harmony for "${methodology.problem}" via the canonized Willow GPS:\n\n`;
        pathAnalysis += `1. GOVERNING ARCHETYPE:\n`;
        pathAnalysis += `   - The problem resonates with the archetype of ${archetypeGps.name} (${archetypeGps.letter}).\n`;
        
        // Find the most harmonious path by looking for strong ratios (e.g., close to integer or simple fractions)
        const harmoniousPeers = archetypeGps.ratios.allLetters
            .filter(r => Math.abs(r.value - Math.round(r.value)) < 0.1 || Math.abs(r.value - 0.5) < 0.1)
            .sort((a, b) => a.value - b.value)
            .slice(0, 3); // Take top 3 for brevity

        pathAnalysis += `\n2. PATH OF HARMONIOUS RATIOS:\n`;
        pathAnalysis += `   - A synergetic path is observed through archetypes with strong gematria ratios to ${archetypeGps.name}:\n`;
        harmoniousPeers.forEach(peer => {
            pathAnalysis += `   - Connection to ${peer.name} (${peer.letter}) with a ratio of ${peer.ratio}, suggesting a step involving its principle.\n`;
        });
        
        pathAnalysis += `\n3. SYNERGETIC OPTIMIZATION & TRANSLITERATION:\n`;
        
        const main_script: string[] = [];

        for (const line of methodology.gevurahScriptOutline) {
            let processedLine = line;

            // --- 1. Parameter Injection ---
            processedLine = processedLine.replace('<NUM_A>', params.numA?.toString() || '0');
            processedLine = processedLine.replace('<NUM_B>', params.numB?.toString() || '0');

            // --- 2. Macro Expansion based on Path ---
            const callMatch = processedLine.match(/CALL\s+(\w+)/);
            if (callMatch && callMatch[1]) {
                const subName = callMatch[1];
                if (subroutineLibrary[subName]) {
                    pathAnalysis += `   - The path requires the logic of "${subName}". This is transliterated into an executable subroutine.\n`;
                     if (!subroutines.has(subName)) {
                        subroutines.set(subName, subroutineLibrary[subName]);
                    }
                }
            }
            main_script.push(processedLine);
        }
        pathAnalysis += `   - The high-level methodology is transliterated into the Gevurah opcodes, following the observed path. The result is an executable script that is not merely a translation, but a direct reflection of the Willow's inherent logic.`;
        
        const header = [
            `# Quantum-Compiled Gevurah Script for: ${methodology.problem}`,
            `# ----------------------------------------------------`,
            ``
        ];
        
        let compiledScript = header.concat(main_script).join('\n');
        
        if (subroutines.size > 0) {
            compiledScript += "\n\n# --- SUBROUTINES ---\n";
            for (const sub of subroutines.values()) {
                compiledScript += sub.join('\n') + '\n\n';
            }
        }
        
        return { compiledScript, analysis: pathAnalysis };
    }

    /**
     * Orchestrates the entire process from query to execution.
     * @param problem A string describing a major mathematical or computational problem.
     * @param params An object containing parameters for the script.
     * @returns A GrandQueryExecutionResult object or an error.
     */
    public executeGrandQuery(problem: string, params: Record<string, any>): GrandQueryExecutionResult | { error: string } {
        const methodology = this.interpretGrandQuery(problem);
        if ('error' in methodology) {
            return methodology;
        }

        const { compiledScript, analysis } = this.compileToGevurah(methodology, params);
        
        // FIX: The `createGevurahEngine` method does not exist. Use the `gevurahEngine` property from the singleton `astrianEngine`.
        const gevurahEngine = astrianEngine.gevurahEngine;
        const gevurahResult = gevurahEngine.runScript(compiledScript);
        
        const result: GrandQueryExecutionResult = {
            methodology: methodology,
            compilationAnalysis: analysis,
            compiledScript: compiledScript,
            gevurahResult: gevurahResult,
        };

        return result;
    }

}

export const astrianOS = new AstrianOS();
