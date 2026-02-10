import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { config } from "../config";
import { Heart, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface QuestionScreenProps {
  onYes: () => void;
  onNo: () => void;
}

export function QuestionScreen({ onYes, onNo }: QuestionScreenProps) {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(0);
  const [clickedYes, setClickedYes] = useState(false);
  const [showHearts, setShowHearts] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Сброс позиции кнопки "Нет" при первом рендере
  useEffect(() => {
    setNoButtonPosition({ x: 0, y: 0 });
    setAttempts(0);
  }, []);

  const handleNoHover = () => {
    if (!containerRef.current || !noButtonRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const button = noButtonRef.current.getBoundingClientRect();

    // Увеличиваем счетчик попыток
    setAttempts((prev) => prev + 1);

    // Генерируем случайную позицию в пределах экрана
    const maxX = container.width - button.width - 40;
    const maxY = container.height - button.height - 40;

    const randomX = Math.random() * maxX - maxX / 2;
    const randomY = Math.random() * maxY - maxY / 2;

    setNoButtonPosition({ x: randomX, y: randomY });
  };

  const handleNoClick = () => {
    // Даже если пользователь попал по кнопке, вызываем onNo
    onNo();
  };

  const handleYesClick = () => {
    setClickedYes(true);
    setShowHearts(true);
    
    // Небольшая задержка перед переходом для показа анимации
    setTimeout(() => {
      onYes();
    }, 1200);
  };

  // Кнопка уменьшается после каждых 3 попыток
  const buttonScale = Math.max(0.4, 1 - Math.floor(attempts / 3) * 0.15);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* Фоновое фото с размытием */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={config.startPhotos[0]}
          alt="Фон"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/60 via-orange-400/50 to-amber-500/60 backdrop-blur-md"></div>
      </div>

      {/* Декоративные сердечки на фоне */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 0.2,
            }}
            animate={{
              y: window.innerHeight + 50,
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute"
          >
            <Heart
              className="text-red-300"
              size={20 + Math.random() * 30}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      {/* Анимация при нажатии "Да" - взрыв сердец */}
      <AnimatePresence>
        {showHearts && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                initial={{
                  x: window.innerWidth / 2,
                  y: window.innerHeight / 2,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: window.innerWidth / 2 + (Math.random() - 0.5) * 800,
                  y: window.innerHeight / 2 + (Math.random() - 0.5) * 800,
                  scale: [0, 1.5, 1],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
                className="absolute pointer-events-none z-50"
              >
                <Heart
                  className="text-red-500"
                  size={30 + Math.random() * 40}
                  fill="currentColor"
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Основной контент */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-12"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-2xl">
            <h1 className="text-4xl md:text-6xl text-red-600 flex items-center justify-center gap-3">
              <Sparkles className="text-amber-500" />
              {config.texts.question}
              <Sparkles className="text-amber-500" />
            </h1>
          </div>
        </motion.div>

        {/* Контейнер для кнопок */}
        <div className="relative h-48 flex items-center justify-center">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Кнопка "Да" */}
            <motion.button
              initial={{ x: -100, opacity: 0 }}
              animate={
                clickedYes
                  ? {
                      x: 0,
                      opacity: 1,
                      scale: [1, 1.3, 1.2],
                      rotate: [0, -10, 10, -10, 0],
                    }
                  : { x: 0, opacity: 1 }
              }
              transition={{ delay: 0.3 }}
              onClick={handleYesClick}
              disabled={clickedYes}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 hover:from-red-600 hover:via-orange-600 hover:to-amber-600 text-white px-10 md:px-12 py-5 md:py-6 rounded-full shadow-2xl transition-all text-xl md:text-3xl z-20 font-bold relative overflow-hidden"
            >
              <motion.span
                animate={
                  clickedYes
                    ? {
                        textShadow: [
                          "0 0 0px #fff",
                          "0 0 20px #fff",
                          "0 0 0px #fff",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {config.texts.buttonYes}
              </motion.span>
              {/* Анимация блеска */}
              {!clickedYes && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              )}
            </motion.button>

            {/* Placeholder для кнопки "Нет" - сохраняет место в layout */}
            <div className="w-[140px] md:w-[180px] h-[68px] md:h-[88px]"></div>
          </div>

          {/* Кнопка "Нет" (убегающая) - absolute позиционирование */}
          <motion.button
            ref={noButtonRef}
            initial={{ opacity: 0 }}
            animate={{
              x: noButtonPosition.x,
              y: noButtonPosition.y,
              opacity: clickedYes ? 0 : 1,
              scale: buttonScale,
              rotate: attempts > 0 ? [0, -5, 5, -5, 0] : 0,
            }}
            transition={{
              opacity: { delay: 0.3 },
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            onClick={handleNoClick}
            disabled={clickedYes}
            className="bg-gray-500 hover:bg-gray-600 text-white px-10 md:px-12 py-5 md:py-6 rounded-full shadow-2xl transition-colors text-xl md:text-3xl absolute right-0 font-bold"
          >
            {config.texts.buttonNo}
          </motion.button>
        </div>

        {/* Подсказка после нескольких попыток */}
        {attempts > 5 && !clickedYes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl inline-block">
              <p className="text-red-600 text-lg italic font-medium">
                Может, всё-таки «Да»? 😊
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
