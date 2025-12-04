// src/App.tsx

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { QuoteCard } from './components/QuoteCard';
import { ImageGallery } from './components/ImageGallery';
import { FavoritesList } from './components/FavoritesList';
import { quotes } from './lib/quotes';

const App: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const randomQuote = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * quotes.length);
    } while (newIndex === currentQuoteIndex && quotes.length > 1);
    setCurrentQuoteIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-[rgb(245,235,220)] flex flex-col items-center justify-center gap-4">
      <Header />

      <main className="max-w-full mx-auto px-6">
        {/* Daily Wisdom Section */}
        <section className="mb-10">
          <div className="flex flex-col gap-3 items-center justify-center text-center my-3">
            <h2 
              className="text-2xl md:text-4xl font-bold text-[#5C2E2E]" 
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Daily Wisdom
            </h2>
            <p className="text-base text-[#8B4545]">
              Discover inspiration from the Quran and Hadith
            </p>
          </div>

          {/* Quote Display */}
          <div className="flex items-center justify-center ">
            <QuoteCard quote={quotes[currentQuoteIndex]} />
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center gap-4 my-3">
            <button
              onClick={prevQuote}
              className="flex items-center justify-center h-10 w-10 p-3 rounded-full bg-white shadow-md border border-[#5C2E2E]/15 hover:bg-[#EAD7C0] transition-colors"
              aria-label="Previous quote"
            >
              <ChevronLeft size={24} className="text-[#5C2E2E]" />
            </button>

            <button
              onClick={randomQuote}
              className="flex items-center justify-center h-10 w-10 p-3 rounded-full bg-[#8B4545] shadow-md hover:bg-[#5C2E2E] transition-colors"
              aria-label="Random quote"
            >
              <Sparkles size={24} className="text-white" />
            </button>

            <button
              onClick={nextQuote}
              className="flex items-center justify-center h-10 w-10 p-3 rounded-full bg-white shadow-md border border-[#5C2E2E]/15 hover:bg-[#EAD7C0] transition-colors"
              aria-label="Next quote"
            >
              <ChevronRight size={24} className="text-[#5C2E2E]" />
            </button>
          </div>

          {/* Counter */}
          <p className="text-center mt-4 text-sm text-[#8B4545]">
            {currentQuoteIndex + 1} of {quotes.length}
          </p>
        </section>

        {/* Favorites Section */}
        <FavoritesList />

        {/* Image Gallery Section */}
        <ImageGallery />
      </main>

      {/* Footer */}
      <footer className="text-center py-5 border-t border-[#5C2E2E]/15 bg-white w-full">
        <p className="text-base text-[#8B4545] mb-2">
          May this Ramadan bring peace, blessings, and spiritual growth
        </p>
        <p className="text-sm text-[#A05A5A]">
          Ramadan Mubarak 🌙
        </p>
      </footer>
    </div>
  );
};

export default App;