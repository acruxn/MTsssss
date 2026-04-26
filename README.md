# FormBuddy

Voice-powered AI assistant for TNG eWallet.

Built for [TNG Digital FinHack 2026](https://tngdigitalfinhack.com) -- Track 1: Financial Inclusion.

[Live Demo](https://main.d3is7aj4mo28yv.amplifyapp.com) / [API](https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com/health) / [Master Plan](docs/MASTER_PLAN.md) / [Presentation Guide](docs/PRESENTATION_GUIDE.md)

---

## What is this

8 million Malaysians can't use digital payments. Not because they don't have phones -- because they can't fill the forms.

FormBuddy is an AI assistant that lives inside TNG eWallet as a floating chat panel. Users tap the mic, speak in any language, and the assistant handles the rest -- understands intent, confirms the action, verifies identity, executes the transaction. The TNG app stays visible underneath the whole time.

It works in English, Malay, Mandarin, Cantonese, and Tamil. It handles transfers, fuel payments, bills, loans, and 10 other action types. Every transaction deducts real balance from a real database.

```
User:  "Nak pump minyak RON95 lima puluh"
AI:    "Baik! Bayar minyak RON95 RM50. Sahkan?"
       [Confirm] [Cancel]
User:  taps Confirm → Touch ID → Done
AI:    "Siap! Baki RM1,184.56"
```

Manual form UIs exist for every action too. Same backend, same balance, same fraud checks.

---

## How it works

```
Browser                         AWS (Singapore)                Alibaba Cloud (KL)
---------                       ---------------                ------------------
React + Tailwind                API Gateway → Lambda           RDS MySQL 8.0
Web Speech API (subtitles)      FastAPI + Mangum               users, transactions
MediaRecorder → Transcribe      Bedrock Sonnet 4.6             form_templates
AWS Amplify (HTTPS)             (tool_use, 15 rules)           voice_sessions
                                Fraud detection
                                AWS Transcribe (STT)
```

Data stays in Malaysia on Alibaba Cloud RDS -- same database engine TNG uses in production (OceanBase-compatible). Compute and AI run on AWS Singapore. Terraform manages both.

The voice pipeline: browser records audio via MediaRecorder, Web Speech API provides live subtitles while recording. On stop, if Web Speech got a transcript (works well for English/Malay), it goes straight to intent detection. If not (Chinese/Tamil), audio is sent to AWS Transcribe for server-side auto-language detection. Either way, the transcript hits Bedrock Claude Sonnet 4.6 with tool_use for structured JSON extraction.

The chat panel handles the full lifecycle: multi-turn conversation, confirmation with biometric verification (Touch ID mock), real API call, and receipt with updated balance -- all without leaving the chat.

---

## What it can do

**Payments:** Fund Transfer, Fuel, Bills, Scan & Pay, Prepaid Reload, Toll/RFID, Parking

**Financial:** Check Balance, GO+ Investment, GOpinjam Loan, Insurance

**Lifestyle:** Buy Tickets, Food Delivery, Donations

The loan flow integrates with a separate BDA backend (teammate's 16 Lambdas) for credit scoring, bank statement extraction via Bedrock Nova, and loan disbursement. Voice commands on the loan page trigger actions directly -- "confirm", "submit", "check score" -- without going through intent detection.

---

## Stack

| | What | Where |
|-|------|-------|
| AI | Bedrock Claude Sonnet 4.6 (tool_use) | AWS |
| STT | AWS Transcribe (auto-language) + Web Speech API | AWS + Browser |
| TTS | Web Speech API, natural voice selection | Browser |
| Backend | FastAPI, Mangum, Python 3.12 | AWS Lambda |
| Database | RDS MySQL 8.0 | Alibaba Cloud KL |
| Frontend | React 19, TypeScript, Tailwind 4, Vite 8 | AWS Amplify |
| Loan/BDA | 16 Lambdas, Bedrock Nova | AWS |
| IaC | Terraform | Both clouds |

---

## Security

Every transaction requires biometric verification before execution. Fraud detection flags large amounts (>RM500), high balance usage (>80%), and first-time recipients. Insufficient funds and negative amounts are rejected. All traffic is HTTPS. Data at rest is encrypted by both cloud providers.

---

## API

Two API Gateways:

**FormBuddy** (`w6qtfxl2va`) -- ours:

```
GET  /api/v1/user/balance           balance + user name
GET  /api/v1/user/transactions      transaction history
GET  /api/v1/user/accounts          demo account list
POST /api/v1/user/transfer          transfer with fraud checks
POST /api/v1/user/pay               fuel/bill/reload/scan payment
POST /api/v1/user/switch?user_id=N  switch demo account
POST /api/v1/user/reset             reset all to RM1,234.56
POST /api/v1/voice/detect-intent    AI intent detection
POST /api/v1/voice/transcribe       audio → AWS Transcribe
```

**Loan/BDA** (`ku63fvg2sc`) -- teammate's, do not modify:

```
POST /credit/score                  credit score calculation
POST /upload/link                   presigned S3 upload
POST /extraction/extract            bank statement AI extraction
POST /extraction/confirm            confirm extracted data
POST /loan/apply                    loan application + status
```

---

## Project layout

```
backend/
  api/routes/       user.py, analysis.py (voice + transcribe), dashboard.py
  services/         ai_service.py (Bedrock, 15 prompt rules), fraud_service.py
  models/           user, transaction, payment, alert
  core/             config, database
  main.py           FastAPI + Mangum + auto-seed

frontend/
  src/pages/        TNGHome, Transfer, Fuel, Reload, Bill, Scan, Balance,
                    Services, GOfinance, EShop, TaskPage, LoanPage
  src/components/   AppShell (tabs, account switcher, mic button)
                    ChatPanel (chat, biometric, execute, receipt)
  src/lib/          api.ts, flows.ts (14 actions), speech.ts (TTS)
  public/tng/       87 assets from TNG APK + CDN

infra/              Terraform (aws + alicloud)
docs/               MASTER_PLAN.md, PRESENTATION_GUIDE.md
```

---

## Running locally

```bash
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
cd frontend && npm install && VITE_API_URL=http://localhost:8000/api/v1 npm run dev
```

Needs Python 3.12, Node 20+, AWS credentials with Bedrock access, and Alibaba Cloud RDS connectivity.

---

## Why this wins

The demo moment is visceral: uncle speaks rojak Malay, the AI fills the form, balance deducts. Real money, real fraud checks, real database in Malaysia. Not a mockup.

BNM's Financial Inclusion Framework 2023-2026 identifies digital onboarding complexity as the barrier. FormBuddy removes it.

---

TNG Digital FinHack 2026. Track 1: Financial Inclusion.
