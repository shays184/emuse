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
