import { type ReactNode, useState } from "react";

/* ── Tab SVG Icons (matching TNG's outlined style) ── */
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill={active ? "#0066FF" : "none"} stroke={active ? "#0066FF" : "#9CA3AF"} strokeWidth={active ? 0 : 1.8}>
    {active
      ? <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-4v-6h-4v6H5a1 1 0 01-1-1V10.5z" />
      : <><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V10.5z" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 21V14h6v7" strokeLinecap="round" strokeLinejoin="round" /></>
    }
  </svg>
);

const EShopIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={active ? "#0066FF" : "#9CA3AF"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);

const GOfinanceIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={active ? "#0066FF" : "#9CA3AF"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-4a2 2 0 000 4h2a2 2 0 010 4H8" />
    <line x1="12" y1="6" x2="12" y2="8" />
    <line x1="12" y1="16" x2="12" y2="18" />
  </svg>
);

const NearMeIcon = ({ active }: { active: boolean }) => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={active ? "#0066FF" : "#9CA3AF"} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/* ── Scan center icon (overlapping cards, matching reference) ── */
const ScanIcon = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="14" height="12" rx="2" />
    <rect x="8" y="8" width="14" height="12" rx="2" />
  </svg>
);

const TABS: readonly { label: string; path: string; disabled?: boolean }[] = [
  { label: "Home", path: "/" },
  { label: "eShop", path: "/eshop" },
  { label: "Scan", path: "/scan" },
  { label: "GOfinance", path: "/gofinance" },
  { label: "Near Me", path: "", disabled: true },
];

const languages = [
  { value: "en", label: "EN 🇬🇧" },
  { value: "ms", label: "BM 🇲🇾" },
  { value: "zh", label: "中文 🇨🇳" },
  { value: "ta", label: "தமிழ் 🇮🇳" },
];

function TabIcon({ label, active }: { label: string; active: boolean }) {
  switch (label) {
    case "Home": return <HomeIcon active={active} />;
    case "eShop": return <EShopIcon active={active} />;
    case "GOfinance": return <GOfinanceIcon active={active} />;
    case "Near Me": return <NearMeIcon active={active} />;
    default: return null;
  }
}

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
        {TABS.map((t) => {
          if (t.label === "Scan") {
            return (
              <button
                key="scan"
                onClick={() => onNavigate(t.path)}
                className="relative -mt-5 flex flex-col items-center"
                aria-label="Scan & Pay"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#0066FF] flex items-center justify-center shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
                  <ScanIcon />
                </div>
                <span className="text-[10px] font-medium text-[#0066FF] mt-0.5">Scan</span>
              </button>
            );
          }
          const active = !t.disabled && t.path !== "" && (basePath === t.path || (t.path !== "/" && basePath.startsWith(t.path)));
          return (
            <button
              key={t.label}
              onClick={() => !t.disabled && t.path && onNavigate(t.path)}
              className={`flex flex-col items-center gap-0.5 pt-2 pb-1 min-w-[48px] ${t.disabled ? "opacity-40 cursor-default" : "cursor-pointer"}`}
              aria-label={t.label}
              aria-disabled={t.disabled}
            >
              <TabIcon label={t.label} active={!!active} />
              <span className={`text-[10px] font-medium ${active ? "text-[#0066FF]" : "text-[#9CA3AF]"}`}>{t.label}</span>
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
