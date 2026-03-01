import { supabase } from "../lib/supabase";

export async function recordRecentlyViewed(
  userId: string,
  progression: {
    mood: string;
    instrument: string;
    chords: string[];
    key: string;
    scale: string;
    complexity: number;
    theory: string;
  },
): Promise<void> {
  if (!supabase) return;

  await supabase.from("recently_viewed").insert({
    user_id: userId,
    mood: progression.mood,
    instrument: progression.instrument,
    chords: progression.chords,
    key: progression.key,
    scale: progression.scale,
    complexity: progression.complexity,
    theory: progression.theory,
  });
}
