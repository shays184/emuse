import { useState } from "react";

interface Progression {
  chords: string[];
  complexity: number;
  key: string;
  scale: string;
  theory: string;
}

interface ProgressionCardProps {
  progression: Progression;
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

export function ProgressionCard({ progression, index }: ProgressionCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl bg-surface-light shadow-sm transition-shadow hover:shadow-md dark:bg-surface-dark">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full cursor-pointer items-center gap-4 p-4 text-left"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary dark:bg-primary-light/10 dark:text-primary-light">
          {index + 1}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-lg font-semibold tracking-wide text-text-light dark:text-text-dark">
              {progression.chords.join(" → ")}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${COMPLEXITY_COLORS[progression.complexity] ?? ""}`}
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
      </button>

      {expanded && (
        <div className="border-t border-gray-200 px-4 pb-4 pt-3 dark:border-gray-700">
          <div className="mb-3 flex gap-4 text-sm">
            <div>
              <span className="font-medium text-text-secondary-light dark:text-text-secondary-dark">
                Scale:{" "}
              </span>
              <span className="text-text-light dark:text-text-dark">
                {progression.scale}
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary-light dark:text-text-secondary-dark">
            {progression.theory}
          </p>
        </div>
      )}
    </div>
  );
}
