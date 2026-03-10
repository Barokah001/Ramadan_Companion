// src/utils/quranCalculations.ts

const PAGES_PER_QURAN = 604;
const PAGES_PER_JUZ = 20;

export interface QuranProgress {
  completeQurans: number;
  remainingPages: number;
  remainingJuz: number;
  totalPages: number;
}

export const calculateQuranProgress = (totalPages: number): QuranProgress => {
  const completeQurans = Math.floor(totalPages / PAGES_PER_QURAN);
  const remainingPages = totalPages % PAGES_PER_QURAN;
  const remainingJuz = parseFloat((remainingPages / PAGES_PER_JUZ).toFixed(1));

  return {
    completeQurans,
    remainingPages,
    remainingJuz,
    totalPages,
  };
};

export const formatQuranProgress = (totalPages: number): string => {
  if (totalPages === 0) return "0 pages";
  
  const progress = calculateQuranProgress(totalPages);
  
  if (progress.completeQurans === 0) {
    // Less than 1 complete Qur'an
    return `${totalPages} pages (${progress.remainingJuz} Juz)`;
  }
  
  if (progress.remainingPages === 0) {
    // Exact complete Qur'ans
    return `${progress.completeQurans} Complete Qur'an${progress.completeQurans > 1 ? 's' : ''}`;
  }
  
  // Complete Qur'an(s) + remaining pages
  return `${progress.completeQurans} Complete Qur'an${progress.completeQurans > 1 ? 's' : ''} + ${progress.remainingPages} pages (${progress.remainingJuz} Juz)`;
};

// Short version for compact displays (like cards)
export const formatQuranProgressShort = (totalPages: number): string => {
  if (totalPages === 0) return "0 Juz";
  
  const progress = calculateQuranProgress(totalPages);
  
  if (progress.completeQurans === 0) {
    // Less than 1 complete Qur'an
    return `${progress.remainingJuz} Juz`;
  }
  
  if (progress.remainingPages === 0) {
    // Exact complete Qur'ans
    return `${progress.completeQurans} Qur'an${progress.completeQurans > 1 ? 's' : ''}`;
  }
  
  // Complete Qur'an(s) + remaining
  return `${progress.completeQurans} Qur'an + ${progress.remainingJuz} Juz`;
};
