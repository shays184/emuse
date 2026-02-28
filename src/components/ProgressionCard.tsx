import { useState } from "react";
import { ChordTooltip } from "./ChordTooltip";

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
  index: number;
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
  index,
}: ProgressionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-visible rounded-xl bg-surface-light shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark">
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
        className="flex w-full cursor-pointer items-center gap-4 p-4 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary-light/10 dark:text-primary-light">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1 text-lg">
            {progression.chords.map((chord, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span onClick={(e) => e.stopPropagation()}>
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

          <div className="rounded-lg bg-secondary/5 px-4 py-3 dark:bg-secondary-light/5">
            <span className="mb-1 block text-xs font-medium text-secondary dark:text-secondary-light">
              Why it works
            </span>
            <p className="text-sm leading-relaxed text-text-light dark:text-text-dark">
              {progression.theory}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
