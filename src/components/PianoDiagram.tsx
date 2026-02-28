import type { PianoChord } from "../data/chordData";

interface PianoDiagramProps {
  chord: PianoChord;
  name: string;
}

const NOTE_ALIASES: Record<string, string> = {
  Db: "C#",
  "D#": "Eb",
  Gb: "F#",
  "G#": "Ab",
  "A#": "Bb",
};

const DISPLAY_NAMES: Record<string, string> = {
  C2: "C",
  D2: "D",
  E2: "E",
  "C#2": "C#",
  Eb2: "Eb",
};

const WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B", "C2", "D2", "E2"];
const BLACK_NOTE_POSITIONS: Record<string, number> = {
  "C#": 0,
  Eb: 1,
  "F#": 3,
  Ab: 4,
  Bb: 5,
  "C#2": 7,
  Eb2: 8,
};

const WHITE_KEY_WIDTH = 18;
const WHITE_KEY_HEIGHT = 60;
const BLACK_KEY_WIDTH = 12;
const BLACK_KEY_HEIGHT = 38;

function normalizeNote(note: string): string {
  return NOTE_ALIASES[note] ?? note;
}

export function PianoDiagram({ chord, name }: PianoDiagramProps) {
  const activeNotes = new Set(chord.notes.map(normalizeNote));

  const width = WHITE_NOTES.length * WHITE_KEY_WIDTH + 2;
  const height = WHITE_KEY_HEIGHT + 28;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="text-text-light dark:text-text-dark"
    >
      <text
        x={width / 2}
        y={12}
        textAnchor="middle"
        className="fill-current text-xs font-bold"
      >
        {name}
      </text>

      {WHITE_NOTES.map((note, i) => {
        const x = 1 + i * WHITE_KEY_WIDTH;
        const normalNote = normalizeNote(note);
        const isActive = activeNotes.has(normalNote);
        const displayName = DISPLAY_NAMES[note] ?? note;

        return (
          <g key={note}>
            <rect
              x={x}
              y={20}
              width={WHITE_KEY_WIDTH - 1}
              height={WHITE_KEY_HEIGHT}
              rx={2}
              fill={isActive ? "#6C2BD9" : "white"}
              stroke="currentColor"
              strokeWidth={1}
              opacity={isActive ? 1 : 0.8}
            />
            {isActive && (
              <text
                x={x + (WHITE_KEY_WIDTH - 1) / 2}
                y={20 + WHITE_KEY_HEIGHT - 6}
                textAnchor="middle"
                fill="white"
                fontSize={8}
                fontWeight="bold"
              >
                {displayName}
              </text>
            )}
          </g>
        );
      })}

      {Object.entries(BLACK_NOTE_POSITIONS).map(([note, whiteIdx]) => {
        const x =
          1 +
          whiteIdx * WHITE_KEY_WIDTH +
          WHITE_KEY_WIDTH -
          BLACK_KEY_WIDTH / 2;
        const normalNote = normalizeNote(note);
        const isActive = activeNotes.has(normalNote);
        const displayName = DISPLAY_NAMES[note] ?? note;

        return (
          <g key={note}>
            <rect
              x={x}
              y={20}
              width={BLACK_KEY_WIDTH}
              height={BLACK_KEY_HEIGHT}
              rx={2}
              fill={isActive ? "#A78BFA" : "#1C1917"}
              stroke={isActive ? "#A78BFA" : "none"}
              strokeWidth={1}
            />
            {isActive && (
              <text
                x={x + BLACK_KEY_WIDTH / 2}
                y={20 + BLACK_KEY_HEIGHT - 5}
                textAnchor="middle"
                fill="white"
                fontSize={7}
                fontWeight="bold"
              >
                {displayName}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
