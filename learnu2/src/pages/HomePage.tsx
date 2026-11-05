import { useTheme } from "../context/ThemeContext";
import { GRAPHQL_URL, authFetch } from "../utils/api";
import { useEffect, useState } from "react";
import { Users, BookOpen } from "lucide-react";
import { Hero } from "../components/Hero";
import DashboardActivities from "../components/DashboardActivities";
import ChatbotImage from "../assets/chatbot.png";



export function HomePage() {
  const { darkMode: isDark } = useTheme();

  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const query = `
          {
            students { id }
            courses { id name }
          }
        `;

        const res = await authFetch(GRAPHQL_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });

        if (res.type === "opaque" || res.status === 0) {
          setTimeout(loadStats, 800);
          return;
        }

        const result = await res.json();
        if (result.errors) {
          setError("❌ Failed to load stats from GraphQL Gateway.");
        } else {
          const students = result.data?.students ?? [];
          const courses = result.data?.courses ?? [];
          setTotalStudents(students.length);
          setTotalCourses(courses.length);
          setError("");
        }
      } catch (e: any) {
        setError("⚠️ Cannot connect to Gateway.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const stats = [
    {
      title: "Total Students",
      value: loading ? "Loading..." : totalStudents.toLocaleString(),
      trend: "+12%",
      color: "#22D3EE",
      icon: Users,
    },
    {
      title: "Active Courses",
      value: loading ? "Loading..." : totalCourses.toLocaleString(),
      trend: "+4%",
      color: "#0EA5E9",
      icon: BookOpen,
    },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-[#F8FAFC] text-gray-900"
      }`}
    >
      {/* 🧭 HERO */}
      <Hero
        title="Welcome to LearnU2"
        subtitle="All your academic insights in one modern and powerful dashboard. Track students, courses and analytics effortlessly."
      />

      {/* 📊 STATS SECTION */}
      <section className="px-10 -mt-16 relative z-20">
        <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl transition-all hover:scale-[1.02] ${
                isDark
                  ? "bg-gray-800 border border-gray-700 shadow-lg"
                  : "bg-white/90 border border-slate-100 shadow-md"
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <div
                  className="p-4 rounded-xl"
                  style={{
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}33`,
                  }}
                >
                  <stat.icon size={28} style={{ color: stat.color }} />
                </div>
                <div
                  className="px-3 py-1 text-sm font-semibold rounded-md"
                  style={{
                    color: "#16A34A",
                    backgroundColor: "rgba(34,197,94,0.1)",
                  }}
                >
                  {stat.trend}
                </div>
              </div>
              <h4 className="text-gray-500 text-sm">{stat.title}</h4>
              <p
                className="text-4xl font-bold mt-1"
                style={{ color: isDark ? "#E0F2FE" : "#1E293B" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <p className="text-center text-red-400 text-lg mt-6">{error}</p>
        )}
      </section>

      {/* 👥 USER ACTIVITIES INSTEAD OF CHARTS */}
      <section className="px-10 py-16">
        <div className="max-w-[1600px] mx-auto">
          <DashboardActivities />
        </div>
      </section>

      {/* 🤖 CHATBOT PRESENTATION */}
      <section className="px-10 pb-20 mt-10">
        <div
          className={`max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 p-10 rounded-2xl ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-slate-100"
          }`}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold leading-tight text-slate-800 dark:text-gray-100">
              LearnU2 Smart Chatbot
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-gray-400 max-w-[600px]">
              Your intelligent assistant designed to support students and
              teachers. The LearnU2 Chatbot helps you translate academic content
              and summarize long reports all in one click.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="/chatbot"
                className="px-6 py-3 rounded-xl font-medium text-white transition-all"
                style={{
                  background: "linear-gradient(90deg, #22D3EE, #0EA5E9)",
                  boxShadow: "0 4px 12px rgba(14,165,233,0.25)",
                }}
              >
                Try the Chatbot
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <img
              src={ChatbotImage}
              alt="LearnU2 Chatbot"
              className="rounded-2xl shadow-lg max-h-[320px] object-contain hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
