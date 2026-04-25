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
}: {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
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
        <span className="ml-auto text-xs text-gray-500">Voice Form Assistant</span>
      </nav>
      <main>{children}</main>
    </div>
  );
}
