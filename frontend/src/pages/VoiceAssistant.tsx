import { useEffect, useRef, useState } from "react";
import { getTemplate, createSession, completeSession, type FormTemplate, type VoiceSession } from "../lib/api";

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
}

export default function VoiceAssistant({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [template, setTemplate] = useState<FormTemplate | null>(null);
  const [session, setSession] = useState<VoiceSession | null>(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentFieldIdx, setCurrentFieldIdx] = useState(0);
  const [filledFields, setFilledFields] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"idle" | "filling" | "confirm" | "done">("idle");
  const recognitionRef = useRef<ReturnType<typeof Object> | null>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  const templateId = new URLSearchParams(window.location.search).get("template") || "";

  useEffect(() => {
    if (templateId) {
      getTemplate(templateId).then(setTemplate).catch(() => {});
    }
  }, [templateId]);

  const currentField = template?.fields[currentFieldIdx];

  function startRecognition() {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) { alert("Speech Recognition not supported in this browser"); return; }
    const recognition = new (SR as new () => Record<string, unknown>)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = template?.language === "ms" ? "ms-MY" : template?.language === "zh" ? "zh-CN" : "en-US";
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        final += e.results[i][0].transcript;
      }
      setTranscript(final);
    };
    recognition.onend = () => { if (listening) (recognition as Record<string, unknown> & { start: () => void }).start(); };
    (recognition as Record<string, unknown> & { start: () => void }).start();
    recognitionRef.current = recognition;
    setListening(true);
  }

  function stopRecognition() {
    if (recognitionRef.current && typeof (recognitionRef.current as Record<string, unknown>).stop === "function") {
      (recognitionRef.current as Record<string, unknown> & { stop: () => void }).stop();
    }
    recognitionRef.current = null;
    setListening(false);
  }

  async function handleStart() {
    if (!template) return;
    try {
      const s = await createSession(template.id, template.language);
      setSession(s);
      setPhase("filling");
      setCurrentFieldIdx(0);
      setFilledFields({});
      startRecognition();
    } catch { setPhase("filling"); startRecognition(); }
  }

  function handleAcceptField() {
    if (!currentField || !transcript.trim()) return;
    const value = transcript.trim();
    const updated = { ...filledFields, [currentField.name]: value };
    setFilledFields(updated);
    setTranscript("");
    if (currentFieldIdx + 1 < (template?.fields.length || 0)) {
      setCurrentFieldIdx(currentFieldIdx + 1);
    } else {
      stopRecognition();
      setPhase("confirm");
    }
  }

  function handleSkipField() {
    setTranscript("");
    if (currentFieldIdx + 1 < (template?.fields.length || 0)) {
      setCurrentFieldIdx(currentFieldIdx + 1);
    } else {
      stopRecognition();
      setPhase("confirm");
    }
  }

  async function handleConfirm() {
    if (session) { await completeSession(session.id).catch(() => {}); }
    setPhase("done");
  }

  function handleReset() {
    setPhase("idle");
    setSession(null);
    setFilledFields({});
    setCurrentFieldIdx(0);
    setTranscript("");
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

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🎙️ Voice Assistant</h1>
      {template && <p className="text-gray-400 mb-8">Filling: {template.name}</p>}

      {/* Mic Button */}
      {phase === "idle" && (
        <div className="flex flex-col items-center gap-6 py-12">
          <button
            onClick={handleStart}
            className="relative w-32 h-32 rounded-full bg-blue-600 hover:bg-blue-500 transition-all flex items-center justify-center shadow-lg shadow-blue-600/30"
          >
            <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          </button>
          <p className="text-gray-400">Tap to start voice filling</p>
        </div>
      )}

      {/* Active Filling */}
      {phase === "filling" && currentField && (
        <div className="space-y-6">
          {/* Waveform Animation */}
          <div className="flex items-center justify-center gap-1 h-16" ref={pulseRef}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 rounded-full bg-blue-500 transition-all ${listening ? "animate-pulse" : ""}`}
                style={{
                  height: listening ? `${20 + Math.random() * 40}px` : "8px",
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Current Field Prompt */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-500 mb-1">
              Field {currentFieldIdx + 1} of {template?.fields.length}
            </p>
            <p className="text-xl font-semibold text-blue-400">{currentField.label}</p>
            {currentField.options && (
              <p className="text-sm text-gray-500 mt-2">Options: {currentField.options.join(", ")}</p>
            )}
          </div>

          {/* Live Transcript */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 min-h-[60px]">
            <p className="text-xs text-gray-500 mb-1">Live Transcription</p>
            <p className="text-lg">{transcript || <span className="text-gray-600">Listening...</span>}</p>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={handleAcceptField}
              disabled={!transcript.trim()}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white rounded-lg py-3 font-medium transition-colors"
            >
              ✓ Accept
            </button>
            <button
              onClick={handleSkipField}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
            >
              Skip →
            </button>
            <button
              onClick={() => { stopRecognition(); setPhase("idle"); }}
              className="bg-red-700 hover:bg-red-600 text-white rounded-lg py-3 px-4 font-medium transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Progress */}
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentFieldIdx) / (template?.fields.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Confirmation Readback */}
      {phase === "confirm" && (
        <div className="space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">📋 Please confirm your entries</h2>
            <div className="space-y-3">
              {template?.fields.map((f) => (
                <div key={f.name} className="flex justify-between items-center border-b border-gray-800 pb-2">
                  <span className="text-gray-400 text-sm">{f.label}</span>
                  <span className="font-medium">{filledFields[f.name] || <span className="text-gray-600">—</span>}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white rounded-lg py-3 font-medium transition-colors"
            >
              ✓ Submit
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 font-medium transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Done */}
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
