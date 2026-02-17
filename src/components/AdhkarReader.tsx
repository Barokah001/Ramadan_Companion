/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/AdhkarReader.tsx - FIXED: Morning & evening progress are fully separate

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, RotateCcw, BookOpen, Sun, Moon } from "lucide-react";
import { morningAdhkar, eveningAdhkar, type DhikrItem } from "../lib/adhkar";
import { storage } from "../lib/supabase";

interface AdhkarReaderProps {
  darkMode?: boolean;
  username?: string;
}

interface DhikrProgress {
  counters: { [key: string]: number };
  completed: { [key: string]: boolean };
}

const EMPTY_PROGRESS: DhikrProgress = { counters: {}, completed: {} };

export const AdhkarReader: React.FC<AdhkarReaderProps> = ({
  darkMode = false,
  username,
}) => {
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");

  // Each tab has its OWN independent progress state
  const [morningProgress, setMorningProgress] =
    useState<DhikrProgress>(EMPTY_PROGRESS);
  const [eveningProgress, setEveningProgress] =
    useState<DhikrProgress>(EMPTY_PROGRESS);

  const currentAdhkar = activeTab === "morning" ? morningAdhkar : eveningAdhkar;
  const currentProgress =
    activeTab === "morning" ? morningProgress : eveningProgress;
  const setCurrentProgress =
    activeTab === "morning" ? setMorningProgress : setEveningProgress;

  // Track whether we've loaded each tab (to avoid saving before loading)
  const morningLoaded = useRef(false);
  const eveningLoaded = useRef(false);
  const currentLoaded = activeTab === "morning" ? morningLoaded : eveningLoaded;

  // ── Load progress for the current tab whenever the tab changes ─────────
  useEffect(() => {
    const loadProgress = async () => {
      currentLoaded.current = false;
      try {
        const today = new Date().toISOString().split("T")[0];
        // Key includes both tab AND date → fully isolated
        const key = `adhkar-${activeTab}-${today}`;
        const stored = await storage.get(key);
        if (stored) {
          setCurrentProgress(JSON.parse(stored.value));
        } else {
          setCurrentProgress(EMPTY_PROGRESS);
        }
      } catch {
        setCurrentProgress(EMPTY_PROGRESS);
      } finally {
        currentLoaded.current = true;
      }
    };
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ── Save whenever morningProgress changes (only after it's been loaded) ─
  useEffect(() => {
    if (!morningLoaded.current) return;
    const save = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        await storage.set(
          `adhkar-morning-${today}`,
          JSON.stringify(morningProgress),
        );
      } catch {
        /* silent */
      }
    };
    save();
  }, [morningProgress]);

  // ── Save whenever eveningProgress changes (only after it's been loaded) ─
  useEffect(() => {
    if (!eveningLoaded.current) return;
    const save = async () => {
      const today = new Date().toISOString().split("T")[0];
      try {
        await storage.set(
          `adhkar-evening-${today}`,
          JSON.stringify(eveningProgress),
        );
      } catch {
        /* silent */
      }
    };
    save();
  }, [eveningProgress]);

  const incrementCounter = (dhikr: DhikrItem) => {
    setCurrentProgress((prev) => {
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
    setCurrentProgress((prev) => {
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
    setCurrentProgress((prev) => ({
      counters: { ...prev.counters, [id]: 0 },
      completed: { ...prev.completed, [id]: false },
    }));
  };

  const resetAll = () => setCurrentProgress(EMPTY_PROGRESS);

  const totalCompleted = currentAdhkar.filter(
    (d) => currentProgress.completed[d.id],
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

        {/* Tab Switcher */}
        <div
          className={`flex p-1.5 rounded-3xl mb-10 ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
        >
          {(["morning", "evening"] as const).map((tab) => {
            const tabProgress =
              tab === "morning" ? morningProgress : eveningProgress;
            const tabAdhkar = tab === "morning" ? morningAdhkar : eveningAdhkar;
            const tabDone = tabAdhkar.filter(
              (d) => tabProgress.completed[d.id],
            ).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.25rem] font-bold text-sm transition-all ${
                  isActive
                    ? darkMode
                      ? "bg-amber-600 text-white shadow-lg"
                      : "bg-white text-[#8B4545] shadow-md"
                    : darkMode
                      ? "text-gray-500 hover:text-gray-300"
                      : "text-[#8B4545]/50 hover:text-[#8B4545]"
                }`}
              >
                {tab === "morning" ? <Sun size={18} /> : <Moon size={18} />}
                <span>{tab === "morning" ? "Morning" : "Evening"}</span>
                {/* Mini badge showing other tab progress */}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : darkMode ? "bg-gray-700" : "bg-gray-200"}`}
                >
                  {tabDone}/{tabAdhkar.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Overall Progress for current tab */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span
              className={`text-sm font-bold uppercase tracking-widest ${darkMode ? "text-gray-400" : "text-[#8B4545]/60"}`}
            >
              {activeTab === "morning" ? "Morning" : "Evening"} Progress
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

      {/* Adhkar Items */}
      <div className="grid grid-cols-1 gap-6">
        {currentAdhkar.map((dhikr) => {
          const count = currentProgress.counters[dhikr.id] || 0;
          const isCompleted = currentProgress.completed[dhikr.id] || false;

          return (
            <div
              key={dhikr.id}
              className={`group relative p-8 md:p-10 rounded-[2.5rem] border-4 transition-all duration-300 ${
                isCompleted
                  ? darkMode
                    ? "bg-gray-900/40 border-gray-800 opacity-60"
                    : "bg-gray-50 border-transparent opacity-70 scale-95"
                  : darkMode
                    ? "bg-gray-800 border-gray-700/50 hover:border-amber-500/50"
                    : "bg-white border-white hover:shadow-2xl hover:-translate-y-1"
              }`}
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
                  className="p-2 rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-300 hover:text-red-500"
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
                  <div className="flex items-center gap-3">
                    {/* Decrement */}
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

                    {/* Increment */}
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
