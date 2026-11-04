import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion, cubicBezier } from "framer-motion";
import { useEffect, useState, type JSX } from "react";

// Pages principales
import EnrollmentsPage from "./pages/EnrollmentsPage";
import { LoginPage } from "./pages/LoginPage";
import { LogoutPage } from "./pages/LogoutPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import CoursesPage from "./pages/CoursesPage";
import ChatbotPage from "./pages/ChatbotPage";
import UniversitiesPage from "./pages/UniversitiesPage";

// 👤 Pages utilisateur
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";

// Composants globaux
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// ✅ Animation fluide
const easeOut = cubicBezier(0.22, 1, 0.36, 1);
const easeIn = cubicBezier(0.55, 0.085, 0.68, 0.53);

const pageTransition = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.3, ease: easeIn },
  },
};

// ✅ Protection d’accès (redirige si non connecté)
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuth =
    localStorage.getItem("access_token") && localStorage.getItem("isAuthenticated") === "true";
  return isAuth ? children : <Navigate to="/login" replace />;
}

// ✅ Routes animées
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* --- Pages publiques --- */}
        <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* --- Redirection vers dashboard --- */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* --- Pages protégées --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <HomePage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <StudentsPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <CoursesPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/universities"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <UniversitiesPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/enrollments"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <EnrollmentsPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <ChatbotPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <ProfilePage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <motion.div {...pageTransition} className="min-h-[80vh]">
                <SettingsPage />
              </motion.div>
            </ProtectedRoute>
          }
        />

        {/* --- 404 --- */}
        <Route
          path="*"
          element={
            <motion.div {...pageTransition} className="min-h-[80vh] flex items-center justify-center">
              <h1 className="text-3xl font-bold text-gray-600">404 – Page Not Found</h1>
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

// ✅ Application principale
function AppInner() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // 🌙 Mode sombre au chargement
  useEffect(() => {
    const saved = localStorage.getItem("dark_mode") === "true";
    setDarkMode(saved);
    document.body.classList.toggle("dark", saved);
  }, []);

  // 🌐 Pages sans navbar/footer
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/logout";

  const backgroundStyle = {
    backgroundColor: isAuthPage
      ? darkMode
        ? "#0f172a"
        : "#1E293B"
      : darkMode
      ? "#0f172a"
      : "#E7EEF4",
    color: darkMode ? "#f8fafc" : "#1E293B",
    transition: "background-color 0.4s ease, color 0.4s ease",
  };

  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}>
      {!isAuthPage && <Navbar />}
      <main className="flex-1 overflow-hidden">
        <AnimatedRoutes />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

// ✅ Router global
export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}
