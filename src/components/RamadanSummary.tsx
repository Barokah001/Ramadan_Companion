/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/RamadanSummary.tsx - FIXED: correct progress % (no custom tasks)

import React, { useState, useEffect } from "react";
import {
  Heart,
  BookOpen,
  CheckCircle,
  Loader,
  Star,
  Moon,
} from "lucide-react";
import { storage } from "../lib/supabase";

// ─── Same weights as DailyTasks / TenDaySummary ──────────────────────────────
const PRAYER_WEIGHT = 35;
const MORNING_WEIGHT = 15;
const EVENING_WEIGHT = 15;
const QURAN_WEIGHT = 20;
const QURAN_TARGET = 4;
const REQUIRED_TOTAL =
  PRAYER_WEIGHT + MORNING_WEIGHT + EVENING_WEIGHT + QURAN_WEIGHT; // 85

const calcProgress = (
  prayers: number,
  morningDhikr: boolean,
  eveningDhikr: boolean,
  quranPages: number,
): number => {
  const raw =
    (prayers / 5) * PRAYER_WEIGHT +
    (morningDhikr ? MORNING_WEIGHT : 0) +
    (eveningDhikr ? EVENING_WEIGHT : 0) +
    Math.min(quranPages / QURAN_TARGET, 1) * QURAN_WEIGHT;
  return Math.round((raw / REQUIRED_TOTAL) * 100);
};
// ─────────────────────────────────────────────────────────────────────────────

interface RamadanDay {
  date: string;
  prayers: number;
  quranPages: number;
  morningDhikr: boolean;
  eveningDhikr: boolean;
  totalProgress: number;
  dayNumber: number;
}

interface RamadanSummaryProps {
  darkMode?: boolean;
  username: string;
  ramadanStartDate: string;
  ramadanDays: number;
}

export const RamadanSummary: React.FC<RamadanSummaryProps> = ({
  darkMode = false,
  username,
  ramadanStartDate,
  ramadanDays,
}) => {
  const [allDays, setAllDays] = useState<RamadanDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState<number>(0);

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
          const d = JSON.parse(stored.value);
          const prayerCount =
            d.prayers?.filter((p: { completed: boolean }) => p.completed)
              .length || 0;
          data.push({
            date: dateStr,
            prayers: prayerCount,
            quranPages: d.quranPages || 0,
            morningDhikr: d.morningDhikr || false,
            eveningDhikr: d.eveningDhikr || false,
            totalProgress: calcProgress(
              prayerCount,
              d.morningDhikr || false,
              d.eveningDhikr || false,
              d.quranPages || 0,
            ),
            dayNumber: i + 1,
          });
        } else {
          data.push({
            date: dateStr,
            prayers: 0,
            quranPages: 0,
            morningDhikr: false,
            eveningDhikr: false,
            totalProgress: 0,
            dayNumber: i + 1,
          });
        }
      } catch {
        data.push({
          date: dateStr,
          prayers: 0,
          quranPages: 0,
          morningDhikr: false,
          eveningDhikr: false,
          totalProgress: 0,
          dayNumber: i + 1,
        });
      }
    }

    setAllDays(data);
    setLoading(false);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const totalPrayers = allDays.reduce((s, d) => s + d.prayers, 0);
  const maxPrayers = ramadanDays * 5;
  const totalQuran = allDays.reduce((s, d) => s + d.quranPages, 0);
  const totalMorningDhikr = allDays.filter((d) => d.morningDhikr).length;
  const totalEveningDhikr = allDays.filter((d) => d.eveningDhikr).length;
  const avgProgress =
    allDays.length > 0
      ? Math.round(
          allDays.reduce((s, d) => s + d.totalProgress, 0) / allDays.length,
        )
      : 0;

  let currentStreak = 0,
    bestStreak = 0;
  allDays.forEach((day) => {
    if (day.totalProgress >= 70) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else currentStreak = 0;
  });

  const topDays = [...allDays]
    .sort((a, b) => b.totalProgress - a.totalProgress)
    .slice(0, 3);

  const weeks = [];
  for (let i = 0; i < Math.ceil(ramadanDays / 7); i++) {
    weeks.push({ number: i + 1, days: allDays.slice(i * 7, (i + 1) * 7) });
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

  if (loading)
    return (
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-12 sm:p-16 shadow-xl border text-center`}
      >
        <Loader
          className={`${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} animate-spin mx-auto mb-4`}
          size={48}
        />
        <p
          className={`${darkMode ? "text-gray-400" : "text-[#8B4545]"} text-lg`}
        >
          Loading your Ramadan journey…
        </p>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className={`${darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700" : "bg-gradient-to-br from-[#8B4545] to-[#6B3535] border-white"} rounded-3xl p-8 sm:p-12 shadow-2xl border-4 text-center relative overflow-hidden`}
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
          <p className="text-white/60 text-sm mt-4">
            Progress based on prayers, adhkar & Quran reading
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: (
              <CheckCircle className="mx-auto mb-3 text-green-500" size={32} />
            ),
            value: totalPrayers,
            label: "Total Prayers",
            sub: `out of ${maxPrayers}`,
          },
          {
            icon: <BookOpen className="mx-auto mb-3 text-blue-500" size={32} />,
            value: totalQuran,
            label: "Quran Pages",
            sub: `${(totalQuran / 6.04).toFixed(1)} Juz`,
          },
          {
            icon: <Heart className="mx-auto mb-3 text-purple-500" size={32} />,
            value: totalMorningDhikr + totalEveningDhikr,
            label: "Adhkar Sessions",
            sub: `${totalMorningDhikr} morning • ${totalEveningDhikr} evening`,
          },
          {
            icon: <Star className="mx-auto mb-3 text-amber-500" size={32} />,
            value: bestStreak,
            label: "Best Streak",
            sub: "days above 70%",
          },
        ].map(({ icon, value, label, sub }) => (
          <div
            key={label}
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 shadow-xl border text-center`}
          >
            {icon}
            <div
              className={`text-4xl font-bold mb-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
            >
              {value}
            </div>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              {label}
            </p>
            <p
              className={`text-xs mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Top 3 Days */}
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 sm:p-8 shadow-xl border`}
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
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <h3
          className={`text-2xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          📊 Weekly Breakdown
        </h3>
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: "All Weeks", value: 0 },
            ...weeks.map((w) => ({
              label: `Week ${w.number}`,
              value: w.number,
            })),
          ].map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setSelectedWeek(value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedWeek === value ? (darkMode ? "bg-amber-600 text-white" : "bg-[#8B4545] text-white") : darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-[#8B4545]"}`}
            >
              {label}
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
          {[
            ["bg-green-500", "80%+"],
            [darkMode ? "bg-amber-600" : "bg-amber-500", "60-79%"],
            [darkMode ? "bg-gray-600" : "bg-yellow-300", "40-59%"],
            [darkMode ? "bg-gray-700" : "bg-gray-200", "0-39%"],
          ].map(([cls, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${cls}`}></div>
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Message */}
      <div
        className={`${darkMode ? "bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-700" : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"} rounded-2xl p-8 shadow-xl border-2 text-center`}
      >
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
        <p
          className={`mt-4 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          Average based on prayers (35%), adhkar (30%) and Quran reading (20%) —
          custom tasks not included
        </p>
      </div>
    </div>
  );
};
