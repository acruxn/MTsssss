import { useEffect, useRef, useState } from "react";
import {
  getTemplate,
  createSession,
  extractFields,
  completeSession,
  type FormTemplate,
  type VoiceSession,
  type ExtractedFields,
} from "../lib/api";

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
}

type Phase = "idle" | "listening" | "extracting" | "confirm" | "done";

const LANG_MAP: Record<string, string> = {
  en: "en-US",
  ms: "ms-MY",
  zh: "zh-CN",
  ta: "ta-IN",
};

export default function VoiceAssistant({ onNavigate, language = "en" }: { onNavigate: (path: string) => void; language?: string }) {
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [session, setSession] = useState<VoiceSession | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [transcript, setTranscript] = useState("");
  const [extracted, setExtracted] = useState<Record<string, string | null>>({});
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState("");
  const recognitionRef = useRef<ReturnType<typeof Object> | null>(null);
  const listeningRef = useRef(false);

  const templateId = new URLSearchParams(window.location.search).get("template") || "";

  useEffect(() => {
    if (templateId) getTemplate(templateId).then(setTemplate).catch(() => {});
  }, [templateId]);

  function startRecognition() {
    const SR =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) {
      alert("Speech Recognition not supported in this browser");
      return;
    }
    const recognition = new (SR as new () => Record<string, unknown>)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = LANG_MAP[language || template?.language || "en"] || "en-US";

    let finalTranscript = "";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const text = e.results[i][0].transcript;
        if ((e.results[i] as unknown as { isFinal: boolean }).isFinal) {
          finalTranscript += text + " ";
        } else {
          interim += text;
        }
      }
      setTranscript(finalTranscript + interim);
    };
    recognition.onend = () => {
      if (listeningRef.current) {
        (recognition as unknown as { start: () => void }).start();
      }
    };
    (recognition as unknown as { start: () => void }).start();
    recognitionRef.current = recognition;
    listeningRef.current = true;
  }

  function stopRecognition() {
    listeningRef.current = false;
    if (recognitionRef.current && typeof (recognitionRef.current as Record<string, unknown>).stop === "function") {
      (recognitionRef.current as unknown as { stop: () => void }).stop();
    }
    recognitionRef.current = null;
  }

  function handleStartListening() {
    setError("");
    setPhase("listening");
    startRecognition();
  }

  function handleCancel() {
    stopRecognition();
    setTranscript("");
    setPhase("idle");
  }

  async function handleDoneSpeaking() {
    stopRecognition();
    const text = transcript.trim();
    if (!text || !template) return;

    setPhase("extracting");
    setError("");

    try {
      let sess = session;
      if (!sess) {
        sess = await createSession(template.id, language || template.language);
        setSession(sess);
      }
      const result: ExtractedFields = await extractFields(sess.id, text, language || template.language);
      setExtracted((prev) => {
        const merged = { ...prev };
        for (const [k, v] of Object.entries(result.fields)) {
          if (v !== null && v !== "") merged[k] = v;
          else if (!(k in merged)) merged[k] = v;
        }
        return merged;
      });
      setConfidence(result.confidence);
      setPhase("confirm");
    } catch {
      setError("Failed to extract fields. Please try again.");
      setPhase("listening");
      startRecognition();
    }
  }

  function handleSpeakAgain() {
    setTranscript("");
    setError("");
    setPhase("listening");
    startRecognition();
  }

  async function handleSubmit() {
    if (session) await completeSession(session.id).catch(() => {});
    setPhase("done");
  }

  function handleReset() {
    setPhase("idle");
    setSession(null);
    setTranscript("");
    setExtracted({});
    setConfidence(0);
    setError("");
  }

  if (!templateId) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 mb-4">No template selected.</p>
        <button onClick={() => onNavigate("/templates")} className="text-blue-400 hover:underline">
          Browse Templates
        </button>
      </div>
    );
  }

  const MicIcon = (
    <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );

  const FieldList = () => (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Fields needed</p>
      <div className="flex flex-wrap gap-2">
        {template?.fields.map((f) => (
          <span key={f.name} className="inline-flex items-center gap-1 bg-gray-800 rounded-lg px-3 py-1.5 text-sm">
            {f.label}
            {f.required && <span className="text-red-400 text-xs">*</span>}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🎙️ Voice Assistant</h1>
      {template && <p className="text-gray-400 mb-6">Filling: {template.name}</p>}

      {error && (
        <div className="bg-red-900/40 border border-red-800 rounded-lg p-3 mb-4 text-sm text-red-300">{error}</div>
      )}

      {/* IDLE */}
      {phase === "idle" && (
        <div className="space-y-6">
          <FieldList />
          <div className="flex flex-col items-center gap-4 py-8">
            <button
              onClick={handleStartListening}
              className="w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg shadow-blue-600/30"
            >
              {MicIcon}
            </button>
            <p className="text-gray-400 text-sm">Tap to start — tell us everything</p>
          </div>
        </div>
      )}

      {/* LISTENING */}
      {phase === "listening" && (
        <div className="space-y-6">
          <FieldList />
          <div className="flex items-center justify-center gap-1 h-16">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-blue-500 animate-pulse"
                style={{ height: `${20 + Math.random() * 40}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 min-h-[80px]">
            <p className="text-xs text-gray-500 mb-1">Live Transcription</p>
            <p className="text-lg">{transcript || <span className="text-gray-600">Listening...</span>}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDoneSpeaking}
              disabled={!transcript.trim()}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white rounded-lg py-3 font-medium transition-colors"
            >
              ✓ Done Speaking
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-700 hover:bg-red-600 text-white rounded-lg py-3 px-6 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* EXTRACTING */}
      {phase === "extracting" && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Extracting fields with AI...</p>
        </div>
      )}

      {/* CONFIRM */}
      {phase === "confirm" && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">📋 Extracted Fields</h2>
              {confidence > 0 && (
                <span className="text-xs bg-gray-800 rounded-full px-3 py-1 text-gray-400">
                  {Math.round(confidence * 100)}% confidence
                </span>
              )}
            </div>
            <div className="space-y-3">
              {template?.fields.map((f) => {
                const val = extracted[f.name];
                const missing = f.required && (!val || val === "");
                return (
                  <div
                    key={f.name}
                    className={`flex justify-between items-center border-b pb-2 ${missing ? "border-red-800" : "border-gray-800"}`}
                  >
                    <span className="text-sm">
                      <span className="text-gray-400">{f.label}</span>
                      {f.required && <span className="text-red-400 ml-1">*</span>}
                    </span>
                    <span className={`font-medium ${missing ? "text-yellow-400" : ""}`}>
                      {val || <span className="text-gray-600">—</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg py-3 font-medium transition-colors"
            >
              ✓ Submit
            </button>
            <button
              onClick={handleSpeakAgain}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-3 font-medium transition-colors"
            >
              🎙️ Speak Again
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 px-4 font-medium transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* DONE */}
      {phase === "done" && (
        <div className="text-center py-12 space-y-4">
          <p className="text-5xl">✅</p>
          <p className="text-xl font-semibold">Form submitted successfully!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleReset} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-6 transition-colors">
              Fill Another
            </button>
            <button onClick={() => onNavigate("/")} className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 px-6 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
