import { useState } from "react";
import { ProgressionCard } from "../components/ProgressionCard";
import { ComplexityFilter } from "../components/ComplexityFilter";
import progressionsData from "../data/progressions.json";
import type { AIProgression } from "../services/api";

interface ProgressionsPageProps {
  mood: string;
  instrument: string | null;
  onBack: () => void;
  isFavorite: (
    mood: string,
    instrument: string,
    chords: string[],
    key: string,
  ) => boolean;
  onToggleFavorite: (
    mood: string,
    instrument: string,
    progression: {
      chords: string[];
      key: string;
      scale: string;
      complexity: number;
      theory: string;
    },
  ) => void;
  isFreeText?: boolean;
  aiProgressions?: AIProgression[] | null;
}

interface Progression {
  chords: string[];
  complexity: number;
  key: string;
  scale: string;
  theory: string;
}

interface MoodEntry {
  mood: string;
  progressions: Progression[];
}

export function ProgressionsPage({
  mood,
  instrument,
  onBack,
  isFavorite,
  onToggleFavorite,
  isFreeText = false,
  aiProgressions = null,
}: ProgressionsPageProps) {
  const [complexityFilter, setComplexityFilter] = useState<number | null>(null);

  if (isFreeText && aiProgressions) {
    return (
      <div className="mx-auto min-h-screen max-w-2xl px-4 pt-8 pb-16">
        <button
          onClick={onBack}
          className="mb-6 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light transition-colors hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
        >
          ← Back
        </button>

        <div className="mb-6">
          <h2 className="mb-1 text-3xl font-bold text-text-light dark:text-text-dark">
            "{mood}"
          </h2>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            AI-generated • {aiProgressions.length} progressions
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {aiProgressions.map((p, i) => (
            <div
              key={`${p.key}-${p.chords.join("-")}-${i}`}
              className="rounded-xl bg-surface-light p-4 shadow-sm dark:bg-surface-dark"
            >
              <p className="text-lg font-semibold text-text-light dark:text-text-dark">
                {p.chords.join(" → ")}
              </p>
              <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Key of {p.key}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const moodEntry = (progressionsData as MoodEntry[]).find(
    (entry) => entry.mood === mood,
  );
  const progressions = moodEntry?.progressions ?? [];

  const filtered = complexityFilter
    ? progressions.filter((p) => p.complexity === complexityFilter)
    : progressions;

  const sorted = [...filtered].sort((a, b) => a.complexity - b.complexity);

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 pt-8 pb-16">
      <button
        onClick={onBack}
        className="mb-6 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light transition-colors hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
      >
        ← Back
      </button>

      <div className="mb-6">
        <h2 className="mb-1 text-3xl font-bold text-text-light dark:text-text-dark">
          {mood}
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          {instrument
            ? instrument.charAt(0).toUpperCase() + instrument.slice(1)
            : ""}{" "}
          • {sorted.length} progressions
        </p>
      </div>

      <div className="mb-6">
        <ComplexityFilter
          selected={complexityFilter}
          onChange={setComplexityFilter}
        />
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((progression) => (
          <ProgressionCard
            key={`${progression.key}-${progression.chords.join("-")}`}
            progression={progression}
            instrument={instrument ?? "guitar"}
            isFavorite={isFavorite(
              mood,
              instrument ?? "guitar",
              progression.chords,
              progression.key,
            )}
            onToggleFavorite={() =>
              onToggleFavorite(mood, instrument ?? "guitar", progression)
            }
          />
        ))}
      </div>
    </div>
  );
}
