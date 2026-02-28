import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "emuse-favorites";

export interface FavoriteProgression {
  id: string;
  mood: string;
  instrument: string;
  chords: string[];
  key: string;
  scale: string;
  complexity: number;
  theory: string;
  savedAt: number;
}

function generateId(
  mood: string,
  instrument: string,
  chords: string[],
  key: string,
): string {
  return `${mood}|${instrument}|${chords.join("-")}|${key}`;
}

function loadFavorites(): FavoriteProgression[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteProgression[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const [favorites, setFavorites] =
    useState<FavoriteProgression[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback(
    (
      mood: string,
      instrument: string,
      progression: {
        chords: string[];
        key: string;
        scale: string;
        complexity: number;
        theory: string;
      },
    ) => {
      const id = generateId(
        mood,
        instrument,
        progression.chords,
        progression.key,
      );
      setFavorites((prev) => {
        if (prev.some((f) => f.id === id)) return prev;
        return [
          ...prev,
          {
            id,
            mood,
            instrument,
            chords: progression.chords,
            key: progression.key,
            scale: progression.scale,
            complexity: progression.complexity,
            theory: progression.theory,
            savedAt: Date.now(),
          },
        ];
      });
    },
    [],
  );

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const isFavorite = useCallback(
    (
      mood: string,
      instrument: string,
      chords: string[],
      key: string,
    ): boolean => {
      const id = generateId(mood, instrument, chords, key);
      return favorites.some((f) => f.id === id);
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    (
      mood: string,
      instrument: string,
      progression: {
        chords: string[];
        key: string;
        scale: string;
        complexity: number;
        theory: string;
      },
    ) => {
      const id = generateId(
        mood,
        instrument,
        progression.chords,
        progression.key,
      );
      setFavorites((prev) => {
        if (prev.some((f) => f.id === id)) {
          return prev.filter((f) => f.id !== id);
        }
        return [
          ...prev,
          {
            id,
            mood,
            instrument,
            chords: progression.chords,
            key: progression.key,
            scale: progression.scale,
            complexity: progression.complexity,
            theory: progression.theory,
            savedAt: Date.now(),
          },
        ];
      });
    },
    [],
  );

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite };
}
