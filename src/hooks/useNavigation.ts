import { useState, useCallback } from "react";

export type Screen = "landing" | "instrument" | "progressions";

export type Instrument = "guitar" | "piano";

export interface NavigationState {
  screen: Screen;
  selectedMood: string | null;
  selectedInstrument: Instrument | null;
}

const INITIAL_STATE: NavigationState = {
  screen: "landing",
  selectedMood: null,
  selectedInstrument: null,
};

export function useNavigation() {
  const [state, setState] = useState<NavigationState>(INITIAL_STATE);

  const goToInstrument = useCallback((mood: string) => {
    setState({
      screen: "instrument",
      selectedMood: mood,
      selectedInstrument: null,
    });
  }, []);

  const goToProgressions = useCallback((instrument: Instrument) => {
    setState((prev) => ({
      ...prev,
      screen: "progressions",
      selectedInstrument: instrument,
    }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.screen === "progressions") {
        return { ...prev, screen: "instrument", selectedInstrument: null };
      }
      return INITIAL_STATE;
    });
  }, []);

  const goHome = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return { ...state, goToInstrument, goToProgressions, goBack, goHome };
}
