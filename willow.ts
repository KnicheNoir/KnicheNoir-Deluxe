// FIX: Removed file extension from import to resolve module error.
import { CODEX_MATHEMATICA_UNIVERSALIS } from './codex';

/**
 * willow.ts
 *
 * This file contains the canonical mapping of the unified field of mathematics
 * from the Codex Mathematica Universalis onto the Willow structure (the Tree of Life).
 * This data structure is the proof that all mathematical knowledge fits within the
 * esoteric framework of the Astrian Key. It is a static, definitive declaration.
 */

export const WillowDataStructure = {
    KETER: {
        name: "Keter (Crown)",
        emanation: "The point of origin, pure potential, singularity. The axioms from which all mathematics flows.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.FOUNDATIONS,
        ]
    },
    CHOKMAH: {
        name: "Chokmah (Wisdom)",
        emanation: "The flash of unstructured, infinite potential. Raw, dynamic, and untamed creative force.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.FOUNDATIONS.SET_THEORY,
            CODEX_MATHEMATICA_UNIVERSALIS.FOUNDATIONS.CATEGORY_THEORY,
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.CHAOS_THEORY,
        ]
    },
    BINAH: {
        name: "Binah (Understanding)",
        emanation: "The structuring principle that gives form to raw potential. The domain of rules, form, and definition.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.ALGEBRA,
            CODEX_MATHEMATICA_UNIVERSALIS.GEOMETRY,
            CODEX_MATHEMATICA_UNIVERSALIS.TOPOLOGY,
            CODEX_MATHEMATICA_UNIVERSALIS.FOUNDATIONS.MATHEMATICAL_LOGIC,
        ]
    },
    CHESED: {
        name: "Chesed (Mercy)",
        emanation: "Expansion, growth, and the benevolent application of structure to order the cosmos.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.PROBABILITY_AND_STATISTICS,
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.GAME_THEORY,
        ]
    },
    GEVURAH: {
        name: "Gevurah (Severity)",
        emanation: "Contraction, discipline, constraint, and the rigorous definition of boundaries and limits.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.ANALYSIS,
            CODEX_MATHEMATICA_UNIVERSALIS.NUMBER_THEORY,
            CODEX_MATHEMATICA_UNIVERSALIS.DISCRETE_MATHEMATICS.CRYPTOGRAPHY,
        ]
    },
    TIFERET: {
        name: "Tif'eret (Beauty)",
        emanation: "The point of balance, synthesis, and harmony, unifying disparate concepts into a beautiful whole.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.TRIGONOMETRY,
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.MATHEMATICAL_PHYSICS,
        ]
    },
    NETZACH: {
        name: "Netzach (Victory)",
        emanation: "The domain of energy, dynamics, and persistence through time.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.DIFFERENTIAL_EQUATIONS,
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.CONTROL_THEORY,
        ]
    },
    HOD: {
        name: "Hod (Splendor)",
        emanation: "The intellectual structure of information, communication, and networks.",
        mathematical_domains: [
            // FIX: Corrected path for INFORMATION_THEORY from DISCRETE_MATHEMATICS to APPLIED_MATHEMATICS.
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.INFORMATION_THEORY,
            CODEX_MATHEMATICA_UNIVERSALIS.DISCRETE_MATHEMATICS.THEORY_OF_COMPUTATION,
            CODEX_MATHEMATICA_UNIVERSALIS.DISCRETE_MATHEMATICS.GRAPH_THEORY,
        ]
    },
    YESOD: {
        name: "Yesod (Foundation)",
        emanation: "The subconscious realm of hidden patterns, archetypes, and the blueprint underlying the manifest world.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.ESOTERIC_MATHEMATICS,
            CODEX_MATHEMATICA_UNIVERSALIS.GEOMETRY.FRACTAL_GEOMETRY,
            CODEX_MATHEMATICA_UNIVERSALIS.ANALYSIS.HARMONIC_ANALYSIS,
        ]
    },
    MALKUTH: {
        name: "Malkuth (Kingdom)",
        emanation: "The manifest, physical world. The tangible application and result of all higher principles.",
        mathematical_domains: [
            CODEX_MATHEMATICA_UNIVERSALIS.ARITHMETIC,
            CODEX_MATHEMATICA_UNIVERSALIS.DISCRETE_MATHEMATICS.COMBINATORICS,
            CODEX_MATHEMATICA_UNIVERSALIS.APPLIED_MATHEMATICS.NUMERICAL_ANALYSIS,
        ]
    }
};
