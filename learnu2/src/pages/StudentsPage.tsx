import { API_URL, GRAPHQL_URL, authFetch } from "../utils/api";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../utils/axiosInstance"; // ✅ import du logger auto

// ============================
// Types alignés au backend
// ============================
interface University {
  id: number;
  name: string;
  city?: string;
}

interface Student {
  id: number;
  name: string;
  address: string;
  university: University | null;
}

// ============================
// Helpers
// ============================
const GATEWAY_BASE = API_URL;

// GraphQL minimal pour Students
const STUDENTS_QUERY = `
  query {
    students {
      id
      name
      address
      university { id name city }
    }
  }
`;

// petit helper fetch GraphQL
async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const res = await authFetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors?.[0]?.message ?? "GraphQL error");
  }
  return json.data as T;
}

export default function StudentsPage() {
  // 🌙 Mode sombre
  const isDark = document.body.classList.contains("dark");

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data
  const [students, setStudents] = useState<Student[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<number | "all">("all");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    address: string;
    universityId: number | "";
  }>({
    name: "",
    address: "",
    universityId: "",
  });

  // ============================
  // Loaders
  // ============================
  const loadUniversities = async () => {
    const res = await api.get(`${GATEWAY_BASE}/universities/all`);
    setUniversities(res.data);
  };

  const loadStudents = async () => {
    const data = await fetchGraphQL<{ students: Student[] }>(STUDENTS_QUERY);
    setStudents(data.students ?? []);
  };

  const initialLoad = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([loadUniversities(), loadStudents()]);
    } catch (e: any) {
      setError(e.message ?? "Load error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  // ============================
  // Gestion utilisateur courant
  // ============================

  // ============================
  // CRUD
  // ============================
  const handleSave = async () => {
    if (!formData.name.trim() || !formData.address.trim() || !formData.universityId)
      return;
    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name,
        address: formData.address,
        university: { id: formData.universityId },
      };

      if (editStudent) {
        await api.put(`${GATEWAY_BASE}/students/update/${editStudent.id}`, payload);
      } else {
        await api.post(`${GATEWAY_BASE}/students/add`, payload);
      }

      await loadStudents();
      closeModal();
    } catch (e: any) {
      setError(e.message ?? "Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Are you sure you want to delete this student?");
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);

      await api.delete(`${GATEWAY_BASE}/students/delete/${id}`);

      await loadStudents();
    } catch (e: any) {
      setError(e.message ?? "Delete error");
    } finally {
      setSaving(false);
    }
  };

  // ============================
  // Filters
  // ============================
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return students.filter((s) => {
      const inSearch =
        s.id.toString().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.address.toLowerCase().includes(term) ||
        (s.university?.name ?? "").toLowerCase().includes(term);

      const inUni =
        selectedUniversity === "all" ||
        (s.university && s.university.id === selectedUniversity);

      return inSearch && inUni;
    });
  }, [students, searchTerm, selectedUniversity]);

  // ============================
  // Modal Handlers
  // ============================
  const openModal = (student?: Student) => {
    if (student) {
      setEditStudent(student);
      setFormData({
        name: student.name,
        address: student.address,
        universityId: student.university?.id ?? "",
      });
    } else {
      setEditStudent(null);
      setFormData({
        name: "",
        address: "",
        universityId: universities[0]?.id ?? "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditStudent(null);
    setFormData({ name: "", address: "", universityId: "" });
  };

  // ============================
  // Render
  // ============================
  if (loading) {
    return (
      <div
        className={`px-8 py-10 min-h-screen ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-[#F8FAFC] text-gray-900"
        }`}
      >
        <div className="max-w-[1500px] mx-auto">
          <p className="opacity-70">Loading students…</p>
        </div>
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
        <header className="mb-8">
          <h1
            className={`text-4xl font-bold mb-2 ${
              isDark ? "text-cyan-300" : "text-[#1E293B]"
            }`}
          >
            Students
          </h1>
          <p
            className={`${
              isDark ? "text-gray-400" : "text-[#64748B]"
            } text-lg`}
          >
            Manage student records and their associated universities. (GraphQL fetch + Gateway CRUD)
          </p>
          {error && (
            <div className="mt-3 rounded-lg px-4 py-2 border border-rose-300 bg-rose-50 text-rose-700">
              {error}
            </div>
          )}
        </header>

        {/* Actions */}
        <div
          className={`flex flex-wrap items-center gap-4 mb-6 p-4 rounded-2xl shadow-sm border transition-all ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-[#CAD8E4]"
          }`}
        >
          <button
            onClick={() => openModal()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 shadow-md disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
              color: "white",
            }}
          >
            <Plus size={18} />
            Add Student
          </button>

          <div
            className={`flex items-center gap-3 px-5 py-2.5 flex-1 min-w-[250px] rounded-xl border transition-all ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-200"
                : "bg-[#F5F8FA] border border-[#CAD8E4] text-[#1E293B]"
            }`}
          >
            <Search
              size={18}
              className={isDark ? "text-gray-400" : "text-[#3E4753]"}
            />
            <input
              type="text"
              placeholder="Search by ID, name, address or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`bg-transparent outline-none w-full ${
                isDark ? "text-gray-100" : "text-[#1E293B]"
              }`}
            />
          </div>
        </div>

        {/* Table */}
        <div
          className={`overflow-hidden rounded-2xl border transition-all ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border border-[#CAD8E4]"
          }`}
        >
          <table className="w-full">
            <thead
              className={`${
                isDark
                  ? "bg-gray-700 text-gray-200"
                  : "bg-[#E7EEF4] text-[#1E293B]"
              }`}
            >
              <tr>
                <th className="px-6 py-4 text-left">ID</th>
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Address</th>
                <th className="px-6 py-4 text-left">University</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`transition-all duration-150 ${
                      isDark
                        ? "hover:bg-gray-700 border-t border-gray-700"
                        : "hover:bg-[#E7F9FC] border-t border-gray-200"
                    }`}
                    style={{
                      backgroundColor: isDark
                        ? index % 2 === 0
                          ? "#1F2937"
                          : "#111827"
                        : index % 2 === 0
                        ? "#FFFFFF"
                        : "#F8FAFC",
                    }}
                  >
                    <td className="px-6 py-4">{student.id}</td>
                    <td className="px-6 py-4 font-semibold">{student.name}</td>
                    <td className="px-6 py-4">{student.address}</td>
                    <td className="px-6 py-4">
                      {student.university?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => openModal(student)}
                        className="px-3 py-2 rounded-lg hover:scale-105 transition-all"
                        style={{
                          backgroundColor: "rgba(34,211,238,0.1)",
                          color: "#22D3EE",
                          border: "1px solid rgba(34,211,238,0.3)",
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        disabled={saving}
                        className="px-3 py-2 rounded-lg hover:scale-105 transition-all disabled:opacity-60"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.1)",
                          color: "#EF4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div
              className={`rounded-2xl p-8 w-[460px] shadow-xl relative transition-all ${
                isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-semibold mb-6">
                {editStudent ? "Edit Student" : "Add Student"}
              </h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  className={`w-full rounded-lg px-4 py-2 outline-none ${
                    isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, address: e.target.value }))
                  }
                  className={`w-full rounded-lg px-4 py-2 outline-none ${
                    isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
                />
                <select
                  value={formData.universityId || ""}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      universityId: Number(e.target.value),
                    }))
                  }
                  className={`w-full rounded-lg px-4 py-2 outline-none ${
                    isDark
                      ? "bg-gray-700 border border-gray-600 text-gray-100"
                      : "bg-white border border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="" disabled>
                    Select university…
                  </option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg border ${
                    isDark
                      ? "text-gray-300 border-gray-600 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
                  }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
