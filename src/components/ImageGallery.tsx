// src/components/ImageGallery.tsx - Fully Responsive

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUnlockedDays } from "../hooks/useUnlockedDays";
import { ImageCard } from "./ImageCard";
import { dailyImages } from "../lib/images";

const RAMADAN_START_DATE = "2026-02-18";

interface ImageGalleryProps {
  darkMode?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  darkMode = false,
}) => {
  const unlockedDays = useUnlockedDays(RAMADAN_START_DATE);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="flex flex-col gap-3 sm:mb-12 lg:mb-20">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10 px-4">
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${
            darkMode ? "text-gray-100" : "text-[#5C2E2E]"
          }`}
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Daily Reflections
        </h2>
        <p
          className={`text-base sm:text-lg ${
            darkMode ? "text-gray-300" : "text-[#8B4545]"
          }`}
        >
          <span className="font-semibold">{unlockedDays}</span> of{" "}
          <span className="font-semibold">30</span> days unlocked
          <span className="hidden sm:inline">
            {" "}
            • New image unlocks each day
          </span>
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative px-4 sm:px-0">
        {/* Left Arrow - Hidden on mobile, visible on tablet+ */}
        <button
          onClick={() => scroll("left")}
          className={` flex items-center justify-center w-12 h-12 text-xl sm:flex absolute left-0 lg:left-4 top-1/2 -translate-y-1/2 z-10 p-3 lg:p-4 rounded-full ${
            darkMode
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
              : "bg-white border-[#5C2E2E]/10 hover:bg-gray-50"
          } shadow-xl border transition-all transform hover:scale-110 active:scale-95`}
          aria-label="Scroll left"
        >
          <ChevronLeft
            size={24}
            className={darkMode ? "text-gray-100" : "text-[#5C2E2E]"}
          />
        </button>

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto px-0 sm:px-12 lg:px-16 pb-4 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {dailyImages.map((image) => (
            <div key={image.id} className="snap-center flex-shrink-0">
              <ImageCard
                image={image}
                isUnlocked={image.day <= unlockedDays}
                darkMode={darkMode}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow - Hidden on mobile, visible on tablet+ */}
        <button
          onClick={() => scroll("right")}
          className={`flex items-center justify-center w-12 h-12 sm:flex absolute right-0 lg:right-4 top-1/2 -translate-y-1/2 z-10 p-3 lg:p-4 rounded-full text-xl ${
            darkMode
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
              : "bg-white border-[#5C2E2E]/10 hover:bg-gray-50"
          } shadow-xl border transition-all transform hover:scale-110 active:scale-95`}
          aria-label="Scroll right"
        >
          <ChevronRight
            size={24}
            className={darkMode ? "text-gray-100" : "text-[#5C2E2E]"}
          />
        </button>

        {/* Mobile scroll hint */}
        <div className="sm:hidden text-center mt-2">
          <p
            className={`text-xs ${
              darkMode ? "text-gray-400" : "text-[#8B4545]"
            }`}
          >
            ← Swipe to see more →
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div
        className={`mt-4 sm:mt-8 lg:mt-10 mx-4 sm:mx-0 h-3 sm:h-4 rounded-full overflow-hidden ${
          darkMode ? "bg-gray-700" : "bg-[#EAD7C0]"
        } shadow-inner`}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            darkMode ? "bg-amber-600" : "bg-[#8B4545]"
          } shadow-md`}
          style={{
            width: `${(unlockedDays / 30) * 100}%`,
          }}
        />
      </div>

      {/* Progress Text */}
      <div className="text-center mt-3 sm:mt-4">
        <p
          className={`text-sm sm:text-base font-medium ${
            darkMode ? "text-gray-300" : "text-[#8B4545]"
          }`}
        >
          {Math.round((unlockedDays / 30) * 100)}% Complete
        </p>
      </div>
    </section>
  );
};