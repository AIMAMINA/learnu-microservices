import { useTheme } from "../context/ThemeContext";
import { API_URL, GRAPHQL_URL, authFetch } from "../utils/api";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Clock,
  User,
  Tag,
  PlusCircle,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

/** ============================
 *  Types alignés au backend
 *  ============================ */
interface Course {
  id: number;
  name: string;
  instructor: string;
  category: string;
  schedule: string;
}

/** ============================
 *  🔗 Base URL Render
 *  ============================ */
const GATEWAY_BASE = API_URL;


export default function CoursesPage() {
  const { darkMode: isDark } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    instructor: "",
    category: "Informatique",
    schedule: "",
  });

  /** ============================
   *  FETCH COURSES (GraphQL)
   *  ============================ */
  const fetchCourses = async () => {
    try {
      const response = await authFetch(GRAPHQL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            {
              courses {
                id
                name
                instructor
                category
                schedule
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error(result.errors);
        setError("❌ Failed to load courses from GraphQL Gateway.");
      } else {
        setCourses(result.data.courses);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError(" Cannot connect to Gateway.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /** ============================
   *  OPEN MODAL
   *  ============================ */
  const openModal = (course?: Course) => {
    if (course) {
      setEditCourse(course);
      setFormData({
        name: course.name,
        instructor: course.instructor,
        category: course.category,
        schedule: course.schedule,
      });
    } else {
      setEditCourse(null);
      setFormData({
        name: "",
        instructor: "",
        category: "Informatique",
        schedule: "",
      });
    }
    setShowModal(true);
  };

  /** ============================
   *  SAVE COURSE (Add / Edit)
   *  ============================ */
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.instructor.trim()) return;

    setShowModal(false);
    setError("");

    const url = editCourse
      ? `${GATEWAY_BASE}/courses/${editCourse.id}/`
      : `${GATEWAY_BASE}/courses/`;
    const method = editCourse ? "PUT" : "POST";

    try {
      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // ✅ Cas nominal (pas de CORS)
      if (res.ok || res.status === 201 || res.status === 204) {
        await fetchCourses();
        return;
      }

      // ✅ Cas opaque / CORS bloqué
      if (res.type === "opaque" || res.status === 0) {
        console.warn("CORS opaque response, assuming success...");
        setTimeout(fetchCourses, 800);
        return;
      }

      throw new Error(`Unexpected status: ${res.status}`);
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch")) {
        console.warn("CORS blocked, assuming success...");
        setTimeout(fetchCourses, 800);
        return;
      }

      console.error("SAVE_ERROR:", err);
      setError(" Error while saving course.");
    }
  };

  /** ============================
   *  DELETE COURSE
   *  ============================ */
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await authFetch(`${GATEWAY_BASE}/courses/${id}/`, {
        method: "DELETE",
      });

      if (res.ok || res.status === 204) {
        setCourses((prev) => prev.filter((c) => c.id !== id));
        return;
      } else if (res.status === 0 || res.type === "opaque") {
        console.warn("CORS opaque delete, assuming success...");
        setTimeout(fetchCourses, 800);
      } else {
        throw new Error(`Delete failed: ${res.status}`);
      }
    } catch (err: any) {
      if (err.message?.includes("Failed to fetch")) {
        console.warn("Delete CORS-blocked, assuming success.");
        setTimeout(fetchCourses, 800);
        return;
      }
      console.error("DELETE ERROR:", err);
      setError("Error while deleting course.");
    }
  };

  /** ============================
   *  FILTER LOGIC
   *  ============================ */
  const categories = ["All", ...new Set(courses.map((c) => c.category))];
  const filteredCourses = courses.filter((c) => {
    const matchCategory =
      selectedCategory === "All" || c.category === selectedCategory;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  /** ============================
   *  RENDER
   *  ============================ */
  return (
    <div
      className={`px-10 py-12 min-h-screen transition-all ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-[#F8FAFC] text-gray-900"
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1
              className={`text-4xl font-bold ${
                isDark ? "text-cyan-300" : "text-[#1E293B]"
              }`}
            >
              Courses
            </h1>
            <p className={`${isDark ? "text-gray-400" : "text-[#64748B]"}`}>
              Manage your courses and instructors effortlessly.
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="px-5 py-2.5 flex items-center gap-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
              color: "white",
            }}
          >
            <PlusCircle size={18} />
            Add Course
          </button>
        </div>

        {/* STATUS */}
        {loading ? (
          <p className="text-center text-lg text-cyan-400 mt-10 animate-pulse">
            Loading courses...
          </p>
        ) : error ? (
          <p className="text-center text-red-400 text-lg mt-10">{error}</p>
        ) : (
          <>
            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter size={20} className="text-cyan-400" />
                <span className="font-semibold">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-lg border bg-white text-black"
                >
                  {categories.map((cat) => (
                    <option key={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div
                className={`flex items-center gap-3 px-5 py-3 w-full md:w-[400px] rounded-xl border ${
                  isDark ? "bg-gray-800 text-gray-200" : "bg-white text-black"
                }`}
              >
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${
                    isDark ? "bg-gray-800 border-gray-700" : "bg-white"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-3 text-cyan-500">
                    {course.name}
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-blue-400" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-cyan-400" />
                      <span>{course.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-sky-400" />
                      <span>{course.schedule}</span>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => openModal(course)}
                      className="flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
                        transition-all duration-300 border border-blue-400/40
                        hover:scale-[1.03] hover:shadow-md
                        hover:border-blue-400
                        text-blue-500 hover:text-white
                        hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2
                        transition-all duration-300 border border-red-400/40
                        hover:scale-[1.03] hover:shadow-md
                        hover:border-red-500
                        text-red-500 hover:text-white
                        hover:bg-gradient-to-r hover:from-rose-500 hover:to-red-500"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div
              className={`rounded-2xl p-8 w-[450px] shadow-2xl relative ${
                isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-semibold mb-6 text-center">
                {editCourse ? "Edit Course" : "Add Course"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Course Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Instructor"
                  value={formData.instructor}
                  onChange={(e) =>
                    setFormData({ ...formData, instructor: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-lg outline-none"
                />
                <input
                  type="text"
                  placeholder="Schedule"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData({ ...formData, schedule: e.target.value })
                  }
                  className="w-full border px-4 py-2 rounded-lg outline-none"
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg text-white font-semibold shadow-md hover:shadow-cyan-200 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE, #0EA5E9)",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
