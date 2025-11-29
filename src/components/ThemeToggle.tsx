import React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkMode,
  onToggle,
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`p-3 rounded-full transition-all duration-300 ${
        darkMode
          ? "bg-accent-800 hover:bg-accent-700"
          : "bg-primary-300 hover:bg-primary-400"
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: darkMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-primary-50" />
        ) : (
          <Moon className="w-5 h-5 text-primary-900" />
        )}
      </motion.div>
    </motion.button>
  );
};
