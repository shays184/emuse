import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { config } from "dotenv";

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;
const devRequestLog = new Map<string, number[]>();

function devRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = devRequestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  recent.push(now);
  devRequestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

function sanitize(raw: string): string {
  return raw
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}\p{Emoji}]/gu, "")
    .trim()
    .slice(0, 500);
}

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

function apiDevPlugin(): Plugin {
  return {
    name: "api-dev",
    configureServer(server) {
      config();

      server.middlewares.use("/api/generate-progressions", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const ip = req.socket?.remoteAddress ?? "unknown";
        if (devRateLimited(ip)) {
          res.statusCode = 429;
          res.end(
            JSON.stringify({
              error: "Too many requests. Please wait a minute and try again.",
            }),
          );
          return;
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = JSON.parse(Buffer.concat(chunks).toString());

        const { mood } = body ?? {};
        if (!mood || typeof mood !== "string" || !mood.trim()) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Mood text is required" }));
          return;
        }

        const cleaned = sanitize(mood);
        if (!cleaned) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Mood text is required" }));
          return;
        }

        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              error: "OPENAI_API_KEY not set. Create a .env file with your key.",
            }),
          );
          return;
        }

        try {
          const { default: OpenAI } = await import("openai");
          const openai = new OpenAI({ apiKey });

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: cleaned },
            ],
            temperature: 0.8,
            max_tokens: 1000,
          });

          const content = completion.choices[0]?.message?.content?.trim();
          if (!content) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: "Empty response from AI" }));
            return;
          }

          const parsed = JSON.parse(content);
          if (!parsed.progressions || !Array.isArray(parsed.progressions)) {
            res.statusCode = 502;
            res.end(
              JSON.stringify({ error: "Invalid response format from AI" }),
            );
            return;
          }

          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(parsed));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          res.statusCode = 500;
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
