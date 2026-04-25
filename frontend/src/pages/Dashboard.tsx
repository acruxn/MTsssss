import { useEffect, useState } from "react";
import { getDashboardStats, getSessions, type DashboardStats, type VoiceSession } from "../lib/api";

const navigate = (path: string) => {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

const steps = [
  { icon: "🎙️", title: "Speak", desc: "Talk naturally in your language — Malay, English, Chinese, or Tamil" },
  { icon: "🤖", title: "AI Extracts", desc: "Our AI understands what you said and fills in every field automatically" },
  { icon: "✅", title: "Confirm & Submit", desc: "Review the filled form, make corrections by voice, and submit" },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<VoiceSession[]>([]);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {});
    getSessions().then(setSessions).catch(() => {});
  }, []);

  return (
    <div className="px-4 py-6 sm:px-8 max-w-6xl mx-auto">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] p-8 sm:p-12 mb-8 shadow-xl">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-6 right-8 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/30 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/20 rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-blue-200 text-xs font-semibold mb-3 tracking-widest uppercase">
            TNG FinHack 2026 · Track 1: Financial Inclusion
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Every voice deserves<br />
            <span className="text-blue-200">access to finance.</span>
          </h1>
          <p className="text-blue-100/80 mb-8 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
            Millions can't read complex forms. FormBuddy lets them speak in their language — and AI does the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/voice")}
              className="inline-flex items-center gap-2 bg-white text-[#0066FF] font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg hover:shadow-xl hover:scale-105"
            >
              🎙️ Start Speaking
            </button>
            <button
              onClick={() => navigate("/templates")}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-white/30 hover:border-white/60 transition-all text-sm"
            >
              Browse Templates →
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Sessions", value: stats.total_sessions, color: "border-[#0066FF]", icon: "📊" },
            { label: "Completed", value: stats.completed_sessions, color: "border-emerald-500", icon: "✅" },
            { label: "Active", value: stats.active_sessions, color: "border-amber-500", icon: "🔄" },
            { label: "Templates", value: stats.total_forms, color: "border-purple-500", icon: "📋" },
            { label: "Languages", value: Object.keys(stats.sessions_by_language).length, color: "border-cyan-500", icon: "🌏" },
          ].map((c) => (
            <div key={c.label} className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${c.color} hover-lift`}>
              <div className="flex items-center gap-2 mb-1">
                <span>{c.icon}</span>
                <span className="text-sm text-[#64748B]">{c.label}</span>
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── How It Works ── */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={s.title} className="bg-white rounded-xl p-6 border border-[#E2E8F0] hover-lift text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBF5FF] flex items-center justify-center mx-auto mb-3 text-2xl">
                {s.icon}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <h3 className="font-semibold text-[#1E293B]">{s.title}</h3>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sessions Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1E293B]">Recent Sessions</h2>
          {sessions.length > 0 && (
            <span className="text-xs text-[#94A3B8]">{sessions.length} session{sessions.length !== 1 && "s"}</span>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎙️</div>
            <h3 className="text-lg font-semibold text-[#1E293B] mb-2">No sessions yet</h3>
            <p className="text-[#64748B] text-sm mb-6 max-w-sm mx-auto">
              Start your first voice session — speak naturally and let AI fill the form for you.
            </p>
            <button
              onClick={() => navigate("/voice")}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              🎙️ Try It Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
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
                  <tr key={s.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                    <td className="p-3 font-medium text-[#1E293B]">#{s.id}</td>
                    <td className="p-3 text-[#1E293B]">{s.language.toUpperCase()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.status === "completed" ? "bg-emerald-50 text-emerald-700"
                        : s.status === "active" ? "bg-[#EBF5FF] text-[#0066FF]"
                        : "bg-gray-100 text-gray-600"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-center text-[#64748B]">{s.filled_data ? Object.keys(s.filled_data).length : 0}</td>
                    <td className="p-3 text-[#94A3B8]">{new Date(s.created_at).toLocaleDateString("en-MY", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
