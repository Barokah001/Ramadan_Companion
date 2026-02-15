// src/data/images.ts

export interface DailyImage {
  id: number;
  day: number;
  path: string;
  alt: string;
  description?: string;
}

export const dailyImages: DailyImage[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  day: i + 1,
  path: `/images/day-${i + 1}.png`,
  alt: `Ramadan Day ${i + 1} Reflection`,
  description: `Day ${i + 1} of Ramadan`,
}));
