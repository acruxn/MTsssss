import { useState } from "react";

/* ── Inline SVG icons (no emojis) ── */
const SearchIcon = () => <img src="/tng/ic_search_black_24.svg" alt="" className="w-5 h-5 opacity-50" />;
const EyeIcon = ({ open }: { open: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
    ) : (
      <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>
    )}
  </svg>
);
const ShieldCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>
);
const ChevronRight = ({ c = "text-gray-400" }: { c?: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={c}><path d="M9 18l6-6-6-6" /></svg>
);
const CardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
);
const CashFlowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
);
const TransferIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
const ApplyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="12" y2="17" /></svg>
);

/* ── Quick action row icons ── */
const QUICK_ACTIONS = [
  { label: "Apply", icon: ApplyIcon, action: "" },
  { label: "Cash flow", icon: CashFlowIcon, action: "check_balance" },
  { label: "Transfer", icon: TransferIcon, action: "fund_transfer" },
  { label: "Cards", icon: CardIcon, action: "" },
] as const;

/* ── Feature cards ── */
const FEATURE_CARDS = [
  { title: "Grow your money", sub: "Start with just RM10", img: "/tng/gofinance-icon-grow.svg", action: "invest", wide: true },
  { title: "BUDI95", sub: "RON95 at RM1.99", img: "/tng/feature-budi95.jpg", action: "fuel_payment", wide: true },
  { title: "GOrewards", sub: "251 pts", img: "/tng/feature-gorewards.jpg", action: "", wide: true },
  { title: "Fuel balance", sub: "88 litres", img: "/tng/ic_fuel.svg", action: "fuel_payment", wide: true },
] as const;

/* ── Promo carousel ── */
const PROMOS = [
  { img: "/tng/promo-cardmatch.jpg" },
  { img: "/tng/promo-spotify.jpg" },
  { img: "/tng/promo-gofinance.jpg" },
] as const;

/* ── GOfinance cards ── */
const GOFINANCE = [
  { label: "Get more\ncash", img: "/tng/gofinance-card-cash.jpg", action: "apply_loan" },
  { label: "Compare\ninsurances", img: "/tng/gofinance-card-insurance.jpg", action: "buy_insurance" },
  { label: "Get credit\nreport", img: "/tng/gofinance-card-credit.jpg", action: "" },
  { label: "Send\nremittance", img: "/tng/gofinance-card-remit.jpg", action: "" },
  { label: "Invest your\nmoney", img: "/tng/gofinance-card-invest.jpg", action: "invest" },
  { label: "Spend\nglobally", img: "/tng/gofinance-card-global.jpg", action: "" },
] as const;

/* ── Highlights ── */
const HIGHLIGHTS = [
  { img: "/tng/highlight-payday-card.jpg" },
  { img: "/tng/highlight-remittance.jpg" },
] as const;

/* ── Recommended ── */
const RECOMMENDED = [
  { label: "Payday", img: "/tng/highlight-payday.jpg", action: "" },
  { label: "Travel", img: "/tng/rfid-car.webp", action: "pay_toll" },
  { label: "Bills", img: "/tng/home-icon-sostopup.webp", action: "bill_payment" },
] as const;

/* ── Transactions ── */
const TRANSACTIONS = [
  { label: "RON95 Fuel - Petronas", amount: -50.0, date: "Today, 2:30 PM", icon: "/tng/ic_fuel.svg" },
  { label: "Transfer to Ahmad", amount: -100.0, date: "Today, 11:15 AM", icon: "/tng/fund_icon_duit_now.svg" },
  { label: "TNB Bill Payment", amount: -156.8, date: "Today, 9:00 AM", icon: "/tng/nm_icon_payment_success.svg" },
  { label: "Prepaid Reload", amount: -30.0, date: "Yesterday", icon: "/tng/home-icon-sostopup.webp" },
  { label: "Received from Siti", amount: 200.0, date: "Yesterday", icon: "/tng/fund_icon_duit_now.svg" },
] as const;

export default function TNGHome({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [showBal, setShowBal] = useState(false);
  const [promoIdx, setPromoIdx] = useState(0);

  return (
    <div style={{ background: "#F5F5F5" }}>
      {/* ═══ BLUE HEADER ═══ */}
      <div style={{ background: "#0066FF" }} className="px-4 pt-3 pb-5">
        {/* Top bar: flag + search + avatar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5">
            <img src="/tng/app-icon-round.png" alt="" className="w-5 h-5 rounded-full" />
            <span className="text-white text-xs font-semibold">MY</span>
            <ChevronRight c="text-white/70" />
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white rounded-full px-3 py-2">
            <SearchIcon />
            <span className="text-xs text-gray-400">BUDI95</span>
          </div>
          <img src="/tng/app-icon-round.png" alt="Profile" className="w-9 h-9 rounded-full border-2 border-white/30" />
        </div>

        {/* Balance */}
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck />
          <span className="text-white text-2xl font-bold tracking-tight">
            {showBal ? "RM 1,234.56" : "RM ****"}
          </span>
          <button onClick={() => setShowBal(!showBal)} className="ml-1 opacity-80 active:opacity-60">
            <EyeIcon open={showBal} />
          </button>
        </div>
        <button onClick={() => onNavigate("/agent?action=check_balance")} className="text-white/70 text-xs mb-4 flex items-center gap-0.5">
          View asset details <ChevronRight c="text-white/50" />
        </button>

        {/* Add money + Transactions */}
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("/agent?action=pin_reload")}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold bg-white active:scale-[0.97] transition-transform"
            style={{ color: "#0066FF" }}
          >
            + Add money
          </button>
          <button
            onClick={() => onNavigate("/agent?action=check_balance")}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white border border-white/40 active:scale-[0.97] transition-transform"
          >
            Transactions &gt;
          </button>
        </div>
      </div>

      {/* ═══ QUICK ACTIONS ROW ═══ */}
      <div className="bg-white mx-4 -mt-1 rounded-2xl px-2 py-4 shadow-sm" style={{ position: "relative", zIndex: 2 }}>
        <div className="grid grid-cols-4">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => a.action && onNavigate(`/agent?action=${a.action}`)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-11 h-11 rounded-xl bg-[#EBF5FF] flex items-center justify-center">
                <a.icon />
              </div>
              <span className="text-[11px] font-medium text-gray-600">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ FEATURE CARDS (2x2 grid) ═══ */}
      <div className="grid grid-cols-2 gap-2.5 px-4 mt-3">
        {FEATURE_CARDS.map((c, i) => (
          <button
            key={c.title}
            onClick={() => c.action && onNavigate(`/agent?action=${c.action}`)}
            className="bg-white rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.97] transition-transform text-left shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 leading-tight">{c.title}</p>
              <p className={`text-[11px] mt-0.5 ${i === 2 ? "text-[#0066FF] font-semibold" : "text-gray-400"}`}>{c.sub}</p>
            </div>
            <img src={c.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
          </button>
        ))}
      </div>

      {/* ═══ PROMO CAROUSEL ═══ */}
      <div className="mt-4 px-4">
        <div className="overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${promoIdx * 100}%)` }}
          >
            {PROMOS.map((p, i) => (
              <img key={i} src={p.img} alt="" className="w-full shrink-0 rounded-2xl object-cover" style={{ aspectRatio: "16/9" }} />
            ))}
          </div>
        </div>
        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-2.5">
          {PROMOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setPromoIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === promoIdx ? "bg-[#0066FF] w-4" : "bg-gray-300"}`}
            />
          ))}
        </div>
      </div>

      {/* ═══ RECOMMENDED ═══ */}
      <div className="mt-5 px-4">
        <p className="text-base font-bold text-gray-900 mb-3">Recommended</p>
        <div className="flex gap-5">
          {RECOMMENDED.map((r) => (
            <button
              key={r.label}
              onClick={() => r.action && onNavigate(`/agent?action=${r.action}`)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <img src={r.img} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              <span className="text-[11px] font-medium text-gray-600">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ GOFINANCE SECTION ═══ */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-base font-bold text-gray-900">GOfinance</p>
          <button className="text-[#0066FF] text-sm font-semibold flex items-center gap-0.5">
            Open <ChevronRight c="text-[#0066FF]" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Grow and protect your money easily.</p>
        <div className="grid grid-cols-3 gap-2.5">
          {GOFINANCE.map((g) => (
            <button
              key={g.label}
              onClick={() => g.action && onNavigate(`/agent?action=${g.action}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-[0.97] transition-transform text-left"
            >
              <div className="px-2.5 pt-2.5 pb-1">
                <p className="text-[11px] font-medium text-gray-700 leading-tight whitespace-pre-line">{g.label}</p>
              </div>
              <img src={g.img} alt="" className="w-full h-14 object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* ═══ HIGHLIGHTS ═══ */}
      <div className="mt-5 px-4">
        <p className="text-base font-bold text-gray-900 mb-3">Highlights</p>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1 snap-x scrollbar-hide">
          {HIGHLIGHTS.map((h, i) => (
            <img key={i} src={h.img} alt="" className="shrink-0 w-[220px] h-[280px] rounded-2xl object-cover snap-start" />
          ))}
        </div>
      </div>

      {/* ═══ PROMOTIONS ═══ */}
      <div className="mt-5 px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-bold text-gray-900">Promotions</p>
          <button className="text-[#0066FF] text-sm font-semibold flex items-center gap-0.5">
            More <ChevronRight c="text-[#0066FF]" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1 snap-x scrollbar-hide">
          {PROMOS.map((p, i) => (
            <div key={i} className="shrink-0 w-[280px] snap-start">
              <img src={p.img} alt="" className="w-full rounded-2xl object-cover" style={{ aspectRatio: "4/3" }} />
              <p className="text-xs font-medium text-gray-700 mt-1.5">Find Out More</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RECENT TRANSACTIONS ═══ */}
      <div className="bg-white mx-4 mt-5 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-sm font-bold text-gray-900">Recent Transactions</p>
          <button onClick={() => onNavigate("/agent?action=check_balance")} className="text-xs font-semibold" style={{ color: "#0066FF" }}>
            See All
          </button>
        </div>
        {TRANSACTIONS.map((tx, i) => (
          <div key={tx.label} className={`flex items-center gap-3 px-4 py-3 ${i < TRANSACTIONS.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
              <img src={tx.icon} alt="" className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{tx.label}</p>
              <p className="text-[11px] text-gray-400">{tx.date}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums" style={{ color: tx.amount > 0 ? "#16A34A" : "#1E293B" }}>
              {tx.amount > 0 ? "+" : "-"} RM {Math.abs(tx.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* ═══ NEED HELP ═══ */}
      <div className="mt-5 px-4">
        <p className="text-base font-bold text-gray-900 mb-3">Need help?</p>
        <div className="flex gap-3">
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">FAQ</span>
            <img src="/tng/ic_search_black_24.svg" alt="" className="w-8 h-8 opacity-30" />
          </div>
          <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Chat now</span>
            <img src="/tng/app-icon-round.png" alt="" className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="mt-6 pb-28 text-center px-4">
        <p className="text-[10px] text-gray-400 leading-relaxed">
          Licensed and regulated by<br />Bank Negara Malaysia and Securities Commission Malaysia.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <img src="/tng/Logo.png" alt="TNG" className="h-5 object-contain" />
          <span className="text-gray-300 text-xs">+</span>
          <img src="/tng/alipay-icon.webp" alt="Alipay+" className="h-5 object-contain" />
        </div>
      </div>

      {/* ═══ FLOATING MIC (FormBuddy) ═══ */}
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
