import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Plus, Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSync } from "../SyncContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

function generateId() {
  return `ph-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function PhotosPanel() {
  const { gallery, setGallery, addPhotoToCloud, getPhotoDisplayUrl, storeLocalPhotoData, roomId, isSyncAvailable } = useSync();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addPhoto = async (dataUrl: string) => {
    const id = generateId();
    const photo = {
      id,
      src: dataUrl,
      isUser: true,
      addedAt: Date.now(),
    };
    storeLocalPhotoData(photo.id, dataUrl);
    if (roomId && isSyncAvailable) {
      setUploading(true);
      try {
        const uploaded = await addPhotoToCloud(photo);
        setGallery((prev) => [...prev, uploaded ?? photo]);
      } catch {
        setGallery((prev) => [...prev, photo]);
      } finally {
        setUploading(false);
      }
    } else {
      setGallery((prev) => [...prev, photo]);
    }
  };

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addPhoto(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handlePrev = () => {
    if (viewerIndex === null) return;
    setViewerIndex(Math.max(0, viewerIndex - 1));
  };

  const handleNext = () => {
    if (viewerIndex === null) return;
    setViewerIndex(Math.min(gallery.length - 1, viewerIndex + 1));
  };

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(dy) > Math.abs(dx) && dy > 50) {
      setViewerIndex(null);
      return;
    }
    if (Math.abs(dx) > 50) {
      if (dx > 0) handlePrev();
      else handleNext();
    }
  };

  return (
    <div className="min-h-full pb-24">
      <h2 className="text-lg font-semibold text-red-800 mb-4">Совместные фото</h2>

      {gallery.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Images className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-red-600 text-center mb-6">
            Добавьте первое фото
          </p>
          <button
            onClick={handleAddPhoto}
            disabled={uploading}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-60"
          >
            <Plus className="w-5 h-5" />
            {uploading ? "Загрузка..." : "Добавить фото"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddPhoto}
              disabled={uploading}
              className="aspect-square rounded-xl border-2 border-dashed border-red-200 flex items-center justify-center text-red-400 hover:border-red-300 hover:text-red-500 transition-colors touch-manipulation"
            >
              <Plus className="w-10 h-10" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {gallery.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewerIndex(i);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setViewerIndex(i);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="aspect-square rounded-xl overflow-hidden bg-red-50 select-none active:scale-[0.98]"
                style={{ touchAction: "manipulation" }}
              >
                <ImageWithFallback
                  src={getPhotoDisplayUrl(photo)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {/* Fullscreen viewer — портал в body, чтобы не обрезался overflow карусели */}
      {typeof document !== "undefined" &&
        createPortal(
          viewerIndex !== null && gallery[viewerIndex] ? (
            <div
              className="fixed inset-0 z-[9999] bg-black flex flex-col"
              style={{ touchAction: "none" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                type="button"
                onClick={() => setViewerIndex(null)}
                className="absolute top-4 right-4 z-20 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white touch-manipulation"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="relative flex-1 overflow-hidden flex items-center justify-center min-h-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 z-20 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white touch-manipulation disabled:opacity-30"
                  disabled={viewerIndex! <= 0}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <div className="flex-1 flex items-center justify-center min-w-0 p-4">
                  <img
                    src={getPhotoDisplayUrl(gallery[viewerIndex!])}
                    alt=""
                    className="max-w-full max-h-full object-contain"
                    draggable={false}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 z-20 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white touch-manipulation disabled:opacity-30"
                  disabled={viewerIndex! >= gallery.length - 1}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
                {gallery.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full ${
                      i === viewerIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : null,
          document.body
        )}
    </div>
  );
}
