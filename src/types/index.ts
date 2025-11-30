export interface Quote {
  id: number;
  text: string;
  source: string;
  reference: string;
  category: "motivation" | "prayer" | "guidance" | "remembrance" | "wisdom";
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
