// src/components/Header.tsx

import React from 'react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-[#5C2E2E]/15 shadow-sm w-full">
      <div className="max-w-full mx-auto px-6 py-4">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-[#5C2E2E] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Ramadan Companion
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-[#8B4545]"
          >
            Daily reflections and inspiration
          </motion.p>
        </div>
      </div>
    </header>
  );
};