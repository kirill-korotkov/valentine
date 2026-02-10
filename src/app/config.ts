// Конфигурация приложения "Валентинка"

export const config = {
  // Тексты
  texts: {
    question: "Будешь моей валентинкой?",
    buttonYes: "Да",
    buttonNo: "Нет",
    sarcastic: "Ага, конечно…",
    finalTitle: "Ты моя валентинка!",
    finalMessage: "Я так рад, что ты согласилась. Ты делаешь каждый мой день особенным!",
    finalDate: "14 февраля 2026",
    finalSignature: "С любовью",
    buttonAgain: "Ещё раз",
  },

  // Фотографии для стартового экрана
  startPhotos: [
    "https://images.unsplash.com/photo-1769674843865-c0cdaa8c5bab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGxhdWdoaW5nJTIwc3Vuc2V0fGVufDF8fHx8MTc3MDY2OTEwNHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGNvdXBsZSUyMG91dGRvb3JzJTIwZGF0ZXxlbnwxfHx8fDE3NzA2NjkxMDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1592402461053-055a43f430e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHMlMjB2YWxlbnRpbmV8ZW58MXx8fHwxNzcwNjM5MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ],

  // Финальное фото
  finalPhoto: "https://images.unsplash.com/photo-1514846528774-8de9d4a07023?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGVtYnJhY2UlMjBsb3ZlfGVufDF8fHx8MTc3MDU4NDg0N3ww&ixlib=rb-4.1.0&q=80&w=1080",

  // Настройки таймингов (в миллисекундах)
  timings: {
    photoAutoAdvance: 4000, // автопереход между фото
    sarcasticScreenDuration: 2000, // длительность показа "Ага, конечно..."
    transitionDuration: 500, // длительность переходов между экранами
  },
};
