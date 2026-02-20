// src/utils/progressCalculation.ts - NEW balanced formula with room for growth

/**
 * NEW PROGRESS CALCULATION SYSTEM
 * ================================
 *
 * Core principle: Users can always do better. No hard caps.
 *
 * BREAKDOWN (totals 100%):
 * - Prayers:        40% (8% per prayer)
 * - Morning Adhkar: 12%
 * - Evening Adhkar: 12%
 * - Quran Reading:  28% (1% per page, capped at 28 pages for 28%)
 * - Custom Tasks:    8% (completion rate of custom tasks)
 *
 * Total: 100%
 *
 * WHY THIS WORKS:
 * - Base excellent day: 5 prayers + both adhkar + 10 pages + 100% custom = 92-100%
 * - Can exceed 100% by reading more Quran or adding/completing more custom tasks
 * - But displayed as max 100% in UI
 * - Reading 28+ pages = full Quran credit
 * - Custom tasks reward consistency (completion rate matters more than quantity)
 */

const PRAYER_WEIGHT = 40; // 5 prayers × 8% each
const MORNING_WEIGHT = 12;
const EVENING_WEIGHT = 12;
const QURAN_WEIGHT = 28; // 1% per page, max 28%
const QURAN_MAX_PAGES = 28; // Cap at 28 pages for full credit
const CUSTOM_WEIGHT = 8; // Completion rate × 8%

interface Prayer {
  name: string;
  completed: boolean;
}

interface CustomTask {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Calculate daily progress percentage (0-100)
 *
 * @param prayers - Array of 5 prayers with completion status
 * @param morningDhikr - Whether morning adhkar completed
 * @param eveningDhikr - Whether evening adhkar completed
 * @param quranPages - Number of Quran pages read (uncapped)
 * @param customTasks - Optional array of custom tasks
 * @returns Progress percentage (0-100, capped at 100 for display)
 */
export const calculateProgress = (
  prayers: Prayer[] | number, // Accept array or count
  morningDhikr: boolean,
  eveningDhikr: boolean,
  quranPages: number,
  customTasks?: CustomTask[],
): number => {
  // Handle both Prayer[] and number for backwards compatibility
  const prayerCount = Array.isArray(prayers)
    ? prayers.filter((p) => p.completed).length
    : prayers;

  // Prayer score: 8% per prayer
  const prayerScore = (prayerCount / 5) * PRAYER_WEIGHT;

  // Adhkar scores
  const morningScore = morningDhikr ? MORNING_WEIGHT : 0;
  const eveningScore = eveningDhikr ? EVENING_WEIGHT : 0;

  // Quran score: 1% per page, capped at 28 pages
  const quranScore = Math.min(quranPages / QURAN_MAX_PAGES, 1) * QURAN_WEIGHT;

  // Custom tasks score: completion rate × 8%
  let customScore = 0;
  if (customTasks && customTasks.length > 0) {
    const completed = customTasks.filter((t) => t.completed).length;
    const completionRate = completed / customTasks.length;
    customScore = completionRate * CUSTOM_WEIGHT;
  }

  const raw =
    prayerScore + morningScore + eveningScore + quranScore + customScore;

  // Cap at 100 for display, but allow internal calculation to exceed
  return Math.min(Math.round(raw), 100);
};

/**
 * Get a breakdown of progress components (for debugging/display)
 */
export const getProgressBreakdown = (
  prayers: Prayer[] | number,
  morningDhikr: boolean,
  eveningDhikr: boolean,
  quranPages: number,
  customTasks?: CustomTask[],
) => {
  const prayerCount = Array.isArray(prayers)
    ? prayers.filter((p) => p.completed).length
    : prayers;

  const prayerScore = (prayerCount / 5) * PRAYER_WEIGHT;
  const morningScore = morningDhikr ? MORNING_WEIGHT : 0;
  const eveningScore = eveningDhikr ? EVENING_WEIGHT : 0;
  const quranScore = Math.min(quranPages / QURAN_MAX_PAGES, 1) * QURAN_WEIGHT;

  let customScore = 0;
  let customRate = 0;
  if (customTasks && customTasks.length > 0) {
    const completed = customTasks.filter((t) => t.completed).length;
    customRate = completed / customTasks.length;
    customScore = customRate * CUSTOM_WEIGHT;
  }

  return {
    prayers: Math.round(prayerScore),
    morning: Math.round(morningScore),
    evening: Math.round(eveningScore),
    quran: Math.round(quranScore),
    custom: Math.round(customScore),
    total: Math.min(
      Math.round(
        prayerScore + morningScore + eveningScore + quranScore + customScore,
      ),
      100,
    ),
    customRate: Math.round(customRate * 100),
  };
};

/**
 * Convert total Quran pages to Juz
 * 1 Juz = 20 pages (standard Quran division)
 */
export const pagesToJuz = (pages: number): string => {
  const juz = pages / 20;
  return juz.toFixed(1); // e.g., "1.5 Juz"
};

/**
 * Get a motivational message based on progress
 */
export const getProgressMessage = (progress: number): string => {
  if (progress >= 95) return "Outstanding! MashaAllah! 🌟";
  if (progress >= 85) return "Excellent work! Keep it up! 💪";
  if (progress >= 70) return "Great effort today! 👏";
  if (progress >= 50) return "Good progress! Keep going! 📈";
  if (progress >= 30) return "You're building momentum! 🌱";
  return "Every step counts! Start today! 🤲";
};
