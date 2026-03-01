# TESTING.md — eMuse

Manual QA procedures for each feature. Updated as phases are completed.

## Automated Tests

```bash
npm test
```

## Manual QA

### Phase 1: Core Static Flow

1. Open the app → see "eMuse" headline, tagline, 6 mood tiles, disabled free text input, and "Surprise me" button
2. Click "Melancholy" → see instrument selection (Guitar / Piano) with back button
3. Click back button → return to Landing
4. Click "Melancholy" again → click "Guitar" → see 15 progressions sorted by complexity (Beginner → Intermediate → Advanced)
5. Click a progression → expands to show scale and "Why it works" theory section
6. Click it again → collapses
7. Click back button on progressions → return to Instrument selection
8. Click "Surprise me" on Landing → confirm it picks a random mood and goes to instrument selection
9. Navigate back to Landing → pick a different mood → confirm different progressions appear

### Phase 2: Complexity Filter & Chord Diagrams

**Complexity Filter:**
1. Navigate to a progressions list → see filter pills at the top (All / Beginner / Intermediate / Advanced)
2. Select "Beginner" → only beginner progressions appear
3. Select "Advanced" → list updates to show only advanced progressions
4. Select "All" → full list restored

**Guitar Chord Diagrams:**
5. Select Guitar as instrument → hover a chord name (e.g., "Am") → see fretboard diagram in tooltip
6. Diagram shows fret numbers, dot positions, open strings (o), muted strings (x)
7. Hover a complex chord (e.g., "Cmaj7") → see left/right arrows to cycle through voicings
8. Click arrows → diagram updates to show different fingering
9. Move mouse away → tooltip disappears

**Piano Chord Diagrams:**
10. Go back → select Piano → hover a chord name → see keyboard diagram in tooltip
11. Highlighted keys show note names (e.g., C, E, G)
12. Move mouse away → tooltip disappears

**Cross-checks:**
13. Verify chord diagrams match the selected instrument (fretboard for guitar, keyboard for piano)
14. Verify complexity filter persists while browsing and expanding cards
15. Verify tooltips don't clip or get cut off by card boundaries

### Phase 3: Favorites

**Saving & Removing:**
1. Navigate to progressions → tap the heart (♡) on a progression → heart fills red (♥)
2. Tap the same heart again → unfilled, removed from favorites
3. Save multiple progressions from different moods and instruments

**Favorites Overlay:**
4. Click the floating ♥ button (bottom-right corner) → overlay slides in from the right
5. See saved progressions with color-coded mood tags (Happy=amber, Sad=blue, Calm=teal, Energetic=red, Melancholy=purple, Romantic=pink)
6. Instrument tags use distinct colors (Guitar=orange, Piano=sky blue)
7. Badge on the floating button shows the correct favorite count
8. Click backdrop or ✕ → overlay closes

**Expandable Details in Favorites:**
9. Click a favorite card → expands to show Scale and "Why it works" theory
10. Click again → collapses

**Chord Diagrams in Favorites:**
11. Hover a chord name in a favorite → tooltip appears with correct diagram (fretboard/keyboard)
12. Tooltip for the first chord should not overflow the panel (uses fixed positioning)
13. Complex chords show voicing navigation arrows

**Persistence:**
14. Save some favorites → refresh the browser → favorites are still there
15. Remove all favorites → see "No favorites yet" empty state with ♡ icon

**Cross-checks:**
16. Verify favorites from Guitar mood show fretboard diagrams, Piano show keyboard diagrams
17. Verify the floating ♥ button is visible on all screens (Landing, Instrument, Progressions)

### Phase 4: Free Text AI Path

> **Note:** Requires a funded OpenAI API key in `.env`. Not yet verified end-to-end due to quota limits.

**Input & Submit:**
1. See the free text input on Landing (no longer disabled/"Coming soon")
2. Type a mood description (e.g., "nostalgic but hopeful, like driving home at sunset")
3. Click the → button → see spinner while waiting for AI response
4. Press Enter with text typed → same behavior as clicking →
5. Try submitting with empty input → button is disabled

**AI Results:**
6. See progressions page with quoted mood as title, "AI-generated" subtitle
7. Each card shows chords (e.g., Am → F → C → G) and key — no complexity filter, no theory
8. Click ← Back → return to Landing

**Error Handling:**
9. Remove API key from `.env` → submit → see "OPENAI_API_KEY not set" error
10. Use an invalid API key → see "Incorrect API key" error
11. Exceed quota → see "Rate limit exceeded" or quota error

**Cross-checks:**
12. Static mood tile path still works unchanged (no API key needed)
13. Free text path skips instrument selection entirely
14. API key is not visible in browser dev tools Network tab

### Phase 5: Security & Polish

**Rate Limiting:**
1. Submit free text rapidly 11+ times within a minute → see "Too many requests" error on the 11th
2. Wait a minute → requests work again

**Input Sanitization:**
3. Submit text with HTML tags (e.g., `<script>alert('x')</script>happy`) → tags are stripped, mood still works
4. Submit text with special characters → filtered safely

**Responsive Layout:**
5. Resize browser to phone width (~375px) → Landing page shows 2-column mood grid
6. Instrument page → buttons stack vertically
7. Progressions page → cards render without horizontal overflow
8. Open favorites overlay → takes full screen width on mobile

**Accessibility:**
9. Press Escape while favorites overlay is open → overlay closes
10. Tab through Landing page → all mood tiles, text input, submit button, and Surprise me are reachable
11. Tab through Progressions page → back button, filter pills, and progression cards are reachable
12. Inspect HTML → pages use `<main>`, `<nav>`, `<section>`, `<article>` elements
13. Favorites overlay has `role="dialog"` and `aria-label`

### Theme Toggle (Cosmetic)

**Cycling modes:**
1. See the theme toggle button in the bottom-left corner (🌙 icon by default)
2. Click it → switches to Light mode (☀️ icon), page background becomes warm off-white, text becomes dark
3. Click again → switches to Mood mode (🎨 icon), background changes to a soft pastel gradient based on the selected mood
4. Click again → returns to Dark mode (🌙 icon)

**Mood-based backgrounds (in Mood mode):**
5. Select "Happy" → soft amber/gold gradient with dark text
6. Select "Sad" → deep navy gradient with light text
7. Select "Calm" → pale mint/teal gradient with dark text
8. Select "Energetic" → light blush/coral gradient with dark text
9. Select "Melancholy" → muted deep plum gradient with light text
10. Select "Romantic" → pastel pink/rose gradient with dark text
11. Navigate back to Landing (no mood selected) → Mood mode shows default dark background

**Persistence:**
12. Set theme to Light → refresh the browser → still in Light mode
13. Set theme to Mood → refresh → still in Mood mode

**Smooth transition:**
14. Switch modes → background color transitions smoothly (0.6s ease)

### Phase 5.1: Audio Preview & Songs Like This

**Audio Playback (Progressions Page):**
1. Navigate to progressions → see a ▶ play button below the heart on each card
2. Click ▶ → hear the chords play in sequence (triangle wave synth, ~0.75s per chord)
3. While playing, the currently sounding chord name is highlighted with a purple background
4. The ▶ changes to ⏹ while playing → click ⏹ to stop early
5. Play a different progression while one is playing → first stops automatically
6. Playback finishes → button reverts to ▶, highlight disappears

**Audio Playback (Favorites Overlay):**
7. Open favorites → see ▶ button next to the ♥ remove button on each card
8. Click ▶ → same playback behavior as main page (chords play, active chord highlighted)

**Songs Like This (Progressions Page):**
9. Navigate to progressions → expand a card (e.g., C → G → Am → F in Happy)
10. Below "Why it works", see "Songs like this" section with amber accent
11. Each entry shows song title (bold) and artist
12. Example: C → G → Am → F should show "Let It Be", "No Woman No Cry", etc.
13. Not all progressions match — some cards won't show the "Songs like this" section

**Songs Like This (Favorites Overlay):**
14. Open favorites → expand a card → see "Songs like this" if pattern matches
15. Same song data as the main progressions page

### Phase 5.2: Favorites Filters

1. Open favorites with several saved progressions → see 3 dropdown selects at the top (mood, instrument, level)
2. All dropdowns default to "All" (no filter)
3. Select "Happy" from mood dropdown → only Happy favorites shown
4. Select "Guitar" from instrument dropdown → narrows further to Happy + Guitar
5. Select "Beginner" from level dropdown → narrows further to Happy + Guitar + Beginner
6. Change mood back to "All moods" → shows all Guitar + Beginner favorites
7. If no favorites match the active filters → see "No favorites match the current filters" message
8. Dropdowns are hidden when there are no favorites at all
9. Filters do not persist across overlay open/close (reset each time)

### Phase 6: User Profiles

**Setup:** Create a Supabase project, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`, run `supabase/schema.sql` in the SQL Editor.

**Sign Up:**
1. Click profile icon (top-right) when not logged in → Sign in page
2. Click "Sign up" link → Sign up page with tagline "Save your favorites across devices..."
3. Enter username, email, password → Sign up
4. See "Check your email to confirm" message
5. (With email confirmation disabled in Supabase) Sign in with same credentials

**Sign In:**
6. From Sign up page, click "Sign in" → Sign in page
7. Enter email and password → Sign in → returns to landing
8. Profile icon changes to user icon when logged in

**Profile:**
9. Click profile icon when logged in → Profile page
10. See avatar (initials), display name input, email
11. Change display name → blur → saves to Supabase
12. Change default instrument (Guitar/Piano) → saves immediately
13. Change theme (Dark/Light/Mood) → saves immediately
14. Sign out → returns to landing, profile icon shows lock again

**Cloud Favorites:**
15. Log in → add a favorite → sign out → sign in again → favorite still there
16. Favorites from different devices sync when same account

**Recently viewed (when logged in):**
17. Click clock icon (bottom-right, left of favorites) → overlay with recently viewed progressions
18. Each item shows chords, play button, expandable scale/theory/songs
