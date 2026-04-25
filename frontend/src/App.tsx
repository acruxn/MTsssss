import { useEffect, useState } from "react";
import AppShell from "./components/AppShell";
import TNGHome from "./pages/TNGHome";
import Services from "./pages/Services";
import Agent from "./pages/Agent";

export default function App() {
  const [path, setPath] = useState(window.location.pathname + window.location.search);
  const [language, setLanguage] = useState(localStorage.getItem("formbuddy-lang") || "en");

  const navigate = (p: string) => {
    window.history.pushState({}, "", p);
    setPath(p);
  };

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname + window.location.search);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const basePath = path.split("?")[0];

  return (
    <AppShell currentPath={basePath} onNavigate={navigate} language={language} onLanguageChange={(l) => { setLanguage(l); localStorage.setItem("formbuddy-lang", l); }}>
      {basePath === "/" && <TNGHome onNavigate={navigate} />}
      {basePath === "/services" && <Services onNavigate={navigate} language={language} />}
      {basePath === "/agent" && <Agent onNavigate={navigate} language={language} />}
    </AppShell>
  );
}
