// src/components/QuoteCard.tsx

import React from "react";
import { Heart } from "lucide-react";
import { useFavorites } from "../contexts/FavoritesContext";
import type { Quote } from "../types";


interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isQuoteFavorite = isFavorite(quote.id);

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      motivation: "#D97706", // Amber
      prayer: "#059669", // Emerald
      guidance: "#7C3AED", // Purple
      remembrance: "#DC2626", // Red
      wisdom: "#0891B2", // Cyan
      ramadan: "#2563EB", // Blue
      names_of_allah: "#9333EA", // Violet
    };
    return colors[quote.category] || "#8B4545";
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-[#5C2E2E]/15 flex flex-col gap-3 items-center justify-center h-90 md:h-105 w-[380px] md:w-[410px]">
      {/* Header */}
      <div className="flex">
        <span
          className="flex items-center justify-center px-4 py-1.5 h-8 w-45 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: getCategoryColor() }}
        >
          {quote.category.replace("_", " ")}
        </span>
      </div>

      {/* Quote Text */}
      <p
        className="text-xl text-center md:text-3xl leading-relaxed italic text-[#5C2E2E] mb-4"
        style={{ fontFamily: "Crimson Text, serif" }}
      >
        "{quote.text}"
      </p>

      {/* Arabic Text */}
      {quote.arabic && quote.arabic.trim() && (
        <p
          className="text-xl md:text-2xl text-[#8B4545] mb-6 text-right"
          style={{ fontFamily: "Arial, sans-serif", direction: "rtl" }}
        >
          {quote.arabic}
        </p>
      )}

      {/* Source */}
      <p className="text-base font-semibold text-[#8B4545]">
        — {quote.source} {quote.reference && `${quote.reference}`}
      </p>

      <button
        onClick={() => toggleFavorite(quote.id)}
        className={`p-2 rounded-full transition-colors ${
          isQuoteFavorite ? "bg-[#8B4545]/10" : "hover:bg-[#EAD7C0]"
        }`}
        aria-label={
          isQuoteFavorite ? "Remove from favorites" : "Add to favorites"
        }
      >
        <Heart
          size={22}
          fill={isQuoteFavorite ? "#8B4545" : "none"}
          stroke={isQuoteFavorite ? "#8B4545" : "#5C2E2E"}
        />
      </button>
    </div>
  );
};
