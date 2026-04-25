# FormBuddy 🎙️

**Can't read the form? Just tell us what you need.**

*TNG Digital FinHack 2026 — Track 1: Financial Inclusion*

---

## The Problem

Malaysia has ~1.2 million unbanked adults (World Bank Global Findex 2021). Digital literacy remains a barrier — many elderly, low-literacy, and migrant worker populations can't read English form labels, type accurately on small screens, or navigate multi-step digital processes. They abandon eWallet onboarding forms or rely on others (a security risk), staying excluded from digital financial services.

## The Solution

FormBuddy is a voice-powered form assistant. Users speak in their language (English, Malay, Chinese, Tamil) → AI extracts structured form fields → the form auto-fills → voice reads back for confirmation. No typing, no reading required.

## Demo Flow

1. **Pick a form** — e.g. "Send Money", "Register Account"
2. 🔊 FormBuddy asks the first question in the user's language
3. 🎙️ User speaks: *"Ahmad, seratus ringgit, untuk sewa"*
4. AI extracts fields → form auto-fills: `Recipient [Ahmad]` `Amount [RM100]` `Reference [Sewa]`
5. 🔊 Reads back: *"Hantar RM100 ke Ahmad untuk sewa. Betul?"*
6. 🎙️ User confirms → ✅ Submitted

## Tech Stack

| Layer | Technology | Cloud |
|-------|-----------|-------|
| Voice I/O | Web Speech API | Browser |
| AI | Bedrock Claude Sonnet 4 | AWS ap-southeast-1 |
| Backend | FastAPI + Mangum (Lambda) | AWS |
| Database | OceanBase (MySQL-compatible) | Alibaba Cloud ap-southeast-3 |
| Frontend | React + TypeScript + Tailwind | Vite |
| IaC | Terraform | AWS + Alibaba |

## Architecture

```
┌──────────────────────────────────────────────────────┐
│              User's Browser                           │
│  React + Tailwind + Vite                             │
│  Web Speech API (STT/TTS) — all 4 languages          │
└──────────────────┬───────────────────────────────────┘
                   │ REST API
                   ▼
┌──────────────────────────────────────────────────────┐
│         AWS — ap-southeast-1 (Singapore)              │
│                                                      │
│  Lambda + Function URL (FastAPI via Mangum)           │
│  ┌────────────────────────────────────────────────┐  │
│  │ /api/v1/forms         — Form template CRUD     │  │
│  │ /api/v1/voice/extract — Transcript → fields    │  │
│  │ /api/v1/voice/sessions— Session management     │  │
│  │ /api/v1/dashboard     — Completion metrics     │  │
│  └────────────────────────┬───────────────────────┘  │
│                           │                          │
│  Bedrock Claude Sonnet 4  │  S3 (frontend hosting)   │
│  (field extraction AI)    │                          │
└───────────────────────────┼──────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────┐
│     Alibaba Cloud — ap-southeast-3 (Kuala Lumpur)     │
│                                                      │
│  OceanBase (MySQL-compatible)                        │
│  ├─ users                                            │
│  ├─ form_templates                                   │
│  └─ voice_sessions                                   │
│                                                      │
│  OSS (audio/document storage)                        │
└──────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Backend
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # fill in credentials
uvicorn main:app --reload

# Frontend
cd frontend && npm install && npm run dev

# Seed demo data
cd backend && python ../scripts/seed.py
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/forms` | List form templates |
| POST | `/api/v1/forms` | Create form template |
| GET | `/api/v1/forms/{id}` | Get form template |
| POST | `/api/v1/voice/sessions` | Start voice session |
| GET | `/api/v1/voice/sessions` | List sessions (filterable) |
| GET | `/api/v1/voice/sessions/{id}` | Get session status |
| POST | `/api/v1/voice/sessions/{id}/complete` | Complete session |
| POST | `/api/v1/voice/extract` | Extract fields from transcript |
| GET | `/api/v1/dashboard/stats` | Dashboard statistics |

## Screenshots

<!-- Add screenshots here -->

## Team

<!-- Add team members here -->

## License

MIT

---

Built for **TNG Digital FinHack 2026** — Track 1: Financial Inclusion
