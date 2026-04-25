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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center gap-6 sticky top-0 z-50">
        <button onClick={() => onNavigate("/")} className="text-lg font-bold text-blue-400">
          🎙️ FormBuddy
        </button>
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            className={`text-sm ${
              currentPath === item.href || currentPath.startsWith(item.href + "?")
                ? "text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="ml-auto bg-gray-800 text-white border border-gray-700 rounded-lg px-2 py-1 text-sm"
        >
          <option value="all">🌐 All Languages</option>
          <option value="en">🇬🇧 English</option>
          <option value="ms">🇲🇾 Bahasa Melayu</option>
          <option value="zh">🇨🇳 中文</option>
          <option value="ta">🇮🇳 தமிழ்</option>
        </select>
        <span className="ml-2 text-xs text-gray-500">Voice Form Assistant</span>
      </nav>
      <main>{children}</main>
    </div>
  );
}
