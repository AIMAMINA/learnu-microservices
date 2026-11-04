import { useEffect, useState } from 'react';
import { Lock, Moon, Sun, Loader2, CheckCircle } from 'lucide-react';

export function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 🔹 Charger depuis l’API (si tu veux garder la préférence)
  useEffect(() => {
    const savedMode = localStorage.getItem('dark_mode');
    if (savedMode === 'true') setDarkMode(true);
  }, []);

  // 🔹 Appliquer le thème globalement
  useEffect(() => {
    const body = document.body;
    if (darkMode) {
      body.classList.add('dark');
      localStorage.setItem('dark_mode', 'true');
    } else {
      body.classList.remove('dark');
      localStorage.setItem('dark_mode', 'false');
    }
  }, [darkMode]);

  // 🔹 Changement du mot de passe
  const handlePasswordChange = async () => {
    if (!password) return setMessage('Please enter a new password.');
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('POST https://auth-service-ojes.onrender.com/auth/auth/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setMessage('🔒 Password updated successfully!');
        setPassword('');
      } else {
        setMessage('❌ Failed to update password.');
      }
    } catch {
      setMessage('⚠️ Server error.');
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading settings...
      </div>
    );

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
              onClick={() => setDarkMode(!darkMode)}
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
            <div className="flex gap-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
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

          {/* SAVE BUTTON */}
          <button
            onClick={() => setMessage('✅ Settings saved!')}
            disabled={saving}
            className={`w-full mt-6 py-3.5 rounded-xl font-semibold flex justify-center items-center gap-2 transition-transform hover:scale-[1.02] ${
              darkMode
                ? 'bg-gradient-to-r from-cyan-600 to-sky-700 text-white'
                : 'bg-gradient-to-r from-cyan-400 to-sky-600 text-white'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Saving...
              </>
            ) : (
              <>
                <CheckCircle size={18} /> Save Changes
              </>
            )}
          </button>

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
