import { MoodTile } from "../components/MoodTile";

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
}

export function LandingPage({ onMoodSelect }: LandingPageProps) {
  const handleSurpriseMe = () => {
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)]!;
    onMoodSelect(randomMood.name);
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-16">
      <h1 className="mb-2 text-5xl font-bold text-primary dark:text-primary-light">
        eMuse
      </h1>
      <p className="mb-12 text-lg text-text-secondary-light dark:text-text-secondary-dark">
        Pick your mood. Get your chords. Start playing.
      </p>

      <div className="mb-10 grid w-full max-w-lg grid-cols-3 gap-4">
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
        <div className="relative">
          <input
            type="text"
            placeholder="Describe your mood in your own words..."
            disabled
            className="w-full rounded-xl border border-gray-300 bg-surface-light px-4 py-3 text-text-light opacity-50 dark:border-gray-600 dark:bg-surface-dark dark:text-text-dark"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-gray-200 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-700 dark:text-gray-400">
            Coming soon
          </span>
        </div>
      </div>

      <button
        onClick={handleSurpriseMe}
        className="cursor-pointer rounded-xl bg-secondary px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-secondary/90 hover:shadow-lg active:scale-95 dark:bg-secondary-light dark:text-bg-dark"
      >
        🎲 Surprise me
      </button>
    </div>
  );
}
