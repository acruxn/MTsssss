import { useState } from "react";

const TRANSACTIONS = [
  { name: "Exit Toll: PANTAI DALAM EAST", amount: "2.30" },
  { name: "Exit Toll: PJS 5", amount: "2.30" },
  { name: "Exit Toll: KEMUNING", amount: "2.00" },
];

const BUBBLES = [
  { label: "Car", size: 72, x: 52, y: 72, color: "#D1D5DB" },
  { label: "Home", size: 60, x: 60, y: 42, color: "#D1D5DB" },
  { label: "Travel", size: 52, x: 78, y: 58, color: "#D1D5DB" },
  { label: "PA", size: 48, x: 38, y: 48, color: "#D1D5DB" },
  { label: "Wallet", size: 56, x: 30, y: 28, color: "#D1D5DB" },
  { label: "Critical\nIllness", size: 50, x: 58, y: 20, color: "#D1D5DB" },
  { label: "Parking", size: 48, x: 80, y: 30, color: "#D1D5DB" },
  { label: "Medical", size: 50, x: 18, y: 48, color: "#D1D5DB" },
  { label: "Motorcycle", size: 48, x: 22, y: 65, color: "#D1D5DB" },
];

const CASHFLOW = [
  { icon: "/tng/ic_exchange_rate_vertical_arrows.svg", label: "Transfer", amount: "2,205.79", pct: 89, txns: 26, color: "#FFCC00" },
  { icon: "/tng/ic_fuel.svg", label: "Transport", amount: "144.09", pct: 6, txns: 77, color: "#F97316" },
  { icon: "/tng/nm_voucher_shopping_cart.svg", label: "Shops", amount: "130.00", pct: 5, txns: 2, color: "#3B82F6" },
];

const Arrow = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>;
const BackArrow = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const ChevDown = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>;

const EyeOpen = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeClosed = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

export default function GOfinance({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [tab, setTab] = useState<"overview" | "cashflow">("overview");
  const [showBal, setShowBal] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [cfTab, setCfTab] = useState<"in" | "out">("out");

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* ── Header ── */}
      <div className="bg-[#0066FF] px-4 pt-10 pb-0">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => onNavigate("/")} className="active:scale-90 transition-transform"><BackArrow /></button>
          <h1 className="text-lg font-bold text-white">GOfinance</h1>
        </div>
        {/* Tabs */}
        <div className="flex">
          <button onClick={() => setTab("overview")} className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${tab === "overview" ? "text-white border-white" : "text-blue-200 border-transparent"}`}>Overview</button>
          <button onClick={() => setTab("cashflow")} className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${tab === "cashflow" ? "text-white border-white" : "text-blue-200 border-transparent"}`}>Cash flow</button>
        </div>
      </div>
      {/* Yellow progress bar under tabs */}
      <div className="h-1 bg-[#FFCC00]" />

      {/* ── OVERVIEW TAB ── */}
      {tab === "overview" && (
        <div className="pb-8">
          {/* My balances */}
          <div className="bg-white px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-[#1E293B]">My balances</span>
              <button onClick={() => setShowBal(!showBal)} className="text-gray-400"><EyeOpen /></button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#1E293B]">{showBal ? "RM 1,234.56" : "RM ****"}</span>
              <ChevDown />
            </div>
          </div>

          {/* Progress card */}
          <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-4 border-[#0066FF] border-r-[#E2E8F0] flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0066FF"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1E293B]">Keep going, you're doing good!</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">2/3 steps completed</span>
                  <button onClick={() => setShowSteps(!showSteps)} className="text-xs font-semibold text-[#0066FF] flex items-center gap-1">Show steps <ChevDown /></button>
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div className="h-full bg-[#0066FF] rounded-full" style={{ width: "66%" }} />
            </div>
            {showSteps && (
              <div className="mt-3 text-xs text-[#64748B] space-y-1">
                <p className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Activate eWallet</p>
                <p className="flex items-center gap-2"><span className="text-green-500">&#10003;</span> Make first payment</p>
                <p className="flex items-center gap-2"><span className="text-[#94A3B8]">&#9675;</span> Set up auto-reload</p>
              </div>
            )}
          </div>

          {/* Spending */}
          <div className="mx-4 mt-3 bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0066FF"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <p className="text-sm text-[#1E293B] flex-1">You've spent <strong>RM2,479.88</strong> this month!</p>
            <Arrow />
          </div>

          {/* Credit profile card */}
          <div className="mx-4 mt-3 bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#1E293B] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#1E293B] text-sm font-bold">!</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#1E293B]">Your credit profile has a story</p>
                <p className="text-xs text-[#64748B] mt-1 leading-relaxed">Banks and lenders are reading it before you do! Get your MyCTOS Score Report & know your credit health like a PRO</p>
              </div>
              <button className="text-gray-400 shrink-0 -mt-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <button className="mt-4 w-full py-2.5 rounded-full border-2 border-[#0066FF] text-[#0066FF] text-sm font-semibold">Show Me Now</button>
            <div className="flex justify-center gap-1.5 mt-4">
              <span className="w-5 h-2 rounded-full bg-[#0066FF]" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="w-2 h-2 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Recent transactions */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">Recent transactions</span>
              <Arrow />
            </div>
            {TRANSACTIONS.map((tx, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-3 ${i < TRANSACTIONS.length - 1 ? "border-b border-gray-100" : ""}`}>
                <span className="text-sm text-[#1E293B]">{tx.name}</span>
                <span className="text-sm font-medium text-[#1E293B]">-RM{tx.amount}</span>
              </div>
            ))}
          </div>

          {/* CashLoan */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">CashLoan</span>
              <Arrow />
            </div>
            <div className="mx-5 rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #F0F7FF, #E8F4FD)" }}>
              <img src="/tng/gofinance-cashloan.svg" alt="CashLoan" className="w-full h-36 object-contain" />
            </div>
            <p className="text-center text-sm font-medium text-[#1E293B] mt-3 px-5">Get extra cash with a flexible plan just for you!</p>
            <div className="px-5 pb-5 pt-3">
              <button onClick={() => onNavigate("/agent?action=apply_loan")} className="w-full py-3 rounded-full border-2 border-[#1E293B] text-sm font-semibold text-[#1E293B]">Apply now</button>
            </div>
          </div>

          {/* Investment */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">Investment</span>
              <Arrow />
            </div>
            <div className="px-5 pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-[#1E293B]">Total asset value</span>
                <button onClick={() => setShowBal(!showBal)} className="text-gray-400"><EyeClosed /></button>
              </div>
              <p className="text-lg font-bold text-[#1E293B] mb-4">RM ****</p>
            </div>
            {showBreakdown && (
              <div className="mx-5 border border-gray-200 rounded-xl p-4 mb-3">
                <div className="flex items-center gap-4">
                  {/* Donut chart */}
                  <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#D1D5DB" strokeWidth="12" strokeDasharray="60 179" strokeDashoffset="0" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="flex-1 space-y-3">
                    {[
                      { label: "Principal unit trust", cta: "Invest now", color: "#D1D5DB" },
                      { label: "Gold", cta: "Buy gold", color: "#D1D5DB" },
                      { label: "ASNB", cta: "Invest now", color: "#D1D5DB" },
                    ].map(item => (
                      <button key={item.label} onClick={() => onNavigate("/agent?action=invest")} className="flex items-center justify-between w-full text-left">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                          <div>
                            <p className="text-xs text-[#1E293B]">{item.label}</p>
                            <p className="text-xs font-semibold text-[#0066FF]">{item.cta}</p>
                          </div>
                        </div>
                        <Arrow />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="mx-5 mb-3 bg-blue-50 rounded-xl p-3 flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white text-[10px] font-bold">i</span>
              </div>
              <div>
                <p className="text-xs text-[#1E293B]">e-Trade investment is not included in the total asset value.</p>
                <p className="text-xs font-semibold text-[#0066FF]">Go to e-Trade &gt;</p>
              </div>
            </div>
            <button onClick={() => setShowBreakdown(!showBreakdown)} className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-[#0066FF] border-t border-gray-100">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showBreakdown ? "rotate(180deg)" : "" }}><path d="M6 9l6 6 6-6"/></svg>
              {showBreakdown ? "Hide" : "Show"} asset breakdown
            </button>
          </div>

          {/* Insurance */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">Insurance</span>
              <Arrow />
            </div>
            <div className="px-5 pb-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-[#1E293B] mb-4">Your insurance coverage</p>
                {/* Bubble chart */}
                <div className="relative w-full" style={{ height: 260 }}>
                  {BUBBLES.map(b => (
                    <div key={b.label} className="absolute rounded-full flex items-center justify-center text-center" style={{ width: b.size, height: b.size, left: `${b.x}%`, top: `${b.y}%`, transform: "translate(-50%,-50%)", background: b.color }}>
                      <span className="text-[10px] font-medium text-white leading-tight whitespace-pre-line">{b.label}</span>
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-4 text-xs text-[#64748B]">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gray-300" /> Not covered</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" /> Covered</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Expiring</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Expired</span>
                </div>
                <div className="mt-3 bg-blue-50 rounded-lg px-3 py-2 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">i</span>
                  </div>
                  <span className="text-xs text-[#1E293B]">Tap any circle above to explore a product.</span>
                </div>
              </div>
            </div>
          </div>

          {/* My Score (CTOS) */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">My Score</span>
              <Arrow />
            </div>
            <div className="mx-5 rounded-xl overflow-hidden">
              <img src="/tng/gofinance-credit.svg" alt="CTOS Score" className="w-full" style={{ maxHeight: 200, objectFit: "cover", objectPosition: "top" }} />
            </div>
            <p className="text-center text-xs text-gray-500 mt-2 mb-3">Powered by <strong>CTOS</strong></p>
            <div className="px-5 pb-5">
              <button className="w-full py-3 rounded-full border-2 border-[#0066FF] text-[#0066FF] text-sm font-semibold">Get my credit score</button>
            </div>
          </div>

          {/* Visa Card */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">Visa Card</span>
              <Arrow />
            </div>
            <div className="px-5 pb-5 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1E293B]">Spend and withdraw globally.</p>
              </div>
              <img src="/tng/gofinance-visa.svg" alt="Visa Card" className="w-28 h-20 object-contain shrink-0" />
            </div>
          </div>

          {/* Remittance */}
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <span className="text-sm font-bold text-[#0066FF]">Remittance</span>
              <Arrow />
            </div>
            <div className="px-5 pb-5 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-base font-semibold text-[#1E293B]">Transfer to around 50+ countries.</p>
              </div>
              <img src="/tng/gofinance-remittance.svg" alt="Remittance" className="w-28 h-20 object-contain shrink-0" />
            </div>
          </div>

          {/* End */}
          <p className="text-center text-xs text-gray-400 mt-6 mb-4">You've reached the end.</p>
        </div>
      )}

      {/* ── CASH FLOW TAB ── */}
      {tab === "cashflow" && (
        <div className="pb-8">
          <div className="mx-4 mt-3 bg-white rounded-2xl shadow-sm p-5">
            {/* Month + toggle */}
            <div className="flex items-center justify-between mb-4">
              <button className="flex items-center gap-1 text-lg font-bold text-[#1E293B]">Apr 2026 <ChevDown /></button>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                <button onClick={() => setCfTab("in")} className={`px-4 py-1.5 text-xs font-semibold transition-colors ${cfTab === "in" ? "bg-[#0066FF] text-white" : "text-[#64748B]"}`}>Money in</button>
                <button onClick={() => setCfTab("out")} className={`px-4 py-1.5 text-xs font-semibold transition-colors ${cfTab === "out" ? "bg-[#0066FF] text-white" : "text-[#64748B]"}`}>Money out</button>
              </div>
            </div>

            {/* Donut chart */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Transfer 89% = ~320deg */}
                  <circle cx="100" cy="100" r="75" fill="none" stroke="#FFCC00" strokeWidth="28" strokeDasharray="424 48" strokeDashoffset="0" transform="rotate(-90 100 100)" />
                  {/* Transport 6% = ~22deg */}
                  <circle cx="100" cy="100" r="75" fill="none" stroke="#F97316" strokeWidth="28" strokeDasharray="28 443" strokeDashoffset="-424" transform="rotate(-90 100 100)" />
                  {/* Shops 5% = ~18deg */}
                  <circle cx="100" cy="100" r="75" fill="none" stroke="#3B82F6" strokeWidth="28" strokeDasharray="19 452" strokeDashoffset="-452" transform="rotate(-90 100 100)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-[#64748B]">Total</span>
                  <span className="text-lg font-bold text-[#1E293B]">RM 2,479.88</span>
                </div>
                {/* Labels */}
                <span className="absolute text-[10px] text-[#64748B]" style={{ top: 10, right: 20 }}>Shops</span>
                <span className="absolute text-[10px] text-[#64748B]" style={{ top: 20, left: 10 }}>Transport</span>
                <span className="absolute text-[10px] text-[#64748B]" style={{ bottom: 10, right: 20 }}>Transfer</span>
              </div>
            </div>

            {/* Breakdown rows */}
            <div className="space-y-4">
              {CASHFLOW.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <img src={item.icon} alt={item.label} className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1E293B]">{item.label}</span>
                      <span className="text-sm font-semibold text-[#1E293B] tabular-nums">RM{item.amount}</span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8]">{item.pct}% ({item.txns} transactions)</span>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
