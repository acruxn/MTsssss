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

  if (actionType === "pay_toll") {
    return {
      title: "Toll Payment", icon: "🛣️",
      steps: [
        { label: "Vehicle", field: "vehicle", value: s(fields.vehicle), type: "input", autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "50", type: "input", autoAdvanceMs: 800 },
        { label: `Top up RM${amt || "50"} RFID?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Top-up Successful", type: "receipt" },
      ],
    };
  }

  if (actionType === "pay_parking") {
    return {
      title: "Parking Payment", icon: "🅿️",
      steps: [
        { label: "Location", field: "location", value: s(fields.location), type: "input", autoAdvanceMs: 800 },
        { label: "Duration", field: "duration", value: s(fields.duration) || "1 hour", type: "input", autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "4", type: "input", autoAdvanceMs: 800 },
        { label: `Pay RM${amt || "4"} parking?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Payment Successful", type: "receipt" },
      ],
    };
  }

  if (actionType === "buy_insurance") {
    return {
      title: "Insurance", icon: "🛡️",
      steps: [
        { label: "Insurance Type", field: "insurance_type", value: s(fields.insurance_type), type: "input", autoAdvanceMs: 800 },
        { label: "Coverage", field: "coverage", value: s(fields.coverage), type: "input", autoAdvanceMs: 800 },
        { label: `Purchase ${s(fields.insurance_type) || "insurance"}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Purchase Successful", type: "receipt" },
      ],
    };
  }

  if (actionType === "apply_loan") {
    return {
      title: "GOpinjam Loan", icon: "💳",
      steps: [
        { label: "Loan Amount (RM)", field: "amount", value: amt || "500", type: "input", autoAdvanceMs: 800 },
        { label: "Tenure", field: "tenure", value: s(fields.tenure) || "3 months", type: "input", autoAdvanceMs: 800 },
        { label: `Apply RM${amt || "500"} loan?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Application Submitted", type: "receipt" },
      ],
    };
  }

  if (actionType === "invest") {
    return {
      title: "GO+ Investment", icon: "📈",
      steps: [
        { label: "Amount (RM)", field: "amount", value: amt || "100", type: "input", autoAdvanceMs: 800 },
        { label: "Product", field: "product", value: s(fields.product) || "GO+", type: "input", autoAdvanceMs: 800 },
        { label: `Invest RM${amt || "100"} in ${s(fields.product) || "GO+"}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Investment Successful", type: "receipt" },
      ],
    };
  }

  if (actionType === "buy_ticket") {
    return {
      title: "Buy Ticket", icon: "🎫",
      steps: [
        { label: "Type", field: "type", value: s(fields.type) || "Movie", type: "input", autoAdvanceMs: 800 },
        { label: "Destination", field: "destination", value: s(fields.destination), type: "input", autoAdvanceMs: 800 },
        { label: "Date", field: "date", value: s(fields.date), type: "input", autoAdvanceMs: 800 },
        { label: `Book ${s(fields.type) || "ticket"}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Booking Confirmed", type: "receipt" },
      ],
    };
  }

  if (actionType === "food_delivery") {
    return {
      title: "Food Delivery", icon: "🍔",
      steps: [
        { label: "Restaurant", field: "restaurant", value: s(fields.restaurant), type: "input", autoAdvanceMs: 800 },
        { label: "Items", field: "items", value: s(fields.items), type: "input", autoAdvanceMs: 800 },
        { label: `Order from ${s(fields.restaurant) || "restaurant"}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Order Placed", type: "receipt" },
      ],
    };
  }

  if (actionType === "donate") {
    return {
      title: "Donation", icon: "❤️",
      steps: [
        { label: "Organization", field: "organization", value: s(fields.organization), type: "input", autoAdvanceMs: 800 },
        { label: "Amount (RM)", field: "amount", value: amt || "10", type: "input", autoAdvanceMs: 800 },
        { label: `Donate RM${amt || "10"} to ${s(fields.organization) || "charity"}?`, type: "confirm" },
        { label: "Confirm with Face ID", type: "biometric", autoAdvanceMs: 1500 },
        { label: "Donation Successful", type: "receipt" },
      ],
    };
  }

  return null;
}
