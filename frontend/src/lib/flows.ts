export interface FlowStep {
  label: string;
  field?: string;
  value?: string;
  type: "input" | "select" | "confirm" | "biometric" | "receipt";
  options?: string[];
  autoAdvanceMs?: number;
}

export interface ActionFlow {
  title: string;
  icon: string;
  steps: FlowStep[];
}

type F = Record<string, unknown>;
const s = (v: unknown) => (v != null ? String(v) : "");

export function getFlow(actionType: string, fields: F): ActionFlow | null {
  const amt = s(fields.amount || fields.jumlah);

  if (actionType === "fuel_payment") {
    const fuel = s(fields.fuel_type) || "RON95";
    return {
      title: "Fuel Payment", icon: "⛽",
      steps: [
        { label: "Fuel Type", field: "fuel_type", value: fuel, type: "input", autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "50", type: "input", autoAdvanceMs: 800 },
        { label: "Station", field: "station", value: s(fields.station) || "Nearest station", type: "input", autoAdvanceMs: 800 },
        { label: `Pay RM${amt || "50"} for ${fuel}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Payment Successful", type: "receipt" },
      ],
    };
  }

  if (actionType === "check_balance") {
    return {
      title: "Check Balance", icon: "💰",
      steps: [{ label: "Your Balance", value: "RM 1,234.56", type: "receipt" }],
    };
  }

  if (actionType === "scan_pay") {
    const merchant = s(fields.merchant) || "Merchant";
    return {
      title: "Scan & Pay", icon: "📷",
      steps: [
        { label: "Merchant", field: "merchant", value: merchant, type: "input", autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "0", type: "input", autoAdvanceMs: 800 },
        { label: `Pay RM${amt || "0"} to ${merchant}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Payment Successful", type: "receipt" },
      ],
    };
  }

  if (actionType === "pin_reload") {
    const phone = s(fields.phone) || "";
    const carrier = s(fields.carrier) || "Maxis";
    return {
      title: "Prepaid Reload", icon: "📱",
      steps: [
        { label: "Phone Number", field: "phone", value: phone, type: "input", autoAdvanceMs: 800 },
        { label: "Carrier", field: "carrier", value: carrier, type: "select", options: ["Maxis", "Celcom", "Digi", "U Mobile"], autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "30", type: "input", autoAdvanceMs: 800 },
        { label: `Reload RM${amt || "30"} to ${phone} (${carrier})?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Reload Successful", type: "receipt" },
      ],
    };
  }

  // form_fill with transfer-like template
  if (actionType === "form_fill" || actionType === "fund_transfer") {
    const recipient = s(fields.recipient || fields.penerima) || "";
    const ref = s(fields.reference || fields.rujukan) || "";
    if (recipient || actionType === "fund_transfer") {
      return {
        title: "Fund Transfer", icon: "💸",
        steps: [
          { label: "Recipient", field: "recipient", value: recipient, type: "input", autoAdvanceMs: 800 },
          { label: "Amount (RM)", field: "amount", value: amt || "0", type: "input", autoAdvanceMs: 800 },
          { label: "Reference", field: "reference", value: ref, type: "input", autoAdvanceMs: 800 },
          { label: `Send RM${amt || "0"} to ${recipient}?`, type: "confirm" },
          { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
          { label: "Transfer Successful", type: "receipt" },
        ],
      };
    }
  }

  // bill_payment
  if (actionType === "bill_payment") {
    const biller = s(fields.biller) || "";
    return {
      title: "Bill Payment", icon: "🧾",
      steps: [
        { label: "Biller", field: "biller", value: biller, type: "input", autoAdvanceMs: 800 },
        { label: "Account Number", field: "account_no", value: s(fields.account_no), type: "input", autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "0", type: "input", autoAdvanceMs: 800 },
        { label: `Pay RM${amt || "0"} to ${biller}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Payment Successful", type: "receipt" },
      ],
    };
  }

  return null;
}
