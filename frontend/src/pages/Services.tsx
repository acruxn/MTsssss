import { useEffect, useState } from "react";
import { getTemplates, type FormTemplate } from "../lib/api";
import LanguageBadge from "../components/LanguageBadge";

interface ServiceItem {
  icon: string;
  label: string;
  desc: string;
  action: string;
  soon?: boolean;
}

const CATEGORIES: { title: string; items: ServiceItem[] }[] = [
  { title: "Payments", items: [
    { icon: "📷", label: "Scan & Pay", desc: "Scan QR to pay merchants", action: "scan_pay" },
    { icon: "🧾", label: "Pay Bills", desc: "Utilities, telco, broadband", action: "bill_payment" },
    { icon: "🛣️", label: "Toll", desc: "Highway toll payments", action: "pay_toll" },
    { icon: "🅿️", label: "Parking", desc: "Street & mall parking", action: "pay_parking" },
  ]},
  { title: "Money", items: [
    { icon: "💸", label: "Transfer", desc: "Send money to anyone", action: "fund_transfer" },
    { icon: "📥", label: "Request Money", desc: "Ask friends to pay you", action: "request_money", soon: true },
    { icon: "➗", label: "Split Bill", desc: "Divide expenses easily", action: "split_bill", soon: true },
  ]},
  { title: "Top-up", items: [
    { icon: "📱", label: "Reload Phone", desc: "Prepaid credit top-up", action: "pin_reload" },
    { icon: "🏷️", label: "RFID Top-up", desc: "Reload your TNG RFID tag", action: "pay_toll" },
  ]},
  { title: "Financial Services", items: [
    { icon: "📈", label: "GO+ Savings", desc: "Earn daily returns", action: "invest" },
    { icon: "💳", label: "GOpinjam Loan", desc: "Quick personal financing", action: "apply_loan" },
    { icon: "🛡️", label: "Insurance", desc: "Travel & device protection", action: "buy_insurance" },
  ]},
  { title: "Lifestyle", items: [
    { icon: "🎬", label: "Movie Tickets", desc: "Book cinema seats", action: "buy_ticket" },
    { icon: "🍔", label: "Food Delivery", desc: "Order meals nearby", action: "food_delivery" },
    { icon: "❤️", label: "Donations", desc: "Give to verified NGOs", action: "donate" },
  ]},
  { title: "Transport", items: [
    { icon: "⛽", label: "Fuel Payment", desc: "Pay at the pump", action: "fuel_payment" },
    { icon: "🚆", label: "Bus & Train", desc: "Book tickets instantly", action: "buy_ticket", soon: true },
  ]},
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
      <h1 className="text-lg font-bold text-[#1E293B] mb-1">All Services</h1>
      <p className="text-xs text-[#64748B] mb-5">Tap any service or speak to the assistant</p>

      {CATEGORIES.map((cat) => (
        <div key={cat.title} className="mb-5">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{cat.title}</p>
          <div className="bg-white rounded-2xl border border-[#E2E8F0] divide-y divide-[#F1F5F9] overflow-hidden">
            {cat.items.map((item) => (
              <button
                key={item.action}
                onClick={() => !item.soon && onNavigate(`/agent?action=${item.action}`)}
                disabled={item.soon}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors enabled:active:bg-[#F8FAFC] disabled:opacity-50"
              >
                <span className="text-xl w-8 text-center shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1E293B]">{item.label}</p>
                  <p className="text-[11px] text-[#94A3B8] leading-tight">{item.desc}</p>
                </div>
                {item.soon ? (
                  <span className="text-[10px] font-medium text-[#94A3B8] bg-[#F1F5F9] rounded-full px-2 py-0.5 shrink-0">Coming Soon</span>
                ) : (
                  <span className="text-[#0066FF] text-sm shrink-0">›</span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Form Templates from API */}
      <h2 className="text-lg font-bold text-[#1E293B] mt-8 mb-1">Need to fill a form?</h2>
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
