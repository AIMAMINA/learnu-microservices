import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authFetch, getToken } from "../utils/api";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

function applyTheme(isDark: boolean) {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("dark_mode", String(isDark));
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("dark_mode") === "true");

  // Local value first (instant), then the preference saved on the account
  useEffect(() => {
    applyTheme(darkMode);
    if (!getToken()) return;
    authFetch("/auth/settings/")
      .then((res) => (res.ok ? res.json() : null))
      .then((prefs) => {
        if (prefs && typeof prefs.dark_mode === "boolean") {
          setDarkMode(prefs.dark_mode);
          applyTheme(prefs.dark_mode);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
    if (getToken()) {
      authFetch("/auth/settings/", { method: "PUT", body: JSON.stringify({ dark_mode: newMode }) }).catch(() => {});
    }
  };

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
