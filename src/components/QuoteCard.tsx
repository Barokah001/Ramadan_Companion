// src/components/QuoteCard.tsx - Refined Styling
import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import type { Quote } from "../types";

interface QuoteCardProps {
  quote: Quote;
  darkMode?: boolean;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  darkMode = false,
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
      className={`flex flex-col items-center justify-center group w-120 h-90 p-4 text-wrap md:p-12 rounded-[2.5rem] shadow-2xl transition-all duration-500 ${
        darkMode ? "bg-gray-800 border-gray-700/50" : "bg-white border-white"
      } border-4`}
    >
      <div className="relative w-1/2 flex gap-4 justify-center items-center mt-2">
        <span
          className={`flex items-center justify-center h-7 w-36 rounded-full text-[12px] font-black uppercase text-white ${getCategoryColor()}`}
        >
          {quote.category.replace(/_/g, " ")}
        </span>

        <button
          onClick={() => toggleFavorite(quote.id)}
          className="absolute -right-18 p-3 rounded-2xl transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Heart
            size={24}
            fill={isQuoteFavorite ? "#DC2626" : "none"}
            className={
              isQuoteFavorite
                ? "text-red-600"
                : "text-gray-300 dark:text-gray-600"
            }
          />
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center">
        <p
          className={`text-2xl md:text-3xl text-center font-serif italic leading-relaxed mb-8 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
        >
          “{quote.text}”
        </p>

        {quote.arabic && (
          <p
            className={`text-3xl md:text-4xl text-center mb-10 leading-[1.8] font-arabic ${darkMode ? "text-amber-200" : "text-[#8B4545]"}`}
            dir="rtl"
          >
            {quote.arabic}
          </p>
        )}

        <div className="w-16 h-0.5 bg-gray-100 dark:bg-gray-700 mb-6" />

        <div className="text-center">
          <p
            className={`text-lg font-bold tracking-tight ${darkMode ? "text-gray-300" : "text-[#5C2E2E]"}`}
          >
            — {quote.source}
          </p>
          {quote.reference && (
            <p
              className={`text-sm font-medium mt-1 opacity-60 ${darkMode ? "text-gray-500" : "text-[#8B4545]"}`}
            >
              {quote.reference}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
