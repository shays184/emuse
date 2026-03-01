import { useState, useEffect } from "react";
import { useNavigation } from "./hooks/useNavigation";
import { useFavorites } from "./hooks/useFavorites";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "./contexts/AuthContext";
import { LandingPage } from "./pages/LandingPage";
import { ProgressionsPage } from "./pages/ProgressionsPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { ProfilePage } from "./pages/ProfilePage";
import { FavoritesOverlay } from "./components/FavoritesOverlay";
import { RecentlyViewedOverlay } from "./components/RecentlyViewedOverlay";
import { ThemeToggle } from "./components/ThemeToggle";
import { recordRecentlyViewed } from "./services/recentlyViewed";
import { supabase } from "./lib/supabase";

function App() {
  const nav = useNavigation();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } =
    useFavorites();
  const { mode, setMode, cycleTheme, setActiveMood } = useTheme();
  const { user, profile } = useAuth();
  const [showFavorites, setShowFavorites] = useState(false);
  const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);

  useEffect(() => {
    setActiveMood(nav.selectedMood);
  }, [nav.selectedMood, setActiveMood]);

  useEffect(() => {
    if (profile?.preferred_theme) setMode(profile.preferred_theme);
  }, [profile?.preferred_theme, setMode]);

  const handleCycleTheme = () => {
    cycleTheme();
    if (user && supabase) {
      const next =
        mode === "dark" ? "light" : mode === "light" ? "mood" : "dark";
      supabase
        .from("profiles")
        .update({
          preferred_theme: next,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }
  };

  let page;
  switch (nav.screen) {
    case "signIn":
      page = (
        <SignInPage onBack={nav.goBack} onSwitchToSignUp={nav.goToSignUp} />
      );
      break;
    case "signUp":
      page = (
        <SignUpPage onBack={nav.goBack} onSwitchToSignIn={nav.goToSignIn} />
      );
      break;
    case "profile":
      page = user ? (
        <ProfilePage onBack={nav.goBack} />
      ) : (
        <SignInPage onBack={nav.goBack} onSwitchToSignUp={nav.goToSignUp} />
      );
      break;
    case "progressions":
      page = (
        <ProgressionsPage
          mood={nav.selectedMood!}
          instrument={nav.selectedInstrument}
          onBack={nav.goBack}
          onInstrumentChange={!nav.isFreeText ? nav.setInstrument : undefined}
          onViewProgression={
            user
              ? (p) =>
                  recordRecentlyViewed(user.id, {
                    mood: nav.selectedMood!,
                    instrument: nav.selectedInstrument ?? "guitar",
                    ...p,
                  })
              : undefined
          }
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
          onMoodSelect={(mood) =>
            nav.goToProgressionsFromMood(
              mood,
              profile?.preferred_instrument ?? "guitar",
            )
          }
          onFreeTextResults={nav.goToFreeTextResults}
        />
      );
  }

  const handleProfileClick = () => {
    if (user) nav.goToProfile();
    else nav.goToSignIn();
  };

  return (
    <>
      {page}

      <button
        onClick={handleProfileClick}
        aria-label={user ? "Profile" : "Sign in"}
        className="fixed right-6 top-6 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface-light text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-surface-dark"
      >
        {user ? "👤" : "🔐"}
      </button>

      {user && (
        <button
          onClick={() => setShowRecentlyViewed(true)}
          aria-label="Recently viewed"
          className="fixed right-24 bottom-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-surface-light text-xl shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-surface-dark"
        >
          🕐
        </button>
      )}

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

      <ThemeToggle
        mode={mode}
        onToggle={user ? handleCycleTheme : cycleTheme}
      />

      {showFavorites && (
        <FavoritesOverlay
          favorites={favorites}
          onRemove={removeFavorite}
          onClose={() => setShowFavorites(false)}
          userId={user?.id}
        />
      )}

      {showRecentlyViewed && user && (
        <RecentlyViewedOverlay
          userId={user.id}
          onClose={() => setShowRecentlyViewed(false)}
        />
      )}
    </>
  );
}

export default App;
