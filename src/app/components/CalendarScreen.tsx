import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useSync } from "../SyncContext";

interface CalendarScreenProps {
  onBack: () => void;
}

export function CalendarScreen({ onBack }: CalendarScreenProps) {
  const { calendar } = useSync();

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
        <h2 className="text-xl font-semibold text-red-800 mb-4">Календарь дат</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {calendar.length === 0 ? (
            <p className="text-red-600">Пока нет дат. Добавьте в разработке.</p>
          ) : (
            calendar.map((item) => (
              <div
                key={item.date}
                className="bg-white rounded-xl p-4 border border-red-100"
              >
                <p className="font-medium text-red-800">{item.date}</p>
                {item.title && <p className="text-red-600 text-sm">{item.title}</p>}
                {item.note && <p className="text-red-500 text-sm mt-1">{item.note}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
