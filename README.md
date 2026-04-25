# FormBuddy — TNG FinHack 2026

> Voice-powered form assistant for underserved eWallet users

**Track 1: Financial Inclusion** — Empowering unbanked and low-income communities through voice AI.

## Architecture

```
Users → React Frontend (AWS CloudFront)
         ↓ (audio stream)
      FastAPI Backend (AWS ECS Fargate)
         ↓                    ↓
  OceanBase (Alibaba)    Voice AI Pipeline
                         ├── Qwen Audio STT (speech → text)
                         ├── Qwen LLM (intent → form fields)
                         ├── Qwen Audio TTS (confirmation → speech)
                         └── Claude Bedrock (fallback LLM)
```

**Multi-cloud by design** — Alibaba Cloud for voice AI & data, AWS for compute & fallback AI. Terraform manages both.

## Tech Stack

| Layer | Technology | Cloud |
|-------|-----------|-------|
| Database | OceanBase | Alibaba Cloud |
| STT/TTS | Qwen Audio | Alibaba Cloud |
| Primary LLM | Qwen | Alibaba Cloud |
| Fallback LLM | Claude (Bedrock) | AWS |
| Backend | FastAPI + SQLAlchemy | AWS ECS |
| Frontend | React + Tailwind | AWS S3/CloudFront |
| IaC | Terraform | Both |

## Quick Start

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Fill in your credentials
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev

# Infrastructure
cd infra && terraform init && terraform plan
```

## How It Works

1. User taps mic and speaks in BM, Mandarin, Tamil, or English
2. Qwen Audio transcribes speech to text
3. Qwen LLM extracts intent and form fields as structured JSON
4. Frontend auto-fills the form
5. Qwen Audio reads back the filled form for voice confirmation
6. User confirms → form submits → transaction logged in OceanBase

## Team

TNG FinHack 2026 — Track 1: Financial Inclusion
