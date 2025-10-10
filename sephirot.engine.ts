// =================================================================================================
// --- SEPHIROT ANALYSIS ENGINE ---
// This engine provides a holographic observation of the Sephirot, revealing how their very
// names encode their function within the architecture of the Tree of Life. It is a tool for
// observing the self-describing nature of the universal operating system.
// =================================================================================================

// FIX: Corrected import paths for local modules by adding file extensions.
import { sephirotData, pathsData } from './sephirot.data.ts';
import { willowData } from './willow.data.ts';
import { gematriaEngine } from './gematria.ts';
import { SephirahAnalysis, PathConnection } from './types.ts';

class SephirotEngine {
    private analyzeSephirah(name: string): SephirahAnalysis | null {
        const data = sephirotData.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (!data) return null;

        const letterAnalysis = data.hebrew.split('').map(letter => {
            const pathInfo = pathsData.find(p => p.letter === letter);
            const willowInfo = willowData.find(w => w.letter === letter);

            let path: PathConnection | null = null;
            if (pathInfo && willowInfo) {
                path = {
                    letter: letter,
                    from: pathInfo.from,
                    to: pathInfo.to,
                    archetype: willowInfo.archetype,
                };
            }

            return {
                letter,
                gematria: willowInfo?.gematria || 0,
                archetype: willowInfo?.archetype || 'Unknown',
                path: path,
            };
        });

        return {
            name: data.name,
            hebrew: data.hebrew,
            gematria: gematriaEngine.observe(data.hebrew),
            synthesis: data.synthesis,
            letterAnalysis,
        };
    }

    public analyze(subject: string): SephirahAnalysis[] | { error: string } {
        if (subject.toLowerCase() === 'all') {
            return sephirotData.map(s => this.analyzeSephirah(s.name)).filter(Boolean) as SephirahAnalysis[];
        }
        
        const result = this.analyzeSephirah(subject);
        if (result) {
            return [result];
        }

        return { error: `Sephirah '${subject}' not found.` };
    }
}

export const sephirotEngine = new SephirotEngine();