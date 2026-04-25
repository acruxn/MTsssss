import { useEffect, useRef, useState } from "react";
import type { ActionFlow } from "../lib/flows";

interface ActionFlowProps {
  flow: ActionFlow;
  fields: Record<string, unknown>;
  onComplete: () => void;
  onCancel: () => void;
}

const txnId = () => "TXN-" + Math.random().toString(36).slice(2, 10).toUpperCase();
const now = () => new Date().toLocaleString("en-MY", { dateStyle: "medium", timeStyle: "short" });

const Chk = ({ c = "w-5 h-5" }: { c?: string }) => (
  <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const FaceIdSvg = (
  <svg className="w-20 h-20 text-white" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="24" y="16" width="48" height="64" rx="16" />
    <circle cx="48" cy="42" r="10" />
    <path d="M38 56c0-5.5 4.5-10 10-10s10 4.5 10 10" strokeLinecap="round" />
    <line x1="48" y1="8" x2="48" y2="16" strokeLinecap="round" />
    <line x1="48" y1="80" x2="48" y2="88" strokeLinecap="round" />
  </svg>
);

function TypeWriter({ text, onDone }: { text: string; onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!text) { onDone(); return; }
    const id = setInterval(() => {
      setShown((p) => {
        const next = p + 1;
        if (next >= text.length && !doneRef.current) {
          doneRef.current = true;
          setTimeout(onDone, 200);
        }
        return Math.min(next, text.length);
      });
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span>
      {text.slice(0, shown)}
      {shown < text.length && <span className="inline-block w-0.5 h-4 bg-[#0066FF] ml-0.5 align-middle" style={{ animation: "blink-cursor 0.8s step-end infinite" }} />}
    </span>
  );
}

export default function ActionFlow({ flow, fields, onComplete, onCancel }: ActionFlowProps) {
  const [step, setStep] = useState(0);
  const [stepDone, setStepDone] = useState(false);
  const [slideDir, setSlideDir] = useState<"in" | "out">("in");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const current = flow.steps[step];
  const total = flow.steps.length;

  function advance() {
    if (step >= total - 1) return;
    setSlideDir("out");
    setTimeout(() => {
      setStep((s) => s + 1);
      setStepDone(false);
      setSlideDir("in");
    }, 200);
  }

  // Auto-advance for non-confirm steps
  useEffect(() => {
    if (!current || current.type === "confirm" || current.type === "receipt") return;
    if (!stepDone) return;
    const ms = current.autoAdvanceMs ?? 800;
    timerRef.current = setTimeout(advance, ms - 300);
    return () => clearTimeout(timerRef.current);
  }, [stepDone, step]);

  // Auto-advance biometric
  useEffect(() => {
    if (current?.type !== "biometric") return;
    const t = setTimeout(() => {
      setStepDone(true);
      setTimeout(advance, 400);
    }, current.autoAdvanceMs ?? 1500);
    return () => clearTimeout(t);
  }, [step]);

  const resolveValue = (s: typeof current): string => {
    if (s.value) return s.value;
    if (s.field && fields[s.field] != null) return String(fields[s.field]);
    return "";
  };

  const completedFields = flow.steps
    .slice(0, step)
    .filter((s) => s.type === "input" || s.type === "select")
    .map((s) => ({ label: s.label, value: resolveValue(s) }));

  const slideClass = slideDir === "in"
    ? "animate-[slideInRight_0.25s_ease-out_forwards]"
    : "animate-[slideOutLeft_0.2s_ease-in_forwards]";

  // Biometric overlay
  if (current?.type === "biometric") {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center animate-fadeIn">
        {!stepDone ? (
          <>
            <div className="animate-pulse">{FaceIdSvg}</div>
            <p className="text-white text-lg font-semibold mt-6">{current.label}</p>
            <p className="text-white/60 text-sm mt-2">Verifying identity...</p>
          </>
        ) : (
          <div className="animate-popIn w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center">
            <Chk c="w-10 h-10 text-white" />
          </div>
        )}
      </div>
    );
  }

  // Receipt
  if (current?.type === "receipt") {
    const allFields = flow.steps
      .filter((s) => s.type === "input" || s.type === "select")
      .map((s) => ({ label: s.label, value: resolveValue(s) }))
      .filter((f) => f.value);

    return (
      <div className="px-4 py-6 animate-fadeIn">
        <div className="text-center mb-6">
          <div className="animate-popIn w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Chk c="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B]">{flow.icon} {current.label}</h2>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden mb-4">
          <div className="divide-y divide-[#F1F5F9]">
            {allFields.map((f) => (
              <div key={f.label} className="px-5 py-3 flex justify-between">
                <span className="text-sm text-[#64748B]">{f.label}</span>
                <span className="text-sm font-medium text-[#1E293B]">{f.value}</span>
              </div>
            ))}
            <div className="px-5 py-3 flex justify-between">
              <span className="text-sm text-[#64748B]">Transaction ID</span>
              <span className="text-xs font-mono text-[#94A3B8]">{txnId()}</span>
            </div>
            <div className="px-5 py-3 flex justify-between">
              <span className="text-sm text-[#64748B]">Date & Time</span>
              <span className="text-sm text-[#1E293B]">{now()}</span>
            </div>
            <div className="px-5 py-3 flex justify-between bg-[#F8FAFC]">
              <span className="text-sm font-medium text-[#64748B]">Updated Balance</span>
              <span className="text-sm font-bold text-[#1E293B]">RM 1,184.56</span>
            </div>
          </div>
        </div>
        <button
          onClick={onComplete}
          className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl py-3.5 font-medium transition-colors"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#94A3B8] font-medium">
          {flow.icon} {flow.title}
        </span>
        <span className="text-xs text-[#94A3B8] tabular-nums">
          Step {step + 1} of {total}
        </span>
      </div>
      <div className="h-1 bg-[#E2E8F0] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[#0066FF] rounded-full transition-all duration-500"
          style={{ width: `${((step + 1) / total) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div key={step} className={`${slideClass}`}>
        {current.type === "input" && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <label className="text-xs text-[#94A3B8] uppercase tracking-wider font-medium mb-2 block">
              {current.label}
            </label>
            <div className="text-lg text-[#1E293B] font-medium min-h-[28px]">
              <TypeWriter text={resolveValue(current)} onDone={() => setStepDone(true)} />
            </div>
            {stepDone && (
              <div className="flex items-center gap-1.5 mt-3 text-emerald-600 animate-fadeIn">
                <Chk c="w-4 h-4" />
                <span className="text-xs font-medium">Filled</span>
              </div>
            )}
          </div>
        )}

        {current.type === "select" && (
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm">
            <label className="text-xs text-[#94A3B8] uppercase tracking-wider font-medium mb-3 block">
              {current.label}
            </label>
            <div className="flex flex-wrap gap-2">
              {current.options?.map((opt) => {
                const selected = stepDone && opt === resolveValue(current);
                return (
                  <span
                    key={opt}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                      selected
                        ? "bg-[#0066FF] text-white border-[#0066FF]"
                        : "bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]"
                    }`}
                  >
                    {opt}
                  </span>
                );
              })}
            </div>
            {!stepDone && (
              <SelectAutoFill
                value={resolveValue(current)}
                onDone={() => setStepDone(true)}
              />
            )}
          </div>
        )}

        {current.type === "confirm" && (
          <div className="space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0]">
                <p className="text-base font-semibold text-[#1E293B]">{current.label}</p>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {completedFields.map((f) => (
                  <div key={f.label} className="px-5 py-3 flex justify-between">
                    <span className="text-sm text-[#64748B]">{f.label}</span>
                    <span className="text-sm font-medium text-[#1E293B]">{f.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={advance}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3.5 font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Chk /> Confirm
              </button>
              <button
                onClick={onCancel}
                className="bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] rounded-xl py-3.5 px-6 font-medium transition-colors"
              >
                ✗ Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Hidden helper — triggers select "done" after a delay */
function SelectAutoFill({ value, onDone }: { value: string; onDone: () => void }) {
  useEffect(() => {
    if (!value) { onDone(); return; }
    const t = setTimeout(onDone, 500);
    return () => clearTimeout(t);
  }, [value]);
  return null;
}
