import { useEffect, useState } from "react";
import { getTemplates, type FormTemplate } from "../lib/api";
import LanguageBadge from "../components/LanguageBadge";

export default function FormTemplates({ onNavigate, language }: { onNavigate: (path: string) => void; language: string }) {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);

  useEffect(() => {
    getTemplates().then(setTemplates).catch(() => {});
  }, []);

  const filtered = language && language !== "all"
    ? templates.filter(t => t.language === language)
    : templates;

  return (
    <div className="px-4 py-6 sm:px-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">Form Templates</h1>
          <p className="text-sm text-[#64748B] mt-1">Choose a form to fill by voice</p>
        </div>
        <span className="text-sm text-[#64748B] bg-white px-3 py-1 rounded-full border border-[#E2E8F0]">
          {filtered.length} of {templates.length} templates
        </span>
      </div>
      {filtered.length === 0 && templates.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-[#E2E8F0]">
          <p className="text-[#64748B]">No templates for this language.</p>
          <p className="text-sm text-[#94A3B8] mt-1">Try switching language in the nav bar.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover-lift hover:border-[#0066FF]/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg text-[#1E293B]">{t.name}</h3>
              <LanguageBadge language={t.language} />
            </div>
            <p className="text-[#64748B] text-sm mb-1 capitalize">{t.category}</p>
            <p className="text-xs text-[#94A3B8] mb-4">{t.fields.length} fields</p>
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
  );
}
