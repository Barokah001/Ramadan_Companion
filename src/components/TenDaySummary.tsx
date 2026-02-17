/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/TenDaySummary.tsx - FIXED: all 3 periods, coming-soon, correct %

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
  Lock,
  Moon,
} from "lucide-react";
import { storage } from "../lib/supabase";

// ─── Same weights as DailyTasks ───────────────────────────────────────────────
const PRAYER_WEIGHT = 35;
const MORNING_WEIGHT = 15;
const EVENING_WEIGHT = 15;
const QURAN_WEIGHT = 20;
const QURAN_TARGET = 4;
const REQUIRED_TOTAL =
  PRAYER_WEIGHT + MORNING_WEIGHT + EVENING_WEIGHT + QURAN_WEIGHT; // 85

const calcProgress = (
  prayers: number, // completed count (0-5)
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

interface DayData {
  date: string;
  dayNumber: number; // 1-based day within Ramadan
  prayers: number;
  quranPages: number;
  morningDhikr: boolean;
  eveningDhikr: boolean;
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

// ── Inline journal for a single day ──
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
  const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  useEffect(() => {
    storage
      .get(`daily-tasks:${username}:${date}`)
      .then((s) => {
        if (s) setDayData(JSON.parse(s.value));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [date, username]);

  if (loading)
    return (
      <div
        className={`p-4 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} text-center`}
      >
        <Loader className="animate-spin mx-auto" size={24} />
      </div>
    );

  if (!dayData)
    return (
      <div
        className={`p-4 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
      >
        <p
          className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          No data recorded for this day
        </p>
      </div>
    );

  const prayers: Prayer[] = dayData.prayers || [];
  const customTasks: CustomTask[] = dayData.customTasks || [];

  return (
    <div
      className={`p-6 border-t ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} space-y-6`}
    >
      {/* Prayers */}
      <div>
        <h4
          className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
        >
          <CheckCircle size={18} className="text-green-500" /> Daily Prayers
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRAYER_NAMES.map((name, i) => {
            const done = prayers[i]?.completed || false;
            return (
              <div
                key={name}
                className={`p-3 rounded-lg text-center ${done ? "bg-green-500 text-white" : darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}
              >
                <div className="text-xs font-medium mb-1">{name}</div>
                <div>
                  {done ? (
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
        {[
          ["Morning Adhkar", dayData.morningDhikr],
          ["Evening Adhkar", dayData.eveningDhikr],
        ].map(([label, done]) => (
          <div
            key={String(label)}
            className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}
          >
            <p
              className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-[#5C2E2E]"}`}
            >
              {String(label)}
            </p>
            <div className="flex items-center gap-2">
              {done ? (
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
        ))}
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
                className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
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
                  className={`flex-1 text-sm ${task.completed ? "line-through opacity-60" : ""} ${darkMode ? "text-gray-200" : "text-[#5C2E2E]"}`}
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

// ── Placeholder shown for a period that hasn't started yet ──
const ComingSoonCard: React.FC<{
  periodLabel: string;
  startDay: number;
  startDate: string;
  darkMode: boolean;
}> = ({ periodLabel, startDay, startDate, darkMode }) => (
  <div
    className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-10 shadow-xl border text-center`}
  >
    <div className="flex flex-col items-center gap-4">
      <div
        className={`p-5 rounded-full ${darkMode ? "bg-gray-700" : "bg-amber-50"}`}
      >
        <Lock
          size={36}
          className={darkMode ? "text-amber-400" : "text-[#8B4545]"}
        />
      </div>
      <Moon
        size={28}
        className={darkMode ? "text-amber-400" : "text-[#8B4545]"}
      />
      <h3
        className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
        style={{ fontFamily: "Playfair Display, serif" }}
      >
        {periodLabel} Insights Coming Soon
      </h3>
      <p
        className={`text-base leading-relaxed max-w-md ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
      >
        Your {periodLabel.toLowerCase()} insights will unlock on{" "}
        <strong>Day {startDay}</strong> ({startDate}). Keep up your beautiful
        ibadah — your journey is being recorded, and your rewards are with
        Allah. 🤲
      </p>
      <div
        className={`mt-2 px-5 py-2 rounded-full text-sm font-semibold ${darkMode ? "bg-gray-700 text-amber-400" : "bg-amber-50 text-[#8B4545]"}`}
      >
        Unlocks Day {startDay}
      </div>
    </div>
  </div>
);

interface TenDaySummaryProps {
  darkMode?: boolean;
  username: string;
  ramadanStartDate: string; // "YYYY-MM-DD"
  ramadanDays?: number; // 29 or 30 (default 30)
}

// ── Period definition ──
interface Period {
  label: string; // e.g. "First 10 Days"
  periodNumber: 1 | 2 | 3;
  startDay: number; // 1-based day in Ramadan
  endDay: number;
}

export const TenDaySummary: React.FC<TenDaySummaryProps> = ({
  darkMode = false,
  username,
  ramadanStartDate,
  ramadanDays = 30,
}) => {
  const [activePeriod, setActivePeriod] = useState<1 | 2 | 3>(1);
  const [periodsData, setPeriodsData] = useState<Record<number, DayData[]>>({});
  const [loadingPeriod, setLoadingPeriod] = useState<number | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Build period definitions dynamically (handles 29 or 30 day Ramadan)
  const periods: Period[] = [
    { label: "First 10 Days", periodNumber: 1, startDay: 1, endDay: 10 },
    { label: "Second 10 Days", periodNumber: 2, startDay: 11, endDay: 20 },
    { label: "Last Days", periodNumber: 3, startDay: 21, endDay: ramadanDays },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ramadanStart = new Date(ramadanStartDate);
  ramadanStart.setHours(0, 0, 0, 0);

  // Which Ramadan day are we on today? (1-based; 0 = before Ramadan)
  const todayRamadanDay =
    Math.floor((today.getTime() - ramadanStart.getTime()) / 86400000) + 1;

  // A period is "available" if its first day has been reached
  const isPeriodAvailable = (p: Period) => todayRamadanDay >= p.startDay;

  // Get the calendar date for a given Ramadan day number
  const ramadanDayToDate = (dayNum: number): Date => {
    const d = new Date(ramadanStart);
    d.setDate(d.getDate() + dayNum - 1);
    return d;
  };

  const formatDate = (dateStr: string, opts?: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(
      "en-US",
      opts ?? { weekday: "long", month: "long", day: "numeric" },
    );
  };

  const formatShortDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  // Load data for a given period (lazy — only loads when that tab is shown)
  const loadPeriodData = async (period: Period) => {
    if (periodsData[period.periodNumber]) return; // already loaded
    setLoadingPeriod(period.periodNumber);

    const data: DayData[] = [];
    for (let day = period.startDay; day <= period.endDay; day++) {
      const dateObj = ramadanDayToDate(day);
      const dateStr = dateObj.toISOString().split("T")[0];

      try {
        const stored = await storage.get(`daily-tasks:${username}:${dateStr}`);
        if (stored) {
          const d = JSON.parse(stored.value);
          const prayerCount =
            d.prayers?.filter((p: Prayer) => p.completed).length || 0;
          data.push({
            date: dateStr,
            dayNumber: day,
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
          });
        } else {
          data.push({
            date: dateStr,
            dayNumber: day,
            prayers: 0,
            quranPages: 0,
            morningDhikr: false,
            eveningDhikr: false,
            totalProgress: 0,
          });
        }
      } catch {
        data.push({
          date: dateStr,
          dayNumber: day,
          prayers: 0,
          quranPages: 0,
          morningDhikr: false,
          eveningDhikr: false,
          totalProgress: 0,
        });
      }
    }

    setPeriodsData((prev) => ({ ...prev, [period.periodNumber]: data }));
    setLoadingPeriod(null);
  };

  // When active period changes, load its data (if the period is available)
  useEffect(() => {
    const period = periods.find((p) => p.periodNumber === activePeriod)!;
    if (isPeriodAvailable(period)) loadPeriodData(period);
    setExpandedDay(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePeriod, username, ramadanStartDate]);

  // Load first period on mount
  useEffect(() => {
    const firstAvailable = periods.find((p) => isPeriodAvailable(p));
    if (firstAvailable) {
      setActivePeriod(firstAvailable.periodNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPeriod = periods.find((p) => p.periodNumber === activePeriod)!;
  const periodData = periodsData[activePeriod] || [];
  const periodAvailable = isPeriodAvailable(currentPeriod);

  const avgProgress =
    periodData.length > 0
      ? Math.round(
          periodData.reduce((s, d) => s + d.totalProgress, 0) /
            periodData.length,
        )
      : 0;
  const totalPrayers = periodData.reduce((s, d) => s + d.prayers, 0);
  const totalQuran = periodData.reduce((s, d) => s + d.quranPages, 0);
  const totalDhikr = periodData.reduce(
    (s, d) => s + (d.morningDhikr ? 1 : 0) + (d.eveningDhikr ? 1 : 0),
    0,
  );
  const periodDays = currentPeriod.endDay - currentPeriod.startDay + 1;

  const getBadge = (avg: number) => {
    if (avg >= 90)
      return { emoji: "🏆", text: "Champion", color: "text-yellow-500" };
    if (avg >= 70) return { emoji: "⭐", text: "Star", color: "text-blue-500" };
    if (avg >= 50)
      return { emoji: "🌟", text: "Achiever", color: "text-purple-500" };
    return { emoji: "🌱", text: "Growing", color: "text-emerald-500" };
  };

  const badge = getBadge(avgProgress);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Period Selector */}
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`p-3 rounded-full ${darkMode ? "bg-amber-600" : "bg-[#8B4545]"} shadow-lg`}
          >
            <Calendar className="text-white" size={24} />
          </div>
          <div>
            <h2
              className={`text-2xl sm:text-3xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Ramadan Summary
            </h2>
            <p
              className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              Your spiritual journey in thirds
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {periods.map((period) => {
            const available = isPeriodAvailable(period);
            const isActive = activePeriod === period.periodNumber;
            const startDate = ramadanDayToDate(period.startDay);
            const endDate = ramadanDayToDate(period.endDay);
            const startStr = startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const endStr = endDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            return (
              <button
                key={period.periodNumber}
                onClick={() =>
                  available && setActivePeriod(period.periodNumber)
                }
                disabled={!available}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isActive
                    ? darkMode
                      ? "bg-amber-600 border-amber-500 text-white"
                      : "bg-[#8B4545] border-[#6B3535] text-white"
                    : available
                      ? darkMode
                        ? "bg-gray-700 border-gray-600 hover:border-amber-500 text-gray-200"
                        : "bg-gray-50 border-gray-200 hover:border-[#8B4545] text-[#5C2E2E]"
                      : "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                }`}
              >
                {!available && (
                  <div className="absolute top-2 right-2">
                    <Lock size={14} className="text-gray-400" />
                  </div>
                )}
                <div
                  className={`text-xs font-bold uppercase tracking-widest mb-1 ${isActive ? "text-white/70" : ""}`}
                >
                  Days {period.startDay}–{period.endDay}
                </div>
                <div className="font-bold text-base">{period.label}</div>
                <div
                  className={`text-xs mt-1 ${isActive ? "text-white/60" : darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  {startStr} – {endStr}
                </div>
                {!available && (
                  <div
                    className={`text-xs mt-1 font-medium ${darkMode ? "text-amber-400" : "text-amber-600"}`}
                  >
                    🔒 Starts Day {period.startDay}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {!periodAvailable ? (
        <ComingSoonCard
          periodLabel={currentPeriod.label}
          startDay={currentPeriod.startDay}
          startDate={ramadanDayToDate(
            currentPeriod.startDay,
          ).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          darkMode={darkMode}
        />
      ) : loadingPeriod === activePeriod ? (
        <div
          className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-12 shadow-xl border text-center`}
        >
          <Loader
            className={`${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} animate-spin mx-auto mb-4`}
            size={48}
          />
          <p
            className={`${darkMode ? "text-gray-400" : "text-[#8B4545]"} text-lg`}
          >
            Loading {currentPeriod.label.toLowerCase()} summary…
          </p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div
              className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 shadow-xl border`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-green-500 shadow-lg">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <h4
                  className={`font-semibold text-base ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
                >
                  Prayers
                </h4>
              </div>
              <div
                className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} mb-1`}
              >
                {totalPrayers}/{periodDays * 5}
              </div>
              <div
                className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
              >
                {Math.round((totalPrayers / (periodDays * 5)) * 100)}% completed
              </div>
            </div>
            <div
              className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 shadow-xl border`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-blue-500 shadow-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h4
                  className={`font-semibold text-base ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
                >
                  Quran
                </h4>
              </div>
              <div
                className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} mb-1`}
              >
                {totalQuran}
              </div>
              <div
                className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
              >
                Pages read
              </div>
            </div>
            <div
              className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 shadow-xl border`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-purple-500 shadow-lg">
                  <Heart className="text-white" size={20} />
                </div>
                <h4
                  className={`font-semibold text-base ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
                >
                  Adhkar
                </h4>
              </div>
              <div
                className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} mb-1`}
              >
                {totalDhikr}/{periodDays * 2}
              </div>
              <div
                className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
              >
                Sessions completed
              </div>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-6 sm:p-8 shadow-xl border`}
          >
            <h3
              className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} mb-6`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Daily Breakdown
            </h3>
            <div className="space-y-3">
              {periodData.map((day) => (
                <div
                  key={day.date}
                  className={`rounded-xl border ${darkMode ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"} overflow-hidden`}
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
                          className={`font-semibold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
                        >
                          Day {day.dayNumber} —{" "}
                          {formatDate(day.date, {
                            month: "short",
                            day: "numeric",
                            weekday: "short",
                          })}
                        </p>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
                        >
                          {day.prayers}/5 prayers • {day.quranPages} pages
                        </p>
                      </div>
                    </div>
                    {expandedDay === day.date ? (
                      <ChevronUp
                        className={
                          darkMode ? "text-gray-400" : "text-[#8B4545]"
                        }
                      />
                    ) : (
                      <ChevronDown
                        className={
                          darkMode ? "text-gray-400" : "text-[#8B4545]"
                        }
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

          {/* Period Average */}
          <div
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-[#5C2E2E]/10"} rounded-2xl p-8 sm:p-12 shadow-xl border text-center`}
          >
            <div
              className={`inline-block p-4 sm:p-6 rounded-full mb-6 ${darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"} shadow-lg`}
            >
              <Award
                className={darkMode ? "text-amber-500" : "text-[#8B4545]"}
                size={48}
              />
            </div>
            <h3
              className={`text-xl sm:text-2xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} mb-2`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {currentPeriod.label} Average
            </h3>
            <div className="text-5xl mb-1">{badge.emoji}</div>
            <div
              className={`text-6xl sm:text-7xl font-bold mb-3 ${darkMode ? "text-amber-500" : "text-[#8B4545]"}`}
            >
              {avgProgress}%
            </div>
            <p className={`text-lg font-semibold ${badge.color}`}>
              {badge.text}
            </p>
            <p
              className={`mt-3 text-base ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              {avgProgress >= 70
                ? "Excellent! Keep it up! 🌟"
                : avgProgress >= 50
                  ? "Good progress! Keep going! 💪"
                  : "Stay consistent! You can do it! 🌱"}
            </p>
            <p
              className={`mt-2 text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Progress based on prayers, adhkar & Quran reading
            </p>
          </div>
        </>
      )}
    </div>
  );
};
