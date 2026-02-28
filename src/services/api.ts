export interface AIProgression {
  chords: string[];
  key: string;
}

export interface AIResponse {
  progressions: AIProgression[];
}

export async function generateProgressions(mood: string): Promise<AIResponse> {
  const res = await fetch("/api/generate-progressions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mood }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Request failed (${res.status})`,
    );
  }

  return res.json();
}
