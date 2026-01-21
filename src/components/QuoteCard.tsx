// src/components/QuoteCard.tsx - Fully Responsive

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
      motivation: "#D97706",
      prayer: "#059669",
      guidance: "#7C3AED",
      remembrance: "#DC2626",
      wisdom: "#0891B2",
      ramadan: "#2563EB",
      names_of_allah: "#9333EA",
    };
    return colors[quote.category] || (darkMode ? "#f59e0b" : "#8B4545");
  };

  return (
    <div
      className={`w-full ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-[#5C2E2E]/10"
      } rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}
    >
      {/* Header */}
      <div className="flex w-full justify-between items-start gap-3 mb-6">
        <span
          className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider text-white shadow-md flex-shrink-0"
          style={{ backgroundColor: getCategoryColor() }}
        >
          {quote.category.replace(/_/g, " ")}
        </span>

        <button
          onClick={() => toggleFavorite(quote.id)}
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 flex-shrink-0 ${
            isQuoteFavorite
              ? darkMode
                ? "bg-amber-600/20 hover:bg-amber-600/30"
                : "bg-[#8B4545]/10 hover:bg-[#8B4545]/20"
              : darkMode
                ? "hover:bg-gray-700"
                : "hover:bg-gray-100"
          } transform hover:scale-110 active:scale-95`}
          aria-label={
            isQuoteFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Heart
            size={22}
            className="sm:w-6 sm:h-6"
            fill={isQuoteFavorite ? (darkMode ? "#f59e0b" : "#8B4545") : "none"}
            stroke={
              isQuoteFavorite
                ? darkMode
                  ? "#f59e0b"
                  : "#8B4545"
                : darkMode
                  ? "#d1d5db"
                  : "#8B4545"
            }
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Quote Text */}
      <div className="mb-6">
        <p
          className={`text-lg sm:text-xl lg:text-2xl text-center leading-relaxed italic ${
            darkMode ? "text-gray-100" : "text-[#5C2E2E]"
          }`}
          style={{ fontFamily: "Crimson Text, serif" }}
        >
          "{quote.text}"
        </p>
      </div>

      {/* Arabic Text */}
      {quote.arabic && quote.arabic.trim() && (
        <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <p
            className={`text-xl sm:text-2xl lg:text-3xl ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            } text-right leading-loose`}
            style={{ fontFamily: "Arial, sans-serif", direction: "rtl" }}
          >
            {quote.arabic}
          </p>
        </div>
      )}

      {/* Source */}
      <div className="text-right">
        <p
          className={`text-base sm:text-lg font-semibold ${
            darkMode ? "text-gray-300" : "text-[#8B4545]"
          }`}
        >
          — {quote.source}
          {quote.reference && (
            <span className="block sm:inline sm:ml-1 text-sm sm:text-base font-normal mt-1 sm:mt-0">
              ({quote.reference})
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
