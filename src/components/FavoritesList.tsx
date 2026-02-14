// src/components/FavoritesList.tsx - Fixed to accept username prop

import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { QuoteCard } from "./QuoteCard";
import { useFavorites } from "../contexts/FavoritesContext";
import { quotes } from "../lib/quotes";

interface FavoritesListProps {
  darkMode?: boolean;
  username: string; // ADDED USERNAME PROP
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  darkMode = false,
  username, // Now accepts username (though context handles the actual scoping)
}) => {
  const { favorites, clearFavorites } = useFavorites();
  const favoriteQuotes = quotes.filter((quote) => favorites.includes(quote.id));

  if (favorites.length === 0) return null;

  return (
    <section className="animate-in fade-in duration-1000">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div
            className={`p-4 rounded-3xl ${darkMode ? "bg-amber-600 shadow-amber-900/40" : "bg-[#8B4545] shadow-[#8B4545]/20"} shadow-xl`}
          >
            <Heart size={28} className="text-white" fill="currentColor" />
          </div>
          <div>
            <h2
              className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-[#5C2E2E]"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Saved Wisdom
            </h2>
            <p
              className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              {favorites.length}{" "}
              {favorites.length === 1 ? "Inspiration" : "Inspirations"}
            </p>
          </div>
        </div>

        <button
          onClick={clearFavorites}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md ${
            darkMode
              ? "bg-gray-700 text-red-400 hover:bg-gray-600"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          <Trash2 size={16} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {favoriteQuotes.map((quote) => (
          <div
            key={quote.id}
            className="flex justify-center transition-all duration-300 hover:-translate-y-2"
          >
            <QuoteCard quote={quote} darkMode={darkMode} username={username} />
          </div>
        ))}
      </div>
    </section>
  );
};