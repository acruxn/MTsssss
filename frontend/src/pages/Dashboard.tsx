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
    <div className="p-4 sm:p-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 sm:p-12 mb-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-indigo-400 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-blue-300 text-sm font-medium mb-2 tracking-wide uppercase">FormBuddy — Voice Form Assistant</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            Can't read the form?<br />
            <span className="text-blue-300">Just tell us what you need.</span>
          </h1>
          <p className="text-blue-200/70 mb-6 max-w-lg mx-auto">
            Speak in your language — Malay, English, Chinese, or Tamil. AI fills the form for you.
          </p>
          <a
            href="/templates"
            onClick={(e) => { e.preventDefault(); window.history.pushState({}, "", "/templates"); window.dispatchEvent(new PopStateEvent("popstate")); }}
            className="inline-flex items-center gap-2 bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            🎙️ Start Voice Fill
          </a>
        </div>
      </div>

      {/* Stats */}
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      {!stats ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {cards.map((c) => (
              <div key={c.label} className={`${c.color} rounded-xl p-6 text-white shadow-lg`}>
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
