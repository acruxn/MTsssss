# FormBuddy

**Voice-powered AI assistant for TNG eWallet** | TNG Digital FinHack 2026 — Track 1: Financial Inclusion

[Live Demo](https://main.d3is7aj4mo28yv.amplifyapp.com) · [API](https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com/health) · [Presentation Guide](docs/PRESENTATION_GUIDE.md)

---

## Problem

1.2 million Malaysians remain unbanked (World Bank Global Findex 2021). BNM's Financial Inclusion Framework 2023-2026 identifies digital onboarding complexity as a key barrier. Elderly, migrant workers, and low-literacy users cannot read English form labels, type accurately on small screens, or navigate multi-step digital processes. They abandon digital payments or rely on others — a security risk.

## Solution

FormBuddy is a built-in AI assistant inside TNG eWallet. Users speak naturally in any language — the AI understands intent, confirms with the user, verifies identity, and executes the transaction. No reading. No typing. No forms.

```
User:  "Nak pump minyak RON95 lima puluh"
AI:    "Baik! Bayar minyak RON95 RM50. Sahkan?"  [Confirm] [Cancel]
User:  taps Confirm → Touch ID → Done
AI:    "Siap! Baki RM1,184.56"
```

The assistant runs as a floating chat panel — the TNG app stays visible underneath. Manual form UIs remain available for every action. Both paths share the same backend, the same balance, and the same fraud checks.

---

## Architecture

```
                          ┌─────────────────────────────────────┐
                          │         User's Browser              │
                          │  React 19 · Tailwind 4 · Vite 8    │
                          │  Web Speech API (live subtitles)    │
                          │  MediaRecorder → AWS Transcribe     │
                          │  Hosted on AWS Amplify (HTTPS)      │
                          └──────────────┬──────────────────────┘
                                         │ REST / HTTPS
                    ┌────────────────────┼────────────────────┐
                    ▼                    ▼                    ▼
  ┌──────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐
  │   FormBuddy API      │ │   FinBuddy Loan API  │ │  AWS Transcribe    │
  │   (our backend)      │ │   (teammate)         │ │  Auto-language STT │
  │                      │ │                      │ │  en/ms/zh/ta       │
  │  API Gateway HTTP    │ │  API Gateway HTTP    │ └────────────────────┘
  │  Lambda · FastAPI    │ │  16 Lambdas          │
  │  Mangum · Python 3.12│ │  Credit scoring      │
  │                      │ │  BDA extraction      │
  │  Bedrock Claude      │ │  Loan disbursement   │
  │  Sonnet 4.6          │ │  Bedrock Nova        │
  │  (tool_use)          │ │                      │
  └──────────┬───────────┘ └──────────────────────┘
             │
             ▼
  ┌──────────────────────┐
  │  Alibaba Cloud RDS   │
  │  MySQL 8.0           │
  │  Kuala Lumpur region │
  │                      │
  │  users · transactions│
  │  form_templates      │
  │  voice_sessions      │
  └──────────────────────┘
```

Data stays in Malaysia on Alibaba Cloud. Compute and AI run on AWS Singapore. Terraform manages both clouds.

---

## Features

### Voice Assistant (ChatPanel)
- Floating chat panel overlays the TNG app — does not replace it
- Multi-turn conversation: vague requests get clarifying questions
- AWS Transcribe for auto-language detection (en, ms, zh, ta)
- Web Speech API provides live subtitles during recording
- In-chat execution: confirm, biometric verification, API call, receipt — all without leaving the chat
- TTS reads back confirmations in the detected language
- Natural voice selection (Samantha, Google voices) where available

### Transactions
- Real balance stored in Alibaba Cloud RDS (Kuala Lumpur)
- Balance deducts on every transaction, persists across sessions
- Transaction history with type labels and timestamps
- 5 demo accounts with different balances and preferred languages
- Account switcher with one-tap reset for demo day

### Security
- Biometric verification (Touch ID / Face ID / PIN) required before every transaction
- Fraud detection: large amounts (>RM500), high balance usage (>80%), first-time recipients
- Insufficient funds and negative amounts rejected
- HTTPS everywhere (Amplify, API Gateway, Bedrock)
- Encryption at rest (Alibaba RDS disk encryption, AWS KMS)

### AI
- AWS Bedrock Claude Sonnet 4.6 with tool_use for structured JSON
- 14 action types with Malay/English/Chinese/Tamil synonyms
- Conversation history (last 6 turns) sent for context
- Prefers action over chat — classifies as soon as intent is clear
- Auto-detects language from transcript, responds in same language

### Loan and BDA (teammate's backend)
- Credit score calculation from bank statement data
- Bank statement upload with AI extraction (Bedrock Nova)
- Loan application with tenure selection and monthly repayment calculation
- Loan history with status tracking (pending, active, rejected)
- Separate API Gateway with 16 Lambdas — integrated via LoanPage.tsx

### Manual Forms
- Dedicated pages: Transfer, Fuel, Reload, Bills, Scan, Balance
- Generic TaskPage for actions without dedicated UIs
- URL prefill support — voice assistant pre-fills forms via query params
- "Pre-filled by FormBuddy" banner when fields come from the assistant

---

## Supported Actions

| Category | Actions |
|----------|---------|
| Payments | Fund Transfer, Fuel Payment, Bill Payment, Scan and Pay, Prepaid Reload |
| Transport | Toll / RFID Top-up, Parking Payment |
| Financial | Check Balance, GO+ Investment, GOpinjam Loan, Insurance |
| Lifestyle | Buy Tickets, Food Delivery, Donations |

---

## Tech Stack

| Layer | Technology | Cloud |
|-------|-----------|-------|
| AI (intent) | Bedrock Claude Sonnet 4.6, tool_use | AWS ap-southeast-1 |
| AI (extraction) | Bedrock Nova | AWS ap-southeast-1 |
| STT | AWS Transcribe (auto-language) + Web Speech API (fallback) | AWS + Browser |
| TTS | Web Speech API with natural voice selection | Browser |
| Backend | FastAPI, Mangum, Python 3.12 | AWS Lambda |
| Loan Backend | 16 Lambdas (credit, extraction, disbursement) | AWS Lambda |
| Database | RDS MySQL 8.0 (OceanBase-compatible) | Alibaba Cloud KL |
| Frontend | React 19, TypeScript, Tailwind 4, Vite 8 | AWS Amplify |
| IaC | Terraform (aws + alicloud providers) | Both |

---

## API Reference

### FormBuddy API (`w6qtfxl2va`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user/balance` | Current balance and user name |
| GET | `/api/v1/user/transactions` | Transaction history (most recent first) |
| GET | `/api/v1/user/accounts` | List all demo accounts |
| POST | `/api/v1/user/transfer` | Transfer with fraud checks |
| POST | `/api/v1/user/pay` | Payment (fuel, bill, reload, etc.) |
| POST | `/api/v1/user/switch?user_id=N` | Switch active demo account |
| POST | `/api/v1/user/reset` | Reset all accounts to RM1,234.56 |
| POST | `/api/v1/voice/detect-intent` | AI intent detection with conversation history |
| POST | `/api/v1/voice/transcribe` | Audio transcription via AWS Transcribe |
| POST | `/api/v1/voice/extract` | Voice-to-form field extraction |

### Loan API (`ku63fvg2sc`) — teammate's backend, do not modify

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/credit/score` | Credit score from bank data |
| POST | `/upload/link` | Presigned S3 upload URL |
| POST | `/download/link` | Presigned S3 download URL |
| POST | `/extraction/extract` | AI extraction of bank statement |
| POST | `/extraction/confirm` | Confirm extracted data |
| POST | `/loan/apply` | Loan application and status |

---

## Project Structure

```
backend/
  api/routes/          analysis.py (voice/transcribe/detect-intent)
                       user.py (balance/transfer/pay/accounts)
                       transactions.py (forms CRUD)
                       dashboard.py (stats)
  services/            ai_service.py (Bedrock tool_use, 15 rules)
                       fraud_service.py (field extraction)
  models/              user, transaction, payment, alert
  core/                config (pydantic-settings), database (SQLAlchemy)
  main.py              FastAPI app + Mangum handler + auto-seed

frontend/
  src/pages/           TNGHome, GOfinance, EShop, Services
                       TransferPage, FuelPage, ReloadPage, BillPage
                       ScanPage, BalancePage, TaskPage, LoanPage
  src/components/      AppShell (tab bar, account switcher, floating mic)
                       ChatPanel (bottom sheet, multi-turn, biometric, execute)
                       ActionFlow (typewriter auto-fill, legacy)
  src/lib/             api.ts (fetch client), flows.ts (14 action flows)
                       speech.ts (TTS with natural voice selection)
  public/tng/          87 real TNG assets (APK vectors, CDN images)

infra/                 Terraform (aws + alicloud providers)
docs/                  MASTER_PLAN.md, PRESENTATION_GUIDE.md, pitch deck
scripts/               deploy-lambda.sh, source-creds.sh
```

---

## Running Locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

Requires: Python 3.12, Node 20+, AWS credentials (Bedrock access), Alibaba Cloud RDS connectivity.

---

## Deployment

Frontend is hosted on AWS Amplify. Backend runs on AWS Lambda behind API Gateway. Database is Alibaba Cloud RDS MySQL in Kuala Lumpur. See `docs/MASTER_PLAN.md` for full deployment commands.

---

## Team

Built for TNG Digital FinHack 2026. Track 1: Financial Inclusion.

**FormBuddy** — financial inclusion, one voice at a time.
