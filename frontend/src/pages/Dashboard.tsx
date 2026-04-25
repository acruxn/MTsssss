import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Total Sessions", value: stats.total_sessions, color: "bg-blue-600" },
        { label: "Completed", value: stats.completed_sessions, color: "bg-green-600" },
        { label: "Active", value: stats.active_sessions, color: "bg-yellow-500" },
        { label: "Templates", value: stats.total_forms, color: "bg-purple-600" },
        { label: "Languages", value: Object.keys(stats.sessions_by_language).length, color: "bg-cyan-600" },
      ]
    : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">FormBuddy Dashboard</h1>

      {!stats ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {cards.map((c) => (
              <div key={c.label} className={`${c.color} rounded-xl p-6 text-white`}>
                <p className="text-3xl font-bold">{c.value}</p>
                <p className="text-sm opacity-80 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {Object.keys(stats.sessions_by_language).length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Sessions by Language</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.sessions_by_language).map(([lang, count]) => (
                  <div key={lang} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-gray-400 mt-1">{lang.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
