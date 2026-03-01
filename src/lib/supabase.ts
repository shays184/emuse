import { createClient } from "@supabase/supabase-js";

const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// In dev, use Vite proxy (same-origin) to avoid CORS / "failed to fetch"
const url =
  import.meta.env.DEV && typeof window !== "undefined"
    ? `${window.location.origin}/supabase`
    : baseUrl;

/** Wraps fetch to avoid "Unexpected end of JSON input" when proxy returns empty body */
const safeFetch: typeof fetch = async (input, init) => {
  const res = await fetch(input, init);
  const text = await res.text();
  if (!text?.trim()) {
    const msg =
      res.status >= 500
        ? "Supabase server error. Is your project paused? Unpause it in the dashboard."
        : res.status >= 400
          ? "Request failed. Check your Supabase URL and anon key in .env"
          : "Empty response from Supabase. Check your project status.";
    return new Response(
      JSON.stringify({ error: msg, error_description: msg }),
      {
        status: res.status,
        statusText: res.statusText,
        headers: new Headers({
          ...Object.fromEntries(res.headers.entries()),
          "Content-Type": "application/json",
        }),
      },
    );
  }
  return new Response(text, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });
};

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "emuse-auth",
        },
        global: { fetch: safeFetch },
      })
    : null;
