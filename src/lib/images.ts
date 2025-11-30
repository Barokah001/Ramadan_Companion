import { type DailyImage } from "../types";

export const DAILY_IMAGES: DailyImage[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: i + 1,
    day: i + 1,
    path: `/images/day-${i + 1}.jpg`,
    alt: `Day ${i + 1} - Ramadan Reflection`,
    description: `Beautiful reflection for day ${i + 1} of Ramadan`,
  })
);
