import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, RefreshCw } from "lucide-react";
import { Header } from "./components/Header";
import { QuoteCard } from "./components/QuoteCard";
import { ImageSlider } from "./components/ImageSlider";
import { QUOTES } from "./lib/quotes";
import { useFavorites } from "./contexts/FavoritesContext";
import { useTheme } from "./contexts/ThemeContext";


const App: React.FC = () => {
  const { isDark } = useTheme();
  const { favorites } = useFavorites();
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [showFavorites, setShowFavorites] = useState(false);

  const bgColor = isDark
    ? "bg-gradient-to-br from-amber-950 via-red-950 to-amber-900"
    : "bg-gradient-to-br from-amber-50 via-rose-50 to-beige-100";
  const textColor = isDark ? "text-amber-50" : "text-amber-950";

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);
  };

  const favoriteQuotes = QUOTES.filter((q) => favorites.includes(q.id));

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColor} px-4 py-8 transition-colors duration-500`}
    >
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Quote Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-3xl font-bold ${textColor}`}>Daily Quote</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={getRandomQuote}
              className={`px-6 py-3 rounded-full ${
                isDark
                  ? "bg-amber-800 hover:bg-amber-700"
                  : "bg-amber-200 hover:bg-amber-300"
              } ${textColor} font-semibold flex items-center gap-2 shadow-lg`}
            >
              <RefreshCw className="w-5 h-5" />
              New Quote
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            <QuoteCard key={currentQuote.id} quote={currentQuote} />
          </AnimatePresence>
        </section>

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <section className="mb-16">
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`text-2xl font-bold ${textColor} mb-6 flex items-center gap-2 hover:opacity-80 transition-opacity`}
            >
              <Heart className="w-6 h-6 fill-current text-red-500" />
              Favorite Quotes ({favorites.length})
            </button>

            <AnimatePresence>
              {showFavorites && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {favoriteQuotes.map((quote) => (
                    <QuoteCard key={quote.id} quote={quote} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}

        {/* Image Slider Section */}
        <section>
          <ImageSlider />
        </section>
      </div>
    </div>
  );
};

export default App;
