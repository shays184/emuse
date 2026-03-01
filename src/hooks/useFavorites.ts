import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

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
  collectionId?: string | null;
}

function generateLocalId(
  mood: string,
  instrument: string,
  chords: string[],
  key: string,
): string {
  return `${mood}|${instrument}|${chords.join("-")}|${key}`;
}

function matchesProgression(
  fav: FavoriteProgression,
  mood: string,
  instrument: string,
  chords: string[],
  key: string,
): boolean {
  return (
    fav.mood === mood &&
    fav.instrument === instrument &&
    fav.key === key &&
    JSON.stringify(fav.chords) === JSON.stringify(chords)
  );
}

function loadLocalFavorites(): FavoriteProgression[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalFavorites(favorites: FavoriteProgression[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProgression[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabase) {
      setFavorites(loadLocalFavorites());
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setFavorites(loadLocalFavorites());
        } else if (data) {
          setFavorites(
            data.map((r) => ({
              id: r.id,
              mood: r.mood,
              instrument: r.instrument,
              chords: r.chords as string[],
              key: r.key,
              scale: r.scale,
              complexity: r.complexity,
              theory: r.theory,
              savedAt: new Date(r.created_at).getTime(),
              collectionId: r.collection_id,
            })),
          );
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      saveLocalFavorites(favorites);
    }
  }, [favorites, user]);

  const addFavorite = useCallback(
    async (
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
      const id = generateLocalId(
        mood,
        instrument,
        progression.chords,
        progression.key,
      );
      const newFav: FavoriteProgression = {
        id,
        mood,
        instrument,
        chords: progression.chords,
        key: progression.key,
        scale: progression.scale,
        complexity: progression.complexity,
        theory: progression.theory,
        savedAt: Date.now(),
      };

      if (user && supabase) {
        const { data, error } = await supabase
          .from("favorites")
          .insert({
            user_id: user.id,
            mood,
            instrument,
            chords: progression.chords,
            key: progression.key,
            scale: progression.scale,
            complexity: progression.complexity,
            theory: progression.theory,
          })
          .select("id, created_at")
          .single();
        if (!error && data) {
          newFav.id = data.id;
          newFav.savedAt = new Date(data.created_at).getTime();
        }
      }

      setFavorites((prev) => {
        if (
          prev.some((f) =>
            matchesProgression(
              f,
              mood,
              instrument,
              progression.chords,
              progression.key,
            ),
          )
        ) {
          return prev;
        }
        return [...prev, newFav];
      });
    },
    [user],
  );

  const removeFavorite = useCallback(
    async (id: string) => {
      if (user && supabase) {
        await supabase
          .from("favorites")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);
      }
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    },
    [user],
  );

  const isFavorite = useCallback(
    (
      mood: string,
      instrument: string,
      chords: string[],
      key: string,
    ): boolean => {
      return favorites.some((f) =>
        matchesProgression(f, mood, instrument, chords, key),
      );
    },
    [favorites],
  );

  const toggleFavorite = useCallback(
    async (
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
      const existing = favorites.find((f) =>
        matchesProgression(
          f,
          mood,
          instrument,
          progression.chords,
          progression.key,
        ),
      );
      if (existing) {
        await removeFavorite(existing.id);
      } else {
        await addFavorite(mood, instrument, progression);
      }
    },
    [favorites, addFavorite, removeFavorite],
  );

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
}
