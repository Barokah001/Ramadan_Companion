// src/lib/dateUtils.ts - Helper functions to avoid timezone issues

/**
 * Get today's date in YYYY-MM-DD format using LOCAL timezone
 * (avoids the UTC offset bug where "2026-02-18" becomes "2026-02-17")
 */
export const getTodayLocalString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parse a date string (YYYY-MM-DD) as a LOCAL date, not UTC
 * @param dateStr - Date string in format "YYYY-MM-DD"
 * @returns Date object at midnight in local timezone
 */
export const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

/**
 * Format a Date object as YYYY-MM-DD in LOCAL timezone
 * @param date - Date object
 * @returns Formatted string
 */
export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
