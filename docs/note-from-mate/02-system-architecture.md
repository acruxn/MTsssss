# VoiceBridge — System Architecture
### Technical Design Document

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        TNG DIGITAL APP                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    VoiceBridge SDK Layer                       │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌────────────────────────┐  │  │
│  │  │ Voice UI │  │ Visual Form  │  │ Confirmation Screen    │  │  │
│  │  │ Module   │  │ Preview      │  │ (Icon-based summary)   │  │  │
│  │  └────┬─────┘  └──────▲───────┘  └────────────▲───────────┘  │  │
│  │       │               │                       │               │  │
│  └───────┼───────────────┼───────────────────────┼───────────────┘  │
│          │               │                       │                  │
└──────────┼───────────────┼───────────────────────┼──────────────────┘
           │               │                       │
           ▼               │                       │
┌──────────────────────────┼───────────────────────┼──────────────────┐
│                    VOICEBRIDGE API GATEWAY (AWS API Gateway)         │
│  ┌───────────────┐  ┌────┴──────────┐  ┌────────┴───────────────┐  │
│  │ Auth & Rate   │  │ Session       │  │ Form Submission        │  │
│  │ Limiting      │  │ Manager       │  │ Handler                │  │
│  └───────┬───────┘  └───────┬───────┘  └────────────────────────┘  │
└──────────┼──────────────────┼───────────────────────────────────────┘
           │                  │
           ▼                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      CORE PROCESSING LAYER                          │
│                                                                     │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────────┐  │
│  │ Speech-to-  │  │ Conversation │  │ Form Intelligence         │  │
│  │ Text Engine │  │ AI Engine    │  │ Engine                    │  │
│  │ (Amazon     │  │ (Amazon      │  │                           │  │
│  │ Transcribe) │  │  Bedrock)    │  │ • Field Mapping           │  │
│  │ • Multi-    │  │ • Context    │  │ • Validation Rules        │  │
│  │   lingual   │  │   Tracking   │  │ • Auto-correction         │  │
│  │ • Streaming │  │ • Prompt     │  │ • Confidence Scoring      │  │
│  │ • Noise     │  │   Templates  │  │                           │  │
│  │   Reduction │  │ • Language   │  │                           │  │
│  │             │  │   Detection  │  │                           │  │
│  └──────┬──────┘  └──────┬───────┘  └─────────────┬─────────────┘  │
│         │               │                         │                 │
│         └───────────────┼─────────────────────────┘                 │
│                         │                                           │
└─────────────────────────┼───────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA & STORAGE LAYER                         │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Session      │  │ Form Schema  │  │ Analytics &              │  │
│  │ Store        │  │ Registry     │  │ Telemetry                │  │
│  │ (ElastiCache)│  │ (AliCloud    │  │ (AliCloud                │  │
│  │              │  │  ApsaraDB    │  │  AnalyticDB)             │  │
│  │              │  │  for RDS)    │  │                          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    TNG DIGITAL BACKEND (Existing)                    │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ KYC/eKYC     │  │ Product      │  │ Compliance               │  │
│  │ Service      │  │ Application  │  │ Engine                   │  │
│  │              │  │ APIs         │  │                          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Deep Dive

### 2.1 Client Layer — VoiceBridge SDK

```
┌─────────────────────────────────────────────────┐
│              VoiceBridge SDK (Mobile)            │
│                                                  │
│  ┌────────────────────────────────────────────┐  │
│  │            Voice Capture Module             │  │
│  │  • Microphone access & permissions          │  │
│  │  • Audio streaming (WebSocket)              │  │
│  │  • Voice Activity Detection (VAD)           │  │
│  │  • Noise cancellation (on-device)           │  │
│  └──────────────────┬─────────────────────────┘  │
│                     │                            │
│  ┌──────────────────▼─────────────────────────┐  │
│  │          UI Rendering Engine                │  │
│  │  • Chat bubble interface                    │  │
│  │  • Animated listening indicator             │  │
│  │  • Form preview cards                       │  │
│  │  • Icon-based confirmation screen           │  │
│  │  • Accessibility: large tap targets,        │  │
│  │    high contrast, screen reader support     │  │
│  └──────────────────┬─────────────────────────┘  │
│                     │                            │
│  ┌──────────────────▼─────────────────────────┐  │
│  │          Local Processing                   │  │
│  │  • Audio compression (Opus codec)           │  │
│  │  • Offline field validation cache           │  │
│  │  • Session state management                 │  │
│  │  • Secure local storage (encrypted)         │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Tech Stack:**
- Flutter SDK (cross-platform, matches TNG's existing stack)
- `flutter_sound` for audio capture
- WebSocket client for real-time streaming
- Hive/SecureStorage for encrypted local state

---

### 2.2 Speech-to-Text Engine

```
                    Audio Stream (Opus)
                          │
                          ▼
              ┌───────────────────────┐
              │   Language Detection   │
              │   (first 3 seconds)   │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │  Amazon Transcribe    │
              │  (Streaming API)      │
              │  + SageMaker Whisper  │
              │  (fine-tuned fallback)│
              │                       │
              │   Supported:          │
              │   • Bahasa Melayu     │
              │   • English           │
              │   • Mandarin          │
              │   • Tamil             │
              │   • Bahasa Indonesia  │
              │   • Nepali            │
              └───────────┬───────────┘
                          │
              ┌───────────▼───────────┐
              │  Malaysian Dialect    │
              │  Post-Processor       │
              │                       │
              │  • "lapan kosong" →   │
              │    "80"               │
              │  • "dua ribu lebih"   │
              │    → "~2000"          │
              │  • Rojak handling     │
              │  • Number normalization│
              └───────────┬───────────┘
                          │
                          ▼
                  Transcribed Text
                  + Language Tag
                  + Confidence Score
```

**Deployment:**
- Primary: Amazon Transcribe (real-time streaming, Malaysian BM support)
- Enhanced: Whisper Large V3 on Amazon SageMaker (custom fine-tuned for Malaysian dialects)
- Fallback: Amazon Transcribe with custom vocabulary for financial terms

---

### 2.3 Conversation AI Engine

```
┌─────────────────────────────────────────────────────────────┐
│                  Conversation AI Engine                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 Session Context Manager                 │  │
│  │                                                        │  │
│  │  {                                                     │  │
│  │    "session_id": "abc-123",                            │  │
│  │    "form_type": "micro_insurance",                     │  │
│  │    "language": "ms-MY",                                │  │
│  │    "fields_completed": 5,                              │  │
│  │    "fields_remaining": 8,                              │  │
│  │    "current_field": "monthly_income",                  │  │
│  │    "conversation_history": [...],                      │  │
│  │    "extracted_data": {                                 │  │
│  │      "full_name": "Siti binti Ahmad",                  │  │
│  │      "ic_number": "800214-06-5321",                    │  │
│  │      ...                                               │  │
│  │    }                                                   │  │
│  │  }                                                     │  │
│  └──────────────────────┬─────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼─────────────────────────────────┐  │
│  │              Prompt Template Engine                     │  │
│  │                                                        │  │
│  │  System Prompt:                                        │  │
│  │  "You are a friendly bank assistant helping a user     │  │
│  │   fill in a {form_type} application. Speak in          │  │
│  │   {language}. Ask about {current_field} next.          │  │
│  │   The user's profile: {user_context}.                  │  │
│  │   Explain terms simply. Be warm and patient."          │  │
│  │                                                        │  │
│  │  Field-Specific Prompts:                               │  │
│  │  • income → "Lebih kurang sebulan dapat berapa?"       │  │
│  │  • occupation → "Buat kerja apa sekarang?"             │  │
│  │  • address → "Alamat rumah di mana?"                   │  │
│  └──────────────────────┬─────────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼─────────────────────────────────┐  │
│  │              LLM Processing (Amazon Bedrock - Claude)   │  │
│  │                                                        │  │
│  │  Input:  Transcribed text + Session context            │  │
│  │  Output: Structured JSON                               │  │
│  │                                                        │  │
│  │  {                                                     │  │
│  │    "response_text": "Terima kasih! Saya letak...",     │  │
│  │    "extracted_fields": {                               │  │
│  │      "monthly_income": 2000,                           │  │
│  │      "income_confidence": 0.85                         │  │
│  │    },                                                  │  │
│  │    "next_question": "employment_type",                 │  │
│  │    "needs_clarification": false,                       │  │
│  │    "financial_tip": "Insurans mikro bermula RM5/bulan" │  │
│  │  }                                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 2.4 Form Intelligence Engine

```
┌──────────────────────────────────────────────────────────────┐
│                  Form Intelligence Engine                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Form Schema Registry                        │  │
│  │                                                          │  │
│  │  micro_insurance_v1:                                     │  │
│  │    fields:                                               │  │
│  │      - name: full_name                                   │  │
│  │        type: string                                      │  │
│  │        validation: "^[A-Za-z\\s@/]+$"                    │  │
│  │        required: true                                    │  │
│  │        voice_prompt_ms: "Nama penuh awak?"               │  │
│  │        voice_prompt_en: "What is your full name?"        │  │
│  │        explanation_ms: "Nama sama macam dalam IC"        │  │
│  │                                                          │  │
│  │      - name: ic_number                                   │  │
│  │        type: string                                      │  │
│  │        validation: "^\\d{6}-\\d{2}-\\d{4}$"              │  │
│  │        required: true                                    │  │
│  │        smart_parse: true  # "lapan kosong..." → digits   │  │
│  │                                                          │  │
│  │      - name: monthly_income                              │  │
│  │        type: currency_myr                                │  │
│  │        validation: "range(0, 100000)"                    │  │
│  │        fuzzy_parse: true  # "dua ribu lebih" → 2000     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Validation Pipeline                         │  │
│  │                                                          │  │
│  │  Input ──▶ Format Check ──▶ Range Check ──▶ Cross-field  │  │
│  │            (IC format)     (income > 0)    (age vs DOB)  │  │
│  │                                                          │  │
│  │         ──▶ Confidence Score ──▶ Accept / Ask Again      │  │
│  │             (threshold: 0.8)                              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Smart Suggestions                           │  │
│  │                                                          │  │
│  │  • "nasi lemak seller" → Occupation: Self-employed       │  │
│  │                          Sector: Food & Beverage         │  │
│  │  • "Kampung Baru" → Auto-fill postcode: 50300            │  │
│  │  • IC "800214-xx-xxxx" → DOB: 1980-02-14, Age: 46       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Data Flow — Complete Request Lifecycle

```
User speaks          VoiceBridge         STT Engine        Conv. AI         Form Engine        TNG Backend
    │                    │                   │                │                  │                  │
    │  Tap mic 🎤        │                   │                │                  │                  │
    │───────────────────▶│                   │                │                  │                  │
    │                    │  Stream audio     │                │                  │                  │
    │                    │──────────────────▶│                │                  │                  │
    │                    │                   │  Transcribe    │                  │                  │
    │                    │                   │───────────────▶│                  │                  │
    │                    │                   │                │  Extract fields  │                  │
    │                    │                   │                │─────────────────▶│                  │
    │                    │                   │                │                  │  Validate        │
    │                    │                   │                │  Validated data  │                  │
    │                    │                   │                │◀─────────────────│                  │
    │                    │  AI response +    │                │                  │                  │
    │                    │  next question    │                │                  │                  │
    │                    │◀─────────────────────────────────────                │                  │
    │  Show response     │                   │                │                  │                  │
    │  + play TTS        │                   │                │                  │                  │
    │◀───────────────────│                   │                │                  │                  │
    │                    │                   │                │                  │                  │
    │  ... (repeat for each field) ...       │                │                  │                  │
    │                    │                   │                │                  │                  │
    │  Confirm ✅         │                   │                │                  │                  │
    │───────────────────▶│                   │                │                  │                  │
    │                    │                   │                │  Submit form     │                  │
    │                    │─────────────────────────────────────────────────────▶│                  │
    │                    │                   │                │                  │  Process app     │
    │                    │                   │                │                  │─────────────────▶│
    │                    │                   │                │                  │  Confirmation    │
    │                    │                   │                │                  │◀─────────────────│
    │  Success! 🎉       │                   │                │                  │                  │
    │◀───────────────────│                   │                │                  │                  │
```

---

## 4. Tech Stack Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        TECH STACK                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  CLIENT                                                      │
│  ├── Flutter 3.x (cross-platform mobile SDK)                 │
│  ├── WebSocket (real-time audio streaming)                   │
│  ├── Opus Codec (audio compression)                          │
│  └── Hive (encrypted local storage)                          │
│                                                              │
│  API LAYER                                                   │
│  ├── AWS API Gateway (WebSocket + REST APIs)                 │
│  ├── AWS Lambda (serverless compute, Python)                 │
│  ├── Amazon Cognito (user authentication)                    │
│  └── AWS WAF (rate limiting, DDoS protection)                │
│                                                              │
│  AI / ML                                                     │
│  ├── Amazon Transcribe (real-time speech-to-text)            │
│  ├── Amazon Bedrock - Claude 3.5 (conversation + extraction) │
│  ├── Amazon Polly (text-to-speech, multilingual)             │
│  ├── Amazon SageMaker (custom Whisper model, fine-tuned)     │
│  └── Custom Malaysian dialect post-processor (Lambda)        │
│                                                              │
│  DATA (Alibaba Cloud — hackathon requirement)                │
│  ├── AliCloud ApsaraDB for RDS (form schemas, user data)    │
│  ├── AliCloud Tair/Redis (real-time session state, caching)  │
│  └── AliCloud AnalyticDB (analytics, conversion tracking)    │
│                                                              │
│  INFRASTRUCTURE (AWS)                                        │
│  ├── AWS ECS Fargate (container orchestration, serverless)   │
│  ├── AWS CloudFront (CDN, edge caching)                      │
│  ├── AWS ALB (Application Load Balancer)                     │
│  ├── Amazon S3 (static assets, form schema storage)          │
│  └── AWS VPC + PrivateLink (secure Alibaba DB connectivity)  │
│                                                              │
│  MONITORING (AWS)                                            │
│  ├── Amazon CloudWatch (metrics, alarms, dashboards)         │
│  ├── AWS X-Ray (distributed tracing)                         │
│  └── Amazon CloudWatch Logs (centralized logging)            │
│                                                              │
│  CI/CD                                                       │
│  ├── AWS CodePipeline (deployment pipeline)                  │
│  ├── AWS CodeBuild (build & test)                            │
│  └── AWS CDK (infrastructure as code)                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                            │
│                                                              │
│  Layer 1: Transport                                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • TLS 1.3 via AWS ACM (Certificate Manager)           │  │
│  │  • WSS (WebSocket Secure) via API Gateway              │  │
│  │  • Certificate pinning on mobile client                │  │
│  │  • AWS CloudFront with HTTPS-only origin               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Layer 2: Authentication                                     │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Amazon Cognito (user auth + TNG session bridging)   │  │
│  │  • VoiceBridge session JWT (short-lived, 15 min)       │  │
│  │  • AWS WAF rate limiting: 10 requests/min per user     │  │
│  │  • API Gateway API keys for service-to-service auth    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Layer 3: Data Protection                                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • Raw audio: processed in memory, NEVER persisted     │  │
│  │  • Transcribed text: encrypted at rest (AWS KMS)       │  │
│  │  • PII fields: tokenized before storage                │  │
│  │  • Session data: auto-purged after 24 hours            │  │
│  │  • AliCloud ApsaraDB TDE (Transparent Data Encryption) │  │
│  │  • VPC peering for secure AWS ↔ Alibaba connectivity   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Layer 4: Compliance                                         │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  • PDPA (Malaysia) compliant data handling             │  │
│  │  • BNM regulatory requirements for financial data      │  │
│  │  • AWS CloudTrail audit logging for all API calls      │  │
│  │  • User consent captured before voice recording        │  │
│  │  • AWS Config for continuous compliance monitoring     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Scalability Design

```
                     AWS ALB (Application Load Balancer)
                             │
                ┌────────────┼────────────┐
                │            │            │
           ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
           │ ECS     │ │ ECS     │ │ ECS     │   ◀── Fargate auto-scaling
           │ Task #1 │ │ Task #2 │ │ Task #3 │       (CPU/Memory targets)
           └────┬────┘ └────┬────┘ └────┬────┘
                │            │            │
                └────────────┼────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
           ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
           │SageMaker│ │SageMaker│ │SageMaker│   ◀── SageMaker endpoints
           │Endpoint │ │Endpoint │ │Endpoint │       (auto-scaling)
           │  #1     │ │  #2     │ │  #3     │
           └─────────┘ └─────────┘ └─────────┘
                             │
                    AliCloud ApsaraDB RDS
                    (read replicas for scale)

  Target Performance:
  ┌──────────────────────────────────────────┐
  │  • Concurrent users: 10,000+             │
  │  • STT latency: < 500ms                  │
  │  • LLM response: < 1.5s (Bedrock)       │
  │  • End-to-end turn: < 2s                 │
  │  • Availability: 99.9%                   │
  │  • Audio processing: real-time streaming  │
  └──────────────────────────────────────────┘
```

---

## 7. Hackathon MVP Architecture (Simplified)

For the hackathon demo, we use a simplified stack:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Flutter App     │     │  AWS Lambda +    │     │  AWS AI Services │
│  (Mock TNG UI)   │────▶│  API Gateway     │────▶│                  │
│                  │◀────│  (Serverless)    │◀────│  • Transcribe    │
│  • Voice capture │     │                  │     │  • Bedrock Claude│
│  • Chat UI       │     │  • WebSocket API │     │  • Polly (TTS)   │
│  • Form preview  │     │  • REST API      │     │                  │
│  • Confirmation  │     │  • Session state │     │                  │
└──────────────────┘     └────────┬─────────┘     └──────────────────┘
                                  │
                         ┌────────▼─────────┐
                         │  AliCloud        │
                         │  ApsaraDB RDS    │
                         │  (MySQL/PG)      │
                         │  • Form schemas  │
                         │  • Session data  │
                         └──────────────────┘

  Hackathon Shortcuts:
  • AWS Lambda = no server management, instant scaling
  • API Gateway WebSocket = built-in real-time support
  • Amazon Transcribe = no model hosting needed for STT
  • Amazon Bedrock = managed LLM, no GPU provisioning
  • AliCloud ApsaraDB = single managed DB (hackathon requirement)
  • 2-3 form types only (micro-insurance, microloan, merchant onboarding)
```

---

*This architecture is built on AWS services with Alibaba Cloud database (as required). Each component can be independently scaled, replaced, or upgraded as VoiceBridge grows from hackathon prototype to production system.*
