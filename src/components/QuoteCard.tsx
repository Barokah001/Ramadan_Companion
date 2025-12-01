// src/components/QuoteCard.tsx

import React from 'react';
import { Heart } from 'lucide-react';
import type { Quote } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isQuoteFavorite = isFavorite(quote.id);

  const getCategoryColor = () => {
    const colors: Record<string, string> = {
      motivation: '#D97706',
      prayer: '#059669',
      guidance: '#7C3AED',
      remembrance: '#DC2626',
      ramadan: '#2563EB',
      names_of_allah: '#9333EA'
    };
    return colors[quote.category] || '#8B4545';
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-md border border-[#5C2E2E]/15">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <span 
          className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white"
          style={{ backgroundColor: getCategoryColor() }}
        >
          {quote.category.replace('_', ' ')}
        </span>
        
        <button
          onClick={() => toggleFavorite(quote.id)}
          className={`p-2 rounded-full transition-colors ${
            isQuoteFavorite ? 'bg-[#8B4545]/10' : 'hover:bg-[#EAD7C0]'
          }`}
          aria-label={isQuoteFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={22}
            fill={isQuoteFavorite ? '#8B4545' : 'none'}
            stroke={isQuoteFavorite ? '#8B4545' : '#5C2E2E'}
          />
        </button>
      </div>
      
      {/* Quote Text */}
      <p 
        className="text-2xl md:text-3xl leading-relaxed italic text-[#5C2E2E] mb-4" 
        style={{ fontFamily: 'Crimson Text, serif' }}
      >
        "{quote.text}"
      </p>

      {/* Arabic Text */}
      {quote.arabic && quote.arabic.trim() && (
        <p 
          className="text-xl md:text-2xl text-[#8B4545] mb-6 text-right" 
          style={{ fontFamily: 'Arial, sans-serif', direction: 'rtl' }}
        >
          {quote.arabic}
        </p>
      )}
      
      {/* Source */}
      <p className="text-base font-semibold text-[#8B4545]">
        — {quote.source} {quote.reference && `${quote.reference}`}
      </p>
    </div>
  );
};