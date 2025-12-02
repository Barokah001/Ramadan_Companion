// src/components/ImageGallery.tsx

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useUnlockedDays } from '../hooks/useUnlockedDays';
import { ImageCard } from './ImageCard';
import { dailyImages } from '../lib/images';

const RAMADAN_START_DATE = '2025-03-01';

export const ImageGallery: React.FC = () => {
  const unlockedDays = useUnlockedDays(RAMADAN_START_DATE);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center mb-6">
        <h2 
          className="text-3xl md:text-4xl font-bold text-[#5C2E2E] mb-2" 
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Daily Reflections
        </h2>
        <p className="text-base text-[#8B4545]">
          {unlockedDays} of 30 days unlocked • New image unlocks each day
        </p>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-[#5C2E2E]/15 hover:bg-[#EAD7C0] transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} className="text-[#5C2E2E]" />
        </button>

        {/* Slider Track */}
        <div 
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto px-12 hide-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {dailyImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              isUnlocked={image.day <= unlockedDays}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-[#5C2E2E]/15 hover:bg-[#EAD7C0] transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} className="text-[#5C2E2E]" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 h-2 rounded-full bg-[#EAD7C0] overflow-hidden">
        <div
          className="h-full rounded-full bg-[#8B4545] transition-all duration-700"
          style={{ width: `${(unlockedDays / 30) * 100}%` }}
        />
      </div>
    </section>
  );
};