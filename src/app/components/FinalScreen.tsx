import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { config } from "../config";
import { Heart, Sparkles } from "lucide-react";

interface FinalScreenProps {
  onRestart: () => void;
  onMenu: () => void;
}

export function FinalScreen({ onRestart, onMenu }: FinalScreenProps) {
  const confettiTriggered = useRef(false);

  useEffect(() => {
    if (confettiTriggered.current) return;
    confettiTriggered.current = true;

    // Запуск конфетти с более яркими цветами
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ["#EF4444", "#F97316", "#FBBF24", "#F59E0B"],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ["#EF4444", "#F97316", "#FBBF24", "#F59E0B"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Дополнительный взрыв конфетти в центре
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#DC2626", "#EA580C", "#F59E0B", "#FBBF24", "#FCD34D"],
      });
    }, 300);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 overflow-hidden"
    >
      {/* Фон: большое размытое фото + градиент */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={config.finalPhoto}
          alt="Фон финального экрана"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-400/30 to-amber-500/40 backdrop-blur-lg" />
      </div>

      <div className="relative h-screen flex items-center justify-center p-3 md:p-6 overflow-hidden">
        <div className="max-w-4xl w-full flex flex-col items-center justify-center gap-2 md:gap-4 max-h-full py-4">
          {/* Заголовок */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center shrink-0"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4"
            >
              <Heart className="text-red-600 shrink-0 w-7 h-7 md:w-10 md:h-10" fill="currentColor" />
              <h1 className="text-2xl md:text-5xl text-red-600 font-bold">
                {config.texts.finalTitle}
              </h1>
              <Heart className="text-red-600 shrink-0 w-7 h-7 md:w-10 md:h-10" fill="currentColor" />
            </motion.div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 md:px-6 md:py-4 shadow-xl inline-block">
              <p className="text-base md:text-xl text-red-700 max-w-2xl mx-auto leading-relaxed font-medium">
                {config.texts.finalMessage}
              </p>
            </div>
          </motion.div>

          {/* Финальное фото в центре */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="relative w-full max-w-2xl mx-auto shrink-0 rounded-2xl overflow-hidden shadow-2xl bg-white/20"
          >
            <div className="aspect-[4/3] w-full max-w-full max-h-[38vh] md:max-h-[42vh] relative">
              <ImageWithFallback
                src={config.finalPhoto}
                alt="Наше фото"
                className="w-full h-full object-contain"
              />
              {/* Декоративная рамка */}
              <div className="absolute inset-0 border-4 md:border-8 border-white/40 rounded-2xl pointer-events-none"></div>
              
              {/* Блестящая анимация по краям */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    "inset 0 0 20px rgba(251, 191, 36, 0)",
                    "inset 0 0 40px rgba(251, 191, 36, 0.6)",
                    "inset 0 0 20px rgba(251, 191, 36, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Дата и подпись */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center shrink-0"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 md:px-8 md:py-4 shadow-xl inline-block">
              <p className="text-lg md:text-2xl text-red-600 mb-1 md:mb-2 flex items-center justify-center gap-2 font-bold">
                <Sparkles size={20} className="text-amber-500 shrink-0" />
                {config.texts.finalDate}
                <Sparkles size={20} className="text-amber-500 shrink-0" />
              </p>
              <p className="text-base md:text-xl text-orange-600 italic font-medium">
                {config.texts.finalSignature}
              </p>
            </div>
          </motion.div>

          {/* Кнопки */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center shrink-0 flex flex-col sm:flex-row gap-3"
          >
            <motion.button
              onClick={onMenu}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-md"
            >
              Главное меню
            </motion.button>
            <motion.button
              onClick={onRestart}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-red-600 hover:text-red-700 px-6 py-2 text-sm font-medium"
            >
              {config.texts.buttonAgain}
            </motion.button>
          </motion.div>

          {/* Декоративные сердечки */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 50,
                  opacity: 0.3,
                }}
                animate={{
                  y: -50,
                  opacity: [0.3, 0.6, 0.3],
                  rotate: 360,
                }}
                transition={{
                  duration: 8 + Math.random() * 8,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
                className="absolute"
              >
                <Heart
                  className="text-red-500"
                  size={15 + Math.random() * 25}
                  fill="currentColor"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
