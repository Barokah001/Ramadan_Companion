export interface Quote {
  id: number;
  text: string;
  source: "Qur'an" | "Hadith";
  category: "motivation" | "prayer" | "guidance" | "remembrance" | "wisdom";
  reference: string;
}

export interface DailyImage {
  id: number;
  unlockDate: Date;
  isUnlocked: boolean;
}

export type Category = {
  id: string;
  label: string;
};
