import { useState, useRef, useCallback } from "react";
import { GuitarDiagram } from "./GuitarDiagram";
import { PianoDiagram } from "./PianoDiagram";
import { GUITAR_CHORDS, PIANO_CHORDS } from "../data/chordData";

const TOOLTIP_HEIGHT = 220;
const TOOLTIP_WIDTH = 180;
const GAP = 12;

interface ChordTooltipProps {
  chord: string;
  instrument: string;
}

export function ChordTooltip({ chord, instrument }: ChordTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [voicingIndex, setVoicingIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);

  const guitarVoicings = GUITAR_CHORDS[chord];
  const pianoData = PIANO_CHORDS[chord];
  const hasData =
    instrument === "guitar" ? !!guitarVoicings?.length : !!pianoData;
  const totalVoicings = guitarVoicings?.length ?? 0;

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      let left = centerX - TOOLTIP_WIDTH / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - TOOLTIP_WIDTH - 8));

      let top: number;
      if (rect.top >= TOOLTIP_HEIGHT + GAP) {
        top = rect.top - GAP;
      } else {
        top = rect.bottom + GAP;
      }

      setPos({ top, left });
    }
    setVisible(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setVoicingIndex(0);
    }, 150);
  }, []);

  return (
    <span
      ref={anchorRef}
      className="inline-block"
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
          style={{
            position: "fixed",
            top: pos.top,
            left: pos.left,
            zIndex: 200,
            transform:
              pos.top > (anchorRef.current?.getBoundingClientRect().bottom ?? 0)
                ? "translateY(0)"
                : "translateY(-100%)",
          }}
          className="rounded-xl bg-surface-light p-3 shadow-xl ring-1 ring-gray-200 dark:bg-surface-dark dark:ring-gray-700"
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
