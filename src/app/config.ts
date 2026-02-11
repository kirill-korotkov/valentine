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

  // Фотографии (путь зависит от base — работает и в Docker, и на GitHub Pages)
  startPhotos: [
    `${import.meta.env.BASE_URL}photos/photo-1.png`,
    `${import.meta.env.BASE_URL}photos/photo-2.png`,
    `${import.meta.env.BASE_URL}photos/photo-3.png`,
    `${import.meta.env.BASE_URL}photos/photo-4.png`,
    `${import.meta.env.BASE_URL}photos/photo-5.png`,
    `${import.meta.env.BASE_URL}photos/photo-6.png`,
    `${import.meta.env.BASE_URL}photos/apple-face.png`,
  ],
  finalPhoto: `${import.meta.env.BASE_URL}photos/photo-5.png`,

  // Настройки таймингов (в миллисекундах)
  timings: {
    photoAutoAdvance: 4000, // автопереход между фото
    sarcasticScreenDuration: 2000, // длительность показа "Ага, конечно..."
    transitionDuration: 500, // длительность переходов между экранами
  },
};