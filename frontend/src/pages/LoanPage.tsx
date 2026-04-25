import { useEffect, useState, useRef, useCallback } from "react";

// API base — same as main project's extraction Lambda
const LOAN_API = "https://ku63fvg2sc.execute-api.ap-southeast-1.amazonaws.com";

interface CreditScore {
  score: number;
  income_monthly: number;
  expense_monthly: number;
  credit_limit: number;
  available_credit: number;
  total_outstanding: number;
  debt_to_income: number;
  breakdown: Record<string, { points: number; max: number }>;
}

interface LoanRecord {
  loanId: string;
  amount: number;
  tenure: number;
  monthlyRepayment: number;
  status: string;
  reason?: string;
  nextDueDate?: string;
  monthsRemaining?: number;
  remainingBalance?: number;
  totalRepayment?: number;
}

interface Extraction {
  fields: Record<string, string | number>;
  transactions: Array<Record<string, unknown>>;
  boundingBoxes: Array<{ field: string; x: number; y: number; w: number; h: number }>;
}

// Gauge component
function ScoreGauge({ score }: { score: number }) {
  const pct = ((score - 300) / 550) * 100;
  const color = score >= 700 ? "#10b981" : score >= 550 ? "#f59e0b" : score >= 450 ? "#0066FF" : "#ef4444";
  const label = score >= 700 ? "Excellent" : score >= 550 ? "Good" : score >= 450 ? "Fair" : "Poor";
  return (
    <div className="text-center">
      <div className="relative w-28 h-28 mx-auto">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="#E2E8F0" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${pct * 3.14} 314`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] text-[#64748B]">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default function LoanPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [userId] = useState(1); // Main project user ID
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [scoreLoading, setScoreLoading] = useState(true);
  const [loans, setLoans] = useState<LoanRecord[]>([]);
  const [loanSummary, setLoanSummary] = useState<{ totalMonthlyDue: number; nextDueDate: string | null }>({ totalMonthlyDue: 0, nextDueDate: null });

  // Upload + extraction
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extraction, setExtraction] = useState<{ imageUrl: string; extraction: Extraction; documentId: string; s3Key: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  // Loan form
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState(6);
  const [applyingLoan, setApplyingLoan] = useState(false);
  const [loanResult, setLoanResult] = useState<{ status: string; reason?: string; amount?: number; monthlyRepayment?: number; message?: string } | null>(null);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // API helpers
  const api = async (path: string, body: Record<string, unknown>) => {
    const r = await fetch(`${LOAN_API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    return r.json();
  };

  const fetchCreditScore = useCallback(async () => {
    setScoreLoading(true);
    try { setCreditScore(await api("/credit/score", { userId: `USR00${userId}` })); }
    catch { /* ignore */ }
    finally { setScoreLoading(false); }
  }, [userId]);

  const fetchLoans = useCallback(async () => {
    try {
      const data = await api("/loan/apply", { userId: `USR00${userId}`, action: "status" });
      setLoans(data.loans || []);
      setLoanSummary({ totalMonthlyDue: data.totalMonthlyDue || 0, nextDueDate: data.nextDueDate });
    } catch { /* ignore */ }
  }, [userId]);

  useEffect(() => {
    const init = async () => {
      await api("/loan/apply", { userId: `USR00${userId}`, action: "approve" });
      await fetchCreditScore();
      await fetchLoans();
    };
    setLoanAmount(""); setLoanTenure(6); setLoanResult(null); setExtraction(null);
    init();
  }, [userId, fetchCreditScore, fetchLoans]);

  // Upload bank statement
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setExtraction(null); setLoanResult(null);
    try {
      const linkData = await api("/upload/link", { userId: `USR00${userId}`, files: [{ fileName: file.name, contentType: file.type || "image/png" }] });
      const { documentId, uploadLinks } = linkData;
      await fetch(uploadLinks[0].uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      setUploading(false); setExtracting(true);
      const [urlResp, extResp] = await Promise.all([
        api("/download/link", { s3Key: uploadLinks[0].s3Key }),
        api("/extraction/extract", { userId: `USR00${userId}`, documentId, s3Key: uploadLinks[0].s3Key }),
      ]);
      setExtraction({ imageUrl: urlResp.downloadUrl, extraction: extResp.extraction, documentId, s3Key: uploadLinks[0].s3Key });
    } catch (err) {
      setToast({ type: "error", message: "Upload failed" }); setTimeout(() => setToast(null), 4000);
    } finally { setUploading(false); setExtracting(false); }
  };

  // Confirm extraction
  const handleConfirm = async () => {
    if (!extraction) return;
    setConfirming(true);
    try {
      await api("/extraction/confirm", { userId: `USR00${userId}`, extractionId: extraction.documentId, s3Key: extraction.s3Key, extraction: extraction.extraction });
      setExtraction(null);
      setToast({ type: "success", message: "Bank statement confirmed! Refresh to update credit score." });
    } catch { setToast({ type: "error", message: "Confirmation failed." }); }
    finally { setConfirming(false); setTimeout(() => setToast(null), 6000); }
  };

  // Apply for loan
  const handleApplyLoan = async () => {
    const amt = parseFloat(loanAmount);
    if (!amt || amt <= 0) return;
    setApplyingLoan(true); setLoanResult(null);
    try {
      const result = await api("/loan/apply", { userId: `USR00${userId}`, amount: amt, tenureMonths: loanTenure });
      setLoanResult(result);
      await fetchLoans();
    } catch { setToast({ type: "error", message: "Loan application failed." }); setTimeout(() => setToast(null), 4000); }
    finally { setApplyingLoan(false); }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => onNavigate("/services")} className="text-[#0066FF] text-sm">← Back</button>
        <h1 className="text-lg font-bold text-[#1E293B]">💳 GOpinjam Loan</h1>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`rounded-xl p-3 mb-4 text-sm font-medium ${toast.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {toast.message}
        </div>
      )}

      {/* Credit Score */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-[#1E293B]">Your Credit Score</span>
          <span className="text-[10px] bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded-full font-medium">Live from Alibaba RDS</span>
        </div>
        {scoreLoading ? (
          <div className="flex justify-center py-8"><div className="w-8 h-8 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" /></div>
        ) : creditScore ? (
          <div className="grid grid-cols-3 gap-3">
            <ScoreGauge score={creditScore.score} />
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div className="p-2 bg-[#F8FAFC] rounded-lg"><p className="text-[10px] text-[#94A3B8]">Monthly Income</p><p className="text-sm font-bold text-[#1E293B]">RM{creditScore.income_monthly?.toLocaleString()}</p></div>
              <div className="p-2 bg-[#F8FAFC] rounded-lg"><p className="text-[10px] text-[#94A3B8]">Monthly Expense</p><p className="text-sm font-bold text-[#1E293B]">RM{creditScore.expense_monthly?.toLocaleString()}</p></div>
              <div className="p-2 bg-[#F8FAFC] rounded-lg"><p className="text-[10px] text-[#94A3B8]">Credit Limit</p><p className="text-sm font-bold text-emerald-600">RM{creditScore.credit_limit?.toLocaleString()}</p></div>
              <div className="p-2 bg-[#F8FAFC] rounded-lg"><p className="text-[10px] text-[#94A3B8]">Available</p><p className="text-sm font-bold text-[#0066FF]">RM{creditScore.available_credit?.toLocaleString()}</p></div>
            </div>
          </div>
        ) : <p className="text-sm text-[#94A3B8]">No credit score yet. Upload a bank statement.</p>}
      </div>

      {/* Upload Bank Statement */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-4">
        <p className="text-sm font-bold text-[#1E293B] mb-2">📄 Upload Bank Statement</p>
        <p className="text-xs text-[#94A3B8] mb-3">AI extracts income & expenses to calculate your credit score.</p>
        <input ref={inputRef} type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={handleUpload} />
        <button onClick={() => inputRef.current?.click()} disabled={uploading || extracting}
          className="w-full py-3 border-2 border-dashed border-[#E2E8F0] rounded-xl text-sm text-[#64748B] disabled:opacity-50 active:bg-[#F8FAFC]">
          {uploading ? "Uploading..." : extracting ? "AI extracting..." : "Choose bank statement (PNG/JPEG)"}
        </button>
      </div>

      {/* Extraction Results */}
      {extraction && (
        <div className="bg-white rounded-2xl border-2 border-[#0066FF]/30 p-5 mb-4">
          <p className="text-sm font-bold text-[#1E293B] mb-3">Review Extracted Data <span className="text-[10px] bg-blue-50 text-[#0066FF] px-2 py-0.5 rounded-full">Bedrock Nova</span></p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#F8FAFC] rounded-xl p-2 overflow-auto" style={{ maxHeight: 300 }}>
              <img src={extraction.imageUrl} alt="Statement" className="rounded-lg w-full" crossOrigin="anonymous" />
            </div>
            <div className="space-y-1.5">
              {Object.entries(extraction.extraction?.fields || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between p-1.5 rounded-lg bg-[#F8FAFC] text-[11px]">
                  <span className="text-[#94A3B8] capitalize">{k.replace(/_/g, " ")}</span>
                  <span className="font-semibold text-[#1E293B]">{typeof v === "number" ? `RM${v.toFixed(2)}` : String(v)}</span>
                </div>
              ))}
              {extraction.extraction?.transactions?.length > 0 && (
                <p className="text-[10px] text-[#94A3B8]">{extraction.extraction.transactions.length} transactions extracted</p>
              )}
            </div>
          </div>
          <button onClick={handleConfirm} disabled={confirming}
            className="w-full mt-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50">
            {confirming ? "Submitting..." : "✓ Confirm Bank Statement"}
          </button>
        </div>
      )}

      {/* Apply for Loan */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 mb-4">
        <p className="text-sm font-bold text-[#1E293B] mb-3">💰 Apply for GOpinjam</p>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1">Loan Amount (RM)</label>
            <input type="number" value={loanAmount} onChange={e => setLoanAmount(e.target.value)}
              placeholder="e.g. 2000" min="100" max="10000" step="100"
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#0066FF]" />
          </div>
          <div>
            <label className="text-[10px] text-[#94A3B8] block mb-1">Tenure (months)</label>
            <select value={loanTenure} onChange={e => setLoanTenure(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:border-[#0066FF]">
              {[3, 6, 9, 12, 18, 24].map(m => <option key={m} value={m}>{m} months</option>)}
            </select>
          </div>
        </div>
        {loanAmount && parseFloat(loanAmount) > 0 && (
          <p className="text-xs text-[#94A3B8] mb-3">Monthly repayment: ~RM{((parseFloat(loanAmount) * 1.05) / loanTenure).toFixed(2)} (5% flat rate)</p>
        )}
        <button onClick={handleApplyLoan} disabled={applyingLoan || !loanAmount || parseFloat(loanAmount) <= 0}
          className="w-full py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-semibold rounded-xl disabled:opacity-50">
          {applyingLoan ? "Processing..." : "Apply for Loan"}
        </button>
      </div>

      {/* Loan Result */}
      {loanResult && (
        <div className={`rounded-2xl border-2 p-4 mb-4 ${loanResult.status === "pending" ? "border-amber-200 bg-amber-50" : loanResult.status === "rejected" ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
          <div className="flex items-center gap-2 mb-1">
            <span>{loanResult.status === "pending" ? "⏳" : loanResult.status === "rejected" ? "❌" : "✅"}</span>
            <span className="text-sm font-bold">{loanResult.status === "pending" ? "Loan Pending Approval" : loanResult.status === "rejected" ? "Loan Rejected" : "Loan Approved"}</span>
            <button onClick={() => setLoanResult(null)} className="ml-auto text-[#94A3B8] text-xs">✕</button>
          </div>
          <p className="text-xs text-[#64748B]">{loanResult.reason || loanResult.message}</p>
        </div>
      )}

      {/* Loan History */}
      {loans.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
          <p className="text-sm font-bold text-[#1E293B] mb-3">Loan History <span className="text-[10px] bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded-full">{loans.length}</span></p>
          {loanSummary.totalMonthlyDue > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-3 bg-blue-50 rounded-xl"><p className="text-[10px] text-[#0066FF]">Total Monthly Due</p><p className="text-lg font-bold text-[#0066FF]">RM{loanSummary.totalMonthlyDue.toFixed(2)}</p></div>
              <div className="p-3 bg-amber-50 rounded-xl"><p className="text-[10px] text-amber-600">Next Due Date</p><p className="text-lg font-bold text-amber-700">{loanSummary.nextDueDate ? new Date(loanSummary.nextDueDate).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p></div>
            </div>
          )}
          <div className="space-y-2">
            {loans.map(loan => (
              <div key={loan.loanId} className={`p-3 rounded-xl border ${loan.status === "active" ? "border-emerald-100 bg-emerald-50/30" : loan.status === "pending" ? "border-amber-100 bg-amber-50/30" : "border-red-100 bg-red-50/30"}`}>
                <div className="flex items-center gap-2">
                  <span>{loan.status === "active" ? "✅" : loan.status === "pending" ? "⏳" : "❌"}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#1E293B]">GOpinjam — {loan.loanId}</p>
                    <p className="text-[10px] text-[#94A3B8]">{loan.tenure}mo • RM{loan.monthlyRepayment?.toFixed(2)}/mo</p>
                  </div>
                  <span className="text-sm font-bold text-[#1E293B]">RM{loan.amount?.toFixed(2)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${loan.status === "active" ? "bg-emerald-100 text-emerald-700" : loan.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{loan.status}</span>
                </div>
                {loan.status === "active" && loan.nextDueDate && (
                  <div className="flex gap-4 mt-1.5 ml-6 text-[10px] text-[#94A3B8]">
                    <span>Remaining: <b className="text-[#1E293B]">{loan.monthsRemaining}mo</b></span>
                    <span>Due: <b className="text-amber-600">{new Date(loan.nextDueDate).toLocaleDateString("en-MY", { day: "numeric", month: "short" })}</b></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
