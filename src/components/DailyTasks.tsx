// src/components/DailyTasks.tsx - Fully Responsive

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
}

const PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const DailyTasks: React.FC<DailyTasksProps> = ({ darkMode = false }) => {
  const [prayers, setPrayers] = useState<Prayer[]>(() =>
    PRAYERS.map((name) => ({ name, completed: false })),
  );
  const [quranPages, setQuranPages] = useState(0);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [morningDhikr, setMorningDhikr] = useState(false);
  const [eveningDhikr, setEveningDhikr] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const stored = await storage.get(`daily-tasks-${today}`);

        if (stored) {
          const data = JSON.parse(stored.value);
          setPrayers(data.prayers || prayers);
          setQuranPages(data.quranPages || 0);
          setCustomTasks(data.customTasks || []);
          setMorningDhikr(data.morningDhikr || false);
          setEveningDhikr(data.eveningDhikr || false);
        }
      } catch (err) {
        console.log("No stored tasks");
      }
    };
    loadData();
  }, []);

  // Save data
  useEffect(() => {
    const saveData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        await storage.set(
          `daily-tasks-${today}`,
          JSON.stringify({
            prayers,
            quranPages,
            customTasks,
            morningDhikr,
            eveningDhikr,
          }),
        );
      } catch (err) {
        console.error("Failed to save:", err);
      }
    };
    saveData();
  }, [prayers, quranPages, customTasks, morningDhikr, eveningDhikr]);

  const togglePrayer = (index: number) => {
    setPrayers((prev) =>
      prev.map((prayer, i) =>
        i === index ? { ...prayer, completed: !prayer.completed } : prayer,
      ),
    );
  };

  const addCustomTask = () => {
    if (newTaskText.trim()) {
      const newTask: CustomTask = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setCustomTasks((prev) => [...prev, newTask]);
      setNewTaskText("");
    }
  };

  const toggleCustomTask = (id: string) => {
    setCustomTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteCustomTask = (id: string) => {
    setCustomTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const completedPrayers = prayers.filter((p) => p.completed).length;
  const completedTasks = customTasks.filter((t) => t.completed).length;
  const totalProgress =
    (completedPrayers / 5) * 35 +
    (morningDhikr ? 15 : 0) +
    (eveningDhikr ? 15 : 0) +
    Math.min((quranPages / 4) * 20, 20) +
    (customTasks.length > 0 ? (completedTasks / customTasks.length) * 15 : 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Progress Overview */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
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
              Daily Tasks
            </h2>
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-[#8B4545]"
              }`}
            >
              Track your spiritual journey today
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span
              className={`text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-300" : "text-[#8B4545]"
              }`}
            >
              Daily Progress
            </span>
            <span
              className={`text-xl sm:text-2xl font-bold ${
                darkMode ? "text-amber-500" : "text-[#8B4545]"
              }`}
            >
              {Math.round(totalProgress)}%
            </span>
          </div>
          <div
            className={`h-4 sm:h-5 rounded-full overflow-hidden shadow-inner ${
              darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                darkMode ? "bg-amber-600" : "bg-[#8B4545]"
              } shadow-md`}
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Prayers Section */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Daily Prayers
          </h3>
          <span
            className={`text-sm sm:text-base font-semibold px-3 py-1 rounded-full ${
              darkMode
                ? "bg-gray-700 text-amber-500"
                : "bg-[#EAD7C0] text-[#8B4545]"
            }`}
          >
            {completedPrayers}/5
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {prayers.map((prayer, index) => (
            <button
              key={prayer.name}
              onClick={() => togglePrayer(index)}
              className={`w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl transition-all ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
              } ${
                prayer.completed ? "opacity-60" : ""
              } transform hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex-shrink-0">
                {prayer.completed ? (
                  <CheckCircle2 className="text-green-500" size={28} />
                ) : (
                  <Circle
                    className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                    size={28}
                  />
                )}
              </div>
              <span
                className={`text-base sm:text-lg font-medium ${
                  darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                } ${prayer.completed ? "line-through" : ""}`}
              >
                {prayer.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quran Reading */}
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
          Quran Reading
        </h3>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={() => setQuranPages(Math.max(0, quranPages - 1))}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-lg ${
              darkMode
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                : "bg-[#EAD7C0] text-[#5C2E2E] hover:bg-[#d4c4a8]"
            }`}
          >
            −
          </button>

          <div className="flex-1 max-w-xs text-center">
            <div
              className={`text-5xl sm:text-6xl font-bold ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
            >
              {quranPages}
            </div>
            <div
              className={`text-sm sm:text-base mt-2 ${
                darkMode ? "text-gray-400" : "text-[#8B4545]"
              }`}
            >
              Pages Today
            </div>
          </div>

          <button
            onClick={() => setQuranPages(quranPages + 1)}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl font-bold text-xl sm:text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-lg ${
              darkMode
                ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                : "bg-[#EAD7C0] text-[#5C2E2E] hover:bg-[#d4c4a8]"
            }`}
          >
            +
          </button>
        </div>
      </div>

      {/* Adhkar Checklist */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Daily Adhkar
          </h3>
          <span
            className={`text-sm sm:text-base font-semibold px-3 py-1 rounded-full ${
              darkMode
                ? "bg-gray-700 text-amber-500"
                : "bg-[#EAD7C0] text-[#8B4545]"
            }`}
          >
            {(morningDhikr ? 1 : 0) + (eveningDhikr ? 1 : 0)}/2
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => setMorningDhikr(!morningDhikr)}
            className={`w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl transition-all ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
            } ${
              morningDhikr ? "opacity-60" : ""
            } transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex-shrink-0">
              {morningDhikr ? (
                <CheckCircle2 className="text-green-500" size={28} />
              ) : (
                <Circle
                  className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  size={28}
                />
              )}
            </div>
            <span
              className={`text-base sm:text-lg font-medium ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              } ${morningDhikr ? "line-through" : ""}`}
            >
              Morning Adhkar
            </span>
          </button>

          <button
            onClick={() => setEveningDhikr(!eveningDhikr)}
            className={`w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl transition-all ${
              darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
            } ${
              eveningDhikr ? "opacity-60" : ""
            } transform hover:scale-[1.02] active:scale-[0.98]`}
          >
            <div className="flex-shrink-0">
              {eveningDhikr ? (
                <CheckCircle2 className="text-green-500" size={28} />
              ) : (
                <Circle
                  className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                  size={28}
                />
              )}
            </div>
            <span
              className={`text-base sm:text-lg font-medium ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              } ${eveningDhikr ? "line-through" : ""}`}
            >
              Evening Adhkar
            </span>
          </button>
        </div>
      </div>

      {/* Custom Tasks */}
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 shadow-xl border`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className={`text-xl sm:text-2xl font-bold ${
              darkMode ? "text-gray-100" : "text-[#5C2E2E]"
            }`}
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Custom Tasks
          </h3>
          {customTasks.length > 0 && (
            <span
              className={`text-sm sm:text-base font-semibold px-3 py-1 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-amber-500"
                  : "bg-[#EAD7C0] text-[#8B4545]"
              }`}
            >
              {completedTasks}/{customTasks.length}
            </span>
          )}
        </div>

        <div className="flex gap-2 sm:gap-3 mb-6">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomTask()}
            placeholder="Add a new task..."
            className={`flex-1 px-4 py-3 sm:py-3.5 rounded-xl text-base ${
              darkMode
                ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                : "bg-gray-50 text-[#5C2E2E] border-[#5C2E2E]/10 placeholder-gray-400"
            } border focus:outline-none focus:ring-2 focus:ring-[#8B4545] transition-all`}
          />
          <button
            onClick={addCustomTask}
            disabled={!newTaskText.trim()}
            className={`px-4 sm:px-5 py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              darkMode
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-[#8B4545] hover:bg-[#6B3535]"
            } text-white font-medium flex items-center gap-2`}
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        <div className="space-y-3">
          {customTasks.length === 0 ? (
            <div
              className={`text-center py-8 sm:py-12 rounded-xl ${
                darkMode ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-[#8B4545]"
                } text-sm sm:text-base`}
              >
                No custom tasks yet. Add one above!
              </p>
            </div>
          ) : (
            customTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl ${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } ${task.completed ? "opacity-60" : ""} transition-all`}
              >
                <button
                  onClick={() => toggleCustomTask(task.id)}
                  className="flex-shrink-0 transform hover:scale-110 active:scale-95 transition-transform"
                >
                  {task.completed ? (
                    <CheckCircle2 className="text-green-500" size={24} />
                  ) : (
                    <Circle
                      className={darkMode ? "text-gray-400" : "text-[#8B4545]"}
                      size={24}
                    />
                  )}
                </button>

                <span
                  className={`flex-1 text-base sm:text-lg ${
                    darkMode ? "text-gray-100" : "text-[#5C2E2E]"
                  } ${task.completed ? "line-through" : ""}`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => deleteCustomTask(task.id)}
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
                    darkMode ? "hover:bg-gray-600" : "hover:bg-white"
                  }`}
                >
                  <Trash2
                    size={18}
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
