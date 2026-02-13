import { motion } from "motion/react";
import { Calendar, MapPin, Heart, Images, Link2 } from "lucide-react";
import { useSync } from "../SyncContext";

interface MainMenuScreenProps {
  onSelect: (section: "photos" | "calendar" | "counter" | "places" | "wishes" | "sync") => void;
}

const MENU_ITEMS = [
  { id: "photos" as const, icon: Images, label: "Совместные фото" },
  { id: "calendar" as const, icon: Calendar, label: "Календарь дат" },
  { id: "counter" as const, icon: Heart, label: "Счётчик «Вместе»" },
  { id: "places" as const, icon: MapPin, label: "Наши места" },
  { id: "wishes" as const, icon: Heart, label: "Список желаний" },
];

export function MainMenuScreen({ onSelect }: MainMenuScreenProps) {
  const { isSyncAvailable, roomId } = useSync();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#fef7f3]"
    >
      <div className="h-full flex flex-col px-4 pt-12 pb-8 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-red-800 mb-6">Главное меню</h2>

        <div className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onSelect(item.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center gap-3 bg-white/80 hover:bg-white border border-red-100 rounded-xl px-4 py-3 shadow-sm"
            >
              <item.icon className="w-6 h-6 text-red-500 shrink-0" />
              <span className="text-red-800 font-medium">{item.label}</span>
            </motion.button>
          ))}

          {isSyncAvailable && (
            <motion.button
              onClick={() => onSelect("sync")}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center gap-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl px-4 py-3"
            >
              <Link2 className="w-6 h-6 text-red-500 shrink-0" />
              <span className="text-red-800 font-medium">
                Синхронизация {roomId ? `(${roomId})` : ""}
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
