# FormBuddy — Voice-Powered AI Agent for TNG eWallet

> **TNG Digital FinHack 2026 | Track 1: Financial Inclusion**

**Live Demo**: [https://main.d3is7aj4mo28yv.amplifyapp.com](https://main.d3is7aj4mo28yv.amplifyapp.com)

---

## The Problem

8 million Malaysians can't use digital payments — not because they don't have phones, but because they can't fill the forms. Elderly, migrant workers, and low-literacy communities are excluded from digital financial services.

## The Solution

**FormBuddy** is a built-in AI assistant inside TNG eWallet. Users speak naturally in any language — Malay, English, Chinese, Tamil, or rojak — and the AI understands what they want to do, fills in the screens, confirms with biometric, and executes. Real money moves. Real fraud checks run.

```
Uncle: "Nak pump minyak RON95 lima puluh"
AI:    Fuel Payment → RON95 → RM50 → Tap to verify (Face ID) → Balance deducts → Done
```

### Two Ways to Use

**Manual** — Tap Transfer, Fuel, Reload, Bills, Scan buttons for proper form UIs with validation.

**Voice** — Tap the floating mic button, speak naturally. AI detects intent, auto-fills screens, confirms with biometric, executes.

Both paths use the same backend. Same real balance. Same fraud checks.

### 14 Supported Actions

| Payments | Financial | Lifestyle |
|----------|-----------|-----------|
| Fuel Payment | GO+ Savings | Buy Tickets |
| Fund Transfer | GOpinjam Loan | Food Delivery |
| Pay Bills | Insurance | Donations |
| Scan & Pay | Check Balance | |
| Prepaid Reload | Toll / RFID | |
| Parking | | |

## Architecture

```
Browser (HTTPS)                    AWS Singapore              Alibaba Cloud KL
┌─────────────────┐    ┌──────────────────────────┐    ┌──────────────────┐
│ React + Tailwind │───▶│ API Gateway → Lambda     │───▶│ RDS MySQL 8.0    │
│ Web Speech API   │    │ Bedrock Claude Sonnet 4  │    │ (OceanBase-      │
│ STT + TTS (4 lang)│   │ tool_use (structured JSON)│    │  compatible)     │
│ AWS Amplify      │    │ Fraud detection          │    │ Kuala Lumpur     │
└─────────────────┘    └──────────────────────────┘    └──────────────────┘
```

**Multi-cloud by design**: Data stays in Malaysia on Alibaba Cloud. Compute + AI on AWS Singapore. Terraform unifies deployment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI Agent** | Bedrock Claude Sonnet 4.6 (tool_use for structured JSON) |
| **Backend** | FastAPI + Mangum on AWS Lambda (Python 3.12) |
| **Database** | Alibaba Cloud RDS MySQL 8.0 (Kuala Lumpur) |
| **Frontend** | React 19 + TypeScript + Tailwind 4 + Vite 8 |
| **Hosting** | AWS Amplify (HTTPS) + API Gateway HTTP API |
| **Voice** | Web Speech API (browser-native STT/TTS, 5 languages + auto-detect) |
| **IaC** | Terraform (AWS + Alibaba Cloud providers) |

## Key Features

- **Voice-first**: Speak in BM, EN, ZH, Cantonese, TA — AI auto-detects language and responds in kind
- **Multi-turn conversation**: Say "I need help" → AI asks clarifying questions → understands after back-and-forth
- **Speech-to-speech**: AI speaks back confirmation via TTS after processing
- **Real transactions**: Balance deducts, transaction history persists in Alibaba Cloud RDS
- **Fraud detection**: Flags large amounts (>RM500), high-balance-usage (>80%), first-time recipients
- **Biometric verification**: Tap-to-verify (Face ID / Touch ID / PIN mock) before execution
- **Proper form UIs**: Transfer, Fuel, Reload, Bills, Scan — each with validation and real API calls
- **Generic TaskPage**: Actions without dedicated UIs get auto-generated forms from flow definitions
- **Action flow simulator**: Voice commands auto-fill screens with typewriter animation
- **14 TNG actions**: Covers payments, transfers, bills, fuel, GO+, GOpinjam, and more
- **Account switcher**: 5 demo users with different balances and languages for demo day
- **Auto language detection**: AI detects language from transcript, responds in same language
- **TNG-branded UI**: Pixel-matched home, GOfinance, eShop pages with real APK assets
- **Fully deployed**: No local dependencies — judges open the URL on their phone

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/user/balance | Real balance from RDS |
| GET | /api/v1/user/transactions | Transaction history |
| POST | /api/v1/user/transfer | Transfer with fraud checks |
| POST | /api/v1/user/pay | Fuel/reload/bill/scan payment |
| POST | /api/v1/user/reset | Reset demo balance to RM1,234.56 |
| POST | /api/v1/voice/detect-intent | AI intent detection (14 actions) |
| POST | /api/v1/voice/extract | Voice-to-form field extraction |

## Live URLs

| Service | URL |
|---------|-----|
| Frontend (HTTPS) | https://main.d3is7aj4mo28yv.amplifyapp.com |
| Backend API | https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com |
| Database | finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com |
| GitHub | https://github.com/acruxn/MTsssss |

## Project Structure

```
├── backend/              # FastAPI + Bedrock AI + Mangum Lambda handler
│   ├── api/routes/       # user.py (balance/transfer/pay), analysis.py (voice), forms, dashboard
│   ├── services/         # ai_service.py (Bedrock tool_use), fraud_service.py
│   ├── models/           # User, FormTemplate, VoiceSession, Transaction
│   └── core/             # config, database
├── frontend/             # React 19 + TypeScript + Tailwind 4
│   ├── src/pages/        # TNGHome, Agent, GOfinance, eShop, Transfer, Fuel, Reload, Bill, Balance, Scan, Services
│   ├── src/components/   # AppShell (tab bar), ActionFlow (auto-fill simulator)
│   ├── src/lib/          # api.ts, flows.ts (14 actions), speech.ts (TTS)
│   └── public/tng/       # Real TNG assets (APK icons, CDN images)
├── infra/                # Terraform (AWS + Alibaba Cloud)
├── docs/                 # MASTER_PLAN.md (source of truth), pitch deck
└── scripts/              # deploy-lambda.sh, source-creds.sh
```

## Why This Wins

1. **The demo moment** — Uncle speaks rojak, AI pays for fuel, balance deducts. Real.
2. **Real problem** — BNM Financial Inclusion Framework identifies this exact gap
3. **Not just voice** — Full form UIs + voice agent, same backend, same real data
4. **Genuine multi-cloud** — Alibaba Cloud (data, Malaysia) + AWS (compute + AI, Singapore)
5. **Production-grade** — Fraud detection, biometric verification, transaction history
6. **Sponsor alignment** — Alibaba Cloud RDS, AWS Bedrock, Terraform

---

*Built for TNG Digital FinHack 2026. Track 1: Financial Inclusion.*
