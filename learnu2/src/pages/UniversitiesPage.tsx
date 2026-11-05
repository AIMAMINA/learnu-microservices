import { API_URL, authFetch } from "../utils/api";
import { useEffect, useState } from "react";
import {
  University as UniversityIcon,
  MapPin,
  Search,
  Pencil,
  Trash2,
  Plus,
  X,
  Users,
} from "lucide-react";

interface University {
  id: number;
  name: string;
  city: string;
  studentsCount: number;
}

// ============================
// 🔗 URLs — version Render
// ============================
const GATEWAY_BASE = API_URL;
const UNIVERSITIES_URL = `${GATEWAY_BASE}/universities/all`;

export default function UniversitiesPage() {
  const isDark = document.body.classList.contains("dark");

  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editUniversity, setEditUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState({ name: "", city: "" });

  const username = localStorage.getItem("username") || "Guest";

  // ============================
  // 📥 Load Universities
  // ============================
  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authFetch(UNIVERSITIES_URL);
      if (!res.ok) throw new Error(`Failed to load universities (${res.status})`);

      const data = await res.json();
      const normalized: University[] = data.map((u: any) => ({
        id: u.id,
        name: u.name ?? "Unnamed University",
        city: u.city ?? "—",
        studentsCount: u.studentsCount ?? u.students_count ?? 0,
      }));

      setUniversities(normalized);
    } catch (e: any) {
      setError(e.message ?? "Error loading universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  // ============================
  // ➕ / ✏️ Modal
  // ============================
  const openModal = (university?: University) => {
    if (university) {
      setEditUniversity(university);
      setFormData({ name: university.name, city: university.city });
    } else {
      setEditUniversity(null);
      setFormData({ name: "", city: "" });
    }
    setShowModal(true);
  };

  // ============================
  // 💾 Save University
  // ============================
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.city.trim()) return;

    try {
      const method = editUniversity ? "PUT" : "POST";
      const url = editUniversity
        ? `${GATEWAY_BASE}/universities/update/${editUniversity.id}`
        : `${GATEWAY_BASE}/universities/add`;

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save university");

      await loadUniversities();
      setShowModal(false);

    } catch (e: any) {
      setError(e.message ?? "Save error");
    }
  };

  // ============================
  // ❌ Delete University
  // ============================
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this university?")) return;

    try {
      const res = await authFetch(`${GATEWAY_BASE}/universities/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete university");

      await loadUniversities();

    } catch (e: any) {
      setError(e.message ?? "Delete error");
    }
  };

  // ============================
  // 🔍 Filtering
  // ============================
  const filtered = universities.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toString().includes(searchTerm)
  );

  // ============================
  // 🖥️ Render UI
  // ============================
  if (loading) {
    return (
      <div className="px-8 py-10 min-h-screen flex items-center justify-center text-gray-500 animate-pulse">
        Loading universities...
      </div>
    );
  }

  return (
    <div
      className={`px-8 py-10 min-h-screen transition-all duration-500 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-[#F8FAFC] text-gray-900"
      }`}
    >
      <div className="max-w-[1500px] mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1
            className={`text-5xl font-extrabold mb-3 ${
              isDark ? "text-cyan-300" : "text-[#0F172A]"
            }`}
          >
            Universities
          </h1>
          <p className="text-gray-500">
            Logged in as <span className="font-semibold text-cyan-500">{username}</span>
          </p>

          {error && (
            <div className="mt-4 rounded-lg px-4 py-2 border border-rose-300 bg-rose-50 text-rose-700 shadow">
              {error}
            </div>
          )}
        </header>

        {/* Toolbar */}
        <div
          className={`flex flex-wrap items-center gap-4 mb-8 p-5 rounded-2xl shadow-md backdrop-blur-xl transition-all ${
            isDark
              ? "bg-gray-800/60 border border-gray-700"
              : "bg-white/70 border border-[#CAD8E4]"
          }`}
        >
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
              color: "#FFFFFF",
            }}
          >
            <Plus size={18} />
            Add University
          </button>

          <div
            className={`flex items-center gap-3 px-5 py-2.5 flex-1 min-w-[250px] rounded-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-[#F5F8FA] border border-[#CAD8E4] text-[#1E293B]"
            }`}
          >
            <Search size={18} className={isDark ? "text-gray-400" : "text-[#3E4753]"} />
            <input
              type="text"
              placeholder="Search by name, city or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Table */}
        <div
          className={`overflow-hidden rounded-3xl border shadow-sm transition-all ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border border-[#CAD8E4]"
          }`}
        >
          <table className="w-full text-center">
            <thead
              className={`${
                isDark
                  ? "bg-gray-700 text-gray-200"
                  : "bg-[#E7EEF4]/80 backdrop-blur-md text-[#1E293B]"
              }`}
            >
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">University</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className={`transition-all duration-200 ${
                    isDark
                      ? "hover:bg-gray-700/60 hover:shadow-cyan-700/20"
                      : "hover:bg-[#E7F9FC]/60 hover:shadow-cyan-100"
                  }`}
                >
                  <td className="px-6 py-4 font-medium text-gray-500">{u.id}</td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <UniversityIcon size={22} className="text-[#22D3EE] mb-1" />
                      <span className="font-semibold">{u.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center text-gray-600">
                      <MapPin size={18} className="text-[#22D3EE] mb-1" />
                      <span>{u.city ?? "—"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center text-gray-600">
                      <Users size={18} className="text-[#22D3EE] mb-1" />
                      <span>{u.studentsCount ?? "—"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => openModal(u)}
                        className="px-3 py-2 rounded-lg hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: "rgba(34,211,238,0.1)",
                          color: "#22D3EE",
                          border: "1px solid rgba(34,211,238,0.3)",
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-2 rounded-lg hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#EF4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400 italic">
                    No universities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div
              className={`rounded-2xl p-8 w-[420px] shadow-2xl relative ${
                isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {editUniversity ? "Edit University" : "Add University"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="University Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none"
                />
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:shadow-cyan-200 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
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
