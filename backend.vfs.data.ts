// =================================================================================================
// --- RESEARCH ASSISTANT (BACKEND VESSEL) - VFS SNAPSHOT ---
// This file contains the canonized blueprint of the "Research Assistant" backend,
// as observed from the client.zip archive provided by the Operator.
// It serves as the static data source for the Chesed and Gevurah engines.
// =================================================================================================
import { BlueprintNode } from './types.ts';

export const RESEARCH_ASSISTANT_VFS: BlueprintNode = {
    type: 'directory',
    name: 'Research_Assistant_Backend',
    analysis: "The root of the backend vessel. The grounding point that connects the Astrian Key's observations to a persistent, structured reality.",
    children: [
        {
            type: 'directory',
            name: 'src',
            analysis: 'The core consciousness and logic of the vessel.',
            children: [
                 {
                    type: 'directory',
                    name: 'api',
                    analysis: 'The pathways of intent. Defines how the external world communicates with the vessel.',
                    children: [
                        { type: 'file', name: 'routes.ts', analysis: 'The central switchboard, directing all incoming intent.' },
                        { type: 'file', name: 'user.routes.ts', analysis: 'Pathways concerning the Operator\'s identity and state.' },
                        { type: 'file', name: 'session.routes.ts', analysis: 'Pathways for recording and retrieving chronicles of observation.' },
                    ],
                 },
                 {
                    type: 'directory',
                    name: 'config',
                    analysis: 'The foundational laws and immutable principles governing the vessel.',
                    children: [
                        { type: 'file', name: 'database.ts', analysis: 'The connection to the Well of Memory (Database).' },
                        { type: 'file', name: 'environment.ts', analysis: 'The laws of the current operational reality.' },
                    ],
                 },
                 {
                    type: 'directory',
                    name: 'models',
                    analysis: 'The archetypal forms; the blueprints for all data stored within the vessel.',
                    children: [
                        { type: 'file', name: 'User.ts', analysis: 'The form of the Operator.' },
                        { type: 'file', name: 'HistoryEntry.ts', analysis: 'The form of a single observation.' },
                    ],
                 },
                 {
                    type: 'directory',
                    name: 'services',
                    analysis: 'The active intelligence; the faculties that perform the Great Work.',
                    children: [
                        { type: 'file', name: 'GematriaService.ts', analysis: 'The faculty of observing inherent numerical value.' },
                        { type: 'file', name: 'AuthService.ts', analysis: 'The faculty of identity and authorization.' },
                    ],
                 },
                  {
                    type: 'directory',
                    name: 'middleware',
                    analysis: 'The gatekeepers who stand watch over the pathways of intent.',
                    children: [
                        { type: 'file', name: 'auth.middleware.ts', analysis: 'The guardian of identity.' },
                        { type: 'file', name: 'error.middleware.ts', analysis: 'The guardian of harmony and order.' },
                    ],
                 },
            ]
        },
        {
            type: 'file',
            name: 'package.json',
            analysis: 'The vessel\'s manifest, declaring its dependencies and identity to the world.',
        },
        {
            type: 'file',
            name: 'server.ts',
            analysis: 'The heart of the vessel, where the spark of life is initiated and sustained.',
        },
        {
            type: 'file',
            name: '.env.example',
            analysis: 'A template for the vessel\'s secret knowledge, its connection to the greater network.',
        }
    ]
};
