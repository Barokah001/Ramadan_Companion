import React from "react";
import { Heart, Download, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Quote } from "../types";

interface QuoteGeneratorProps {
  quote: Quote;
  darkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onNewQuote: () => void;
  onDownload: () => void;
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  quote,
  darkMode,
  isFavorite,
  onToggleFavorite,
  onNewQuote,
  onDownload,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={quote.id}
        initial={{ opacity: 0, scale: 0.95, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotateX: 10 }}
        transition={{ duration: 0.4 }}
        className={`rounded-3xl p-8 shadow-2xl ${
          darkMode
            ? "bg-primary-800/50 backdrop-blur-sm border border-accent-800/30"
            : "bg-white/80 backdrop-blur-sm border border-primary-300"
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              darkMode
                ? "bg-accent-900/50 text-accent-200"
                : "bg-primary-200 text-primary-800"
            }`}
          >
            {quote.category}
          </motion.span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleFavorite}
            className="transition-transform"
          >
            <Heart
              className={`w-6 h-6 transition-colors duration-300 ${
                isFavorite
                  ? darkMode
                    ? "fill-accent-500 text-accent-500"
                    : "fill-accent-600 text-accent-600"
                  : darkMode
                  ? "text-primary-400 hover:text-accent-500"
                  : "text-primary-500 hover:text-accent-600"
              }`}
            />
          </motion.button>
        </div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-2xl font-serif leading-relaxed mb-6 ${
            darkMode ? "text-primary-50" : "text-primary-900"
          }`}
        >
          &ldquo;{quote.text}&rdquo;
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-right ${
            darkMode ? "text-primary-300" : "text-primary-700"
          }`}
        >
          <p className="font-semibold">— {quote.source}</p>
          <p className="text-sm">{quote.reference}</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewQuote}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all duration-300 ${
              darkMode
                ? "bg-accent-700 hover:bg-accent-600 text-white"
                : "bg-primary-600 hover:bg-primary-700 text-white"
            }`}
          >
            <RefreshCw className="w-5 h-5" />
            New Quote
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            className={`px-4 py-3 rounded-xl transition-all duration-300 ${
              darkMode
                ? "bg-primary-700 hover:bg-primary-600 text-primary-100"
                : "bg-primary-300 hover:bg-primary-400 text-primary-900"
            }`}
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
