import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FormTemplates from "./pages/FormTemplates";
import VoiceAssistant from "./pages/VoiceAssistant";

export default function App() {
  const [path, setPath] = useState(window.location.pathname + window.location.search);
  const [language, setLanguage] = useState(localStorage.getItem("formbuddy-lang") || "en");

  const navigate = (p: string) => {
    window.history.pushState({}, "", p);
    setPath(p);
  };

  const basePath = path.split("?")[0];

  return (
    <Layout currentPath={basePath} onNavigate={navigate} language={language} onLanguageChange={(l: string) => { setLanguage(l); localStorage.setItem("formbuddy-lang", l); }}>
      {basePath === "/" && <Dashboard />}
      {basePath === "/templates" && <FormTemplates onNavigate={navigate} />}
      {basePath === "/voice" && <VoiceAssistant onNavigate={navigate} language={language} />}
    </Layout>
  );
}
