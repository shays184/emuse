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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { mood } = req.body ?? {};

  if (!mood || typeof mood !== "string" || mood.trim().length === 0) {
    return res.status(400).json({ error: "Mood text is required" });
  }

  if (mood.length > 500) {
    return res.status(400).json({ error: "Mood text is too long (max 500 characters)" });
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
        { role: "user", content: mood.trim() },
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

    const message =
      err instanceof Error ? err.message : "Unknown error";

    if (message.includes("rate limit") || message.includes("429")) {
      return res.status(429).json({ error: "Rate limit exceeded. Try again shortly." });
    }

    return res.status(500).json({ error: "Failed to generate progressions" });
  }
}
