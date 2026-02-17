/* eslint-disable react-refresh/only-export-components */
// src/contexts/UsernameContext.tsx - FIXED: login existing + device-lock

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

// Generate/retrieve a persistent unique device ID
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem("ramadan-device-id");
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("ramadan-device-id", deviceId);
  }
  return deviceId;
};

export const UsernameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore from localStorage
  useEffect(() => {
    const loadUsername = async () => {
      try {
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
    if (!trimmedUsername)
      return { success: false, message: "Username cannot be empty" };
    if (trimmedUsername.length < 3)
      return {
        success: false,
        message: "Username must be at least 3 characters",
      };
    if (trimmedUsername.length > 20)
      return {
        success: false,
        message: "Username must be less than 20 characters",
      };
    if (!/^[a-z0-9_-]+$/.test(trimmedUsername)) {
      return {
        success: false,
        message:
          "Username can only contain letters, numbers, hyphens and underscores",
      };
    }

    try {
      const deviceId = getDeviceId();

      // Check if username already exists in Supabase
      const existing = await storage.get(`user:${trimmedUsername}`);

      if (existing) {
        // ── Username EXISTS ── try to log in
        let userData: {
          username: string;
          createdAt: string;
          deviceId?: string | null;
        } | null = null;
        try {
          userData = JSON.parse(existing.value);
        } catch {
          userData = null;
        }

        const registeredDevice = userData?.deviceId;

        if (registeredDevice && registeredDevice !== deviceId) {
          // Locked to a different device
          return {
            success: false,
            message:
              "⚠️ This username is currently active on another device. Please log out from that device first.",
          };
        }

        // Same device, or no device lock — grant access
        await storage.set(
          `user:${trimmedUsername}`,
          JSON.stringify({
            username: trimmedUsername,
            createdAt: userData?.createdAt ?? new Date().toISOString(),
            deviceId, // (re-)register this device
          }),
        );

        localStorage.setItem("ramadan-username", trimmedUsername);
        setUsernameState(trimmedUsername);
        return {
          success: true,
          message: `Welcome back, ${trimmedUsername}! 🌙`,
        };
      }

      // ── Username does NOT exist ── register new user
      await storage.set(
        `user:${trimmedUsername}`,
        JSON.stringify({
          username: trimmedUsername,
          createdAt: new Date().toISOString(),
          deviceId,
        }),
      );

      localStorage.setItem("ramadan-username", trimmedUsername);
      setUsernameState(trimmedUsername);
      return {
        success: true,
        message: "Username created! Welcome to Ramadan Companion 🌙",
      };
    } catch (error) {
      console.error("Username set error:", error);
      return {
        success: false,
        message:
          "Failed to save username. Please check your connection and try again.",
      };
    }
  };

  const logout = async () => {
    const localUsername = localStorage.getItem("ramadan-username");
    if (localUsername) {
      try {
        // Release the device lock in Supabase so another device can log in
        const existing = await storage.get(`user:${localUsername}`);
        if (existing) {
          let userData: {
            username: string;
            createdAt: string;
            deviceId?: string | null;
          } | null = null;
          try {
            userData = JSON.parse(existing.value);
          } catch {
            userData = null;
          }
          if (userData) {
            await storage.set(
              `user:${localUsername}`,
              JSON.stringify({
                username: userData.username,
                createdAt: userData.createdAt,
                deviceId: null,
              }),
            );
          }
        }
      } catch (err) {
        console.error("Logout cleanup error:", err);
      }
    }
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
  if (!context)
    throw new Error("useUsername must be used within a UsernameProvider");
  return context;
};
