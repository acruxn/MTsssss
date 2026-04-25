const langColors: Record<string, string> = {
  en: "text-blue-400 bg-blue-950",
  ms: "text-green-400 bg-green-950",
  zh: "text-yellow-400 bg-yellow-950",
  ta: "text-purple-400 bg-purple-950",
};

const langLabels: Record<string, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  zh: "中文",
  ta: "தமிழ்",
};

export default function LanguageBadge({ language }: { language: string }) {
  const color = langColors[language] || "text-gray-400 bg-gray-800";
  const label = langLabels[language] || language;

  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
