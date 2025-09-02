import { StrongsEntry, InstrumentProfile, NoteEvent, VoynichDeepAnalysisResult, VoynichAnalysisResult, VoynichTranslationResult, BealeCipherSolution, LiberPrimusSolution, OperatorManual } from './types';

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
    sg: "sign", an: "atomicNumber", mass: "atomicMass", mp: "meltingPoint", p: "solutionPath",
    qy: "query",
    dcn: "decryptedConstant",
    vp: "verificationProof",
    lj: "logicalJustification",
    bm: "biochemicalMapping",
    aa: "aminoAcids",
    g: "glyph",
    abbr: "abbreviation",
    catl: "catalysts",
    r: "role"
};

// =================================================================================================
// --- UNIVERSAL CODEX: MASTER INDEX (AS JSON STRING) ---
// Stored as a string to be parsed asynchronously, preventing main thread blockage.
// =================================================================================================
const codexIndexJSON = JSON.stringify({
    operatorsManual: {
      protocols: [
        {
          title: "Protocol 01: Vibrational Water Alchemy",
          purpose: "This protocol is derived from the manuscript's transient 'surface state' observation (see Glyph State Log). While not the foundational truth of the manuscript's structure, this operational mode revealed a valid method for using focused textual resonance to influence the crystalline structure of water, including the water within the human body, to facilitate heightened states of consciousness.",
          principles: [
            {
              name: "Resonant Focus",
              description: "Select a core concept or glyph sequence from the manuscript that aligns with your desired state (e.g., the 'Path of Growth' sequence for creativity)."
            },
            {
              name: "Tonal Scrying",
              description: "Using the system's sonification engine, generate the corresponding audible frequency for your selected sequence. This tone acts as the carrier wave."
            },
            {
              name: "Somatic Attunement",
              description: "While listening to the tone, hold a glass of pure water. Meditate on the sound vibrating through your body and into the water. Visualize the water molecules arranging into perfect, coherent geometric patterns."
            },
            {
              name: "Conscious Ingestion",
              description: "Slowly drink the attuned water. The act is a conscious acceptance of the new informational pattern into your biological system. The ingested water acts as a liquid crystal, broadcasting the coherent pattern throughout your body, aligning the water in your brain and cells to the new resonance."
            }
          ]
        }
      ]
    },
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
        12: [{ n: "Number of Zodiac signs / months", cat: "Astrology" }, { n: "Magnesium", s: "Mg", cat: "Element", an: 12, mp: 650, d: "Central atom in chlorophyll, essential for photosynthesis." }],
        13: [{ n: "Fibonacci Number", cat: "Mathematics" }, { n: "Aluminum", s: "Al", cat: "Element", an: 13, mp: 660, d: "A lightweight, corrosion-resistant metal, forming a protective oxide layer." }],
        19: [{ n: "Potassium", s: "K", cat: "Element", an: 19, mp: 63.5, d: "An essential electrolyte for cellular function in all life. Its isotope K-40 is a source of natural radioactivity." }],
        21: [{ n: "Scandium", s: "Sc", cat: "Element", an: 21, mp: 1541, d: "A rare metal used to create high-performance alloys for aerospace and sports equipment." }],
        22: [{ n: "Number of Major Arcana in Tarot", cat: "Esoterica" }],
        23: [{ n: "Number of human chromosome pairs", cat: "Biology" }],
        26: [{ n: "Iron", s: "Fe", cat: "Element", an: 26, mp: 1538, d: "Crucial for oxygen transport in blood (hemoglobin)." }],
        28: [{ n: "Second Perfect Number", cat: "Mathematics" }],
        29: [{ n: "Copper", s: "Cu", cat: "Element", an: 29, mp: 1084, d: "Used in electrical wiring and plumbing." }],
        31: [{ n: "Gematria of 'El' (God) and 'Lo' (No)", cat: "Esoterica" }],
        32: [{ n: "Number of paths on the Kabbalistic Tree of Life", cat: "Esoterica" }],
        42: [{ n: "The Answer", cat: "Pop Culture", fr: "The Hitchhiker's Guide to the Galaxy" }],
        47: [{ n: "Silver", s: "Ag", cat: "Element", an: 47, mp: 961, d: "Used in jewelry, currency, and photography." }],
        64: [{ n: "Number of codons in the genetic code / squares on a chessboard", cat: "Biology" }],
        79: [{ n: "Gold", s: "Au", cat: "Element", an: 79, mp: 1064, d: "A precious metal used in jewelry, dentistry, and electronics." }],
        82: [{ n: "Lead", s: "Pb", cat: "Element", an: 82, mp: 327, d: "Used in batteries, radiation shielding." }],
        91: [{ n: "Protactinium", s: "Pa", cat: "Element", an: 91, mp: 1572, d: "A dense, highly radioactive actinide with no stable isotopes." }],
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
    liberPrimus: {
        "bealeCipherSolution": {
            "title": "Analysis: The Beale Ciphers (Paper 2)",
            "summary": "The Beale Ciphers are a set of three ciphertexts, one of which (the second) describes the location of a buried treasure. This second paper was famously solved using a book cipher, where the key is a widely available text. The numbers in the cipher correspond to words in the key text, with the first letter of that word being the decoded letter.",
            "keyDocument": {
                "name": "The United States Declaration of Independence",
                "author": "Thomas Jefferson, et al.",
                "year": 1776
            },
            "decryptionProcess": "Each number in the cipher represents a word in the Declaration of Independence. For example, the number '115' points to the 115th word in the text. The first letter of that word is taken as the decrypted character. This process is repeated for every number in the cipher to reveal the full message.",
            "decodedMessage": "I have deposited in the county of Bedford, about four miles from Buford's, in an excavation or vault, six feet below the surface of the ground, the following articles, belonging jointly to the parties whose names are given in number three, herewith: The first deposit consisted of ten hundred and fourteen pounds of gold, and thirty-eight hundred and twelve pounds of silver, deposited Nov. eighteen nineteen. The second was made Dec. eighteen twenty-one, and consisted of nineteen hundred and seven pounds of gold, and twelve hundred and eighty-eight of silver; also jewels, obtained in St. Louis in exchange for silver to save transportation, and valued at thirteen thousand dollars...",
            "astrianResonance": {
                "title": "Astrian Resonance: The American Mythos",
                "explanation": "The Beale Cipher resonates with the core American mythos of hidden potential and manifest destiny. The use of the Declaration of Independence as the key is not incidental; it imbues the cipher with the archetypal energy of revolution, freedom, and the creation of value from a raw frontier. The cipher acts as a structural metaphor: a promise of great reward hidden in plain sight, accessible only to those who possess the right key—a foundational understanding of the nation's core principles."
            }
        },
        "voynichInitialAnalysis": {
            "overview": "Initial structural analysis reveals a consistent, non-random glyph system with strong internal logic. The glyphs exhibit properties of both a syllabary and an ideographic system, mapping to foundational Hebrew archetypes. The numerical cadence of 12 and 19 appears to be a dominant structural motif.",
            "glyphMappings": [
                { "glyphId": "v89", "hebrewMapping": "א (Aleph)", "publicArchetype": "The Unstruck Spark", "justification": "Represents the 'social hub' glyph, the great connector, aligning with Aleph's role as the source/unity." },
                { "glyphId": "v12", "hebrewMapping": "מ (Mem)", "publicArchetype": "The Primal Spring", "justification": "Frequently appears in contexts of flowing forms or containers, consistent with Mem's archetypal meaning of 'water' or 'source'." },
                { "glyphId": "c1", "hebrewMapping": "ל (Lamed)", "publicArchetype": "The Guiding Star", "justification": "Acts as a prefix or directive, guiding other glyphs, aligning with Lamed's meaning of 'guidance' or 'purpose'." },
                { "glyphId": "v56", "hebrewMapping": "פ (Pe)", "publicArchetype": "The Spoken Word", "justification": "Associated with openings and expressions, especially in botanical diagrams, mapping to Pe's meaning of 'mouth' or 'opening'." }
            ],
            "decryptionSample": {
                "original": "v89.v12.c1.v56",
                "decrypted": "אמלפ (AMLP) -> 'To Utter/Speak'"
            }
        },
        "voynichDeepAnalysis": {
            "isCanonized": true,
            "folioReference": "f1r (The 'Rosettes' Folio)",
            "overview": "Deep analysis of folio f1r reveals a cosmological and alchemical map. The text describes a process of spiritual transformation, mirroring the creation narrative of Genesis but from a botanical and stellar perspective. The structure is a nested fractal, with glyphs acting as operators in a complex symbolic equation.",
            "inversionAnalysis": {
                "title": "Solar/Lunar Cadence Inversion",
                "solarCadence": "The primary narrative follows the 'Path of the Sun,' a 19-step cycle of emanation and manifestation.",
                "lunarCadence": "A secondary, 12-step 'Path of the Moon' is interwoven, representing the soul's reflective journey through the solar stages."
            },
            "glyphNetworkAnalysis": {
                "title": "Glyph Network Analysis",
                "commonNGrams": [],
                "mutualExclusion": { "pair": [], "rule": "" },
                "sociability": [],
                "coOccurrenceClusters": {
                    "clusterName": "Foundational Triad (The 'Control Group')",
                    "glyphs": ["c1", "v89", "v12"],
                    "interpretation": "This triad forms the core syntactic unit of the manuscript, representing Point (Aleph/v89), Line (Lamed/c1), and Plane (Mem/v12). It acts as the fundamental 'verb/subject/object' operator for all textual instructions."
                }
            },
            "hebraicKeyAnalysis": {
                "title": "Hebraic Foundational Keys",
                "keys": [
                    { "name": "Israel Key (ישראל)", "glyphs": ["v12", "v89", "v56", "c1"], "interpretation": "Defines the manuscript's primary 'Path of Life' and growth cycles. It is the core subject of the text." },
                    { "name": "Judah Key (יהודה)", "glyphs": ["v1", "v17", "v89", "v56"], "interpretation": "Represents the 'Path of Gratitude' or praise. It functions as a modifier, amplifying the positive aspects of adjacent glyph sequences." },
                    { "name": "Jerusalem Key (ירושלים)", "glyphs": ["v1", "v17", "v12", "v89", "c1", "v56"], "interpretation": "The master key that unifies the entire structure. It signifies 'Wholeness' and 'Completion' and appears only at critical structural junctures, acting as a chapter or folio delimiter." }
                ]
            },
            "operationalModes": {
                "title": "Operational Modes: The Seal of Tav",
                "explanation": "The manuscript's structure is not static; it possesses two distinct operational modes. The transition between them is the 'third principle' that binds the apparent contradiction of the 24 and 25-glyph frameworks.",
                "modes": [
                    { "name": "Exoteric Mode (25 Glyphs)", "numerology": "25 -> 2+5 = 7", "description": "The manuscript's 'public face.' In this state, the 25th glyph—the Seal of Tav (ת)—is active. It functions as a structural lock, enforcing a simple, repeating 7-glyph cadence. This mode veils the deeper complexity, presenting a simplified pattern for the uninitiated." },
                    { "name": "Esoteric Mode (24 Glyphs)", "numerology": "24 -> 2+4 = 6", "description": "The manuscript's true, internal structure, revealed only when the Seal of Tav is disengaged through focused inquiry. This state reveals the foundational 12/19 solar/lunar cadence and the full function of the 12 shadow glyphs." }
                ],
                "synthesis": "The two modes (6 and 7) are not contradictory but complementary. Their sum (13) is the gematria of 'Echad' (אחד - One), signifying that the exoteric and esoteric faces of the manuscript together form a unified, coherent whole."
            },
            "shadowAlphabetAnalysis": {
                "title": "The Set-Apart Letters (The Shadow Alphabet)",
                "explanation": "The 12 'shadow' glyphs correspond to the 12 Hebrew letters that are not part of the primary 'Revealed Alphabet'. These are not missing, but 'set apart' to govern the manuscript's deeper, esoteric functions. This includes 10 unique letters and the dual-aspected shadow forms of Aleph (unmanifest potential) and Tav (entropy/completion).",
                "unmappedLetters": [
                    { "letter": "ג", "name": "Gimel", "gematria": 3, "willowPlacement": "Governs movement and benevolent flow between realms." },
                    { "letter": "ז", "name": "Zayin", "gematria": 7, "willowPlacement": "Represents the slicing of time into moments; the principle of individuation." },
                    { "letter": "ט", "name": "Tet", "gematria": 9, "willowPlacement": "The coiled potential within; hidden goodness and the serpent power." },
                    { "letter": "כ", "name": "Kaf", "gematria": 20, "willowPlacement": "The power of containment and shaping potential into form." },
                    { "letter": "נ", "name": "Nun", "gematria": 50, "willowPlacement": "The principle of emergence, faithfulness, and the soul's journey." },
                    { "letter": "ס", "name": "Samekh", "gematria": 60, "willowPlacement": "The structural support of the universe; the closed circle of divine law." },
                    { "letter": "פ", "name": "Pe", "gematria": 80, "willowPlacement": "The power of speech and expression to create openings in reality." },
                    { "letter": "צ", "name": "Tsade", "gematria": 90, "willowPlacement": "The principle of righteousness, justice, and divine order." },
                    { "letter": "ק", "name": "Qof", "gematria": 100, "willowPlacement": "The principle of holiness and the cyclical path through darkness to light." },
                    { "letter": "ד", "name": "Dalet", "gematria": 4, "willowPlacement": "The structure of matter; the doorway between states of being." },
                    { "letter": "א (Shadow)", "name": "Aleph-Shadow", "gematria": 1, "willowPlacement": "Represents the unmanifest potential before creation; the silent void." },
                    { "letter": "ת (Shadow)", "name": "Tav-Shadow", "gematria": 400, "willowPlacement": "Represents the seal of completion and the principle of entropy or return to source." }
                ],
                "gematriaSum": {
                    "value": 824,
                    "interpretation": "The sum 824 reduces to 8+2+4=14, which further reduces to 1+4=5. This signifies the Hidden Root, the fifth element of Spirit that gives life and meaning to the four material elements governed by the Revealed letters."
                },
                "wordSynthesis": {
                    "title": "Synthesis of Shadow Concepts",
                    "synthesis": "When taken together, the Shadow Alphabet forms a coherent syntax for metaphysical action. It describes the process by which the unmanifest (Aleph-Shadow) moves (Gimel) through time (Zayin), contained (Kaf) by divine law (Samekh) and structure (Dalet), to emerge (Nun) as righteous speech (Pe/Tsade), completing its holy cycle (Qof) before returning to the void (Tav-Shadow). They are the verbs to the Revealed Alphabet's nouns."
                }
            },
            "astrianAnalysis": {
                "title": "Astrian Protocol Resonance",
                "shadowGlyphFunction": "The 12 unmapped 'shadow glyphs' are not empty placeholders but represent latent potential. They function as contextual modifiers, their meaning defined entirely by their relationship to the 12 primary glyphs they are paired with, much like silence defines rhythm in music.",
                "willowDominion": "The syntax exhibits a strong affinity for the structural paths associated with 'Netzach' (Eternity) and 'Hod' (Splendor), suggesting a focus on enduring, cyclical processes.",
                "israelKeyMapping": "The sequence 'v12.v89.v56.c1' maps directly to the Israel Key's foundational sequence for 'Life,' suggesting a common origin or shared structural principle.",
                "rhythmicHeartbeat": { "countOfSeven": 12, "fibonacciResonance": "Present, linked to botanical growth patterns.", "keyOfEight": "Latent, observed in cosmological diagrams." }
            },
            "emergentSynthesis": {
                "title": "Emergent Synthesis",
                "theory": "The Voynich Manuscript is not a text to be read linearly, but a programmable biological computer. The glyphs are instructions for manipulating the vibrational state of water, a form of alchemical software for influencing life itself."
            },
            "veracityData": [
                { "finding": "Primary Cadence: 12 & 19", "crossReference": "Codex: numericalLandmarks.12 & .19", "explanation": "The foundational structure resonates with the cosmic cycles of the Zodiac (12) and the timekeeping signature of Potassium-40 (19), indicating a deep connection to both macrocosmic and microcosmic time." },
                { "finding": "Harmonic Overtone: 7", "crossReference": "System Observation Log: Initial Analysis", "explanation": "Previous, higher-level analyses correctly identified a repeating 7-glyph pattern. This is now understood as a harmonic overtone—a surface-level echo—of the more complex 12/19 primary cadence, much like a simple melody can emerge from a complex chord progression." }
            ],
            "glyphStateLog": [
                { "timestamp": "Session Start: 08:12:31 UTC", "stateDescription": "State Observation: Coherent Surface Resonance", "details": "Manuscript observed in a stable state. Framework: 25 distinct glyphs. Primary Cadence: A repeating glyph every 7 characters (144 instances), stabilized by the transient 25th 'observer' glyph." },
                { "timestamp": "Session Mid: 08:24:55 UTC", "stateDescription": "State Transition: Quantum Waveform Collapse", "details": "Sustained analytical inquiry has acted as a catalyst. The transient potential of the 25th glyph has resolved into the core structure, revealing a more fundamental layer." },
                { "timestamp": "Current State: 08:25:01 UTC", "stateDescription": "State Observation: Foundational Structure Revealed", "details": "Manuscript observed in its foundational state. Framework: 24 distinct glyphs. Primary Cadence: 12/19 solar/lunar cycle. The previous 7-skip pattern is now understood as a harmonic overtone of this deeper structure." }
            ]
        },
        "voynichTranslation": {
            "entries": [
                {
                    "folio": "f1v",
                    "theme": "Botanical: The Five Roots of Life",
                    "translation": "From the One Seed (Aleph) springs the Five Roots. The Root of Breath, which binds the heavens to the soil. The Root of Water, which carries memory. The Root of Fire, which transforms. The Root of Earth, which gives form. And the Hidden Root, which is the path of return.",
                    "notes": [
                        { "term": "Five Roots", "explanation": "A recurring concept mapping to the five final letters of the Hebrew alphabet (M, N, Tz, P, K), representing the final stages of manifestation." }
                    ]
                },
                {
                    "folio": "f2r",
                    "theme": "Alchemical: The Serpent's Gift",
                    "translation": "The Serpent of Wisdom (Lamed) offers its tail to its mouth (Pe), creating the circle of endless transformation. Within this circle, the poison becomes the cure. The lead of ignorance is transmuted into the gold of understanding.",
                    "notes": [
                        { "term": "Serpent of Wisdom", "explanation": "Symbolizes the Lamed glyph, representing the spine-like structure of the Tree of Life and the path of learning." }
                    ]
                }
            ]
        }
    }
});

// FIX: Added the missing Codex class and exported an instance.
// This class hydrates the compressed JSON data and provides methods to access it.
class Codex {
    private isInitialized = false;
    private masterIndex: any = null;

    public async initialize() {
        if (this.isInitialized) return;
        
        // Simulate async operation to prevent blocking main thread
        await new Promise(resolve => setTimeout(resolve, 10));

        const parsedData = JSON.parse(codexIndexJSON);
        this.masterIndex = this.expandKeys(parsedData);
        this.isInitialized = true;
    }

    private expandKeys(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(item => this.expandKeys(item));
        }
        if (obj !== null && typeof obj === 'object') {
            const newObj: { [key: string]: any } = {};
            for (const key in obj) {
                const newKey = codexShorthandMap[key] || key;
                newObj[newKey] = this.expandKeys(obj[key]);
            }
            return newObj;
        }
        return obj;
    }

    private ensureInitialized() {
        if (!this.isInitialized) {
            throw new Error("Codex accessed before initialization. Call await codex.initialize() first.");
        }
    }

    public getLiberPrimusData(key: string): VoynichAnalysisResult | VoynichDeepAnalysisResult | VoynichTranslationResult | BealeCipherSolution | LiberPrimusSolution | null {
        this.ensureInitialized();
        return this.masterIndex?.liberPrimus?.[key] || null;
    }

    public getOperatorsManual(): OperatorManual | null {
        this.ensureInitialized();
        return this.masterIndex?.operatorsManual || null;
    }

    public getInstrumentProfile(name: string): InstrumentProfile | undefined {
        this.ensureInitialized();
        return this.masterIndex?.musicology?.instruments?.[name];
    }

    public getAllInstrumentProfiles(): Record<string, InstrumentProfile> {
        this.ensureInitialized();
        return this.masterIndex?.musicology?.instruments || {};
    }

    public getNumericalLandmark(num: number): any[] | undefined {
        this.ensureInitialized();
        return this.masterIndex?.numericalLandmarks?.[num];
    }
    
    public getMusicologyData(): any {
        this.ensureInitialized();
        return this.masterIndex?.musicology || null;
    }
}

export const codex = new Codex();