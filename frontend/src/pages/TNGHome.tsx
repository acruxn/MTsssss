import { useState } from "react";

const SERVICES = [
  { icon: "📱", label: "Reload", action: "pin_reload", color: "#0066FF" },
  { icon: "💸", label: "Transfer", action: "fund_transfer", color: "#10B981" },
  { icon: "🧾", label: "Pay Bills", action: "bill_payment", color: "#F59E0B" },
  { icon: "📷", label: "Scan &\nPay", action: "scan_pay", color: "#8B5CF6" },
  { icon: "📈", label: "GO+", action: "invest", color: "#14B8A6" },
  { icon: "💳", label: "GOpinjam", action: "apply_loan", color: "#EF4444" },
  { icon: "🎁", label: "GOrewards", action: "", color: "#FFCC00" },
  { icon: "•••", label: "More", action: "", color: "#6B7280" },
] as const;

const SECONDARY = [
  { icon: "🛣️", label: "RFID", action: "pay_toll" },
  { icon: "🅿️", label: "Toll", action: "pay_toll" },
] as const;

const PROMOS: readonly { title: string; sub: string; bg: string; badge: string; dark?: boolean }[] = [
  { title: "GOrewards", sub: "Earn points on every transaction", bg: "linear-gradient(135deg,#0066FF,#0052CC)", badge: "🎁" },
  { title: "RM5 Cashback", sub: "Reload RM50+ this weekend", bg: "linear-gradient(135deg,#FFCC00,#FFB800)", badge: "💰", dark: true },
  { title: "Refer & Earn", sub: "Get RM10 for each friend", bg: "linear-gradient(135deg,#10B981,#059669)", badge: "🤝" },
];

const TRANSACTIONS = [
  { icon: "⛽", name: "RON95 Fuel - Petronas", amount: -50.0, date: "Today, 2:30 PM" },
  { icon: "💸", name: "Transfer to Ahmad", amount: -100.0, date: "Today, 11:15 AM" },
  { icon: "🧾", name: "TNB Bill Payment", amount: -156.8, date: "Today, 9:00 AM" },
  { icon: "📱", name: "Prepaid Reload - Maxis", amount: -30.0, date: "Yesterday" },
  { icon: "💰", name: "Received from Siti", amount: 200.0, date: "Yesterday" },
] as const;

const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosed = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function TNGHome({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [showBalance, setShowBalance] = useState(true);
  const [toast, setToast] = useState("");

  function handleService(action: string, label: string) {
    if (label === "GOrewards") {
      setToast("GOrewards coming soon!");
      setTimeout(() => setToast(""), 2000);
    } else if (label === "More") {
      onNavigate("/services");
    } else if (action) {
      onNavigate(`/agent?action=${action}`);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "#F5F5F5" }}>
      {/* ── Balance Card ── */}
      <div className="bg-white px-5 pt-10 pb-5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">My Balance</p>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 p-1 -mr-1 active:scale-90 transition-transform"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <EyeOpen /> : <EyeClosed />}
          </button>
        </div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight mb-4">
          {showBalance ? "RM 1,234.56" : "RM ••••••"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("/agent?action=pin_reload")}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 active:scale-[0.97] transition-transform"
            style={{ borderColor: "#0066FF", color: "#0066FF" }}
          >
            + Reload
          </button>
          <button
            onClick={() => onNavigate("/agent?action=check_balance")}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 active:scale-[0.97] transition-transform"
          >
            Transaction →
          </button>
        </div>
      </div>

      {/* ── Services Grid ── */}
      <div className="bg-white mx-4 mt-3 rounded-2xl p-4">
        <div className="grid grid-cols-4 gap-y-4">
          {SERVICES.map((svc) => (
            <button
              key={svc.label}
              onClick={() => handleService(svc.action, svc.label)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{ background: `${svc.color}15` }}
              >
                {svc.icon}
              </div>
              <span className="text-[11px] font-medium text-gray-600 leading-tight text-center whitespace-pre-line">
                {svc.label}
              </span>
            </button>
          ))}
        </div>
        {/* Secondary: RFID / Toll */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          {SECONDARY.map((svc) => (
            <button
              key={svc.label}
              onClick={() => onNavigate(`/agent?action=${svc.action}`)}
              className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-gray-50 active:scale-[0.97] transition-transform"
            >
              <span className="text-base">{svc.icon}</span>
              <span className="text-xs font-medium text-gray-600">{svc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg animate-fadeIn">
          {toast}
        </div>
      )}

      {/* ── Highlights / Promos ── */}
      <div className="mt-3 px-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights</p>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
          {PROMOS.map((p) => (
            <div
              key={p.title}
              className="shrink-0 w-[260px] rounded-2xl p-4 snap-start"
              style={{ background: p.bg }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-sm font-bold ${p.dark ? "text-gray-900" : "text-white"}`}>{p.title}</p>
                  <p className={`text-xs mt-0.5 ${p.dark ? "text-gray-700" : "text-white/80"}`}>{p.sub}</p>
                </div>
                <span className="text-2xl">{p.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="bg-white mx-4 mt-3 rounded-2xl mb-28">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-sm font-semibold text-gray-900">Recent Transactions</p>
          <button
            onClick={() => onNavigate("/agent?action=check_balance")}
            className="text-xs font-medium"
            style={{ color: "#0066FF" }}
          >
            See All
          </button>
        </div>
        {TRANSACTIONS.map((tx, i) => (
          <div
            key={tx.name}
            className={`flex items-center gap-3 px-4 py-3 ${i < TRANSACTIONS.length - 1 ? "border-b border-gray-50" : ""}`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 bg-gray-50">
              {tx.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{tx.name}</p>
              <p className="text-xs text-gray-400">{tx.date}</p>
            </div>
            <span
              className="text-sm font-semibold whitespace-nowrap tabular-nums"
              style={{ color: tx.amount > 0 ? "#16A34A" : "#1E293B" }}
            >
              {tx.amount > 0 ? "+" : "-"} RM {Math.abs(tx.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* ── Floating Mic Button (FormBuddy) ── */}
      <button
        onClick={() => onNavigate("/agent")}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg mic-pulse active:scale-90 transition-transform"
        style={{ background: "#0066FF" }}
        aria-label="Open voice assistant"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="1" width="6" height="12" rx="3" />
          <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
    </div>
  );
}
