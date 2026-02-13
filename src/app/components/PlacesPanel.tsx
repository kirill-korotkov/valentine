import { useState } from "react";
import { motion } from "motion/react";
import { Plus, MapPin } from "lucide-react";
import { useSync } from "../SyncContext";
import { SwipeableRow } from "./SwipeableRow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

function generateId() {
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function PlacesPanel() {
  const { places, setPlaces } = useSync();
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNote, setNewNote] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    const name = newName.trim();
    if (!name) return;
    setPlaces((prev) => [
      ...prev,
      { id: generateId(), name, note: newNote.trim() || undefined, addedAt: Date.now() },
    ]);
    setNewName("");
    setNewNote("");
    setAddOpen(false);
  };

  const handleDelete = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-full pb-24">
      <h2 className="text-lg font-semibold text-red-800 mb-4">Наши места</h2>

      {places.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-red-600 text-center mb-6">
            Добавьте место, где вы были вместе
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить место
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {places.map((place) => (
            <SwipeableRow
              key={place.id}
              onDelete={() => setDeleteId(place.id)}
            >
              <div className="flex items-start gap-3 p-4">
                <MapPin className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">{place.name}</p>
                  {place.note && (
                    <p className="text-red-600 text-sm mt-0.5">{place.note}</p>
                  )}
                </div>
              </div>
            </SwipeableRow>
          ))}
        </div>
      )}

      {places.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-8 right-4 md:right-[calc(50vw-16rem+1rem)] z-10"
        >
          <button
            onClick={() => setAddOpen(true)}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
          >
            <Plus className="w-7 h-7" />
          </button>
        </motion.div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-[#fef7f3] border-red-100">
          <DialogHeader>
            <DialogTitle className="text-red-800">Новое место</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <Label className="text-red-700">Название</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Кафе на Патриарших"
                className="border-red-200 focus:ring-red-300 mt-1"
              />
            </div>
            <div>
              <Label className="text-red-700">Заметка (необязательно)</Label>
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Там мы впервые..."
                className="border-red-200 focus:ring-red-300 mt-1"
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#fef7f3] border-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить место?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
