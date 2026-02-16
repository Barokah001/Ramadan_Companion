// src/App.tsx - Fixed to pass username to all components

import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Home,
  CheckSquare,
  Book,
  Sparkles,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { QuoteCard } from "./components/QuoteCard";
import { ImageGallery } from "./components/ImageGallery";
import { FavoritesList } from "./components/FavoritesList";
import { DailyTasks } from "./components/DailyTasks";
import { AdhkarReader } from "./components/AdhkarReader";
import { TenDaySummary } from "./components/TenDaySummary";
import { UsernameModal } from "./components/UsernameModal";
import { useUsername } from "./contexts/UsernameContext";
import { quotes } from "./lib/quotes";
import { RamadanSummary } from "./components/RamadanSummary";

type View = "home" | "tasks" | "dhikr" | "quotes" | "summary" | "ramadan";

const App: React.FC = () => {
  const { username, setUsername, logout, isLoading } = useUsername();
  const [currentView, setCurrentView] = useState<View>("home");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      if (!username) return;
      
      try {
        // Theme can be user-specific or global - your choice
        // Using global theme here (no username prefix)
        const stored = await window.storage.get("theme");
        if (stored && stored.value === "dark") {
          setDarkMode(true);
        }
      } catch {
        // Use default light mode
      }
    };
    loadTheme();
  }, [username]);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    try {
      await window.storage.set("theme", newMode ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const randomQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex && quotes.length > 1);
    setCurrentQuoteIndex(newIndex);
  };

  const handleNavClick = (view: View) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  // Theme classes
  const bgColor = darkMode ? "bg-gray-900" : "bg-gradient-to-br from-[#F5EBE0] to-[#E8D5C4]";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textPrimary = darkMode ? "text-gray-100" : "text-[#5C2E2E]";
  const textSecondary = darkMode ? "text-gray-400" : "text-[#8B4545]";
  const borderColor = darkMode ? "border-gray-700" : "border-[#5C2E2E]/10";
  const accentColor = darkMode ? "bg-amber-600 hover:bg-amber-700" : "bg-[#8B4545] hover:bg-[#6B3535]";

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bgColor} flex items-center justify-center p-4`}>
        <div className="text-center">
          <div className={`animate-spin rounded-full h-16 w-16 border-4 ${darkMode ? "border-amber-500" : "border-[#8B4545]"} border-t-transparent mx-auto mb-4`}></div>
          <p className={`${textPrimary} text-lg`}>Loading your spiritual journey...</p>
        </div>
      </div>
    );
  }

  if (!username) {
    return <UsernameModal darkMode={darkMode} onSubmit={setUsername} />;
  }

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "dhikr", label: "Adhkar", icon: Book },
    { id: "quotes", label: "Quotes", icon: Sparkles },
    { id: "summary", label: "Summary", icon: BarChart3 },
    { id: "ramadan", label: "Ramadan", icon: Moon },
  ];

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${cardBg} ${borderColor} border-b shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              <h1
                className={`text-xl md:text-3xl lg:text-4xl font-bold ${textPrimary}`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Ramadan Companion
              </h1>
              <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
                <span className="hidden sm:inline">Your spiritual journey • </span>
                <span className="font-medium"> Assalam 'alaykum {username}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 ml-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 sm:p-3 rounded-full ${cardBg} ${borderColor} border shadow-md hover:shadow-lg transition-all flex items-center justify-center`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun className="text-amber-400" size={20} />
                ) : (
                  <Moon className="text-[#8B4545]" size={20} />
                )}
              </button>

              <button
                onClick={logout}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-[#8B4545]"} transition-all text-sm font-medium`}
                aria-label="Logout"
              >
                <span>Logout</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className={textPrimary} size={24} />
                ) : (
                  <Menu className={textPrimary} size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`${cardBg} ${borderColor} border-b shadow-md sticky top-[61px] sm:top-[73px] z-40 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex gap-2 overflow-x-auto py-3 hide-scrollbar">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id as View)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                  currentView === id
                    ? `${accentColor} text-white shadow-md transform scale-105`
                    : `${textSecondary} ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`
                }`}
              >
                <Icon size={18} />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden py-2 space-y-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavClick(id as View)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  currentView === id
                    ? `${accentColor} text-white shadow-md`
                    : `${textSecondary} ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* HOME VIEW */}
        {currentView === "home" && (
          <div className="space-y-12 lg:space-y-16">
            <section>
              <div className="text-center mb-8 sm:mb-10">
                <h2
                  className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textPrimary} mb-3`}
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Daily Wisdom
                </h2>
                <p className={`text-base sm:text-lg ${textSecondary} max-w-2xl mx-auto`}>
                  Discover inspiration from the Quran and Hadith
                </p>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className="w-full max-w-2xl">
                  <QuoteCard
                    quote={quotes[currentQuoteIndex]}
                    darkMode={darkMode}
                    username={username}
                  />
                </div>
              </div>

              <div className="flex justify-center items-center gap-3 sm:gap-4 mb-4">
                <button
                  onClick={prevQuote}
                  className={`p-3 sm:p-4 rounded-full ${cardBg} shadow-lg ${borderColor} border hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
                  aria-label="Previous quote"
                >
                  <ChevronLeft size={24} className={textPrimary} />
                </button>

                <button
                  onClick={randomQuote}
                  className={`p-3 sm:p-4 rounded-full ${accentColor} text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
                  aria-label="Random quote"
                >
                  <Sparkles size={24} />
                </button>

                <button
                  onClick={nextQuote}
                  className={`p-3 sm:p-4 rounded-full ${cardBg} shadow-lg ${borderColor} border hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
                  aria-label="Next quote"
                >
                  <ChevronRight size={24} className={textPrimary} />
                </button>
              </div>

              <p className={`text-center text-sm sm:text-base ${textSecondary} font-medium`}>
                Quote {currentQuoteIndex + 1} of {quotes.length}
              </p>
            </section>

            <FavoritesList darkMode={darkMode} username={username} />
            <ImageGallery darkMode={darkMode} />
          </div>
        )}

        {/* TASKS VIEW - NOW PASSES USERNAME */}
        {currentView === "tasks" && <DailyTasks darkMode={darkMode} username={username} />}

        {/* ADHKAR VIEW */}
        {currentView === "dhikr" && <AdhkarReader darkMode={darkMode} />}

        {/* QUOTES VIEW */}
        {currentView === "quotes" && (
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <QuoteCard
                  quote={quotes[currentQuoteIndex]}
                  darkMode={darkMode}
                  username={username}
                />
              </div>
            </div>

            <div className="flex justify-center items-center gap-4">
              <button
                onClick={prevQuote}
                className={`p-4 rounded-full ${cardBg} ${borderColor} border shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
              >
                <ChevronLeft size={24} className={textPrimary} />
              </button>

              <button
                onClick={randomQuote}
                className={`p-4 rounded-full ${accentColor} text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
              >
                <Sparkles size={24} />
              </button>

              <button
                onClick={nextQuote}
                className={`p-4 rounded-full ${cardBg} ${borderColor} border shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
              >
                <ChevronRight size={24} className={textPrimary} />
              </button>
            </div>

            <p className={`text-center text-base ${textSecondary} font-medium`}>
              Quote {currentQuoteIndex + 1} of {quotes.length}
            </p>

            <FavoritesList darkMode={darkMode} username={username} />
          </div>
        )}

        {/* 10-DAY SUMMARY VIEW */}
        {currentView === "summary" && (
          <TenDaySummary 
            darkMode={darkMode} 
            username={username}
            ramadanStartDate="2026-02-18" // Ramadan 2026 start date
          />
        )}

        {/* RAMADAN SUMMARY VIEW */}
        {currentView === "ramadan" && (
          <RamadanSummary
            darkMode={darkMode} 
            username={username}
            ramadanStartDate="2026-02-18" 
            ramadanDays={30} // 29 or 30 days
          />
        )}
      </main>

      {/* Footer */}
      <footer className={`${cardBg} ${borderColor} border-t mt-16 sm:mt-20 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
          <p className={`text-base sm:text-lg ${textSecondary} mb-2 font-medium`}>
            May this Ramadan bring peace, blessings, and spiritual growth
          </p>
          <p className={`text-lg sm:text-xl ${textPrimary} font-semibold`}>
            Ramadan Mubarak 🌙
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;