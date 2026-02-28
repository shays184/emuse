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
