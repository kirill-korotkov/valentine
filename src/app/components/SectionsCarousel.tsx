import { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Heart, Calendar, MapPin, Images } from "lucide-react";
import { WishesPanel } from "./WishesPanel";
import { CalendarPanel } from "./CalendarPanel";
import { PlacesPanel } from "./PlacesPanel";
import { PhotosPanel } from "./PhotosPanel";

const EDGE_ZONE = 50;
const SWIPE_THRESHOLD = 80;

const SECTIONS = [
  { id: "wishes" as const, icon: Heart, label: "Желания" },
  { id: "calendar" as const, icon: Calendar, label: "Календарь" },
  { id: "places" as const, icon: MapPin, label: "Места" },
  { id: "photos" as const, icon: Images, label: "Фото" },
];

interface SectionsCarouselProps {
  initialSection: "wishes" | "calendar" | "places" | "photos";
  onBack: () => void;
}

export function SectionsCarousel({ initialSection, onBack }: SectionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(
    SECTIONS.findIndex((s) => s.id === initialSection) || 0
  );
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  // Свайп вправо от левого края — выход в главное меню
  useEffect(() => {
    const handleStart = (e: TouchEvent | PointerEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      const y = "touches" in e ? e.touches[0].clientY : e.clientY;
      if (x < EDGE_ZONE) swipeStart.current = { x, y };
      else swipeStart.current = null;
    };

    const handleEnd = (e: TouchEvent | PointerEvent) => {
      if (!swipeStart.current) return;
      const x = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const y = "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
      const dx = x - swipeStart.current.x;
      const dy = Math.abs(y - swipeStart.current.y);
      if (dx > SWIPE_THRESHOLD && dy < dx) onBack();
      swipeStart.current = null;
    };

    window.addEventListener("touchstart", handleStart, { passive: true });
    window.addEventListener("touchend", handleEnd, { passive: true });
    window.addEventListener("pointerdown", handleStart);
    window.addEventListener("pointerup", handleEnd);
    return () => {
      window.removeEventListener("touchstart", handleStart);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("pointerdown", handleStart);
      window.removeEventListener("pointerup", handleEnd);
    };
  }, [onBack]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = SECTIONS.findIndex((s) => s.id === initialSection);
    const slideWidth = el.clientWidth;
    el.scrollTo({ left: (idx >= 0 ? idx : 0) * slideWidth, behavior: "instant" });
  }, [initialSection]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth;
    const idx = Math.round(el.scrollLeft / slideWidth);
    setActiveIndex(Math.max(0, Math.min(idx, SECTIONS.length - 1)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#fef7f3] flex flex-col"
    >
      {/* Header */}
      <div className="shrink-0 px-4 pt-12 pb-3 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 -ml-1 touch-manipulation"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="font-medium">Меню</span>
          </button>

          {/* Section tabs */}
          <div className="flex gap-1">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  scrollRef.current?.scrollTo({
                    left: i * (scrollRef.current?.clientWidth ?? 0),
                    behavior: "smooth",
                  });
                }}
                className={`p-2 rounded-lg touch-manipulation transition-colors ${
                  activeIndex === i ? "bg-red-100 text-red-700" : "text-red-400 hover:text-red-600"
                }`}
                aria-label={s.label}
              >
                <s.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swipeable content */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
      >
        <div className="flex h-full" style={{ width: "400%" }}>
          <div
            className="shrink-0 snap-start overflow-y-auto px-4 pb-8"
            style={{ width: "25%" }}
          >
            <WishesPanel />
          </div>
          <div
            className="shrink-0 snap-start overflow-hidden px-4 pb-4 flex flex-col min-h-0"
            style={{ width: "25%" }}
          >
            <CalendarPanel />
          </div>
          <div
            className="shrink-0 snap-start overflow-y-auto px-4 pb-8"
            style={{ width: "25%" }}
          >
            <PlacesPanel />
          </div>
          <div
            className="shrink-0 snap-start overflow-y-auto px-4 pb-8"
            style={{ width: "25%" }}
          >
            <PhotosPanel />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
