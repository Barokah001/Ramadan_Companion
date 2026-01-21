// src/types/index.ts

export interface Quote {
  id: number;
  text: string;
  source: string;
  reference: string;
  category:
    | "motivation"
    | "prayer"
    | "guidance"
    | "remembrance"
    | "wisdom"
    | "ramadan"
    | "names_of_allah";
  arabic?: string;
}

export interface DailyImage {
  id: number;
  day: number;
  path: string;
  alt: string;
  description?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
}

export interface FavoritesContextType {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

// Global Window Storage type
declare global {
  interface Window {
    storage: {
      get(
        key: string,
        shared?: boolean,
      ): Promise<{ key: string; value: string; shared?: boolean } | null>;
      set(
        key: string,
        value: string,
        shared?: boolean,
      ): Promise<{ key: string; value: string; shared?: boolean } | null>;
      delete(
        key: string,
        shared?: boolean,
      ): Promise<{ key: string; deleted: boolean; shared?: boolean } | null>;
      list(
        prefix?: string,
        shared?: boolean,
      ): Promise<{ keys: string[]; prefix?: string; shared?: boolean } | null>;
    };
  }
}

export {};
