import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Templates", href: "/templates", icon: "📋" },
  { label: "Voice", href: "/voice", icon: "🎤" },
];

const languages = [
  { value: "all", label: "All", flag: "🌐" },
  { value: "en", label: "EN", flag: "🇬🇧" },
  { value: "ms", label: "BM", flag: "🇲🇾" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "ta", label: "தமிழ்", flag: "🇮🇳" },
];

export default function Layout({
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
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B]">
      <nav className="bg-[#0066FF] sticky top-0 z-50 shadow-lg shadow-blue-900/20">
        <div className="px-4 sm:px-6 py-2.5 flex items-center gap-1 sm:gap-4">
          {/* Brand */}
          <button
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 mr-2 sm:mr-4 shrink-0"
          >
            <span className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-base shadow-sm">
              🎙️
            </span>
            <span className="text-white font-bold text-base hidden sm:inline tracking-tight">
              FormBuddy
            </span>
          </button>

          {/* Nav links */}
          {navItems.map((item) => {
            const active = currentPath === item.href || currentPath.startsWith(item.href + "?");
            return (
              <button
                key={item.href}
                onClick={() => onNavigate(item.href)}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/20 text-white"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="sm:hidden">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}

          {/* Language selector */}
          <div className="ml-auto relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="appearance-none bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-lg pl-3 pr-7 py-1.5 text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 transition-colors"
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value} className="text-gray-900 bg-white">
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/70 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </nav>

      <main>{children}</main>
    </div>
  );
}
