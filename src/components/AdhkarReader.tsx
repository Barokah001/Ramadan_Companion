// src/components/AdhkarReader.tsx - Fully Responsive

import React, { useState, useEffect } from "react";
import { CheckCircle, Circle, RotateCcw, BookOpen } from "lucide-react";
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header Card */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`p-3 rounded-full ${
                darkMode ? "bg-amber-600" : "bg-[#8B4545]"
              } shadow-lg`}
            >
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h2
                className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Daily Adhkar
              </h2>
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-400" : "text-[#8B4545]"
                } mt-1`}
              >
                Remember Allah throughout your day
              </p>
            </div>
          </div>

          <button
            onClick={resetAll}
            className={`self-start sm:self-auto flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 active:scale-95 shadow-md ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                : "bg-[#EAD7C0] hover:bg-[#d4c4a8] text-[#5C2E2E]"
            }`}
          >
            <RotateCcw size={18} />
            <span className="text-sm">Reset All</span>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => setActiveTab("morning")}
            className={`flex-1 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md ${
              activeTab === "morning"
                ? `${
                    darkMode ? "bg-amber-600" : "bg-[#8B4545]"
                  } text-white shadow-lg`
                : `${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-[#8B4545] hover:bg-gray-200"
                  }`
            }`}
          >
            Morning Adhkar
          </button>
          <button
            onClick={() => setActiveTab("evening")}
            className={`flex-1 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-md ${
              activeTab === "evening"
                ? `${
                    darkMode ? "bg-amber-600" : "bg-[#8B4545]"
                  } text-white shadow-lg`
                : `${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-[#8B4545] hover:bg-gray-200"
                  }`
            }`}
          >
            Evening Adhkar
          </button>
        </div>

        {/* Progress Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-400" : "text-[#8B4545]"
              }`}
            >
              Progress
            </span>
            <span
              className={`text-xl sm:text-2xl font-bold ${
                darkMode ? "text-amber-500" : "text-[#8B4545]"
              }`}
            >
              {totalCompleted}/{currentAdhkar.length}
            </span>
          </div>
          <div
            className={`h-4 sm:h-5 rounded-full overflow-hidden shadow-inner ${
              darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 shadow-md ${
                darkMode ? "bg-amber-600" : "bg-[#8B4545]"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p
            className={`text-center text-sm mt-2 ${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            }`}
          >
            {progressPercent}% Complete
          </p>
        </div>
      </div>

      {/* Adhkar List */}
      <div className="space-y-4 sm:space-y-6">
        {currentAdhkar.map((dhikr) => {
          const count = progress.counters[dhikr.id] || 0;
          const isCompleted = progress.completed[dhikr.id] || false;

          return (
            <div
              key={dhikr.id}
              className={`${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-[#5C2E2E]/10"
              } rounded-2xl p-6 sm:p-8 shadow-xl border transition-all ${
                isCompleted ? "opacity-70" : "hover:shadow-2xl"
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                  {isCompleted ? (
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={28}
                    />
                  ) : (
                    <Circle
                      className={`flex-shrink-0 ${
                        darkMode ? "text-gray-400" : "text-[#8B4545]"
                      }`}
                      size={28}
                    />
                  )}
                  <span
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-[#EAD7C0] text-[#8B4545]"
                    }`}
                  >
                    {dhikr.category.replace("_", " ")}
                  </span>
                </div>
                {dhikr.reference && (
                  <span
                    className={`text-xs sm:text-sm ${
                      darkMode ? "text-gray-400" : "text-[#8B4545]"
                    } self-start sm:self-auto`}
                  >
                    {dhikr.reference}
                  </span>
                )}
              </div>

              {/* Arabic Text */}
              <p
                className={`text-xl sm:text-2xl lg:text-3xl ${
                  darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                } mb-6 text-right leading-loose sm:leading-loose`}
                style={{ fontFamily: "Arial, sans-serif", direction: "rtl" }}
              >
                {dhikr.arabic}
              </p>

              {/* Transliteration */}
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-400" : "text-[#8B4545]"
                } italic mb-4`}
              >
                {dhikr.transliteration}
              </p>

              {/* Translation */}
              <p
                className={`text-base sm:text-lg ${
                  darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                } mb-6 leading-relaxed`}
              >
                {dhikr.translation}
              </p>

              {/* Action Bar */}
              <div
                className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => incrementCounter(dhikr)}
                    disabled={isCompleted}
                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all transform ${
                      isCompleted
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : `${
                            darkMode
                              ? "bg-amber-600 hover:bg-amber-700"
                              : "bg-[#8B4545] hover:bg-[#6B3535]"
                          } text-white hover:shadow-lg hover:scale-105 active:scale-95`
                    }`}
                  >
                    Count
                  </button>
                  <div
                    className={`text-lg sm:text-xl font-bold ${
                      darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                    }`}
                  >
                    {count} / {dhikr.repetitions}
                  </div>
                </div>

                <button
                  onClick={() => resetDhikr(dhikr.id)}
                  className={`p-3 rounded-xl transition-all transform hover:scale-110 active:scale-95 self-end sm:self-auto ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                  aria-label="Reset this dhikr"
                >
                  <RotateCcw
                    size={20}
                    className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
