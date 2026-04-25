import type { ReactNode } from "react";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Templates", href: "/templates" },
  { label: "Voice Assistant", href: "/voice" },
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
      <nav className="bg-[#0066FF] px-6 py-3 flex items-center gap-6 sticky top-0 z-50 shadow-md">
        <button onClick={() => onNavigate("/")} className="text-lg font-bold text-white">
          🎙️ FormBuddy
        </button>
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className={`text-sm transition-colors ${
              currentPath === item.href || currentPath.startsWith(item.href + "?")
                ? "text-white font-semibold"
                : "text-blue-100 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="ml-auto bg-white/20 text-white border border-white/30 rounded-lg px-2 py-1 text-sm backdrop-blur-sm"
        >
          <option value="all" className="text-gray-900">🌐 All Languages</option>
          <option value="en" className="text-gray-900">🇬🇧 English</option>
          <option value="ms" className="text-gray-900">🇲🇾 Bahasa Melayu</option>
          <option value="zh" className="text-gray-900">🇨🇳 中文</option>
          <option value="ta" className="text-gray-900">🇮🇳 தமிழ்</option>
        </select>
      </nav>
      <main>{children}</main>
    </div>
  );
}
