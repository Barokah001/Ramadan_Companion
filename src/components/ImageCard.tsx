// src/components/ImageCard.tsx

import React, { useState } from 'react';
import { Download, Lock, Unlock, Loader } from 'lucide-react';
import { downloadImage } from '../utils/downloadImage';
import type { DailyImage } from '../types';

interface ImageCardProps {
  image: DailyImage;
  isUnlocked: boolean;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, isUnlocked }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadImage(image.path, image.day);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <div className="flex-shrink-0 w-72 h-72 relative rounded-xl overflow-hidden shadow-lg border border-[#5C2E2E]/15 bg-white group">
      {isUnlocked ? (
        <>
          {/* Image */}
          <div className="relative w-full h-full">
            <img
              src={image.path}
              alt={image.alt}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            
            {/* Loading */}
            {!imageLoaded && (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                <Loader size={32} className="text-amber-700 animate-spin" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="p-4 rounded-full bg-white/90 hover:bg-white transition-all disabled:opacity-50"
                aria-label="Download image"
              >
                {isDownloading ? (
                  <Loader size={24} className="text-amber-700 animate-spin" />
                ) : (
                  <Download size={24} className="text-amber-700" />
                )}
              </button>
            </div>
          </div>

          {/* Unlocked Badge */}
          <div className="absolute top-3 left-3 p-2 rounded-full bg-green-500 shadow-lg">
            <Unlock size={16} className="text-white" />
          </div>

          {/* Day Label */}
          <div className="absolute bottom-3 right-3 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm text-sm font-bold text-white">
            Day {image.day}
          </div>
        </>
      ) : (
        /* Locked State */
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#EAD7C0]">
          <Lock size={48} className="text-[#8B4545] mb-4" />
          <p className="font-bold text-xl text-[#5C2E2E]">Day {image.day}</p>
          <p className="text-sm mt-2 text-[#8B4545]">Locked</p>
        </div>
      )}
    </div>
  );
};