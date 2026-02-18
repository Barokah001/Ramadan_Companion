/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/DailyTasks.tsx - FIXED: progress % excludes custom tasks

import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from "lucide-react";
import { storage } from "../lib/supabase";

interface CustomTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface Prayer {
  name: string;
  completed: boolean;
}

interface DailyTasksProps {
  darkMode?: boolean;
  username: string;
}

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

// ─── Progress is based ONLY on required tasks ───
// Weights (must sum to 100):
//   Prayers      : 5 prayers × 7 pts each = 35 pts
//   Morning Dhikr: 15 pts
//   Evening Dhikr: 15 pts
//   Quran Pages  : up to 20 pts (capped at 4 pages = full credit)
//   Custom tasks : NOT included in the percentage
// Total possible: 85 pts → normalised to 100%
const PRAYER_WEIGHT = 35; // 5 prayers, 7 pts each
const MORNING_WEIGHT = 15;
const EVENING_WEIGHT = 15;
const QURAN_WEIGHT = 20; // 4+ pages = full credit
const QURAN_TARGET = 4; // pages for full Quran credit
const REQUIRED_TOTAL =
  PRAYER_WEIGHT + MORNING_WEIGHT + EVENING_WEIGHT + QURAN_WEIGHT; // = 85

const calcProgress = (
  prayers: Prayer[],
  morningDhikr: boolean,
  eveningDhikr: boolean,
  quranPages: number,
): number => {
  const prayerScore =
    (prayers.filter((p) => p.completed).length / 5) * PRAYER_WEIGHT;
  const morningScore = morningDhikr ? MORNING_WEIGHT : 0;
  const eveningScore = eveningDhikr ? EVENING_WEIGHT : 0;
  const quranScore = Math.min(quranPages / QURAN_TARGET, 1) * QURAN_WEIGHT;
  const raw = prayerScore + morningScore + eveningScore + quranScore;
  return Math.round((raw / REQUIRED_TOTAL) * 100);
};

export const DailyTasks: React.FC<DailyTasksProps> = ({
  darkMode = false,
  username,
}) => {
  const [prayers, setPrayers] = useState<Prayer[]>(() =>
    PRAYERS.map((name) => ({ name, completed: false })),
  );
  const [quranPages, setQuranPages] = useState(0);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [morningDhikr, setMorningDhikr] = useState(false);
  const [eveningDhikr, setEveningDhikr] = useState(false);

  // ── Load ──
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get today's date in local timezone
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const today = `${year}-${month}-${day}`;

        const stored = await storage.get(`daily-tasks:${username}:${today}`);
        if (stored) {
          const data = JSON.parse(stored.value);
          setPrayers(
            data.prayers || PRAYERS.map((n) => ({ name: n, completed: false })),
          );
          setQuranPages(data.quranPages ?? 0);
          setCustomTasks(data.customTasks || []);
          setMorningDhikr(data.morningDhikr ?? false);
          setEveningDhikr(data.eveningDhikr ?? false);
        }
      } catch {
        // no stored tasks
      }
    };
    loadData();
  }, [username]);

  // ── Save ──
  useEffect(() => {
    const saveData = async () => {
      try {
        // Get today's date in local timezone
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const today = `${year}-${month}-${day}`;

        await storage.set(
          `daily-tasks:${username}:${today}`,
          JSON.stringify({
            prayers,
            quranPages,
            customTasks,
            morningDhikr,
            eveningDhikr,
          }),
        );
      } catch {
        // failed to save
      }
    };
    saveData();
  }, [prayers, quranPages, customTasks, morningDhikr, eveningDhikr, username]);

  const togglePrayer = (index: number) =>
    setPrayers((prev) =>
      prev.map((p, i) => (i === index ? { ...p, completed: !p.completed } : p)),
    );

  const addCustomTask = () => {
    if (newTaskText.trim()) {
      setCustomTasks((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: newTaskText.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewTaskText("");
    }
  };

  const toggleCustomTask = (id: string) =>
    setCustomTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const deleteCustomTask = (id: string) =>
    setCustomTasks((prev) => prev.filter((t) => t.id !== id));

  const completedPrayers = prayers.filter((p) => p.completed).length;
  const completedTasks = customTasks.filter((t) => t.completed).length;
  const totalProgress = calcProgress(
    prayers,
    morningDhikr,
    eveningDhikr,
    quranPages,
  );

  return (
    <div className="flex flex-col gap-2 space-y-6">
      {/* Progress Overview */}
      <div
        className={`p-8 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl p-5 shadow-lg border`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Calendar
            className={darkMode ? "text-gray-100" : "text-[#5C2E2E]"}
            size={20}
          />
          <div>
            <h3
              className={`text-l font-semibold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Daily Tasks
            </h3>
            <p
              className={`text-l ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              Track your spiritual journey today
            </p>
          </div>
        </div>

        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-l ${darkMode ? "text-gray-300" : "text-[#8B4545]"}`}
            >
              Daily Progress
            </span>
            <span
              className={`text-lg font-bold ${darkMode ? "text-amber-500" : "text-[#8B4545]"}`}
            >
              {totalProgress}%
            </span>
          </div>
          <div
            className={`h-3 rounded-full overflow-hidden ${darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"}`}
          >
            <div
              className={`h-full rounded-full transition-all ${darkMode ? "bg-amber-600" : "bg-[#8B4545]"}`}
              style={{ width: `${totalProgress}%` }}
            />
          </div>
          <p
            className={`text-xs mt-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          >
            Based on prayers, adhkar & Quran reading • Custom tasks not counted
          </p>
        </div>
      </div>

      {/* Prayers */}
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl p-5 shadow-lg border`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-l font-semibold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Daily Prayers
          </h3>
          <span
            className={`text-sm flex items-center justify-center w-8 h-8 font-semibold px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-700 text-amber-500" : "bg-[#EAD7C0] text-[#8B4545]"}`}
          >
            {completedPrayers}/5
          </span>
        </div>
        <div className="space-y-2">
          {prayers.map((prayer, index) => (
            <button
              key={prayer.name}
              onClick={() => togglePrayer(index)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} ${prayer.completed ? "opacity-60" : ""}`}
            >
              {prayer.completed ? (
                <CheckCircle2 className="text-green-500" size={20} />
              ) : (
                <Circle
                  className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  size={20}
                />
              )}
              <span
                className={`text-base ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} ${prayer.completed ? "line-through" : ""}`}
              >
                {prayer.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quran Reading */}
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl p-5 shadow-lg border`}
      >
        <h3
          className={`text-lg font-bold mb-1 ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Quran Reading
        </h3>
        <p
          className={`text-xs mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          4+ pages = full credit in progress score
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setQuranPages(Math.max(0, quranPages - 1))}
            className={`w-10 h-10 rounded-lg font-bold text-lg ${darkMode ? "bg-gray-700 text-gray-100 hover:bg-gray-600" : "bg-[#EAD7C0] text-[#5C2E2E] hover:bg-[#d4c4a8]"}`}
          >
            −
          </button>
          <div className="flex-1 max-w-xs text-center">
            <div
              className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
            >
              {quranPages}
            </div>
            <div
              className={`text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              Pages Today
            </div>
          </div>
          <button
            onClick={() => setQuranPages(quranPages + 1)}
            className={`w-10 h-10 rounded-lg font-bold text-lg ${darkMode ? "bg-gray-700 text-gray-100 hover:bg-gray-600" : "bg-[#EAD7C0] text-[#5C2E2E] hover:bg-[#d4c4a8]"}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Adhkar */}
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl p-5 shadow-lg border`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Daily Adhkar
          </h3>
          <span
            className={`text-sm font-semibold px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-700 text-amber-500" : "bg-[#EAD7C0] text-[#8B4545]"}`}
          >
            {(morningDhikr ? 1 : 0) + (eveningDhikr ? 1 : 0)}/2
          </span>
        </div>
        <div className="space-y-2">
          <button
            onClick={() => setMorningDhikr(!morningDhikr)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} ${morningDhikr ? "opacity-60" : ""}`}
          >
            {morningDhikr ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <Circle
                className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                size={20}
              />
            )}
            <span
              className={`text-base ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} ${morningDhikr ? "line-through" : ""}`}
            >
              Morning Adhkar
            </span>
          </button>
          <button
            onClick={() => setEveningDhikr(!eveningDhikr)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"} ${eveningDhikr ? "opacity-60" : ""}`}
          >
            {eveningDhikr ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <Circle
                className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                size={20}
              />
            )}
            <span
              className={`text-base ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} ${eveningDhikr ? "line-through" : ""}`}
            >
              Evening Adhkar
            </span>
          </button>
        </div>
      </div>

      {/* Custom Tasks */}
      <div
        className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl p-5 shadow-lg border`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3
              className={`text-lg font-bold ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Custom Tasks
            </h3>
            <p
              className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}
            >
              Personal goals — not counted in progress %
            </p>
          </div>
          {customTasks.length > 0 && (
            <span
              className={`text-sm font-semibold px-2.5 py-1 rounded-full ${darkMode ? "bg-gray-700 text-amber-500" : "bg-[#EAD7C0] text-[#8B4545]"}`}
            >
              {completedTasks}/{customTasks.length}
            </span>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomTask()}
            placeholder="Add a new task..."
            className={`flex-1 px-3 py-2 rounded-lg text-sm ${darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-gray-50 text-[#5C2E2E] border-gray-200"} border focus:outline-none focus:ring-2 focus:ring-[#8B4545]`}
          />
          <button
            onClick={addCustomTask}
            disabled={!newTaskText.trim()}
            className={`px-4 py-2 rounded-lg ${darkMode ? "bg-amber-600 hover:bg-amber-700" : "bg-[#8B4545] hover:bg-[#6B3535]"} text-white text-sm font-medium disabled:opacity-50`}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-2">
          {customTasks.length === 0 ? (
            <p
              className={`text-center py-6 text-sm ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
            >
              No custom tasks yet. Add one above!
            </p>
          ) : (
            customTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-2 p-2.5 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} ${task.completed ? "opacity-60" : ""}`}
              >
                <button
                  onClick={() => toggleCustomTask(task.id)}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-green-500" size={18} />
                  ) : (
                    <Circle
                      className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                      size={18}
                    />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"} ${task.completed ? "line-through" : ""}`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteCustomTask(task.id)}
                  className={`p-1 rounded ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                >
                  <Trash2
                    size={14}
                    className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
