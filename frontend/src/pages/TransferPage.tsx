import { useEffect, useState } from "react";
import { getBalance, postTransfer } from "../lib/api";

type Phase = "form" | "loading" | "success" | "error";

export default function TransferPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [balance, setBalance] = useState(1234.56);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [phase, setPhase] = useState<Phase>("form");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [txnId, setTxnId] = useState<number | null>(null);

  useEffect(() => { getBalance().then(r => setBalance(r.balance)).catch(() => {}); }, []);

  const amt = parseFloat(amount) || 0;
  const canSubmit = recipient.trim() && amt > 0 && amt <= balance;

  async function handleTransfer() {
    setPhase("loading");
    setWarnings([]);
    try {
      const r = await postTransfer(recipient.trim(), amt, reference.trim());
      if (r.success) {
        setBalance(r.balance);
        setWarnings(r.warnings);
        setTxnId(r.transaction_id);
        setPhase("success");
      } else {
        setError(r.message || "Transfer failed");
        setPhase("error");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setPhase("error");
    }
  }

  const Header = () => (
    <div style={{ background: "#0066FF" }} className="px-4 py-3 flex items-center gap-3">
      <button onClick={() => onNavigate("/")} className="text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
      <span className="text-white text-lg font-bold">Transfer</span>
    </div>
  );

  if (phase === "loading") return (
    <div className="min-h-full bg-[#F5F5F5]">
      <Header />
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-[3px] border-gray-200 border-t-[#0066FF] rounded-full animate-spin" />
        <p className="text-gray-500 mt-4 text-sm">Processing transfer...</p>
      </div>
    </div>
  );

  if (phase === "success") return (
    <div className="min-h-full bg-[#F5F5F5]">
      <Header />
      <div className="flex flex-col items-center text-center px-6 py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-popIn">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Transfer Successful</h2>
        <p className="text-gray-500 text-sm mb-6">RM {amt.toFixed(2)} sent to {recipient}</p>
        {warnings.length > 0 && (
          <div className="w-full mb-4">{warnings.map((w, i) => <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-2 text-sm text-amber-700">{w}</div>)}</div>
        )}
        <div className="bg-white rounded-2xl p-4 w-full mb-6 shadow-sm">
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Recipient</span><span className="text-sm font-medium">{recipient}</span></div>
          <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Amount</span><span className="text-sm font-medium">RM {amt.toFixed(2)}</span></div>
          {reference && <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Reference</span><span className="text-sm font-medium">{reference}</span></div>}
          {txnId && <div className="flex justify-between py-2 border-b border-gray-50"><span className="text-sm text-gray-500">Transaction ID</span><span className="text-xs font-mono text-gray-400">TXN-{txnId}</span></div>}
          <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Updated Balance</span><span className="text-sm font-bold">RM {balance.toFixed(2)}</span></div>
        </div>
        <button onClick={() => onNavigate("/")} className="w-full py-3 rounded-xl text-white font-semibold" style={{ background: "#0066FF" }}>Done</button>
      </div>
    </div>
  );

  if (phase === "error") return (
    <div className="min-h-full bg-[#F5F5F5]">
      <Header />
      <div className="flex flex-col items-center text-center px-6 py-16">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Transfer Failed</h2>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button onClick={() => setPhase("form")} className="w-full py-3 rounded-xl text-white font-semibold" style={{ background: "#0066FF" }}>Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      <Header />
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Available Balance</p>
          <p className="text-2xl font-bold text-gray-900">RM {balance.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Recipient Name</label>
            <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g. Ahmad Razak" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Amount (RM)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">RM</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20" />
            </div>
            {amt > balance && <p className="text-xs text-red-500 mt-1">Insufficient balance</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Reference (optional)</label>
            <input value={reference} onChange={e => setReference(e.target.value)} placeholder="e.g. Rent payment" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0066FF] focus:ring-1 focus:ring-[#0066FF]/20" />
          </div>
        </div>
        <button onClick={handleTransfer} disabled={!canSubmit} className="w-full mt-4 py-3.5 rounded-xl text-white font-semibold transition-colors disabled:opacity-40" style={{ background: "#0066FF" }}>Transfer RM {amt > 0 ? amt.toFixed(2) : "0.00"}</button>
      </div>
    </div>
  );
}
