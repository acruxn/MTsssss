const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// --- Types matching backend schemas exactly ---

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

export interface FormTemplate {
  id: number;
  name: string;
  category: string;
  fields: FormField[];
  language: string;
  created_at: string;
}

export interface VoiceSession {
  id: number;
  user_id: number;
  form_template_id: number;
  status: "active" | "completed" | "cancelled";
  filled_data: Record<string, string> | null;
  language: string;
  created_at: string;
}

export interface ExtractedFields {
  fields: Record<string, string | null>;
  confidence: number;
  ai_source: string;
}

export interface DashboardStats {
  total_forms: number;
  total_sessions: number;
  active_sessions: number;
  completed_sessions: number;
  sessions_by_language: Record<string, number>;
}

// --- API functions matching backend routes exactly ---

export const getDashboardStats = () => request<DashboardStats>("/dashboard/stats");
export const getTemplates = () => request<FormTemplate[]>("/forms");
export const getTemplate = (id: number | string) => request<FormTemplate>(`/forms/${id}`);
export const createSession = (formTemplateId: number, language: string, userId: number = 1) =>
  request<VoiceSession>("/voice/sessions", {
    method: "POST",
    body: JSON.stringify({ form_template_id: formTemplateId, user_id: userId, language }),
  });
export const extractFields = (sessionId: number, transcript: string, language: string) =>
  request<ExtractedFields>("/voice/extract", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, transcript, language }),
  });
export const getSession = (sessionId: number | string) =>
  request<VoiceSession>(`/voice/sessions/${sessionId}`);
export const completeSession = (sessionId: number | string) =>
  request<VoiceSession>(`/voice/sessions/${sessionId}/complete`, { method: "POST" });
export const getSessions = (limit: number = 20) =>
  request<VoiceSession[]>(`/voice/sessions?limit=${limit}`);

export interface DetectIntentResult {
  action_type: string;
  template_id: number | null;
  template_name: string | null;
  action_label: string | null;
  fields: Record<string, unknown>;
  confidence: number;
  confirmation_message: string | null;
  detected_language: string;
  chat_response: string | null;
}

export const detectIntent = (transcript: string, language: string, messages?: Array<{role: string; content: string}>) =>
  request<DetectIntentResult>("/voice/detect-intent", {
    method: "POST",
    body: JSON.stringify({ transcript, language, messages: messages || null }),
  });

// --- User & Payment types ---

export interface BalanceInfo { balance: number; name: string; }
export interface PaymentTransaction { id: number; type: string; amount: number; recipient: string | null; reference: string | null; status: string; created_at: string; }
export interface TransferResult { success: boolean; balance: number; transaction_id: number | null; warnings: string[]; message: string; }
export interface PayResult { success: boolean; balance: number; transaction_id: number | null; message: string; }

export interface DemoAccount { id: number; name: string; phone: string; language: string; balance: number; active: boolean; }

export const getAccounts = () => request<DemoAccount[]>("/user/accounts");
export const switchAccount = (userId: number) => request<{ id: number; name: string; balance: number; language: string }>(`/user/switch?user_id=${userId}`, { method: "POST" });
export const resetAccounts = () => request<{ balance: number; message: string }>("/user/reset", { method: "POST" });

export const getBalance = () => request<BalanceInfo>("/user/balance");
export const getTransactions = () => request<PaymentTransaction[]>("/user/transactions");
export const postTransfer = (recipient: string, amount: number, reference: string = "") =>
  request<TransferResult>("/user/transfer", { method: "POST", body: JSON.stringify({ recipient, amount, reference }) });
export const postPayment = (type: string, amount: number, details: Record<string, unknown> = {}) =>
  request<PayResult>("/user/pay", { method: "POST", body: JSON.stringify({ type, amount, details }) });
