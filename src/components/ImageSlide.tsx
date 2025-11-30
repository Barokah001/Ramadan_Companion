import React from "react";
import { motion } from "framer-motion";
import { Download, Lock, Unlock } from "lucide-react";
import { type DailyImage } from "../types";
import { useTheme } from "../contexts/ThemeContext";

interface ImageSlideProps {
  image: DailyImage;
  isUnlocked: boolean;
}

export const ImageSlide: React.FC<ImageSlideProps> = ({
  image,
  isUnlocked,
}) => {
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-amber-900/30" : "bg-amber-100/50";
  const textColor = isDark ? "text-amber-50" : "text-amber-950";
  const borderColor = isDark ? "border-amber-700" : "border-amber-300";

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.path;
    link.download = `ramadan-day-${image.day}.jpg`;
    link.click();
  };

  return (
    <motion.div
      className={`${bgColor} ${borderColor} border-2 rounded-2xl overflow-hidden shadow-2xl relative h-full flex flex-col`}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="aspect-square relative flex-shrink-0">
        {isUnlocked ? (
          <>
            <img
              src={image.path}
              alt={image.alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                (
                  e.target as HTMLImageElement
                ).src = `https://via.placeholder.com/600x600/8B4513/F5DEB3?text=Day+${image.day}`;
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className={`absolute top-4 right-4 p-3 rounded-full ${
                isDark
                  ? "bg-amber-800/90 backdrop-blur-sm"
                  : "bg-amber-200/90 backdrop-blur-sm"
              } ${textColor} shadow-xl`}
            >
              <Download className="w-6 h-6" />
            </motion.button>
            <div
              className={`absolute bottom-0 left-0 right-0 ${
                isDark
                  ? "bg-gradient-to-t from-black/70 to-transparent"
                  : "bg-gradient-to-t from-white/70 to-transparent"
              } p-4`}
            >
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-green-400" />
                <span className={`${textColor} font-semibold text-lg`}>
                  Day {image.day} Unlocked
                </span>
              </div>
            </div>
          </>
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center ${bgColor} backdrop-blur-sm`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Lock className={`w-20 h-20 ${textColor} opacity-50 mb-6`} />
            </motion.div>
            <p className={`${textColor} text-2xl font-bold mb-2`}>
              Day {image.day}
            </p>
            <p className={`${textColor} text-lg opacity-75`}>
              Locked Until Day {image.day}
            </p>
          </div>
        )}
      </div>

      <div
        className={`p-6 ${textColor} flex-grow flex items-center justify-center`}
      >
        <div className="text-center">
          <p className="text-lg font-semibold mb-1">{image.alt}</p>
          {image.description && (
            <p className="text-sm opacity-75">{image.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
