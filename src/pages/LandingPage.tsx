import { useState } from "react";
import { MoodTile } from "../components/MoodTile";
import { generateProgressions } from "../services/api";
import type { AIProgression } from "../services/api";

const MOODS = [
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Calm", emoji: "🧘" },
  { name: "Energetic", emoji: "⚡" },
  { name: "Melancholy", emoji: "🌧️" },
  { name: "Romantic", emoji: "💕" },
];

interface LandingPageProps {
  onMoodSelect: (mood: string) => void;
  onFreeTextResults: (mood: string, progressions: AIProgression[]) => void;
}

export function LandingPage({
  onMoodSelect,
  onFreeTextResults,
}: LandingPageProps) {
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSurpriseMe = () => {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)]!;
    onMoodSelect(randomMood.name);
  };

  const handleFreeTextSubmit = async () => {
    const text = freeText.trim();
    if (!text) return;

    setLoading(true);
    setError(null);

    try {
      const result = await generateProgressions(text);
      onFreeTextResults(text, result.progressions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && freeText.trim()) {
      handleFreeTextSubmit();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-16">
      <h1 className="mb-2 text-4xl font-bold text-primary sm:text-5xl dark:text-primary-light">
        eMuse
      </h1>
      <p className="mb-12 text-lg text-text-secondary-light dark:text-text-secondary-dark">
        Pick your mood. Get your chords. Start playing.
      </p>

      <div className="mb-10 grid w-full max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
        {MOODS.map((mood) => (
          <MoodTile
            key={mood.name}
            mood={mood.name}
            emoji={mood.emoji}
            onClick={onMoodSelect}
          />
        ))}
      </div>

      <div className="mb-6 w-full max-w-lg">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={freeText}
            onChange={(e) => {
              setFreeText(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe your mood in your own words..."
            disabled={loading}
            maxLength={500}
            className="w-full rounded-xl border border-gray-300 bg-surface-light px-4 py-3 text-text-light transition-colors focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-surface-dark dark:text-text-dark dark:focus:border-primary-light"
          />
          <button
            onClick={handleFreeTextSubmit}
            disabled={loading || !freeText.trim()}
            className="shrink-0 cursor-pointer rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-light dark:text-bg-dark"
          >
            {loading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              "→"
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>

      <button
        onClick={handleSurpriseMe}
        className="cursor-pointer rounded-xl bg-secondary px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-secondary/90 hover:shadow-lg active:scale-95 dark:bg-secondary-light dark:text-bg-dark"
      >
        🎲 Surprise me
      </button>
    </main>
  );
}
