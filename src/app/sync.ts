/**
 * Синхронизация — сопряжение через ссылку.
 * Использует свой API (Render, REG.RU).
 */

import {
  isApiConfigured,
  apiCreateRoom,
  apiJoinRoom,
  apiGetRoomData,
  apiSaveRoomData,
  apiUploadPhoto,
} from "./api";
import type { GalleryPhoto, CalendarDate, Place, Wish } from "./types";

const ROOM_KEY = "valentine:roomId";
const POLL_INTERVAL_MS = 3000;

export function getRoomId(): string | null {
  return localStorage.getItem(ROOM_KEY);
}

export function setRoomId(id: string | null): void {
  if (id) localStorage.setItem(ROOM_KEY, id);
  else localStorage.removeItem(ROOM_KEY);
}

export function getInviteLink(roomId: string): string {
  const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
  return `${base}#join/${roomId}`;
}

export async function createRoom(): Promise<string> {
  const code = await apiCreateRoom();
  setRoomId(code);
  return code;
}

function extractCodeFromInput(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/([A-Z0-9]{6})$/i) || trimmed.match(/([A-Z0-9]{6})/i);
  return match ? match[1].toUpperCase() : trimmed.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-6);
}

export async function joinRoom(input: string): Promise<boolean> {
  const code = extractCodeFromInput(input);
  if (code.length !== 6) return false;
  const ok = await apiJoinRoom(code);
  if (ok) setRoomId(code);
  return ok;
}

export function leaveRoom(): void {
  setRoomId(null);
}

export function isSyncAvailable(): boolean {
  return isApiConfigured();
}

export interface RoomData {
  gallery: GalleryPhoto[];
  calendar: CalendarDate[];
  places: Place[];
  wishes: Wish[];
}

const DEFAULT_DATA: RoomData = {
  gallery: [],
  calendar: [],
  places: [],
  wishes: [],
};

export async function saveToCloud(roomId: string, data: RoomData): Promise<void> {
  await apiSaveRoomData(roomId, data);
}

export async function fetchRoomData(roomId: string): Promise<RoomData | null> {
  return apiGetRoomData(roomId);
}

export async function uploadPhotoToCloud(
  roomId: string,
  photoId: string,
  base64Data: string
): Promise<string> {
  return apiUploadPhoto(roomId, photoId, base64Data);
}

export function subscribeToCloud(
  roomId: string,
  onData: (data: RoomData) => void
): () => void {
  let cancelled = false;
  const poll = async () => {
    if (cancelled) return;
    const data = await fetchRoomData(roomId);
    if (!cancelled && data) onData(data);
    if (!cancelled) setTimeout(poll, POLL_INTERVAL_MS);
  };
  poll();
  return () => {
    cancelled = true;
  };
}
