import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus } from "lucide-react";
import { logActivity } from "../utils/activityLogger"; // ✅ ajouté

export function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://auth-service-ojes.onrender.com/auth/auth/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            password,
            password2: confirmPassword, // Django REST Auth
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // ✅ Log Activity vers ActivityService
        await logActivity(
          username,
          "REGISTER",
          "Auth Service",
          `${username} successfully created an account`
        );

        setSuccess("✅ Account created successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1800);
      } else {
        // 🔍 Gestion des erreurs du backend
        if (data.username) setError(`⚠️ ${data.username[0]}`);
        else if (data.email) setError(`⚠️ ${data.email[0]}`);
        else if (data.password) setError(`⚠️ ${data.password[0]}`);
        else setError(data.error || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("❌ Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-120px)] flex items-center justify-center px-6 py-10"
      style={{
        background: "linear-gradient(135deg, #1E293B 0%, #3E4753 100%)",
      }}
    >
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* LEFT - Registration Form */}
        <div className="bg-[#E7EEF4] rounded-2xl shadow-xl border border-[#CAD8E4] p-10">
          {/* Logo */}
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

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center text-[#1E293B]">
            Create your account
          </h2>
          <p className="text-center text-[#3E4753] opacity-80 mb-8">
            Join LearnU2 and start your academic journey with smart tools.
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-3 text-red-600 font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-3 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg border border-green-200 text-center animate-pulse">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[#1E293B] font-medium mb-2">
                Username
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F8FA] rounded-xl border border-[#CAD8E4]">
                <UserPlus size={20} className="text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="flex-1 bg-transparent outline-none text-[#1E293B]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#1E293B] font-medium mb-2">
                Email
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F8FA] rounded-xl border border-[#CAD8E4]">
                <Mail size={20} className="text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@learnu2.edu"
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
                  placeholder="Create a password"
                  className="flex-1 bg-transparent outline-none text-[#1E293B]"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[#1E293B] font-medium mb-2">
                Confirm Password
              </label>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#F5F8FA] rounded-xl border border-[#CAD8E4]">
                <Lock size={20} className="text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
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
                background: "linear-gradient(135deg, #22D3EE 0%, #1E9BB8 100%)",
                color: "#FFFFFF",
                fontWeight: 600,
                boxShadow: "0 8px 24px rgba(34, 211, 238, 0.35)",
              }}
            >
              <UserPlus size={20} />
              {loading ? "Creating account..." : "Register"}
            </button>

            <p className="text-center text-[#3E4753] mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#22D3EE] font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT - Text Hero Section */}
        <div className="hidden lg:flex flex-col justify-center text-white px-10">
          <h1 className="text-4xl font-bold mb-4 leading-snug">
            Join the <span className="text-[#22D3EE]">LearnU2</span> community
          </h1>
          <p className="text-lg text-gray-300 max-w-md leading-relaxed">
            Build your profile, enroll in courses, and start learning smarter —
            one step at a time. Your academic journey begins here.
          </p>

          <div className="mt-10 border-l-4 border-[#22D3EE] pl-6 text-gray-300 italic text-sm">
            “Education is the most powerful weapon which you can use to change
            the world.”
          </div>
        </div>
      </div>
    </div>
  );
}
