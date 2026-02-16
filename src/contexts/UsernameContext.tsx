/* eslint-disable react-refresh/only-export-components */
// src/contexts/UsernameContext.tsx - FIXED with localStorage + logout

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { storage } from "../lib/supabase";

interface UsernameContextType {
  username: string | null;
  setUsername: (
    username: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const UsernameContext = createContext<UsernameContextType | undefined>(
  undefined,
);

export const UsernameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load username from localStorage on mount
  useEffect(() => {
    const loadUsername = async () => {
      try {
        // Check localStorage first (device-specific)
        const localUsername = localStorage.getItem("ramadan-username");
        if (localUsername) {
          setUsernameState(localUsername);
        }
      } catch (error) {
        console.error("Failed to load username:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsername();
  }, []);

  const setUsername = async (
    newUsername: string,
  ): Promise<{ success: boolean; message: string }> => {
    const trimmedUsername = newUsername.trim().toLowerCase();

    // Validation
    if (!trimmedUsername) {
      return { success: false, message: "Username cannot be empty" };
    }

    if (trimmedUsername.length < 3) {
      return {
        success: false,
        message: "Username must be at least 3 characters",
      };
    }

    if (trimmedUsername.length > 20) {
      return {
        success: false,
        message: "Username must be less than 20 characters",
      };
    }

    if (!/^[a-z0-9_-]+$/.test(trimmedUsername)) {
      return {
        success: false,
        message:
          "Username can only contain letters, numbers, hyphens and underscores",
      };
    }

    try {
      // Check if username is already taken
      const existingUsers = await storage.list("user:");

      if (existingUsers && existingUsers.keys) {
        const takenUsernames = existingUsers.keys.map((key) =>
          key.replace("user:", ""),
        );

        if (takenUsernames.includes(trimmedUsername)) {
          return {
            success: false,
            message: "This username is already taken. Please choose another.",
          };
        }
      }

      // Save username to localStorage (device-specific)
      localStorage.setItem("ramadan-username", trimmedUsername);

      // Register username in Supabase (for global registry and data storage)
      await storage.set(
        `user:${trimmedUsername}`,
        JSON.stringify({
          username: trimmedUsername,
          createdAt: new Date().toISOString(),
        }),
      );

      setUsernameState(trimmedUsername);
      return { success: true, message: "Username set successfully!" };
    } catch (error) {
      console.error("Username set error:", error);
      return {
        success: false,
        message: "Failed to save username. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("ramadan-username");
    setUsernameState(null);
  };

  return (
    <UsernameContext.Provider
      value={{ username, setUsername, logout, isLoading }}
    >
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = (): UsernameContextType => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};
