import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import api from "../utils/axiosInstance";
import { logActivity } from "../utils/activityLogger"; // ✅ ajout cohérent avec RegisterPage

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** ===============================
   *  🔐 Handle Login
   *  =============================== */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // --- Authentification via Auth-Service Render
      const response = await api.post(
        "https://auth-service-ojes.onrender.com/auth/auth/login/",
        {
          username: email,
          password: password,
        }
      );

      const data = response.data;
      if (!data?.access || !data?.refresh) {
        setError("⚠️ Login failed: missing tokens.");
        setLoading(false);
        return;
      }

      // --- Sauvegarde des tokens & état utilisateur
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("username", email);
      localStorage.setItem("isAuthenticated", "true");

      // ✅ Log Activity vers ActivityService
      await logActivity(
        email,
        "LOGIN",
        "Auth Service",
        `${email} successfully logged in`
      );

      // ✅ Redirection vers dashboard
      onLogin();
      navigate("/dashboard");

      // --- Vérification du profil (optionnel)
      api
        .get("https://auth-service-ojes.onrender.com/auth/auth/profile/", {
          headers: { Authorization: `Bearer ${data.access}` },
        })
        .then(() => console.log("✅ Profile verified"))
        .catch(() => console.warn("⚠️ Profile check failed (CORS or invalid token)"));
    } catch (err: any) {
      console.error("Login error:", err);
      setError("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /** ===============================
   *  🎨 UI
   *  =============================== */
  return (
    <div
      className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-10"
      style={{
        background: "linear-gradient(135deg, #1E293B 0%, #3E4753 100%)",
      }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT - Login Form */}
        <div className="bg-[#E7EEF4] rounded-2xl shadow-xl border border-[#CAD8E4] p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1E293B]">
              LearnU2
            </h1>
            <div
              className="w-20 h-1 mx-auto mt-3 rounded-full"
              style={{
                background: "linear-gradient(90deg,#22D3EE,transparent)",
              }}
            />
          </div>

          <h2 className="text-2xl font-semibold text-center text-[#1E293B]">
            Welcome back
          </h2>
          <p className="text-center text-[#3E4753] opacity-80 mb-8">
            Sign in to access your dashboard and continue your learning journey.
          </p>

          {error && (
            <div className="mb-3 text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[#1E293B] font-medium mb-2">
                Email / Username
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F8FA] rounded-xl border border-[#CAD8E4]">
                <Mail size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@learnu2.edu"
                  className="flex-1 bg-transparent outline-none text-[#1E293B]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#1E293B] font-medium mb-2">
                Password
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F8FA] rounded-xl border border-[#CAD8E4]">
                <Lock size={20} className="text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent outline-none text-[#1E293B]"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 transition-transform ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
              style={{
                background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
                color: "#FFFFFF",
                fontWeight: 600,
                boxShadow: "0 8px 24px rgba(34, 211, 238, 0.35)",
              }}
            >
              <LogIn size={20} />
              {loading ? "Connecting..." : "Login"}
            </button>

            <p className="text-center text-[#3E4753] mt-4">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-[#22D3EE] font-medium hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT - Hero Section */}
        <div className="hidden lg:flex flex-col justify-center text-white px-10">
          <h1 className="text-4xl font-bold mb-4 leading-snug">
            Welcome to <span className="text-[#22D3EE]">LearnU2</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed">
            Empower your learning journey with a modern, intelligent platform.
            Track progress, access resources, and grow your academic success
            with ease.
          </p>

          <div className="mt-10 border-l-4 border-[#22D3EE] pl-6 text-gray-300 italic text-sm">
            “Learning never exhausts the mind. It strengthens it.”
          </div>
        </div>
      </div>
    </div>
  );
}
