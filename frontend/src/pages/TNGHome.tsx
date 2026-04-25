const QUICK_ACTIONS = [
  { icon: "💸", label: "Send Money", action: "fund_transfer" },
  { icon: "🧾", label: "Pay Bills", action: "bill_payment" },
  { icon: "📷", label: "Scan & Pay", action: "scan_pay" },
  { icon: "📱", label: "Reload", action: "pin_reload" },
  { icon: "⛽", label: "Fuel", action: "fuel_payment" },
  { icon: "•••", label: "More", action: "" },
] as const;

const TRANSACTIONS = [
  { icon: "⛽", name: "RON95 Fuel - Petronas", amount: -50.0, date: "Today" },
  { icon: "💸", name: "Transfer to Ahmad", amount: -100.0, date: "Today" },
  { icon: "🧾", name: "TNB Bill Payment", amount: -156.8, date: "Today" },
  { icon: "📱", name: "Prepaid Reload - Maxis", amount: -30.0, date: "Yesterday" },
  { icon: "💰", name: "Received from Siti", amount: 200.0, date: "Yesterday" },
] as const;

export default function TNGHome({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="min-h-screen" style={{ background: "#F5F5F5" }}>
      {/* ── Header: greeting + balance ── */}
      <div
        className="px-5 pt-12 pb-8 rounded-b-3xl"
        style={{ background: "linear-gradient(135deg, #0066FF, #0052CC)" }}
      >
        <p className="text-white/80 text-sm mb-1">Good evening, Ahmad 👋</p>
        <p className="text-white/60 text-xs mb-1">Available Balance</p>
        <p className="text-white text-4xl font-bold tracking-tight">RM 1,234.56</p>
      </div>

      {/* ── Quick Actions ── */}
      <div className="bg-white rounded-2xl shadow-sm mx-4 -mt-4 relative z-10 p-4">
        <div className="grid grid-cols-3 gap-y-5 gap-x-2">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() =>
                onNavigate(a.action ? `/agent?action=${a.action}` : "/services")
              }
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                style={{ background: "#EBF5FF" }}
              >
                {a.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="bg-white rounded-2xl shadow-sm mx-4 mt-4 p-4 mb-28">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h2>
        <div className="divide-y divide-gray-100">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.name} className="flex items-center gap-3 py-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                style={{ background: "#F5F5F5" }}
              >
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{tx.name}</p>
                <p className="text-xs text-gray-400">{tx.date}</p>
              </div>
              <span
                className="text-sm font-semibold whitespace-nowrap"
                style={{ color: tx.amount > 0 ? "#16a34a" : "#dc2626" }}
              >
                {tx.amount > 0 ? "+" : "-"}RM{Math.abs(tx.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Floating Mic Button ── */}
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
