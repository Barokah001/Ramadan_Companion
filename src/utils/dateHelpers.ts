// src/utils/dateHelpers.ts

export const calculateDaysSince = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(diffDays + 1, 0);
};

export const getUnlockedDays = (
  startDate: string,
  maxDays: number = 30
): number => {
  const daysSince = calculateDaysSince(startDate);
  return Math.min(daysSince, maxDays);
};

export const isImageUnlocked = (day: number, startDate: string): boolean => {
  const unlockedDays = getUnlockedDays(startDate);
  return day <= unlockedDays;
};

export const formatRamadanDate = (day: number): string => {
  return `Day ${day} of Ramadan`;
};

export const getDaysRemaining = (
  startDate: string,
  totalDays: number = 30
): number => {
  const daysPassed = getUnlockedDays(startDate, totalDays);
  return Math.max(totalDays - daysPassed, 0);
};
