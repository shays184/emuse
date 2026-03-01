import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "dark" | "light" | "mood";

const STORAGE_KEY = "emuse-theme";

interface MoodTheme {
  bg: string;
  darkText: boolean;
}

const MOOD_THEMES: Record<string, MoodTheme> = {
  Happy: {
    bg: "linear-gradient(135deg, #fef3c7 0%, #fde68a 40%, #fcd34d 100%)",
    darkText: true,
  },
  Sad: {
    bg: "linear-gradient(135deg, #1e3a5f 0%, #1e2a4a 40%, #162038 100%)",
    darkText: false,
  },
  Calm: {
    bg: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 40%, #5eead4 100%)",
    darkText: true,
  },
  Energetic: {
    bg: "linear-gradient(135deg, #fee2e2 0%, #fca5a5 40%, #f87171 100%)",
    darkText: true,
  },
  Melancholy: {
    bg: "linear-gradient(135deg, #2d1b4e 0%, #1f1338 40%, #150d28 100%)",
    darkText: false,
  },
  Romantic: {
    bg: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 40%, #f472b6 100%)",
    darkText: true,
  },
};

function loadTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light" || stored === "mood") {
      return stored;
    }
  } catch {
    /* ignore */
  }
  return "dark";
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(loadTheme);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);

    const html = document.documentElement;

    if (mode === "dark") {
      html.classList.add("dark");
      document.body.style.background = "";
    } else if (mode === "light") {
      html.classList.remove("dark");
      document.body.style.background = "";
    } else {
      const theme = activeMood ? MOOD_THEMES[activeMood] : null;
      if (theme?.darkText) {
        html.classList.remove("dark");
      } else {
        html.classList.add("dark");
      }
      document.body.style.background = theme?.bg || "";
    }

    return () => {
      document.body.style.background = "";
    };
  }, [mode, activeMood]);

  const cycleTheme = useCallback(() => {
    setMode((prev) => {
      if (prev === "dark") return "light";
      if (prev === "light") return "mood";
      return "dark";
    });
  }, []);

  return { mode, setMode, cycleTheme, setActiveMood };
}
