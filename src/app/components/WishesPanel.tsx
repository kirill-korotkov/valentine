import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Heart } from "lucide-react";
import { useSync } from "../SyncContext";
import { SwipeableRow } from "./SwipeableRow";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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
  return `w-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function WishesPanel() {
  const { wishes, setWishes } = useSync();
  const [addOpen, setAddOpen] = useState(false);
  const [newText, setNewText] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    const text = newText.trim();
    if (!text) return;
    setWishes((prev) => [
      ...prev,
      { id: generateId(), text, done: false, addedAt: Date.now() },
    ]);
    setNewText("");
    setAddOpen(false);
  };

  const handleToggle = (id: string) => {
    setWishes((prev) =>
      prev.map((w) => (w.id === id ? { ...w, done: !w.done } : w))
    );
  };

  const handleDelete = (id: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="min-h-full pb-24">
      <h2 className="text-lg font-semibold text-red-800 mb-4">Список желаний</h2>

      {wishes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-red-600 text-center mb-6">
            Добавьте первое желание вместе
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить желание
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {wishes.map((wish) => (
            <SwipeableRow
              key={wish.id}
              onDelete={() => setDeleteId(wish.id)}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer touch-manipulation"
                onClick={() => handleToggle(wish.id)}
              >
                <Checkbox
                  checked={wish.done}
                  onCheckedChange={() => handleToggle(wish.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="border-red-300 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 shrink-0"
                />
                <p
                  className={`flex-1 select-none ${
                    wish.done
                      ? "text-red-400 line-through"
                      : "text-red-800 font-medium"
                  }`}
                >
                  {wish.text}
                </p>
              </div>
            </SwipeableRow>
          ))}
        </div>
      )}

      {/* FAB */}
      {wishes.length > 0 && (
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

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="bg-[#fef7f3] border-red-100">
          <DialogHeader>
            <DialogTitle className="text-red-800">Новое желание</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <Input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Например: Съездить в Грузию"
              className="border-red-200 focus:ring-red-300"
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button
              onClick={handleAdd}
              disabled={!newText.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-[#fef7f3] border-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить желание?</AlertDialogTitle>
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
