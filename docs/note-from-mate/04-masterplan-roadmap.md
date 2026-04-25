# VoiceBridge — Masterplan & Roadmap
### From Hackathon MVP to Production at Scale

---

## Executive Summary

VoiceBridge will be developed in 4 phases over 12 months, starting with a hackathon MVP and scaling to a full production SDK integrated into TNG Digital's app. The strategy prioritizes **proving impact fast** (Phase 1), then **hardening for production** (Phase 2), **scaling reach** (Phase 3), and **building a platform** (Phase 4).

---

## Phase Overview

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ PHASE 1  │──▶│ PHASE 2  │──▶│ PHASE 3  │──▶│ PHASE 4  │
│ Hackathon│   │ Pilot    │   │ Scale    │   │ Platform │
│ MVP      │   │ Launch   │   │          │   │          │
│          │   │          │   │          │   │          │
│ 2 weeks  │   │ 3 months │   │ 4 months │   │ 5 months │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
  Apr 2026      May-Jul 2026   Aug-Nov 2026   Dec 2026-
                                               Apr 2027
```

---

## Phase 1: Hackathon MVP (2 Weeks)

**Goal:** Prove the concept works. Win the hackathon.

**Timeline:** April 2026

### Deliverables

| # | Deliverable | Status |
|---|-------------|--------|
| 1 | Flutter app with voice chat UI | 🔨 Build |
| 2 | BM + English speech recognition (Amazon Transcribe) | 🔨 Build |
| 3 | Conversational AI form filling (Amazon Bedrock Claude) | 🔨 Build |
| 4 | 1 form: Micro-insurance application (13 fields) | 🔨 Build |
| 5 | Visual confirmation screen | 🔨 Build |
| 6 | Live demo with real BM speech | 🔨 Build |
| 7 | Pitch deck + architecture docs | ✅ Done |

### Tech Stack (MVP)

```
Flutter App → AWS API Gateway (WebSocket) → AWS Lambda → Amazon Transcribe
                                                       → Amazon Bedrock (Claude)
                                                       → Amazon Polly (TTS)
                                                       → AliCloud ApsaraDB RDS
```

### Success Criteria
- [ ] User completes micro-insurance form via voice in < 3 minutes
- [ ] Works in BM and English
- [ ] IC number, phone, income correctly extracted and validated
- [ ] Judges see a working live demo

### Team Allocation

| Member | Focus |
|--------|-------|
| Dev 1 | Flutter app + voice capture UI |
| Dev 2 | AWS Lambda + API Gateway + Transcribe integration |
| Dev 3 | Bedrock prompt engineering + form extraction logic |
| Dev 4 | AliCloud DB setup + demo preparation |

---

## Phase 2: Pilot Launch (3 Months)

**Goal:** Deploy to real TNG users. Prove conversion lift with data.

**Timeline:** May — July 2026

### Milestone 2.1 — Production Hardening (Month 1)

| Task | Detail |
|------|--------|
| Security audit | AWS WAF, KMS encryption, PDPA compliance review |
| Error handling | Graceful fallbacks for STT failures, network drops |
| Session management | Save & resume via AliCloud Tair/Redis |
| Logging & monitoring | CloudWatch dashboards, X-Ray tracing |
| Load testing | Simulate 500 concurrent voice sessions |

### Milestone 2.2 — Pilot Deployment (Month 2)

| Task | Detail |
|------|--------|
| TNG integration | Embed VoiceBridge SDK into TNG app sandbox |
| User recruitment | 500 B40 users in Klang Valley pilot |
| Form expansion | Add microloan application (18 fields) |
| A/B testing | Voice flow vs. traditional form (same user cohort) |
| Feedback loop | In-app rating + post-completion survey |

### Milestone 2.3 — Pilot Analysis (Month 3)

| Metric | Target |
|--------|--------|
| Form completion rate (voice) | ≥ 65% (vs. ~35% baseline) |
| Average completion time | < 5 minutes |
| User satisfaction (NPS) | ≥ 40 |
| STT accuracy (BM) | ≥ 90% |
| Field extraction accuracy | ≥ 93% |

### Key Decisions After Phase 2
- Go/no-go for full rollout based on conversion data
- Language priority for Phase 3 (based on pilot demographics)
- Form priority for Phase 3 (based on TNG product team input)

---

## Phase 3: Scale (4 Months)

**Goal:** Roll out to all TNG users. Add languages and forms.

**Timeline:** August — November 2026

### Milestone 3.1 — Multilingual Expansion (Month 1-2)

| Language | Priority | Rationale |
|----------|----------|-----------|
| Mandarin | P1 | Large Chinese-Malaysian user base |
| Tamil | P1 | Indian-Malaysian community, high B40 overlap |
| Bahasa Indonesia | P2 | Migrant worker population |
| Nepali | P2 | Migrant worker population |

**Technical Work:**
- Fine-tune Whisper model on SageMaker for Malaysian Mandarin/Tamil accents
- Add custom vocabulary per language for financial terms
- Localize all voice prompts and explanations
- Code-switching detection (Manglish, Rojak)

### Milestone 3.2 — Form Expansion (Month 2-3)

| Form | Fields | Priority |
|------|--------|----------|
| Merchant onboarding | 15 | P1 |
| GO+ account opening | 8 | P1 |
| eKYC verification | 10 | P1 |
| BNPL application | 12 | P2 |
| Remittance setup | 9 | P2 |
| Dispute/complaint | 7 | P2 |

**Technical Work:**
- Form Schema Builder (admin tool) for TNG product teams
- Prompt Template Manager for per-form conversation customization
- Cross-form data reuse (fill once, apply to multiple products)

### Milestone 3.3 — Full Rollout (Month 3-4)

| Task | Detail |
|------|--------|
| Gradual rollout | 5% → 25% → 50% → 100% of TNG users |
| Performance scaling | ECS Fargate auto-scaling, SageMaker endpoint scaling |
| Regional optimization | CloudFront edge caching for Malaysian users |
| Monitoring | Real-time conversion dashboards, anomaly detection |

### Scale Targets

| Metric | Target |
|--------|--------|
| Daily active voice sessions | 50,000+ |
| Supported languages | 6 |
| Supported forms | 8+ |
| Form completion rate | ≥ 70% |
| P99 latency (end-to-end) | < 3s |

---

## Phase 4: Platform (5 Months)

**Goal:** Transform VoiceBridge from a feature into a platform.

**Timeline:** December 2026 — April 2027

### Milestone 4.1 — VoiceBridge SDK (Month 1-2)

Package VoiceBridge as a reusable SDK that any fintech can integrate:

```
┌─────────────────────────────────────────────┐
│           VoiceBridge SDK (Public)           │
│                                              │
│  voicebridge.init({                          │
│    apiKey: "vb_xxx",                         │
│    formSchema: myFormSchema,                 │
│    languages: ["ms", "en", "zh"],            │
│    theme: "tng"  // or custom                │
│  });                                         │
│                                              │
│  voicebridge.onComplete((data) => {          │
│    // structured form data                   │
│    submitToBackend(data);                    │
│  });                                         │
│                                              │
└─────────────────────────────────────────────┘
```

### Milestone 4.2 — Analytics Platform (Month 2-3)

Build insights dashboard for TNG product teams:

- **Conversion funnel** — where do users drop off, by language/form/field
- **Language insights** — which languages need better STT accuracy
- **Field difficulty** — which fields cause the most confusion
- **User segments** — behavior patterns by age, location, occupation
- **Product recommendations** — which financial products to suggest based on voice data

### Milestone 4.3 — Financial Literacy Engine (Month 3-4)

Expand the contextual tips into a full financial literacy layer:

- Personalized financial education during form filling
- "Learn while you apply" — explain each financial concept
- Post-application follow-up tips via push notification
- Gamification: "Financial Health Score" based on products applied for

### Milestone 4.4 — Partner Expansion (Month 4-5)

| Partner Type | Use Case |
|-------------|----------|
| Other e-wallets | License VoiceBridge SDK |
| Banks | Voice-assisted loan applications |
| Insurance companies | Voice-assisted claims filing |
| Government | Voice-assisted subsidy applications (BR1M, etc.) |
| Telcos | Voice-assisted plan sign-ups |

---

## Resource Plan

### Team Growth

| Phase | Team Size | Roles |
|-------|-----------|-------|
| Phase 1 (Hackathon) | 4 | 2 devs, 1 AI/ML, 1 product/design |
| Phase 2 (Pilot) | 6 | +1 backend dev, +1 QA |
| Phase 3 (Scale) | 10 | +2 ML engineers, +1 DevOps, +1 linguist |
| Phase 4 (Platform) | 15 | +2 frontend, +1 data engineer, +1 PM, +1 BD |

### AWS Cost Estimates (Monthly)

| Phase | Services | Est. Cost |
|-------|----------|-----------|
| Phase 1 | Lambda, Transcribe, Bedrock, API GW | ~$200 (free tier + minimal) |
| Phase 2 | + ECS, CloudWatch, WAF, KMS | ~$2,000 |
| Phase 3 | + SageMaker, CloudFront, scaling | ~$8,000 |
| Phase 4 | Full production, multi-region | ~$20,000 |

### Alibaba Cloud Cost Estimates (Monthly)

| Phase | Services | Est. Cost |
|-------|----------|-----------|
| Phase 1 | ApsaraDB RDS (basic) | ~$50 |
| Phase 2 | + Tair/Redis | ~$300 |
| Phase 3 | + AnalyticDB, read replicas | ~$1,500 |
| Phase 4 | Full production, HA | ~$4,000 |

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| STT accuracy too low for Malaysian dialects | High | Medium | Fine-tune Whisper on SageMaker with Malaysian speech data |
| Users don't trust voice for financial data | High | Medium | Transparent consent flow, "your voice is not stored" messaging |
| TNG integration delays | Medium | High | Build as standalone SDK first, integrate later |
| Alibaba DB latency from AWS | Medium | Low | VPC peering, connection pooling, caching layer |
| Regulatory pushback on voice data | High | Low | Proactive BNM engagement, PDPA compliance from day 1 |
| LLM hallucination in field extraction | High | Medium | Strict structured output, validation pipeline, confidence thresholds |
| Cost overrun on AI services | Medium | Medium | Caching, batching, model optimization, reserved capacity |

---

## Key Milestones Timeline

```
Apr 2026                                                          Apr 2027
  │                                                                  │
  ▼                                                                  ▼
  ┌──────┬──────────────┬────────────────────┬───────────────────────┐
  │ MVP  │    PILOT     │      SCALE         │      PLATFORM        │
  │      │              │                    │                       │
  │ ✦ Hackathon demo    │                    │                       │
  │      │ ✦ 500 users  │                    │                       │
  │      │ ✦ 2 forms    │                    │                       │
  │      │ ✦ A/B results│                    │                       │
  │      │              │ ✦ 6 languages      │                       │
  │      │              │ ✦ 8+ forms         │                       │
  │      │              │ ✦ 50K daily users  │                       │
  │      │              │ ✦ Full TNG rollout │                       │
  │      │              │                    │ ✦ SDK published       │
  │      │              │                    │ ✦ Analytics platform  │
  │      │              │                    │ ✦ Partner integrations│
  │      │              │                    │ ✦ Financial literacy  │
  └──────┴──────────────┴────────────────────┴───────────────────────┘
  2 wks     3 months          4 months              5 months
```

---

## Success Metrics (12-Month Targets)

| Metric | Current | Target |
|--------|---------|--------|
| Form completion rate (underserved users) | ~35% | ≥ 70% |
| New financial product applications (B40) | Baseline | +100K/year |
| Average application time | ~12 min | < 4 min |
| Languages supported | 0 | 6 |
| Forms supported | 0 | 8+ |
| Monthly active voice sessions | 0 | 500K |
| User satisfaction (NPS) | N/A | ≥ 50 |
| Revenue from recovered applications | $0 | ~RM25M/year |

---

*VoiceBridge: From hackathon idea to production platform in 12 months. Every phase delivers measurable value.*
