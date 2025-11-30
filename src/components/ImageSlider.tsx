import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUnlockedDays } from "../hooks/useUnlockedDays";
import { ImageSlide } from "./ImageSlide";
import { useTheme } from "../contexts/ThemeContext";
import { DAILY_IMAGES } from "../lib/images";

export const ImageSlider: React.FC = () => {
  const { isDark } = useTheme();
  const unlockedDay = useUnlockedDays();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const textColor = isDark ? "text-amber-50" : "text-amber-950";
  const buttonBg = isDark
    ? "bg-amber-800 hover:bg-amber-700"
    : "bg-amber-200 hover:bg-amber-300";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(DAILY_IMAGES.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentImages = () => {
    const start = currentIndex * itemsPerPage;
    const end = start + itemsPerPage;
    return DAILY_IMAGES.slice(start, end);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      nextSlide();
    } else if (swipe > swipeConfidenceThreshold) {
      prevSlide();
    }
  };

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-bold ${textColor} mb-2`}>
            Daily Reflections
          </h2>
          <p
            className={`${
              isDark ? "text-amber-300" : "text-amber-700"
            } text-lg`}
          >
            {unlockedDay} of 30 days unlocked
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className={`p-3 rounded-full ${buttonBg} ${textColor} shadow-lg`}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
          <span className={`${textColor} font-semibold text-lg`}>
            {currentIndex + 1} / {totalPages}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className={`p-3 rounded-full ${buttonBg} ${textColor} shadow-lg`}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="cursor-grab active:cursor-grabbing"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-3"
              } gap-6`}
            >
              {getCurrentImages().map((image) => (
                <ImageSlide
                  key={image.id}
                  image={image}
                  isUnlocked={image.day <= unlockedDay}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`w-3 h-3 rounded-full transition-all ${
              idx === currentIndex
                ? isDark
                  ? "bg-amber-400 w-8"
                  : "bg-amber-600 w-8"
                : isDark
                ? "bg-amber-700"
                : "bg-amber-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
