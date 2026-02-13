import { useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, Copy, Check, Link2, UserPlus } from "lucide-react";
import { getInviteLink } from "../sync";
import { useSync } from "../SyncContext";

interface SyncScreenProps {
  onBack: () => void;
}

export function SyncScreen({ onBack }: SyncScreenProps) {
  const { roomId, createRoom, joinRoom, leaveRoom, isSyncAvailable } = useSync();
  const [joinInput, setJoinInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    setJoinError("");
    try {
      await createRoom();
    } catch (e) {
      setJoinError("Не удалось создать комнату. Проверьте подключение.");
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    setJoining(true);
    setJoinError("");
    try {
      const ok = await joinRoom(joinInput);
      if (!ok) setJoinError("Комната не найдена. Проверьте код.");
    } catch (e) {
      setJoinError("Ошибка подключения.");
      console.error(e);
    } finally {
      setJoining(false);
    }
  };

  const handleCopyLink = () => {
    if (!roomId) return;
    const link = getInviteLink(roomId);
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isSyncAvailable) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#fef7f3]"
      >
        <div className="h-full flex flex-col px-4 pt-12 pb-8 max-w-lg mx-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-red-600 hover:text-red-700 mb-6 -ml-1">
            <ChevronLeft className="w-5 h-5" />
            Назад
          </button>
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-red-700">
              Синхронизация недоступна. Укажи VITE_API_URL при сборке.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#fef7f3] overflow-y-auto"
    >
      <div className="min-h-full flex flex-col px-4 pt-12 pb-8 max-w-lg mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 mb-6 -ml-1"
        >
          <ChevronLeft className="w-5 h-5" />
          Назад
        </button>

        <h2 className="text-xl font-semibold text-red-800 mb-6">Синхронизация</h2>

        {roomId ? (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
              <p className="text-sm text-red-600 mb-2">Код комнаты</p>
              <p className="text-2xl font-mono font-bold text-red-700 tracking-wider">{roomId}</p>
              <button
                onClick={handleCopyLink}
                className="mt-4 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Скопировано" : "Копировать ссылку"}
              </button>
            </div>
            <p className="text-sm text-red-600">
              Отправь ссылку партнёру — календарь, места и пожелания синхронизируются.
            </p>
            <button
              onClick={leaveRoom}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              Выйти из комнаты
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white py-3 px-4 rounded-xl font-medium"
              >
                <Link2 className="w-5 h-5" />
                {creating ? "Создаём..." : "Создать комнату"}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#fef7f3] text-red-600">или</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-red-700 mb-2">Подключиться по ссылке или коду</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinInput}
                  onChange={(e) => setJoinInput(e.target.value)}
                  placeholder="Вставь ссылку или код (6 символов)"
                  className="flex-1 px-4 py-2 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none"
                />
                <button
                  onClick={handleJoin}
                  disabled={joining || !joinInput.trim()}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <UserPlus className="w-5 h-5" />
                  {joining ? "..." : "Войти"}
                </button>
              </div>
              {joinError && <p className="mt-2 text-sm text-red-600">{joinError}</p>}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
