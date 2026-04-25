import { useEffect, useState } from "react";
import { getTemplates, type FormTemplate } from "../lib/api";
import LanguageBadge from "../components/LanguageBadge";

export default function FormTemplates({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [templates, setTemplates] = useState<FormTemplate[]>([]);

  useEffect(() => {
    getTemplates().then(setTemplates).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Form Templates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
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
