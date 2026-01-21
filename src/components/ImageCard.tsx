// src/components/ImageCard.tsx - Fully Responsive

import React, { useState } from "react";
import { Download, Lock, Unlock, Loader } from "lucide-react";
import { downloadImage } from "../utils/downloadImage";
import type { DailyImage } from "../types";

interface ImageCardProps {
  image: DailyImage;
  isUnlocked: boolean;
  darkMode?: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  isUnlocked,
  darkMode = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadImage(image.path, image.day);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-[#5C2E2E]/10"
      } group w-[280px] sm:w-[320px] lg:w-[360px] h-[280px] sm:h-[320px] lg:h-[360px]`}
    >
      {isUnlocked ? (
        <>
          {/* Image */}
          <div className="relative w-full h-full">
            <img
              src={image.path}
              alt={image.alt}
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Loading State */}
            {!imageLoaded && (
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  darkMode
                    ? "bg-gray-700"
                    : "bg-gradient-to-br from-amber-100 to-amber-200"
                }`}
              >
                <Loader
                  size={40}
                  className={`${
                    darkMode ? "text-amber-500" : "text-amber-700"
                  } animate-spin`}
                />
              </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`p-4 sm:p-5 rounded-full transition-all transform hover:scale-110 active:scale-95 ${
                  darkMode
                    ? "bg-gray-800/95 hover:bg-gray-800"
                    : "bg-white/95 hover:bg-white"
                } shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Download image"
              >
                {isDownloading ? (
                  <Loader
                    size={24}
                    className={`${
                      darkMode ? "text-amber-500" : "text-amber-700"
                    } animate-spin`}
                  />
                ) : (
                  <Download
                    size={24}
                    className={darkMode ? "text-amber-500" : "text-amber-700"}
                  />
                )}
              </button>
            </div>
          </div>

          {/* Unlocked Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 sm:p-2.5 rounded-full bg-green-500 shadow-lg">
            <Unlock size={16} className="sm:w-5 sm:h-5 text-white" />
          </div>

          {/* Day Label */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/70 backdrop-blur-sm">
            <p className="text-xs sm:text-sm font-bold text-white">
              Day {image.day}
            </p>
          </div>
        </>
      ) : (
        /* Locked State */
        <div
          className={`w-full h-full flex flex-col items-center justify-center ${
            darkMode
              ? "bg-gray-700"
              : "bg-gradient-to-br from-[#EAD7C0] to-[#D4C4A8]"
          }`}
        >
          <div className="text-center p-6">
            <Lock
              size={48}
              className={`sm:w-16 sm:h-16 mb-4 mx-auto ${
                darkMode ? "text-gray-400" : "text-[#8B4545]"
              }`}
            />
            <p
              className={`font-bold text-xl sm:text-2xl mb-2 ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
            >
              Day {image.day}
            </p>
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-300" : "text-[#8B4545]"
              }`}
            >
              Locked
            </p>
            <p
              className={`text-xs sm:text-sm mt-2 ${
                darkMode ? "text-gray-400" : "text-[#8B4545]/70"
              }`}
            >
              Unlocks on day {image.day}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
