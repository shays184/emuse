import { ProgressionCard } from "../components/ProgressionCard";
import progressionsData from "../data/progressions.json";

interface ProgressionsPageProps {
  mood: string;
  instrument: string;
  onBack: () => void;
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

export function ProgressionsPage({ mood, instrument, onBack }: ProgressionsPageProps) {
  const moodEntry = (progressionsData as MoodEntry[]).find(
    (entry) => entry.mood === mood,
  );
  const progressions = moodEntry?.progressions ?? [];

  const sorted = [...progressions].sort(
    (a, b) => a.complexity - b.complexity,
  );

  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 pt-8 pb-16">
      <button
        onClick={onBack}
        className="mb-6 cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light transition-colors hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
      >
        ← Back
      </button>

      <div className="mb-8">
        <h2 className="mb-1 text-3xl font-bold text-text-light dark:text-text-dark">
          {mood}
        </h2>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          {instrument.charAt(0).toUpperCase() + instrument.slice(1)} •{" "}
          {sorted.length} progressions
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {sorted.map((progression, index) => (
          <ProgressionCard
            key={index}
            progression={progression}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
