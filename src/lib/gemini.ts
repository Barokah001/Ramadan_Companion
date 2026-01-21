// src/lib/gemini.ts

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("Gemini API key not found. AI features will be limited.");
}

export interface AIInsight {
  feedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export const generateWeeklyInsights = async (
  weekData: any[],
): Promise<AIInsight> => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured");
  }

  // Calculate statistics
  const stats = {
    totalPrayers: weekData.reduce((sum, day) => sum + day.prayers, 0),
    totalQuran: weekData.reduce((sum, day) => sum + day.quranPages, 0),
    totalDhikr: weekData.reduce(
      (sum, day) =>
        sum + (day.morningDhikr ? 1 : 0) + (day.eveningDhikr ? 1 : 0),
      0,
    ),
    totalCustomTasks: weekData.reduce(
      (sum, day) => sum + day.customTasksCompleted,
      0,
    ),
    avgProgress: Math.round(
      weekData.reduce((sum, day) => sum + day.totalProgress, 0) /
        weekData.length,
    ),
    consistencyScore: calculateConsistency(weekData),
  };

  const prompt = `Analyze this Muslim user's Ramadan spiritual activities for the past week and provide personalized, encouraging feedback in JSON format.

Weekly Statistics:
- Total Prayers Completed: ${stats.totalPrayers}/35 (5 prayers × 7 days)
- Quran Pages Read: ${stats.totalQuran}
- Adhkar Sessions: ${stats.totalDhikr}/14 (morning + evening × 7 days)
- Custom Islamic Tasks: ${stats.totalCustomTasks}
- Average Daily Progress: ${stats.avgProgress}%
- Consistency Score: ${stats.consistencyScore}%

Daily Breakdown:
${weekData.map((day, i) => `Day ${i + 1}: ${day.prayers} prayers, ${day.quranPages} Quran pages, ${day.morningDhikr ? "✓" : "✗"} morning dhikr, ${day.eveningDhikr ? "✓" : "✗"} evening dhikr, Progress: ${day.totalProgress}%`).join("\n")}

Provide a response in this exact JSON format (respond ONLY with valid JSON, no markdown formatting):
{
  "feedback": "2-3 sentences of warm, personalized feedback addressing their specific progress",
  "strengths": ["2-3 specific strengths you noticed"],
  "improvements": ["2-3 gentle suggestions for areas to improve"],
  "recommendations": ["3-4 specific, actionable recommendations for next week"]
}

Be specific about numbers, mention patterns you see, and keep tone warm and encouraging. Focus on Islamic spiritual growth. Respond ONLY with valid JSON.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();

    // Extract the generated text from Gemini's response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean up the response - remove markdown code blocks if present
    const cleanText = generatedText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse the JSON
    const insights: AIInsight = JSON.parse(cleanText);

    return insights;
  } catch (error) {
    console.error("Failed to generate insights with Gemini:", error);

    // Fallback to basic insights based on stats
    return generateFallbackInsights(stats, weekData);
  }
};

const calculateConsistency = (weekData: any[]): number => {
  const daysWithActivity = weekData.filter(
    (day) => day.totalProgress > 0,
  ).length;
  return Math.round((daysWithActivity / weekData.length) * 100);
};

const generateFallbackInsights = (stats: any, weekData: any[]): AIInsight => {
  const prayerRate = Math.round((stats.totalPrayers / 35) * 100);
  const dhikrRate = Math.round((stats.totalDhikr / 14) * 100);

  let feedback = `MashaAllah! You completed ${stats.totalPrayers} out of 35 prayers this week (${prayerRate}%). `;

  if (stats.totalQuran > 0) {
    feedback += `You read ${stats.totalQuran} pages of the Quran. `;
  }

  if (stats.avgProgress >= 70) {
    feedback +=
      "Your consistency is excellent. Keep up this beautiful dedication to your spiritual growth!";
  } else if (stats.avgProgress >= 50) {
    feedback +=
      "You're making good progress. With a bit more consistency, you can achieve even more next week.";
  } else {
    feedback +=
      "Every step counts in this blessed month. Start small and build consistency gradually.";
  }

  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  // Identify strengths
  if (prayerRate >= 80)
    strengths.push(`Excellent prayer consistency (${prayerRate}%)`);
  if (stats.totalQuran >= 7)
    strengths.push(
      `Strong commitment to Quran reading (${stats.totalQuran} pages)`,
    );
  if (dhikrRate >= 70)
    strengths.push(`Regular dhikr practice (${stats.totalDhikr}/14 sessions)`);
  if (stats.consistencyScore >= 80)
    strengths.push(`High consistency score (${stats.consistencyScore}%)`);

  // If no specific strengths, add general one
  if (strengths.length === 0) {
    strengths.push("Taking steps toward spiritual growth");
    strengths.push("Tracking your progress consistently");
  }

  // Identify improvements
  if (prayerRate < 80)
    improvements.push("Focus on completing all 5 daily prayers");
  if (stats.totalQuran < 7)
    improvements.push("Try to read at least one page of Quran daily");
  if (dhikrRate < 70)
    improvements.push("Make morning and evening adhkar a daily habit");
  if (stats.consistencyScore < 70)
    improvements.push("Build more consistent daily routines");

  // Add recommendations
  if (prayerRate < 100) {
    recommendations.push("Set prayer time reminders on your phone");
    recommendations.push("Pray in congregation when possible for extra reward");
  }
  if (stats.totalQuran < 14) {
    recommendations.push("Read one page of Quran after each Fajr prayer");
  }
  recommendations.push("Start your day with morning adhkar right after Fajr");
  recommendations.push("Keep a small notebook to track your daily progress");

  // Ensure we have at least 3 recommendations
  if (recommendations.length < 3) {
    recommendations.push("Make dua for consistency and steadfastness");
  }

  return {
    feedback,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    recommendations: recommendations.slice(0, 4),
  };
};

/*
  SETUP INSTRUCTIONS:
  
  1. Create a .env file in your project root
  2. Add your Gemini API key:
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
  
  3. Get your API key from:
     https://makersuite.google.com/app/apikey
  
  4. Make sure to add .env to your .gitignore file
*/
