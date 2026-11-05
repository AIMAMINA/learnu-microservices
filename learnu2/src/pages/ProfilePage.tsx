import { authFetch } from "../utils/api";
import { useEffect, useState } from 'react';
import { User, Mail, Shield, Loader2 } from 'lucide-react';

interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

export function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No token found. Please login again.');
          setLoading(false);
          return;
        }

      const response = await authFetch("/auth/profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

        if (!response.ok) {
          setError('Failed to load user profile.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );

  if (error || !user)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        ❌ {error || 'Unable to load profile.'}
      </div>
    );

  // ✅ Nom complet ou username fallback
  const fullName =
    `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username;

  // ✅ Avatar automatique avec Dicebear
  const avatarUrl =
    user.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      fullName
    )}&backgroundColor=b6c6ff,dee2ff&fontSize=50`;

  return (
    <div
      className="min-h-screen flex justify-center items-center px-8 py-10"
      style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #3E4753 100%)',
      }}
    >
      <div className="bg-[#E7EEF4] rounded-2xl shadow-xl border border-[#CAD8E4] p-10 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="w-28 h-28 rounded-full mx-auto mb-4 shadow-lg border-4 border-white"
          />
          <h1 className="text-3xl font-bold text-[#1E293B] tracking-wide uppercase">
            {fullName}
          </h1>
          <p className="text-[#3E4753] text-sm">Admin</p> {/* ✅ Toujours Admin */}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#CAD8E4] shadow-sm">
            <Mail className="text-cyan-500" />
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-[#1E293B] break-all">
                {user.email}
              </p>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#CAD8E4] shadow-sm">
            <User className="text-cyan-500" />
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="font-medium text-[#1E293B] uppercase">
                {user.username}
              </p>
            </div>
          </div>

          {/* Role (fixe Admin) */}
          <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-[#CAD8E4] shadow-sm sm:col-span-2">
            <Shield className="text-cyan-500" />
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium text-[#1E293B]">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
