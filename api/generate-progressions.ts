import type { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a music theory expert. Given a mood description, return 3-5 chord progressions that match that mood.

Respond ONLY with valid JSON in this exact format:
{
  "progressions": [
    { "chords": ["Am", "F", "C", "G"], "key": "Am" }
  ]
}

Rules:
- Each progression should have 3-6 chords
- Use standard chord notation (e.g., Am, F, C, G, Dm7, Cmaj7, Bb)
- Include the key each progression is in
- Choose progressions that genuinely evoke the described mood
- Vary the progressions (different keys, lengths, complexity)
- Do NOT include any text outside the JSON`;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function sanitizeInput(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{Emoji}]/gu, "")
    .trim()
    .slice(0, 500);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket?.remoteAddress ??
    "unknown";

  if (isRateLimited(ip)) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please wait a minute and try again." });
  }

  const { mood } = req.body ?? {};

  if (!mood || typeof mood !== "string" || mood.trim().length === 0) {
    return res.status(400).json({ error: "Mood text is required" });
  }

  const sanitized = sanitizeInput(mood);
  if (sanitized.length === 0) {
    return res.status(400).json({ error: "Mood text is required" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: sanitized },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return res.status(502).json({ error: "Empty response from AI" });
    }

    const parsed = JSON.parse(content);

    if (
      !parsed.progressions ||
      !Array.isArray(parsed.progressions) ||
      parsed.progressions.length === 0
    ) {
      return res.status(502).json({ error: "Invalid response format from AI" });
    }

    for (const p of parsed.progressions) {
      if (!Array.isArray(p.chords) || !p.key) {
        return res
          .status(502)
          .json({ error: "Invalid progression format from AI" });
      }
    }

    return res.status(200).json(parsed);
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(502).json({ error: "AI returned invalid JSON" });
    }

    const message = err instanceof Error ? err.message : "Unknown error";

    if (message.includes("rate limit") || message.includes("429")) {
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Try again shortly." });
    }

    return res.status(500).json({ error: "Failed to generate progressions" });
  }
}
