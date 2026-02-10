import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { config } from "../config";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface PhotosScreenProps {
  onComplete: () => void;
}

export function PhotosScreen({ onComplete }: PhotosScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = config.startPhotos;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === photos.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, config.timings.photoAutoAdvance);

    return () => clearInterval(timer);
  }, [photos.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-red-100 via-orange-50 to-amber-100"
    >
      {/* Декоративные плавающие сердечки */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0.2,
            }}
            animate={{
              y: -50,
              opacity: [0.2, 0.4, 0.2],
              rotate: 360,
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute"
          >
            <Heart
              className="text-red-400"
              size={20 + Math.random() * 30}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      {/* Карусель фотографий */}
      <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
        {photos.map((photo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              scale: index === currentIndex ? 1 : 0.8,
              zIndex: index === currentIndex ? 10 : 0,
            }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 20px 50px rgba(239, 68, 68, 0.3)",
                  "0 20px 50px rgba(251, 191, 36, 0.3)",
                  "0 20px 50px rgba(239, 68, 68, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative w-full h-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden"
            >
              <ImageWithFallback
                src={photo}
                alt={`Наше фото ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Декоративная рамка с градиентом */}
              <div className="absolute inset-0 border-4 border-white/50 rounded-2xl pointer-events-none"></div>
            </motion.div>
          </motion.div>
        ))}

        {/* Навигационные стрелки */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-8 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Предыдущее фото"
        >
          <ChevronLeft className="w-6 h-6 text-red-600" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 md:right-8 z-20 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Следующее фото"
        >
          <ChevronRight className="w-6 h-6 text-red-600" />
        </button>

        {/* Индикаторы */}
        <div className="absolute bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-red-600 w-8"
                  : "bg-white/70 hover:bg-white w-2"
              }`}
              aria-label={`Перейти к фото ${index + 1}`}
            />
          ))}
        </div>

        {/* Кнопка "Дальше" с анимацией */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white px-10 py-4 rounded-full shadow-xl transition-all text-lg font-bold relative overflow-hidden"
        >
          <motion.span
            className="relative z-10"
          >
            Дальше
          </motion.span>
          {/* Анимация блеска */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
