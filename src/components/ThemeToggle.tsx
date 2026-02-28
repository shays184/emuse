import type { ThemeMode } from "../hooks/useTheme";

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: () => void;
}

const ICONS: Record<ThemeMode, string> = {
  dark: "🌙",
  light: "☀️",
  mood: "🎨",
};

const LABELS: Record<ThemeMode, string> = {
  dark: "Dark",
  light: "Light",
  mood: "Mood",
};

export function ThemeToggle({ mode, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Theme: ${LABELS[mode]}. Click to switch.`}
      title={`${LABELS[mode]} mode`}
      className="fixed left-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-surface-light shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-surface-dark"
    >
      <span className="text-xl">{ICONS[mode]}</span>
    </button>
  );
}
