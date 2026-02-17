/* eslint-disable react-refresh/only-export-components */
// src/contexts/UsernameContext.tsx - FIXED: Login existing + device lock

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

// Generate a stable device ID for this browser
function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem("ramadan-device-id");
  if (!deviceId) {
    deviceId =
      "device_" +
      Math.random().toString(36).substring(2) +
      Date.now().toString(36);
    localStorage.setItem("ramadan-device-id", deviceId);
  }
  return deviceId;
}

export const UsernameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [username, setUsernameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: restore username from localStorage (device-specific session)
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

    // ── Validation ───────────────────────────────────────────────────────────
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
    if (!/^[a-z0-9_-]+$/.test(trimmedUsername))
      return {
        success: false,
        message:
          "Username can only contain letters, numbers, hyphens and underscores",
      };

    try {
      const deviceId = getOrCreateDeviceId();

      // Check if this username already exists in Supabase
      const existingUser = await storage.get(`user:${trimmedUsername}`);

      if (existingUser) {
        // ── Username exists ───────────────────────────────────────────────────
        let userData: Record<string, unknown> = {};
        try {
          userData = JSON.parse(existingUser.value);
        } catch {
          userData = {};
        }

        const lockedDeviceId = userData.deviceId as string | null | undefined;

        if (lockedDeviceId && lockedDeviceId !== deviceId) {
          // Locked to a DIFFERENT device → deny access
          return {
            success: false,
            message:
              "This username is currently logged in on another device. Please log out there first, then try again here.",
          };
        }

        // Either no lock, or same device → allow login
        await storage.set(
          `user:${trimmedUsername}`,
          JSON.stringify({
            ...userData,
            username: trimmedUsername,
            deviceId, // lock to this device
            lastLoginAt: new Date().toISOString(),
          }),
        );

        localStorage.setItem("ramadan-username", trimmedUsername);
        setUsernameState(trimmedUsername);
        return { success: true, message: "Welcome back! 🌙 Logging you in..." };
      }

      // ── Username does NOT exist → register fresh ──────────────────────────
      await storage.set(
        `user:${trimmedUsername}`,
        JSON.stringify({
          username: trimmedUsername,
          createdAt: new Date().toISOString(),
          deviceId, // lock to this device
          lastLoginAt: new Date().toISOString(),
        }),
      );

      localStorage.setItem("ramadan-username", trimmedUsername);
      setUsernameState(trimmedUsername);
      return { success: true, message: "Username created! Welcome aboard 🌙" };
    } catch (error) {
      console.error("Username set error:", error);
      return {
        success: false,
        message: "Failed to connect. Check your connection and try again.",
      };
    }
  };

  const logout = async () => {
    const currentUsername = localStorage.getItem("ramadan-username");

    if (currentUsername) {
      try {
        // Remove the device lock from Supabase so the user can log in elsewhere
        const existingUser = await storage.get(`user:${currentUsername}`);
        if (existingUser) {
          let userData: Record<string, unknown> = {};
          try {
            userData = JSON.parse(existingUser.value);
          } catch {
            userData = {};
          }
          await storage.set(
            `user:${currentUsername}`,
            JSON.stringify({
              ...userData,
              deviceId: null, // ← unlock the username
              lastLogoutAt: new Date().toISOString(),
            }),
          );
        }
      } catch (error) {
        // Non-critical: still clear local session
        console.error("Logout unlock error:", error);
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
  if (!context) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};
