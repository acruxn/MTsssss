import { useEffect, useState } from "react";
import { getBalance, postPayment } from "../lib/api";

type Phase = "form" | "loading" | "success" | "error";
const CARRIERS = ["Maxis", "Celcom", "Digi", "U Mobile"] as const;
const PRESETS = [5, 10, 30, 50] as const;

export default function ReloadPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [balance, setBalance] = useState(1234.56);
  const [phone, setPhone] = useState("");
  const [carrier, setCarrier] = useState("Maxis");
  const [amount, setAmount] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [error, setError] = useState("");

  useEffect(() => { getBalance().then(r => setBalance(r.balance)).catch(() => {}); }, []);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("prefill") === "1") {
      if (p.get("phone")) setPhone(p.get("phone")!);
      if (p.get("amount")) setAmount(p.get("amount")!);
      if (p.get("carrier")) setCarrier(p.get("carrier")!);
    }
  }, []);

  const amt = parseFloat(amount) || 0;
  const canSubmit = phone.trim().length >= 9 && amt > 0 && amt <= balance;

  async function handleReload() {
    setPhase("loading");
    try {
      const r = await postPayment("reload", amt, { phone: "+60" + phone.trim(), carrier });
      if (r.success) { setBalance(r.balance); setPhase("success"); }
      else { setError(r.message || "Reload failed"); setPhase("error"); }
    } catch { setError("Something went wrong."); setPhase("error"); }
  }

  const Header = () => (
    <div style={{ background: "#0066FF" }} className="px-4 py-3 flex items-center gap-3">
      <button onClick={() => onNavigate("/")} className="text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
      <span className="text-white text-lg font-bold">Reload</span>
    </div>
  );

  if (phase === "loading") return (<div className="min-h-full bg-[#F5F5F5]"><Header /><div className="flex flex-col items-center py-32"><div className="w-12 h-12 border-[3px] border-gray-200 border-t-[#0066FF] rounded-full animate-spin"/><p className="text-gray-500 mt-4 text-sm">Processing reload...</p></div></div>);

  if (phase === "success") return (
    <div className="min-h-full bg-[#F5F5F5]"><Header />
      <div className="flex flex-col items-center text-center px-6 py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-popIn"><svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Reload Successful</h2>
        <p className="text-gray-500 text-sm mb-6">RM {amt.toFixed(2)} to +60{phone}</p>
        <div className="bg-white rounded-2xl p-4 w-full mb-6 shadow-sm">
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Phone</span><span className="text-sm font-medium">+60{phone}</span></div>
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Carrier</span><span className="text-sm font-medium">{carrier}</span></div>
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Amount</span><span className="text-sm font-medium">RM {amt.toFixed(2)}</span></div>
          <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Updated Balance</span><span className="text-sm font-bold">RM {balance.toFixed(2)}</span></div>
        </div>
        <button onClick={() => onNavigate("/")} className="w-full py-3 rounded-xl text-white font-semibold" style={{ background: "#0066FF" }}>Done</button>
      </div>
    </div>
  );

  if (phase === "error") return (<div className="min-h-full bg-[#F5F5F5]"><Header /><div className="flex flex-col items-center text-center px-6 py-16"><div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4"><svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg></div><h2 className="text-xl font-bold text-gray-900 mb-1">Reload Failed</h2><p className="text-gray-500 text-sm mb-6">{error}</p><button onClick={() => setPhase("form")} className="w-full py-3 rounded-xl text-white font-semibold" style={{ background: "#0066FF" }}>Try Again</button></div></div>);

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <Header />
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">RM {balance.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          {new URLSearchParams(window.location.search).get("prefill") === "1" && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-blue-700 flex items-center gap-2">
              <span>🤖</span> Pre-filled by FormBuddy — review and confirm
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Phone Number</label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-gray-100 rounded-xl text-sm text-gray-500 font-medium">+60</span>
              <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="12 345 6789" className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0066FF]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Carrier</label>
            <div className="grid grid-cols-4 gap-2">
              {CARRIERS.map(c => (
                <button key={c} onClick={() => setCarrier(c)} className={`py-2 rounded-xl text-xs font-semibold border-2 transition-colors ${carrier === c ? "border-[#0066FF] bg-[#EBF5FF] text-[#0066FF]" : "border-gray-200 text-gray-500"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Amount (RM)</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map(p => (
                <button key={p} onClick={() => setAmount(String(p))} className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${amt === p ? "border-[#0066FF] bg-[#EBF5FF] text-[#0066FF]" : "border-gray-200 text-gray-500"}`}>RM{p}</button>
              ))}
            </div>
          </div>
        </div>
        <button onClick={handleReload} disabled={!canSubmit} className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold disabled:opacity-40" style={{ background: "#0066FF" }}>Reload RM {amt > 0 ? amt.toFixed(2) : "0.00"}</button>
      </div>
    </div>
  );
}
