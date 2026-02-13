import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useSync } from "../SyncContext";

interface WishesScreenProps {
  onBack: () => void;
}

export function WishesScreen({ onBack }: WishesScreenProps) {
  const { wishes } = useSync();

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
        <h2 className="text-xl font-semibold text-red-800 mb-4">Список желаний</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {wishes.length === 0 ? (
            <p className="text-red-600">Пока нет желаний. Добавьте в разработке.</p>
          ) : (
            wishes.map((wish) => (
              <div
                key={wish.id}
                className={`rounded-xl p-4 border ${
                  wish.done ? "bg-red-50 border-red-100" : "bg-white border-red-100"
                }`}
              >
                <p className={wish.done ? "text-red-400 line-through" : "text-red-800"}>
                  {wish.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
