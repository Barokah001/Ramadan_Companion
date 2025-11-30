import { useState } from "react";

export const useUnlockedDays = () => {
  const [ramadanStart] = useState(() => {
    const saved = localStorage.getItem("ramadanStart");
    return saved ? new Date(saved) : new Date("2025-03-01"); // Default Ramadan start date
  });

  const getCurrentDay = () => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - ramadanStart.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.max(diffDays, 1), 30);
  };

  return getCurrentDay();
};
