import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QuoteGenerator } from "./components/QuoteGenerator";
import { DailyImage } from "./components/DailyImage";
import { FavoritesList } from "./components/FavoritesList";
import { CategoryFilter } from "./components/CategoryFilter";
import { ThemeToggle } from "./components/ThemeToggle";
import { quotes, categories } from "./lib/quotes";
import { storage, getDayOfRamadan } from "./lib/Storage";
import { type Quote } from "./types";

function App() {
  // Initialize state with lazy initialization
  const [darkMode, setDarkMode] = useState(() => storage.getDarkMode());
  const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
  const [favorites, setFavorites] = useState<number[]>(() =>
    storage.getFavorites()
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentDay, setCurrentDay] = useState(() =>
    getDayOfRamadan(storage.getRamadanStart())
  );

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    storage.saveDarkMode(darkMode);
  }, [darkMode]);

  // Save favorites
  useEffect(() => {
    storage.saveFavorites(favorites);
  }, [favorites]);

  const getRandomQuote = () => {
    const filteredQuotes =
      selectedCategory === "all"
        ? quotes
        : quotes.filter((q) => q.category === selectedCategory);

    if (filteredQuotes.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    setCurrentQuote(filteredQuotes[randomIndex]);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const downloadQuote = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Background
      ctx.fillStyle = darkMode ? "#2d251f" : "#faf8f5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Quote text
      ctx.fillStyle = darkMode ? "#f5f1ea" : "#2d251f";
      ctx.font = "bold 48px serif";
      ctx.textAlign = "center";

      const words = currentQuote.text.split(" ");
      let line = "";
      let y = 400;
      const maxWidth = 900;

      words.forEach((word: string) => {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          ctx.fillText(line, 540, y);
          line = word + " ";
          y += 60;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, 540, y);

      // Attribution
      ctx.font = "32px serif";
      ctx.fillText(
        `— ${currentQuote.source} ${currentQuote.reference}`,
        540,
        y + 100
      );

      // Download
      const link = document.createElement("a");
      link.download = `ramadan-quote-${currentQuote.id}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900"
          : "bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
        >
          <div>
            <h1
              className={`text-4xl md:text-5xl font-display font-bold mb-2 ${
                darkMode ? "text-primary-50" : "text-primary-900"
              }`}
            >
              Ramadan Companion
            </h1>
            <p
              className={`text-sm md:text-base ${
                darkMode ? "text-primary-300" : "text-primary-700"
              }`}
            >
              Daily inspiration from the Quran and Hadith
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-primary-200" : "text-primary-700"
              }`}
            >
              Day {currentDay} of 30
            </span>
            <ThemeToggle
              darkMode={darkMode}
              onToggle={() => setDarkMode(!darkMode)}
            />
          </div>
        </motion.header>

        {/* Category Filter */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          darkMode={darkMode}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Quote Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <QuoteGenerator
              quote={currentQuote}
              darkMode={darkMode}
              isFavorite={favorites.includes(currentQuote.id)}
              onToggleFavorite={() => toggleFavorite(currentQuote.id)}
              onNewQuote={getRandomQuote}
              onDownload={downloadQuote}
            />
          </motion.div>

          {/* Daily Image Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <DailyImage currentDay={currentDay} darkMode={darkMode} />
          </motion.div>
        </div>

        {/* Favorites Section */}
        <FavoritesList
          favorites={favorites}
          quotes={quotes}
          darkMode={darkMode}
          isOpen={showFavorites}
          onToggle={() => setShowFavorites(!showFavorites)}
          onRemoveFavorite={(id) => toggleFavorite(id)}
        />
      </div>
    </div>
  );
}

export default App;
