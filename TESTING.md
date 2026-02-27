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
5. Click a progression → expands to show key, scale, chord count, level, individual chord badges, and "Why it works" theory section
6. Click it again → collapses
7. Click back button on progressions → return to Instrument selection
8. Click "Surprise me" on Landing → confirm it picks a random mood and goes to instrument selection
9. Navigate back to Landing → pick a different mood → confirm different progressions appear
