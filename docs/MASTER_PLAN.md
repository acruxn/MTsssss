# FormBuddy — Project Master Plan
## TNG Digital FinHack 2026 | Track 1: Financial Inclusion

> Single source of truth. Last updated: 25 Apr 2026, 8:40 PM MYT

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
│  │   └─ Bedrock tool_use (schema-enforced JSON)   │  │
│  │   └─ Retry logic (1 retry on failure)          │  │
│  │   └─ Actions: form_fill, fuel_payment,         │  │
│  │      check_balance, scan_pay, pin_reload       │  │
│  │ /api/v1/voice/sessions— Session management     │  │
│  │ /api/v1/dashboard/stats— Completion metrics    │  │
│  └────────────────────────┬───────────────────────┘  │
│                           │                          │
│  Bedrock Claude Sonnet 4  │  Amplify (HTTPS hosting) │
│  (tool_use for intent +   │  CloudWatch (5min warm)  │
│   extraction AI)          │                          │
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

Tested 25 Apr 2026, 8:30 PM MYT — all live and deployed.

### AWS — ap-southeast-1

| Service | Status | Details |
|---------|--------|---------|
| **Bedrock** | ✅ LIVE | `apac.anthropic.claude-sonnet-4-20250514-v1:0` — tool_use for structured JSON |
| **Lambda** | ✅ LIVE | `finhack-backend-dev`, 512MB, 60s timeout, Python 3.12 |
| **API Gateway** | ✅ LIVE | HTTP API `w6qtfxl2va` — primary backend entry point |
| **Amplify** | ✅ LIVE | `d3is7aj4mo28yv` — HTTPS frontend with SPA routing |
| **S3** | ✅ EXISTS | `finhack-frontend-dev` — superseded by Amplify |
| **IAM** | ✅ LIVE | `finhack-lambda-role-dev` with Bedrock invoke permission |
| **CloudWatch Events** | ✅ LIVE | `formbuddy-warmup` — pings Lambda every 5 min |
| CloudFront | ❌ Blocked | Org SCP — not needed (Amplify provides HTTPS) |

### Alibaba Cloud — ap-southeast-3

| Service | Status | Details |
|---------|--------|---------|
| **RDS MySQL** | ✅ LIVE | `rm-zf8cjweha7koh7btt` — finhack-formbuddy, MySQL 8.0, KL |
| OceanBase | ❌ Blocked | STS billing permission blocks CreateInstance order (D9) |
| OSS | ✅ Accessible | 0 buckets — available if needed |
| DashScope (Qwen) | ❌ | Needs separate API key from console |

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
| **AI Method** | Strands Agents SDK + tool_use (schema-enforced JSON) | AWS Bedrock | ✅ Reliable structured output |
| **Backend** | FastAPI + Mangum (Lambda) | AWS ap-southeast-1 | ✅ Live, 60s timeout |
| **Database** | RDS MySQL 8.0 (OceanBase-compatible) | Alibaba ap-southeast-3 | ✅ Live in KL |
| **Frontend** | React 19 + TypeScript + Tailwind 4 + Vite 8 | AWS Amplify (HTTPS) | ✅ Live |
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
| Bill Payment | biller, account_no, amount | EN |
| Prepaid Reload | phone_number, amount, carrier | EN |
| Bank Account Opening | full_name, ic_number, phone, account_type | EN, MS |

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

### Demo Day (Primary): Fully Deployed — No Local
```
Frontend: AWS Amplify (HTTPS) — https://main.d3is7aj4mo28yv.amplifyapp.com
Backend:  Lambda + API Gateway — https://w6qtfxl2va.execute-api.ap-southeast-1.amazonaws.com
Database: Alibaba Cloud RDS MySQL (KL) — finhack-formbuddy.mysql.kualalumpur.rds
AI:       Bedrock on AWS (tool_use, schema-enforced JSON)
Warmup:   CloudWatch pings Lambda every 5 min
```
Everything runs in the cloud. Zero local dependency. Judges can open the URL on their own phone.

### Database
- **Production**: Alibaba Cloud RDS MySQL 8.0 in Kuala Lumpur (live)
- **Migration path**: OceanBase — same pymysql driver, zero code change
- **Fallback**: SQLite at `/tmp/formbuddy.db` (Lambda auto-seeds on cold start)

---

## 10. PITCH DECK (8 slides)

1. **Problem** — Digital form barriers exclude millions from financial services
2. **Solution** — FormBuddy: voice-powered AI agent inside TNG eWallet
3. **Live Demo** — Judge speaks BM → AI pays for fuel live
4. **How It Works** — Architecture: Browser voice → Lambda → Bedrock AI (tool_use) → Alibaba RDS
5. **Platform** — Any TNG action by voice. Form filling is one capability.
6. **Technology** — Alibaba Cloud RDS (OceanBase-compatible), AWS Bedrock (tool_use), Terraform, Web Speech API
7. **Impact** — Elderly, migrant workers, low-literacy communities
8. **Future** — Visa integration, WhatsApp bot, offline Whisper, BNM compliance

---

## 11. DEMO SCRIPT (4 min)

```
0:00-0:20  "8 million Malaysians can't use digital payments — not because
            they don't have phones, but because they can't fill the forms."
0:20-0:40  Show TNG home screen. "FormBuddy lives inside TNG eWallet."
            Point to floating mic button. "Uncle just taps this."
0:40-1:30  Demo 1: Fuel Payment in Malay
            Tap mic → "Nak pump minyak RON95 lima puluh"
            AI returns: ⛽ Fuel Payment, RON95, RM50
            Confirm → Success animation
1:30-2:10  Demo 2: Fund Transfer in English
            Tap mic → "Send money to Ahmad one hundred ringgit for rent"
            AI returns: 💸 Fund Transfer, Ahmad, RM100, rent
            Confirm → Success
2:10-2:40  Demo 3: Quick — "Check my balance" → instant response
2:40-3:10  Show Services page. "Any TNG action, any language."
            Architecture: Browser → AWS Lambda → Bedrock AI → Alibaba Cloud RDS (KL)
3:10-3:40  Multi-cloud story: "Data stays in Malaysia on Alibaba Cloud.
            Compute + AI on AWS Singapore. Terraform unifies deployment."
3:40-3:55  Impact: elderly, migrant workers, low-literacy communities
3:55-4:00  "FormBuddy. Financial inclusion, one voice at a time."
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
| D13 | Bedrock tool_use instead of prompt-based JSON | Prompt-based JSON was unreliable (~50% — markdown fences, prose). Structured Outputs (output_config) not supported on apac. cross-region model. tool_use with forced tool_choice gives schema-enforced JSON ~90%+. Added retry logic for remaining edge cases. | 25 Apr 2026 |

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

### Phase 6: TNG Agent Pivot ✅ DONE (25 Apr 2026, 7:30 PM)
- [x] Alpha: Expand detect-intent — returns action_type (fuel_payment, check_balance, scan_pay, pin_reload, form_fill)
- [x] Bravo: TNGHome.tsx — mock eWallet home with balance, 2×3 quick actions, floating mic
- [x] Charlie: Agent.tsx — 5-phase voice agent (idle→listening→processing→confirm→success)
- [x] Delta: AppShell.tsx (phone frame + bottom tabs), Services.tsx, App.tsx routing
- [x] Commander: Reviewed, fixed TS error, deployed Lambda + Amplify
- [x] Live tested: fuel_payment ✅, check_balance ✅, form_fill ✅, scan_pay ✅

### Phase 7: Polish + Demo Prep ⏳ IN PROGRESS
- [x] Fix CSS animations (ripple-ring, popIn, eq-bar class not wired)
- [x] End-to-end live flow test (speak → confirm → success)
- [x] Mock Face ID / biometric confirmation step
- [x] TNG-branded app shell (yellow Scan, bottom tabs, FormBuddy pill)
- [x] TNG-authentic home screen (Reload/Transaction CTAs, promo banners)
- [x] Bedrock tool_use for reliable structured JSON
- [x] Retry logic (1 retry on Bedrock failure)
- [x] Lambda 60s timeout + CloudWatch 5min warmup
- [ ] Update pitch-deck.html with new screenshots
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
