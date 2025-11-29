import React from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Quote } from "../types";

interface FavoritesListProps {
  favorites: number[];
  quotes: Quote[];
  darkMode: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onRemoveFavorite: (id: number) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  quotes,
  darkMode,
  isOpen,
  onToggle,
  onRemoveFavorite,
}) => {
  const favoriteQuotes = quotes.filter((q) => favorites.includes(q.id));

  return (
    <div className="mt-8">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onToggle}
        className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-between ${
          darkMode
            ? "bg-primary-800/50 hover:bg-primary-800 text-primary-100 border border-accent-800/30"
            : "bg-white/80 hover:bg-white text-primary-900 border border-primary-300"
        }`}
      >
        <span>Favorites ({favorites.length})</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {favoriteQuotes.length > 0 ? (
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {favoriteQuotes.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-5 rounded-xl relative group ${
                      darkMode
                        ? "bg-primary-800/30 border border-accent-800/20 hover:border-accent-700/40"
                        : "bg-white/60 border border-primary-300 hover:border-primary-400"
                    } transition-all duration-300`}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onRemoveFavorite(quote.id)}
                      className={`absolute top-3 right-3 p-1 rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                        darkMode
                          ? "bg-accent-800 hover:bg-accent-700 text-primary-100"
                          : "bg-primary-200 hover:bg-primary-300 text-primary-900"
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>

                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 capitalize ${
                        darkMode
                          ? "bg-accent-900/50 text-accent-200"
                          : "bg-primary-200 text-primary-800"
                      }`}
                    >
                      {quote.category}
                    </span>

                    <p
                      className={`text-sm font-serif mb-3 pr-6 leading-relaxed ${
                        darkMode ? "text-primary-100" : "text-primary-900"
                      }`}
                    >
                      &ldquo;{quote.text}&rdquo;
                    </p>

                    <div
                      className={`text-xs ${
                        darkMode ? "text-primary-400" : "text-primary-600"
                      }`}
                    >
                      <p className="font-semibold">— {quote.source}</p>
                      <p>{quote.reference}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 p-8 text-center rounded-xl ${
                  darkMode
                    ? "bg-primary-800/30 text-primary-400"
                    : "bg-white/60 text-primary-600"
                }`}
              >
                <p>
                  No favorites yet. Click the heart icon on quotes to save them!
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
