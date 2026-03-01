import { useState, useRef, useCallback } from "react";
import { ChordTooltip } from "./ChordTooltip";
import {
  playProgression,
  stopPlayback,
  type Instrument,
} from "../services/audioEngine";
import { findSimilarSongs } from "../data/songData";

interface Progression {
  chords: string[];
  complexity: number;
  key: string;
  scale: string;
  theory: string;
}

interface ProgressionCardProps {
  progression: Progression;
  instrument: string;
  mood?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onView?: (progression: Progression) => void;
}

const COMPLEXITY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

const COMPLEXITY_COLORS: Record<number, string> = {
  1: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  2: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  3: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function ProgressionCard({
  progression,
  instrument,
  mood,
  isFavorite,
  onToggleFavorite,
  onView,
}: ProgressionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [activeChord, setActiveChord] = useState(-1);
  const handleRef = useRef<{ cancel: () => void } | null>(null);

  const togglePlay = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (playing) {
        stopPlayback();
        return;
      }
      setPlaying(true);
      setActiveChord(0);
      handleRef.current = playProgression(
        progression.chords,
        instrument as Instrument,
        (idx) => setActiveChord(idx),
        () => {
          setPlaying(false);
          setActiveChord(-1);
          handleRef.current = null;
        },
      );
    },
    [playing, progression.chords, instrument],
  );

  const similarSongs = findSimilarSongs(progression.chords, progression.key);

  return (
    <div className="overflow-visible rounded-xl bg-surface-light shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark">
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          const next = !expanded;
          setExpanded(next);
          if (next && onView && mood) onView(progression);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        className="flex w-full cursor-pointer items-center gap-4 p-4 text-left"
      >
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={
              isFavorite ? "Remove from favorites" : "Save to favorites"
            }
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isFavorite
                ? "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                : "bg-primary/10 text-primary/40 hover:text-red-400 dark:bg-primary-light/10 dark:text-primary-light/40 dark:hover:text-red-400"
            }`}
          >
            {isFavorite ? "♥" : "♡"}
          </button>
          <button
            onClick={togglePlay}
            aria-label={playing ? "Stop playback" : "Play progression"}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              playing
                ? "bg-primary/20 text-primary dark:bg-primary-light/20 dark:text-primary-light"
                : "bg-primary/10 text-primary/60 hover:text-primary dark:bg-primary-light/10 dark:text-primary-light/60 dark:hover:text-primary-light"
            }`}
          >
            {playing ? "⏹" : "▶"}
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-lg">
            {progression.chords.map((chord, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span
                  onClick={(e) => e.stopPropagation()}
                  className={`rounded px-0.5 transition-colors duration-150 ${
                    playing && activeChord === i
                      ? "bg-primary/20 dark:bg-primary-light/20"
                      : ""
                  }`}
                >
                  <ChordTooltip chord={chord} instrument={instrument} />
                </span>
                {i < progression.chords.length - 1 && (
                  <span className="mx-0.5 text-text-secondary-light dark:text-text-secondary-dark">
                    →
                  </span>
                )}
              </span>
            ))}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${COMPLEXITY_COLORS[progression.complexity] ?? ""}`}
            >
              {COMPLEXITY_LABELS[progression.complexity]}
            </span>
          </div>
          <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Key of {progression.key}
          </span>
        </div>

        <span
          className={`text-text-secondary-light transition-transform duration-200 dark:text-text-secondary-dark ${expanded ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
          <div className="mb-3 inline-block rounded-lg bg-primary/5 px-3 py-2 text-sm dark:bg-primary-light/5">
            <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Scale:{" "}
            </span>
            <span className="font-semibold text-text-light dark:text-text-dark">
              {progression.scale}
            </span>
          </div>

          <div className="mb-3 rounded-lg bg-secondary/5 px-4 py-3 dark:bg-secondary-light/5">
            <span className="mb-1 block text-xs font-medium text-secondary dark:text-secondary-light">
              Why it works
            </span>
            <p className="text-sm leading-relaxed text-text-light dark:text-text-dark">
              {progression.theory}
            </p>
          </div>

          {similarSongs.length > 0 && (
            <div className="rounded-lg bg-amber-500/5 px-4 py-3 dark:bg-amber-400/5">
              <span className="mb-1 block text-xs font-medium text-amber-700 dark:text-amber-400">
                Songs like this
              </span>
              <ul className="space-y-0.5">
                {similarSongs.map((song, i) => (
                  <li
                    key={i}
                    className="text-sm text-text-light dark:text-text-dark"
                  >
                    <span className="font-medium">{song.title}</span>
                    <span className="text-text-secondary-light dark:text-text-secondary-dark">
                      {" "}
                      — {song.artist}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
