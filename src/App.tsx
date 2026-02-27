import { useNavigation } from "./hooks/useNavigation";
import { LandingPage } from "./pages/LandingPage";
import { InstrumentPage } from "./pages/InstrumentPage";
import { ProgressionsPage } from "./pages/ProgressionsPage";

function App() {
  const nav = useNavigation();

  switch (nav.screen) {
    case "instrument":
      return (
        <InstrumentPage
          mood={nav.selectedMood!}
          onSelect={nav.goToProgressions}
          onBack={nav.goBack}
        />
      );
    case "progressions":
      return (
        <ProgressionsPage
          mood={nav.selectedMood!}
          instrument={nav.selectedInstrument!}
          onBack={nav.goBack}
        />
      );
    default:
      return <LandingPage onMoodSelect={nav.goToInstrument} />;
  }
}

export default App;
