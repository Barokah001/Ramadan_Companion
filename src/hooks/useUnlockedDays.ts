// src/hooks/useUnlockedDays.ts

import { useState, useEffect } from "react";
import { getUnlockedDays } from "../utils/dateHelpers";

export const useUnlockedDays = (startDate: string, maxDays: number = 30) => {
  const [unlockedDays, setUnlockedDays] = useState<number>(0);

  useEffect(() => {
    const updateUnlockedDays = () => {
      const days = getUnlockedDays(startDate, maxDays);
      setUnlockedDays(days);
    };

    // Initial calculation
    updateUnlockedDays();

    // Update every minute to check for new day
    const interval = setInterval(updateUnlockedDays, 60000);

    return () => clearInterval(interval);
  }, [startDate, maxDays]);

  return unlockedDays;
};
