import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getTemplates, type FormTemplate } from "../lib/api";
import LanguageBadge from "../components/LanguageBadge";

interface ServiceItem {
  icon: ReactNode;
  label: string;
  desc: string;
  action: string;
  soon?: boolean;
}

const I = ({ d, c = "#6B7280" }: { d: string; c?: string }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const CATEGORIES: { title: string; items: ServiceItem[] }[] = [
  { title: "Payments", items: [
    { icon: <I d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM17.5 14v7M14 17.5h7" c="#0066FF" />, label: "Scan & Pay", desc: "Scan QR to pay merchants", action: "scan_pay" },
    { icon: <I d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />, label: "Pay Bills", desc: "Utilities, telco, broadband", action: "bill_payment" },
    { icon: <I d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7" />, label: "Toll", desc: "Highway toll payments", action: "pay_toll" },
    { icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth={1.8}><rect x="3" y="3" width="18" height="18" rx="3" /><text x="12" y="16" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6B7280" stroke="none">P</text></svg>, label: "Parking", desc: "Street & mall parking", action: "pay_parking" },
  ]},
  { title: "Money", items: [
    { icon: <I d="M5 12h14 M13 6l6 6-6 6" c="#0066FF" />, label: "Transfer", desc: "Send money to anyone", action: "fund_transfer" },
    { icon: <I d="M19 12H5 M11 18l-6-6 6-6" />, label: "Request Money", desc: "Ask friends to pay you", action: "request_money", soon: true },
    { icon: <I d="M12 2v20 M2 12h20" />, label: "Split Bill", desc: "Divide expenses easily", action: "split_bill", soon: true },
  ]},
  { title: "Top-up", items: [
    { icon: <I d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z M12 18v2 M8 2h8" c="#0066FF" />, label: "Reload Phone", desc: "Prepaid credit top-up", action: "pin_reload" },
    { icon: <I d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01" />, label: "RFID Top-up", desc: "Reload your TNG RFID tag", action: "pay_toll" },
  ]},
  { title: "Financial Services", items: [
    { icon: <I d="M23 6l-9.5 9.5-5-5L1 18" c="#0066FF" />, label: "GO+ Savings", desc: "Earn daily returns", action: "invest" },
    { icon: <I d="M1 4h22v16H1z M1 10h22" />, label: "GOpinjam Loan", desc: "Quick personal financing", action: "apply_loan" },
    { icon: <I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, label: "Insurance", desc: "Travel & device protection", action: "buy_insurance" },
  ]},
  { title: "Lifestyle", items: [
    { icon: <I d="M7 2v11 M2 13l5-3 5 3 M17 2l5 3v6l-5 3-5-3V5l5-3z" />, label: "Movie Tickets", desc: "Book cinema seats", action: "buy_ticket" },
    { icon: <I d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7z M16 6v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />, label: "Food Delivery", desc: "Order meals nearby", action: "food_delivery" },
    { icon: <I d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" c="#EF4444" />, label: "Donations", desc: "Give to verified NGOs", action: "donate" },
  ]},
  { title: "Transport", items: [
    { icon: <img src="/tng/ic_fuel.svg" alt="" className="w-5 h-5" />, label: "Fuel Payment", desc: "Pay at the pump", action: "fuel_payment" },
    { icon: <I d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7" />, label: "Bus & Train", desc: "Book tickets instantly", action: "buy_ticket", soon: true },
  ]},
];

const categoryIcons: Record<string, ReactNode> = {
  transfer: <I d="M5 12h14 M13 6l6 6-6 6" c="#0066FF" />,
  payment: <I d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6" />,
  banking: <I d="M3 21h18 M3 10h18 M5 6l7-3 7 3 M4 10v11 M20 10v11 M8 14v3 M12 14v3 M16 14v3" />,
  insurance: <I d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  registration: <I d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" />,
  reload: <I d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" c="#0066FF" />,
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
                onClick={() => {
                  if (item.soon) return;
                  const direct: Record<string, string> = { fund_transfer: "/transfer", fuel_payment: "/fuel", pin_reload: "/reload", check_balance: "/balance", bill_payment: "/bill", scan_pay: "/scan", apply_loan: "/loan" };
                  onNavigate(direct[item.action] || `/task?action=${item.action}`);
                }}
                disabled={item.soon}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors enabled:active:bg-[#F8FAFC] disabled:opacity-50"
              >
                <div className="w-8 flex items-center justify-center shrink-0">{item.icon}</div>
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
            <span className="w-4 h-4 shrink-0">{categoryIcons[cat] || <I d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6" />}</span>
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
