const langColors: Record<string, string> = {
  en: "text-[#0066FF] bg-blue-50 border-blue-200",
  ms: "text-emerald-700 bg-emerald-50 border-emerald-200",
  zh: "text-amber-700 bg-amber-50 border-amber-200",
  ta: "text-purple-700 bg-purple-50 border-purple-200",
};

const langLabels: Record<string, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  zh: "中文",
  ta: "தமிழ்",
};

export default function LanguageBadge({ language }: { language: string }) {
  const color = langColors[language] || "text-gray-600 bg-gray-50 border-gray-200";
  const label = langLabels[language] || language;

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
}
