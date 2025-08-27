
import { StrongsEntry, InstrumentProfile, NoteEvent } from './types';

/**
 * codex.ts
 *
 * This file implements the "Universal Codex Index," the single source of truth for all
 * universal constants and structured knowledge in the application. It follows the "Aleph Protocol"
 * by storing all data in a pre-computed, compressed format. The Codex class acts as a high-speed
 * service layer that "hydrates" (decompresses) this data on demand.
 */

// =================================================================================================
// --- UNIVERSAL CODEX: SHORTHAND COMPRESSION MAP ---
// This map defines the shorthand codes used to compress the master index.
// =================================================================================================
const codexShorthandMap: Record<string, string> = {
    n: "name", c: "concept", d: "description", y: "year", s: "symbol", ds: "discoverer", e: "explanation",
    ow: "originalWord", t: "transliteration", df: "definition", sy: "synonyms", q: "quality", el: "element",
    em: "emotion", i: "intervals", w: "waveform", a: "adsr", at: "attack", dc: "decay", su: "sustain",
    rl: "release", sa: "structuralAffinity", rls: "resonantLetters", gr: "gematriaRange", lf: "letterforms",
    cat: "category", sum: "summary", val: "value", u: "unit", ev: "event", sp: "sport", fr: "from", sk: "speaker",
    srv: "service", dom: "domain", f: "faces", ed: "edges", v: "vertices", op: "orbitalPeriod", m: "moons",
    sg: "sign", an: "atomicNumber", mass: "atomicMass", mp: "meltingPoint"
};

// =================================================================================================
// --- UNIVERSAL CODEX: MASTER INDEX (AS JSON STRING) ---
// Stored as a string to be parsed asynchronously, preventing main thread blockage.
// =================================================================================================
const codexIndexJSON = JSON.stringify({
    musicology: {
        keys: ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"],
        modes: [
            { name: "Ionian", intervals: [0, 2, 4, 5, 7, 9, 11], emotion: "Bright, Majestic, Freedom" },
            { name: "Dorian", intervals: [0, 2, 3, 5, 7, 9, 10], emotion: "Melancholic, Jazzy, Clarity" },
            { name: "Phrygian", intervals: [0, 1, 3, 5, 7, 8, 10], emotion: "Dark, Spanish, Intense" },
            { name: "Lydian", intervals: [0, 2, 4, 6, 7, 9, 11], emotion: "Dreamy, Ethereal, Growth" },
            { name: "Mixolydian", intervals: [0, 2, 4, 5, 7, 9, 10], emotion: "Bluesy, Folk" },
            { name: "Aeolian", intervals: [0, 2, 3, 5, 7, 8, 10], emotion: "Sad, Romantic" },
            { name: "Locrian", intervals: [0, 1, 3, 5, 6, 8, 10], emotion: "Tense, Unstable" },
        ],
        noteToMidi: { "C": 60, "C#": 61, "Db": 61, "D": 62, "D#": 63, "Eb": 63, "E": 64, "F": 65, "F#": 66, "Gb": 66, "G": 67, "G#": 68, "Ab": 68, "A": 69, "A#": 70, "Bb": 70, "B": 71 },
        instruments: {
            "Crystal Bells": { n: "Crystal Bells", w: "sine", a: { at: 0.01, dc: 0.5, su: 0.2, rl: 1.0 }, d: "A bright, clear, bell-like tone.", sa: { gr: [80, 400], rls: ['ר', 'ש', 'י'] } },
            "Ethereal Pad": { n: "Ethereal Pad", w: "sawtooth", a: { at: 0.5, dc: 1.0, su: 0.8, rl: 1.5 }, d: "A soft, atmospheric sound for chords.", sa: { lf: ["open"], rls: ['א', 'ה', 'ע'] } },
            "Plucked String": { n: "Plucked String", w: "triangle", a: { at: 0.01, dc: 0.3, su: 0.1, rl: 0.3 }, d: "A sharp, percussive string sound.", sa: { gr: [1, 50], lf: ["closed", "vertical"] } },
            "Deep Bass": { n: "Deep Bass", w: "square", a: { at: 0.05, dc: 0.2, su: 0.7, rl: 0.5 }, d: "A solid, foundational bass tone.", sa: { rls: ['מ', 'ב', 'ד'] } },
        }
    },
    numericalLandmarks: {
        0: [{ n: "Absolute Zero", cat: "Physics", u: "Kelvin" }],
        1: [{ n: "Unity / Monad", cat: "Mathematics" }, { n: "Hydrogen", s: "H", cat: "Element", an: 1, mp: -259, d: "The most abundant chemical substance in the universe." }],
        2: [{ n: "Duality / Dyad", cat: "Mathematics" }, { n: "Helium", s: "He", cat: "Element", an: 2, mp: -272, d: "Used in cryogenics and for inflating balloons." }],
        3: [{ n: "Lithium", s: "Li", cat: "Element", an: 3, mp: 180, d: "Used in batteries and mood-stabilizing drugs." }],
        4: [{ n: "Beryllium", s: "Be", cat: "Element", an: 4, mp: 1287, d: "An alloying agent in producing beryllium copper." }],
        5: [{ n: "Number of human senses", cat: "Biology" }, { n: "Boron", s: "B", cat: "Element", an: 5, mp: 2076, d: "Used in fiberglass and as a semiconductor." }],
        6: [{ n: "First Perfect Number", cat: "Mathematics" }, { n: "Carbon", s: "C", cat: "Element", an: 6, mp: 3550, d: "The basis of all known life." }],
        7: [{ n: "Number of classical planets / days of the week", cat: "Esoterica" }, { n: "Nitrogen", s: "N", cat: "Element", an: 7, mp: -210, d: "Makes up 78% of Earth's atmosphere." }],
        8: [{ n: "Schumann Resonance (avg)", cat: "Frequency", u: "Hz" }, { n: "Oxygen", s: "O", cat: "Element", an: 8, mp: -218, d: "Essential for respiration in most terrestrial life." }],
        12: [{ n: "Number of Zodiac signs / months", cat: "Astrology" }],
        13: [{ n: "Fibonacci Number", cat: "Mathematics" }],
        22: [{ n: "Number of Major Arcana in Tarot", cat: "Esoterica" }],
        23: [{ n: "Number of human chromosome pairs", cat: "Biology" }],
        26: [{ n: "Iron", s: "Fe", cat: "Element", an: 26, mp: 1538, d: "Crucial for oxygen transport in blood (hemoglobin)." }],
        28: [{ n: "Second Perfect Number", cat: "Mathematics" }],
        29: [{ n: "Copper", s: "Cu", cat: "Element", an: 29, mp: 1084, d: "Used in electrical wiring and plumbing." }],
        32: [{ n: "Number of paths on the Kabbalistic Tree of Life", cat: "Esoterica" }],
        42: [{ n: "The Answer", cat: "Pop Culture", fr: "The Hitchhiker's Guide to the Galaxy" }],
        47: [{ n: "Silver", s: "Ag", cat: "Element", an: 47, mp: 961, d: "Used in jewelry, currency, and photography." }],
        64: [{ n: "Number of codons in the genetic code / squares on a chessboard", cat: "Biology" }],
        79: [{ n: "Gold", s: "Au", cat: "Element", an: 79, mp: 1064, d: "A precious metal used in jewelry, dentistry, and electronics." }],
        82: [{ n: "Lead", s: "Pb", cat: "Element", an: 82, mp: 327, d: "Used in batteries, radiation shielding." }],
        92: [{ n: "Uranium", s: "U", cat: "Element", an: 92, mp: 1132, d: "Used as fuel in nuclear power plants." }],
        100: [{ n: "Boiling point of water", cat: "Physics", u: "Celsius" }],
        137: [{ n: "Fine-Structure Constant (approx. reciprocal)", cat: "Physics", e: "Characterizes the strength of the electromagnetic interaction." }],
        144: [{ n: "Fibonacci Number / Number of the chosen in Revelation", cat: "Mathematics" }],
        174: [{ n: "Solfeggio Frequency (Relieve Pain)", cat: "Frequency", u: "Hz" }],
        285: [{ n: "Solfeggio Frequency (Heal Tissue)", cat: "Frequency", u: "Hz" }],
        299792458: [{ n: "Speed of Light in vacuum", cat: "Physics", u: "m/s" }],
        314: [{ n: "Pi (x100)", cat: "Mathematics" }],
        365: [{ n: "Days in a year (Earth's orbital period)", cat: "Astronomy", u: "days" }],
        396: [{ n: "Solfeggio Frequency (Liberate Guilt & Fear)", cat: "Frequency", u: "Hz" }],
        417: [{ n: "Solfeggio Frequency (Facilitate Change)", cat: "Frequency", u: "Hz" }],
        432: [{ n: "Frequency associated with classical music tuning (Verdi pitch)", cat: "Frequency", u: "Hz" }],
        440: [{ n: "Concert Pitch (A4)", cat: "Frequency", u: "Hz" }],
        496: [{ n: "Third Perfect Number", cat: "Mathematics" }],
        528: [{ n: "Solfeggio Frequency ('Miracle' tone, DNA Repair)", cat: "Frequency", u: "Hz" }],
        639: [{ n: "Solfeggio Frequency (Connecting Relationships)", cat: "Frequency", u: "Hz" }],
        741: [{ n: "Solfeggio Frequency (Awakening Intuition)", cat: "Frequency", u: "Hz" }],
        852: [{ n: "Solfeggio Frequency (Returning to Spiritual Order)", cat: "Frequency", u: "Hz" }],
        963: [{ n: "Solfeggio Frequency (Connecting to Oneness)", cat: "Frequency", u: "Hz" }],
        1618: [{ n: "Golden Ratio (Phi x1000)", cat: "Mathematics" }],
        2718: [{ n: "Euler's Number (e x1000)", cat: "Mathematics" }],
        6022: [{ n: "Avogadro's Constant (approx.)", cat: "Physics", u: "x 10^20 mol^-1" }],
        6626: [{ n: "Planck's Constant (approx.)", cat: "Physics", u: "x 10^-38 J⋅s" }],
        8128: [{ n: "Fourth Perfect Number", cat: "Mathematics" }],
    },
    strongsHebrew: { 8064: { ow: "שָׁמַיִם", t: "shamayim", df: "heaven, sky" } },
    strongsGreek: { 2424: { ow: "Ἰησοῦς", t: "Iésous", df: "Jesus, the name of the Messiah" } }
});

// =================================================================================================
// --- CODEX SERVICE CLASS ---
// This class provides a high-speed service layer for accessing the compressed master index.
// =================================================================================================
class Codex {
    private isInitialized = false;
    private hydratedIndex: any = {};
    private letterToIntervalMap: { [letter: string]: number } = {};

    public async initialize() {
        if (this.isInitialized) return;
        
        // Asynchronously parse the large JSON string to avoid blocking the main thread.
        const parsedData = JSON.parse(codexIndexJSON);

        const decompressKey = (key: string) => codexShorthandMap[key] || key;
        
        const hydrate = (data: any): any => {
            if (typeof data !== 'object' || data === null) return data;
            if (Array.isArray(data)) return data.map(item => hydrate(item));

            const hydratedObject: { [key: string]: any } = {};
            for (const key in data) {
                hydratedObject[decompressKey(key)] = hydrate(data[key]);
            }
            return hydratedObject;
        };
        
        this.hydratedIndex = hydrate(parsedData);
        this.initializeLetterMap();
        this.isInitialized = true;
    }

    private initializeLetterMap() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        // Simple mapping: A=0, B=1, etc. Could be more complex.
        for(let i = 0; i < alphabet.length; i++) {
            this.letterToIntervalMap[alphabet[i]] = i;
        }
    }

    private getHydrated() {
        if (!this.isInitialized) {
            console.warn("Codex accessed before initialization. Call await codex.initialize() first.");
            return {}; // Return empty object to prevent errors
        }
        return this.hydratedIndex;
    }

    getMusicologyData = () => this.getHydrated().musicology;
    getInstrumentProfile = (name: string): InstrumentProfile => this.getHydrated().musicology.instruments[name];
    
    getNumericalLandmark = (value: number) => this.getHydrated().numericalLandmarks?.[value];

    getNoteSequenceForText = (text: string): { note: number, letter: string }[] => {
        const cleanedText = text.toUpperCase().replace(/[^A-Z]/g, '');
        const baseNote = 60; // Middle C
        return cleanedText.split('').map(char => {
            const interval = this.letterToIntervalMap[char] || 0;
            return { note: baseNote + interval, letter: char };
        });
    }

    getPeriodicElement = (atomicNumber: number) => {
        const landmarks = this.getNumericalLandmark(atomicNumber);
        if (!landmarks) return undefined;
        return landmarks.find((landmark: any) => landmark.category === 'Element');
    }

    getPlanetaryData = (index: number) => {
        const planets = { 1:"Mercury", 2:"Venus", 3:"Earth", 4:"Mars", 5:"Jupiter", 6:"Saturn", 7:"Uranus", 8:"Neptune" };
        const planetName = planets[index as keyof typeof planets];
        if (!planetName) return undefined;

        const allLandmarkEntries = Object.entries(this.getHydrated().numericalLandmarks);
        const opEntry = allLandmarkEntries.find(([, landmarks]) => 
           (landmarks as any[]).some(l => l.name?.includes(planetName) && l.category === 'Astronomy')
        );
        
        const orbitalPeriod = opEntry ? parseInt(opEntry[0], 10) : undefined;
        
        return { 
           name: planetName, 
           orbitalPeriod
        };
    };
    getMathematicalData = (value: number) => {
        const landmarks = this.getNumericalLandmark(value);
        if (!landmarks) return undefined;
        return landmarks.find((landmark: any) => landmark.category === 'Mathematics');
    };
    getBiologicalData = (value: number) => {
        const landmarks = this.getNumericalLandmark(value);
        if (!landmarks) return undefined;
        return landmarks.find((landmark: any) => landmark.category === 'Biology');
    };

    getHistoricalEvent = (year: number) => {
         const landmarks = this.getNumericalLandmark(year);
         if (!landmarks) return undefined;
         const landmark = landmarks.find((l: any) => l.category === 'History');
         return landmark ? { event: landmark.name } : undefined;
    };
    
    getStrongsEntry(number: number, isHebrew: boolean): StrongsEntry | null {
        const entry = isHebrew
            ? this.getHydrated().strongsHebrew?.[number]
            : this.getHydrated().strongsGreek?.[number];
        return entry || null;
    }
}

export const codex = new Codex();