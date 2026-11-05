import { authFetch } from "../utils/api";
import { useState } from "react";
import { FileText, Languages, Sparkles } from "lucide-react";

export default function AIAssistant() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("—");
  const [summary, setSummary] = useState("");
  const [translatedSummary, setTranslatedSummary] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isDark = document.body.classList.contains("dark");

  // --- CALL DJANGO CHATBOT API ---
  const processText = async (mode: "summary" | "translate") => {
    if (!input.trim()) return;

    setLoading(true);
    setErrorMsg("");

    setLanguage("—");
    setSummary("");
    setTranslatedSummary("");
    setTranslation("");

    try {
      const response = await authFetch("/chatbot/process/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, mode }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        if (response.status === 503 || response.status === 502 || response.status === 504) {
          throw new Error(
            "The AI service is not running. Start it with: docker compose --profile ai up --build",
          );
        }
        throw new Error(body.error || `The AI service answered with error ${response.status}.`);
      }

      const data = await response.json();

      setLanguage(data.detected_language === "fr" ? "French" : "English");
      if (mode === "summary") {
        setSummary(data.summary_original);
        setTranslatedSummary(data.summary_translated);
      } else {
        setTranslation(data.translated_text);
      }
    } catch (error) {
      console.error("❌ Error fetching chatbot:", error);
      setErrorMsg(error instanceof Error ? error.message : "The AI service cannot be reached.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen py-12 px-6 transition-all duration-500 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-[#E9F0F7] text-gray-900"
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        <h1
          className={`text-4xl font-bold mb-2 ${
            isDark ? "text-cyan-300" : "text-[#1E293B]"
          }`}
        >
          AI Assistant
        </h1>
        <p
          className={`opacity-80 mb-10 ${
            isDark ? "text-gray-300" : "text-[#3E4753]"
          }`}
        >
          Transformer-powered text analysis and translation
        </p>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div
            className={`p-8 rounded-3xl border transition-all duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border border-[#CAD8E4]"
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <Sparkles
                className={isDark ? "text-cyan-400" : "text-[#22D3EE]"}
                size={24}
              />
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-gray-100" : "text-[#1E293B]"
                }`}
              >
                Input Text
              </h2>
            </div>

            <textarea
              placeholder="Enter text to analyze, summarize, or translate..."
              className={`w-full min-h-[200px] rounded-2xl p-4 border outline-none resize-none transition-all ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100 focus:ring-2 focus:ring-cyan-400"
                  : "bg-[#F9FBFD] border-[#CAD8E4] text-[#1E293B] focus:ring-2 focus:ring-[#22D3EE]"
              }`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => processText("summary")}
                disabled={loading}
                className="bg-[#22D3EE] hover:bg-[#1EBBD1] text-white py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-all disabled:opacity-50"
              >
                <FileText size={18} />
                Summarize
              </button>

              <button
                onClick={() => processText("translate")}
                disabled={loading}
                className={`text-white py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 transition-all disabled:opacity-50 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-[#3E4753] hover:opacity-85"
                }`}
              >
                <Languages size={18} />
                Translate
              </button>
            </div>

            {/* LOADING */}
            {loading && (
              <p className="mt-4 text-cyan-400 font-semibold">
                ⏳ AI is thinking...
              </p>
            )}

            {/* ERROR */}
            {errorMsg && (
              <p className="mt-4 text-red-500 font-semibold">{errorMsg}</p>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col gap-5">
            {[
              { title: "🌐 Detected Language", value: language },
              {
                title: "📄 Original Summary",
                value: summary || "Summary will appear here...",
              },
              {
                title: "🌍 Translated Summary",
                value:
                  translatedSummary || "Translated summary will appear here...",
              },
              {
                title: "🧠 Full Translation",
                value: translation || "Full translation will appear here...",
              },
            ].map((section, i) => (
              <div
                key={i}
                className={`p-6 rounded-3xl shadow-sm border transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border border-[#E7EEF4]"
                }`}
              >
                <h3
                  className={`font-semibold ${
                    isDark ? "text-cyan-300" : "text-[#1E293B]"
                  }`}
                >
                  {section.title}
                </h3>
                <p
                  className={`mt-2 ${
                    isDark ? "text-gray-300" : "text-[#3E4753]"
                  }`}
                >
                  {section.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
