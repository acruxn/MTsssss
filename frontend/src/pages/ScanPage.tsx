import { useEffect, useState } from "react";
import { postPayment } from "../lib/api";

const Back = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>;
const Chk = () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>;

type Phase = "scanning" | "pay" | "loading" | "success";

export default function ScanPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [phase, setPhase] = useState<Phase>("scanning");
  const [amount, setAmount] = useState("");

  // Auto-complete scan after 2s
  useEffect(() => {
    if (phase !== "scanning") return;
    const t = setTimeout(() => setPhase("pay"), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  async function handlePay() {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setPhase("loading");
    try {
      await postPayment("scan_pay", amt, { merchant: "Kedai Mamak Ali" });
    } catch { /* demo */ }
    setPhase("success");
  }

  if (phase === "scanning") return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-[#0066FF] px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => onNavigate("/")} className="active:scale-90 transition-transform"><Back /></button>
        <h1 className="text-lg font-bold text-white">Scan & Pay</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Viewfinder */}
        <div className="relative w-56 h-56">
          {/* Corner brackets */}
          {[["top-0 left-0", "border-t-2 border-l-2"], ["top-0 right-0", "border-t-2 border-r-2"], ["bottom-0 left-0", "border-b-2 border-l-2"], ["bottom-0 right-0", "border-b-2 border-r-2"]].map(([pos, border]) => (
            <div key={pos} className={`absolute ${pos} w-8 h-8 ${border} border-white rounded-sm`} />
          ))}
          {/* Scan line */}
          <div className="absolute left-2 right-2 h-0.5 bg-[#0066FF] shadow-[0_0_8px_#0066FF]" style={{ animation: "scanLine 2s ease-in-out infinite" }} />
        </div>
        <p className="text-white/70 text-sm mt-8">Point camera at QR code</p>
        <style>{`@keyframes scanLine { 0%,100% { top: 8px; } 50% { top: calc(100% - 8px); } }`}</style>
      </div>
    </div>
  );

  if (phase === "loading") return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-[3px] border-[#E2E8F0] border-t-[#0066FF] rounded-full animate-spin" />
      <p className="text-sm text-[#64748B]">Processing payment...</p>
    </div>
  );

  if (phase === "success") return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 animate-fadeIn"><Chk /></div>
      <h2 className="text-xl font-bold text-[#1E293B] mb-1">Payment Successful</h2>
      <p className="text-sm text-[#64748B] mb-1">Kedai Mamak Ali</p>
      <p className="text-2xl font-bold text-[#1E293B] mb-6">RM {parseFloat(amount).toFixed(2)}</p>
      <button onClick={() => onNavigate("/")} className="w-full max-w-xs py-3 rounded-xl bg-[#0066FF] text-white font-semibold text-sm">Back to Home</button>
    </div>
  );

  // Pay phase
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#0066FF] px-4 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => onNavigate("/")} className="active:scale-90 transition-transform"><Back /></button>
        <h1 className="text-lg font-bold text-white">Scan & Pay</h1>
      </div>
      <div className="px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Chk />
            </div>
            <div>
              <p className="text-xs text-[#94A3B8]">Merchant</p>
              <p className="text-base font-semibold text-[#1E293B]">Kedai Mamak Ali</p>
            </div>
          </div>
          <label className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">RM</span>
            <input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} autoFocus className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-12 pr-4 py-3 text-lg font-semibold text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF]" />
          </div>
        </div>
        <button onClick={handlePay} disabled={!parseFloat(amount)} className="w-full py-3.5 rounded-xl bg-[#0066FF] text-white font-semibold text-sm disabled:opacity-40 active:scale-[0.98] transition-all">
          Pay {parseFloat(amount) ? `RM ${parseFloat(amount).toFixed(2)}` : ""}
        </button>
      </div>
    </div>
  );
}
