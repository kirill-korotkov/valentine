import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Plus, Calendar as CalendarIcon, Heart } from "lucide-react";
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
import { Calendar } from "./ui/calendar";
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
import type { CalendarDate as CalendarDateType } from "../types";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Нормализация даты в YYYY-MM-DD (на случай различающихся форматов) */
function normalizeDateStr(val: string): string {
  if (!val) return "";
  const d = new Date(val + "T12:00:00");
  if (isNaN(d.getTime())) return val;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CalendarPanel() {
  const { calendar, setCalendar } = useSync();
  const [addOpen, setAddOpen] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [deleteDate, setDeleteDate] = useState<string | null>(null);

  const importantDates = useMemo(() => {
    return calendar
      .map((c) => {
        const d = new Date(c.date + "T12:00:00");
        return isNaN(d.getTime()) ? null : d;
      })
      .filter((d): d is Date => d !== null);
  }, [calendar]);

  const handleAdd = () => {
    const normalized = normalizeDateStr(newDate);
    if (!normalized) return;
    const exists = calendar.some((c) => c.date === normalized);
    if (exists) return;
    setCalendar((prev) => [
      ...prev,
      {
        date: normalized,
        title: newTitle.trim() || undefined,
        note: newNote.trim() || undefined,
      } as CalendarDateType,
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

  const sorted = useMemo(
    () => [...calendar].sort((a, b) => b.date.localeCompare(a.date)),
    [calendar]
  );

  const today = new Date();
  const defaultMonth = importantDates.length > 0
    ? importantDates[0]
    : today;

  return (
    <div className="h-full flex flex-col min-h-0 pb-24">
      {/* Календарь — занимает всю верхнюю половину экрана */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="shrink-0 h-[50vh] min-h-[320px] flex flex-col items-center justify-center px-3 pt-2"
        style={{
          background: "linear-gradient(180deg, rgba(255,228,225,0.7) 0%, rgba(254,247,243,0.5) 50%, transparent 100%)",
        }}
      >
        <div className="calendar-full w-full flex-1 flex flex-col justify-center">
          <Calendar
            defaultMonth={defaultMonth}
            modifiers={{ important: importantDates }}
            modifiersClassNames={{
              important: "!bg-red-500 !text-white rounded-full font-semibold shadow-md hover:!bg-red-600",
            }}
            classNames={{
              months: "w-full flex justify-center",
              month: "w-full",
              table: "w-full table-fixed",
              caption: "flex justify-center py-3",
              caption_label: "text-xl font-semibold text-red-800",
              nav: "flex items-center gap-2",
              nav_button: "size-10 rounded-full text-red-600 hover:bg-red-100 hover:text-red-700",
              head_cell: "text-red-500 font-medium py-2 text-center",
              cell: "text-center align-middle",
              day: "size-12 mx-auto text-base font-medium text-red-800 rounded-full hover:bg-red-100/80 data-[outside]:text-red-200 flex items-center justify-center",
              day_today: "bg-red-100 font-bold",
            }}
          />
        </div>
      </motion.div>

      {/* Список важных дат — нижняя половина */}
      <div className="flex-1 min-h-0 flex flex-col pt-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-red-700 flex items-center gap-2 shrink-0 mb-2">
          <Heart className="w-4 h-4" />
          Важные даты
        </h3>

        {calendar.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-white/60 border border-red-50"
          >
            <CalendarIcon className="w-12 h-12 text-red-200 mb-3" />
            <p className="text-red-600 text-center text-sm mb-4">
              Пока нет важных дат.<br />
              Добавьте первую!
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
                <div className="p-4 flex items-start gap-3">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-red-50 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-red-600 leading-tight">
                      {new Date(item.date + "T12:00:00").toLocaleDateString("ru-RU", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-bold text-red-700 leading-tight -mt-0.5">
                      {new Date(item.date + "T12:00:00").getDate()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-red-800">
                      {item.title || formatDate(item.date)}
                    </p>
                    {item.title && (
                      <p className="text-red-500 text-sm">{formatDate(item.date)}</p>
                    )}
                    {item.note && (
                      <p className="text-red-600/80 text-sm mt-1">{item.note}</p>
                    )}
                  </div>
                </div>
              </SwipeableRow>
            ))}
          </div>
        )}
      </div>

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
