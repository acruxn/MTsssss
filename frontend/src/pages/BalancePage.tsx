import { useEffect, useState } from "react";
import { getBalance, getTransactions, type BalanceInfo, type PaymentTransaction } from "../lib/api";

export default function BalancePage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [bal, setBal] = useState<BalanceInfo | null>(null);
  const [txns, setTxns] = useState<PaymentTransaction[]>([]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    getBalance().then(setBal).catch(() => setErr(true));
    getTransactions().then(setTxns).catch(() => {});
  }, []);

  const typeColors: Record<string, string> = {
    transfer: "#10B981", bill_payment: "#F59E0B", fuel_payment: "#0066FF",
    pin_reload: "#8B5CF6", received: "#16A34A", scan_pay: "#EC4899",
  };

  return (
    <div className="min-h-full bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#0066FF] px-4 py-3 flex items-center gap-3">
        <button onClick={() => onNavigate("/")} className="text-white" aria-label="Back">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white font-bold text-lg">My Balance</h1>
      </div>

      {/* Balance card */}
      <div className="bg-white mx-4 mt-4 rounded-2xl p-6 shadow-sm text-center">
        {err ? (
          <p className="text-sm text-gray-400">Could not load balance</p>
        ) : !bal ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <>
            <p className="text-xs text-[#64748B] mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-[#1E293B]">RM {bal.balance.toFixed(2)}</p>
            <p className="text-xs text-[#94A3B8] mt-1">{bal.name}</p>
            <button
              onClick={() => onNavigate("/reload")}
              className="mt-4 bg-[#0066FF] text-white text-sm font-semibold px-8 py-2.5 rounded-full"
            >
              + Add money
            </button>
          </>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white mx-4 mt-4 rounded-2xl overflow-hidden shadow-sm mb-6">
        <p className="text-sm font-bold text-[#1E293B] px-4 pt-4 pb-2">Transaction History</p>
        {txns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-[#94A3B8]">No transactions yet</p>
          </div>
        ) : (
          txns.map((tx, i) => {
            const color = typeColors[tx.type] || "#6B7280";
            const isCredit = tx.amount > 0;
            return (
              <div key={tx.id || i} className={`flex items-center gap-3 px-4 py-3 ${i < txns.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: color + "15" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1E293B] truncate">{tx.recipient || (tx.reference && !tx.reference.startsWith("{") ? tx.reference : null) || {transfer:"Transfer",fuel:"Fuel Payment",reload:"Prepaid Reload",bill:"Bill Payment",scan_pay:"Scan & Pay"}[tx.type] || tx.type}</p>
                  <p className="text-[11px] text-[#94A3B8]">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <span className="text-sm font-semibold tabular-nums" style={{ color: isCredit ? "#16A34A" : "#1E293B" }}>
                  {isCredit ? "+" : "-"}RM {Math.abs(tx.amount).toFixed(2)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
