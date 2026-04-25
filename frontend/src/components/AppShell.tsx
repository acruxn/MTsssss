import { type ReactNode, useState } from "react";

const tabs = [
  { label: "Home", icon: "🏠", path: "/" },
  { label: "Services", icon: "📋", path: "/services" },
  { label: "Mic", icon: "mic", path: "/agent" },
  { label: "Scan", icon: "📷", path: "/agent?action=scan_pay" },
  { label: "Profile", icon: "👤", path: "" },
];

const languages = [
  { value: "en", label: "EN 🇬🇧" },
  { value: "ms", label: "BM 🇲🇾" },
  { value: "zh", label: "中文 🇨🇳" },
  { value: "ta", label: "தமிழ் 🇮🇳" },
];

export default function AppShell({
  children,
  currentPath,
  onNavigate,
  language,
  onLanguageChange,
}: {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
}) {
  const [langOpen, setLangOpen] = useState(false);
  const basePath = currentPath.split("?")[0];

  const statusBar = (
    <div className="flex items-center justify-between px-6 h-11 text-xs font-medium text-gray-500 select-none">
      <span>6:30 PM</span>
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="text-sm hover:text-[#0066FF] transition-colors"
            aria-label="Change language"
          >
            🌐
          </button>
          {langOpen && (
            <div className="absolute right-0 top-7 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[100px]">
              {languages.map((l) => (
                <button
                  key={l.value}
                  onClick={() => { onLanguageChange(l.value); setLangOpen(false); }}
                  className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-blue-50 ${language === l.value ? "text-[#0066FF] font-semibold" : "text-gray-700"}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );

  const tabBar = (
    <div className="bg-white border-t border-gray-200 flex items-center justify-around h-16 shrink-0">
      {tabs.map((t) => {
        const active = t.path && (basePath === t.path || (t.path !== "/" && basePath.startsWith(t.path)));
        if (t.icon === "mic") {
          return (
            <button
              key="mic"
              onClick={() => onNavigate("/agent")}
              className="relative -mt-6 w-14 h-14 rounded-full bg-[#0066FF] flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-[#0052CC] transition-colors"
              aria-label="Voice assistant"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </button>
          );
        }
        return (
          <button
            key={t.label}
            onClick={() => t.path && onNavigate(t.path)}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${active ? "text-[#0066FF]" : "text-gray-400"}`}
          >
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop: phone frame */}
      <div className="hidden min-[481px]:flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative w-[390px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col" style={{ height: "min(844px, 95vh)" }}>
          {statusBar}
          <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">{children}</main>
          {tabBar}
        </div>
      </div>

      {/* Mobile: full screen */}
      <div className="min-[481px]:hidden flex flex-col min-h-screen bg-[#F8FAFC]">
        <main className="flex-1 overflow-y-auto pb-16">{children}</main>
        <div className="fixed bottom-0 inset-x-0 z-50">{tabBar}</div>
      </div>
    </>
  );
}
