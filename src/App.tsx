// src/App.tsx - Full Balanced Layout
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
} from "lucide-react";
import { QuoteCard } from "./components/QuoteCard";
import { ImageGallery } from "./components/ImageGallery";
import { FavoritesList } from "./components/FavoritesList";
import { DailyTasks } from "./components/DailyTasks";
import { AdhkarReader } from "./components/AdhkarReader";
import { WeeklySummary } from "./components/WeeklySummary";
import { UsernameModal } from "./components/UsernameModal";
import { useUsername } from "./contexts/UsernameContext";
import { quotes } from "./lib/quotes";

type View = "home" | "tasks" | "dhikr" | "quotes" | "weekly";

const App: React.FC = () => {
  const { username, setUsername, isLoading } = useUsername();
  const [currentView, setCurrentView] = useState<View>("home");
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { storage } = await import("./lib/supabase");
        const stored = await storage.get("theme");
        if (stored && stored.value === "dark") {
          setDarkMode(true);
        }
      } catch {
        // Default light
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    try {
      const { storage } = await import("./lib/supabase");
      await storage.set("theme", newMode ? "dark" : "light");
    } catch (error) {
      console.error("Failed to save theme:", error);
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

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900" : "bg-[#FAF7F2]"}`}
      >
        <div
          className={`w-14 h-14 border-4 ${darkMode ? "border-amber-500" : "border-[#8B4545]"} border-t-transparent rounded-full animate-spin mb-4`}
        />
        <p
          className={`font-bold tracking-widest uppercase text-xs ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
        >
          Preparing Experience
        </p>
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
    { id: "weekly", label: "Summary", icon: BarChart3 },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-[#0F0F0F]" : "bg-[#FAF7F2]"}`}
    >
      {/* Refined Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl ${darkMode ? "bg-gray-900/80 border-gray-800" : "bg-white/80 border-[#5C2E2E]/10"} border-b shadow-sm`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-black tracking-tighter ${darkMode ? "text-white" : "text-[#5C2E2E]"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Ramadan Companion
            </h1>
            <p
              className={`text-xs md:text-sm font-bold opacity-60 uppercase tracking-widest ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              Assalamu Alaikum, {username}
            </p>
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-3.5 rounded-2xl transition-all hover:scale-110 active:scale-90 ${darkMode ? "bg-gray-800 text-amber-400 shadow-inner" : "bg-amber-50 text-[#8B4545] shadow-sm"}`}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      {/* Modern Navigation */}
      <nav
        className={`backdrop-blur-md ${darkMode ? "bg-gray-900/90 border-gray-800" : "bg-white/90 border-b border-[#5C2E2E]/5"}`}
      >
        <div className="max-w-6xl h-14 px-3 flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto py-10 no-scrollbar justify-between">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCurrentView(id as View)}
                className={`flex h-8 w-24 items-center justify-center gap-2 rounded-full text-sm font-black uppercase tracking-widest transition-all ${
                  currentView === id
                    ? `${darkMode ? "bg-amber-600 text-white shadow-xl" : "bg-[#8B4545] text-white shadow-lg shadow-[#8B4545]/20"}`
                    : `${darkMode ? "text-gray-500 hover:bg-gray-800" : "text-[#8B4545]/60 hover:bg-[#8B4545]/5"}`
                }`}
              >
                <Icon size={14} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {currentView === "home" && (
            <div className="space-y-20">
              <section className="max-w-3xl mx-auto flex flex-col gap-4 items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center gap-2 mb-6 ">
                  <h2
                    className={`text-4xl md:text-5xl font-black mb-1 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Daily Wisdom
                  </h2>
                  <div
                    className={`h-1.5 w-24 mx-auto rounded-full ${darkMode ? "bg-amber-600 shadow-lg" : "bg-[#8B4545]"}`}
                  />
                </div>

                <QuoteCard
                  quote={quotes[currentQuoteIndex]}
                  darkMode={darkMode}
                />

                <div className="flex justify-center items-center gap-8 mt-2">
                  <button
                    onClick={prevQuote}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110 active:scale-90 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-[#5C2E2E] shadow-xl border border-gray-50"}`}
                  >
                    <ChevronLeft size={28} />
                  </button>

                  <button
                    onClick={randomQuote}
                    className={`p-2 rounded-[2rem] transition-all hover:rotate-180 active:scale-95 ${darkMode ? "bg-amber-600" : "bg-[#8B4545] text-white shadow-2xl shadow-[#8B4545]/30"}`}
                  >
                    <Sparkles size={28} />
                  </button>

                  <button
                    onClick={nextQuote}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110 active:scale-90 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-[#5C2E2E] shadow-xl border border-gray-50"}`}
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>

                <p
                  className={`text-center text-xs font-black uppercase tracking-[0.3em] mt-2 ${darkMode ? "text-gray-500" : "text-[#8B4545]/40"}`}
                >
                  Entry {currentQuoteIndex + 1} of {quotes.length}
                </p>
              </section>

              <FavoritesList darkMode={darkMode} />
              <ImageGallery darkMode={darkMode} />
            </div>
          )}

          {currentView === "tasks" && <DailyTasks darkMode={darkMode} />}
          {currentView === "dhikr" && <AdhkarReader darkMode={darkMode} />}
          {currentView === "quotes" && (
            <div className="max-w-3xl mx-auto space-y-12">
              <QuoteCard
                quote={quotes[currentQuoteIndex]}
                darkMode={darkMode}
              />
              <div className="flex justify-center gap-6">
                <button
                  onClick={prevQuote}
                  className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 transition-all active:scale-90"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextQuote}
                  className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 transition-all active:scale-90"
                >
                  <ChevronRight />
                </button>
              </div>
              <FavoritesList darkMode={darkMode} />
            </div>
          )}
          {currentView === "weekly" && (
            <WeeklySummary darkMode={darkMode} userId={username} />
          )}
        </div>
      </main>

      <footer
        className={`mt-24 py-12 text-center border-t transition-colors ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-[#5C2E2E]/5"}`}
      >
        <p
          className={`text-xs tracking-[0.4em] font-black uppercase mb-2 ${darkMode ? "text-gray-600" : "text-[#8B4545]/30"}`}
        >
          Seek Peace • Find Growth • Share Light
        </p>
        <p
          className={`text-xl font-black ${darkMode ? "text-amber-500" : "text-[#5C2E2E]"}`}
        >
          Ramadan Mubarak 🌙
        </p>
      </footer>
    </div>
  );
};

export default App;
