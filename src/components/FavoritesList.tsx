// src/components/FavoritesList.tsx

import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { QuoteCard } from "./QuoteCard";
import { useFavorites } from "../contexts/FavoritesContext";
import { quotes } from "../lib/quotes";

export const FavoritesList: React.FC = () => {
  const { favorites, clearFavorites } = useFavorites();
  const favoriteQuotes = quotes.filter((quote) => favorites.includes(quote.id));

  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Heart size={32} fill="#8B4545" className="text-[#8B4545]" />
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#5C2E2E]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Favorite Quotes
            </h2>
            <p className="text-sm text-[#8B4545]">
              {favorites.length} {favorites.length === 1 ? "quote" : "quotes"}{" "}
              saved
            </p>
          </div>
        </div>

        <button
          onClick={clearFavorites}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-white border border-[#5C2E2E]/15 text-[#5C2E2E] hover:bg-[#EAD7C0] transition-colors"
        >
          <Trash2 size={16} />
          <span className="hidden sm:inline">Clear All</span>
        </button>
      </div>

      {/* Quotes Grid */}
      <div className="flex grid-cols-2 gap-3 space-y-6">
        {favoriteQuotes.map((quote) => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </section>
  );
};
