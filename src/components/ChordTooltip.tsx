import { useState, useRef } from "react";
import { GuitarDiagram } from "./GuitarDiagram";
import { PianoDiagram } from "./PianoDiagram";
import { GUITAR_CHORDS, PIANO_CHORDS } from "../data/chordData";

interface ChordTooltipProps {
  chord: string;
  instrument: string;
}

export function ChordTooltip({ chord, instrument }: ChordTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [voicingIndex, setVoicingIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const guitarVoicings = GUITAR_CHORDS[chord];
  const pianoData = PIANO_CHORDS[chord];
  const hasData =
    instrument === "guitar" ? !!guitarVoicings?.length : !!pianoData;
  const totalVoicings = guitarVoicings?.length ?? 0;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setVoicingIndex(0);
    }, 150);
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`font-mono font-semibold ${
          hasData
            ? "cursor-pointer border-b border-dashed border-primary/40 text-primary hover:border-primary dark:border-primary-light/40 dark:text-primary-light dark:hover:border-primary-light"
            : "text-text-light dark:text-text-dark"
        }`}
      >
        {chord}
      </span>

      {visible && hasData && (
        <div
          className="absolute bottom-full left-1/2 z-[100] mb-3 -translate-x-1/2 rounded-xl bg-surface-light p-3 shadow-xl ring-1 ring-gray-200 dark:bg-surface-dark dark:ring-gray-700"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {instrument === "guitar" && guitarVoicings && (
            <div className="flex flex-col items-center">
              <GuitarDiagram
                chord={guitarVoicings[voicingIndex]!}
                name={chord}
              />
              {totalVoicings > 1 && (
                <div className="mt-1 flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVoicingIndex(
                        (i) => (i - 1 + totalVoicings) % totalVoicings,
                      );
                    }}
                    className="cursor-pointer rounded px-1.5 py-0.5 text-xs font-bold text-primary hover:bg-primary/10 dark:text-primary-light dark:hover:bg-primary-light/10"
                  >
                    ←
                  </button>
                  <span className="text-[10px] text-text-secondary-light dark:text-text-secondary-dark">
                    {voicingIndex + 1} / {totalVoicings}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setVoicingIndex((i) => (i + 1) % totalVoicings);
                    }}
                    className="cursor-pointer rounded px-1.5 py-0.5 text-xs font-bold text-primary hover:bg-primary/10 dark:text-primary-light dark:hover:bg-primary-light/10"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          )}
          {instrument === "piano" && pianoData && (
            <PianoDiagram chord={pianoData} name={chord} />
          )}
        </div>
      )}
    </span>
  );
}
