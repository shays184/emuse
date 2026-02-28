import { useState, useEffect, useRef, useCallback } from "react";
import { FavoriteProgression } from "../hooks/useFavorites";
import { ChordTooltip } from "./ChordTooltip";
import {
  playProgression,
  stopPlayback,
  type Instrument,
} from "../services/audioEngine";
import { findSimilarSongs } from "../data/songData";

interface FavoritesOverlayProps {
  favorites: FavoriteProgression[];
  onRemove: (id: string) => void;
  onClose: () => void;
}

const COMPLEXITY_LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

const MOOD_TAG_COLORS: Record<string, string> = {
  Happy:
    "bg-amber-400/20 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
  Sad: "bg-blue-500/20 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  Calm: "bg-teal-400/20 text-teal-600 dark:bg-teal-400/15 dark:text-teal-400",
  Energetic:
    "bg-red-500/20 text-red-600 dark:bg-red-500/15 dark:text-orange-400",
  Melancholy:
    "bg-purple-500/20 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  Romantic:
    "bg-pink-500/20 text-pink-600 dark:bg-pink-500/15 dark:text-pink-400",
};

const INSTRUMENT_TAG_COLORS: Record<string, string> = {
  guitar:
    "bg-orange-400/20 text-orange-700 dark:bg-orange-400/15 dark:text-orange-400",
  piano: "bg-sky-400/20 text-sky-700 dark:bg-sky-400/15 dark:text-sky-400",
};

function FavoriteCard({
  fav,
  onRemove,
}: {
  fav: FavoriteProgression;
  onRemove: () => void;
}) {
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
        fav.chords,
        fav.instrument as Instrument,
        (idx) => setActiveChord(idx),
        () => {
          setPlaying(false);
          setActiveChord(-1);
          handleRef.current = null;
        },
      );
    },
    [playing, fav.chords, fav.instrument],
  );

  const similarSongs = findSimilarSongs(fav.chords, fav.key);

  const moodColor =
    MOOD_TAG_COLORS[fav.mood] ??
    "bg-gray-400/20 text-gray-600 dark:bg-gray-400/15 dark:text-gray-400";
  const instrumentColor =
    INSTRUMENT_TAG_COLORS[fav.instrument] ??
    "bg-gray-400/20 text-gray-600 dark:bg-gray-400/15 dark:text-gray-400";

  return (
    <div className="overflow-visible rounded-xl bg-surface-light shadow-sm dark:bg-surface-dark">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        className="cursor-pointer p-4"
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${moodColor}`}
            >
              {fav.mood}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 font-medium ${instrumentColor}`}
            >
              {fav.instrument.charAt(0).toUpperCase() + fav.instrument.slice(1)}
            </span>
            <span className="text-text-secondary-light dark:text-text-secondary-dark">
              {COMPLEXITY_LABELS[fav.complexity]}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={togglePlay}
              aria-label={playing ? "Stop playback" : "Play progression"}
              className={`cursor-pointer text-sm transition-colors ${
                playing
                  ? "text-primary dark:text-primary-light"
                  : "text-primary/60 hover:text-primary dark:text-primary-light/60 dark:hover:text-primary-light"
              }`}
            >
              {playing ? "⏹" : "▶"}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              aria-label="Remove from favorites"
              className="shrink-0 cursor-pointer text-red-400 transition-colors hover:text-red-500"
            >
              ♥
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1 text-lg font-semibold">
              {fav.chords.map((chord, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <span
                    onClick={(e) => e.stopPropagation()}
                    className={`rounded px-0.5 transition-colors duration-150 ${
                      playing && activeChord === i
                        ? "bg-primary/20 dark:bg-primary-light/20"
                        : ""
                    }`}
                  >
                    <ChordTooltip chord={chord} instrument={fav.instrument} />
                  </span>
                  {i < fav.chords.length - 1 && (
                    <span className="mx-0.5 text-text-secondary-light dark:text-text-secondary-dark">
                      →
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Key of {fav.key}
            </p>
          </div>
          <span
            className={`text-xs text-text-secondary-light transition-transform duration-200 dark:text-text-secondary-dark ${expanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
          <div className="mb-3 inline-block rounded-lg bg-primary/5 px-3 py-2 text-sm dark:bg-primary-light/5">
            <span className="text-xs font-medium text-text-secondary-light dark:text-text-secondary-dark">
              Scale:{" "}
            </span>
            <span className="font-semibold text-text-light dark:text-text-dark">
              {fav.scale}
            </span>
          </div>

          <div className="mb-3 rounded-lg bg-secondary/5 px-4 py-3 dark:bg-secondary-light/5">
            <span className="mb-1 block text-xs font-medium text-secondary dark:text-secondary-light">
              Why it works
            </span>
            <p className="text-sm leading-relaxed text-text-light dark:text-text-dark">
              {fav.theory}
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

const MOODS = ["Happy", "Sad", "Calm", "Energetic", "Melancholy", "Romantic"];

const selectClass =
  "cursor-pointer rounded-lg border border-gray-200 bg-surface-light px-2 py-1 text-xs text-text-light outline-none dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark";

export function FavoritesOverlay({
  favorites,
  onRemove,
  onClose,
}: FavoritesOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [instrumentFilter, setInstrumentFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = favorites.filter((fav) => {
    if (moodFilter && fav.mood !== moodFilter) return false;
    if (instrumentFilter && fav.instrument !== instrumentFilter) return false;
    if (levelFilter && fav.complexity !== levelFilter) return false;
    return true;
  });

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Favorites"
      className="fixed inset-0 z-50 flex justify-end outline-none"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex h-full w-full flex-col bg-bg-light sm:max-w-md dark:bg-bg-dark">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-light dark:text-text-dark">
            Favorites
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 text-text-secondary-light transition-colors hover:bg-surface-light hover:text-text-light dark:text-text-secondary-dark dark:hover:bg-surface-dark dark:hover:text-text-dark"
            aria-label="Close favorites"
          >
            ✕
          </button>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-3 dark:border-gray-700">
            <select
              value={moodFilter ?? ""}
              onChange={(e) => setMoodFilter(e.target.value || null)}
              className={selectClass}
              aria-label="Filter by mood"
            >
              <option value="">All moods</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={instrumentFilter ?? ""}
              onChange={(e) => setInstrumentFilter(e.target.value || null)}
              className={selectClass}
              aria-label="Filter by instrument"
            >
              <option value="">All</option>
              <option value="guitar">Guitar</option>
              <option value="piano">Piano</option>
            </select>
            <select
              value={levelFilter ?? ""}
              onChange={(e) =>
                setLevelFilter(e.target.value ? Number(e.target.value) : null)
              }
              className={selectClass}
              aria-label="Filter by level"
            >
              <option value="">All levels</option>
              <option value="1">Beginner</option>
              <option value="2">Intermediate</option>
              <option value="3">Advanced</option>
            </select>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="mb-3 text-4xl">♡</span>
              <p className="text-lg font-medium text-text-light dark:text-text-dark">
                No favorites yet
              </p>
              <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Tap the heart on any progression to save it here
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                No favorites match the current filters
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((fav) => (
                <FavoriteCard
                  key={fav.id}
                  fav={fav}
                  onRemove={() => onRemove(fav.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
