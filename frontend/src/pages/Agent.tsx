export default function Agent({ onNavigate, language }: { onNavigate: (path: string) => void; language?: string }) {
  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");
  const template = params.get("template");

  return (
    <div className="px-4 py-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-full bg-[#0066FF] flex items-center justify-center mb-6 mic-pulse">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
      </div>
      <h1 className="text-xl font-bold text-[#1E293B] mb-2">
        {action ? `${action.replace(/_/g, " ")}` : template ? "Voice Form Fill" : "What would you like to do?"}
      </h1>
      <p className="text-sm text-[#64748B] mb-6">Speak naturally — I&apos;ll help you get it done</p>
      <button
        onClick={() => onNavigate("/")}
        className="text-sm text-[#0066FF] hover:underline"
      >
        ← Back to home
      </button>
      {language && <span className="hidden">{language}</span>}
    </div>
  );
}
