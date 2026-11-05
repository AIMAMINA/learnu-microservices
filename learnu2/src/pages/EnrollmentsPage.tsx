import { GRAPHQL_URL, authFetch } from "../utils/api";
import { useEffect, useState } from "react";
import { User, BookOpen, X, ClipboardList, Users } from "lucide-react";
import api from "../utils/axiosInstance";

/** 🌐 Gateway principal (Render) */
const GQL_URL = GRAPHQL_URL;

export default function EnrollmentsPage() {
  const isDark = document.body.classList.contains("dark");

  // --- STATES PRINCIPAUX ---
  const [students, setStudents] = useState<{ name: string }[]>([]);
  const [courses, setCourses] = useState<{ name: string; instructor: string }[]>([]);
  const [assignments, setAssignments] = useState<
    { student: string; course: string; instructor: string }[]
  >(() => {
    const saved = localStorage.getItem("assignments");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  /** ================================
   * 📦 Sauvegarde automatique
   * ================================ */
  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments));
  }, [assignments]);

  /** ================================
   * 🔄 Charger les étudiants et cours
   * ================================ */
  const fetchData = async () => {
    try {
      const query = `
        {
          students { name }
          courses { name instructor }
        }
      `;
      const res = await authFetch(GQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(`GraphQL fetch failed (${res.status})`);
      const { data } = await res.json();
      setStudents(data?.students ?? []);
      setCourses(data?.courses ?? []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  /** ================================
   * 🧹 Nettoyage auto
   * ================================ */
  useEffect(() => {
    if (students.length > 0) {
      setAssignments((prev) => {
        const updated = prev.filter((a) =>
          students.some((s) => s.name === a.student)
        );
        localStorage.setItem("assignments", JSON.stringify(updated));
        return updated;
      });
    }
  }, [students]);

  /** ================================
   * ➕ Affecter un étudiant à un cours
   * ================================ */
  const handleAssign = async () => {
    if (!selectedStudent || !selectedCourse) return;

    const courseObj = courses.find((c) => c.name === selectedCourse);
    const alreadyAssigned = assignments.find(
      (a) => a.student === selectedStudent && a.course === selectedCourse
    );
    if (alreadyAssigned) return;

    const newAssignment = {
      student: selectedStudent,
      course: selectedCourse,
      instructor: courseObj ? courseObj.instructor : "—",
    };

    setAssignments([...assignments, newAssignment]);


    setSelectedStudent("");
    setShowDropdown(false);
  };

  /** ================================
   * ❌ Supprimer une assignation
   * ================================ */
  const handleRemove = async (student: string, course: string) => {
    const updated = assignments.filter(
      (a) => !(a.student === student && a.course === course)
    );
    setAssignments(updated);
    localStorage.setItem("assignments", JSON.stringify(updated));

  };

  /** ================================
   * 🔍 Filtrage des étudiants
   * ================================ */
  const filteredStudents = students
    .filter((s) =>
      s.name.toLowerCase().includes(selectedStudent.toLowerCase())
    )
    .slice(0, 15);

  /** ================================
   * 🖥️ RENDER
   * ================================ */
  return (
    <div
      className={`px-10 py-12 min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-[#F9FBFD] to-[#EEF3F8] text-gray-900"
      }`}
    >
      <div className="max-w-[1400px] mx-auto">
        {/* HEADER */}
        <header className="mb-10">
          <h1
            className={`text-4xl font-extrabold tracking-tight mb-3 ${
              isDark ? "text-cyan-300" : "text-[#1E293B]"
            }`}
          >
            Enrollment Management
          </h1>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-rose-300 bg-rose-50 text-rose-700 shadow">
              ⚠️ {error}
            </div>
          )}
        </header>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: <Users size={26} />,
              label: "Students",
              value: students.length,
              color: "from-cyan-400 to-cyan-600",
            },
            {
              icon: <BookOpen size={26} />,
              label: "Courses",
              value: courses.length,
              color: "from-violet-400 to-violet-600",
            },
            {
              icon: <ClipboardList size={26} />,
              label: "Assignments",
              value: assignments.length,
              color: "from-emerald-400 to-emerald-600",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 flex items-center gap-4 border transition-all hover:scale-[1.01] ${
                isDark
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border border-slate-100 shadow-sm hover:shadow-md"
              }`}
            >
              <div
                className={`p-3 rounded-xl text-white bg-gradient-to-br ${card.color}`}
              >
                {card.icon}
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  {card.label}
                </p>
                <h2
                  className={`text-xl font-bold ${
                    isDark ? "text-gray-100" : "text-slate-700"
                  }`}
                >
                  {card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* FORMULAIRE */}
        <div
          className={`flex flex-wrap items-start gap-6 mb-10 p-6 rounded-2xl border relative transition-all ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white/80 border border-slate-200 shadow-sm backdrop-blur-md"
          }`}
        >
          {/* --- RECHERCHE ETUDIANT --- */}
          <div className="flex flex-col flex-1 min-w-[260px] relative">
            <label
              className={`font-semibold mb-2 flex items-center gap-2 ${
                isDark ? "text-gray-200" : "text-slate-700"
              }`}
            >
              <User size={18} /> Search Student
            </label>

            <input
              type="text"
              placeholder="Type a name..."
              value={selectedStudent}
              onChange={(e) => {
                setSelectedStudent(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              className={`px-4 py-2 rounded-xl border outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-cyan-500"
                  : "bg-white border-slate-200 focus:ring-cyan-300"
              }`}
            />

            {showDropdown && selectedStudent.length > 0 && (
              <ul
                className={`absolute top-[68px] left-0 w-full max-h-64 overflow-y-auto rounded-2xl border shadow-lg backdrop-blur-sm transition-all duration-200 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        setSelectedStudent(s.name);
                        setShowDropdown(false);
                      }}
                      className={`px-4 py-3 cursor-pointer text-[15px] font-medium flex items-center justify-between transition-all ${
                        isDark
                          ? "hover:bg-gray-700 hover:text-cyan-300"
                          : "hover:bg-cyan-50 hover:text-cyan-700"
                      }`}
                    >
                      <span>{s.name}</span>
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-slate-400"
                        }`}
                      >
                        click to select
                      </span>
                    </li>
                  ))
                ) : (
                  <li
                    className={`px-4 py-3 italic text-sm ${
                      isDark ? "text-gray-400" : "text-slate-400"
                    }`}
                  >
                    No matches found
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* --- SÉLECTION DU COURS --- */}
          <div className="flex flex-col flex-1 min-w-[220px]">
            <label
              className={`font-semibold mb-2 flex items-center gap-2 ${
                isDark ? "text-gray-200" : "text-slate-700"
              }`}
            >
              <BookOpen size={18} /> Select Course
            </label>
            <select
              className={`px-4 py-2 rounded-xl border outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-violet-500"
                  : "bg-white border-slate-200 focus:ring-violet-300"
              }`}
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Choose...</option>
              {courses.map((c, i) => (
                <option key={i}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* --- BOUTON ASSIGN --- */}
          <div className="flex-1 flex justify-end items-end mt-6">
            <button
              onClick={handleAssign}
              className="group relative px-8 py-3 font-semibold rounded-xl transition-all active:scale-[0.97]"
              style={{
                background: "linear-gradient(90deg, #00C6FB 0%, #005BEA 100%)",
                color: "white",
                boxShadow: "0 4px 14px rgba(0, 182, 255, 0.35)",
                border: "none",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 transition-transform group-hover:rotate-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Assign
              </span>
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 blur-lg transition-all duration-300"
                style={{ zIndex: 0 }}
              ></div>
            </button>
          </div>
        </div>

        {/* TABLEAU DES ASSIGNATIONS */}
        <div
          className={`overflow-hidden rounded-2xl border transition-all ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-slate-200 shadow-md"
          }`}
        >
          <table className="w-full border-collapse">
            <thead
              className={`${
                isDark ? "bg-gray-700 text-gray-200" : "bg-[#EEF2F7] text-slate-600"
              }`}
            >
              <tr className="font-semibold">
                <th className="px-6 py-4 text-left">Student</th>
                <th className="px-6 py-4 text-left">Course</th>
                <th className="px-6 py-4 text-left">Instructor</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 italic text-gray-400">
                    No students currently assigned.
                  </td>
                </tr>
              ) : (
                assignments.map((a, i) => (
                  <tr
                    key={i}
                    className={`border-t transition-all duration-150 ${
                      isDark
                        ? "hover:bg-gray-700 border-gray-700"
                        : "hover:bg-[#F8FCFF] border-slate-200"
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold">{a.student}</td>
                    <td className="px-6 py-4">{a.course}</td>
                    <td className="px-6 py-4">{a.instructor}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleRemove(a.student, a.course)}
                        className="px-3 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 font-semibold"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#EF4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                      >
                        <X size={16} /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
