// src/utils/quoteHelpers.ts

import type { Quote } from "../lib/quotes";


/**
 * Transform raw quote from database format to app format
 * Input: { id, text, reference, arabic, category }
 * Output: { id, text, source, reference, category }
 */
export const transformQuote = (rawQuote: any): Quote => {
  // Extract source from reference (e.g., "Qur'an 94:6" -> source: "Qur'an", reference: "94:6")
  const referenceMatch = rawQuote.reference.match(/^(Qur'an|Hadith.*?)\s*[-:]?\s*(.+)$/);
  
  let source = 'Unknown';
  let reference = rawQuote.reference;
  
  if (referenceMatch) {
    source = referenceMatch[1].trim();
    reference = referenceMatch[2].trim();
  }
  
  return {
    id: rawQuote.id,
    text: rawQuote.text,
    source: source,
    reference: reference,
    category: rawQuote.category
  };
};

/**
 * Get a random quote from an array
 */
export const getRandomQuote = (quotes: Quote[]): Quote => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

/**
 * Get quotes by category
 */
export const getQuotesByCategory = (quotes: Quote[], category: string): Quote[] => {
  return quotes.filter(q => q.category === category);
};

/**
 * Shuffle array of quotes
 */
export const shuffleQuotes = (quotes: Quote[]): Quote[] => {
  const shuffled = [...quotes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};