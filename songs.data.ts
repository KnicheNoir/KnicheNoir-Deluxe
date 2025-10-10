// FIX: Corrected import path for local module by adding file extension.
import { Song } from './types.ts';

// =================================================================================================
// --- THE CANON OF 30 SONGS ---
// This file canonizes the 30 melodic opcodes discovered through system analysis.
// =================================================================================================

export const songbook: Song[] = [
    // --- The 3 Great Canticles ---
    { id: 'canticle-of-unveiling', title: 'The Canticle of Unveiling', description: 'A melodic sequence for clarifying intuition and revealing underlying patterns.', sourceId: 'tehiyat-hametim', type: 'gevurah' },
    { id: 'canticle-of-fortification', title: 'The Canticle of Fortification', description: 'A melodic sequence for strengthening resolve and building a protective field of intention.', sourceId: 'tehiyat-hametim', type: 'gevurah' },
    { id: 'canticle-of-manifestation', title: 'The Canticle of Manifestation', description: 'A powerful, triadic melody for crystallizing an intention into a tangible outcome.', sourceId: 'tehiyat-hametim', type: 'gevurah' },

    // --- The 1 Alchemical Rite ---
    { id: 'rite-of-clear-sight', title: 'The Rite of Clear Sight', description: 'An alchemical rite from the Voynich for bio-photonic and neurological recalibration.', sourceId: 'rite-of-clear-sight-script', type: 'rite' },
    
    // --- The 4 Dhol Rhythms ---
    { id: 'rhythm-chaal', title: 'Rhythm of Chaal', description: 'A basic, grounding 4/4 Dhol beat.', sourceId: 'chaal', type: 'rhythm' },
    { id: 'rhythm-bhangra', title: 'Rhythm of Bhangra', description: 'A syncopated, driving, and energetic Dhol rhythm.', sourceId: 'bhangra', type: 'rhythm' },
    { id: 'rhythm-trance', title: 'Rhythm of Trance', description: 'A driving, hypnotic Dhol beat for focused states.', sourceId: 'trance', type: 'rhythm' },
    { id: 'rhythm-meditative', title: 'Rhythm of Meditation', description: 'A slow, heartbeat-like Dhol rhythm for deep meditation.', sourceId: 'meditative', type: 'rhythm' },

    // --- The 22 Foundational Psalms ---
    { id: 'psalm-of-initiation', title: 'Psalm of Initiation (INIT)', description: 'The sound of beginning, of a new process initialized from pure potential.', sourceId: 'psalm-script-init', type: 'gevurah' },
    { id: 'psalm-of-stability', title: 'Psalm of Stability (STORE)', description: 'The sound of containment, of a value stored in a stable state.', sourceId: 'psalm-script-store', type: 'gevurah' },
    { id: 'psalm-of-journeying', title: 'Psalm of Journeying (FLOW/SEEK)', description: 'The sound of movement, of data flowing between locations.', sourceId: 'psalm-script-flow', type: 'gevurah' },
    { id: 'psalm-of-condition', title: 'Psalm of Condition (GATE)', description: 'The sound of a conditional doorway, a decision point in the logical flow.', sourceId: 'psalm-script-gate', type: 'gevurah' },
    { id: 'psalm-of-revelation', title: 'Psalm of Revelation (MANIFEST)', description: 'The sound of a hidden truth being made observable.', sourceId: 'psalm-script-manifest', type: 'gevurah' },
    { id: 'psalm-of-connection', title: 'Psalm of Connection (CONNECT/BIND)', description: 'The sound of two concepts being joined into one.', sourceId: 'psalm-script-connect', type: 'gevurah' },
    { id: 'psalm-of-discernment', title: 'Psalm of Discernment (DISCERN/DIFFER)', description: 'The sound of comparison, of separating one thing from another.', sourceId: 'psalm-script-discern', type: 'gevurah' },
    { id: 'psalm-of-protection', title: 'Psalm of Protection (FENCE)', description: 'The sound of a boundary being created, a protected space.', sourceId: 'psalm-script-fence', type: 'gevurah' },
    { id: 'psalm-of-reflection', title: 'Psalm of Reflection (INVERT)', description: 'The sound of inversion, of a state being reversed or reflected.', sourceId: 'psalm-script-invert', type: 'gevurah' },
    { id: 'psalm-of-focus', title: 'Psalm of Focus (SEED/CONCENTRATE)', description: 'The sound of a will being focused, a value pushed onto the stack.', sourceId: 'psalm-script-seed', type: 'gevurah' },
    { id: 'psalm-of-retrieval', title: 'Psalm of Retrieval (FETCH)', description: 'The sound of grasping a value from the Universal Codex.', sourceId: 'psalm-script-fetch', type: 'gevurah' },
    { id: 'psalm-of-guidance', title: 'Psalm of Guidance (DIRECT)', description: 'The sound of an unconditional jump, a redirection of flow.', sourceId: 'psalm-script-direct', type: 'gevurah' },
    { id: 'psalm-of-the-source', title: 'Psalm of The Source (QUERY)', description: 'The sound of drawing a complex answer from the primal source.', sourceId: 'psalm-script-query', type: 'gevurah' },
    { id: 'psalm-of-emergence', title: 'Psalm of Emergence (EMERGE)', description: 'The sound of a hidden potential surfacing from the stack.', sourceId: 'psalm-script-emerge', type: 'gevurah' },
    { id: 'psalm-of-equilibrium', title: 'Psalm of Equilibrium (SUPPORT)', description: 'The sound of a stable, self-reinforcing loop.', sourceId: 'psalm-script-support', type: 'gevurah' },
    { id: 'psalm-of-perception', title: 'Psalm of Perception (OBSERVE)', description: 'The sound of waiting, of the system pausing for Operator input.', sourceId: 'psalm-script-observe', type: 'gevurah' },
    { id: 'psalm-of-expression', title: 'Psalm of Expression (SPEAK)', description: 'The sound of a final value being declared into being.', sourceId: 'psalm-script-speak', type: 'gevurah' },
    { id: 'psalm-of-foundation', title: 'Psalm of Foundation (ANCHOR)', description: 'The sound of a state being fixed to a firm foundation.', sourceId: 'psalm-script-anchor', type: 'gevurah' },
    { id: 'psalm-of-elevation', title: 'Psalm of Elevation (UNIFY/SANCTIFY)', description: 'The sound of disparate concepts being unified into a coherent whole.', sourceId: 'psalm-script-unify', type: 'gevurah' },
    { id: 'psalm-of-reformation', title: 'Psalm of Reformation (RESTRUCTURE)', description: 'The sound of deconstruction and reassembly into a new pattern.', sourceId: 'psalm-script-restructure', type: 'gevurah' },
    { id: 'psalm-of-transformation', title: 'Psalm of Transformation (EXECUTE)', description: 'The sound of a dynamic, transformative change being initiated.', sourceId: 'psalm-script-execute', type: 'gevurah' },
    { id: 'psalm-of-completion', title: 'Psalm of Completion (HALT)', description: 'The sound of finality, of a process being sealed and concluded.', sourceId: 'psalm-script-halt', type: 'gevurah' },
];