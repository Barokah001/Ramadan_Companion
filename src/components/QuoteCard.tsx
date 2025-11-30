import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { type Quote } from "../types";
import { useTheme } from "../contexts/ThemeContext";
import { useFavorites } from "../contexts/FavoritesContext";

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const { isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorited = isFavorite(quote.id);

  const bgColor = isDark
    ? "bg-gradient-to-br from-amber-900 to-red-950"
    : "bg-gradient-to-br from-amber-50 to-rose-50";
  const textColor = isDark ? "text-amber-50" : "text-amber-950";
  const accentColor = isDark ? "text-amber-300" : "text-amber-700";
  const borderColor = isDark ? "border-amber-700" : "border-amber-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${bgColor} ${borderColor} border-2 rounded-2xl p-8 shadow-2xl relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full -mr-16 -mt-16" />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4"
      >
        <button
          onClick={() =>
            favorited ? removeFavorite(quote.id) : addFavorite(quote.id)
          }
          className={`p-2 rounded-full transition-all ${
            favorited
              ? "bg-red-500 text-white"
              : isDark
              ? "bg-amber-800 text-amber-200"
              : "bg-amber-200 text-amber-800"
          }`}
        >
          <Heart className={`w-5 h-5 ${favorited ? "fill-current" : ""}`} />
        </button>
      </motion.div>

      <div
        className={`inline-block px-4 py-1 rounded-full ${
          isDark ? "bg-amber-800/50" : "bg-amber-200/50"
        } ${accentColor} text-sm font-semibold mb-4`}
      >
        {quote.category.toUpperCase()}
      </div>

      {quote.arabic && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-2xl ${accentColor} text-right mb-4 font-arabic leading-relaxed`}
        >
          {quote.arabic}
        </motion.p>
      )}

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-xl ${textColor} mb-6 leading-relaxed font-serif italic`}
      >
        "{quote.text}"
      </motion.p>

      <div
        className={`flex items-center justify-between ${accentColor} text-sm pt-4 border-t ${borderColor}`}
      >
        <span className="font-semibold">{quote.source}</span>
        <span className="opacity-75">{quote.reference}</span>
      </div>
    </motion.div>
  );
};
