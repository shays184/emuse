# eMuse

A web app where musicians get chord progressions based on their current mood.

## Current Status

**Phases 0–1 Complete** — Core static flow working!

**What works right now:**
- Landing page with 6 mood tiles (Happy, Sad, Calm, Energetic, Melancholy, Romantic)
- "Surprise me" random mood selection
- Instrument selection (Guitar / Piano)
- 90 chord progressions (15 per mood, sorted by complexity)
- Expandable cards showing key, scale, chord count, and theory explanation
- Dark mode UI

**Try it:** `npm run dev` → Open http://localhost:5173 → Pick a mood → Choose an instrument → Browse progressions

**Next:** Phase 2 — Complexity filter and chord diagram hover previews

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
