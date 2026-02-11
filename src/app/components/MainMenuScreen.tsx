import { motion } from "motion/react";
import { ChevronRight, Heart, Images, Calendar, MapPin, ListChecks } from "lucide-react";

type MenuSection = "photos" | "calendar" | "counter" | "places" | "wishes";

interface MainMenuScreenProps {
  onSelect: (section: MenuSection) => void;
}

const menuItems: { id: MenuSection; label: string; icon: React.ReactNode }[] = [
  { id: "photos", label: "Совместные фото", icon: <Images className="w-6 h-6" /> },
  { id: "calendar", label: "Календарь дат", icon: <Calendar className="w-6 h-6" /> },
  { id: "counter", label: "Вместе", icon: <Heart className="w-6 h-6" /> },
  { id: "places", label: "Наши места", icon: <MapPin className="w-6 h-6" /> },
  { id: "wishes", label: "Список желаний", icon: <ListChecks className="w-6 h-6" /> },
];

export function MainMenuScreen({ onSelect }: MainMenuScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#fef7f3]"
    >
      <div className="h-full overflow-y-auto px-4 pt-12 pb-8 max-w-lg mx-auto">
        <h1 className="text-2xl font-semibold text-red-800 mb-8">
          Наша валентинка
        </h1>

        <div className="space-y-2">
          {menuItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(item.id)}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-red-100 text-left hover:bg-red-50/50 hover:border-red-200 transition-colors"
            >
              <span className="flex items-center gap-4">
                <span className="text-red-500">{item.icon}</span>
                <span className="font-medium text-red-900">{item.label}</span>
              </span>
              <ChevronRight className="w-5 h-5 text-red-300" />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
