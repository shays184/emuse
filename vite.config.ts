import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { config } from "dotenv";

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

        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(chunk as Buffer);
        const body = JSON.parse(Buffer.concat(chunks).toString());

        const { mood } = body ?? {};
        if (!mood || typeof mood !== "string" || !mood.trim()) {
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
              {
                role: "system",
                content: `You are a music theory expert. Given a mood description, return 3-5 chord progressions that match that mood.\n\nRespond ONLY with valid JSON in this exact format:\n{\n  "progressions": [\n    { "chords": ["Am", "F", "C", "G"], "key": "Am" }\n  ]\n}\n\nRules:\n- Each progression should have 3-6 chords\n- Use standard chord notation (e.g., Am, F, C, G, Dm7, Cmaj7, Bb)\n- Include the key each progression is in\n- Choose progressions that genuinely evoke the described mood\n- Vary the progressions (different keys, lengths, complexity)\n- Do NOT include any text outside the JSON`,
              },
              { role: "user", content: mood.trim() },
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
            res.end(JSON.stringify({ error: "Invalid response format from AI" }));
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
