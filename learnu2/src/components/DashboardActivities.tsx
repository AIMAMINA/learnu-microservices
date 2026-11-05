import { authFetch } from "../utils/api";
import { useEffect, useState } from "react";

interface Activity {
  id: number;
  username: string;
  action: string;
  timestamp: string;
}

export default function DashboardActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchActivities() {
      try {
        // ⚠️ Corrigé : pas d’espace au début
        const res = await authFetch("/activity/latest");

        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();

        // ✅ Garde seulement les 10 plus récentes, du plus récent au plus ancien
        const lastTen = data.slice(-10).reverse();
        setActivities(lastTen);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les activités");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();

    // ✅ rafraîchissement automatique toutes les 15s (optionnel)
    const interval = setInterval(fetchActivities, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Chargement des activités...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-400">
        {error}
      </div>
    );

  return (
    <div className="p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-slate-800 dark:text-gray-100 flex items-center gap-2">
        🔍 Dernières activités utilisateurs
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 uppercase tracking-wide border-b border-gray-300 dark:border-gray-700">
              <th className="pb-3">Utilisateur</th>
              <th className="pb-3">Action</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-400">
                  Aucune activité récente
                </td>
              </tr>
            ) : (
              activities.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all"
                >
                  <td className="py-3 font-medium text-gray-800 dark:text-gray-100">
                    {a.username}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-300">
                    {a.action}
                  </td>
                  <td className="py-3 text-gray-500 dark:text-gray-400 text-sm">
                    {new Date(a.timestamp).toLocaleString("fr-FR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
