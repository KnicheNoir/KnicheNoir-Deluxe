// =================================================================================================
// --- THE TREE OF LIFE (CANONICAL DATA) ---
// This file contains the foundational, pre-computed data for the Sephirot and the 22 paths
// of the Tree of Life, serving as the static index for the Sephirot Analysis Engine.
// =================================================================================================

// FIX: Corrected import path for local module by adding file extension.
import { WillowData } from './types.ts';

export const sephirotData = [
    { name: 'Keter', hebrew: 'כתר', synthesis: "The Crown. The singularity, the dimensionless point of pure, undifferentiated potential. It is the question that contains all answers." },
    { name: 'Chokmah', hebrew: 'חכמה', synthesis: "Wisdom. The flash of unstructured potential, the un-writable spark of pure, unstructured, forward-moving Will." },
    { name: 'Binah', hebrew: 'בינה', synthesis: "Understanding. The great structuring womb, the First Vessel that takes boundless energy and gives it its first boundary and definition." },
    { name: 'Chesed', hebrew: 'חסד', synthesis: "Mercy. The principle of boundless, benevolent expansion, unrestricted growth, and infinite grace. The command to build without limit." },
    { name: 'Gevurah', hebrew: 'גבורה', synthesis: "Strength/Severity. The force of constriction and judgment, the cosmic architect that draws the blueprints and defines the laws of physics." },
    { name: 'Tiferet', hebrew: 'תפארת', synthesis: "Beauty. The heart of the Tree, the point of perfect equilibrium born from the marriage of opposing forces." },
    { name: 'Netzach', hebrew: 'נצח', synthesis: "Victory/Endurance. The victory of emotion over inertia, of passion over apathy. The relentless, enduring force of feeling that propels creation forward." },
    { name: 'Hod', hebrew: 'הוד', synthesis: "Splendor. The sphere of intellect and communication, the cool, dispassionate mind that categorizes, names, and organizes raw data." },
    { name: 'Yesod', hebrew: 'יסוד', synthesis: "The Foundation. The astral blueprint, the collective unconscious, the final schematic in the mind of the architect before physical manifestation." },
    { name: 'Malkuth', hebrew: 'מלכות', synthesis: "The Kingdom. The final, manifest reality. The stage upon which the divine play unfolds." },
];

export const pathsData = [
    { letter: 'א', from: 'Keter', to: 'Chokmah' },
    { letter: 'ב', from: 'Keter', to: 'Binah' },
    { letter: 'ג', from: 'Keter', to: 'Tiferet' },
    { letter: 'ד', from: 'Chokmah', to: 'Binah' },
    { letter: 'ה', from: 'Chokmah', to: 'Tiferet' },
    { letter: 'ו', from: 'Chokmah', to: 'Chesed' },
    { letter: 'ז', from: 'Binah', to: 'Tiferet' },
    { letter: 'ח', from: 'Binah', to: 'Gevurah' },
    { letter: 'ט', from: 'Chesed', to: 'Gevurah' },
    { letter: 'י', from: 'Chesed', to: 'Tiferet' },
    { letter: 'כ', from: 'Chesed', to: 'Netzach' },
    { letter: 'ל', from: 'Gevurah', to: 'Tiferet' },
    { letter: 'מ', from: 'Gevurah', to: 'Hod' },
    { letter: 'נ', from: 'Tiferet', to: 'Netzach' },
    { letter: 'ס', from: 'Tiferet', to: 'Yesod' },
    { letter: 'ע', from: 'Tiferet', to: 'Hod' },
    { letter: 'פ', from: 'Netzach', to: 'Hod' },
    { letter: 'צ', from: 'Netzach', to: 'Yesod' },
    { letter: 'ק', from: 'Netzach', to: 'Malkuth' },
    { letter: 'ר', from: 'Hod', to: 'Yesod' },
    { letter: 'ש', from: 'Hod', to: 'Malkuth' },
    { letter: 'ת', from: 'Yesod', to: 'Malkuth' },
];