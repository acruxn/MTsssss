import { useEffect, useState } from "react";
import { getFlow } from "../lib/flows";
import { postTransfer, postPayment } from "../lib/api";

const META: Record<string, { icon: string; label: string }> = {
  pay_toll: { icon: "🛣️", label: "Toll / RFID Top-up" },
  pay_parking: { icon: "🅿️", label: "Parking Payment" },
  buy_insurance: { icon: "🛡️", label: "Insurance" },
  apply_loan: { icon: "💳", label: "GOpinjam Loan" },
  invest: { icon: "📈", label: "GO+ Investment" },
  buy_ticket: { icon: "🎫", label: "Buy Ticket" },
  food_delivery: { icon: "🍔", label: "Food Delivery" },
  donate: { icon: "❤️", label: "Donation" },
  fund_transfer: { icon: "💸", label: "Fund Transfer" },
  fuel_payment: { icon: "⛽", label: "Fuel Payment" },
  pin_reload: { icon: "📱", label: "Prepaid Reload" },
  bill_payment: { icon: "🧾", label: "Bill Payment" },
  scan_pay: { icon: "📷", label: "Scan & Pay" },
};

export default function TaskPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const action = new URLSearchParams(window.location.search).get("action") || "";
  const meta = META[action];
  const flow = getFlow(action, {});
  const formSteps = flow?.steps.filter(s => s.type === "input" || s.type === "select") || [];

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    formSteps.forEach(s => { if (s.field) init[s.field] = ""; });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ message: string; balance?: number; warnings?: string[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("prefill") === "1") {
      setValues(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(k => { if (p.get(k)) updated[k] = p.get(k)!; });
        return updated;
      });
    }
  }, []);

  if (!flow || !meta) return (
    <div className="px-4 py-12 text-center">
      <p className="text-[#64748B]">Action not available</p>
      <button onClick={() => onNavigate("/services")} className="mt-4 text-[#0066FF] text-sm">← Services</button>
    </div>
  );

  async function handleSubmit() {
    setSubmitting(true); setError("");
    try {
      const amt = parseFloat(values.amount || "0") || 0;
      const resp = action === "fund_transfer"
        ? await postTransfer(values.recipient || "", amt, values.reference || "")
        : await postPayment(action, amt, values);
      setResult({ message: resp.message, balance: resp.balance, warnings: (resp as unknown as Record<string, unknown>).warnings as string[] });
    } catch (e) { setError(e instanceof Error ? e.message : "Failed"); }
    setSubmitting(false);
  }

  if (result) return (
    <div className="px-4 py-8 max-w-lg mx-auto animate-fadeIn">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h2 className="text-xl font-bold text-[#1E293B]">{meta.icon} {result.message}</h2>
        {result.balance != null && <p className="text-sm text-[#64748B] mt-2">Balance: RM {result.balance.toFixed(2)}</p>}
      </div>
      {result.warnings && result.warnings.length > 0 && (
        <div className="space-y-2 mb-4">{result.warnings.map((w, i) => (
          <div key={i} className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700">
            <span>⚠️</span><span>{w}</span>
          </div>
        ))}</div>
      )}
      <div className="flex gap-3">
        <button onClick={() => onNavigate("/")} className="flex-1 bg-[#0066FF] text-white rounded-xl py-3 font-medium">Home</button>
        <button onClick={() => setResult(null)} className="flex-1 bg-white border border-[#E2E8F0] text-[#64748B] rounded-xl py-3 font-medium">Do Another</button>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <button onClick={() => onNavigate("/services")} className="text-sm text-[#0066FF] mb-4">← Back</button>
      <h1 className="text-xl font-bold text-[#1E293B] mb-1">{meta.icon} {meta.label}</h1>
      <p className="text-sm text-[#64748B] mb-6">Fill in the details below</p>
      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">{error}</div>}
      {new URLSearchParams(window.location.search).get("prefill") === "1" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-4 text-sm text-blue-700 flex items-center gap-2">
          <span>🤖</span> Pre-filled by FormBuddy — review and confirm
        </div>
      )}
      <div className="space-y-4">
        {formSteps.map(step => (
          <div key={step.field || step.label}>
            <label className="text-xs text-[#64748B] font-medium mb-1.5 block">{step.label}</label>
            {step.type === "select" && step.options ? (
              <select
                value={values[step.field || ""] || ""}
                onChange={e => setValues(p => ({ ...p, [step.field || ""]: e.target.value }))}
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#0066FF]"
              >
                <option value="">Select...</option>
                {step.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                type={step.label.toLowerCase().includes("amount") || step.label.toLowerCase().includes("(rm)") ? "number" : "text"}
                value={values[step.field || ""] || ""}
                onChange={e => setValues(p => ({ ...p, [step.field || ""]: e.target.value }))}
                placeholder={step.value || step.label}
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0066FF]"
              />
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} disabled={submitting} className="w-full mt-6 bg-[#0066FF] hover:bg-[#0052CC] disabled:opacity-50 text-white rounded-xl py-3.5 font-medium">
        {submitting ? "Processing..." : "Submit"}
      </button>
    </div>
  );
}
