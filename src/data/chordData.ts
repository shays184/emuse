export interface GuitarChord {
  strings: number[];
  startFret: number;
  barres?: number[];
}

export interface PianoChord {
  notes: string[];
}

// Guitar: [lowE, A, D, G, B, highE], -1=muted, 0=open, n=fret
// startFret: lowest fret shown in diagram (1 for open position)
// Each chord maps to an array of voicings (first = default, rest = alternatives)
export const GUITAR_CHORDS: Record<string, GuitarChord[]> = {
  A: [{ strings: [-1, 0, 2, 2, 2, 0], startFret: 1 }],
  A5: [{ strings: [-1, 0, 2, 2, -1, -1], startFret: 1 }],
  A7: [
    { strings: [-1, 0, 2, 0, 2, 0], startFret: 1 },
    { strings: [5, 7, 5, 6, 5, 5], startFret: 5, barres: [5] },
  ],
  Ab: [{ strings: [4, 6, 6, 5, 4, 4], startFret: 4, barres: [4] }],
  Am: [{ strings: [-1, 0, 2, 2, 1, 0], startFret: 1 }],
  "Am/G": [{ strings: [3, 0, 2, 2, 1, 0], startFret: 1 }],
  Am7: [
    { strings: [-1, 0, 2, 0, 1, 0], startFret: 1 },
    { strings: [5, 7, 5, 5, 5, 5], startFret: 5, barres: [5] },
  ],
  Amaj7: [
    { strings: [-1, 0, 2, 1, 2, 0], startFret: 1 },
    { strings: [-1, -1, 6, 6, 5, 4], startFret: 4 },
  ],
  B: [{ strings: [-1, 2, 4, 4, 4, 2], startFret: 1, barres: [2] }],
  B7: [
    { strings: [-1, 2, 1, 2, 0, 2], startFret: 1 },
    { strings: [7, 9, 7, 8, 7, 7], startFret: 7, barres: [7] },
  ],
  Bb: [{ strings: [-1, 1, 3, 3, 3, 1], startFret: 1, barres: [1] }],
  Bbmaj7: [
    { strings: [-1, 1, 3, 2, 3, 1], startFret: 1, barres: [1] },
    { strings: [-1, -1, 3, 2, 3, 1], startFret: 1 },
  ],
  Bm: [
    { strings: [-1, 2, 4, 4, 3, 2], startFret: 1, barres: [2] },
    { strings: [7, 9, 9, 7, 7, 7], startFret: 7, barres: [7] },
  ],
  Bm7: [
    { strings: [-1, 2, 4, 2, 3, 2], startFret: 1, barres: [2] },
    { strings: [7, 9, 7, 7, 7, 7], startFret: 7, barres: [7] },
  ],
  Bm7b5: [
    { strings: [-1, 2, 3, 2, 3, -1], startFret: 1 },
    { strings: [7, 8, 7, 7, -1, -1], startFret: 7 },
  ],
  C: [{ strings: [-1, 3, 2, 0, 1, 0], startFret: 1 }],
  "C#m": [
    { strings: [-1, 4, 6, 6, 5, 4], startFret: 4, barres: [4] },
    { strings: [9, 11, 11, 9, 9, 9], startFret: 9, barres: [9] },
  ],
  "C#m7": [
    { strings: [-1, 4, 6, 4, 5, 4], startFret: 4, barres: [4] },
    { strings: [9, 11, 9, 9, 9, 9], startFret: 9, barres: [9] },
  ],
  C5: [{ strings: [-1, 3, 5, 5, -1, -1], startFret: 3 }],
  Cm: [{ strings: [-1, 3, 5, 5, 4, 3], startFret: 3, barres: [3] }],
  Cmaj7: [
    { strings: [-1, 3, 2, 0, 0, 0], startFret: 1 },
    { strings: [-1, 3, 5, 4, 5, 3], startFret: 3, barres: [3] },
  ],
  D: [{ strings: [-1, -1, 0, 2, 3, 2], startFret: 1 }],
  "D/F#": [{ strings: [2, -1, 0, 2, 3, 2], startFret: 1 }],
  D5: [{ strings: [-1, -1, 0, 2, 3, -1], startFret: 1 }],
  D7: [
    { strings: [-1, -1, 0, 2, 1, 2], startFret: 1 },
    { strings: [-1, 5, 7, 5, 7, 5], startFret: 5, barres: [5] },
  ],
  Dm: [{ strings: [-1, -1, 0, 2, 3, 1], startFret: 1 }],
  Dm7: [
    { strings: [-1, -1, 0, 2, 1, 1], startFret: 1 },
    { strings: [-1, 5, 7, 5, 6, 5], startFret: 5, barres: [5] },
  ],
  Dm9: [
    { strings: [-1, -1, 0, 2, 1, 0], startFret: 1 },
    { strings: [-1, 5, 3, 5, 5, 5], startFret: 3 },
  ],
  Dmaj7: [
    { strings: [-1, -1, 0, 2, 2, 2], startFret: 1 },
    { strings: [-1, 5, 4, 6, 5, -1], startFret: 4 },
  ],
  E: [{ strings: [0, 2, 2, 1, 0, 0], startFret: 1 }],
  E5: [{ strings: [0, 2, 2, -1, -1, -1], startFret: 1 }],
  E7: [
    { strings: [0, 2, 0, 1, 0, 0], startFret: 1 },
    { strings: [-1, 7, 9, 7, 9, 7], startFret: 7, barres: [7] },
  ],
  Eb: [{ strings: [-1, -1, 1, 3, 4, 3], startFret: 1 }],
  Em: [{ strings: [0, 2, 2, 0, 0, 0], startFret: 1 }],
  Em7: [
    { strings: [0, 2, 0, 0, 0, 0], startFret: 1 },
    { strings: [-1, 7, 9, 7, 8, 7], startFret: 7, barres: [7] },
  ],
  Em9: [
    { strings: [0, 2, 0, 0, 0, 2], startFret: 1 },
    { strings: [-1, 7, 5, 7, 7, 7], startFret: 5 },
  ],
  F: [{ strings: [1, 3, 3, 2, 1, 1], startFret: 1, barres: [1] }],
  "F#7": [
    { strings: [2, 4, 2, 3, 2, 2], startFret: 2, barres: [2] },
    { strings: [-1, -1, 4, 3, 2, 0], startFret: 1 },
  ],
  "F#m": [
    { strings: [2, 4, 4, 2, 2, 2], startFret: 2, barres: [2] },
    { strings: [-1, -1, 4, 2, 2, 2], startFret: 2, barres: [2] },
  ],
  "F#m7": [
    { strings: [2, 4, 2, 2, 2, 2], startFret: 2, barres: [2] },
    { strings: [-1, -1, 2, 2, 2, 2], startFret: 2, barres: [2] },
  ],
  Fm: [{ strings: [1, 3, 3, 1, 1, 1], startFret: 1, barres: [1] }],
  Fmaj7: [
    { strings: [-1, -1, 3, 2, 1, 0], startFret: 1 },
    { strings: [1, 0, 2, 2, 1, 0], startFret: 1 },
  ],
  G: [{ strings: [3, 2, 0, 0, 0, 3], startFret: 1 }],
  G7: [
    { strings: [3, 2, 0, 0, 0, 1], startFret: 1 },
    { strings: [3, 5, 3, 4, 3, 3], startFret: 3, barres: [3] },
  ],
  Gm7: [
    { strings: [3, 5, 3, 3, 3, 3], startFret: 3, barres: [3] },
    { strings: [-1, -1, 3, 3, 3, 3], startFret: 3, barres: [3] },
  ],
  Gmaj7: [
    { strings: [3, 2, 0, 0, 0, 2], startFret: 1 },
    { strings: [-1, -1, 5, 4, 3, 2], startFret: 2 },
  ],
};

// Piano: array of note names (one octave, starting from middle C area)
export const PIANO_CHORDS: Record<string, PianoChord> = {
  A: { notes: ["A", "C#", "E"] },
  A5: { notes: ["A", "E"] },
  A7: { notes: ["A", "C#", "E", "G"] },
  Ab: { notes: ["Ab", "C", "Eb"] },
  Am: { notes: ["A", "C", "E"] },
  "Am/G": { notes: ["G", "A", "C", "E"] },
  Am7: { notes: ["A", "C", "E", "G"] },
  Amaj7: { notes: ["A", "C#", "E", "G#"] },
  B: { notes: ["B", "D#", "F#"] },
  B7: { notes: ["B", "D#", "F#", "A"] },
  Bb: { notes: ["Bb", "D", "F"] },
  Bbmaj7: { notes: ["Bb", "D", "F", "A"] },
  Bm: { notes: ["B", "D", "F#"] },
  Bm7: { notes: ["B", "D", "F#", "A"] },
  Bm7b5: { notes: ["B", "D", "F", "A"] },
  C: { notes: ["C", "E", "G"] },
  "C#m": { notes: ["C#", "E", "G#"] },
  "C#m7": { notes: ["C#", "E", "G#", "B"] },
  C5: { notes: ["C", "G"] },
  Cm: { notes: ["C", "Eb", "G"] },
  Cmaj7: { notes: ["C", "E", "G", "B"] },
  D: { notes: ["D", "F#", "A"] },
  "D/F#": { notes: ["F#", "D", "A"] },
  D5: { notes: ["D", "A"] },
  D7: { notes: ["D", "F#", "A", "C"] },
  Dm: { notes: ["D", "F", "A"] },
  Dm7: { notes: ["D", "F", "A", "C"] },
  Dm9: { notes: ["D", "F", "A", "C", "E"] },
  Dmaj7: { notes: ["D", "F#", "A", "C#"] },
  E: { notes: ["E", "G#", "B"] },
  E5: { notes: ["E", "B"] },
  E7: { notes: ["E", "G#", "B", "D"] },
  Eb: { notes: ["Eb", "G", "Bb"] },
  Em: { notes: ["E", "G", "B"] },
  Em7: { notes: ["E", "G", "B", "D"] },
  Em9: { notes: ["E", "G", "B", "D", "F#"] },
  F: { notes: ["F", "A", "C"] },
  "F#7": { notes: ["F#", "A#", "C#", "E"] },
  "F#m": { notes: ["F#", "A", "C#"] },
  "F#m7": { notes: ["F#", "A", "C#", "E"] },
  Fm: { notes: ["F", "Ab", "C"] },
  Fmaj7: { notes: ["F", "A", "C", "E"] },
  G: { notes: ["G", "B", "D"] },
  G7: { notes: ["G", "B", "D", "F"] },
  Gm7: { notes: ["G", "Bb", "D", "F"] },
  Gmaj7: { notes: ["G", "B", "D", "F#"] },
};
