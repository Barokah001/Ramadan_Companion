// src/components/UsernameModal.tsx - PROPER SIZING

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

    if (!result.success) {
      setMessage({ type: "error", text: result.message });
    } else {
      setMessage({ type: "success", text: result.message });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`flex flex-col gap-3 items-center justify-center w-full max-w-sm h-90 px-10 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl shadow-2xl`}
        style={{ maxWidth: "450px" }}
      >

        {/* Title */}
        <h2
          className={`text-l font-bold text-center mb-1 ${
            darkMode ? "text-gray-100" : "text-[#5C2E2E]"
          }`}
        >
          Welcome to Ramadan Companion!
        </h2>

        <p
          className={`text-center text-l mb- ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
        >
          Choose your unique username to begin
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className={`block text-l font-medium mb-1.5 ${
                darkMode ? "text-gray-200" : "text-[#5C2E2E]"
              }`}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., abdullah_123"
              className={`w-full h-8 px-3 py-2.5 rounded-lg text-l border-none ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600"
                  : "bg-gray-50 text-[#5C2E2E]"
              } focus:outline-none focus:ring-${
                darkMode ? "amber-500" : "[#8B4545]"
              }`}
              disabled={isSubmitting}
              autoFocus
            />
            <p
              className={`text-sm mt-1 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
            >
              3-20 characters • lowercase, numbers, - and _
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
            className={`w-full h-8 py-2.5 rounded-lg font-medium text-sm ${
              darkMode
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[#8B4545] hover:bg-[#6B3535] text-white"
            } ${
              isSubmitting || username.trim().length < 3
                ? "opacity-50 cursor-not-allowed"
                : ""
            } flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={14} />
                <span>Setting username...</span>
              </>
            ) : (
              <span>Continue to App</span>
            )}
          </button>
        </form>


        {/* Footer */}
        <div className=" flex items-center justify-center mt-3 text-center">
          <p className="text-l">🌙</p>
          <p
            className={`text-xs ${darkMode ? "text-gray-400" : "text-[#8B4545]"}`}
          >
            Ramadan Mubarak
          </p>
        </div>
      </div>
    </div>
  );
};
