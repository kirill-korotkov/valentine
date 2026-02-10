import { useEffect } from "react";
import { motion } from "motion/react";
import { config } from "../config";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SarcasticScreenProps {
  onComplete: () => void;
}

export function SarcasticScreen({ onComplete }: SarcasticScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, config.timings.sarcasticScreenDuration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 flex items-center justify-center"
    >
      {/* Фоновое фото с размытием */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={config.startPhotos[1] || config.startPhotos[0]}
          alt="Фон"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/80 via-gray-600/80 to-gray-700/80 backdrop-blur-lg"></div>
      </div>

      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 10 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.5,
        }}
        className="text-center px-4 relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl px-12 py-8 shadow-2xl">
          <h1 className="text-5xl md:text-7xl text-gray-700 font-bold">
            {config.texts.sarcastic}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-4xl md:text-5xl"
          >
            😏
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
