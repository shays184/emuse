import { useEffect } from "react";
import type { Instrument } from "../hooks/useNavigation";

interface InstrumentPageProps {
  mood: string;
  onSelect: (instrument: Instrument) => void;
  onBack: () => void;
  preferredInstrument?: Instrument | null;
  fromLanding?: boolean;
}

const INSTRUMENTS: { id: Instrument; label: string; emoji: string }[] = [
  { id: "guitar", label: "Guitar", emoji: "🎸" },
  { id: "piano", label: "Piano", emoji: "🎹" },
];

export function InstrumentPage({
  mood,
  onSelect,
  onBack,
  preferredInstrument,
  fromLanding,
}: InstrumentPageProps) {
  useEffect(() => {
    if (fromLanding && preferredInstrument) {
      onSelect(preferredInstrument);
    }
  }, [fromLanding, preferredInstrument, onSelect]);

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pt-16">
      <button
        onClick={onBack}
        className="mb-8 cursor-pointer self-start rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary-light transition-colors hover:text-text-light dark:text-text-secondary-dark dark:hover:text-text-dark"
      >
        ← Back
      </button>

      <h2 className="mb-2 text-3xl font-bold text-text-light dark:text-text-dark">
        {mood}
      </h2>
      <p className="mb-10 text-text-secondary-light dark:text-text-secondary-dark">
        Choose your instrument
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        {INSTRUMENTS.map((inst) => (
          <button
            key={inst.id}
            onClick={() => onSelect(inst.id)}
            className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl bg-surface-light px-10 py-8 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 dark:bg-surface-dark"
          >
            <span className="text-5xl">{inst.emoji}</span>
            <span className="text-lg font-semibold text-text-light dark:text-text-dark">
              {inst.label}
            </span>
          </button>
        ))}
      </div>
    </main>
  );
}
