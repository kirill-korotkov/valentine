import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { PhotosScreen } from "./components/PhotosScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { SarcasticScreen } from "./components/SarcasticScreen";
import { FinalScreen } from "./components/FinalScreen";
import { MainMenuScreen } from "./components/MainMenuScreen";
import { TogetherCounterScreen } from "./components/TogetherCounterScreen";
import { SectionsCarousel } from "./components/SectionsCarousel";
import { SyncScreen } from "./components/SyncScreen";

type AppState =
  | "photos"
  | "question"
  | "sarcastic"
  | "final"
  | "menu"
  | "sections"
  | "counter"
  | "sync";

type SectionId = "wishes" | "calendar" | "places" | "photos";

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("photos");
  const [initialSection, setInitialSection] = useState<SectionId>("wishes");

  const handlePhotosComplete = () => setCurrentState("question");
  const handleYes = () => setCurrentState("final");
  const handleNo = () => setCurrentState("sarcastic");
  const handleSarcasticComplete = () => setCurrentState("question");
  const handleRestart = () => setCurrentState("photos");
  const handleMenu = () => setCurrentState("menu");
  const handleBackToMenu = () => setCurrentState("menu");

  const handleMenuSelect = (
    section: "photos" | "calendar" | "counter" | "places" | "wishes" | "sync"
  ) => {
    if (section === "counter") {
      setCurrentState("counter");
      return;
    }
    if (section === "sync") {
      setCurrentState("sync");
      return;
    }
    setInitialSection(section);
    setCurrentState("sections");
  };

  return (
    <div className="size-full">
      <AnimatePresence mode="wait">
        {currentState === "photos" && (
          <PhotosScreen key="photos" onComplete={handlePhotosComplete} />
        )}

        {currentState === "question" && (
          <QuestionScreen key="question" onYes={handleYes} onNo={handleNo} />
        )}

        {currentState === "sarcastic" && (
          <SarcasticScreen key="sarcastic" onComplete={handleSarcasticComplete} />
        )}

        {currentState === "final" && (
          <FinalScreen key="final" onRestart={handleRestart} onMenu={handleMenu} />
        )}

        {currentState === "menu" && (
          <MainMenuScreen key="menu" onSelect={handleMenuSelect} />
        )}

        {currentState === "sections" && (
          <SectionsCarousel
            key="sections"
            initialSection={initialSection}
            onBack={handleBackToMenu}
          />
        )}

        {currentState === "counter" && (
          <TogetherCounterScreen key="counter" onBack={handleBackToMenu} />
        )}

        {currentState === "sync" && (
          <SyncScreen key="sync" onBack={handleBackToMenu} />
        )}
      </AnimatePresence>
    </div>
  );
}
