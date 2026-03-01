import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

interface ProfilePageProps {
  onBack: () => void;
}

const AVATAR_COLORS = [
  "bg-amber-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-rose-500",
  "bg-violet-500",
];

function getInitials(name: string | null | undefined, email: string): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const a = parts[0]?.[0] ?? "";
      const b = parts[1]?.[0] ?? "";
      return (a + b).toUpperCase() || "?";
    }
    return name.slice(0, 2).toUpperCase();
  }
  const local = email.split("@")[0];
  return local ? local.slice(0, 2).toUpperCase() : "?";
}

function avatarColor(email: string): string {
  let n = 0;
  for (let i = 0; i < email.length; i++) n += email.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length]!;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [preferredInstrument, setPreferredInstrument] = useState<
    "guitar" | "piano"
  >(profile?.preferred_instrument ?? "guitar");
  const [preferredTheme, setPreferredTheme] = useState<
    "dark" | "light" | "mood"
  >(profile?.preferred_theme ?? "dark");
  const [saving, setSaving] = useState(false);
  const [prefError, setPrefError] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.display_name ?? "");
    setPreferredInstrument(profile?.preferred_instrument ?? "guitar");
    setPreferredTheme(profile?.preferred_theme ?? "dark");
  }, [profile]);

  const saveProfile = async () => {
    if (!supabase || !user) return;
    setSaving(true);
    setPrefError(null);
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          display_name: displayName.trim() || null,
          preferred_instrument: preferredInstrument,
          preferred_theme: preferredTheme,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
      if (error) {
        setPrefError(error.message);
        return;
      }
      await refreshProfile();
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = async (
    field: "preferred_instrument" | "preferred_theme",
    value: string,
  ) => {
    if (!supabase || !user) return;
    setPrefError(null);
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        [field]: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) {
      setPrefError(error.message);
      return;
    }
    await refreshProfile();
  };

  if (!user) return null;

  const initials = getInitials(
    displayName || (profile?.display_name ?? null),
    user.email ?? "",
  );
  const color = avatarColor(user.email ?? "");

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-4 pt-8 pb-16">
      <button
        onClick={onBack}
        className="mb-6 rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
      >
        ← Back
      </button>

      <div className="mb-8 flex items-center gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white ${color}`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={saveProfile}
            placeholder="Display name"
            className="w-full rounded-lg border border-gray-200 bg-surface-light px-3 py-2 text-lg font-semibold text-text-light focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark dark:focus:border-primary-light"
          />
          <p className="mt-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {user.email}
          </p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
          Preferences
        </h2>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Default instrument
            </label>
            <select
              value={preferredInstrument}
              onChange={(e) => {
                const v = e.target.value as "guitar" | "piano";
                setPreferredInstrument(v);
                updatePreference("preferred_instrument", v);
              }}
              className="w-full rounded-lg border border-gray-200 bg-surface-light px-3 py-2 text-text-light dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
            >
              <option value="guitar">Guitar</option>
              <option value="piano">Piano</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-text-secondary-light dark:text-text-secondary-dark">
              Theme
            </label>
            <select
              value={preferredTheme}
              onChange={(e) => {
                const v = e.target.value as "dark" | "light" | "mood";
                setPreferredTheme(v);
                updatePreference("preferred_theme", v);
              }}
              className="w-full rounded-lg border border-gray-200 bg-surface-light px-3 py-2 text-text-light dark:border-gray-700 dark:bg-surface-dark dark:text-text-dark"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="mood">Mood</option>
            </select>
          </div>
        </div>
        {(saving || prefError) && (
          <p
            className={`mt-2 text-xs ${prefError ? "text-red-500 dark:text-red-400" : "text-text-secondary-light dark:text-text-secondary-dark"}`}
          >
            {prefError ?? "Saving…"}
          </p>
        )}
      </section>

      <button
        onClick={() => signOut()}
        className="cursor-pointer rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
      >
        Sign out
      </button>
    </main>
  );
}
