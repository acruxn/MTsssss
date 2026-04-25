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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Form Templates</h1>
        <p className="text-sm text-gray-400">
          Showing {filtered.length} of {templates.length} templates
        </p>
      </div>
      {filtered.length === 0 && templates.length > 0 && (
        <p className="text-gray-500 text-center py-8">No templates for this language. Try &quot;All Languages&quot; or switch language in the nav bar.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{t.name}</h3>
              <LanguageBadge language={t.language} />
            </div>
            <p className="text-gray-400 text-sm mb-4">{t.category}</p>
            <p className="text-xs text-gray-500 mb-4">{t.fields.length} fields</p>
            <button
              onClick={() => onNavigate(`/voice?template=${t.id}`)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              Start Voice Fill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
