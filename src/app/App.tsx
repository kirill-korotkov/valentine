import { useState } from "react";
import { PhotosScreen } from "./components/PhotosScreen";
import { QuestionScreen } from "./components/QuestionScreen";
import { SarcasticScreen } from "./components/SarcasticScreen";
import { FinalScreen } from "./components/FinalScreen";

// Типы состояний приложения
type AppState = "photos" | "question" | "sarcastic" | "final";

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>("photos");

  // Переход к экрану с вопросом
  const handlePhotosComplete = () => {
    setCurrentState("question");
  };

  // Обработка нажатия "Да"
  const handleYes = () => {
    setCurrentState("final");
  };

  // Обработка нажатия "Нет"
  const handleNo = () => {
    setCurrentState("sarcastic");
  };

  // Возврат к вопросу после саркастического экрана
  const handleSarcasticComplete = () => {
    setCurrentState("question");
  };

  // Перезапуск приложения
  const handleRestart = () => {
    setCurrentState("photos");
  };

  return (
    <div className="size-full">
      {currentState === "photos" && (
        <PhotosScreen onComplete={handlePhotosComplete} />
      )}

      {currentState === "question" && (
        <QuestionScreen onYes={handleYes} onNo={handleNo} />
      )}

      {currentState === "sarcastic" && (
        <SarcasticScreen onComplete={handleSarcasticComplete} />
      )}

      {currentState === "final" && <FinalScreen onRestart={handleRestart} />}
    </div>
  );
}
