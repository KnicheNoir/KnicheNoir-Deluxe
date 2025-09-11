/**
 * almanacs.ts
 *
 * This file contains the LivingLibraryService and the initial state of the library's canon.
 * It has been re-architected from a static data object into a dynamic service to support
 * the Da'at Ingestion Protocol, allowing the library to be expanded at runtime.
 */

// =================================================================================================
// --- THE LIVING LIBRARY: INITIAL CANONICAL DATASET ---
// =================================================================================================
const INITIAL_LIVING_LIBRARY_CANON = {
    ASTRONOMY: {
        SOLAR_SYSTEM: {
            STAR: { name: "Sol", type: "G-type main-sequence star (G2V)", mass: "1.989 × 10^30 kg", surface_temperature: "5,778 K", age: "4.6 billion years" },
            PLANETS: [
                { name: "Mercury", orbital_period: "88 days", moons: 0, type: "Terrestrial", details: "Smallest planet, closest to the Sun, extreme temperature variations." },
                { name: "Venus", orbital_period: "225 days", moons: 0, type: "Terrestrial", details: "Hottest planet due to runaway greenhouse effect of a thick CO2 atmosphere." },
                { name: "Earth", orbital_period: "365.25 days", moons: 1, type: "Terrestrial", details: "Our home planet, the only known to harbor complex life. Has liquid water." },
                { name: "Mars", orbital_period: "687 days", moons: 2, type: "Terrestrial", details: "The 'Red Planet', known for its iron oxide surface. Site of numerous robotic explorations." },
                { name: "Jupiter", orbital_period: "11.9 years", moons: 95, type: "Gas Giant", details: "Largest planet, a gas giant with a Great Red Spot, a storm larger than Earth." },
                { name: "Saturn", orbital_period: "29.5 years", moons: 146, type: "Gas Giant", details: "Gas giant famous for its extensive and complex ring system made of ice and rock." },
                { name: "Uranus", orbital_period: "84 years", moons: 27, type: "Ice Giant", details: "Ice giant with a tilted axis of rotation, causing extreme seasons." },
                { name: "Neptune", orbital_period: "164.8 years", moons: 14, type: "Ice Giant", details: "Farthest planet, an ice giant with the strongest winds in the solar system." }
            ],
            DWARF_PLANETS: [
                { name: "Pluto", orbital_period: "248 years", moons: 5, location: "Kuiper Belt" },
                { name: "Eris", orbital_period: "557 years", moons: 1, location: "Scattered Disc" },
                { name: "Ceres", orbital_period: "4.6 years", moons: 0, location: "Asteroid Belt" },
                { name: "Makemake", orbital_period: "305 years", moons: 1, location: "Kuiper Belt" },
                { name: "Haumea", orbital_period: "284 years", moons: 2, location: "Kuiper Belt" },
            ],
            MAJOR_MOONS: [
                { name: "Moon (Luna)", planet: "Earth" }, { name: "Phobos", planet: "Mars" }, { name: "Deimos", planet: "Mars" },
                { name: "Io", planet: "Jupiter" }, { name: "Europa", planet: "Jupiter" }, { name: "Ganymede", planet: "Jupiter" }, { name: "Callisto", planet: "Jupiter" },
                { name: "Titan", planet: "Saturn" }, { name: "Rhea", planet: "Saturn" }, { name: "Iapetus", planet: "Saturn" }, { name: "Enceladus", planet: "Saturn" },
                { name: "Titania", planet: "Uranus" }, { name: "Oberon", planet: "Uranus" }, { name: "Triton", planet: "Neptune" }, { name: "Charon", planet: "Pluto" }
            ],
        },
        DEEP_SKY_OBJECTS: {
            GALAXIES: [
                { name: "Andromeda Galaxy (M31)", type: "Spiral", distance: "2.537 million light-years" },
                { name: "Triangulum Galaxy (M33)", type: "Spiral", distance: "3 million light-years" },
                { name: "Whirlpool Galaxy (M51)", type: "Spiral", distance: "23 million light-years" },
                { name: "Sombrero Galaxy (M104)", type: "Unclear", distance: "29 million light-years" },
            ],
            NEBULAE: [
                { name: "Orion Nebula (M42)", type: "Emission/Reflection", constellation: "Orion" },
                { name: "Crab Nebula (M1)", type: "Supernova Remnant", constellation: "Taurus" },
                { name: "Eagle Nebula (M16)", type: "Emission", constellation: "Serpens", details: "Contains the 'Pillars of Creation'." },
                { name: "Ring Nebula (M57)", type: "Planetary", constellation: "Lyra" },
            ]
        },
        CONSTELLATIONS: [
            { name: "Ursa Major", brightest_star: "Alioth", mythology: "The Great Bear" }, { name: "Orion", brightest_star: "Rigel", mythology: "The Hunter" }, { name: "Cassiopeia", brightest_star: "Schedar", mythology: "The Vain Queen" },
            { name: "Canis Major", brightest_star: "Sirius", mythology: "The Great Dog" }, { name: "Scorpius", brightest_star: "Antares", mythology: "The Scorpion" }, { name: "Leo", brightest_star: "Regulus", mythology: "The Lion" },
            { name: "Cygnus", brightest_star: "Deneb", mythology: "The Swan" }, { name: "Aquila", brightest_star: "Altair", mythology: "The Eagle" }, { name: "Lyra", brightest_star: "Vega", mythology: "The Lyre" },
            { name: "Taurus", brightest_star: "Aldebaran", mythology: "The Bull" }, { name: "Gemini", brightest_star: "Pollux", mythology: "The Twins" }, { name: "Virgo", brightest_star: "Spica", mythology: "The Maiden" },
        ],
    },
    GEOLOGY: {
        EARTH_LAYERS: ["Crust", "Mantle (Upper & Lower)", "Outer Core (Liquid)", "Inner Core (Solid)"],
        GEOLOGIC_TIME_SCALE: [
            { eon: "Phanerozoic", era: "Cenozoic", period: "Quaternary", start_myr: 2.58 }, { eon: "Phanerozoic", era: "Cenozoic", period: "Neogene", start_myr: 23.03 }, { eon: "Phanerozoic", era: "Cenozoic", period: "Paleogene", start_myr: 66 },
            { eon: "Phanerozoic", era: "Mesozoic", period: "Cretaceous", start_myr: 145 }, { eon: "Phanerozoic", era: "Mesozoic", period: "Jurassic", start_myr: 201.3 }, { eon: "Phanerozoic", era: "Mesozoic", period: "Triassic", start_myr: 251.9 },
            { eon: "Phanerozoic", era: "Paleozoic", period: "Permian", start_myr: 298.9 }, { eon: "Phanerozoic", era: "Paleozoic", period: "Carboniferous", start_myr: 358.9 }, { eon: "Phanerozoic", era: "Paleozoic", period: "Devonian", start_myr: 419.2 },
            { eon: "Phanerozoic", era: "Paleozoic", period: "Silurian", start_myr: 443.8 }, { eon: "Phanerozoic", era: "Paleozoic", period: "Ordovician", start_myr: 485.4 }, { eon: "Phanerozoic", era: "Paleozoic", period: "Cambrian", start_myr: 541 },
            { eon: "Proterozoic", start_myr: 2500 }, { eon: "Archean", start_myr: 4000 }, { eon: "Hadean", start_myr: 4600 },
        ],
        ROCK_TYPES: { IGNEOUS: ["Granite", "Basalt", "Gabbro", "Obsidian", "Pumice", "Rhyolite"], SEDIMENTARY: ["Sandstone", "Limestone", "Shale", "Conglomerate", "Coal", "Rock Salt"], METAMORPHIC: ["Marble", "Slate", "Quartzite", "Gneiss", "Schist", "Serpentinite"] },
        MINERALS: [
            { name: "Quartz", hardness: 7, formula: "SiO₂" }, { name: "Feldspar", hardness: 6, formula: "KAlSi₃O₈ – NaAlSi₃O₈ – CaAl₂Si₂O₈" },
            { name: "Calcite", hardness: 3, formula: "CaCO₃" }, { name: "Diamond", hardness: 10, formula: "C" }, { name: "Corundum", hardness: 9, formula: "Al₂O₃" }, { name: "Talc", hardness: 1, formula: "Mg₃Si₄O₁₀(OH)₂" },
        ],
        LANDFORMS: {
            MOUNTAINS: [{ name: "Mount Everest", height_m: 8848 }, { name: "K2", height_m: 8611 }, { name: "Denali", height_m: 6190 }],
            RIVERS: [{ name: "Nile", length_km: 6650 }, { name: "Amazon", length_km: 6400 }, { name: "Yangtze", length_km: 6300 }],
            OCEAN_TRENCHES: [{ name: "Mariana Trench", depth_m: 10984 }, { name: "Tonga Trench", depth_m: 10882 }],
            VOLCANOES: ["Mount Vesuvius", "Krakatoa", "Mount St. Helens", "Mauna Loa", "Mount Fuji"],
        },
    },
    HISTORY: {
        ANCIENT_CIVILIZATIONS: [
            { name: "Sumer", period: "c. 4500–1900 BC", region: "Mesopotamia", significance: "First civilization, writing (cuneiform), the wheel." },
            { name: "Ancient Egypt", period: "c. 3100–30 BC", region: "Nile Valley", significance: "Pharaohs, pyramids, hieroglyphs, mummification." },
            { name: "Indus Valley Civilization", period: "c. 3300–1300 BC", region: "Indian Subcontinent", significance: "Advanced urban planning, standardized weights." },
            { name: "Ancient Greece", period: "c. 800–146 BC", region: "Mediterranean", significance: "Democracy, philosophy, theatre, Olympic Games." },
            { name: "Roman Empire", period: "27 BC - 476 AD (West)", region: "Mediterranean", significance: "Law, engineering, aqueducts, Latin language." },
            { name: "Persian (Achaemenid) Empire", period: "c. 550–330 BC", region: "Middle East", significance: "Satrapy system, Royal Road, bureaucracy." },
            { name: "Han Dynasty", period: "206 BC – 220 AD", region: "China", significance: "Golden age; paper, silk road, civil service." },
            { name: "Maurya Empire", period: "322–185 BC", region: "Indian Subcontinent", significance: "Unified most of India, spread of Buddhism." },
        ],
        MEDIEVAL_AND_MODERN_EMPIRES: [
             { name: "Byzantine Empire", period: "330–1453", region: "Eastern Mediterranean" },
             { name: "Islamic Caliphates (Rashidun, Umayyad, Abbasid)", period: "632–1258", region: "Middle East, North Africa" },
             { name: "Mongol Empire", period: "1206–1368", region: "Asia, Eastern Europe" },
             { name: "Ottoman Empire", period: "c. 1299–1922", region: "Anatolia, Balkans, Middle East" },
             { name: "British Empire", period: "16th-20th Century", region: "Global" },
        ],
        MAJOR_CONFLICTS: [
            { name: "Peloponnesian War", dates: "431–404 BC" }, { name: "Punic Wars", dates: "264–146 BC" }, { name: "The Crusades", dates: "1096–1291" },
            { name: "Hundred Years' War", dates: "1337–1453" }, { name: "Thirty Years' War", dates: "1618–1648" }, { name: "American Revolution", dates: "1775–1783" },
            { name: "Napoleonic Wars", dates: "1803–1815" }, { name: "American Civil War", dates: "1861–1865" }, { name: "World War I", dates: "1914–1918" },
            { name: "World War II", dates: "1939–1945" }, { name: "Cold War", dates: "1947–1991" }, { name: "Vietnam War", dates: "1955–1975" }
        ],
        KEY_INVENTIONS_BY_ERA: {
            ANCIENT: ["Wheel", "Writing", "Plow", "Aqueduct"],
            MEDIEVAL: ["Printing Press (Gutenberg)", "Eyeglasses", "Mechanical Clock", "Gunpowder (in Europe)"],
            INDUSTRIAL_REVOLUTION: ["Steam Engine", "Cotton Gin", "Telegraph", "Telephone"],
            MODERN: ["Automobile", "Airplane", "Penicillin", "Nuclear Power", "Transistor", "Internet"],
        },
        US_PRESIDENTS: [
             { name: "George Washington", term: "1789–1797" }, { name: "John Adams", term: "1797–1801" }, { name: "Thomas Jefferson", term: "1801–1809" },
             { name: "Abraham Lincoln", term: "1861–1865" }, { name: "Theodore Roosevelt", term: "1901–1909" }, { name: "Franklin D. Roosevelt", term: "1933–1945" },
             { name: "John F. Kennedy", term: "1961–1963" }, { name: "Ronald Reagan", term: "1981–1889" }, // Data is representative, not exhaustive
        ],
    },
    BIOLOGY: {
        TAXONOMY_HIERARCHY: ["Life", "Domain", "Kingdom", "Phylum", "Class", "Order", "Family", "Genus", "Species"],
        DOMAINS: ["Archaea", "Bacteria", "Eukarya"],
        KINGDOMS_EUKARYA: ["Animalia", "Plantae", "Fungi", "Protista"],
        CELL_BIOLOGY: {
            ORGANELLES: ["Nucleus", "Mitochondrion", "Ribosome", "Endoplasmic Reticulum (Smooth & Rough)", "Golgi Apparatus", "Lysosome", "Chloroplast (in plants)"],
            PROCESSES: ["Cellular Respiration", "Photosynthesis", "Mitosis", "Meiosis"],
        },
        GENETICS: {
            DNA_BASES: ["Adenine (A)", "Guanine (G)", "Cytosine (C)", "Thymine (T)"],
            RNA_BASES: ["Adenine (A)", "Guanine (G)", "Cytosine (C)", "Uracil (U)"],
            PIONEERS: ["Gregor Mendel (Inheritance)", "Watson & Crick (DNA Structure)", "Rosalind Franklin (DNA Imaging)"],
        },
        DINOSAURS: {
            THEROPODS: ["Tyrannosaurus Rex", "Velociraptor", "Allosaurus"],
            SAUROPODS: ["Brachiosaurus", "Diplodocus", "Apatosaurus"],
            ORNITHISCHIANS: ["Triceratops", "Stegosaurus", "Ankylosaurus"],
        },
    },
    CHEMISTRY: {
        STATES_OF_MATTER: ["Solid", "Liquid", "Gas", "Plasma", "Bose-Einstein Condensate"],
        TYPES_OF_BONDS: ["Ionic", "Covalent (Polar & Nonpolar)", "Metallic", "Hydrogen Bond"],
        PERIODIC_TABLE: [
            { element: "Hydrogen", symbol: "H", number: 1, mass: 1.008, group: 1 }, { element: "Helium", symbol: "He", number: 2, mass: 4.0026, group: 18 },
        ],
    },
    SACRED_TEXTS: {
        name: "Canonical Library of Sacred Texts",
        description: "A foundational collection of complete, unabridged sacred and esoteric works.",
        entries: [
             // This array will be populated by the Da'at Ingestion Protocol
        ]
    }
};

/**
 * The LivingLibraryService provides a stateful interface for managing the application's
 * knowledge base. It is initialized with the static canon but can be dynamically
 * expanded via the Da'at Ingestion Protocol.
 */
class LivingLibraryService {
    private library: any;

    constructor() {
        // Deep copy the initial state to prevent mutation of the constant
        this.library = JSON.parse(JSON.stringify(INITIAL_LIVING_LIBRARY_CANON));
    }

    /**
     * Performs a recursive, case-insensitive search through the entire library.
     * @param query The search query string.
     * @returns The found object or null.
     */
    public lookup(query: string): any | null {
        const lowerCaseQuery = query.toLowerCase();
        
        const search = (currentObj: any): any | null => {
            if (currentObj.name && typeof currentObj.name === 'string' && currentObj.name.toLowerCase() === lowerCaseQuery) {
                return currentObj;
            }

            for (const key in currentObj) {
                if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
                    const found = search(currentObj[key]);
                    if (found) return found;
                }
            }
            return null;
        };
        
        return search(this.library);
    }
    
    /**
     * Adds a new entry to the Sacred Texts section of the library.
     * @param newEntry The new text object to add.
     */
    public add(newEntry: { name: string; tradition: string; language: string; text: string }): void {
        if (this.library.SACRED_TEXTS && this.library.SACRED_TEXTS.entries) {
            this.library.SACRED_TEXTS.entries.push(newEntry);
        }
    }
}

// Singleton instance of the service
export const livingLibraryService = new LivingLibraryService();