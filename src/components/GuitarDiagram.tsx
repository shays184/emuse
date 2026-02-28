import type { GuitarChord } from "../data/chordData";

interface GuitarDiagramProps {
  chord: GuitarChord;
  name: string;
}

const FRETS_SHOWN = 4;
const STRING_COUNT = 6;
const STRING_SPACING = 16;
const FRET_SPACING = 20;
const LEFT_PAD = 28;
const TOP_PAD = 36;
const DOT_RADIUS = 5;

export function GuitarDiagram({ chord, name }: GuitarDiagramProps) {
  const width = LEFT_PAD + (STRING_COUNT - 1) * STRING_SPACING + 16;
  const height = TOP_PAD + FRETS_SHOWN * FRET_SPACING + 20;
  const isOpenPosition = chord.startFret === 1;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="text-text-light dark:text-text-dark"
    >
      <text
        x={LEFT_PAD + ((STRING_COUNT - 1) * STRING_SPACING) / 2}
        y={12}
        textAnchor="middle"
        className="fill-current text-xs font-bold"
      >
        {name}
      </text>

      {isOpenPosition && (
        <line
          x1={LEFT_PAD}
          y1={TOP_PAD}
          x2={LEFT_PAD + (STRING_COUNT - 1) * STRING_SPACING}
          y2={TOP_PAD}
          stroke="currentColor"
          strokeWidth={3}
        />
      )}

      {!isOpenPosition && (
        <text
          x={LEFT_PAD - 14}
          y={TOP_PAD + FRET_SPACING / 2 + 4}
          textAnchor="middle"
          className="fill-current text-[10px]"
        >
          {chord.startFret}
        </text>
      )}

      {Array.from({ length: FRETS_SHOWN + 1 }).map((_, i) => (
        <line
          key={`fret-${i}`}
          x1={LEFT_PAD}
          y1={TOP_PAD + i * FRET_SPACING}
          x2={LEFT_PAD + (STRING_COUNT - 1) * STRING_SPACING}
          y2={TOP_PAD + i * FRET_SPACING}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.3}
        />
      ))}

      {Array.from({ length: STRING_COUNT }).map((_, i) => (
        <line
          key={`string-${i}`}
          x1={LEFT_PAD + i * STRING_SPACING}
          y1={TOP_PAD}
          x2={LEFT_PAD + i * STRING_SPACING}
          y2={TOP_PAD + FRETS_SHOWN * FRET_SPACING}
          stroke="currentColor"
          strokeWidth={1}
          opacity={0.5}
        />
      ))}

      {chord.strings.map((fret, stringIdx) => {
        const x = LEFT_PAD + stringIdx * STRING_SPACING;

        if (fret === -1) {
          return (
            <text
              key={stringIdx}
              x={x}
              y={TOP_PAD - 5}
              textAnchor="middle"
              className="fill-current text-[10px]"
            >
              ✕
            </text>
          );
        }

        if (fret === 0) {
          return (
            <circle
              key={stringIdx}
              cx={x}
              cy={TOP_PAD - 8}
              r={4}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
            />
          );
        }

        const relativeFret = fret - chord.startFret + 1;
        const y = TOP_PAD + (relativeFret - 0.5) * FRET_SPACING;

        return (
          <circle
            key={stringIdx}
            cx={x}
            cy={y}
            r={DOT_RADIUS}
            className="fill-current"
          />
        );
      })}

      {chord.barres?.map((barreFret) => {
        const relativeFret = barreFret - chord.startFret + 1;
        const y = TOP_PAD + (relativeFret - 0.5) * FRET_SPACING;
        const barreStrings = chord.strings
          .map((f, i) => (f >= barreFret ? i : -1))
          .filter((i) => i !== -1);
        const first = barreStrings[0]!;
        const last = barreStrings[barreStrings.length - 1]!;

        return (
          <rect
            key={`barre-${barreFret}`}
            x={LEFT_PAD + first * STRING_SPACING - DOT_RADIUS}
            y={y - DOT_RADIUS}
            width={(last - first) * STRING_SPACING + DOT_RADIUS * 2}
            height={DOT_RADIUS * 2}
            rx={DOT_RADIUS}
            className="fill-current"
          />
        );
      })}
    </svg>
  );
}
