import { useState } from "react";

/* ══════════════════════════════════════════
   TNGHome — Pixel-perfect TNG eWallet home
   ══════════════════════════════════════════ */

export default function TNGHome({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [showBal, setShowBal] = useState(false);

  return (
    <div style={{ background: "#F5F5F5" }}>
      <BlueHeader showBal={showBal} setShowBal={setShowBal} onNavigate={onNavigate} />
      <QuickActions onNavigate={onNavigate} />
      <FeatureCards onNavigate={onNavigate} />
      <PromoCarousel />
      <Recommended onNavigate={onNavigate} />
      <MyFavourites onNavigate={onNavigate} />
      <RecentTransactions onNavigate={onNavigate} />
      <NeedHelp />
      <Footer />
      <FloatingMic onNavigate={onNavigate} />
    </div>
  );
}

/* ── PLACEHOLDER ── */
function BlueHeader({ showBal, setShowBal, onNavigate }: { showBal: boolean; setShowBal: (v: boolean) => void; onNavigate: (p: string) => void }) {
  return (
    <div style={{ background: "#0066FF" }} className="px-4 pt-3 pb-5">
      {/* Top bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1.5">
          <span className="text-base leading-none">🇲🇾</span>
          <span className="text-white text-xs font-bold">MY</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="opacity-60"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <span className="text-sm text-gray-400">BUDI95</span>
        </div>
        <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "linear-gradient(135deg, #FFD700, #FF8C00)" }} />
      </div>
      {/* Balance */}
      <div className="flex items-center gap-2 mb-0.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
        <span className="text-white text-[26px] font-bold tracking-tight">RM {showBal ? "1,234.56" : "****"}</span>
        <button onClick={() => setShowBal(!showBal)} className="ml-1 opacity-70">
          {showBal ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          )}
        </button>
      </div>
      <button className="text-white/60 text-xs mb-4 flex items-center gap-0.5">
        View asset details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      {/* Buttons */}
      <div className="flex gap-3">
        <button onClick={() => onNavigate("/agent?action=pin_reload")} className="flex-1 py-2.5 rounded-full text-sm font-bold bg-white active:scale-[0.97] transition-transform" style={{ color: "#0066FF" }}>+ Add money</button>
        <button onClick={() => onNavigate("/agent?action=check_balance")} className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white border border-white/40 active:scale-[0.97] transition-transform">Transactions &gt;</button>
      </div>
    </div>
  );
}
function QuickActions({ onNavigate }: { onNavigate: (p: string) => void }) {
  const items = [
    { label: "Apply", action: "", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg> },
    { label: "Cash flow", action: "", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg> },
    { label: "Transfer", action: "fund_transfer", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg> },
    { label: "Cards", action: "", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  ];
  return (
    <div className="bg-white mx-4 -mt-1 rounded-2xl px-2 py-4 shadow-sm relative z-10">
      <div className="grid grid-cols-4">
        {items.map((a) => (
          <button key={a.label} onClick={() => a.action ? onNavigate(`/agent?action=${a.action}`) : a.label === "Cash flow" ? onNavigate("/gofinance") : undefined} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#F0F4FF" }}>{a.icon}</div>
            <span className="text-[11px] font-medium text-gray-700">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function FeatureCards({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 px-4 mt-3">
      {/* Grow your money */}
      <button onClick={() => onNavigate("/agent?action=invest")} className="bg-white rounded-2xl p-3 flex items-center gap-2.5 active:scale-[0.97] transition-transform text-left shadow-sm">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}>
          <span className="text-white text-sm font-bold">RM</span>
        </div>
        <div>
          <p className="text-[13px] font-bold text-gray-900 leading-tight">Grow your money</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Start with just RM10</p>
        </div>
      </button>
      {/* BUDI95 */}
      <button onClick={() => onNavigate("/agent?action=fuel_payment")} className="bg-white rounded-2xl p-3 flex items-center gap-2.5 active:scale-[0.97] transition-transform text-left shadow-sm">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: "#2D5016" }}>
          <span className="text-[8px] font-black text-white leading-none text-center">BUDI<br/>MADANI</span>
        </div>
        <div>
          <p className="text-[13px] font-bold text-gray-900 leading-tight">BUDI95</p>
          <p className="text-[11px] text-gray-400 mt-0.5">RON95 at RM1.99</p>
        </div>
      </button>
      {/* GOrewards */}
      <button className="bg-white rounded-2xl p-3 flex items-center gap-2.5 active:scale-[0.97] transition-transform text-left shadow-sm">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FFF8E1" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="0"><path d="M20 7h-3.2L12 2 7.2 7H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-2.5L14.5 7h-5L12 4.5zM20 20H4V9h16v11z"/></svg>
        </div>
        <div>
          <p className="text-[13px] font-bold text-gray-900 leading-tight">GOrewards</p>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#16A34A" }}>251 pts</p>
        </div>
      </button>
      {/* Fuel balance */}
      <button onClick={() => onNavigate("/agent?action=fuel_payment")} className="bg-white rounded-2xl p-3 flex items-center gap-2.5 active:scale-[0.97] transition-transform text-left shadow-sm">
        <div className="flex-1">
          <p className="text-[13px] font-bold text-gray-900 leading-tight">Fuel balance</p>
          <p className="text-[11px] text-gray-400 mt-0.5">88 litres</p>
        </div>
        <svg width="36" height="36" viewBox="0 0 36 36" className="shrink-0">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4"/>
          <circle cx="18" cy="18" r="14" fill="none" stroke="#0066FF" strokeWidth="4" strokeDasharray="66 22" strokeLinecap="round" transform="rotate(-90 18 18)"/>
        </svg>
      </button>
    </div>
  );
}
function PromoCarousel() {
  const [idx, setIdx] = useState(0);
  const promos = [
    { bg: "linear-gradient(135deg, #FF69B4, #C2185B)", tag: "Promo", tagBg: "#FF6D00", title: "CardMatch", sub: "RM50,000*\nto be won", cta: "Apply now", right: "GOfinance" },
    { bg: "linear-gradient(135deg, #7B1FA2, #4A148C)", tag: "New", tagBg: "#4CAF50", title: "Spotify Premium", sub: "Enjoy 3 months\nPremium for\nRM8.80", cta: "", right: "Spotify\nPremium" },
    { bg: "linear-gradient(135deg, #0066FF, #1A237E)", tag: "Hot", tagBg: "#F44336", title: "Remittance", sub: "Get RM5 when you\nrefer family & friends", cta: "", right: "" },
  ];
  return (
    <div className="mt-4 px-4">
      <div className="overflow-hidden rounded-2xl">
        <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${idx * 100}%)` }}>
          {promos.map((p, i) => (
            <div key={i} className="w-full shrink-0 rounded-2xl p-4 min-h-[150px] flex flex-col justify-between" style={{ background: p.bg }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ background: p.tagBg }}>{p.tag}</span>
                  <span className="text-white/90 text-sm font-bold">{p.title}</span>
                  {p.right && <span className="ml-auto text-white/70 text-[10px] font-semibold text-right whitespace-pre-line">{p.right}</span>}
                </div>
                <p className="text-white text-xl font-bold leading-tight whitespace-pre-line">{p.sub}</p>
              </div>
              {p.cta && <p className="text-white/80 text-xs mt-2">{p.cta}</p>}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-2.5">
        {promos.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`h-2 rounded-full transition-all ${i === idx ? "bg-[#0066FF] w-5" : "bg-gray-300 w-2"}`} />
        ))}
      </div>
    </div>
  );
}
function Recommended({ onNavigate }: { onNavigate: (p: string) => void }) {
  const items = [
    { label: "Payday", bg: "#FFF8E1", icon: <><rect x="6" y="4" width="20" height="20" rx="3" fill="#FFD54F" stroke="#F9A825" strokeWidth="1"/><text x="16" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#E65100">25</text></>, badge: "$$ IN", badgeBg: "#EF4444" },
    { label: "Travel", bg: "#E3F2FD", icon: <><circle cx="16" cy="20" r="6" fill="#FFD54F"/><path d="M14 14c0-3 2-8 2-8s2 5 2 8" fill="#4CAF50"/><path d="M12 14c0-2 1.5-6 4-6s4 4 4 6" fill="#66BB6A"/></>, badge: null, badgeBg: "" },
    { label: "Taobao", bg: "#FFF3E0", icon: <><circle cx="16" cy="14" r="10" fill="#FF6D00"/><text x="16" y="18" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">Taobao</text></>, badge: null, badgeBg: "" },
    { label: "Bills", bg: "#F3E5F5", icon: <><rect x="7" y="4" width="18" height="22" rx="2" fill="#E1BEE7" stroke="#CE93D8" strokeWidth="1"/><line x1="11" y1="10" x2="21" y2="10" stroke="#9C27B0" strokeWidth="1.5"/><line x1="11" y1="14" x2="21" y2="14" stroke="#9C27B0" strokeWidth="1.5"/><line x1="11" y1="18" x2="17" y2="18" stroke="#9C27B0" strokeWidth="1.5"/></>, badge: null, badgeBg: "" },
  ];
  return (
    <div className="mt-5 px-4">
      <p className="text-base font-bold text-gray-900 mb-3">Recommended</p>
      <div className="flex justify-between">
        {items.map((r) => (
          <button key={r.label} onClick={() => onNavigate("/services")} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: r.bg }}>
              <svg width="32" height="32" viewBox="0 0 32 32">{r.icon}</svg>
            </div>
            {r.badge && <span className="absolute -top-1 -right-2 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: r.badgeBg }}>{r.badge}</span>}
            <span className="text-[11px] text-gray-600">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function MyFavourites({ onNavigate }: { onNavigate: (p: string) => void }) {
  const items = [
    { label: "Goal City", bg: "#FFF8E1", color: "#F57F17", letter: "GC" },
    { label: "Google Play", bg: "#E8F5E9", color: "#2E7D32", letter: "▶" },
    { label: "ASNB", bg: "#E3F2FD", color: "#1565C0", letter: "A" },
    { label: "MY Prepaid", bg: "#F3E5F5", color: "#7B1FA2", letter: "+60" },
    { label: "My Business", bg: "#E0F2F1", color: "#00695C", letter: "🏪" },
    { label: "Parking", bg: "#FFF3E0", color: "#E65100", letter: "P" },
    { label: "Travel+", bg: "#E8EAF6", color: "#283593", letter: "✈" },
    { label: "More", bg: "#F5F5F5", color: "#757575", letter: "···" },
  ];
  return (
    <div className="mt-5 px-4">
      <div className="flex items-center gap-3 mb-3">
        <p className="text-base font-bold text-gray-900">My Favourites</p>
        <button className="text-sm font-semibold" style={{ color: "#0066FF" }}>Edit</button>
      </div>
      <div className="grid grid-cols-4 gap-y-4">
        {items.map((f) => (
          <button key={f.label} onClick={() => f.label === "More" ? onNavigate("/services") : undefined} className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold" style={{ background: f.bg, color: f.color }}>
              {f.letter}
            </div>
            <span className="text-[10px] text-gray-600 leading-tight text-center">{f.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
function RecentTransactions({ onNavigate }: { onNavigate: (p: string) => void }) {
  const txns = [
    { label: "RON95 Fuel - Petronas", amount: -50.0, date: "Today, 2:30 PM", color: "#0066FF" },
    { label: "Transfer to Ahmad", amount: -100.0, date: "Today, 11:15 AM", color: "#10B981" },
    { label: "TNB Bill Payment", amount: -156.8, date: "Today, 9:00 AM", color: "#F59E0B" },
  ];
  return (
    <div className="bg-white mx-4 mt-5 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <p className="text-sm font-bold text-gray-900">Recent Transactions</p>
        <button onClick={() => onNavigate("/agent?action=check_balance")} className="text-xs font-semibold" style={{ color: "#0066FF" }}>See All</button>
      </div>
      {txns.map((tx, i) => (
        <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < txns.length - 1 ? "border-b border-gray-50" : ""}`}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: tx.color + "15" }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: tx.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{tx.label}</p>
            <p className="text-[11px] text-gray-400">{tx.date}</p>
          </div>
          <span className="text-sm font-semibold tabular-nums" style={{ color: tx.amount > 0 ? "#16A34A" : "#1E293B" }}>
            {tx.amount > 0 ? "+" : "-"}RM {Math.abs(tx.amount).toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
}
function NeedHelp() {
  return (
    <div className="mt-5 px-4">
      <p className="text-base font-bold text-gray-900 mb-3">Need help?</p>
      <div className="flex gap-3">
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">FAQ</p>
          <div className="flex justify-end mt-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5" opacity="0.4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-sm font-semibold text-gray-800">Chat now</p>
          <div className="flex justify-end mt-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5" opacity="0.4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="mt-6 pb-28 text-center px-4">
      <p className="text-[10px] text-gray-400 leading-relaxed">Licensed and regulated by<br/>Bank Negara Malaysia and Securities Commission Malaysia.</p>
      <div className="flex items-center justify-center gap-2 mt-3">
        <img src="/tng/Logo.png" alt="TNG" className="h-5 object-contain" />
        <span className="text-gray-300 text-xs">+</span>
        <span className="text-[11px] text-gray-400 font-semibold italic">Alipay+</span>
      </div>
    </div>
  );
}

function FloatingMic({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <button onClick={() => onNavigate("/agent")} className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg mic-pulse active:scale-90 transition-transform" style={{ background: "#0066FF" }} aria-label="Open FormBuddy">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="1" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 01-14 0v-1"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
    </button>
  );
}
