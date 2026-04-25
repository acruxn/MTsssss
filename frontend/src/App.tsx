import { useState } from "react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FormTemplates from "./pages/FormTemplates";
import VoiceAssistant from "./pages/VoiceAssistant";

export default function App() {
  const [path, setPath] = useState(window.location.pathname + window.location.search);

  const navigate = (p: string) => {
    window.history.pushState({}, "", p);
    setPath(p);
  };

  const basePath = path.split("?")[0];

  return (
    <Layout currentPath={basePath} onNavigate={navigate}>
      {basePath === "/" && <Dashboard />}
      {basePath === "/templates" && <FormTemplates onNavigate={navigate} />}
      {basePath === "/voice" && <VoiceAssistant onNavigate={navigate} />}
    </Layout>
  );
}
