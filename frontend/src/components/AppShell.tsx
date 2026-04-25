import { type ReactNode, useState } from "react";

const tabs: { label: string; path: string; disabled?: boolean; icon: (active: boolean) => ReactNode }[] = [
  {
    label: "Home", path: "/",
    icon: (a) => <svg className="w-6 h-6" fill={a ? "#0066FF" : "#9CA3AF"} viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8z"/></svg>,
  },
  {
    label: "Wealth", path: "/services",
    icon: (a) => <svg className="w-6 h-6" fill={a ? "#0066FF" : "#9CA3AF"} viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>,
  },
  { label: "Scan", path: "/agent?action=scan_pay", icon: () => null },
  {
    label: "Deals", path: "", disabled: true,
    icon: () => <svg className="w-6 h-6" fill="#9CA3AF" viewBox="0 0 24 24"><path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7c0 .53.21 1.04.59 1.41l9 9a2 2 0 002.82 0l7-7a2 2 0 000-2.83zM6.5 8A1.5 1.5 0 118 6.5 1.5 1.5 0 016.5 8z"/></svg>,
  },
  {
    label: "Profile", path: "", disabled: true,
    icon: () => <svg className="w-6 h-6" fill="#9CA3AF" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z"/></svg>,
  },
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
    <div className="flex items-center justify-between px-5 h-11 bg-white border-b border-gray-100 select-none">
      <span className="text-sm font-bold text-[#0066FF] tracking-tight">TNG eWallet</span>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="text-sm text-gray-500 hover:text-[#0066FF] transition-colors"
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
        {/* Mock signal/wifi/battery */}
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2a12.73 12.73 0 0118 0l2-2A15.57 15.57 0 001 9zm8 8l3 3 3-3a4.24 4.24 0 00-6 0zm-4-4l2 2a8.49 8.49 0 0110 0l2-2A11.36 11.36 0 005 13z"/></svg>
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17 4h-3V2h-4v2H7v18h10V4zm-1 16H8V6h8v14z"/><rect x="9" y="8" width="6" height="10" opacity=".7"/></svg>
      </div>
    </div>
  );

  const formBuddyPill = (
    <button
      onClick={() => onNavigate("/agent")}
      className="absolute right-4 -top-12 z-40 flex items-center gap-1.5 bg-[#0066FF] text-white pl-3 pr-3.5 py-2 rounded-full shadow-lg shadow-blue-500/30 hover:bg-[#0052CC] transition-colors text-xs font-semibold"
      aria-label="Open FormBuddy voice assistant"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
      FormBuddy
    </button>
  );

  const tabBar = (
    <div className="relative bg-white border-t border-gray-200 shrink-0">
      {formBuddyPill}
      <div className="flex items-end justify-around h-16 px-1">
        {tabs.map((t) => {
          if (t.label === "Scan") {
            return (
              <button
                key="scan"
                onClick={() => onNavigate(t.path)}
                className="relative -mt-5 flex flex-col items-center"
                aria-label="Scan & Pay"
              >
                <div className="w-14 h-14 rounded-full bg-[#FFCC00] flex items-center justify-center shadow-lg shadow-yellow-400/40 hover:bg-[#FFD633] transition-colors active:scale-95">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7V5a2 2 0 012-2h2m10 0h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-gray-400 mt-0.5">Scan</span>
              </button>
            );
          }
          const active = !t.disabled && t.path && (basePath === t.path || (t.path !== "/" && basePath.startsWith(t.path)));
          return (
            <button
              key={t.label}
              onClick={() => !t.disabled && t.path && onNavigate(t.path)}
              className={`flex flex-col items-center gap-0.5 pt-2 pb-1 min-w-[48px] ${t.disabled ? "opacity-40 cursor-default" : "cursor-pointer"}`}
              aria-label={t.label}
              aria-disabled={t.disabled}
            >
              {t.icon(!!active)}
              <span className={`text-[10px] font-medium ${active ? "text-[#0066FF]" : "text-gray-400"}`}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: phone frame */}
      <div className="hidden min-[481px]:flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative w-[390px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col" style={{ height: "min(844px, 95vh)" }}>
          {statusBar}
          <main className="flex-1 overflow-y-auto bg-[#F5F5F5]">{children}</main>
          {tabBar}
        </div>
      </div>

      {/* Mobile: full screen */}
      <div className="min-[481px]:hidden flex flex-col min-h-screen bg-[#F5F5F5]">
        {statusBar}
        <main className="flex-1 overflow-y-auto pb-20">{children}</main>
        <div className="fixed bottom-0 inset-x-0 z-50">{tabBar}</div>
      </div>
    </>
  );
}
