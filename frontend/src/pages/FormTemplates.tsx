import { useEffect, useState } from "react";
import { getTemplates, type FormTemplate } from "../lib/api";
import LanguageBadge from "../components/LanguageBadge";

const categoryIcons: Record<string, string> = {
  transfer: "💸",
  payment: "🧾",
  banking: "🏦",
  insurance: "🛡️",
  registration: "📝",
  reload: "📱",
};

export default function FormTemplates({ onNavigate, language }: { onNavigate: (path: string) => void; language: string }) {
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

  const categories = Object.keys(grouped).sort();

  return (
    <div className="px-4 py-6 sm:px-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Form Templates</h1>
          <p className="text-sm text-[#64748B] mt-1">Choose a form to fill by voice</p>
        </div>
        <span className="text-sm text-[#64748B] bg-white px-3 py-1.5 rounded-full border border-[#E2E8F0] shadow-sm">
          {filtered.length} of {templates.length} templates
        </span>
      </div>

      {filtered.length === 0 && templates.length > 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="text-4xl mb-3">🌐</div>
          <p className="text-[#1E293B] font-medium">No templates for this language</p>
          <p className="text-sm text-[#94A3B8] mt-1">Try switching language in the nav bar</p>
        </div>
      )}

      {filtered.length === 0 && templates.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-[#1E293B] font-medium">No templates yet</p>
          <p className="text-sm text-[#94A3B8] mt-1">Templates will appear once the backend is seeded</p>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          {categories.length > 1 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">{categoryIcons[cat] || "📄"}</span>
              <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wide">{cat}</h2>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grouped[cat].map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#0066FF]/30 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-[#1E293B]">{t.name}</h3>
                  <LanguageBadge language={t.language} />
                </div>
                <p className="text-[#64748B] text-sm mb-1 capitalize">{t.category}</p>
                <p className="text-xs text-[#94A3B8] mb-4 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t.fields.length} fields
                </p>
                <button
                  onClick={() => onNavigate(`/voice?template=${t.id}`)}
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                >
                  🎙️ Start Voice Fill
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
