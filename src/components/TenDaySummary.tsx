/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/TenDaySummary.tsx - 10-Day Summary with Daily Journal View

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
  ChevronDown,
  ChevronUp,
  Circle,
  X,
} from "lucide-react";
import { storage } from "../lib/supabase";

interface DayData {
  date: string;
  prayers: number;
  quranPages: number;
  morningDhikr: boolean;
  eveningDhikr: boolean;
  customTasksCompleted: number;
  customTasksTotal: number;
  totalProgress: number;
}

interface Prayer {
  name: string;
  completed: boolean;
}

interface CustomTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface DailyJournalViewProps {
  date: string;
  username: string;
  darkMode: boolean;
}

interface AIInsight {
  feedback: string;
  bestDay: { date: string; score: number } | null;
  worstDay: { date: string; score: number } | null;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

// Daily Journal View Component
const DailyJournalView: React.FC<DailyJournalViewProps> = ({
  date,
  username,
  darkMode,
}) => {
  const [dayData, setDayData] = useState<{
    prayers?: Prayer[];
    quranPages?: number;
    morningDhikr?: boolean;
    eveningDhikr?: boolean;
    customTasks?: CustomTask[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDayData = async () => {
      try {
        const stored = await storage.get(`daily-tasks:${username}:${date}`);
        if (stored) {
          setDayData(JSON.parse(stored.value));
        }
      } catch (error) {
        console.error("Failed to load day data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDayData();
  }, [date, username]);

  if (loading) {
    return (
      <div
        className={`p-4 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} text-center`}
      >
        <Loader className="animate-spin mx-auto" size={24} />
      </div>
    );
  }

  if (!dayData) {
    return (
      <div
        className={`p-4 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
      >
        <p
          className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          No data for this day
        </p>
      </div>
    );
  }

  const prayers: Prayer[] = dayData.prayers || [];
  const customTasks: CustomTask[] = dayData.customTasks || [];
  const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return (
    <div
      className={`p-6 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} space-y-6`}
    >
      {/* Prayers Section */}
      <div>
        <h4
          className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
        >
          <CheckCircle size={18} className="text-green-500" />
          Daily Prayers
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRAYER_NAMES.map((prayerName, index) => {
            const prayer = prayers[index];
            const isCompleted = prayer?.completed || false;
            return (
              <div
                key={prayerName}
                className={`p-3 rounded-lg text-center ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-400"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <div className="text-xs font-medium mb-1">{prayerName}</div>
                <div>
                  {isCompleted ? (
                    <CheckCircle size={16} className="mx-auto" />
                  ) : (
                    <Circle size={16} className="mx-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quran & Adhkar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}
        >
          <p
            className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-[#5C2E2E]"}`}
          >
            Quran Pages
          </p>
          <p
            className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}
          >
            {dayData.quranPages || 0}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}
        >
          <p
            className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-[#5C2E2E]"}`}
          >
            Morning Adhkar
          </p>
          <div className="flex items-center gap-2">
            {dayData.morningDhikr ? (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <span
                  className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}
                >
                  Completed
                </span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={20} />
                <span
                  className={`text-sm font-medium ${darkMode ? "text-red-400" : "text-red-600"}`}
                >
                  Missed
                </span>
              </>
            )}
          </div>
        </div>

        <div
          className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}
        >
          <p
            className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-[#5C2E2E]"}`}
          >
            Evening Adhkar
          </p>
          <div className="flex items-center gap-2">
            {dayData.eveningDhikr ? (
              <>
                <CheckCircle className="text-green-500" size={20} />
                <span
                  className={`text-sm font-medium ${darkMode ? "text-green-400" : "text-green-600"}`}
                >
                  Completed
                </span>
              </>
            ) : (
              <>
                <X className="text-red-500" size={20} />
                <span
                  className={`text-sm font-medium ${darkMode ? "text-red-400" : "text-red-600"}`}
                >
                  Missed
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Custom Tasks */}
      {customTasks.length > 0 && (
        <div>
          <h4
            className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          >
            <Sparkles
              size={18}
              className={darkMode ? "text-amber-500" : "text-[#8B4545]"}
            />
            Custom Tasks ({customTasks.filter((t) => t.completed).length}/
            {customTasks.length})
          </h4>
          <div className="space-y-2">
            {customTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                {task.completed ? (
                  <CheckCircle
                    className="text-green-500 flex-shrink-0"
                    size={18}
                  />
                ) : (
                  <Circle
                    className={`flex-shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                    size={18}
                  />
                )}
                <span
                  className={`flex-1 ${task.completed ? "line-through opacity-60" : ""} ${
                    darkMode ? "text-gray-200" : "text-[#5C2E2E]"
                  }`}
                >
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface AIInsight {
  feedback: string;
  bestDay: { date: string; score: number } | null;
  worstDay: { date: string; score: number } | null;
  strengths: string[];
  improvements: string[];
}

interface TenDaySummaryProps {
  darkMode?: boolean;
  username: string;
}

export const TenDaySummary: React.FC<TenDaySummaryProps> = ({
  darkMode = false,
  username,
}) => {
  const [periodData, setPeriodData] = useState<DayData[]>([]);
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    loadPeriodData();
  }, [username]);

  const loadPeriodData = async () => {
    setLoading(true);
    const data: DayData[] = [];
    const today = new Date();

    // Load last 10 days
    for (let i = 9; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      try {
        const stored = await storage.get(`daily-tasks:${username}:${dateStr}`);
        if (stored) {
          const dayData = JSON.parse(stored.value);

          const prayerCount =
            dayData.prayers?.filter((p: { completed: boolean }) => p.completed)
              .length || 0;
          const customCompleted =
            dayData.customTasks?.filter(
              (t: { completed: boolean }) => t.completed,
            ).length || 0;
          const customTotal = dayData.customTasks?.length || 0;

          const totalProgress = Math.round(
            (prayerCount / 5) * 35 +
              (dayData.morningDhikr ? 15 : 0) +
              (dayData.eveningDhikr ? 15 : 0) +
              Math.min((dayData.quranPages || 0) / 4, 1) * 20 +
              (customTotal > 0 ? (customCompleted / customTotal) * 15 : 0),
          );

          data.push({
            date: dateStr,
            prayers: prayerCount,
            quranPages: dayData.quranPages || 0,
            morningDhikr: dayData.morningDhikr || false,
            eveningDhikr: dayData.eveningDhikr || false,
            customTasksCompleted: customCompleted,
            customTasksTotal: customTotal,
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
            customTasksTotal: 0,
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
          customTasksTotal: 0,
          totalProgress: 0,
        });
      }
    }

    setPeriodData(data);
    setLoading(false);

    if (data.length > 0) {
      await generateAIInsights(data);
    }
  };

  const generateAIInsights = async (data: DayData[]) => {
    setGeneratingAI(true);

    try {
      const periodStart =
        data[0]?.date || new Date().toISOString().split("T")[0];
      const stored = await storage.get(
        `ai-feedback:${username}:${periodStart}`,
      );

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

      // Find best and worst days
      const sortedDays = [...data].sort(
        (a, b) => b.totalProgress - a.totalProgress,
      );
      const bestDay = sortedDays[0].totalProgress > 0 ? sortedDays[0] : null;
      const worstDay = sortedDays[sortedDays.length - 1];

      const bestDayName = bestDay ? formatDate(bestDay.date) : "";
      const worstDayName = formatDate(worstDay.date);

      const insights: AIInsight = {
        feedback: bestDay
          ? `MashaAllah! You completed ${stats.totalPrayers} out of 50 prayers in the last 10 days (${Math.round((stats.totalPrayers / 50) * 100)}%). ${bestDay.totalProgress > 70 ? "Your dedication is inspiring!" : "Keep building consistency!"}`
          : "Start your spiritual journey today! Every small step counts.",
        bestDay: bestDay
          ? { date: bestDay.date, score: bestDay.totalProgress }
          : null,
        worstDay:
          worstDay.totalProgress < 30
            ? { date: worstDay.date, score: worstDay.totalProgress }
            : null,
        strengths:
          stats.avgProgress >= 70
            ? [
                "Excellent consistency in worship",
                "Strong spiritual discipline",
                "Building great habits",
              ]
            : stats.avgProgress >= 50
              ? [
                  "Making steady progress",
                  "Building good habits",
                  "Staying committed",
                ]
              : [
                  "Taking steps toward growth",
                  "Starting your journey",
                  "Every day is a new chance",
                ],
        improvements:
          stats.avgProgress < 70
            ? [
                bestDay && worstDay.totalProgress < 30
                  ? `You had great ibadah on ${bestDayName} (${bestDay.totalProgress}%), but ${worstDayName} was lower (${worstDay.totalProgress}%). Try to maintain consistency!`
                  : "Focus on completing all 5 daily prayers",
                "Set reminders for prayer times",
                "Start with small, achievable goals",
              ]
            : [
                "Continue your excellent momentum",
                "Help others stay consistent",
                "Challenge yourself with extra voluntary prayers",
              ],
        recommendations: [
          "Set prayer time reminders on your phone",
          "Read at least one page of Quran after each prayer",
          "Complete morning adhkar daily for protection and blessings",
          stats.totalQuran < 10
            ? "Try to read 2-3 pages of Quran daily"
            : "MashaAllah! Keep up the Quran reading",
        ],
      };

      await storage.set(
        `ai-feedback:${username}:${periodStart}`,
        JSON.stringify(insights),
      );
      setAiInsight(insights);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setGeneratingAI(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const avgProgress =
    periodData.length > 0
      ? Math.round(
          periodData.reduce((sum, day) => sum + day.totalProgress, 0) /
            periodData.length,
        )
      : 0;

  const totalPrayers = periodData.reduce((sum, day) => sum + day.prayers, 0);
  const totalQuran = periodData.reduce((sum, day) => sum + day.quranPages, 0);
  const totalDhikr = periodData.reduce(
    (sum, day) => sum + (day.morningDhikr ? 1 : 0) + (day.eveningDhikr ? 1 : 0),
    0,
  );

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
          Loading your 10-day summary...
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
                10-Day Summary
              </h2>
              <p
                className={`text-sm sm:text-base ${
                  darkMode ? "text-gray-400" : "text-[#8B4545]"
                } mt-1`}
              >
                Your spiritual journey over the last 10 days
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

      {/* Daily Breakdown */}
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
          Daily Breakdown
        </h3>

        <div className="space-y-3">
          {periodData.map((day, index) => (
            <div
              key={index}
              className={`rounded-xl border ${
                darkMode
                  ? "border-gray-700 bg-gray-900/50"
                  : "border-gray-200 bg-gray-50"
              } overflow-hidden`}
            >
              <button
                onClick={() =>
                  setExpandedDay(expandedDay === day.date ? null : day.date)
                }
                className="w-full p-4 flex items-center justify-between hover:bg-opacity-80 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl ${
                      day.totalProgress >= 70
                        ? "bg-green-500 text-white"
                        : day.totalProgress >= 40
                          ? darkMode
                            ? "bg-amber-600 text-white"
                            : "bg-amber-500 text-white"
                          : darkMode
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {day.totalProgress}%
                  </div>
                  <div className="text-left">
                    <p
                      className={`font-semibold ${
                        darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                      }`}
                    >
                      {formatDate(day.date)}
                    </p>
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-[#8B4545]"
                      }`}
                    >
                      {day.prayers}/5 prayers • {day.quranPages} pages
                    </p>
                  </div>
                </div>
                {expandedDay === day.date ? (
                  <ChevronUp
                    className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  />
                ) : (
                  <ChevronDown
                    className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  />
                )}
              </button>

              {expandedDay === day.date && (
                <DailyJournalView
                  date={day.date}
                  username={username}
                  darkMode={darkMode}
                />
              )}
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
            {totalPrayers}/50
          </div>
          <div
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            }`}
          >
            {Math.round((totalPrayers / 50) * 100)}% completed
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
            Pages read in 10 days
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
            {totalDhikr}/20
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
                  Your 10-Day Insights
                </h3>

                <p
                  className={`${
                    darkMode ? "text-gray-300" : "text-[#8B4545]"
                  } text-base sm:text-lg mb-6 leading-relaxed`}
                >
                  {aiInsight.feedback}
                </p>

                {/* Best Day Highlight */}
                {aiInsight.bestDay && (
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
                      <Award size={20} className="text-green-500" />
                      Best Day
                    </h4>
                    <p
                      className={`text-sm sm:text-base ${
                        darkMode ? "text-gray-300" : "text-[#8B4545]"
                      }`}
                    >
                      🌟 <strong>{formatDate(aiInsight.bestDay.date)}</strong> -
                      You achieved <strong>{aiInsight.bestDay.score}%</strong>{" "}
                      completion! MashaAllah!
                    </p>
                  </div>
                )}

                {/* Worst Day Note */}
                {aiInsight.worstDay && (
                  <div
                    className={`p-4 sm:p-6 rounded-xl mb-6 ${
                      darkMode ? "bg-amber-900/20" : "bg-amber-50"
                    }`}
                  >
                    <h4
                      className={`font-semibold ${
                        darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                      } mb-3 text-base sm:text-lg flex items-center gap-2`}
                    >
                      <TrendingUp size={20} className="text-amber-500" />
                      Room for Growth
                    </h4>
                    <p
                      className={`text-sm sm:text-base ${
                        darkMode ? "text-gray-300" : "text-[#8B4545]"
                      }`}
                    >
                      💪 <strong>{formatDate(aiInsight.worstDay.date)}</strong>{" "}
                      had <strong>{aiInsight.worstDay.score}%</strong>{" "}
                      completion. Every day is a fresh start!
                    </p>
                  </div>
                )}

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

      {/* 10-Day Average Card */}
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
          10-Day Average
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
