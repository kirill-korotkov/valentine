export interface GalleryPhoto {
  id: string;
  src: string;
  isUser: boolean;
  addedAt?: number;
  storagePath?: string;
}

export interface CalendarDate {
  date: string;
  title?: string;
  note?: string;
  imageSrc?: string;
}

export interface Place {
  id: string;
  name: string;
  note?: string;
  imageSrc?: string;
  addedAt: number;
}

export interface Wish {
  id: string;
  text: string;
  done: boolean;
  addedAt: number;
}
