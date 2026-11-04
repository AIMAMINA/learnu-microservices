import axios from "axios";

/** ============================
 *  Gateway Render principal
 *  ============================ */
const api = axios.create({
  baseURL: "https://gateway-negf.onrender.com",
  headers: { "Content-Type": "application/json" },
});

/** ============================
 *  Helpers de log automatique
 *  ============================ */
function getUsername(): string {
  return localStorage.getItem("username") || "Anonymous";
}

function detectEntity(url: string | undefined): string {
  const u = (url || "").toLowerCase();
  if (u.includes("course")) return "Course";
  if (u.includes("student")) return "Student";
  if (u.includes("university")) return "University";
  if (u.includes("register")) return "Register";
  if (u.includes("login")) return "Login";
  return "Other";
}

function verbToAction(method?: string): "CREATE" | "UPDATE" | "DELETE" | "READ" {
  const m = (method || "get").toLowerCase();
  if (m === "post") return "CREATE";
  if (m === "put" || m === "patch") return "UPDATE";
  if (m === "delete") return "DELETE";
  return "READ";
}

/** ============================
 *  Intercepteur audit
 *  ============================ */
api.interceptors.response.use(
  async (response) => {
    try {
      const { config } = response;
      const action = verbToAction(config.method);
      const entity = detectEntity(config.url);
      const username = getUsername();

      // ✅ change ici par ton vrai service Render audit
      await axios.post(
        "https://activity-service-2s2u.onrender.com/activity/add",
        {
          username,
          microservice: "Gateway",
          action,
          entity,
          entityId: 0,
          details: `Request to ${config.url} succeeded.`,
        }
      );
    } catch (err) {
      console.warn("⚠️ Audit log failed:", err);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default api;
