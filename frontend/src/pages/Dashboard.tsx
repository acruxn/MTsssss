import { useEffect, useState } from "react";
import { getDashboardStats, getSessions, type DashboardStats, type VoiceSession } from "../lib/api";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<VoiceSession[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
    getSessions().then(setSessions).catch(() => {});
  }, []);

  return (
    <div className="px-4 py-6 sm:px-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 sm:p-12 mb-8 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-4 left-4 w-48 h-48 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <p className="text-blue-100 text-sm font-medium mb-2 tracking-wide uppercase">FormBuddy — Voice Form Assistant</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            Can't read the form?<br />
            <span className="text-blue-200">Just tell us what you need.</span>
          </h1>
          <p className="text-blue-100/80 mb-6 max-w-lg mx-auto">
            Speak in your language — Malay, English, Chinese, or Tamil. AI fills the form for you.
          </p>
          <button
            onClick={() => { window.history.pushState({}, "", "/voice"); window.dispatchEvent(new PopStateEvent("popstate")); }}
            className="inline-flex items-center gap-2 bg-white text-[#0066FF] font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-lg"
          >
            🎙️ Start Speaking
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Sessions", value: stats.total_sessions, color: "border-[#0066FF]", icon: "📊" },
            { label: "Completed", value: stats.completed_sessions, color: "border-emerald-500", icon: "✅" },
            { label: "Active", value: stats.active_sessions, color: "border-amber-500", icon: "🔄" },
            { label: "Templates", value: stats.total_forms, color: "border-purple-500", icon: "📋" },
            { label: "Languages", value: Object.keys(stats.sessions_by_language).length, color: "border-cyan-500", icon: "🌏" },
          ].map((c) => (
            <div key={c.label} className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${c.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{c.icon}</span>
                <span className="text-sm text-[#64748B]">{c.label}</span>
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Sessions Table */}
      {sessions.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-lg font-semibold text-[#1E293B]">Recent Sessions</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-[#64748B]">
              <tr>
                <th className="p-3 text-left font-medium">ID</th>
                <th className="p-3 text-left font-medium">Language</th>
                <th className="p-3 text-center font-medium">Status</th>
                <th className="p-3 text-center font-medium">Fields</th>
                <th className="p-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC]">
                  <td className="p-3 font-medium">#{s.id}</td>
                  <td className="p-3">{s.language.toUpperCase()}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      s.status === "completed" ? "bg-emerald-50 text-emerald-700"
                      : s.status === "active" ? "bg-blue-50 text-[#0066FF]"
                      : "bg-gray-100 text-gray-600"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">{s.filled_data ? Object.keys(s.filled_data).length : 0}</td>
                  <td className="p-3 text-[#64748B]">{new Date(s.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
