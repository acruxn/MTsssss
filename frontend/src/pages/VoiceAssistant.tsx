import { useEffect, useRef, useState } from "react";
import {
  getTemplate,
  createSession,
  extractFields,
  completeSession,
  detectIntent,
  type FormTemplate,
  type VoiceSession,
  type ExtractedFields,
} from "../lib/api";
import { speak, stopSpeaking } from "../lib/speech";

const fadeInStyle = `@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`;

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
}

type Phase = "idle" | "listening" | "extracting" | "confirm" | "done" | "home-listening" | "home-extracting";

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
  const [matchedName, setMatchedName] = useState("");
  const recognitionRef = useRef<ReturnType<typeof Object> | null>(null);
  const listeningRef = useRef(false);

  const templateId = new URLSearchParams(window.location.search).get("template") || "";

  useEffect(() => {
    if (templateId) getTemplate(templateId).then(setTemplate).catch(() => {});
  }, [templateId]);

  useEffect(() => {
    if (template && phase === "idle") {
      const fieldNames = template.fields.map(f => f.label).join(", ");
      speak(`Please tell me your ${fieldNames}`, language || "en");
    }
    return () => stopSpeaking();
  }, [template, phase]);

  useEffect(() => {
    if (phase === "confirm" && template) {
      const readback = template.fields
        .filter(f => extracted[f.name])
        .map(f => `${f.label}: ${extracted[f.name]}`)
        .join(". ");
      if (readback) speak(readback, language || "en");
    }
    return () => stopSpeaking();
  }, [phase]);

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
    stopSpeaking();
    setError("");
    setPhase("listening");
    startRecognition();
  }

  function handleCancel() {
    stopSpeaking();
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
    stopSpeaking();
    setPhase("idle");
    setSession(null);
    setTranscript("");
    setExtracted({});
    setConfidence(0);
    setError("");
    setMatchedName("");
    if (!templateId) setTemplate(null);
  }

  function handleHomeStart() {
    setError("");
    setPhase("home-listening");
    startRecognition();
  }

  function handleHomeCancel() {
    stopSpeaking();
    stopRecognition();
    setTranscript("");
    setPhase("idle");
  }

  async function handleHomeDone() {
    stopRecognition();
    const text = transcript.trim();
    if (!text) return;

    setPhase("home-extracting");
    setError("");

    try {
      const result = await detectIntent(text, language);
      if (result.template_id) {
        const tmpl = await getTemplate(result.template_id);
        setTemplate(tmpl);
        setMatchedName(result.template_name);
        const fields: Record<string, string | null> = {};
        for (const [k, v] of Object.entries(result.fields)) {
          fields[k] = v != null ? String(v) : null;
        }
        setExtracted(fields);
        setConfidence(result.confidence);
        setPhase("confirm");
      } else {
        setError("Couldn't identify a form. Try being more specific.");
        setPhase("home-listening");
        startRecognition();
      }
    } catch {
      setError("Detection failed. Please try again.");
      setPhase("home-listening");
      startRecognition();
    }
  }

  const MicIcon = (
    <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );

  const FieldList = () => (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4">
      <p className="text-xs text-[#94A3B8] mb-3 uppercase tracking-wide">Fields needed</p>
      <div className="flex flex-wrap gap-2">
        {template?.fields.map((f) => (
          <span key={f.name} className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-sm">
            {f.label}
            {f.required && <span className="text-red-400 text-xs">*</span>}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-[#1E293B]">🎙️ Voice Assistant</h1>
      {template && <p className="text-[#64748B] mb-6">Filling: {template.name}</p>}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">{error}</div>
      )}

      <style>{fadeInStyle}</style>

      {/* HOME FLOW — no template pre-selected */}
      {!templateId && phase === "idle" && (
        <div style={{ animation: "fadeIn 0.3s ease-in" }}>
          <div className="flex flex-col items-center gap-4 py-12">
            <h2 className="text-xl font-semibold text-center">🎙️ What would you like to do?</h2>
            <p className="text-[#64748B] text-sm text-center">Speak naturally — I'll find the right form for you</p>
            <button
              onClick={handleHomeStart}
              className="mic-pulse w-32 h-32 rounded-full bg-[#0066FF] hover:bg-[#0052CC] transition-all flex items-center justify-center shadow-lg shadow-[#0066FF]/30 mt-4"
            >
              {MicIcon}
            </button>
            <p className="text-xs text-[#94A3B8] mt-2">Or <button onClick={() => onNavigate("/templates")} className="text-blue-400 hover:underline">browse templates</button></p>
          </div>
        </div>
      )}

      {!templateId && phase === "home-listening" && (
        <div style={{ animation: "fadeIn 0.3s ease-in" }}>
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-1 h-16">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 rounded-full bg-[#0066FF] animate-pulse" style={{ height: `${20 + Math.random() * 40}px`, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 min-h-[80px]">
              <p className="text-xs text-[#94A3B8] mb-1">Live Transcription</p>
              <p className="text-lg">{transcript || <span className="text-[#94A3B8]">Listening...</span>}</p>
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Or type here instead..."
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                    setTranscript((e.target as HTMLInputElement).value.trim());
                  }
                }}
              />
              <p className="text-xs text-[#94A3B8] mt-1">Press Enter to set transcript</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleHomeDone} disabled={!transcript.trim()} className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg py-3 font-medium transition-colors">✓ Done Speaking</button>
              <button onClick={handleHomeCancel} className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 px-6 font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {!templateId && phase === "home-extracting" && (
        <div style={{ animation: "fadeIn 0.3s ease-in" }}>
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#64748B]">Detecting intent & extracting fields...</p>
          </div>
        </div>
      )}

      {/* TEMPLATE FLOW — idle */}
      {templateId && phase === "idle" && (
        <div className="animate-fadeIn" style={{ animation: "fadeIn 0.3s ease-in" }}>
        <div className="space-y-6">
          <FieldList />
          <div className="flex flex-col items-center gap-4 py-8">
            <button
              onClick={handleStartListening}
              className="mic-pulse w-32 h-32 rounded-full bg-[#0066FF] hover:bg-[#0052CC] transition-all flex items-center justify-center shadow-lg shadow-[#0066FF]/30"
            >
              {MicIcon}
            </button>
            <p className="text-[#64748B] text-sm">Tap to start — tell us everything</p>
            <p className="text-xs text-[#94A3B8]">Keyboard fallback available while listening</p>
          </div>
        </div>
        </div>
      )}

      {/* LISTENING */}
      {templateId && phase === "listening" && (
        <div className="animate-fadeIn" style={{ animation: "fadeIn 0.3s ease-in" }}>
        <div className="space-y-6">
          <FieldList />
          <div className="flex items-center justify-center gap-1 h-12 sm:h-16">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-[#0066FF] animate-pulse"
                style={{ height: `${20 + Math.random() * 40}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 min-h-[80px]">
            <p className="text-xs text-[#94A3B8] mb-1">Live Transcription</p>
            <p className="text-lg">{transcript || <span className="text-[#94A3B8]">Listening...</span>}</p>
          </div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Or type here instead..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  setTranscript((e.target as HTMLInputElement).value.trim());
                }
              }}
            />
            <p className="text-xs text-[#94A3B8] mt-1">Press Enter to set transcript</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDoneSpeaking}
              disabled={!transcript.trim()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg py-3 font-medium transition-colors"
            >
              ✓ Done Speaking
            </button>
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 px-6 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
        </div>
      )}

      {/* EXTRACTING */}
      {templateId && phase === "extracting" && (
        <div className="animate-fadeIn" style={{ animation: "fadeIn 0.3s ease-in" }}>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#64748B]">Extracting fields with AI...</p>
        </div>
        </div>
      )}

      {/* CONFIRM */}
      {phase === "confirm" && (
        <div className="animate-fadeIn" style={{ animation: "fadeIn 0.3s ease-in" }}>
        <div className="space-y-6">
          {matchedName && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-[#0066FF]">
              Matched: <span className="font-semibold">{matchedName}</span>
            </div>
          )}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">📋 Extracted Fields</h2>
              {confidence > 0 && (
                <span className="text-xs bg-[#F8FAFC] rounded-full px-3 py-1 text-[#64748B] border border-[#E2E8F0]">
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
                    className={`flex justify-between items-center border-b pb-2 ${missing ? "border-red-800" : "border-[#E2E8F0]"}`}
                  >
                    <span className="text-sm">
                      <span className="text-[#64748B]">{f.label}</span>
                      {f.required && <span className="text-red-400 ml-1">*</span>}
                    </span>
                    <span className={`font-medium ${missing ? "text-yellow-400" : ""}`}>
                      {val || <span className="text-[#94A3B8]">—</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-3 font-medium transition-colors"
            >
              ✓ Submit
            </button>
            <button
              onClick={() => {
                const readback = template?.fields
                  .filter(f => extracted[f.name])
                  .map(f => `${f.label}: ${extracted[f.name]}`)
                  .join(". ");
                if (readback) speak(readback, language || "en");
              }}
              className="bg-purple-600 hover:bg-purple-500 text-white rounded-lg py-3 px-4 font-medium transition-colors"
            >
              🔊 Read Back
            </button>
            <button
              onClick={handleSpeakAgain}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg py-3 font-medium transition-colors"
            >
              🎙️ Speak Again
            </button>
            <button
              onClick={handleReset}
              className="bg-[#64748B] hover:bg-[#475569] text-white rounded-lg py-3 px-4 font-medium transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
        </div>
      )}

      {/* DONE */}
      {phase === "done" && (
        <div className="animate-fadeIn" style={{ animation: "fadeIn 0.3s ease-in" }}>
        <div className="text-center py-12 space-y-4">
          <p className="text-5xl">✅</p>
          <p className="text-xl font-semibold">Form submitted successfully!</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleReset} className="bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg py-2 px-6 transition-colors">
              Fill Another
            </button>
            <button onClick={() => onNavigate("/")} className="bg-[#64748B] hover:bg-[#475569] text-white rounded-lg py-2 px-6 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
