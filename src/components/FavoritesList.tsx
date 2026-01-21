// src/components/FavoritesList.tsx - Fully Responsive

import React from "react";
import { Heart, Trash2 } from "lucide-react";
import { QuoteCard } from "./QuoteCard";
import { useFavorites } from "../contexts/FavoritesContext";
import { quotes } from "../lib/quotes";

interface FavoritesListProps {
  darkMode?: boolean;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  darkMode = false,
}) => {
  const { favorites, clearFavorites } = useFavorites();
  const favoriteQuotes = quotes.filter((quote) => favorites.includes(quote.id));

  if (favorites.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 sm:mb-16 lg:mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className={`p-2 sm:p-3 rounded-full ${
              darkMode ? "bg-amber-600" : "bg-[#8B4545]"
            } shadow-lg`}
          >
            <Heart
              size={24}
              className="sm:w-7 sm:h-7 text-white"
              fill="currentColor"
            />
          </div>
          <div>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Favorite Quotes
            </h2>
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-300" : "text-[#8B4545]"
              } mt-1`}
            >
              {favorites.length} {favorites.length === 1 ? "quote" : "quotes"}{" "}
              saved
            </p>
          </div>
        </div>

        <button
          onClick={clearFavorites}
          className={`self-start sm:self-auto flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
            darkMode
              ? "bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600"
              : "bg-white hover:bg-gray-50 text-[#8B4545] border-[#5C2E2E]/10"
          } border`}
        >
          <Trash2 size={16} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Clear All</span>
          <span className="sm:hidden">Clear</span>
        </button>
      </div>

      {/* Quotes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {favoriteQuotes.map((quote) => (
          <div key={quote.id} className="flex justify-center">
            <QuoteCard quote={quote} darkMode={darkMode} />
          </div>
        ))}
      </div>

      {/* Empty State Message (shown if favorites cleared but animation still showing) */}
      {favorites.length === 0 && (
        <div
          className={`text-center py-12 sm:py-16 rounded-xl ${
            darkMode ? "bg-gray-800" : "bg-white"
          } border ${
            darkMode ? "border-gray-700" : "border-[#5C2E2E]/10"
          } shadow-lg`}
        >
          <Heart
            size={48}
            className={`mx-auto mb-4 ${
              darkMode ? "text-gray-600" : "text-[#8B4545]/30"
            }`}
          />
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-[#8B4545]"
            }`}
          >
            No favorite quotes yet
          </p>
          <p
            className={`text-sm mt-2 ${
              darkMode ? "text-gray-400" : "text-[#8B4545]/70"
            }`}
          >
            Tap the heart icon on any quote to save it here
          </p>
        </div>
      )}
    </section>
  );
};
