// Конфигурация приложения "Валентинка"

export const config = {
  // Тексты
  texts: {
    question: "Будешь моей валентинкой?",
    buttonYes: "Да",
    buttonNo: "Нет",
    sarcastic: "Ага, конечно…",
    finalTitle: "Ты моя валентинка!",
    finalMessage:
      "Я так рад, что ты согласилась. Ты делаешь каждый мой день особенным!",
    finalDate: "14 февраля 2026",
    finalSignature: "С любовью, Кирилл",
    buttonAgain: "Ещё раз",
  },

  // Фотографии для стартового экрана (твои локальные фото из public/photos)
  startPhotos: [
    "/valentine/photos/photo-1.png",
    "/valentine/photos/photo-2.png",
    "/valentine/photos/photo-3.png",
    "/valentine/photos/photo-4.png",
    "/valentine/photos/photo-5.png",
    "/valentine/photos/photo-6.png",
    "/valentine/photos/apple-face.png",
  ],

  // Финальное фото — самое трогательное :)
  finalPhoto: "/valentine/photos/photo-5.png",

  // Настройки таймингов (в миллисекундах)
  timings: {
    photoAutoAdvance: 4000, // автопереход между фото
    sarcasticScreenDuration: 2000, // длительность показа "Ага, конечно..."
    transitionDuration: 500, // длительность переходов между экранами
  },
};