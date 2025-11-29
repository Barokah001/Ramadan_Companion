import React from "react";
import { motion } from "framer-motion";
import { type Category } from "../types";

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  darkMode: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  darkMode,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-wrap gap-2 justify-center"
    >
      {categories.map((cat, index) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(cat.id)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === cat.id
              ? darkMode
                ? "bg-accent-700 text-white shadow-lg shadow-accent-900/50"
                : "bg-primary-600 text-white shadow-lg shadow-primary-300/50"
              : darkMode
              ? "bg-primary-800 text-primary-200 hover:bg-primary-700 border border-accent-800/30"
              : "bg-primary-200 text-primary-800 hover:bg-primary-300 border border-primary-300"
          }`}
        >
          {cat.label}
        </motion.button>
      ))}
    </motion.div>
  );
};
