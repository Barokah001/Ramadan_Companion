// src/components/ImageCard.tsx - Refined Image Card
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
      className={`relative rounded-[2rem] overflow-hidden shadow-2xl border-4 transition-all duration-500 hover:scale-105 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-white"
      } w-[300px] h-[300px] md:w-[350px] md:h-[350px] group`}
    >
      {isUnlocked ? (
        <>
          <img
            src={image.path}
            alt={image.alt}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div
              className={`absolute inset-0 flex items-center justify-center ${darkMode ? "bg-gray-800" : "bg-amber-50"}`}
            >
              <Loader className="animate-spin text-amber-600" size={32} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <button
              onClick={handleDownload}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm ${darkMode ? "bg-amber-600 text-white" : "bg-white text-[#5C2E2E] shadow-xl"}`}
            >
              {isDownloading ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <>
                  <Download size={18} /> Download Image
                </>
              )}
            </button>
          </div>
          <div className="absolute top-4 flex items-center justify-center w-8 h-8 left-4 p-3 rounded-2xl bg-green-500 shadow-lg text-white">
            <Unlock size={18} />
          </div>
          <div className="absolute top-4 right-4 px-4 py-2 flex items-center justify-center w-12 h-8 rounded-2xl bg-black/40 backdrop-blur-md text-white font-black text-xs">
            DAY {image.day}
          </div>
        </>
      ) : (
        <div
          className={`w-full h-full flex flex-col items-center justify-center ${darkMode ? "bg-gray-900" : "bg-[#F5EBE0]"}`}
        >
          <Lock
            size={48}
            className={`mb-4 ${darkMode ? "text-gray-700" : "text-[#8B4545]/20"}`}
          />
          <p
            className={`text-xl font-black w-[20px] ${darkMode ? "text-gray-700" : "text-[#8B4545]/40"}`}
          >
            DAY {image.day}
          </p>
          <p
            className={`text-xs font-bold uppercase tracking-widest mt-2 ${darkMode ? "text-gray-800" : "text-[#8B4545]/30"}`}
          >
            Locked
          </p>
        </div>
      )}
    </div>
  );
};
