// src/components/UsernameModal.tsx - FIXED: better UX for returning users

import React, { useState } from "react";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

interface UsernameModalProps {
  darkMode: boolean;
  onSubmit: (
    username: string,
  ) => Promise<{ success: boolean; message: string }>;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({
  darkMode,
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);
    const result = await onSubmit(username);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`flex flex-col gap-3 items-center justify-center w-full px-8 py-8 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-2xl`}
        style={{ maxWidth: "440px" }}
      >

        {/* Title */}
        <h2
          className={`text-xl font-bold text-center ${darkMode ? "text-gray-100" : "text-[#5C2E2E]"}`}
        >
          Welcome to Ramadan Companion
        </h2>

        {/* Subtitle */}
        <p
          className={`text-center text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
        >
          Enter your username to begin — or type your existing username to pick
          up where you left off.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-2">
          <div>
            <label
              htmlFor="username"
              className={`block text-sm font-medium mb-1.5 ${darkMode ? "text-gray-200" : "text-[#5C2E2E]"}`}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., abdullah_123"
              className={`w-full px-3 py-2.5 rounded-lg text-sm border ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-50 text-[#5C2E2E] border-gray-200"
              } focus:outline-none focus:ring-2 focus:ring-[#8B4545]`}
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs mt-1 text-gray-500">
              3–20 characters • lowercase letters, numbers, - and _
            </p>
          </div>

          {message && (
            <div
              className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${
                message.type === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle size={16} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || username.trim().length < 3}
            className={`w-full py-2.5 rounded-lg font-medium text-sm ${
              darkMode
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[#8B4545] hover:bg-[#6B3535] text-white"
            } ${isSubmitting || username.trim().length < 3 ? "opacity-50 cursor-not-allowed" : ""} flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={14} />
                <span>Checking…</span>
              </>
            ) : (
              <span>Continue →</span>
            )}
          </button>
        </form>

        {/* Hint */}
        <p
          className={`text-xs text-center mt-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}
        >
          New here? Your username will be created automatically.
          <br />
          Returning? Just type your existing username.
        </p>
      </div>
    </div>
  );
};
