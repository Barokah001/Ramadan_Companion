import React, { useState } from "react";
import { Lock, Unlock, Star, Download } from "lucide-react";
import { motion } from "framer-motion";

interface DailyImageProps {
  currentDay: number;
  darkMode: boolean;
}

export const DailyImage: React.FC<DailyImageProps> = ({
  currentDay,
  darkMode,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleDownloadImage = () => {
    const link = document.createElement("a");
    link.href = `/images/daily/${currentDay}.jpg`;
    link.download = `ramadan-day-${currentDay}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`rounded-3xl p-8 shadow-2xl ${
        darkMode
          ? "bg-primary-800/50 backdrop-blur-sm border border-accent-800/30"
          : "bg-white/80 backdrop-blur-sm border border-primary-300"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-2xl font-display font-bold ${
            darkMode ? "text-primary-50" : "text-primary-900"
          }`}
        >
          Daily Image
        </h2>

        {currentDay <= 30 && !imageError && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadImage}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? "bg-accent-700 hover:bg-accent-600 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            <Download className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-square rounded-2xl overflow-hidden mb-6"
      >
        {currentDay <= 30 ? (
          !imageError ? (
            <img
              src={`/images/daily/${currentDay}.jpg`}
              alt={`Day ${currentDay} of Ramadan`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center ${
                darkMode ? "bg-primary-700" : "bg-primary-200"
              }`}
            >
              <div className="text-center p-6">
                <Unlock
                  className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? "text-accent-400" : "text-primary-600"
                  }`}
                />
                <p
                  className={`text-lg font-medium mb-2 ${
                    darkMode ? "text-primary-200" : "text-primary-800"
                  }`}
                >
                  Day {currentDay} Unlocked!
                </p>
                <p
                  className={`text-sm ${
                    darkMode ? "text-primary-400" : "text-primary-600"
                  }`}
                >
                  Place image at: public/images/daily/{currentDay}.jpg
                </p>
              </div>
            </div>
          )
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              darkMode ? "bg-primary-900/50" : "bg-primary-300/50"
            }`}
          >
            <div className="text-center">
              <Lock
                className={`w-16 h-16 mx-auto mb-4 ${
                  darkMode ? "text-primary-600" : "text-primary-500"
                }`}
              />
              <p
                className={`text-sm ${
                  darkMode ? "text-primary-500" : "text-primary-600"
                }`}
              >
                Locked
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Day Grid */}
      <div className="grid grid-cols-6 gap-2">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
          <motion.div
            key={day}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: day * 0.01 }}
            whileHover={{ scale: day <= currentDay ? 1.1 : 1 }}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
              day <= currentDay
                ? darkMode
                  ? "bg-accent-700 text-white shadow-lg"
                  : "bg-primary-600 text-white shadow-lg"
                : darkMode
                ? "bg-primary-900/30 text-primary-600"
                : "bg-primary-200 text-primary-500"
            } ${
              day === currentDay
                ? "ring-2 ring-offset-2 " +
                  (darkMode ? "ring-accent-500" : "ring-primary-700")
                : ""
            }`}
          >
            {day <= currentDay ? <Star className="w-3 h-3" /> : day}
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className={darkMode ? "text-primary-300" : "text-primary-700"}>
            Progress
          </span>
          <span
            className={`font-semibold ${
              darkMode ? "text-primary-100" : "text-primary-900"
            }`}
          >
            {currentDay}/30 days
          </span>
        </div>
        <div
          className={`h-2 rounded-full overflow-hidden ${
            darkMode ? "bg-primary-900/50" : "bg-primary-200"
          }`}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentDay / 30) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={
              darkMode ? "bg-accent-600 h-full" : "bg-primary-600 h-full"
            }
          />
        </div>
      </div>
    </div>
  );
};
