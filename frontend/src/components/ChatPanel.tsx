import { useEffect, useRef, useState } from "react";
import { detectIntent, getBalance, transcribeAudio } from "../lib/api";
import { speak, stopSpeaking } from "../lib/speech";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: { actionType: string; fields: Record<string, unknown>; confirmMsg: string }) => void;
  language: string;
}

interface ChatMessage { role: "user" | "assistant"; content: string }

interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } }; length: number };
  resultIndex: number;
}

const LANG_MAP: Record<string, string> = { en: "en-US", ms: "ms-MY", zh: "zh-CN", "zh-HK": "zh-HK", ta: "ta-IN" };
const LANG_LABELS: Record<string, string> = { en: "EN 🇬🇧", ms: "BM 🇲🇾", zh: "中文", "zh-HK": "粵語", ta: "தமிழ்" };

const ACTION_META: Record<string, string> = {
  fuel_payment: "Fuel Payment", bill_payment: "Bill Payment", fund_transfer: "Fund Transfer",
  pin_reload: "Prepaid Reload", scan_pay: "Scan & Pay", pay_toll: "Toll Payment",
  pay_parking: "Parking", buy_insurance: "Insurance", apply_loan: "GOpinjam",
  invest: "GO+ Investment", buy_ticket: "Buy Ticket", food_delivery: "Food Delivery",
  donate: "Donation", form_fill: "Form Fill",
};

export default function ChatPanel({ isOpen, onClose, onAction, language }: ChatPanelProps) {
  const [panelState, setPanelState] = useState<"expanded" | "pill" | "hidden">("hidden");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [pillText, setPillText] = useState("");

  const recognitionRef = useRef<ReturnType<typeof Object> | null>(null);
  const listeningRef = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync isOpen → panelState
  useEffect(() => {
    if (isOpen) {
      setPanelState("expanded");
      if (messages.length === 0) {
        setMessages([{ role: "assistant", content: "Hi! What would you like to do today?" }]);
      }
    } else {
      stopRecording();
      setPanelState("hidden");
    }
  }, [isOpen]);

  // Restart recognition when language changes mid-recording
  useEffect(() => {
    if (recording) {
      stopRecording();
      setTimeout(() => startRecording(), 100);
    }
  }, [language]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function startRecording() {
    const SR = (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
    if (!SR) return;
    const r = new (SR as new () => Record<string, unknown>)();
    r.continuous = true; r.interimResults = true;
    r.lang = LANG_MAP[language] || "en-US";
    let ft = "";
    r.onresult = (e: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if ((e.results[i] as unknown as { isFinal: boolean }).isFinal) ft += t + " "; else interim += t;
      }
      setTranscript(ft + interim);
    };
    r.onend = () => { if (listeningRef.current) (r as unknown as { start: () => void }).start(); };
    (r as unknown as { start: () => void }).start();
    recognitionRef.current = r; listeningRef.current = true;
    setRecording(true);

    // Also start MediaRecorder for Transcribe
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mr.start();
      mediaRecorderRef.current = mr;
    }).catch(() => {});
  }

  function stopRecording() {
    listeningRef.current = false;
    if (recognitionRef.current && typeof (recognitionRef.current as Record<string, unknown>).stop === "function")
      (recognitionRef.current as unknown as { stop: () => void }).stop();
    recognitionRef.current = null;
    setRecording(false);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    mediaRecorderRef.current = null;
  }

  function toggleMic() {
    if (recording) {
      stopRecording();
      const webSpeechText = transcript.trim();
      setTranscript("");
      if (webSpeechText || audioChunksRef.current.length > 0) {
        transcribeAndSubmit(webSpeechText);
      }
    } else {
      setTranscript("");
      startRecording();
    }
  }

  async function transcribeAndSubmit(webSpeechText: string) {
    let finalTranscript = webSpeechText;
    let detectedLang = language;

    if (audioChunksRef.current.length > 0) {
      setTranscribing(true);
      try {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(blob);
        });
        const result = await transcribeAudio(base64, "webm");
        if (result.transcript) {
          finalTranscript = result.transcript;
          detectedLang = result.language_code;
        }
      } catch { /* Transcribe failed — use Web Speech transcript */ }
      audioChunksRef.current = [];
      setTranscribing(false);
    }

    if (finalTranscript) {
      setInput("");
      submitText(finalTranscript, detectedLang);
    }
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    submitText(text);
  }

  async function submitText(text: string, detectedLang?: string) {
    stopSpeaking();
    setProcessing(true);
    setMessages(prev => [...prev, { role: "user", content: text }]);
    const lang = detectedLang || language;

    try {
      const historyCtx = messages.map(m => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n") + "\nUser: " + text;
      const result = await detectIntent(historyCtx, lang);
      const aType = result.action_type || "unknown";

      // Chat response — stay in conversation
      if (aType === "chat") {
        const msg = result.chat_response || result.confirmation_message || "How can I help you?";
        setMessages(prev => [...prev, { role: "assistant", content: msg }]);
        speak(result.confirmation_message || msg, result.detected_language || language);
        setProcessing(false);
        return;
      }

      // Check balance inline
      if (aType === "check_balance") {
        try {
          const bal = await getBalance();
          const msg = `Your balance is RM ${bal.balance.toFixed(2)}`;
          setMessages(prev => [...prev, { role: "assistant", content: msg }]);
          speak(msg, result.detected_language || language);
        } catch {
          setMessages(prev => [...prev, { role: "assistant", content: "Sorry, couldn't check your balance right now." }]);
        }
        setProcessing(false);
        return;
      }

      // Loan — redirect to dedicated loan page
      if (aType === "apply_loan") {
        const msg = result.confirmation_message || "Taking you to GOpinjam Loan.";
        setMessages(prev => [...prev, { role: "assistant", content: msg }]);
        await speak(msg, result.detected_language || language);
        onAction({ actionType: "apply_loan", fields: result.fields, confirmMsg: msg });
        setPanelState("pill"); setPillText("Opening GOpinjam...");
        setTimeout(() => { setPanelState("hidden"); onClose(); }, 2000);
        setProcessing(false);
        return;
      }

      // Unknown
      if (aType === "unknown" && !result.confirmation_message) {
        const msg = "I didn't catch that. Could you tell me what you'd like to do? For example: send money, pay bills, or check balance.";
        setMessages(prev => [...prev, { role: "assistant", content: msg }]);
        speak(msg, language);
        setProcessing(false);
        return;
      }

      // Real action → dispatch to parent
      const label = ACTION_META[aType] || aType;
      const confirmMsg = result.confirmation_message || `Processing ${label}...`;
      setMessages(prev => [...prev, { role: "assistant", content: `Got it! ${confirmMsg}` }]);
      speak(`Got it! ${confirmMsg}`, result.detected_language || language);

      setPillText(`Navigating to ${label}...`);
      setPanelState("pill");

      onAction({ actionType: aType, fields: result.fields, confirmMsg });

      setTimeout(() => { setPanelState("hidden"); onClose(); }, 2000);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setProcessing(false);
  }

  function handleClose() {
    stopRecording();
    stopSpeaking();
    setMessages([]);
    setInput("");
    setTranscript("");
    onClose();
  }

  if (panelState === "hidden") return null;

  // Pill state
  if (panelState === "pill") return (
    <div className="absolute bottom-20 left-4 right-4 z-50 bg-[#0066FF] text-white rounded-full px-5 py-3 flex items-center gap-3 shadow-lg animate-fadeIn">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium">{pillText}</span>
    </div>
  );

  // Expanded state
  return (
    <>
      {/* Backdrop */}
      <div className="absolute inset-0 z-50 bg-black/30" onClick={handleClose} />

      {/* Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300" style={{ height: "60%" }}>
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0066FF] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            </div>
            <span className="text-sm font-bold text-[#1E293B]">FormBuddy</span>
            <span className="text-[10px] bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded-full font-medium">{LANG_LABELS[language] || "EN"}</span>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-[#0066FF] text-white rounded-br-md" : "bg-[#F1F5F9] text-[#1E293B] rounded-bl-md"}`}>
                {m.content}
              </div>
            </div>
          ))}
          {processing && (
            <div className="flex justify-start">
              <div className="bg-[#F1F5F9] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          {transcribing && (
            <div className="flex justify-start">
              <div className="bg-blue-50 rounded-2xl rounded-bl-md px-4 py-2.5 text-xs text-[#0066FF] font-medium flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                Transcribing...
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-100 px-3 py-2.5 flex items-center gap-2">
          <input
            type="text"
            value={recording ? transcript || "Listening..." : input}
            onChange={e => !recording && setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            placeholder="Type a message..."
            readOnly={recording}
            className={`flex-1 bg-[#F1F5F9] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 ${recording ? "text-red-500 italic" : "text-[#1E293B]"}`}
          />
          <button
            onClick={toggleMic}
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${recording ? "bg-red-500" : "bg-[#F1F5F9]"}`}
            aria-label={recording ? "Stop recording" : "Start recording"}
          >
            {recording ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            ) : (
              <svg className="w-5 h-5 text-[#0066FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
            )}
          </button>
          {!recording && input.trim() && (
            <button onClick={handleSend} className="w-10 h-10 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
