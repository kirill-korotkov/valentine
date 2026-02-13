/**
 * API клиент для синхронизации (Render, REG.RU или другой сервер).
 */

import type { RoomData } from "./sync";

const API_URL = import.meta.env.VITE_API_URL || "";

export function isApiConfigured(): boolean {
  return !!API_URL;
}

function getBaseUrl(): string {
  return API_URL.replace(/\/$/, "");
}

export async function apiCreateRoom(): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to create room");
  const json = await res.json();
  return json.id;
}

export async function apiJoinRoom(code: string): Promise<boolean> {
  const res = await fetch(`${getBaseUrl()}/api/rooms/${code}`);
  if (!res.ok) return false;
  return true;
}

export async function apiGetRoomData(roomId: string): Promise<RoomData | null> {
  const res = await fetch(`${getBaseUrl()}/api/rooms/${roomId}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    gallery: Array.isArray(data.gallery) ? data.gallery : [],
    calendar: Array.isArray(data.calendar) ? data.calendar : [],
    places: Array.isArray(data.places) ? data.places : [],
    wishes: Array.isArray(data.wishes) ? data.wishes : [],
  };
}

export async function apiSaveRoomData(roomId: string, data: RoomData): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/rooms/${roomId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to save room");
}

export async function apiUploadPhoto(
  roomId: string,
  photoId: string,
  base64Data: string
): Promise<string> {
  const res = await fetch(`${getBaseUrl()}/api/rooms/${roomId}/photos/base64`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ photoId, data: base64Data }),
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.url;
}
