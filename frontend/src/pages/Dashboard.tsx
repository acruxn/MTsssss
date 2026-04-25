import { useEffect, useState } from "react";
import { getDashboardStats, getSessions, type DashboardStats, type VoiceSession } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<VoiceSession[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
    getSessions().then(setSessions).catch(() => {});
  }, []);

  const cards = stats
    ? [
        { label: "Total Sessions", value: stats.total_sessions, color: "bg-gradient-to-br from-blue-600 to-blue-800" },
        { label: "Completed", value: stats.completed_sessions, color: "bg-gradient-to-br from-green-600 to-green-800" },
        { label: "Active", value: stats.active_sessions, color: "bg-gradient-to-br from-yellow-500 to-yellow-700" },
        { label: "Templates", value: stats.total_forms, color: "bg-gradient-to-br from-purple-600 to-purple-800" },
        { label: "Languages", value: Object.keys(stats.sessions_by_language).length, color: "bg-gradient-to-br from-cyan-600 to-cyan-800" },
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
              <div key={c.label} className={`${c.color} shadow-lg rounded-xl p-6 text-white`}>
                <p className="text-3xl font-bold">{c.value}</p>
                <p className="text-sm opacity-80 mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
          {sessions.length === 0 ? (
            <p className="text-gray-500 text-sm">No sessions yet. Try filling a form!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-300">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Language</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Fields</th>
                    <th className="p-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-3">#{s.id}</td>
                      <td className="p-3">{s.language.toUpperCase()}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          s.status === "completed" ? "bg-green-900 text-green-300"
                          : s.status === "active" ? "bg-blue-900 text-blue-300"
                          : "bg-gray-700 text-gray-300"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">{s.filled_data ? Object.keys(s.filled_data).length : 0}</td>
                      <td className="p-3 text-gray-400">{new Date(s.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
