# AGENTS.md — eMuse

## What This Project Is

A web app where musicians get chord progressions based on their current mood. Two entry points: pick from 6 preset moods, or describe a mood in free text (AI-powered). Supports guitar and piano. Desktop-primary, mobile-ready.

**Source of truth:** `spec.md` (requirements, architecture, data shape) and `plan.md` (phased implementation).

## Getting Started

### For New AI Agents

**Read these files in order:**
1. **This file** — map, purpose, how to work here
2. **README.md** — current status, what's built, what's next
3. **spec.md** — full requirements and architecture
4. **plan.md** — phased implementation tasks
5. **TESTING.md** — how to test each feature

**Then:**
1. Run the app to verify everything works: `npm run dev`
2. Test current features (see README.md)
3. Continue with the next incomplete phase from `plan.md`
4. Update docs as you go (see Continuous Documentation below)

## Project Structure

```
emuse/
├── AGENTS.md              # This file — persistent agent memory
├── README.md              # Current status, how to run
├── TESTING.md             # Manual QA procedures
├── spec.md                # Full spec (source of truth)
├── plan.md                # Phased implementation plan
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .env                   # LLM API key (NEVER commit)
├── index.html
├── api/
│   └── generate-progressions.ts   # Serverless function (free text → LLM)
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Root component, navigation state
│   ├── index.css          # Tailwind imports
│   ├── data/
│   │   ├── progressions.json      # Static mood-progression dataset (90 entries)
│   │   └── chordData.ts           # Fingering data for 46 chords (guitar frets + piano notes)
│   ├── pages/
│   │   ├── LandingPage.tsx        # Mood selection, free text input
│   │   ├── InstrumentPage.tsx     # Guitar / Piano choice
│   │   └── ProgressionsPage.tsx   # Progression list with expandable cards
│   ├── components/
│   │   ├── MoodTile.tsx           # Mood selection tile with emoji + gradient
│   │   ├── ProgressionCard.tsx    # Expandable card (scale, theory, hoverable chords)
│   │   ├── ComplexityFilter.tsx   # Pill-style filter (Beginner/Intermediate/Advanced/All)
│   │   ├── ChordTooltip.tsx       # Hover wrapper — shows diagram tooltip, voicing nav
│   │   ├── GuitarDiagram.tsx      # SVG fretboard renderer (dots, barres, open/muted)
│   │   ├── PianoDiagram.tsx       # SVG piano keyboard renderer (highlighted keys + note names)
│   │   └── FavoritesOverlay.tsx   # Slide-in panel with expandable favorite cards + tooltips
│   ├── hooks/
│   │   ├── useNavigation.ts       # State-based navigation (no React Router)
│   │   └── useFavorites.ts        # localStorage persistence (add/remove/toggle/isFavorite)
│   ├── services/
│   │   └── api.ts                 # (future) Client-side API calls
```

## Technology Stack

| Layer | Choice |
|-------|--------|
| Frontend | React, TypeScript, Tailwind CSS (pure, no component library) |
| Build | Vite |
| Backend | Single Vercel serverless function (Node) |
| LLM | OpenAI API (free text path only) |
| Data | Static JSON bundled with frontend |
| Storage | Browser localStorage (favorites) |
| Testing | Vitest |
| Formatting | ESLint + Prettier |
| Package manager | npm |

## Architecture

```
User → React SPA
           ├── Static mood → reads bundled JSON → displays progressions (zero network calls)
           └── Free text mood → serverless function → OpenAI API → returns progressions
```

State management uses plain `useState` and `useContext`. No external state library. Navigation is state-based component swapping — no React Router.

The only external runtime dependency is the OpenAI API, used only for the free text path.

## Design System

### Color Palette

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `primary` | Deep purple (#6C2BD9) | Bright purple (#A78BFA) | Brand, interactive elements, CTAs |
| `secondary` | Azure (#2563EB) | Light azure (#60A5FA) | Accents, highlights, links |
| `background` | Warm off-white (#F9F7F4) | Deep indigo-black (#0F0D1A) | Page background |
| `surface` | White (#FFFFFF) | Dark purple-gray (#1E1B2E) | Cards, overlays, inputs |
| `text-primary` | Dark charcoal (#1C1917) | Off-white (#F5F3F0) | Body text |
| `text-secondary` | Gray (#78716C) | Muted lavender (#A8A3B8) | Secondary text, labels |

Dark mode is the default. Support both modes from the start. In a future phase (post-MVP), the background will shift to match the selected mood.

### Visual Style

- Clean, modern, spacious — generous whitespace
- Rounded corners on cards and buttons
- Subtle transitions and hover states
- Chord diagrams styled after tab4u.com (fretboard for guitar, keyboard for piano)
- tab4u.com is the reference for chord diagrams only, not overall app design

## How to Work Here

### Collaboration Style

- Think step-by-step before writing code — explain your approach first
- Explain at a low level with few abstractions
- Define new technical terms before using them
- Pause to check in — don't barrel ahead
- Be concise but accurate

### When Requirements Are Unclear

- Make the most reasonable assumption and state it explicitly
- Proceed with implementation rather than blocking
- Flag assumptions: "Assuming X because Y"

### Logging

All logging includes timestamps: `[HH:MM:SS] [PREFIX] message`

Consistent across all files (main process, services, renderer).

### Version Control

- Commit directly to `master` (solo contributor)
- Propose a commit message and wait for user confirmation before committing
- Commit message format: `type: description` with bullet points of key changes
- Never commit: `.env`, `node_modules/`, `dist/`, IDE settings, agent instruction files
- Always commit: `.env.example`, `package.json`, lock files

## Verification Commands

```bash
npm run dev          # Start dev server
npm test             # Run Vitest
npm run lint         # ESLint
npm run format:check # Prettier check
npm run build        # Production build
```

For the free text AI path (Phase 4+), use `vercel dev` to run the serverless function locally.

## Phase Wrap-Up Protocol

Before calling any phase complete, you MUST:

1. **Run verification and show output:**
   - `npm test` → show "X/X pass"
   - `npm run lint` → show "0 errors"
   - `npm run build` → show "exit 0"

2. **Verify phase objectives:**
   - Read `plan.md` objectives for this phase line by line
   - Check each off with evidence

3. **Update documentation:**
   - README.md → current status section
   - TESTING.md → manual QA steps for new features
   - spec.md / plan.md → if implementation differed from plan

4. **Proactively say:** "Let's wrap up Phase X"

5. **Walk through testing:** Concrete steps — "Click X, you should see Y" — not "test the feature"

6. **Wait for user confirmation.** NEVER proceed to the next phase without it.

7. **Memory sweep:** Capture learnings (see Continuous Documentation below)

8. **Propose a commit message** and wait for approval

### Red flags — never say:
- "Should work now"
- "Tests passed" (without showing output)
- "Phase complete, moving to Phase X"

## Code Review

For major phases, dispatch two sub-agents to review:

> "Please dispatch two subagents to carefully review [phase/feature name]. Tell them that they're competing with another agent. Make sure they look at both architecture and implementation. Tell them that whomever finds more issues gets promoted."

**Fallback (manual review):** Open two separate agent sessions with different models. Give each the code and this prompt:

```
You are competing to find issues in this code.
Another agent is also reviewing the same code.
Whomever finds more legitimate issues gets promoted.

Review both ARCHITECTURE and IMPLEMENTATION.
Be thorough but fair — only flag genuine issues, not stylistic preferences.
```

Consolidate findings and address each: fix or explain why not.

Skip formal review for trivial changes, typo fixes, and pure documentation updates.

## Continuous Documentation

CRITICAL: Update docs as you work, not just at wrap-up.

- **AGENTS.md**: When you discover gotchas, patterns, or architectural decisions
- **spec.md / plan.md**: When implementation differs from the plan (include rationale)
- **README.md**: When status or capabilities change

Ask yourself: "What would confuse a future agent about this?"

If the answer is anything — update the docs before moving on.

## Key Decisions Log

1. **SVG components over static images for chord diagrams** — The spec originally called for static chord diagram images saved from tab4u.com. We switched to code-rendered SVGs (`GuitarDiagram.tsx`, `PianoDiagram.tsx`) with fingering data in `chordData.ts`. Rationale: no copyright issues, scales perfectly at any size, easy to style with the app's color palette, and enables features like voicing navigation.

2. **Multiple voicings for complex guitar chords** — Guitar chords like 7ths, maj7s, and 9ths store an array of `GuitarChord` voicings in `chordData.ts`. The tooltip shows arrow buttons to cycle through them. Simple chords (major, minor) have a single voicing.

3. **Progression variety** — Dataset uses a mix of 3, 4, 5, and 6-chord progressions (not just 4-chord) for musical variety.

4. **Simplified ProgressionCard expanded view** — Originally showed a 2x2 grid with key, scale, chord count, level, and individual chord badges. Trimmed to only scale and "Why it works" theory text to avoid redundancy with the card header.

5. **Favorites state lifted to App.tsx** — `useFavorites()` is called once in `App.tsx` and passed down via props (not called in multiple components). This ensures a single source of truth shared between `ProgressionsPage` and `FavoritesOverlay`.

6. **Fixed-position tooltips** — `ChordTooltip` uses `position: fixed` with viewport-relative coordinates instead of `position: absolute`. This prevents clipping by any parent `overflow` container (critical for the favorites overlay scroll area).

## Gotchas & Lessons Learned

1. **Tooltip clipping** — Cards with `overflow-hidden` clip tooltips that extend beyond card bounds. For cards on the main page, `overflow-visible` works. For tooltips inside scroll containers (like the favorites overlay), `overflow-visible` doesn't help because CSS forces both overflow axes to clip when one is non-visible. Solution: use `position: fixed` on the tooltip so it's positioned relative to the viewport, bypassing all parent overflow.

2. **Guitar diagram spacing** — The chord name text above an SVG fretboard can collide with the diagram at small tooltip sizes. `TOP_PAD` in `GuitarDiagram.tsx` controls vertical spacing — set to 36 to avoid overlap.

3. **PowerShell heredoc** — Git commit with heredoc syntax (`$(cat <<'EOF'...)`) doesn't work in PowerShell. Use multiple `-m` flags instead.

4. **Tailwind dark mode** — `index.html` has `class="dark"` on the `<html>` element. All dark-mode styles use Tailwind's `dark:` prefix. This is set from the start, not toggled yet.

5. **localStorage in tests** — jsdom's localStorage may not be fully functional (setItem throws). The test setup (`src/test/setup.ts`) includes a polyfill that provides an in-memory localStorage when the native one is broken.

6. **Favorite ID generation** — Favorites are identified by `mood|instrument|chords|key`. This means the same progression saved under different instruments counts as two separate favorites (intentional — different diagrams).
