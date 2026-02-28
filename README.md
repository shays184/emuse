# eMuse

A web app where musicians get chord progressions based on their current mood.

## Current Status

**Phases 0–4 Complete** — Full flow with AI-powered free text mood input!

**What works right now:**
- Landing page with 6 mood tiles (Happy, Sad, Calm, Energetic, Melancholy, Romantic)
- "Surprise me" random mood selection
- Instrument selection (Guitar / Piano)
- 90 chord progressions (15 per mood, mix of 3–6 chords each)
- Expandable cards showing scale and "Why it works" theory
- Complexity filter (Beginner / Intermediate / Advanced / All)
- Hover chord names to see SVG diagrams (fretboard for guitar, keyboard for piano)
- Piano diagrams show note names on highlighted keys
- Guitar chords with multiple voicings have arrow navigation
- Save/remove favorites with heart button on each progression
- Persistent favorites overlay (floating heart icon, bottom-right) with badge count
- Favorites persist across sessions (localStorage)
- Favorite cards are expandable (scale + theory) with hoverable chord diagrams
- Mood-colored and instrument-colored tags in favorites
- Free text mood input with AI-generated progressions (requires OpenAI API key)
- Loading spinner and error handling for AI requests
- Dark mode UI

> **Note:** The free text AI path is implemented but not yet verified end-to-end due to OpenAI API quota limits. It requires a funded OpenAI account.

**Try it:** `npm run dev` → Open http://localhost:5173 → Pick a mood tile OR type a free-form mood description

**Next:** Phase 5 — Security & Polish (rate limiting, responsive layout, accessibility)

## Setup

```bash
npm install
npm run dev
```

For the AI free text path, create a `.env` file (see `.env.example`):
```
OPENAI_API_KEY=sk-your-key-here
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (includes AI API via Vite plugin) |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
