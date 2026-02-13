import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { useSync } from "../SyncContext";
import { getAbsolutePhotoUrl } from "../api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PhotosGalleryScreenProps {
  onBack: () => void;
}

export function PhotosGalleryScreen({ onBack }: PhotosGalleryScreenProps) {
  const { gallery } = useSync();

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
        <h2 className="text-xl font-semibold text-red-800 mb-4">Совместные фото</h2>
        <div className="flex-1 overflow-y-auto">
          {gallery.length === 0 ? (
            <p className="text-red-600">Пока нет фото. Добавьте в разработке.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-red-50">
                  <ImageWithFallback
                    src={getAbsolutePhotoUrl(photo.src)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
