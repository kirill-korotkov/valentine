import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { config } from "../config";
import { ChevronLeft } from "lucide-react";

interface TogetherCounterScreenProps {
  onBack: () => void;
}

function getTimeTogether(startDateStr: string) {
  const start = new Date(startDateStr).getTime();
  const now = Date.now();
  const diffMs = now - start;

  if (diffMs < 0) return { days: 0, hours: 0, minutes: 0 };

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

function formatDate(str: string) {
  const d = new Date(str);
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function TogetherCounterScreen({ onBack }: TogetherCounterScreenProps) {
  const startDate = config.togetherStartDate;
  const [time, setTime] = useState(() => getTimeTogether(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeTogether(startDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#fef7f3]"
    >
      <div className="h-full flex flex-col px-4 pt-12 pb-8 max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 mb-6 -ml-1"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>

        <div className="flex-1 flex flex-col justify-center">
          <p className="text-red-600 text-sm font-medium mb-2">
            С {formatDate(startDate)}
          </p>
          <p className="text-4xl md:text-5xl font-bold text-red-800 mb-8">
            Вместе
          </p>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-red-100">
              <p className="text-5xl md:text-6xl font-bold text-red-600 tabular-nums">
                {time.days}
              </p>
              <p className="text-red-500 mt-1">
                {time.days === 1 ? "день" : time.days < 5 ? "дня" : "дней"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-red-100">
                <p className="text-3xl font-bold text-red-600 tabular-nums">
                  {time.hours}
                </p>
                <p className="text-red-500 text-sm">
                  {time.hours === 1 ? "час" : time.hours < 5 ? "часа" : "часов"}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-red-100">
                <p className="text-3xl font-bold text-red-600 tabular-nums">
                  {time.minutes}
                </p>
                <p className="text-red-500 text-sm">
                  {time.minutes === 1
                    ? "минута"
                    : time.minutes < 5
                      ? "минуты"
                      : "минут"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
