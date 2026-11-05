import { authFetch } from "../utils/api";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Logo from "../assets/logo.png";
import { useState, useEffect } from "react";

interface UserData {
  username: string;
  email: string;
  role?: string;
}

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const { darkMode, toggleDarkMode } = useTheme();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Students", path: "/students" },
    { name: "Universities", path: "/universities" },
    { name: "Courses", path: "/courses" },
    { name: "Enrollment", path: "/enrollments" },
    { name: "Chatbot", path: "/chatbot" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    authFetch("/auth/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data ?? null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className={`px-10 py-3 border-b backdrop-blur-md sticky top-0 z-50 flex items-center transition-all duration-500 ${
        darkMode
          ? "bg-gray-900/90 border-gray-800 text-gray-100"
          : "bg-[#F5F8FA] border border-[#CAD8E4]/40 text-gray-900"
      }`}
      style={{
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.05)",
        height: "150px",
      }}
    >
      <div className="max-w-[1700px] w-full mx-auto flex items-center justify-between">
        {/* 🌈 Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="LearnU2 Logo"
            className="object-contain transition-all duration-300 hover:scale-[1.05]"
            style={{
              height: "160px",
              width: "auto",
              marginTop: "10px",
              filter: darkMode
                ? "drop-shadow(0 3px 8px rgba(34,211,238,0.5))"
                : "drop-shadow(0 3px 8px rgba(34,211,238,0.3))",
            }}
          />
        </Link>

        {/* 🌐 Navigation */}
        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="transition-all relative group text-[17px]"
              style={{
                color:
                  location.pathname === item.path
                    ? "#22D3EE"
                    : darkMode
                    ? "#E2E8F0"
                    : "#1E293B",
                fontWeight: location.pathname === item.path ? 700 : 500,
              }}
            >
              {item.name}
              {location.pathname === item.path && (
                <span
                  className="absolute -bottom-1 left-0 w-full h-[2px] rounded-full"
                  style={{ backgroundColor: "#22D3EE" }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* ⚙️ Espace à droite */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* 🌙 / ☀️ Switch instantané */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full transition-all hover:scale-110"
            title={darkMode ? "Light mode" : "Dark mode"}
          >
            {darkMode ? (
              <Sun size={22} className="text-yellow-400" />
            ) : (
              <Moon size={22} className="text-cyan-500" />
            )}
          </button>

          {/* 🚪 Logout */}
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg font-semibold hover:scale-105 transition-all"
            style={{
              background: "linear-gradient(135deg, #22D3EE 0%, #0EA5E9 100%)",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(34,211,238,0.3)",
            }}
          >
            Logout
          </button>

          {/* 👤 Profil */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`p-2 rounded-full transition ${
                darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
              }`}
            >
              <User size={24} color={darkMode ? "#E2E8F0" : "#3E4753"} />
            </button>

            {isProfileOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border p-3 ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-100 text-black"
                }`}
              >
                <div
                  className={`text-sm mb-2 border-b pb-2 ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <strong>{user ? user.username : "Utilisateur"}</strong>
                  <p className="text-xs opacity-70">{user?.role || "User"}</p>
                </div>
                <Link
                  to="/profile"
                  className="block text-sm py-1 hover:text-[#22D3EE]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  className="block text-sm py-1 hover:text-[#22D3EE]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
