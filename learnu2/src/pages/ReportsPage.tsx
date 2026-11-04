import { useState } from "react";
import { University, MapPin, Search, Pencil, Trash2, PlusCircle } from "lucide-react";

export function UniversitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // ⭐ UNIVERSITÉS FAKE POUR L'AFFICHAGE
  const universities = [
    { id: 1, name: "University Constantine 2", city: "Constantine" },
    { id: 2, name: "University Algiers 1", city: "Algiers" },
    { id: 3, name: "University Setif 1", city: "Setif" },
    { id: 4, name: "University Annaba", city: "Annaba" },
    { id: 5, name: "University Skikda", city: "Skikda" },
  ];

  // SEARCH FILTER
  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-8 py-12">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1
              className="mb-2"
              style={{ color: "#1E293B", fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              Universities Management
            </h1>
            <p style={{ color: "#3E4753", opacity: 0.7 }}>
              Manage, update, and explore all universities in the system
            </p>
          </div>

          {/* ADD BUTTON */}
          <button
            className="px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #1E9BB8 100%)",
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          >
            <PlusCircle size={20} />
            Add University
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Total Universities */}
          <div
            className="p-6 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "18px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(34, 211, 238, 0.15)",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                }}
              >
                <University size={24} style={{ color: "#22D3EE" }} />
              </div>
              <div>
                <h3 style={{ color: "#3E4753", opacity: 0.8 }}>Total Universities</h3>
                <div style={{ color: "#1E293B", fontWeight: 700, fontSize: "26px" }}>
                  {universities.length}
                </div>
              </div>
            </div>
          </div>

          {/* Total Cities */}
          <div
            className="p-6 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "18px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(34, 211, 238, 0.15)",
                  border: "1px solid rgba(34, 211, 238, 0.3)",
                }}
              >
                <MapPin size={24} style={{ color: "#22D3EE" }} />
              </div>
              <div>
                <h3 style={{ color: "#3E4753", opacity: 0.8 }}>Unique Cities</h3>
                <div style={{ color: "#1E293B", fontWeight: 700, fontSize: "26px" }}>
                  {new Set(universities.map((u) => u.city)).size}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div
          className="flex items-center gap-3 px-5 py-3 mb-8"
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            border: "1px solid rgba(202, 216, 228, 0.5)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <Search size={20} style={{ color: "#3E4753", opacity: 0.6 }} />
          <input
            type="text"
            placeholder="Search universities by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "#3E4753" }}
          />
        </div>

        {/* TABLE */}
        <div
          className="overflow-hidden backdrop-blur-md"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "18px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "2px solid #E7EEF4" }}>
                <th className="px-6 py-4 text-left" style={{ fontWeight: 600 }}>
                  Name
                </th>
                <th className="px-6 py-4 text-left" style={{ fontWeight: 600 }}>
                  City
                </th>
                <th className="px-6 py-4 text-left" style={{ fontWeight: 600 }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((uni) => (
                <tr key={uni.id} style={{ borderBottom: "1px solid #E7EEF4" }}>
                  <td className="px-6 py-4">{uni.name}</td>
                  <td className="px-6 py-4">{uni.city}</td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 flex gap-3">
                    {/* EDIT */}
                    <button
                      className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                      style={{
                        backgroundColor: "rgba(34, 211, 238, 0.1)",
                        color: "#22D3EE",
                        border: "1px solid rgba(34, 211, 238, 0.3)",
                        fontWeight: 600,
                      }}
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    {/* DELETE */}
                    <button
                      className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#EF4444",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        fontWeight: 600,
                      }}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
