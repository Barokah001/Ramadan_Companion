// src/components/QuoteCard.tsx - Fixed to accept username prop

import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import type { Quote } from "../lib/quotes";

interface QuoteCardProps {
  quote: Quote;
  darkMode?: boolean;
  username?: string; // ADDED USERNAME PROP (optional - not directly used but passed from App for consistency)
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  darkMode = false,
  username, // Now accepts username (context handles the actual scoping)
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isQuoteFavorite = isFavorite(quote.id);

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      motivation: "bg-red-600",
      prayer: "bg-emerald-600",
      guidance: "bg-indigo-600",
      wisdom: "bg-cyan-600",
      ramadan: "bg-amber-600",
    };
    return colors[quote.category] || "bg-[#8B4545]";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center group p-8 md:p-12 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${
        darkMode ? "bg-gray-800 border-gray-700/50" : "bg-white border-white"
      } border-4`}
    >
      <div className="relative w-full flex gap-4 justify-between items-center mb-2">
        <span
          className={`flex items-center justify-center px-4 py-2 rounded-full text-xs font-bold uppercase text-white ${getCategoryColor()}`}
        >
          {quote.category.replace(/_/g, " ")}
        </span>

        <button
          onClick={() => toggleFavorite(quote.id)}
          className={`p-3 rounded-2xl transition-all ${
            darkMode ? "hover:bg-red-900/20" : "hover:bg-red-50"
          }`}
          aria-label={isQuoteFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={24}
            fill={isQuoteFavorite ? "#DC2626" : "none"}
            className={
              isQuoteFavorite
                ? "text-red-600"
                : darkMode ? "text-gray-600" : "text-gray-300"
            }
          />
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <p
          className={`text-2xl md:text-3xl text-center font-serif italic leading-relaxed mb-8 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
        >
          "{quote.text}"
        </p>

        {quote.arabic && (
          <p
            className={`text-3xl md:text-4xl text-center mb-10 leading-[1.8] font-arabic ${darkMode ? "text-amber-200" : "text-[#8B4545]"}`}
            dir="rtl"
          >
            {quote.arabic}
          </p>
        )}

        <div className={`w-16 h-0.5 ${darkMode ? "bg-gray-700" : "bg-gray-100"} mb-6`} />

        <div className="text-center">
          <p
            className={`text-lg font-bold tracking-tight ${darkMode ? "text-gray-300" : "text-[#5C2E2E]"}`}
          >
            — {quote.source}
          </p>
          {quote.reference && (
            <p
              className={`text-sm font-medium mt-1 ${darkMode ? "text-gray-500" : "text-[#8B4545]"} opacity-60`}
            >
              {quote.reference}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};