import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { config } from "../config";
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
  const mousePos = useRef({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasInZone = useRef(false);

  // Сброс при первом рендере
  useEffect(() => {
    setNoButtonPosition({ x: 0, y: 0 });
    setAttempts(0);
  }, []);

  // Отслеживание позиции курсора
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Убегание от курсора
  useEffect(() => {
    if (clickedYes || !noButtonRef.current || !containerRef.current) return;

    const runAwayRadius = 130;
    const runAwaySpeed = 12;
    const padding = 60;

    const maxX = Math.min(300, window.innerWidth / 2 - padding);
    const maxY = Math.min(250, window.innerHeight / 2 - padding);

    const raf = requestAnimationFrame(function check() {
      const rect = noButtonRef.current?.getBoundingClientRect();
      if (!rect) {
        requestAnimationFrame(check);
        return;
      }

      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const cursorX = mousePos.current.x;
      const cursorY = mousePos.current.y;

      const dx = cursorX - buttonCenterX;
      const dy = cursorY - buttonCenterY;
      const distance = Math.hypot(dx, dy);

      if (distance < runAwayRadius && distance > 5) {
        if (!wasInZone.current) {
          wasInZone.current = true;
          setAttempts((prev) => prev + 1);
        }
        const angle = Math.atan2(dy, dx);
        const strength = runAwaySpeed * (1 - distance / runAwayRadius);
        const moveX = Math.cos(angle) * strength;
        const moveY = Math.sin(angle) * strength;

        setNoButtonPosition((prev) => ({
          x: Math.max(-maxX, Math.min(maxX, prev.x + moveX)),
          y: Math.max(-maxY, Math.min(maxY, prev.y + moveY)),
        }));
      } else {
        wasInZone.current = false;
      }

      requestAnimationFrame(check);
    });

    return () => cancelAnimationFrame(raf);
  }, [clickedYes]);

  const handleNoClick = () => {
    onNo();
  };

  const handleYesClick = () => {
    setClickedYes(true);
    setShowHearts(true);

    setTimeout(() => {
      onYes();
    }, 1200);
  };

  const buttonScale = Math.max(0.4, 1 - Math.floor(attempts / 3) * 0.15);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
    >
      {/* Фон */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={config.startPhotos[0]}
          alt="Фон"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 via-orange-400/30 to-amber-500/40 backdrop-blur-md" />
      </div>

      {/* Падающие сердечки */}
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

      {/* Взрыв сердец при "Да" */}
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
          <div className="bg-white/85 backdrop-blur-sm rounded-3xl px-8 py-6 shadow-2xl">
            <h1 className="text-4xl md:text-6xl text-red-600 flex items-center justify-center gap-3">
              <Sparkles className="text-amber-500" />
              {config.texts.question}
              <Sparkles className="text-amber-500" />
            </h1>
          </div>
        </motion.div>

        {/* Кнопки */}
        <div ref={containerRef} className="relative h-48 flex items-center justify-center">
          <div className="flex items-center gap-3 md:gap-6">
            {/* "Да" */}
            <motion.button
              initial={false}
              animate={
                clickedYes
                  ? {
                      scale: [1, 1.3, 1.2],
                      rotate: [0, -10, 10, -10, 0],
                    }
                  : {}
              }
              transition={clickedYes ? { duration: 0.5 } : undefined}
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

              {!clickedYes && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              )}
            </motion.button>

            {/* "Нет" */}
            <motion.button
              ref={noButtonRef}
              initial={false}
              animate={{
                x: noButtonPosition.x,
                y: noButtonPosition.y,
                opacity: clickedYes ? 0 : 1,
                scale: buttonScale,
              }}
              transition={{
                opacity: { duration: 0.2 },
                x: { type: "spring", stiffness: 80, damping: 25 },
                y: { type: "spring", stiffness: 80, damping: 25 },
                scale: { type: "spring", stiffness: 200, damping: 22 },
              }}
              onClick={handleNoClick}
              disabled={clickedYes}
              className="bg-gray-500 hover:bg-gray-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-full shadow-2xl transition-colors text-xl md:text-2xl font-bold"
            >
              {config.texts.buttonNo}
            </motion.button>
          </div>
        </div>

        {/* Подсказка */}
        {attempts > 5 && !clickedYes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl inline-block">
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
