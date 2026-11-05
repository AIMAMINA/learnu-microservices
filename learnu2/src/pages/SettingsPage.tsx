import { authFetch } from "../utils/api";
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Lock, Moon, Sun } from 'lucide-react';

export function SettingsPage() {
  // The theme is shared with the navbar and saved on the account (see ThemeContext)
  const { darkMode, toggleDarkMode } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 🔹 Changement du mot de passe
  const handlePasswordChange = async () => {
    if (!currentPassword || !password) return setMessage('Enter your current password and a new password.');
    setSaving(true);
    try {
      const response = await authFetch('/auth/change-password/', {
        method: 'POST',
        body: JSON.stringify({ current_password: currentPassword, password }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMessage('🔒 Password updated successfully!');
        setCurrentPassword('');
        setPassword('');
      } else {
        setMessage(`❌ ${data.error ?? 'Failed to update password.'}`);
      }
    } catch {
      setMessage('⚠️ Server error.');
    }
    setSaving(false);
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-6 py-10 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100'
          : 'bg-gradient-to-br from-[#1E293B] to-[#3E4753] text-gray-900'
      }`}
    >
      <div
        className={`rounded-2xl shadow-xl border p-10 w-full max-w-3xl transition-all duration-500 ${
          darkMode
            ? 'bg-[#1F2937] border-gray-700'
            : 'bg-[#E7EEF4] border-[#CAD8E4]'
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3 ${
            darkMode ? 'text-cyan-400' : 'text-[#1E293B]'
          }`}
        >
          Account Settings
          <span className="animate-spin-slow">⚙️</span>
        </h1>

        <div className="space-y-6">
          {/* DARK MODE */}
          <div
            className={`flex justify-between items-center rounded-xl p-4 border shadow-sm transition-all ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-100'
                : 'bg-white border-[#CAD8E4]'
            }`}
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="text-cyan-400" /> : <Sun className="text-yellow-400" />}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm opacity-70">Toggle application theme</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              aria-pressed={darkMode}
              className={`w-12 h-6 rounded-full transition-all ${
                darkMode ? 'bg-cyan-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`h-5 w-5 bg-white rounded-full transform transition-all ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* CHANGE PASSWORD */}
          <div
            className={`rounded-xl p-4 border shadow-sm transition-all ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-gray-100'
                : 'bg-white border-[#CAD8E4]'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <Lock className="text-cyan-500" />
              <p className="font-medium">Change Password</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                autoComplete="current-password"
                className={`flex-1 rounded-lg p-2 outline-none border transition-all ${
                  darkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'border-[#CAD8E4] bg-white text-[#1E293B]'
                }`}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                className={`flex-1 rounded-lg p-2 outline-none border transition-all ${
                  darkMode
                    ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400'
                    : 'border-[#CAD8E4] bg-white text-[#1E293B]'
                }`}
              />
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  darkMode
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                }`}
              >
                Update
              </button>
            </div>
          </div>

          <p className="text-center text-sm opacity-70">Your theme is saved to your account automatically.</p>

          {/* STATUS MESSAGE */}
          {message && (
            <p
              className={`text-center text-sm mt-4 font-medium ${
                darkMode ? 'text-cyan-300' : 'text-[#1E293B]'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
