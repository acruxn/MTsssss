import { useEffect, useState } from "react";
import { getTemplates, type FormTemplate } from "../lib/api";
import LanguageBadge from "../components/LanguageBadge";

const QUICK_ACTIONS = [
  { icon: "💸", label: "Send Money", desc: "Transfer to anyone instantly", action: "fund_transfer" },
  { icon: "🧾", label: "Pay Bills", desc: "Utilities, telco, and more", action: "bill_payment" },
  { icon: "📷", label: "Scan & Pay", desc: "Scan QR to pay merchants", action: "scan_pay" },
  { icon: "📱", label: "Reload", desc: "Top up prepaid credit", action: "pin_reload" },
  { icon: "⛽", label: "Fuel", desc: "Pay at the pump", action: "fuel_payment" },
  { icon: "💰", label: "Balance", desc: "Check your wallet", action: "check_balance" },
];

const categoryIcons: Record<string, string> = {
  transfer: "💸", payment: "🧾", banking: "🏦", insurance: "🛡️", registration: "📝", reload: "📱",
};

export default function Services({ onNavigate, language }: { onNavigate: (path: string) => void; language: string }) {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);

  useEffect(() => {
    getTemplates().then(setTemplates).catch(() => {});
  }, []);

  const filtered = language && language !== "all"
    ? templates.filter(t => t.language === language)
    : templates;

  const grouped = filtered.reduce<Record<string, FormTemplate[]>>((acc, t) => {
    const cat = t.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="px-4 py-6">
      <h1 className="text-lg font-bold text-[#1E293B] mb-1">What can I help with?</h1>
      <p className="text-xs text-[#64748B] mb-4">Tap an action or speak to the assistant</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.action}
            onClick={() => onNavigate(`/agent?action=${a.action}`)}
            className="bg-white border border-[#E2E8F0] rounded-xl p-4 text-left hover:shadow-md hover:border-[#0066FF]/30 transition-all"
          >
            <span className="text-2xl">{a.icon}</span>
            <p className="font-semibold text-sm text-[#1E293B] mt-2">{a.label}</p>
            <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-tight">{a.desc}</p>
            <p className="text-[10px] text-[#0066FF] font-medium mt-2">Try it →</p>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold text-[#1E293B] mb-1">Need to fill a form?</h2>
      <p className="text-xs text-[#64748B] mb-4">{filtered.length} templates available</p>

      {Object.keys(grouped).sort().map((cat) => (
        <div key={cat} className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">{categoryIcons[cat] || "📄"}</span>
            <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wide">{cat}</span>
            <div className="flex-1 h-px bg-[#E2E8F0]" />
          </div>
          <div className="space-y-2">
            {grouped[cat].map((t) => (
              <button
                key={t.id}
                onClick={() => onNavigate(`/agent?template=${t.id}`)}
                className="w-full bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-3 hover:shadow-md hover:border-[#0066FF]/30 transition-all text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#1E293B] truncate">{t.name}</p>
                  <p className="text-[10px] text-[#94A3B8]">{t.fields.length} fields</p>
                </div>
                <LanguageBadge language={t.language} />
                <span className="text-[#0066FF] text-sm">→</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
