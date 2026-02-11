import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { PhotosScreen } from "./components/PhotosScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { SarcasticScreen } from "./components/SarcasticScreen";
import { FinalScreen } from "./components/FinalScreen";
import { MainMenuScreen } from "./components/MainMenuScreen";
import { TogetherCounterScreen } from "./components/TogetherCounterScreen";
import { PlaceholderScreen } from "./components/PlaceholderScreen";

type AppState =
  | "photos"
  | "question"
  | "sarcastic"
  | "final"
  | "menu"
  | "photos-gallery"
  | "calendar"
  | "counter"
  | "places"
  | "wishes";

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("photos");

  const handlePhotosComplete = () => setCurrentState("question");
  const handleYes = () => setCurrentState("final");
  const handleNo = () => setCurrentState("sarcastic");
  const handleSarcasticComplete = () => setCurrentState("question");
  const handleRestart = () => setCurrentState("photos");
  const handleMenu = () => setCurrentState("menu");
  const handleBackToMenu = () => setCurrentState("menu");

  const handleMenuSelect = (section: "photos" | "calendar" | "counter" | "places" | "wishes") => {
    if (section === "photos") setCurrentState("photos-gallery");
    else if (section === "calendar") setCurrentState("calendar");
    else if (section === "counter") setCurrentState("counter");
    else if (section === "places") setCurrentState("places");
    else if (section === "wishes") setCurrentState("wishes");
  };

  return (
    <div className="size-full">
      <AnimatePresence mode="wait">
        {currentState === "photos" && (
          <PhotosScreen key="photos" onComplete={handlePhotosComplete} />
        )}

        {currentState === "question" && (
          <QuestionScreen
            key="question"
            onYes={handleYes}
            onNo={handleNo}
          />
        )}

        {currentState === "sarcastic" && (
          <SarcasticScreen
            key="sarcastic"
            onComplete={handleSarcasticComplete}
          />
        )}

        {currentState === "final" && (
          <FinalScreen
            key="final"
            onRestart={handleRestart}
            onMenu={handleMenu}
          />
        )}

        {currentState === "menu" && (
          <MainMenuScreen
            key="menu"
            onSelect={handleMenuSelect}
          />
        )}

        {currentState === "counter" && (
          <TogetherCounterScreen
            key="counter"
            onBack={handleBackToMenu}
          />
        )}

        {currentState === "photos-gallery" && (
          <PlaceholderScreen
            key="photos-gallery"
            title="Совместные фото"
            onBack={handleBackToMenu}
          />
        )}

        {currentState === "calendar" && (
          <PlaceholderScreen
            key="calendar"
            title="Календарь дат"
            onBack={handleBackToMenu}
          />
        )}

        {currentState === "places" && (
          <PlaceholderScreen
            key="places"
            title="Наши места"
            onBack={handleBackToMenu}
          />
        )}

        {currentState === "wishes" && (
          <PlaceholderScreen
            key="wishes"
            title="Список желаний"
            onBack={handleBackToMenu}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
