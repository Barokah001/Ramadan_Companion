// src/components/Header.tsx - Structural Overhaul
import React from "react";
import { motion } from "framer-motion";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#5C2E2E]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#5C2E2E] tracking-tighter"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Ramadan Companion
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#8B4545] opacity-60">
              Assalamu Alaikum, Barakah
            </p>
            <div className="h-1 w-12 bg-[#8B4545]/20 rounded-full mt-3" />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
