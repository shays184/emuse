import { PIANO_CHORDS } from "../data/chordData";

const NOTE_SEMITONES: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const C4_FREQ = 261.63;

function noteToFreq(noteName: string): number {
  const semitone = NOTE_SEMITONES[noteName];
  if (semitone === undefined) return 0;
  return C4_FREQ * Math.pow(2, semitone / 12);
}

let audioCtx: AudioContext | null = null;
let currentHandle: { cancel: () => void } | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function schedulePianoChord(
  ctx: AudioContext,
  notes: string[],
  startTime: number,
  duration: number,
): OscillatorNode[] {
  const oscs: OscillatorNode[] = [];
  const perNoteVol = 0.1 / Math.max(notes.length, 1);

  for (const note of notes) {
    const freq = noteToFreq(note);
    if (freq === 0) continue;

    const harmonics = [1, 2, 3, 4];
    const harmonicVols = [1, 0.4, 0.15, 0.06];

    for (let h = 0; h < harmonics.length; h++) {
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      const vol = perNoteVol * harmonicVols[h]!;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(
        Math.max(vol * 0.01, 0.0001),
        startTime + duration,
      );

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * harmonics[h]!, startTime);
      osc.connect(gain);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
      oscs.push(osc);
    }
  }
  return oscs;
}

function scheduleGuitarChord(
  ctx: AudioContext,
  notes: string[],
  startTime: number,
  duration: number,
): OscillatorNode[] {
  const oscs: OscillatorNode[] = [];
  const perNoteVol = 0.1 / Math.max(notes.length, 1);
  const strumSpread = 0.03;

  for (let n = 0; n < notes.length; n++) {
    const freq = noteToFreq(notes[n]!);
    if (freq === 0) continue;

    const strumOffset = n * strumSpread;
    const t = startTime + strumOffset;
    const remaining = duration - strumOffset;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.setValueAtTime(1, t);
    filter.frequency.setValueAtTime(freq * 6, t);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(freq * 1.5, 200),
      t + remaining * 0.7,
    );
    filter.connect(ctx.destination);

    const gain = ctx.createGain();
    gain.connect(filter);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(perNoteVol, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(perNoteVol * 0.02, 0.0001),
      t + remaining,
    );

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t);
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + remaining + 0.02);
    oscs.push(osc);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq, t);
    osc2.connect(gain);
    osc2.start(t);
    osc2.stop(t + remaining + 0.02);
    oscs.push(osc2);
  }
  return oscs;
}

export type Instrument = "guitar" | "piano";

export function playProgression(
  chords: string[],
  instrument: Instrument = "piano",
  onChordChange?: (index: number) => void,
  onComplete?: () => void,
): { cancel: () => void } {
  stopPlayback();

  const ctx = getCtx();
  const chordDur = instrument === "guitar" ? 0.9 : 0.8;
  const gap = 0.1;
  const allOscs: OscillatorNode[] = [];
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  const t0 = ctx.currentTime + 0.05;
  const schedule =
    instrument === "guitar" ? scheduleGuitarChord : schedulePianoChord;

  for (let i = 0; i < chords.length; i++) {
    const chordName = chords[i];
    if (!chordName) continue;
    const pc = PIANO_CHORDS[chordName];
    if (!pc) continue;

    const t = t0 + i * (chordDur + gap);
    allOscs.push(...schedule(ctx, pc.notes, t, chordDur));

    const delay = Math.max(0, (t - ctx.currentTime) * 1000);
    timers.push(
      setTimeout(() => {
        if (!cancelled) onChordChange?.(i);
      }, delay),
    );
  }

  const totalMs =
    (t0 + chords.length * (chordDur + gap) - ctx.currentTime) * 1000 + 150;
  timers.push(
    setTimeout(() => {
      if (!cancelled) {
        currentHandle = null;
        onComplete?.();
      }
    }, totalMs),
  );

  const handle = {
    cancel: () => {
      if (cancelled) return;
      cancelled = true;
      timers.forEach(clearTimeout);
      allOscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* already stopped */
        }
      });
      currentHandle = null;
      onComplete?.();
    },
  };

  currentHandle = handle;
  return handle;
}

export function stopPlayback() {
  currentHandle?.cancel();
}
