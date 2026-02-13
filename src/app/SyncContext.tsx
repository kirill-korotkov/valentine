import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  getRoomId,
  createRoom,
  joinRoom as syncJoinRoom,
  leaveRoom,
  saveToCloud,
  subscribeToCloud,
  uploadPhotoToCloud,
  isSyncAvailable,
} from "./sync";
import { getAbsolutePhotoUrl, getPhotoUrlFromBackend } from "./api";
import type { GalleryPhoto, CalendarDate, Place, Wish } from "./types";

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage save failed:", e);
  }
}

const KEYS = {
  gallery: "valentine:gallery",
  calendar: "valentine:calendar",
  places: "valentine:places",
  wishes: "valentine:wishes",
} as const;

interface SyncContextValue {
  gallery: GalleryPhoto[];
  setGallery: (v: GalleryPhoto[] | ((prev: GalleryPhoto[]) => GalleryPhoto[])) => void;
  calendar: CalendarDate[];
  setCalendar: (v: CalendarDate[] | ((prev: CalendarDate[]) => CalendarDate[])) => void;
  places: Place[];
  setPlaces: (v: Place[] | ((prev: Place[]) => Place[])) => void;
  wishes: Wish[];
  setWishes: (v: Wish[] | ((prev: Wish[]) => Wish[])) => void;
  roomId: string | null;
  createRoom: () => Promise<string>;
  joinRoom: (input: string) => Promise<boolean>;
  leaveRoom: () => void;
  isSyncAvailable: boolean;
  addPhotoToCloud: (photo: GalleryPhoto) => Promise<GalleryPhoto | null>;
  /** URL для отображения: data URL из кэша или абсолютный URL. */
  getPhotoDisplayUrl: (photo: GalleryPhoto) => string;
  /** Сохранить data URL локально (для фото, добавленных на этом устройстве). */
  storeLocalPhotoData: (photoId: string, dataUrl: string) => void;
}

const SyncContext = createContext<SyncContextValue | null>(null);

const localPhotoCache = new Map<string, string>();

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [gallery, setGalleryState] = useState<GalleryPhoto[]>(() =>
    loadLocal(KEYS.gallery, [])
  );
  const [calendar, setCalendarState] = useState<CalendarDate[]>(() =>
    loadLocal(KEYS.calendar, [])
  );
  const [places, setPlacesState] = useState<Place[]>(() =>
    loadLocal(KEYS.places, [])
  );
  const [wishes, setWishesState] = useState<Wish[]>(() =>
    loadLocal(KEYS.wishes, [])
  );
  const [roomId, setRoomIdState] = useState<string | null>(() => getRoomId());
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRemoteUpdateRef = useRef(false);

  useEffect(() => {
    if (getRoomId()) return;
    const hash = window.location.hash;
    const m = hash.match(/#join\/([A-Z0-9]{6})/i);
    if (m) {
      syncJoinRoom(m[1]).then((ok) => {
        if (ok) setRoomIdState(getRoomId());
      });
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  const persist = useCallback(() => {
    saveLocal(KEYS.gallery, gallery);
    saveLocal(KEYS.calendar, calendar);
    saveLocal(KEYS.places, places);
    saveLocal(KEYS.wishes, wishes);
  }, [gallery, calendar, places, wishes]);

  useEffect(() => {
    persist();
  }, [persist]);

  const saveToCloudDebounced = useCallback(() => {
    if (!roomId || !isSyncAvailable()) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      saveTimeoutRef.current = null;
      if (isRemoteUpdateRef.current) return;
      try {
        await saveToCloud(roomId, {
          gallery,
          calendar,
          places,
          wishes,
        });
      } catch (e) {
        console.warn("Cloud save failed:", e);
      }
    }, 500);
  }, [roomId, gallery, calendar, places, wishes]);

  useEffect(() => {
    saveToCloudDebounced();
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [saveToCloudDebounced]);

  useEffect(() => {
    if (!roomId || !isSyncAvailable()) return;
    const unsub = subscribeToCloud(roomId, (data) => {
      isRemoteUpdateRef.current = true;
      data.gallery.forEach((p) => {
        if (p.src.startsWith("data:")) localPhotoCache.set(p.id, p.src);
      });
      setGalleryState(data.gallery);
      setCalendarState(data.calendar);
      setPlacesState(data.places);
      setWishesState(data.wishes);
      saveLocal(KEYS.gallery, data.gallery);
      saveLocal(KEYS.calendar, data.calendar);
      saveLocal(KEYS.places, data.places);
      saveLocal(KEYS.wishes, data.wishes);
      setTimeout(() => { isRemoteUpdateRef.current = false; }, 100);
    });
    return () => unsub();
  }, [roomId]);

  const setGallery = useCallback((v: GalleryPhoto[] | ((prev: GalleryPhoto[]) => GalleryPhoto[])) => {
    setGalleryState(v as React.SetStateAction<GalleryPhoto[]>);
  }, []);
  const setCalendar = useCallback((v: CalendarDate[] | ((prev: CalendarDate[]) => CalendarDate[])) => {
    setCalendarState(v as React.SetStateAction<CalendarDate[]>);
  }, []);
  const setPlaces = useCallback((v: Place[] | ((prev: Place[]) => Place[])) => {
    setPlacesState(v as React.SetStateAction<Place[]>);
  }, []);
  const setWishes = useCallback((v: Wish[] | ((prev: Wish[]) => Wish[])) => {
    setWishesState(v as React.SetStateAction<Wish[]>);
  }, []);

  const handleCreateRoom = useCallback(async () => {
    const code = await createRoom();
    setRoomIdState(code);
    return code;
  }, []);

  const handleJoinRoom = useCallback(async (input: string) => {
    const ok = await syncJoinRoom(input);
    if (ok) setRoomIdState(getRoomId());
    return ok;
  }, []);

  const handleLeaveRoom = useCallback(() => {
    leaveRoom();
    setRoomIdState(null);
  }, []);

  const addPhotoToCloud = useCallback(
    async (photo: GalleryPhoto): Promise<GalleryPhoto | null> => {
      if (!roomId || !photo.isUser || !photo.src.startsWith("data:")) return null;
      try {
        localPhotoCache.set(photo.id, photo.src);
        const url = await uploadPhotoToCloud(roomId, photo.id, photo.src);
        return { ...photo, src: url, storagePath: `rooms/${roomId}/photos/${photo.id}.jpg` };
      } catch {
        return null;
      }
    },
    [roomId]
  );

  const getPhotoDisplayUrl = useCallback((photo: GalleryPhoto): string => {
    const cached = localPhotoCache.get(photo.id);
    if (cached) return cached;
    if (roomId) {
      return getPhotoUrlFromBackend(roomId, photo.id);
    }
    return getAbsolutePhotoUrl(photo.src);
  }, [roomId]);

  const storeLocalPhotoData = useCallback((photoId: string, dataUrl: string) => {
    localPhotoCache.set(photoId, dataUrl);
  }, []);

  const value: SyncContextValue = {
    gallery,
    setGallery,
    calendar,
    setCalendar,
    places,
    setPlaces,
    wishes,
    setWishes,
    roomId,
    createRoom: handleCreateRoom,
    joinRoom: handleJoinRoom,
    leaveRoom: handleLeaveRoom,
    isSyncAvailable: isSyncAvailable(),
    addPhotoToCloud,
    getPhotoDisplayUrl,
    storeLocalPhotoData,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSync must be used within SyncProvider");
  return ctx;
}
