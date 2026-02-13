import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "motion/react";
import { Trash2 } from "lucide-react";

interface SwipeableRowProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
}

const SWIPE_THRESHOLD = 80;

export function SwipeableRow({
  children,
  onDelete,
  deleteLabel = "Удалить",
}: SwipeableRowProps) {
  const x = useMotionValue(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const deleteBgOpacity = useTransform(x, [-120, -SWIPE_THRESHOLD], [1, 0]);
  const scale = useTransform(x, [-150, -200], [1, 0.95]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) {
      setIsDeleting(true);
      animate(x, -400, { duration: 0.2 }).then(() => {
        onDelete();
      });
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  if (isDeleting) return null;

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-xl">
      {/* Delete background */}
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center justify-end pr-4 bg-red-500 rounded-xl"
        style={{ opacity: deleteBgOpacity }}
      >
        <span className="text-white font-medium text-sm flex items-center gap-1">
          <Trash2 className="w-4 h-4" />
          {deleteLabel}
        </span>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, scale }}
        className="relative bg-white border border-red-100 rounded-xl touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
}
