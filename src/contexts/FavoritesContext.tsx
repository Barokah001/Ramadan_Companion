/* eslint-disable react-refresh/only-export-components */

// src/contexts/FavoritesContext.tsx - Using Supabase

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { storage } from "../lib/supabase";

interface FavoritesContextType {
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from Supabase on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await storage.get("ramadan-favorites");
        if (stored && stored.value) {
          setFavorites(JSON.parse(stored.value));
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadFavorites();
  }, []);

  // Save favorites to Supabase whenever they change
  useEffect(() => {
    if (isLoaded) {
      const saveFavorites = async () => {
        try {
          await storage.set("ramadan-favorites", JSON.stringify(favorites));
        } catch (error) {
          console.error("Failed to save favorites:", error);
        }
      };
      saveFavorites();
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id],
    );
  };

  const isFavorite = (id: number): boolean => {
    return favorites.includes(id);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
