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
        setMatchedName(result.template_name || "");
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

  const [showTypeInput, setShowTypeInput] = useState(false);

  const MicIcon = (
    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );

  const StopIcon = (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );

  const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );

  const WarningIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.66 16.59A1 1 0 0120.66 21H3.34a1 1 0 01-.86-1.41L12 3z" />
    </svg>
  );

  const Equalizer = () => (
    <div className="flex items-end justify-center gap-1.5 h-16">
      {[0.6, 0.9, 0.4, 1, 0.5, 0.8, 0.7].map((scale, i) => (
        <div
          key={i}
          className="eq-bar w-1.5 rounded-full bg-red-500"
          style={{
            height: `${scale * 48}px`,
            animationDelay: `${i * 0.12}s`,
            animationDuration: `${0.6 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  );

  const isListening = phase === "listening" || phase === "home-listening";
  const isExtracting = phase === "extracting" || phase === "home-extracting";

  const handleDone = templateId ? handleDoneSpeaking : handleHomeDone;
  const handleCancelCurrent = templateId ? handleCancel : handleHomeCancel;
  const handleStart = templateId ? handleStartListening : handleHomeStart;

  const FieldList = () => (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
      <p className="text-xs text-[#94A3B8] mb-3 uppercase tracking-wider font-medium">Fields to fill</p>
      <div className="flex flex-wrap gap-2">
        {template?.fields.map((f) => {
          const filled = extracted[f.name] && extracted[f.name] !== "";
          return (
            <span
              key={f.name}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors ${
                filled
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B]"
              }`}
            >
              {filled && <CheckIcon className="w-3 h-3" />}
              {f.label}
              {f.required && !filled && <span className="text-red-400">*</span>}
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10 max-w-2xl mx-auto min-h-[calc(100vh-52px)]">

      {error && (
        <div className="animate-fadeIn bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3 text-sm text-red-700">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* ─── IDLE ─── */}
      {phase === "idle" && (
        <div className="animate-fadeIn flex flex-col items-center text-center">
          {/* Header area */}
          {template ? (
            <div className="mb-8 w-full">
              <h1 className="text-2xl font-bold text-[#1E293B] mb-1">🎙️ Voice Assistant</h1>
              <p className="text-[#64748B] text-sm mb-6">Filling: <span className="font-medium text-[#1E293B]">{template.name}</span></p>
              <FieldList />
            </div>
          ) : (
            <div className="mb-4 pt-8">
              <div className="w-16 h-16 rounded-2xl bg-[#EBF5FF] flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#0066FF]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B] mb-3 leading-tight">
                What would you like<br />to do today?
              </h1>
              <p className="text-[#64748B] text-sm max-w-sm mx-auto leading-relaxed">
                Speak naturally in any language — I&apos;ll find the right form and fill it for you.
              </p>
            </div>
          )}

          {/* Mic button */}
          <div className="relative my-8">
            <div className="absolute inset-0 rounded-full bg-[#0066FF]/10 scale-150" />
            <div className="absolute inset-0 rounded-full bg-[#0066FF]/5 scale-[2]" />
            <button
              onClick={handleStart}
              className="mic-pulse relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#0066FF] hover:bg-[#0052CC] transition-all flex items-center justify-center shadow-xl shadow-[#0066FF]/25 active:scale-95"
              aria-label="Start voice recording"
            >
              {MicIcon}
            </button>
          </div>

          <p className="text-[#64748B] text-sm font-medium mb-2">Tap to start speaking</p>
          {!templateId && (
            <button onClick={() => onNavigate("/templates")} className="text-xs text-[#0066FF] hover:underline mt-1">
              or browse templates →
            </button>
          )}
        </div>
      )}

      {/* ─── LISTENING ─── */}
      {isListening && (
        <div className="animate-fadeIn flex flex-col items-center">
          {template && <div className="w-full mb-6"><FieldList /></div>}

          {/* Mic + Equalizer */}
          <div className="relative my-6">
            {/* Ripple rings */}
            <div className="absolute inset-0 rounded-full border-2 border-red-400/30 ripple-ring" style={{ animationDelay: "0s" }} />
            <div className="absolute inset-0 rounded-full border-2 border-red-400/20 ripple-ring" style={{ animationDelay: "0.6s" }} />
            <div className="absolute inset-0 rounded-full border-2 border-red-400/10 ripple-ring" style={{ animationDelay: "1.2s" }} />
            <button
              onClick={handleDone}
              disabled={!transcript.trim()}
              className="mic-listening relative w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-60 transition-all flex items-center justify-center shadow-lg shadow-red-500/30 active:scale-95"
              aria-label="Stop recording"
            >
              {StopIcon}
            </button>
          </div>

          <Equalizer />

          <p className="text-xs text-[#94A3B8] mt-3 mb-6">Tap the button when you&apos;re done</p>

          {/* Transcript card */}
          <div className="w-full bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm min-h-[100px] mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs text-[#94A3B8] uppercase tracking-wider font-medium">Live Transcription</p>
            </div>
            <p className="text-lg text-[#1E293B] leading-relaxed">
              {transcript || <span className="text-[#94A3B8] italic">Listening...</span>}
            </p>
          </div>

          {/* Type fallback */}
          {!showTypeInput ? (
            <button
              onClick={() => setShowTypeInput(true)}
              className="text-xs text-[#0066FF] hover:underline mb-4"
            >
              prefer to type?
            </button>
          ) : (
            <div className="w-full mb-4 animate-fadeIn">
              <input
                type="text"
                placeholder="Type your request here..."
                className="w-full bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                    setTranscript((e.target as HTMLInputElement).value.trim());
                  }
                }}
              />
              <p className="text-xs text-[#94A3B8] mt-1.5 ml-1">Press Enter to submit</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDone}
              disabled={!transcript.trim()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-xl py-3.5 font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckIcon className="w-5 h-5" /> Done Speaking
            </button>
            <button
              onClick={handleCancelCurrent}
              className="sm:w-auto bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl py-3.5 px-6 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── EXTRACTING ─── */}
      {isExtracting && (
        <div className="animate-fadeIn flex flex-col items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-[3px] border-[#E2E8F0] rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-[3px] border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-[#1E293B] font-medium mt-6 mb-1">
            {templateId ? "Extracting your information..." : "Finding the right form..."}
          </p>
          <p className="text-sm text-[#94A3B8]">AI is analyzing your speech</p>
        </div>
      )}

      {/* ─── CONFIRM ─── */}
      {phase === "confirm" && (
        <div className="animate-fadeIn space-y-5">
          {/* Matched banner */}
          {matchedName && (
            <div className="bg-[#EBF5FF] border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#0066FF] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0066FF]">Matched: {matchedName}</p>
                <p className="text-xs text-[#64748B]">We found the right form for you</p>
              </div>
            </div>
          )}

          {/* Extracted fields card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1E293B]">Extracted Information</h2>
              {confidence > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full animate-fill"
                      style={{
                        width: `${Math.round(confidence * 100)}%`,
                        backgroundColor: confidence > 0.7 ? "#10B981" : confidence > 0.4 ? "#F59E0B" : "#EF4444",
                      }}
                    />
                  </div>
                  <span className="text-xs text-[#94A3B8] font-medium tabular-nums">{Math.round(confidence * 100)}%</span>
                </div>
              )}
            </div>
            <div className="divide-y divide-[#F1F5F9]">
              {template?.fields.map((f) => {
                const val = extracted[f.name];
                const filled = val && val !== "";
                const missing = f.required && !filled;
                return (
                  <div key={f.name} className="px-6 py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        filled ? "bg-emerald-100 text-emerald-600" : missing ? "bg-amber-100 text-amber-500" : "bg-[#F1F5F9] text-[#94A3B8]"
                      }`}>
                        {filled ? <CheckIcon className="w-3.5 h-3.5" /> : missing ? <WarningIcon /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                      </span>
                      <span className="text-sm text-[#64748B]">
                        {f.label}
                        {f.required && <span className="text-red-400 ml-0.5">*</span>}
                      </span>
                    </div>
                    <span className={`text-sm font-medium text-right truncate ${filled ? "text-[#1E293B]" : "text-[#94A3B8]"}`}>
                      {val || "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/20"
            >
              <CheckIcon className="w-5 h-5" /> Submit Form
            </button>
            <button
              onClick={() => {
                const readback = template?.fields
                  .filter(f => extracted[f.name])
                  .map(f => `${f.label}: ${extracted[f.name]}`)
                  .join(". ");
                if (readback) speak(readback, language || "en");
              }}
              className="bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl py-3.5 px-5 font-medium transition-colors flex items-center justify-center gap-2"
            >
              🔊 Read Back
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSpeakAgain}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl py-3.5 font-medium transition-colors flex items-center justify-center gap-2"
            >
              🎙️ Add More Info
            </button>
            <button
              onClick={handleReset}
              className="bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl py-3.5 px-5 font-medium transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* ─── DONE ─── */}
      {phase === "done" && (
        <div className="animate-fadeIn flex flex-col items-center text-center py-16">
          <div className="animate-popIn w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
            <CheckIcon className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Form Submitted</h2>
          <p className="text-[#64748B] text-sm mb-8 max-w-xs">Your information has been submitted successfully. Thank you for using FormBuddy.</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleReset}
              className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl py-3 font-medium transition-colors"
            >
              Fill Another
            </button>
            <button
              onClick={() => onNavigate("/")}
              className="flex-1 bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl py-3 font-medium transition-colors"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
