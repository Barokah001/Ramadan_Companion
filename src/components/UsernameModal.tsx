// src/components/UsernameModal.tsx - Fully Responsive

import React, { useState } from "react";
import { User, AlertCircle, CheckCircle, Loader } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className={`${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-[#5C2E2E]/10"
        } rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl border max-w-md w-full transform transition-all`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div
            className={`p-3 sm:p-4 rounded-full flex-shrink-0 shadow-lg ${
              darkMode ? "bg-amber-600" : "bg-[#8B4545]"
            }`}
          >
            <User className="text-white" size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h2
              className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              } mb-2`}
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Welcome to Ramadan Companion!
            </h2>
            <p
              className={`text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-[#8B4545]"
              }`}
            >
              Choose your unique username to begin
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label
              htmlFor="username"
              className={`block text-sm sm:text-base font-medium ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              } mb-2 sm:mb-3`}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., abdullah_123"
              className={`w-full px-4 py-3 sm:py-4 rounded-xl text-base ${
                darkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                  : "bg-gray-50 text-[#5C2E2E] border-[#5C2E2E]/10 placeholder-gray-400"
              } border focus:outline-none focus:ring-2 ${
                darkMode ? "focus:ring-amber-500" : "focus:ring-[#8B4545]"
              } transition-all`}
              disabled={isSubmitting}
              autoFocus
              autoComplete="off"
            />
            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-gray-400" : "text-[#8B4545]"
              } mt-2`}
            >
              3-20 characters • lowercase letters, numbers, hyphens and
              underscores only
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                message.type === "error"
                  ? darkMode
                    ? "bg-red-900/20 border-red-700"
                    : "bg-red-50 border-red-200"
                  : darkMode
                    ? "bg-green-900/20 border-green-700"
                    : "bg-green-50 border-green-200"
              } border`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {message.type === "error" ? (
                  <AlertCircle className="text-red-500" size={20} />
                ) : (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
              <p
                className={`text-sm sm:text-base flex-1 ${
                  message.type === "error"
                    ? darkMode
                      ? "text-red-300"
                      : "text-red-700"
                    : darkMode
                      ? "text-green-300"
                      : "text-green-700"
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || username.trim().length < 3}
            className={`w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              darkMode
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-[#8B4545] hover:bg-[#6B3535] text-white"
            } flex items-center justify-center gap-2`}
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin" size={20} />
                <span>Setting username...</span>
              </>
            ) : (
              <span>Continue to App</span>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div
          className={`mt-6 sm:mt-8 p-4 sm:p-5 rounded-xl ${
            darkMode ? "bg-gray-700" : "bg-[#EAD7C0]/50"
          }`}
        >
          <p
            className={`text-sm sm:text-base ${
              darkMode ? "text-gray-300" : "text-[#8B4545]"
            } leading-relaxed`}
          >
            <strong
              className={`block mb-2 ${
                darkMode ? "text-gray-100" : "text-[#5C2E2E]"
              }`}
            >
              Why username?
            </strong>
            Your username personalizes your experience and helps us provide
            tailored spiritual insights just for you. It's your unique
            identifier on your Ramadan journey.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="mt-6 text-center">
          <p
            className={`text-2xl sm:text-3xl ${
              darkMode ? "text-amber-500" : "text-[#8B4545]"
            }`}
          >
            🌙
          </p>
        </div>
      </div>
    </div>
  );
};
