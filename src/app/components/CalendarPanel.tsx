import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function CalendarPanel() {
  const { calendar, setCalendar } = useSync();
  const [addOpen, setAddOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [deleteDate, setDeleteDate] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newDate) return;
    const exists = calendar.some((c) => c.date === newDate);
    if (exists) return;
    setCalendar((prev) => [
      ...prev,
      { date: newDate, title: newTitle.trim() || undefined, note: newNote.trim() || undefined },
    ]);
    setNewDate("");
    setNewTitle("");
    setNewNote("");
    setAddOpen(false);
  };

  const handleDelete = (date: string) => {
    setCalendar((prev) => prev.filter((c) => c.date !== date));
    setDeleteDate(null);
  };

  const sorted = [...calendar].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-full pb-24">
      <h2 className="text-lg font-semibold text-red-800 mb-4">Календарь дат</h2>

      {calendar.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-red-300" />
          </div>
          <p className="text-red-600 text-center mb-6">
            Добавьте важную дату
          </p>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-red-500 hover:bg-red-600 text-white gap-2"
          >
            <Plus className="w-5 h-5" />
            Добавить дату
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {sorted.map((item) => (
            <SwipeableRow
              key={item.date}
              onDelete={() => setDeleteDate(item.date)}
            >
              <div className="p-4">
                <p className="font-semibold text-red-800">{formatDate(item.date)}</p>
                {item.title && (
                  <p className="text-red-600 text-sm mt-0.5">{item.title}</p>
                )}
                {item.note && (
                  <p className="text-red-500 text-sm mt-0.5">{item.note}</p>
                )}
              </div>
            </SwipeableRow>
          ))}
        </div>
      )}

      {calendar.length > 0 && (
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
            <DialogTitle className="text-red-800">Важная дата</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 pt-2">
            <div>
              <Label className="text-red-700">Дата</Label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="border-red-200 focus:ring-red-300 mt-1"
              />
            </div>
            <div>
              <Label className="text-red-700">Название (необязательно)</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="День знакомства"
                className="border-red-200 focus:ring-red-300 mt-1"
              />
            </div>
            <div>
              <Label className="text-red-700">Заметка (необязательно)</Label>
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Как это было..."
                className="border-red-200 focus:ring-red-300 mt-1"
              />
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newDate}
              className="bg-red-500 hover:bg-red-600"
            >
              Добавить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteDate} onOpenChange={() => setDeleteDate(null)}>
        <AlertDialogContent className="bg-[#fef7f3] border-red-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить дату?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDate && handleDelete(deleteDate)}
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
