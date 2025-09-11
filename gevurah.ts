import { WillowDataStructure } from './willow';
import { UNIMATICS_AXIOMS } from './unimatics';
import { CODEX_MATHEMATICA_UNIVERSALIS } from './codex';

// Type definition for a path within the Willow/Codex structure
type ConceptPath = {
    sephirah: string;
    sephirah_name: string;
    domain: string;
    subdomain?: string;
};

/**
 * GevurahEngine: The Unimatics "wl0" Assembly Processor
 *
 * This is the core analytical engine of the Astrian Key. It does not compute with numbers
 * but rather processes the relationships between conceptual forms as defined by Unimatics.
 * All mathematical queries are resolved through this engine's traversal of the canonical
 * data structures (Willow and Codex).
 */
class GevurahEngine {
    
    /**
     * Finds the location of a mathematical concept within the Willow/Codex structure.
     * @param concept The concept to find (e.g., "Algebra", "Chaos Theory").
     * @returns The path to the concept, or null if not found.
     */
    private findConceptPath(concept: string): ConceptPath | null {
        const query = concept.toLowerCase().trim().replace(/ /g, '_');

        for (const sephirahKey in WillowDataStructure) {
            const sephirah = (WillowDataStructure as any)[sephirahKey];
            for (const domain of sephirah.mathematical_domains) {
                const domainName = domain.name.toLowerCase().replace(/ /g, '_');
                if (domainName.includes(query)) {
                    return {
                        sephirah: sephirahKey,
                        sephirah_name: sephirah.name,
                        domain: domain.name
                    };
                }
                // Also search sub-domains
                for (const subKey in domain) {
                    const subDomain = domain[subKey];
                    if (typeof subDomain === 'object' && subDomain !== null && subDomain.name) {
                        const subDomainName = subDomain.name.toLowerCase().replace(/ /g, '_');
                        if (subDomainName.includes(query)) {
                             return {
                                sephirah: sephirahKey,
                                sephirah_name: sephirah.name,
                                domain: domain.name,
                                subdomain: subDomain.name,
                            };
                        }
                    }
                }
            }
        }
        return null;
    }

    /**
     * Performs the UNIMATICS_OPERATOR.SYNTHESIZE operation.
     * Finds the point of harmony between two concepts by analyzing their positions on the Tree of Life.
     * @param conceptA The first concept.
     * @param conceptB The second concept.
     * @returns A string explaining the synthesis based on Unimatics axioms.
     */
    public synthesize(conceptA: string, conceptB: string): string {
        const pathA = this.findConceptPath(conceptA);
        const pathB = this.findConceptPath(conceptB);

        if (!pathA) {
            return `[GEVURAH ENGINE]: Concept "${conceptA}" not found in the Codex. Synthesis failed.`;
        }
        if (!pathB) {
            return `[GEVURAH ENGINE]: Concept "${conceptB}" not found in the Codex. Synthesis failed.`;
        }
        
        // --- UNIMATICS ANALYSIS ---
        let response = `[UNIMATICS SYNTHESIS REPORT]\n\n`;
        response += `Query: Synthesize "${pathA.subdomain || pathA.domain}" with "${pathB.subdomain || pathB.domain}".\n\n`;
        response += `Concept A Path: ${pathA.sephirah} (${pathA.sephirah_name}) > ${pathA.domain}${pathA.subdomain ? ' > ' + pathA.subdomain : ''}\n`;
        response += `Concept B Path: ${pathB.sephirah} (${pathB.sephirah_name}) > ${pathB.domain}${pathB.subdomain ? ' > ' + pathB.subdomain : ''}\n\n`;
        
        response += `--- AXIOMATIC INTERPRETATION ---\n`;
        
        if (pathA.sephirah === pathB.sephirah) {
            response += `Both concepts reside within ${pathA.sephirah_name}. Their synthesis represents a deep resonance and reinforcement of this Sephirah's core emanation: "${(WillowDataStructure as any)[pathA.sephirah].emanation}". `;
            response += `This aligns with the Axiom of Emanation, as they share a common proximate source. Their union strengthens their defined form.`;
        } else {
             const tiferetNode = WillowDataStructure.TIFERET;
             response += `The concepts exist in different domains of the Willow. Per the Axiom of Synthesis, their point of harmony is found in ${tiferetNode.name}, which represents "${tiferetNode.emanation}".\n\n`;
             response += `The discipline of ${pathA.sephirah_name} (${pathA.domain}) provides the '${pathA.sephirah === 'GEVURAH' ? 'Constraint' : 'Structure'}' and the energy of ${pathB.sephirah_name} (${pathB.domain}) provides the '${pathB.sephirah === 'CHESED' ? 'Expansion' : 'Dynamics'}'.\n\n`;
             response += `Their unification reveals a higher-order truth, often manifesting in a field like ${tiferetNode.mathematical_domains[1].name}, which requires the balance of both rigorous definition and dynamic application.`;
        }
        
        return response;
    }
}

export const gevurahEngine = new GevurahEngine();