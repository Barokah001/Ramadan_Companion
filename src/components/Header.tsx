import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Star } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";


export const Header: React.FC = () => {
  const { isDark, toggle } = useTheme();
  const textColor = isDark ? "text-amber-50" : "text-amber-950";
  const accentColor = isDark ? "text-amber-300" : "text-amber-700";

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center relative"
    >
      <div className="absolute top-0 right-4">
        <motion.button
          whileHover={{ rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className={`p-3 rounded-full ${
            isDark ? "bg-amber-800" : "bg-amber-200"
          } ${textColor} shadow-lg`}
        >
          {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.button>
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Star className={`w-12 h-12 mx-auto mb-4 ${accentColor}`} />
      </motion.div>

      <h1 className={`text-5xl font-bold ${textColor} mb-2`}>Ramadan Wisdom</h1>
      <p className={`text-xl ${accentColor}`}>
        Daily Inspiration from the Quran & Hadith
      </p>
    </motion.header>
  );
};
