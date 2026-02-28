# eMuse

A web app where musicians get chord progressions based on their current mood.

## Current Status

**Phases 0–2 Complete** — Core flow with chord diagrams working!

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
- Dark mode UI

**Try it:** `npm run dev` → Open http://localhost:5173 → Pick a mood → Choose an instrument → Filter by level → Hover chord names for diagrams

**Next:** Phase 3 — Favorites (save/load from localStorage)

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format |
| `npm run format:check` | Prettier check |
