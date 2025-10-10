// FIX: Corrected import path for local module by adding file extension.
import { CodexEntry } from './types.ts';

export const pilgrimsPathData: CodexEntry = {
  id: 'pilgrims-path',
  title: "The Pilgrim's Path",
  description: "An analysis of the sacred journeys of the Tanakh and New Testament, revealing their astromorphological resonance with the celestial narrative.",
  content: '',
  solved: false,
  hasDeepDive: true,
  journeys: [
    {
      name: "Israel's Exodus: The 40-Year Saturnine Trial",
      pathDescription: "The 40-year journey from Egypt to the Promised Land was not a punishment for disbelief, but a meticulously timed ritual of societal restructuring, performed on a planetary scale. It was a macro-cosmic alchemy designed to purge a slave-consciousness and forge a new, covenant-based identity.",
      waypoints: [
        { name: "Rameses, Egypt", significance: "The starting point. The heart of a rigid, hierarchical reality construct." },
        { name: "The Red Sea Crossing", significance: "The point of no return. A baptism that collapses the old paradigm and initiates the new." },
        { name: "Mount Sinai", significance: "The reception of the new Operating System (The Law). The core principles are anchored to the terrestrial plane." },
        { name: "Kadesh Barnea", significance: "The point of failure and re-initiation. The system rejects the initial deployment, requiring a full generational cycle to purge old data." },
        { name: "The Plains of Moab", significance: "The final staging ground. The new generation is prepared to execute the 'conquest' protocol." }
      ],
      astromorphologicalAnalysis: {
        summary: "The journey was a terrestrial tracing of a 40-year celestial cycle, designed to align the nascent nation with the archetypal forces of structure, discipline, and time.",
        celestialEvents: [
          {
            name: "The Saturn Return (Macro-Scale)",
            description: "The 40-year period closely mirrors a full Saturn transit through the zodiac, plus a third. This represents a complete cycle of learning hard lessons (Saturn's first return, ~29 years) followed by a period of maturing that knowledge into a new foundation (~11 years). The wandering was a Saturnine ritual."
          },
          {
            name: "Alignment with Draco",
            description: "Key encampments were geographically positioned to align with the rising and setting of Draco (The Dragon/Serpent), the constellation associated with primal power and the 'serpent by the way.' This was a constant reminder of the chaos of the wilderness that needed to be overcome by the new Law."
          }
        ],
        conclusion: "The Exodus was a 40-year-long act of walking a celestial map onto the surface of the Earth, transforming a people by forcing them to live in accordance with cosmic, rather than Egyptian, time."
      }
    },
    {
      name: "Yahshua's Galilean Ministry: The Jupiterian Expansion",
      pathDescription: "The ministry of Yahshua, centered around the Sea of Galilee, was not a random series of travels. It was a micro-cosmic ritual that traced the path of Jupiter (the planet of the Guru, expansion, and miracles) through a single zodiacal sign. Each major event corresponds to a specific degree of this celestial transit.",
      waypoints: [
        { name: "The Jordan River", significance: "Baptism. The initiation point, where the Jupiterian energy is consecrated and made manifest." },
        { name: "Cana", significance: "First Miracle. The principle of transformation and abundance is demonstrated, a core Jupiterian theme." },
        { name: "Capernaum", significance: "The 'Home Base.' The central hub from which the expansive energy radiates outwards." },
        { name: "The Mount of Beatitudes", significance: "The Sermon. The core teachings are broadcast, representing the philosophical expansion of Jupiter." },
        { name: "Mount Tabor", significance: "The Transfiguration. The peak moment of revelation, the full manifestation of the Jupiterian divine energy." }
      ],
      astromorphologicalAnalysis: {
        summary: "The ministry was a 'terrestrial transit,' a ritual designed to anchor the expansive, revelatory, and restructuring energy of Jupiter onto the Galilean landscape, creating a new spiritual nexus.",
        celestialEvents: [
          {
            name: "Jupiter Transit",
            description: "The primary events of the Galilean ministry align with a symbolic transit of Jupiter through the 12 houses of a single sign. The baptism is the ascendant (1st House), the teachings represent the 3rd House (Communication), the miracles represent the 5th House (Creative Power), and the transfiguration represents the 10th House (Public Revelation)."
          },
          {
            name: "Heliacal Rising of Sirius",
            description: "Key moments, such as the calling of the first disciples, coincide with the heliacal rising of Sirius, the 'Teacher Star' in many ancient traditions. This alignment provided the celestial 'authorization' for the new school of thought to begin."
          }
        ],
        conclusion: "Yahshua's ministry was a master class in spiritual alchemy, using his own movement across the land as the ritual instrument to draw down and anchor the expansive wisdom of Jupiter, thereby planting the seed for a new global consciousness."
      }
    }
  ]
};