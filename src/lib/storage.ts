// Local Storage Utilities

export const storageKeys = {
  FAVORITES: "ramadan_favorites",
  DARK_MODE: "ramadan_dark_mode",
  RAMADAN_START: "ramadan_start_date",
} as const;

export const storage = {
  // Favorites
  getFavorites: (): number[] => {
    try {
      const saved = localStorage.getItem(storageKeys.FAVORITES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  saveFavorites: (favorites: number[]): void => {
    try {
      localStorage.setItem(storageKeys.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  },

  // Dark Mode
  getDarkMode: (): boolean => {
    try {
      const saved = localStorage.getItem(storageKeys.DARK_MODE);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  },

  saveDarkMode: (isDark: boolean): void => {
    try {
      localStorage.setItem(storageKeys.DARK_MODE, JSON.stringify(isDark));
    } catch (error) {
      console.error("Failed to save dark mode:", error);
    }
  },

  // Ramadan Start Date
  getRamadanStart: (): Date => {
    try {
      const saved = localStorage.getItem(storageKeys.RAMADAN_START);
      return saved ? new Date(JSON.parse(saved)) : new Date("2025-03-01");
    } catch {
      return new Date("2025-03-01");
    }
  },

  saveRamadanStart: (date: Date): void => {
    try {
      localStorage.setItem(
        storageKeys.RAMADAN_START,
        JSON.stringify(date.toISOString())
      );
    } catch (error) {
      console.error("Failed to save Ramadan start date:", error);
    }
  },
};

// Calculate current day of Ramadan
export const getDayOfRamadan = (startDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return Math.max(1, Math.min(diffDays, 30));
};
