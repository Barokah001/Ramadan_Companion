// src/components/WeeklySummary.tsx - Fully Responsive

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Calendar,
  Award,
  Heart,
  BookOpen,
  CheckCircle,
  Sparkles,
  Loader,
} from "lucide-react";
import { storage } from "../lib/supabase";

interface DayData {
  date: string;
  prayers: number;
  quranPages: number;
  morningDhikr: boolean;
  eveningDhikr: boolean;
  customTasksCompleted: number;
  totalProgress: number;
}

interface AIInsight {
  feedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

interface WeeklySummaryProps {
  darkMode?: boolean;
  userId?: string;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({
  darkMode = false,
}) => {
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    loadWeekData();
  }, []);

  const loadWeekData = async () => {
    setLoading(true);
    const data: DayData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      try {
        const stored = await storage.get(`daily-tasks-${dateStr}`);
        if (stored) {
          const dayData = JSON.parse(stored.value);

          const prayerCount =
            dayData.prayers?.filter((p: { completed: boolean }) => p.completed)
              .length || 0;
          const customCompleted =
            dayData.customTasks?.filter(
              (t: { completed: boolean }) => t.completed,
            ).length || 0;

          const totalProgress = Math.round(
            (prayerCount / 5) * 40 +
              (dayData.morningDhikr ? 20 : 0) +
              (dayData.eveningDhikr ? 20 : 0) +
              Math.min((dayData.quranPages || 0) / 4, 1) * 20,
          );

          data.push({
            date: dateStr,
            prayers: prayerCount,
            quranPages: dayData.quranPages || 0,
            morningDhikr: dayData.morningDhikr || false,
            eveningDhikr: dayData.eveningDhikr || false,
            customTasksCompleted: customCompleted,
            totalProgress,
          });
        } else {
          data.push({
            date: dateStr,
            prayers: 0,
            quranPages: 0,
            morningDhikr: false,
            eveningDhikr: false,
            customTasksCompleted: 0,
            totalProgress: 0,
          });
        }
      } catch (err) {
        data.push({
          date: dateStr,
          prayers: 0,
          quranPages: 0,
          morningDhikr: false,
          eveningDhikr: false,
          customTasksCompleted: 0,
          totalProgress: 0,
        });
      }
    }

    setWeekData(data);
    setLoading(false);

    if (data.length > 0) {
      await generateAIInsights(data);
    }
  };

  const generateAIInsights = async (data: DayData[]) => {
    setGeneratingAI(true);

    try {
      const weekStart = data[0]?.date || new Date().toISOString().split("T")[0];
      const stored = await storage.get(`ai-feedback-${weekStart}`);

      if (stored) {
        setAiInsight(JSON.parse(stored.value));
        setGeneratingAI(false);
        return;
      }

      const stats = {
        totalPrayers: data.reduce((sum, day) => sum + day.prayers, 0),
        totalQuran: data.reduce((sum, day) => sum + day.quranPages, 0),
        totalDhikr: data.reduce(
          (sum, day) =>
            sum + (day.morningDhikr ? 1 : 0) + (day.eveningDhikr ? 1 : 0),
          0,
        ),
        avgProgress: Math.round(
          data.reduce((sum, day) => sum + day.totalProgress, 0) / data.length,
        ),
      };

      const insights: AIInsight = {
        feedback: `MashaAllah! You completed ${stats.totalPrayers} out of 35 prayers this week (${Math.round((stats.totalPrayers / 35) * 100)}%). Keep up the dedication!`,
        strengths:
          stats.totalPrayers >= 28
            ? ["Excellent prayer consistency", "Strong spiritual discipline"]
            : ["Taking steps toward spiritual growth", "Building good habits"],
        improvements:
          stats.totalPrayers < 28
            ? [
                "Focus on completing all 5 daily prayers",
                "Set prayer reminders",
              ]
            : [
                "Continue your excellent momentum",
                "Help others stay consistent",
              ],
        recommendations: [
          "Set prayer time reminders on your phone",
          "Read one page of Quran after each prayer",
          "Complete morning adhkar daily for blessings",
        ],
      };

      await storage.set(`ai-feedback-${weekStart}`, JSON.stringify(insights));
      setAiInsight(insights);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const avgProgress =
    weekData.length > 0
      ? Math.round(
          weekData.reduce((sum, day) => sum + day.totalProgress, 0) /
            weekData.length,
        )
      : 0;

  const totalPrayers = weekData.reduce((sum, day) => sum + day.prayers, 0);
  const totalQuran = weekData.reduce((sum, day) => sum + day.quranPages, 0);
  const totalDhikr = weekData.reduce(
    (sum, day) => sum + (day.morningDhikr ? 1 : 0) + (day.eveningDhikr ? 1 : 0),
    0,
  );

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getBadge = () => {
    if (avgProgress >= 90)
      return { emoji: "🏆", text: "Champion", color: "text-yellow-500" };
    if (avgProgress >= 70)
      return { emoji: "⭐", text: "Star", color: "text-blue-500" };
    if (avgProgress >= 50)
      return { emoji: "🌟", text: "Achiever", color: "text-purple-500" };
    return { emoji: "🌱", text: "Growing", color: "text-emerald-500" };
  };

  const badge = getBadge();

  if (loading) {
    return (
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-12 sm:p-16 shadow-xl border text-center`}
      >
        <Loader
          className={`${
            darkMode ? "text-gray-100" : "text-[#5C2E2E]"
          } animate-spin mx-auto mb-4`}
          size={48}
        />
        <p
          className={`${
            darkMode ? "text-gray-400" : "text-[#8B4545]"
          } text-base sm:text-lg`}
        >
          Loading your weekly summary...
        </p>
      </div>
    );
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className={`p-3 rounded-full ${
                darkMode ? "bg-amber-600" : "bg-[#8B4545]"
              } shadow-lg`}
            >
              <Calendar className="text-white" size={24} />
            </div>
            <div>
              <h2
                className={`text-2xl sm:text-3xl font-bold ${
                  darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                }`}
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Weekly Summary
              </h2>
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-400" : "text-[#8B4545]"
                } mt-1`}
              >
                Your spiritual journey this week
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-5xl sm:text-6xl mb-2">{badge.emoji}</div>
            <div
              className={`text-base sm:text-lg font-semibold ${badge.color}`}
            >
              {badge.text}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <h3
          className={`text-xl sm:text-2xl font-bold ${
            darkMode ? "text-gray-100" : "text-[#5C2E2E]"
          } mb-6`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Daily Progress
        </h3>

        <div className="flex items-end justify-between gap-2 sm:gap-3 h-48 sm:h-56 lg:h-64">
          {weekData.map((day, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2 sm:gap-3"
            >
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 ${
                    darkMode ? "bg-amber-600" : "bg-[#8B4545]"
                  } shadow-md`}
                  style={{ height: `${day.totalProgress}%` }}
                />
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-400" : "text-[#8B4545]"
                } font-medium text-center`}
              >
                {getDayName(day.date)}
              </div>
              <div
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                } font-bold`}
              >
                {day.totalProgress}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2.5 sm:p-3 rounded-full bg-green-500 shadow-lg">
              <CheckCircle className="text-white" size={20} />
            </div>
            <h4
              className={`font-semibold text-base sm:text-lg ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
            >
              Prayers
            </h4>
          </div>
          <div
            className={`text-4xl sm:text-5xl font-bold ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            } mb-2`}
          >
            {totalPrayers}/35
          </div>
          <div
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            }`}
          >
            {Math.round((totalPrayers / 35) * 100)}% completed
          </div>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2.5 sm:p-3 rounded-full bg-blue-500 shadow-lg">
              <BookOpen className="text-white" size={20} />
            </div>
            <h4
              className={`font-semibold text-base sm:text-lg ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
            >
              Quran
            </h4>
          </div>
          <div
            className={`text-4xl sm:text-5xl font-bold ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            } mb-2`}
          >
            {totalQuran}
          </div>
          <div
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            }`}
          >
            Pages read this week
          </div>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border sm:col-span-2 lg:col-span-1`}
        >
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2.5 sm:p-3 rounded-full bg-purple-500 shadow-lg">
              <Heart className="text-white" size={20} />
            </div>
            <h4
              className={`font-semibold text-base sm:text-lg ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
            >
              Adhkar
            </h4>
          </div>
          <div
            className={`text-4xl sm:text-5xl font-bold ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            } mb-2`}
          >
            {totalDhikr}/14
          </div>
          <div
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            }`}
          >
            Sessions completed
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {generatingAI ? (
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-8 sm:p-12 shadow-xl border text-center`}
        >
          <Loader
            className={`${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            } animate-spin mx-auto mb-4`}
            size={40}
          />
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            } text-base sm:text-lg`}
          >
            Generating insights...
          </p>
        </div>
      ) : (
        aiInsight && (
          <div
            className={`${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-[#5C2E2E]/10"
            } rounded-2xl p-6 sm:p-8 shadow-xl border`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              <div
                className={`p-3 sm:p-4 rounded-full ${
                  darkMode ? "bg-amber-600" : "bg-[#8B4545]"
                } flex-shrink-0 shadow-lg`}
              >
                <Sparkles className="text-white" size={24} />
              </div>

              <div className="flex-1">
                <h3
                  className={`text-xl sm:text-2xl font-bold ${
                    darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                  } mb-4`}
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Your Insights
                </h3>

                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-[#8B4545]"
                  } text-base sm:text-lg mb-6 leading-relaxed`}
                >
                  {aiInsight.feedback}
                </p>

                {aiInsight.strengths.length > 0 && (
                  <div
                    className={`p-4 sm:p-6 rounded-xl mb-6 ${
                      darkMode ? "bg-green-900/20" : "bg-green-50"
                    }`}
                  >
                    <h4
                      className={`font-semibold ${
                        darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                      } mb-3 text-base sm:text-lg flex items-center gap-2`}
                    >
                      <CheckCircle size={20} className="text-green-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {aiInsight.strengths.map((strength, i) => (
                        <li
                          key={i}
                          className={`text-sm sm:text-base ${
                            darkMode ? "text-gray-300" : "text-[#8B4545]"
                          } flex items-start gap-2`}
                        >
                          <span className="text-green-500 flex-shrink-0 mt-1">
                            ✓
                          </span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div
                  className={`p-4 sm:p-6 rounded-xl ${
                    darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"
                  }`}
                >
                  <h4
                    className={`font-semibold ${
                      darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                    } mb-3 text-base sm:text-lg flex items-center gap-2`}
                  >
                    <TrendingUp size={20} />
                    Recommendations
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {aiInsight.recommendations.map((rec, i) => (
                      <li
                        key={i}
                        className={`flex items-start gap-3 text-sm sm:text-base ${
                          darkMode ? "text-gray-300" : "text-[#8B4545]"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            darkMode
                              ? "bg-amber-600 text-white"
                              : "bg-[#8B4545] text-white"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="flex-1">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Weekly Average Card */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-8 sm:p-12 shadow-xl border text-center`}
      >
        <div
          className={`inline-block p-4 sm:p-6 rounded-full mb-6 ${
            darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"
          } shadow-lg`}
        >
          <Award
            className={darkMode ? "text-amber-500" : "text-[#8B4545]"}
            size={48}
          />
        </div>

        <h3
          className={`text-xl sm:text-2xl font-bold ${
            darkMode ? "text-gray-100" : "text-[#5C2E2E]"
          } mb-4`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Weekly Average
        </h3>

        <div
          className={`text-6xl sm:text-7xl font-bold mb-3 ${
            darkMode ? "text-amber-500" : "text-[#8B4545]"
          }`}
        >
          {avgProgress}%
        </div>

        <p
          className={`text-base sm:text-lg ${
            darkMode ? "text-gray-400" : "text-[#8B4545]"
          } font-medium`}
        >
          {avgProgress >= 70
            ? "Excellent! Keep it up! 🌟"
            : avgProgress >= 50
              ? "Good progress! Keep going! 💪"
              : "Stay consistent! You can do it! 🌱"}
        </p>
      </div>
    </div>
  );
};
