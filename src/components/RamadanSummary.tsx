/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/RamadanSummary.tsx - Complete Ramadan Journey Summary

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Award,
  Heart,
  BookOpen,
  CheckCircle,
  Sparkles,
  Loader,
  TrendingUp,
  Star,
  Moon,
} from "lucide-react";
import { storage } from "../lib/supabase";

interface RamadanDay {
  date: string;
  prayers: number;
  quranPages: number;
  morningDhikr: boolean;
  eveningDhikr: boolean;
  customTasksCompleted: number;
  totalProgress: number;
  dayNumber: number;
}

interface RamadanSummaryProps {
  darkMode?: boolean;
  username: string;
  ramadanStartDate: string; // Format: "2026-03-01"
  ramadanDays: number; // 29 or 30
}

export const RamadanSummary: React.FC<RamadanSummaryProps> = ({
  darkMode = false,
  username,
  ramadanStartDate,
  ramadanDays,
}) => {
  const [allDays, setAllDays] = useState<RamadanDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // 0 = All, 1-4 = specific weeks

  useEffect(() => {
    loadRamadanData();
  }, [username, ramadanStartDate, ramadanDays]);

  const loadRamadanData = async () => {
    setLoading(true);
    const data: RamadanDay[] = [];
    const startDate = new Date(ramadanStartDate);

    for (let i = 0; i < ramadanDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
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
            totalProgress,
            dayNumber: i + 1,
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
            dayNumber: i + 1,
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
          dayNumber: i + 1,
        });
      }
    }

    setAllDays(data);
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Calculate stats
  const totalPrayers = allDays.reduce((sum, day) => sum + day.prayers, 0);
  const maxPrayers = ramadanDays * 5;
  const totalQuran = allDays.reduce((sum, day) => sum + day.quranPages, 0);
  const totalMorningDhikr = allDays.filter((d) => d.morningDhikr).length;
  const totalEveningDhikr = allDays.filter((d) => d.eveningDhikr).length;
  const avgProgress =
    allDays.length > 0
      ? Math.round(
          allDays.reduce((sum, day) => sum + day.totalProgress, 0) /
            allDays.length,
        )
      : 0;

  // Find best streak
  let currentStreak = 0;
  let bestStreak = 0;
  allDays.forEach((day) => {
    if (day.totalProgress >= 70) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Find top 3 days
  const topDays = [...allDays]
    .sort((a, b) => b.totalProgress - a.totalProgress)
    .slice(0, 3);

  // Weekly breakdown
  const weeks = [];
  for (let i = 0; i < Math.ceil(ramadanDays / 7); i++) {
    weeks.push({
      number: i + 1,
      days: allDays.slice(i * 7, (i + 1) * 7),
    });
  }

  const getBadge = () => {
    if (avgProgress >= 90)
      return {
        emoji: "🏆",
        text: "Ramadan Champion",
        color: "text-yellow-500",
      };
    if (avgProgress >= 75)
      return { emoji: "⭐", text: "Star Achiever", color: "text-blue-500" };
    if (avgProgress >= 60)
      return {
        emoji: "🌟",
        text: "Dedicated Worshipper",
        color: "text-purple-500",
      };
    if (avgProgress >= 40)
      return { emoji: "💪", text: "Strong Effort", color: "text-emerald-500" };
    return { emoji: "🌱", text: "Growing Soul", color: "text-green-500" };
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
          className={`${darkMode ? "text-gray-400" : "text-[#8B4545]"} text-lg`}
        >
          Loading your Ramadan journey...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-[#8B4545] to-[#6B3535] border-white"
        } rounded-3xl p-8 sm:p-12 shadow-2xl border-4 text-center relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 text-9xl opacity-5">🌙</div>
        <div className="relative z-10">
          <div className="text-7xl mb-4">{badge.emoji}</div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white mb-3"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ramadan {new Date(ramadanStartDate).getFullYear()}
          </h1>
          <p className="text-white/80 text-lg mb-6">
            Your Complete {ramadanDays}-Day Spiritual Journey
          </p>
          <div
            className={`inline-block px-6 py-3 rounded-full text-xl font-bold ${badge.color} bg-white`}
          >
            {badge.text}
          </div>
        </div>
      </div>

      {/* Overall Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border text-center`}
        >
          <CheckCircle className="mx-auto mb-3 text-green-500" size={32} />
          <div
            className={`text-4xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          >
            {totalPrayers}
          </div>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
          >
            Total Prayers
          </p>
          <p
            className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            out of {maxPrayers}
          </p>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border text-center`}
        >
          <BookOpen className="mx-auto mb-3 text-blue-500" size={32} />
          <div
            className={`text-4xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          >
            {totalQuran}
          </div>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
          >
            Quran Pages
          </p>
          <p
            className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            {(totalQuran / 6.04).toFixed(1)} Juz
          </p>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border text-center`}
        >
          <Heart className="mx-auto mb-3 text-purple-500" size={32} />
          <div
            className={`text-4xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          >
            {totalMorningDhikr + totalEveningDhikr}
          </div>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
          >
            Adhkar Sessions
          </p>
          <p
            className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            {totalMorningDhikr} morning • {totalEveningDhikr} evening
          </p>
        </div>

        <div
          className={`${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-[#5C2E2E]/10"
          } rounded-2xl p-6 shadow-xl border text-center`}
        >
          <Star className="mx-auto mb-3 text-amber-500" size={32} />
          <div
            className={`text-4xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          >
            {bestStreak}
          </div>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
          >
            Best Streak
          </p>
          <p
            className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
          >
            days above 70%
          </p>
        </div>
      </div>

      {/* Top 3 Days */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          🏆 Your Top 3 Days
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topDays.map((day, index) => (
            <div
              key={day.date}
              className={`p-6 rounded-xl border-2 ${
                index === 0
                  ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-400"
                  : index === 1
                    ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-400"
                    : "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-600"
              }`}
            >
              <div className="text-4xl mb-2">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
              </div>
              <p className="font-bold text-lg text-gray-900 mb-1">
                Day {day.dayNumber}
              </p>
              <p className="text-sm text-gray-700 mb-3">
                {formatDate(day.date)}
              </p>
              <div className="text-3xl font-bold text-gray-900">
                {day.totalProgress}%
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {day.prayers}/5 prayers • {day.quranPages} pages
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Breakdown */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          📊 Weekly Breakdown
        </h3>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedWeek(0)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedWeek === 0
                ? darkMode
                  ? "bg-amber-600 text-white"
                  : "bg-[#8B4545] text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-[#8B4545]"
            }`}
          >
            All Weeks
          </button>
          {weeks.map((week) => (
            <button
              key={week.number}
              onClick={() => setSelectedWeek(week.number)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedWeek === week.number
                  ? darkMode
                    ? "bg-amber-600 text-white"
                    : "bg-[#8B4545] text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-[#8B4545]"
              }`}
            >
              Week {week.number}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {(selectedWeek === 0
            ? allDays
            : weeks[selectedWeek - 1]?.days || []
          ).map((day) => (
            <div
              key={day.date}
              className={`aspect-square p-2 rounded-lg text-center flex flex-col items-center justify-center ${
                day.totalProgress >= 80
                  ? "bg-green-500 text-white"
                  : day.totalProgress >= 60
                    ? darkMode
                      ? "bg-amber-600 text-white"
                      : "bg-amber-500 text-white"
                    : day.totalProgress >= 40
                      ? darkMode
                        ? "bg-gray-600 text-white"
                        : "bg-yellow-300 text-gray-900"
                      : darkMode
                        ? "bg-gray-700 text-gray-400"
                        : "bg-gray-200 text-gray-600"
              }`}
            >
              <div className="text-xs font-bold mb-1">{day.dayNumber}</div>
              <div className="text-lg font-bold">{day.totalProgress}%</div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4 flex-wrap justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
              80%+
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${darkMode ? "bg-amber-600" : "bg-amber-500"}`}
            ></div>
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
              60-79%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${darkMode ? "bg-gray-600" : "bg-yellow-300"}`}
            ></div>
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
              40-59%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-4 h-4 rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            ></div>
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
              0-39%
            </span>
          </div>
        </div>
      </div>

      {/* Final Message */}
      <div
        className={`${
          darkMode
            ? "bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700"
            : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        } rounded-2xl p-8 shadow-xl border-2 text-center`}
      >
        <Moon
          className={`mx-auto mb-4 ${darkMode ? "text-amber-400" : "text-amber-600"}`}
          size={48}
        />
        <h3
          className={`text-2xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {avgProgress >= 70
            ? "MashaAllah! What an Amazing Journey! 🌟"
            : avgProgress >= 50
              ? "You Made Great Progress! Keep It Up! 💪"
              : "Every Step Counts! You Showed Up! 🌱"}
        </h3>
        <p
          className={`text-lg leading-relaxed max-w-2xl mx-auto ${darkMode ? "text-gray-300" : "text-[#8B4545]"}`}
        >
          {avgProgress >= 70
            ? `You achieved an average of ${avgProgress}% throughout Ramadan. Your dedication and consistency are truly inspiring. May Allah accept all your efforts and grant you the rewards of Laylatul Qadr! 🤲`
            : avgProgress >= 50
              ? `You maintained an average of ${avgProgress}% throughout this blessed month. Your effort and commitment are commendable. May Allah continue to guide you and increase you in faith! 🤲`
              : `You achieved ${avgProgress}% this Ramadan. Remember, every prayer, every page, every dhikr counts! May Allah accept your efforts and make next Ramadan even better! 🤲`}
        </p>
        <div className="mt-6 text-4xl">🌙</div>
      </div>
    </div>
  );
};
