
// =================================================================================================
// --- CHAKRA DATA ---
// Defines the core properties of the seven primary chakras for use in meditation and
// bio-feedback interfaces.
// =================================================================================================

import { Chakra } from './src/types.ts';

export const chakraData: Chakra[] = [
    {
        name: 'Root Chakra (Muladhara)',
        color: '#FF0000',
        solfeggioFrequency: 396,
        description: 'Represents our foundation and feeling of being grounded. It is associated with security, survival, and basic needs.',
        location: 'Base of the spine'
    },
    {
        name: 'Sacral Chakra (Svadhisthana)',
        color: '#FF8C00',
        solfeggioFrequency: 417,
        description: 'Our connection and ability to accept others and new experiences. It is associated with creativity, emotions, and relationships.',
        location: 'Lower abdomen'
    },
    {
        name: 'Solar Plexus Chakra (Manipura)',
        color: '#FFFF00',
        solfeggioFrequency: 528,
        description: 'Our ability to be confident and in-control of our lives. It is associated with personal power, self-esteem, and will.',
        location: 'Upper abdomen'
    },
    {
        name: 'Heart Chakra (Anahata)',
        color: '#00FF00',
        solfeggioFrequency: 639,
        description: 'Our ability to love and show compassion. It is the center of our connection, healing, and harmony.',
        location: 'Center of the chest'
    },
    {
        name: 'Throat Chakra (Vishuddha)',
        color: '#00BFFF',
        solfeggioFrequency: 741,
        description: 'Our ability to communicate our personal power. It is associated with self-expression, truth, and communication.',
        location: 'Throat'
    },
    {
        name: 'Third Eye Chakra (Ajna)',
        color: '#4B0082',
        solfeggioFrequency: 852,
        description: 'Our ability to focus on and see the big picture. It is associated with intuition, imagination, and wisdom.',
        location: 'Forehead, between the eyes'
    },
    {
        name: 'Crown Chakra (Sahasrara)',
        color: '#8A2BE2',
        solfeggioFrequency: 963, // Often associated, though not a core Solfeggio tone
        description: 'The highest chakra represents our ability to be fully connected spiritually. It is associated with consciousness and enlightenment.',
        location: 'The very top of the head'
    },
];

export const getChakraForIntent = (intent: string): Chakra => {
    // Simple hash function to deterministically map intent to a chakra
    const hash = intent.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return chakraData[hash % chakraData.length];
};
