import { useTheme } from "./context/ThemeContext";
import type { ReactNode } from "react"; 

export default function AppWrapper({ children }: { children: ReactNode }) {
  const { darkMode } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-[#F9FBFD] to-[#EEF3F8] text-gray-900"
      }`}
    >
      {children}
    </div>
  );
}
