# FormBuddy — Voice-Powered AI Agent for TNG eWallet

> **TNG Digital FinHack 2026 | Track 1: Financial Inclusion**

🌐 **Live Demo**: [https://main.d3is7aj4mo28yv.amplifyapp.com](https://main.d3is7aj4mo28yv.amplifyapp.com)

---

## The Problem

8 million Malaysians can't use digital payments — not because they don't have phones, but because they can't fill the forms. Elderly, migrant workers, and low-literacy communities are excluded from digital financial services.

## The Solution

**FormBuddy** is a built-in AI assistant inside TNG eWallet. Users speak naturally in any language — Malay, English, Chinese, Tamil, or rojak — and the AI understands what they want to do, fills in the screens, confirms with biometric, and executes.

```
Uncle: "Nak pump minyak RON95 lima puluh"
AI:    ⛽ Fuel Payment → RON95 → RM50 → Confirm with Face ID → ✅ Done
```

### 14 Supported Actions

| Payments | Financial | Lifestyle |
|----------|-----------|-----------|
| ⛽ Fuel Payment | 📈 GO+ Savings | 🎫 Buy Tickets |
| 💸 Fund Transfer | 💳 GOpinjam Loan | 🍔 Food Delivery |
| 🧾 Pay Bills | 🛡️ Insurance | ❤️ Donations |
| 📷 Scan & Pay | 💰 Check Balance | |
| 📱 Prepaid Reload | | |
| 🛣️ Toll / RFID | | |
| 🅿️ Parking | | |

## Architecture

```
Browser (HTTPS)                    AWS Singapore              Alibaba Cloud KL
┌─────────────────┐    ┌──────────────────────────┐    ┌──────────────────┐
│ React + Tailwind │───▶│ API Gateway → Lambda     │───▶│ RDS MySQL 8.0    │
│ Web Speech API   │    │ Strands Agents SDK       │    │ (OceanBase-      │
│ TNG Mock UI      │    │ Bedrock Claude Sonnet 4  │    │  compatible)     │
│ AWS Amplify      │    │ tool_use (structured JSON)│    │ Kuala Lumpur     │
└─────────────────┘    └──────────────────────────┘    └──────────────────┘
```

**Multi-cloud by design**: Data stays in Malaysia on Alibaba Cloud. Compute + AI on AWS Singapore. Terraform unifies deployment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **AI Agent** | Strands Agents SDK + Bedrock Claude Sonnet 4 (tool_use) |
| **Backend** | FastAPI + Mangum on AWS Lambda (Python 3.12) |
| **Database** | Alibaba Cloud RDS MySQL 8.0 (Kuala Lumpur) |
| **Frontend** | React 19 + TypeScript + Tailwind 4 + Vite 8 |
| **Hosting** | AWS Amplify (HTTPS) + API Gateway HTTP API |
| **Voice** | Web Speech API (browser-native STT/TTS, 4 languages) |
| **IaC** | Terraform (AWS + Alibaba Cloud providers) |

## Key Features

- **Voice-first**: Speak in any language, AI understands intent
- **Action flow simulator**: Screens auto-fill like a human tapping through the app
- **Face ID mock**: Biometric confirmation before execution
- **14 TNG actions**: Covers payments, transfers, bills, fuel, GO+, GOpinjam, and more
- **TNG-branded UI**: Phone frame mockup with authentic bottom tabs, feature grid
- **Fully deployed**: No local dependencies — judges can open the URL on their phone

## Live URLs

| Service | URL |
|---------|-----|
| Frontend (HTTPS) | https://main.d3is7aj4mo28yv.amplifyapp.com |
| Backend API | https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com |
| Database | finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com |

## Project Structure

```
├── backend/              # FastAPI + Strands Agents + Bedrock
│   ├── services/         # AI service (Strands + tool_use)
│   ├── api/routes/       # REST endpoints
│   └── models/           # SQLAlchemy ORM
├── frontend/             # React + TypeScript + Tailwind
│   ├── src/pages/        # TNGHome, Agent, Services
│   ├── src/components/   # AppShell, ActionFlow
│   └── src/lib/          # API client, flows, speech
├── infra/                # Terraform (AWS + Alibaba)
├── docs/                 # MASTER_PLAN, EXECUTION_PLAN, design docs
└── scripts/              # Deploy, seed, credentials
```

## Why This Wins

1. **The demo moment** — Uncle speaks rojak, AI pays for fuel. Visceral.
2. **Real problem** — BNM Financial Inclusion Framework identifies this exact gap
3. **Not just forms** — Full AI agent that executes any TNG action by voice
4. **Genuine multi-cloud** — Alibaba Cloud (data, Malaysia) + AWS (compute + AI, Singapore)
5. **Production-grade AI** — Strands Agents SDK, Bedrock tool_use, retry logic
6. **Sponsor alignment** — Alibaba Cloud RDS, AWS Bedrock, Terraform

---

*Built for TNG Digital FinHack 2026. Track 1: Financial Inclusion.*
