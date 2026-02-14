/* eslint-disable react-refresh/only-export-components */
// src/contexts/FavoritesContext.tsx - FIXED with username scoping

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { storage } from "../lib/supabase";
import { useUsername } from "./UsernameContext";

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
  const { username } = useUsername(); // GET USERNAME FROM CONTEXT
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from Supabase on mount
  useEffect(() => {
    if (!username) return; // Don't load if no username yet

    const loadFavorites = async () => {
      try {
        // FIXED: Now scoped by username
        const stored = await storage.get(`favorites:${username}`);
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
  }, [username]); // Re-load when username changes

  // Save favorites to Supabase whenever they change
  useEffect(() => {
    if (isLoaded && username) {
      const saveFavorites = async () => {
        try {
          // FIXED: Now scoped by username
          await storage.set(`favorites:${username}`, JSON.stringify(favorites));
        } catch (error) {
          console.error("Failed to save favorites:", error);
        }
      };
      saveFavorites();
    }
  }, [favorites, isLoaded, username]);

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