// src/data/images.ts
export interface DailyImage {
  id: number;
  day: number;
  path: string;
  alt: string;
  description?: string;
}

// Days 1-20: Local images (already uploaded)
const localImages = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  day: i + 1,
  path: `/images/day-${i + 1}.png`,
  alt: `Ramadan Day ${i + 1} Reflection`,
  description: `Day ${i + 1} of Ramadan`,
}));

// Days 21-30: Cloudinary images
const cloudinaryImages: DailyImage[] = [
  {
    id: 21,
    day: 21,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913366/day-21_xwz2qi.png", // Replace XXXXX
    alt: "Ramadan Day 21 Reflection",
    description: "Day 21 of Ramadan",
  },
  {
    id: 22,
    day: 22,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913372/day-22_jpjw2j.png", // Replace XXXXX
    alt: "Ramadan Day 22 Reflection",
    description: "Day 22 of Ramadan",
  },
  {
    id: 23,
    day: 23,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913357/day-23_j2vadd.png",
    alt: "Ramadan Day 23 Reflection",
    description: "Day 23 of Ramadan",
  },
  {
    id: 24,
    day: 24,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913406/day-24_flgdq4.png",
    alt: "Ramadan Day 24 Reflection",
    description: "Day 24 of Ramadan",
  },
  {
    id: 25,
    day: 25,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913350/day-25_yq84ed.png",
    alt: "Ramadan Day 25 Reflection",
    description: "Day 25 of Ramadan",
  },
  {
    id: 26,
    day: 26,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913336/day-26_mjs7po.png",
    alt: "Ramadan Day 26 Reflection",
    description: "Day 26 of Ramadan",
  },
  {
    id: 27,
    day: 27,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913363/day-27_ydnn7b.png",
    alt: "Ramadan Day 27 Reflection",
    description: "Day 27 of Ramadan",
  },
  {
    id: 28,
    day: 28,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913412/day-28_ugcqyq.png",
    alt: "Ramadan Day 28 Reflection",
    description: "Day 28 of Ramadan",
  },
  {
    id: 29,
    day: 29,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913389/day-29_xyvflv.png",
    alt: "Ramadan Day 29 Reflection",
    description: "Day 29 of Ramadan",
  },
  {
    id: 30,
    day: 30,
    path: "https://res.cloudinary.com/dtpphzmp8/image/upload/v1772913322/day-30_btggsp.png",
    alt: "Ramadan Day 30 Reflection",
    description: "Day 30 of Ramadan",
  },
];

export const dailyImages: DailyImage[] = [...localImages, ...cloudinaryImages];
