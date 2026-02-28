# eMuse — Implementation Plan

Refer to `spec.md` for full requirements, architecture, and data shape.

## Open Questions

- Which LLM provider for the free text path? Spec says OpenAI or equivalent — defaulting to OpenAI unless told otherwise.
- Hosting: Vercel or Netlify? Defaulting to Vercel (good React/serverless support).
- Deployment: not included in this plan. Ship locally first, deploy separately.

## Tasks

### Phase 0: Project Setup
☐ Scaffold React + TypeScript + Tailwind project (Vite)
☐ Create `.gitignore` (node_modules/, dist/, .env)
☐ Set up project folder structure
☐ Verify the app runs locally with a hello world page

### Phase 1: Core Static Flow (Mood → Instrument → Progressions)
☐ Create the static mood-progression JSON dataset using an LLM: 6 moods (Happy, Sad, Calm, Energetic, Melancholy, Romantic), 5 progressions per complexity level (1=beginner, 2=intermediate, 3=advanced) = 15 per mood, 90 total. Each progression includes chords, key, scale, complexity (1-3), and theory explanation.
☐ Build the Landing screen — welcome headline, 6 mood tiles (above), free text input below the tiles (UI only, no AI wiring yet), "Surprise me" button — all on one screen
☐ Build the Instrument Selection screen — Guitar / Piano choice, with back button to Landing
☐ Build the Progressions screen — list sorted by complexity, expandable cards showing key, scale, theory, with back button to Instrument
☐ Use state-based navigation (no React Router) — simple component swapping via a navigation state hook
☐ Verify full flow works end to end

### Phase 2: Progressions Enhancements
☑ Add complexity filter (beginner / intermediate / advanced)
☑ Compile list of all unique chords used across the dataset (46 unique chords)
☑ Build SVG chord diagram components (guitar fretboard + piano keyboard) with fingering data in `src/data/chordData.ts` — replaced static images approach with code-rendered SVGs (no copyright issues, scales perfectly, easy to style)
☑ Add hover-to-preview on chord names — hovering a chord in a progression shows the diagram as a tooltip/popover. Complex chords have multiple voicings with arrow navigation.

### Phase 3: Favorites
☑ Add "Save to favorites" heart toggle on each progression card
☑ Implement localStorage persistence for favorites (`useFavorites` hook)
☑ Build Favorites overlay (slide-in panel with expandable cards, chord diagram tooltips, mood/instrument color tags)
☑ Handle empty state (no favorites yet)
☑ Fixed-position tooltips to avoid clipping inside overlay scroll container

### Phase 4: Free Text AI Path
☑ Create `.env` with LLM API key (server-side only, already in `.gitignore`)
☑ Create serverless function endpoint (`api/generate-progressions.ts`) + Vite dev plugin for local API handling
☑ Integrate LLM API (OpenAI gpt-4o-mini) — send mood text, receive 3-5 progressions
☑ Wire the free text input on Landing screen — skips instrument selection, goes straight to Progressions
☑ Display AI-generated progressions on the Progressions screen (minimal: just chords + key, no complexity sort, no theory, no chord hover)
☑ Add loading state (spinner on submit button) while waiting for LLM response
☑ Add error handling (API failure, rate limit, empty response, invalid JSON)
⚠ Not yet verified end-to-end (OpenAI API quota limit — needs funded account)

### Phase 5: Security & Polish
☐ Add rate limiting to the free text endpoint
☐ Sanitize free text input before passing to LLM
☐ Responsive layout pass — verify nothing breaks on small screens
☐ Basic accessibility pass (keyboard navigation, semantic HTML)

---

## Phase 0: Project Setup

**Affected Files:**
- `package.json` (new) — project dependencies
- `tsconfig.json` (new) — TypeScript config
- `vite.config.ts` (new) — Vite config
- `tailwind.config.js` (new) — Tailwind config
- `.gitignore` (new) — exclude node_modules/, dist/, .env
- `index.html` (new) — entry HTML
- `src/main.tsx` (new) — React entry point
- `src/App.tsx` (new) — root component
- `src/index.css` (new) — Tailwind imports

**Goal:** A running React + TypeScript + Tailwind project scaffolded with Vite. Clean folder structure ready for feature work.

**Done means:** `npm run dev` serves a page in the browser with Tailwind styles working.

**Test it:**
1. Run `npm run dev`
2. Open the browser — see a styled hello world page
3. Confirm hot reload works by changing text

---

## Phase 1: Core Static Flow

**Affected Files:**
- `src/data/progressions.json` (new) — static mood-progression dataset (6 moods × 15 progressions = 90 total)
- `src/pages/LandingPage.tsx` (new) — mood selection with welcome headline, 6 mood tiles (above), free text input (below, inactive), "Surprise me" button
- `src/pages/InstrumentPage.tsx` (new) — guitar/piano selection with back button
- `src/pages/ProgressionsPage.tsx` (new) — progression list with expandable theory cards, back button
- `src/components/MoodTile.tsx` (new) — individual mood tile component
- `src/components/ProgressionCard.tsx` (new) — expandable progression card
- `src/hooks/useNavigation.ts` (new) — state-based navigation logic (no React Router)
- `src/App.tsx` — integrate navigation state, render pages based on current screen

**Goal:** The complete static flow works end to end. User picks a mood, picks an instrument, sees chord progressions with key, scale, and theory. This is the core value loop. Navigation is state-based — no React Router.

**Done means:** Click any mood tile → choose guitar or piano → see a list of progressions sorted by complexity. Expand any progression to see key, scale, and theory explanation. "Surprise me" picks a random mood. Back buttons work on every screen.

**Test it:**
1. Open the app — see "eMuse" headline, tagline, 6 mood tiles, free text input (inactive), and "Surprise me" button
2. Click "Melancholy" → see instrument selection (Guitar / Piano)
3. Click back button on instrument screen → return to Landing
4. Click "Melancholy" again → click "Guitar" → see progressions sorted by complexity
5. Expand a progression → see key, scale, theory text
6. Click back button on progressions screen → return to Instrument selection
7. Click "Surprise me" on landing → confirm it picks a random mood and proceeds
8. Navigate back to landing and pick a different mood — confirm different progressions appear

---

## Phase 2: Progressions Enhancements

**Affected Files:**
- `src/pages/ProgressionsPage.tsx` — add complexity filter, pass instrument prop
- `src/components/ComplexityFilter.tsx` (new) — pill-style filter control (Beginner / Intermediate / Advanced / All)
- `src/components/ChordTooltip.tsx` (new) — hover-to-preview tooltip wrapping chord names, shows SVG diagram
- `src/components/GuitarDiagram.tsx` (new) — SVG fretboard diagram (fret dots, open/muted strings, barre chords)
- `src/components/PianoDiagram.tsx` (new) — SVG piano keyboard diagram (highlighted keys with note names)
- `src/data/chordData.ts` (new) — chord fingering data for 46 unique chords (guitar frets + piano notes), supports multiple voicings per chord
- `src/components/ProgressionCard.tsx` — make chord names hoverable, integrate tooltip, simplified expanded view (scale + theory only)

**Goal:** Progressions screen gets richer — users can filter by skill level and see chord diagrams on hover. Each chord name in a progression is hoverable, showing a code-rendered SVG diagram as a tooltip.

**Done means:** Complexity filter narrows the progression list. Hovering any chord name shows the correct SVG chord diagram (fretboard for guitar, keyboard for piano). Guitar chords with multiple voicings show arrow navigation. Piano diagrams display note names on keys. Tooltip disappears on mouse-out.

**Test it:**
1. Navigate to progressions → select "Beginner" filter → only beginner progressions appear
2. Switch to "Advanced" → list updates accordingly
3. With Guitar selected → hover a chord name (e.g., "Am") → see SVG fretboard diagram in tooltip
4. For complex chords (e.g., Cmaj7) → see left/right arrows to cycle voicings
5. Move mouse away → tooltip disappears
6. Go back, select Piano → hover a chord name → see keyboard diagram with note names on keys

---

## Phase 3: Favorites

**Affected Files:**
- `src/hooks/useFavorites.ts` (new) — localStorage read/write with add/remove/toggle/isFavorite. Each favorite stores mood, instrument, chords, key, scale, complexity, theory, timestamp.
- `src/components/ProgressionCard.tsx` — replaced index number with heart toggle button (♡/♥)
- `src/components/FavoritesOverlay.tsx` (new) — slide-in panel with expandable favorite cards, chord diagram tooltips (via ChordTooltip), mood-colored + instrument-colored tags, empty state
- `src/components/ChordTooltip.tsx` — switched from absolute to fixed positioning to avoid clipping in scroll containers
- `src/pages/ProgressionsPage.tsx` — receives isFavorite/onToggleFavorite from App
- `src/App.tsx` — owns favorites state, renders floating heart button with badge + overlay
- `src/test/setup.ts` — added localStorage polyfill for test environment

**Goal:** Users can save progressions they like and access them from anywhere in the app. Favorites persist across sessions via localStorage.

**Done means:** Save a progression → it appears in the Favorites overlay. Close and reopen the browser → favorites are still there. Remove a favorite → it disappears. Favorite cards are expandable with theory and chord diagram tooltips.

**Test it:**
1. Navigate to progressions → tap the heart on a progression → heart fills red
2. Click the floating ♥ button (bottom-right) → Favorites overlay slides in → see the saved progression with mood/instrument tags
3. Save a second progression → both appear in favorites with badge count updating
4. Tap the red heart on a favorite → it's removed
5. Refresh the browser → favorites persist
6. Open favorites with nothing saved → see "No favorites yet" empty state
7. Click a favorite card → expands to show scale and theory
8. Hover a chord name in favorites → see chord diagram tooltip (not clipped)

---

## Phase 4: Free Text AI Path

**Affected Files:**
- `.env` (new) — LLM API key (server-side only, NEVER commit)
- `.env.example` (new) — template for `.env`
- `api/generate-progressions.ts` (new) — Vercel serverless function (OpenAI gpt-4o-mini, input validation, JSON parsing, error handling)
- `src/services/api.ts` (new) — client-side `generateProgressions()` fetch wrapper
- `src/hooks/useNavigation.ts` — added `isFreeText`, `aiProgressions` state, `goToFreeTextResults()` method
- `src/pages/LandingPage.tsx` — enabled free text input with submit button, spinner, error display, Enter key support
- `src/pages/ProgressionsPage.tsx` — dual mode: static (existing) vs free text (minimal cards with chords + key only)
- `src/App.tsx` — wires `onFreeTextResults` to LandingPage, passes free text state to ProgressionsPage
- `vite.config.ts` — added `apiDevPlugin()` that handles `/api/generate-progressions` during dev (no Vercel CLI needed)
- `package.json` — added `openai` dependency, `dotenv` dev dependency

**Local dev:** `npm run dev` handles both frontend and API via a Vite dev plugin. No Vercel CLI needed. Requires `.env` with `OPENAI_API_KEY`.

**Goal:** The free text mood path works. User types a mood description, the app calls the LLM, and returns matching progressions.

**Status:** Implemented but not verified end-to-end due to OpenAI API quota limits. Needs a funded OpenAI account to test.

**Test it (when API key is funded):**
1. Type a mood description in the free text input → click → or press Enter
2. See a spinner on the submit button
3. See progressions appear (just chords + key, no complexity filter or theory)
4. Try with different mood descriptions → get different results
5. Click ← Back → return to Landing
6. Try with empty input → submit button is disabled
7. Disconnect network / simulate API failure → see an error message below the input
8. Verify the LLM API key is not visible in browser dev tools (network tab)

---

## Phase 5: Security & Polish

**Affected Files:**
- `api/generate-progressions.ts` — add rate limiting, input sanitization
- `src/` (various) — responsive layout fixes, semantic HTML, keyboard navigation

**Goal:** The app is secure, accessible, and doesn't break on small screens. Ready for real users.

**Done means:** Free text endpoint rejects excessive requests. All screens render correctly on a narrow viewport. Basic keyboard navigation works.

**Test it:**
1. Submit free text rapidly many times → rate limit kicks in with a user-friendly message
2. Submit free text with script tags or special characters → confirm input is sanitized
3. Resize browser to phone width → all three screens render without overflow or broken layout
4. Tab through the app using keyboard only → all interactive elements are reachable
