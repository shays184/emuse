const NOTE_SEMITONES: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

interface SongEntry {
  title: string;
  artist: string;
}

const SONGS_BY_PATTERN: Record<string, SongEntry[]> = {
  "I-V-vi-IV": [
    { title: "Let It Be", artist: "The Beatles" },
    { title: "No Woman No Cry", artist: "Bob Marley" },
    { title: "Someone Like You", artist: "Adele" },
    { title: "With or Without You", artist: "U2" },
    { title: "Photograph", artist: "Ed Sheeran" },
  ],
  "vi-IV-I-V": [
    { title: "Numb", artist: "Linkin Park" },
    { title: "Save Tonight", artist: "Eagle-Eye Cherry" },
    { title: "Grenade", artist: "Bruno Mars" },
    { title: "Complicated", artist: "Avril Lavigne" },
  ],
  "I-vi-IV-V": [
    { title: "Stand By Me", artist: "Ben E. King" },
    { title: "Every Breath You Take", artist: "The Police" },
    { title: "Earth Angel", artist: "The Penguins" },
  ],
  "IV-I-V-vi": [
    { title: "Love the Way You Lie", artist: "Eminem ft. Rihanna" },
    { title: "Apologize", artist: "OneRepublic" },
  ],
  "I-IV-V": [
    { title: "Twist and Shout", artist: "The Beatles" },
    { title: "La Bamba", artist: "Ritchie Valens" },
    { title: "Wild Thing", artist: "The Troggs" },
    { title: "Johnny B. Goode", artist: "Chuck Berry" },
  ],
  "I-IV-V-I": [
    { title: "Twist and Shout", artist: "The Beatles" },
    { title: "La Bamba", artist: "Ritchie Valens" },
  ],
  "I-V-IV": [
    { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd" },
    { title: "Louie Louie", artist: "The Kingsmen" },
  ],
  "I-IV-vi-V": [
    { title: "Hey Soul Sister", artist: "Train" },
    { title: "Where Is the Love?", artist: "Black Eyed Peas" },
  ],
  "I-vi-ii-V": [
    { title: "Blue Moon", artist: "Rodgers & Hart" },
    { title: "Heart and Soul", artist: "Hoagy Carmichael" },
  ],
  "ii-V-I": [
    { title: "Fly Me to the Moon", artist: "Frank Sinatra" },
    { title: "Autumn Leaves", artist: "Jazz Standard" },
  ],
  "I-IV-I-V": [{ title: "Born in the USA", artist: "Bruce Springsteen" }],
  "I-V-vi-iii-IV": [
    { title: "Canon in D", artist: "Pachelbel" },
    { title: "Graduation", artist: "Vitamin C" },
  ],
  "i-VII-VI-VII": [
    { title: "Hit the Road Jack", artist: "Ray Charles" },
    { title: "Stairway to Heaven", artist: "Led Zeppelin" },
  ],
  "i-VI-III-VII": [
    { title: "Zombie", artist: "The Cranberries" },
    { title: "Boulevard of Broken Dreams", artist: "Green Day" },
    { title: "Self Esteem", artist: "The Offspring" },
  ],
  "i-iv-VII-III": [{ title: "What I've Done", artist: "Linkin Park" }],
  "i-iv-V": [{ title: "House of the Rising Sun", artist: "The Animals" }],
  "I-iii-IV-V": [{ title: "Take On Me", artist: "a-ha" }],
  "I-V-vi-IV-I": [
    { title: "Let It Be", artist: "The Beatles" },
    { title: "She Will Be Loved", artist: "Maroon 5" },
  ],
  "I-IV": [
    { title: "Born in the USA", artist: "Bruce Springsteen" },
    { title: "Achy Breaky Heart", artist: "Billy Ray Cyrus" },
  ],
  "vi-V-IV-V": [{ title: "Running Down a Dream", artist: "Tom Petty" }],
  "I-V": [{ title: "Achy Breaky Heart", artist: "Billy Ray Cyrus" }],
  "I-bVII-IV": [
    { title: "Sweet Child O' Mine", artist: "Guns N' Roses" },
    { title: "Hey Jude", artist: "The Beatles" },
  ],
  "i-VII-VI-V": [
    { title: "Sultans of Swing", artist: "Dire Straits" },
    { title: "Good Riddance", artist: "Green Day" },
  ],
  "I-vi-I-V": [{ title: "Unchained Melody", artist: "The Righteous Brothers" }],
  "i-VI-VII": [{ title: "All Along the Watchtower", artist: "Jimi Hendrix" }],
};

function extractRoot(chord: string): string {
  const slash = chord.indexOf("/");
  const base = slash > 0 ? chord.slice(0, slash) : chord;
  if (base.length >= 2 && (base[1] === "#" || base[1] === "b")) {
    return base.slice(0, 2);
  }
  return base[0] ?? "C";
}

function semitone(note: string): number {
  return NOTE_SEMITONES[note] ?? 0;
}

function chordQuality(chord: string): "minor" | "major" {
  const root = extractRoot(chord);
  const rest = chord.slice(root.length).replace(/\/.*$/, "");
  if (rest.startsWith("m") && !rest.startsWith("maj")) return "minor";
  return "major";
}

function isMinorKey(key: string): boolean {
  const root = extractRoot(key);
  const rest = key.slice(root.length);
  return rest.startsWith("m") && !rest.startsWith("maj");
}

const DEGREE: Record<number, number> = {
  0: 1,
  1: 1,
  2: 2,
  3: 3,
  4: 3,
  5: 4,
  6: 4,
  7: 5,
  8: 6,
  9: 6,
  10: 7,
  11: 7,
};
const ROMAN: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
};
const MAJOR_FLAT = new Set([1, 3, 6, 8, 10]);
const MINOR_FLAT = new Set([1, 4, 6, 9, 11]);

function intervalToRoman(
  interval: number,
  quality: "major" | "minor",
  keyIsMinor: boolean,
): string {
  const flatSet = keyIsMinor ? MINOR_FLAT : MAJOR_FLAT;
  const degree = DEGREE[interval] ?? 1;
  const prefix = flatSet.has(interval) ? "b" : "";
  const numeral = ROMAN[degree] ?? "I";
  if (quality === "minor") return prefix + numeral.toLowerCase();
  return prefix + numeral;
}

function toPattern(chords: string[], key: string): string {
  const keyRoot = extractRoot(key);
  const keySemitone = semitone(keyRoot);
  const keyIsMinor = isMinorKey(key);

  return chords
    .map((chord) => {
      const root = extractRoot(chord);
      const quality = chordQuality(chord);
      const interval = (semitone(root) - keySemitone + 12) % 12;
      return intervalToRoman(interval, quality, keyIsMinor);
    })
    .join("-");
}

function getSubsequences(pattern: string, len: number): string[] {
  const parts = pattern.split("-");
  if (parts.length < len) return [];
  const result: string[] = [];
  for (let i = 0; i <= parts.length - len; i++) {
    result.push(parts.slice(i, i + len).join("-"));
  }
  return result;
}

export function findSimilarSongs(chords: string[], key: string): SongEntry[] {
  const pattern = toPattern(chords, key);

  if (SONGS_BY_PATTERN[pattern]) {
    return SONGS_BY_PATTERN[pattern];
  }

  for (const len of [4, 3]) {
    const subs = getSubsequences(pattern, len);
    for (const sub of subs) {
      if (SONGS_BY_PATTERN[sub]) {
        return SONGS_BY_PATTERN[sub];
      }
    }
  }

  return [];
}
