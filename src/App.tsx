import { useState, useEffect } from "react";
import { useNavigation } from "./hooks/useNavigation";
import { useFavorites } from "./hooks/useFavorites";
import { useTheme } from "./hooks/useTheme";
import { LandingPage } from "./pages/LandingPage";
import { InstrumentPage } from "./pages/InstrumentPage";
import { ProgressionsPage } from "./pages/ProgressionsPage";
import { FavoritesOverlay } from "./components/FavoritesOverlay";
import { ThemeToggle } from "./components/ThemeToggle";

function App() {
  const nav = useNavigation();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } =
    useFavorites();
  const { mode, cycleTheme, setActiveMood } = useTheme();
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    setActiveMood(nav.selectedMood);
  }, [nav.selectedMood, setActiveMood]);

  let page;
  switch (nav.screen) {
    case "instrument":
      page = (
        <InstrumentPage
          mood={nav.selectedMood!}
          onSelect={nav.goToProgressions}
          onBack={nav.goBack}
        />
      );
      break;
    case "progressions":
      page = (
        <ProgressionsPage
          mood={nav.selectedMood!}
          instrument={nav.selectedInstrument}
          onBack={nav.goBack}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isFreeText={nav.isFreeText}
          aiProgressions={nav.aiProgressions}
        />
      );
      break;
    default:
      page = (
        <LandingPage
          onMoodSelect={nav.goToInstrument}
          onFreeTextResults={nav.goToFreeTextResults}
        />
      );
  }

  return (
    <>
      {page}

      <button
        onClick={() => setShowFavorites(true)}
        aria-label="Open favorites"
        className="fixed right-6 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-primary-light dark:text-bg-dark"
      >
        <span className="text-xl">♥</span>
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {favorites.length}
          </span>
        )}
      </button>

      <ThemeToggle mode={mode} onToggle={cycleTheme} />

      {showFavorites && (
        <FavoritesOverlay
          favorites={favorites}
          onRemove={removeFavorite}
          onClose={() => setShowFavorites(false)}
        />
      )}
    </>
  );
}

export default App;
