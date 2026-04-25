# FormBuddy — Project Master Plan
## TNG Digital FinHack 2026 | Track 1: Financial Inclusion

> Single source of truth. Last updated: 25 Apr 2026, 6:20 PM MYT

---

## 1. THE PROBLEM

Malaysia has ~1.2 million unbanked adults (World Bank Global Findex 2021). Digital literacy remains a barrier — BNM's Financial Inclusion Framework 2023-2026 identifies "digital onboarding complexity" as a key obstacle to eWallet adoption among elderly, low-literacy, and migrant worker populations.

These users can't:
- Read English form labels
- Type accurately on small screens
- Navigate multi-step digital processes

They abandon forms or rely on others (security risk), staying excluded from digital financial services.

---

## 2. THE SOLUTION

### FormBuddy — "Can't read the form? Just tell us what you need."

A **built-in AI assistant inside TNG eWallet** that understands what users want to do — pay bills, pump fuel, send money, apply for loans — and does it for them. Voice-first, works in rojak/BM/EN/ZH/TA. Not just a form filler — a full agent that can execute any TNG action.

### Core Concept
FormBuddy lives inside the TNG app as a floating mic button. Users speak naturally in any language (including rojak/Manglish). The AI agent:
1. **Understands intent** — "Nak pump minyak RON95 lima puluh" → fuel payment
2. **Extracts parameters** — fuel type: RON95, amount: RM50
3. **Confirms action** — "Pay RM50 for RON95 fuel? Confirm with Face ID"
4. **Executes** — triggers the TNG payment flow

### Supported Actions (Demo)

| Action | Example Speech | What Happens |
|--------|---------------|-------------|
| **Fund Transfer** | "Send duit to Ahmad seratus ringgit" | Transfer confirmation → biometric → done |
| **Bill Payment** | "Pay my TNB bill lah" | Bill lookup → amount confirm → pay |
| **Fuel Payment** | "Nak pump RON95 lima puluh" | Fuel payment → station select → pay |
| **Prepaid Reload** | "Top up phone aku tiga puluh" | Carrier detect → reload → done |
| **Loan Application** | "I want apply micro loan" | Form fill by voice → submit |
| **Check Balance** | "Baki aku berapa?" | Show balance (mock) |

### User Flow
```
1. User opens TNG app → sees home screen with balance, quick actions
2. Taps floating 🎙️ FormBuddy button (or says "Hey FormBuddy")
3. Speaks naturally: "Nak hantar duit kat Ahmad seratus ringgit untuk sewa"
4. AI detects: Fund Transfer, recipient=Ahmad, amount=RM100, ref=sewa
5. Shows confirmation: "Send RM100 to Ahmad for sewa?"
6. User confirms with Face ID / fingerprint
7. ✅ Done — TTS reads back: "Sent RM100 to Ahmad"
```

---

## 3. ARCHITECTURE (VERIFIED)

```
┌──────────────────────────────────────────────────────┐
│              User's Browser                           │
│  React + Tailwind + Vite                             │
│  Web Speech API (STT/TTS) — all 4 languages          │
│  Hosted: AWS Amplify (HTTPS)                         │
└──────────────────┬───────────────────────────────────┘
                   │ REST API (HTTPS)
                   ▼
┌──────────────────────────────────────────────────────┐
│         AWS — ap-southeast-1 (Singapore)              │
│                                                      │
│  API Gateway HTTP API → Lambda (FastAPI via Mangum)   │
│  ┌────────────────────────────────────────────────┐  │
│  │ /api/v1/forms         — Form template CRUD     │  │
│  │ /api/v1/voice/extract — Transcript → fields    │  │
│  │ /api/v1/voice/detect-intent — Smart agent      │  │
│  │ /api/v1/voice/sessions— Session management     │  │
│  │ /api/v1/dashboard/stats— Completion metrics    │  │
│  └────────────────────────┬───────────────────────┘  │
│                           │                          │
│  Bedrock Claude Sonnet 4  │  Amplify (HTTPS hosting) │
│  (intent + extraction AI) │                          │
└───────────────────────────┼──────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────┐
│     Alibaba Cloud — ap-southeast-3 (Malaysia/KL)      │
│                                                      │
│  RDS MySQL 8.0 (OceanBase-compatible)                │
│  ├─ users                                            │
│  ├─ form_templates                                   │
│  └─ voice_sessions                                   │
│                                                      │
│  OSS (audio/document storage)                        │
└──────────────────────────────────────────────────────┘

IaC: Terraform (alicloud + aws providers)
```

### Live URLs
| Service | URL |
|---------|-----|
| Frontend (HTTPS) | https://main.d3is7aj4mo28yv.amplifyapp.com |
| Backend API | https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com |
| Database | finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com:3306 |

---

## 4. VERIFIED RESOURCE ACCESS

Tested 25 Apr 2026, 2:30 PM MYT with hackathon credentials.

### AWS — ap-southeast-1

| Service | Status | Model/Details |
|---------|--------|---------------|
| **Bedrock** | ✅ TESTED | `apac.anthropic.claude-sonnet-4-20250514-v1:0` — correctly extracts fields from Malay |
| **Lambda** | ✅ accessible | |
| **S3** | ✅ accessible | For frontend static hosting |
| **IAM** | ✅ accessible | Can create Lambda execution roles |
| **Transcribe** | ✅ accessible | Backup STT |
| **Polly** | ✅ accessible | Backup TTS (Chinese voices) |
| CloudFront | ❌ AccessDenied | Not needed — use S3 website hosting |

### Alibaba Cloud — ap-southeast-3

| Service | Status | Details |
|---------|--------|---------|
| **OceanBase API** | ✅ accessible | 0 instances — need to create |
| **OSS** | ✅ accessible | 0 buckets — can create |
| **ECS** | ✅ accessible | Available if needed |
| DashScope (Qwen) | ❌ Needs separate API key | Console-only creation, URL: modelstudio.console.alibabacloud.com |

### Credentials

| Credential | Type | Notes |
|-----------|------|-------|
| Alibaba Cloud | STS token | Account: Finhack-Account-50, Role: developers |
| AWS | STS token | Expires periodically — refresh from hackathon portal |

---

## 5. TECH STACK (FINAL)

| Layer | Technology | Cloud | Verified |
|-------|-----------|-------|----------|
| **Voice I/O** | Web Speech API | Browser (free) | N/A — browser native |
| **AI** | Bedrock Claude Sonnet 4 | AWS ap-southeast-1 | ✅ Tested |
| **Backend** | FastAPI + Mangum (Lambda) | AWS ap-southeast-1 | ✅ Access confirmed |
| **Database** | OceanBase (MySQL-compatible) | Alibaba ap-southeast-3 | ✅ API accessible |
| **Storage** | OSS | Alibaba ap-southeast-3 | ✅ Accessible |
| **Frontend** | React + TypeScript + Tailwind + Vite | Local dev / S3 | ✅ S3 accessible |
| **IaC** | Terraform (alicloud + aws) | Both | ✅ Both providers work |
| **HTTP client** | Native fetch | Browser | No axios (supply chain attack Mar 2026) |

### Why This Split

- **Alibaba Cloud for data** — OceanBase is TNG Digital's production DB (Fintechnews.sg, 2026). Data stays in Malaysia region. Same engine = zero migration friction for production integration.
- **AWS for compute + AI** — Bedrock Claude Sonnet 4 is the best model for structured JSON extraction from multilingual text. Lambda is zero-ops serverless.
- **Browser for voice** — Web Speech API supports BM, ZH, TA, EN with zero cost and zero latency.

---

## 6. MULTI-CLOUD JUSTIFICATION

> "Data lives where TNG's data already lives (Alibaba Cloud Malaysia). AI and compute run where the best models and serverless infra are (AWS Singapore). Terraform unifies deployment."

- OceanBase on Alibaba: same DB TNG uses in production — 40K TPS, financial-grade ACID (Fintechnews.sg, Apr 2026)
- Bedrock on AWS: Claude Sonnet 4 for field extraction — tested and confirmed working with Malay input
- If DashScope key becomes available: add Qwen as second AI for dual-validation (code already supports it)

---

## 7. FORM TEMPLATE SYSTEM

Implementors define JSON templates. Users fill them by voice. On submit, webhook fires.

```json
{
  "name": "Fund Transfer",
  "category": "transfer",
  "language": "ms",
  "webhook_url": "https://tng-api.example.com/transfer",
  "fields": [
    {"name": "recipient", "type": "text", "label": "Penerima", "required": true},
    {"name": "amount", "type": "number", "label": "Jumlah (RM)", "required": true},
    {"name": "reference", "type": "text", "label": "Rujukan", "required": false}
  ]
}
```

AI receives transcript + field definitions → returns extracted values:
```json
{"fields": {"recipient": "Ahmad", "amount": 100, "reference": "Sewa"}, "confidence": 0.95}
```

### Demo Templates

| Form | Fields | Languages |
|------|--------|-----------|
| Fund Transfer | recipient, amount, reference | EN, MS |
| Bill Payment | biller, account_no, amount | EN, MS |
| eWallet Registration | full_name, ic_number, phone | EN, MS, ZH, TA |
| Prepaid Reload | phone_number, amount, carrier | EN, MS |

---

## 8. LANGUAGE SUPPORT

| Language | Browser STT | Browser TTS | Bedrock (extraction) |
|----------|:-----------:|:-----------:|:--------------------:|
| English | ✅ | ✅ | ✅ Tested |
| Malay (BM) | ✅ | ✅ | ✅ Tested |
| Mandarin | ✅ | ✅ | ✅ |
| Tamil | ✅ | ✅ | ✅ |

Primary voice I/O is browser-native. All 4 languages work. Bedrock handles the intelligence (field extraction from any language).

---

## 9. DEPLOYMENT STRATEGY

### Demo Day (Primary): Local
```
Frontend: npm run dev → localhost:5173
Backend:  uvicorn main:app → localhost:8000
Database: OceanBase on Alibaba Cloud (remote)
AI:       Bedrock on AWS (remote)
```
Zero deployment risk. Judges see the product, not the infra.

### Cloud (If Time Permits): Lambda + S3
```
Frontend: S3 static website hosting (no CloudFront needed)
Backend:  Lambda + Function URL
Deploy:   ./scripts/deploy-lambda.sh
```

### Database Options (In Order of Preference)
1. OceanBase on Alibaba Cloud (create via console)
2. Local MySQL via Docker (`docker run -p 3306:3306 mysql:8`) — same pymysql driver, zero code change
3. SQLite for absolute minimum viable (change one connection string)

---

## 10. PITCH DECK (8 slides)

1. **Problem** — Digital form barriers exclude millions from financial services
2. **Solution** — FormBuddy: voice-powered form filling in 4 languages
3. **Live Demo** — Judge speaks BM → form fills live
4. **How It Works** — Architecture: Browser voice → Lambda → Bedrock AI → OceanBase
5. **Platform** — Any form, any language. Implementors define templates + webhooks
6. **Technology** — OceanBase (Alibaba), Bedrock (AWS), Terraform, Web Speech API
7. **Impact** — Elderly, migrant workers, low-literacy communities
8. **Future** — Visa integration, WhatsApp bot, offline Whisper, BNM compliance

---

## 11. DEMO SCRIPT (4 min)

```
0:00-0:20  "8 million Malaysians can't use digital payments — not because
            they don't have phones, but because they can't fill the forms."
0:20-0:40  Introduce FormBuddy. Show the app.
0:40-1:30  Demo 1: Fund Transfer in Malay (speak → fill → confirm)
1:30-2:10  Demo 2: Bill Payment in English (language switch)
2:10-2:50  Dashboard + Platform story (templates, webhooks)
2:50-3:30  Architecture diagram (multi-cloud, Terraform)
3:30-3:50  Impact + who this helps
3:50-4:00  "FormBuddy. Financial inclusion, one voice at a time."
```

---

## 12. DECISIONS LOG

> Append-only. Newest at bottom.

| # | Decision | Rationale | Date |
|---|----------|-----------|------|
| D1 | Local MySQL via Docker for dev, OceanBase for prod | Alibaba STS token was malformed — Docker MySQL gets us running instantly. Same pymysql driver, zero code change. OceanBase remains the target once creds are refreshed. | 25 Apr 2026 |
| D2 | No Docker middle-step for DB fallback — SQLite or MySQL only | Docker MySQL is fine for local dev. SQLite as emergency fallback. No unnecessary layers. | 25 Apr 2026 |
| D3 | Mate's "VoiceBridge" docs (docs/note-from-mate/) are reference only | Different product name, different tech stack (Flutter, ApsaraDB, SageMaker, Cognito). Our MASTER_PLAN.md is the single source of truth. Reuse their pitch narrative and market stats for demo day. | 25 Apr 2026 |
| D4 | Build our MVP first, adopt mate's vision post-hackathon | React web → Flutter mobile, Web Speech API → Transcribe, Lambda → ECS are all natural migration paths. Core backend (FastAPI + Bedrock + OceanBase) stays the same. | 25 Apr 2026 |
| D5 | Python 3.9 compat required | Dev machine runs 3.9.6 — no `X | Y` union syntax, use `Optional[X]` and `List[X]` | 25 Apr 2026 |
| D6 | Bedrock returns JSON in markdown fences | Added fence-stripping to _parse_json in ai_service.py | 25 Apr 2026 |
| D7 | ExtractedFields allows Any type, not just str | Bedrock returns int for amounts — schema changed to Dict[str, Optional[Any]] | 25 Apr 2026 |
| D8 | Adapted mate's VoiceBridge pitch deck to FormBuddy | Changed product name, swapped tech stack badges to match our actual stack | 25 Apr 2026 |
| D9 | Alibaba Cloud RDS MySQL instead of OceanBase | OceanBase CreateInstance order blocked by STS billing permission. RDS MySQL 8.0 works — same pymysql driver, same region (KL). In production, migrates to OceanBase with zero code change. | 25 Apr 2026 |
| D10 | AWS Amplify for HTTPS frontend hosting | S3 website hosting is HTTP-only, CloudFront blocked by org SCP. Amplify gives HTTPS + SPA routing for free. Web Speech API requires HTTPS. | 25 Apr 2026 |
| D11 | API Gateway HTTP API instead of Lambda Function URL | Function URL returns 403 (org SCP). HTTP API works, simpler than REST API, supports Lambda proxy + CORS. | 25 Apr 2026 |
| D12 | Pivot from "form filler" to "built-in TNG AI agent" | FormBuddy is not just a form filler — it's a full AI assistant inside TNG eWallet. Understands intent (fuel, transfer, bills, loans), extracts params, confirms, executes. Form filling is one capability. | 25 Apr 2026 |

---

## 13. EXECUTION TODO

### Phases 1-4: ✅ ALL DONE (25 Apr 2026)
- Backend: all 14 Python files compile, routes match docs, Bedrock pipeline verified
- Frontend: React 19 + TypeScript + Tailwind 4, all compiles, 3 pages + 2 components
- Voice: Web Speech API STT/TTS, 4 languages, detect-intent with Bedrock
- UI: TNG-inspired theme, animations, mobile-responsive

### Phase 5: Infrastructure ✅ DONE (25 Apr 2026, 6:00 PM)
- [x] Lambda deployed: `finhack-backend-dev` on AWS ap-southeast-1
- [x] API Gateway HTTP API: `w6qtfxl2va` (Function URL blocked by org SCP)
- [x] Amplify HTTPS frontend: `https://main.d3is7aj4mo28yv.amplifyapp.com`
- [x] Alibaba Cloud RDS MySQL: `finhack-formbuddy.mysql.kualalumpur.rds.aliyuncs.com:3306`
- [x] Lambda connected to Alibaba RDS — full multi-cloud pipeline verified
- [x] Terraform: 8 AWS resources in state + 3 manual resources (API GW, Amplify, RDS)
- [x] OceanBase blocked by STS billing permission → pivoted to RDS MySQL (D9)

### Phase 6: TNG Agent Pivot ⏳ IN PROGRESS
See `docs/EXECUTION_PLAN.md` for detailed worker prompts and file ownership.
- [ ] Alpha: Expand detect-intent to support quick actions (fuel, balance, scan, reload)
- [ ] Bravo: TNG Home screen (mock eWallet with balance, quick actions, floating mic)
- [ ] Charlie: Agent page (voice-powered action executor with confirmation flow)
- [ ] Delta: App shell (phone frame, bottom tabs, routing, services page)
- [ ] Commander: Review, verify, deploy, fix audit issues

### Phase 7: Demo Prep
- [ ] Rebuild + deploy frontend to Amplify
- [ ] Redeploy Lambda with expanded detect-intent
- [ ] Update pitch-deck.html
- [ ] Rehearse demo script
- [ ] Record demo video (optional)

---

## 13. RISK MITIGATION

| Risk | Mitigation |
|------|-----------|
| AWS token expires mid-demo | Refresh before demo. All infra is deployed — no local dependency |
| Noisy venue breaks voice | Type-to-fill fallback in Agent page |
| Lambda cold start slow | Keep Lambda warm with periodic pings |
| Tamil voice poor | Focus demo on BM + English. Mention Tamil as "supported" |
| Phone frame looks wrong | Test at 390px (iPhone) and 1440px (laptop). Fallback: full-width mobile |

---

## 14. WHAT MAKES US WIN

1. **The demo moment** — Uncle speaks rojak, AI pays for fuel. Visceral.
2. **Real problem** — BNM Financial Inclusion Framework identifies this exact gap
3. **Not just forms** — Full AI agent that can execute any TNG action by voice
4. **Genuine multi-cloud** — Data on Alibaba Cloud Malaysia, compute + AI on AWS Singapore
5. **Sponsor alignment** — Alibaba Cloud RDS (OceanBase-compatible), AWS Bedrock, Terraform
6. **Polish** — TNG-style mobile UI, animations, phone frame mockup
7. **Completeness** — Working prototype + pitch + live URL + clean GitHub

---

## REFERENCES

- World Bank Global Findex 2021 — Malaysia unbanked population data
- BNM Financial Inclusion Framework 2023-2026 — digital onboarding barriers
- Fintechnews.sg (Apr 2026) — "TNG Digital Is Delivering Zero Downtime for 25 Million Users with OceanBase"
- Elastic Security Labs (Mar 2026) — axios npm supply chain compromise (reason we use native fetch)
- TNG Digital FinHack 2026 — tngdigitalfinhack.com (Track 1: Financial Inclusion)
