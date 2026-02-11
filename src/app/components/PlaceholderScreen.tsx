import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";

interface PlaceholderScreenProps {
  title: string;
  onBack: () => void;
}

export function PlaceholderScreen({ title, onBack }: PlaceholderScreenProps) {
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
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-800 text-xl font-medium">{title}</p>
        </div>
      </div>
    </motion.div>
  );
}
