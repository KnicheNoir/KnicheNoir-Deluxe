import { MusicalComposition, NoteEvent, MusicalTrack, InstrumentProfile } from './types';

/**
 * music.ts
 *
 * This service centralizes all logic related to procedural music generation.
 * It translates abstract data and analysis into concrete MusicalComposition objects.
 */

export class MusicService {
    /**
     * Generates a musical composition based on the structural patterns of the Voynich Manuscript.
     * @param instrumentProfiles - The instrument definitions for melody, harmony, and bass.
     * @returns A MusicalComposition object ready for rendering.
     */
    public static createVoynichComposition(instrumentProfiles: { melody: InstrumentProfile, harmony: InstrumentProfile, bass: InstrumentProfile }): MusicalComposition {
        const BPM = 60;
        const secondsPerBeat = 60 / BPM;
        const keyRootMidi = 60; // Middle C
        const scale = [0, 2, 3, 5, 7, 8, 10]; // C Aeolian (Natural Minor) scale intervals

        // --- Melody Track (Crystal Bells) ---
        const melodyNotes: NoteEvent[] = [];
        let melodyTime = 0;
        const melodyPattern = [
            // Phrase 1 (12 notes)
            0, 2, 3, 5, 3, 2, 0, -2, 0, 3, 2, 0,
            // Phrase 2 (19 notes)
            5, 7, 8, 7, 5, 3, 5, 7, 5, 3, 2, 3, 5, 7, 8, 10, 8, 7, 5
        ];
        
        melodyPattern.forEach((step, index) => {
            const scaleDegree = (step + scale.length * 5) % scale.length;
            const pitch = keyRootMidi + scale[scaleDegree];
            const isAccent = (index + 1) % 7 === 0;

            melodyNotes.push({
                pitch,
                frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                startTime: melodyTime,
                duration: secondsPerBeat * 0.9,
                velocity: isAccent ? 0.9 : 0.7
            });
            melodyTime += secondsPerBeat;
        });

        // --- Harmony Track (Ethereal Pad) ---
        const harmonyNotes: NoteEvent[] = [];
        const chordProgression = [
            [0, 3, 7],   // C minor
            [8, 0, 3],   // Ab major
            [3, 7, 10],  // Eb major
            [7, 10, 2],  // G minor
        ];
        let harmonyTime = 0;
        for (let i = 0; i < 8; i++) {
            const chord = chordProgression[i % chordProgression.length];
            chord.forEach(interval => {
                const pitch = keyRootMidi + interval;
                harmonyNotes.push({
                    pitch,
                    frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                    startTime: harmonyTime,
                    duration: secondsPerBeat * 4,
                    velocity: 0.5
                });
            });
            harmonyTime += secondsPerBeat * 4;
        }

        // --- Bass Track (Deep Bass) ---
        const bassNotes: NoteEvent[] = [];
        let bassTime = 0;
        chordProgression.forEach(chord => {
             const rootNote = chord[0];
             const pitch = keyRootMidi - 12 + rootNote; // One octave down
             bassNotes.push({
                 pitch,
                 frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                 startTime: bassTime,
                 duration: secondsPerBeat * 4,
                 velocity: 0.6
             });
             bassTime += secondsPerBeat * 4;
        });
         chordProgression.forEach(chord => { // Repeat for length
             const rootNote = chord[0];
             const pitch = keyRootMidi - 12 + rootNote;
             bassNotes.push({
                 pitch,
                 frequency: 440 * Math.pow(2, (pitch - 69) / 12),
                 startTime: bassTime,
                 duration: secondsPerBeat * 4,
                 velocity: 0.6
             });
             bassTime += secondsPerBeat * 4;
        });


        const composition: MusicalComposition = {
            id: `voynich_${Date.now()}`,
            isFavorite: false,
            metadata: {
                key: 'C',
                mode: 'Aeolian',
                bpm: BPM,
                sourceReference: "Voynich Manuscript Cadence (12/19/7)",
                genre: 'Mysterious Discovery',
                solfeggioFrequency: 396,
            },
            tracks: [
                { name: 'melody', analysis: { query: 'voynich-melody', analysis: [] }, notes: melodyNotes },
                { name: 'harmony', analysis: { query: 'voynich-harmony', analysis: [] }, notes: harmonyNotes },
                { name: 'bass', analysis: { query: 'voynich-bass', analysis: [] }, notes: bassNotes },
            ]
        };
        
        return composition;
    }
}
