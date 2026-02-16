/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/AdhkarReader.tsx - With Counter Controls & Responsive Text

import React, { useState, useEffect } from "react";
import { CheckCircle, RotateCcw, BookOpen, Sun, Moon } from "lucide-react";
import { morningAdhkar, eveningAdhkar, type DhikrItem } from "../lib/adhkar";
import { storage } from "../lib/supabase";

interface AdhkarReaderProps {
  darkMode?: boolean;
}

interface DhikrProgress {
  counters: { [key: string]: number };
  completed: { [key: string]: boolean };
}

export const AdhkarReader: React.FC<AdhkarReaderProps> = ({
  darkMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const [progress, setProgress] = useState<DhikrProgress>({
    counters: {},
    completed: {},
  });

  const currentAdhkar = activeTab === "morning" ? morningAdhkar : eveningAdhkar;

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const key = `adhkar-${activeTab}-${today}`;
        const stored = await storage.get(key);
        if (stored) {
          setProgress(JSON.parse(stored.value));
        } else {
          setProgress({ counters: {}, completed: {} });
        }
      } catch (err) {
        setProgress({ counters: {}, completed: {} });
      }
    };
    loadProgress();
  }, [activeTab]);

  useEffect(() => {
    const saveProgress = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const key = `adhkar-${activeTab}-${today}`;
        await storage.set(key, JSON.stringify(progress));
      } catch (err) {
        console.error("Save failed:", err);
      }
    };

    if (
      Object.keys(progress.counters).length > 0 ||
      Object.keys(progress.completed).length > 0
    ) {
      saveProgress();
    }
  }, [progress, activeTab]);

  const incrementCounter = (dhikr: DhikrItem) => {
    setProgress((prev) => {
      const currentCount = prev.counters[dhikr.id] || 0;
      const newCount = Math.min(currentCount + 1, dhikr.repetitions);
      const isComplete = newCount >= dhikr.repetitions;

      return {
        counters: { ...prev.counters, [dhikr.id]: newCount },
        completed: { ...prev.completed, [dhikr.id]: isComplete },
      };
    });
  };

  const decrementCounter = (dhikr: DhikrItem) => {
    setProgress((prev) => {
      const currentCount = prev.counters[dhikr.id] || 0;
      const newCount = Math.max(currentCount - 1, 0);
      const isComplete = newCount >= dhikr.repetitions;

      return {
        counters: { ...prev.counters, [dhikr.id]: newCount },
        completed: { ...prev.completed, [dhikr.id]: isComplete },
      };
    });
  };

  const resetDhikr = (id: string) => {
    setProgress((prev) => ({
      counters: { ...prev.counters, [id]: 0 },
      completed: { ...prev.completed, [id]: false },
    }));
  };

  const resetAll = () => {
    setProgress({ counters: {}, completed: {} });
  };

  const totalCompleted = currentAdhkar.filter(
    (d) => progress.completed[d.id],
  ).length;
  const progressPercent = Math.round(
    (totalCompleted / currentAdhkar.length) * 100,
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12 animate-in fade-in duration-700">
      {/* Header Info Card */}
      <div
        className={`rounded-[2.5rem] p-8 md:p-10 shadow-2xl border-4 ${darkMode ? "bg-gray-800 border-gray-700/50" : "bg-white border-white"}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-3xl shadow-lg ${darkMode ? "bg-amber-600 text-white" : "bg-[#8B4545] text-white"}`}
            >
              <BookOpen size={28} />
            </div>
            <div>
              <h2
                className={`text-3xl font-bold tracking-tight ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Daily Adhkar
              </h2>
              <p
                className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-[#8B4545]/70"}`}
              >
                Spiritual protection and remembrance
              </p>
            </div>
          </div>
          <button
            onClick={resetAll}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-md ${darkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-amber-50 text-[#8B4545] hover:bg-amber-100"}`}
          >
            <RotateCcw size={18} />
            <span>Reset All</span>
          </button>
        </div>

        {/* Custom Tab Switcher */}
        <div
          className={`flex p-1.5 rounded-3xl mb-10 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
        >
          <button
            onClick={() => setActiveTab("morning")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.25rem] font-bold text-sm transition-all ${activeTab === "morning" ? (darkMode ? "bg-amber-600 text-white shadow-lg" : "bg-white text-[#8B4545] shadow-md") : darkMode ? "text-gray-500 hover:text-gray-300" : "text-[#8B4545]/50 hover:text-[#8B4545]"}`}
          >
            <Sun size={18} /> Morning
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.25rem] font-bold text-sm transition-all ${activeTab === "evening" ? (darkMode ? "bg-amber-600 text-white shadow-lg" : "bg-white text-[#8B4545] shadow-md") : darkMode ? "text-gray-500 hover:text-gray-300" : "text-[#8B4545]/50 hover:text-[#8B4545]"}`}
          >
            <Moon size={18} /> Evening
          </button>
        </div>

        {/* Overall Progress */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span
              className={`text-sm font-bold uppercase tracking-widest ${darkMode ? "text-gray-400" : "text-[#8B4545]/60"}`}
            >
              Overall Progress
            </span>
            <span
              className={`text-2xl font-black ${darkMode ? "text-amber-500" : "text-[#8B4545]"}`}
            >
              {totalCompleted}/{currentAdhkar.length}
            </span>
          </div>
          <div
            className={`h-4 rounded-full shadow-inner overflow-hidden ${darkMode ? "bg-gray-900" : "bg-amber-50"}`}
          >
            <div
              className={`h-full transition-all duration-1000 ease-out rounded-full ${darkMode ? "bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.3)]" : "bg-[#8B4545]"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Adhkar Items Grid */}
      <div className="grid grid-cols-1 gap-6">
        {currentAdhkar.map((dhikr) => {
          const count = progress.counters[dhikr.id] || 0;
          const isCompleted = progress.completed[dhikr.id] || false;

          return (
            <div
              key={dhikr.id}
              className={`group relative p-8 md:p-10 rounded-[2.5rem] border-4 transition-all duration-300 ${isCompleted ? (darkMode ? "bg-gray-900/40 border-gray-800 opacity-60" : "bg-gray-50 border-transparent opacity-70 scale-95") : darkMode ? "bg-gray-800 border-gray-700/50 hover:border-amber-500/50" : "bg-white border-white hover:shadow-2xl hover:-translate-y-1"}`}
            >
              <div className="flex justify-between items-start mb-8">
                <div
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${darkMode ? "bg-gray-700 text-amber-500" : "bg-amber-50 text-[#8B4545]"}`}
                >
                  {dhikr.category.replace("_", " ")}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetDhikr(dhikr.id);
                  }}
                  className={`p-2 rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500`}
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <div className="space-y-8 text-center md:text-right">
                <p
                  className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-[1.8] font-serif break-words ${darkMode ? "text-amber-100" : "text-[#5C2E2E]"}`}
                  dir="rtl"
                >
                  {dhikr.arabic}
                </p>
                <div className="text-center md:text-left space-y-4">
                  <p
                    className={`text-xs sm:text-sm md:text-base italic font-serif leading-relaxed break-words ${darkMode ? "text-gray-400" : "text-[#8B4545]/70"}`}
                  >
                    {dhikr.transliteration}
                  </p>
                  <p
                    className={`text-sm sm:text-base md:text-lg font-medium leading-relaxed break-words ${darkMode ? "text-gray-200" : "text-[#5C2E2E]"}`}
                  >
                    {dhikr.translation}
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {/* Counter Controls */}
                  <div className="flex items-center gap-3">
                    {/* Decrement Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        decrementCounter(dhikr);
                      }}
                      disabled={count === 0}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                        count === 0
                          ? "opacity-30 cursor-not-allowed"
                          : darkMode
                            ? "bg-gray-700 text-gray-100 hover:bg-gray-600 active:scale-95"
                            : "bg-gray-200 text-[#5C2E2E] hover:bg-gray-300 active:scale-95"
                      }`}
                    >
                      −
                    </button>

                    {/* Count Display */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isCompleted) incrementCounter(dhikr);
                      }}
                      className={`h-16 w-16 rounded-full flex items-center justify-center font-black text-2xl transition-all cursor-pointer ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : darkMode
                            ? "bg-gray-700 text-amber-500 hover:bg-gray-600 active:scale-95"
                            : "bg-amber-50 text-[#8B4545] hover:bg-amber-100 active:scale-95"
                      }`}
                    >
                      {isCompleted ? <CheckCircle size={32} /> : count}
                    </div>

                    {/* Increment Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        incrementCounter(dhikr);
                      }}
                      disabled={isCompleted}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all ${
                        isCompleted
                          ? "opacity-30 cursor-not-allowed"
                          : darkMode
                            ? "bg-amber-600 text-white hover:bg-amber-700 active:scale-95"
                            : "bg-[#8B4545] text-white hover:bg-[#6B3535] active:scale-95"
                      }`}
                    >
                      +
                    </button>
                  </div>

                  <div className="text-sm font-bold uppercase tracking-widest opacity-40">
                    of {dhikr.repetitions}
                  </div>
                </div>
                <div
                  className={`px-5 py-2 rounded-2xl text-xs font-bold ${darkMode ? "bg-gray-900 text-gray-500" : "bg-gray-100 text-gray-400"}`}
                >
                  {dhikr.reference || "Authentic Source"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
