import { useState, useCallback } from "react";
import type { AIProgression } from "../services/api";

export type Screen =
  | "landing"
  | "instrument"
  | "progressions"
  | "signIn"
  | "signUp"
  | "profile";

export type Instrument = "guitar" | "piano";

export interface NavigationState {
  screen: Screen;
  selectedMood: string | null;
  selectedInstrument: Instrument | null;
  isFreeText: boolean;
  aiProgressions: AIProgression[] | null;
  fromLanding: boolean;
}

const INITIAL_STATE: NavigationState = {
  screen: "landing",
  selectedMood: null,
  selectedInstrument: null,
  isFreeText: false,
  aiProgressions: null,
  fromLanding: false,
};

export function useNavigation() {
  const [state, setState] = useState<NavigationState>(INITIAL_STATE);

  const goToInstrument = useCallback((mood: string) => {
    setState({
      screen: "instrument",
      selectedMood: mood,
      selectedInstrument: null,
      isFreeText: false,
      aiProgressions: null,
      fromLanding: true,
    });
  }, []);

  const goToProgressionsFromMood = useCallback(
    (mood: string, instrument: Instrument) => {
      setState({
        screen: "progressions",
        selectedMood: mood,
        selectedInstrument: instrument,
        isFreeText: false,
        aiProgressions: null,
        fromLanding: false,
      });
    },
    [],
  );

  const goToProgressions = useCallback((instrument: Instrument) => {
    setState((prev) => ({
      ...prev,
      screen: "progressions",
      selectedInstrument: instrument,
      fromLanding: false,
    }));
  }, []);

  const setInstrument = useCallback((instrument: Instrument) => {
    setState((prev) =>
      prev.screen === "progressions"
        ? { ...prev, selectedInstrument: instrument }
        : prev,
    );
  }, []);

  const goToFreeTextResults = useCallback(
    (mood: string, progressions: AIProgression[]) => {
      setState({
        screen: "progressions",
        selectedMood: mood,
        selectedInstrument: null,
        isFreeText: true,
        aiProgressions: progressions,
        fromLanding: false,
      });
    },
    [],
  );

  const goBack = useCallback(() => {
    setState((prev) => {
      if (
        prev.screen === "signIn" ||
        prev.screen === "signUp" ||
        prev.screen === "profile"
      ) {
        return INITIAL_STATE;
      }
      if (prev.screen === "progressions" && prev.isFreeText) {
        return INITIAL_STATE;
      }
      if (prev.screen === "progressions") {
        return INITIAL_STATE;
      }
      return INITIAL_STATE;
    });
  }, []);

  const goHome = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const goToSignIn = useCallback(() => {
    setState({ ...INITIAL_STATE, screen: "signIn" });
  }, []);

  const goToSignUp = useCallback(() => {
    setState({ ...INITIAL_STATE, screen: "signUp" });
  }, []);

  const goToProfile = useCallback(() => {
    setState({ ...INITIAL_STATE, screen: "profile" });
  }, []);

  return {
    ...state,
    goToInstrument,
    goToProgressionsFromMood,
    goToProgressions,
    setInstrument,
    goToFreeTextResults,
    goBack,
    goHome,
    goToSignIn,
    goToSignUp,
    goToProfile,
  };
}
