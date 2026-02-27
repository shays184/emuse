interface MoodTileProps {
  mood: string;
  emoji: string;
  onClick: (mood: string) => void;
}

const MOOD_COLORS: Record<string, string> = {
  Happy:
    "from-amber-400 to-yellow-300 dark:from-amber-500 dark:to-yellow-400",
  Sad: "from-blue-500 to-indigo-400 dark:from-blue-600 dark:to-indigo-500",
  Calm: "from-teal-400 to-cyan-300 dark:from-teal-500 dark:to-cyan-400",
  Energetic:
    "from-red-500 to-orange-400 dark:from-red-600 dark:to-orange-500",
  Melancholy:
    "from-purple-500 to-violet-400 dark:from-purple-600 dark:to-violet-500",
  Romantic:
    "from-pink-500 to-rose-400 dark:from-pink-600 dark:to-rose-500",
};

export function MoodTile({ mood, emoji, onClick }: MoodTileProps) {
  const gradient = MOOD_COLORS[mood] ?? "from-gray-400 to-gray-300";

  return (
    <button
      onClick={() => onClick(mood)}
      className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95`}
    >
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-white">{mood}</span>
    </button>
  );
}
