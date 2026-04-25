# VoiceBridge — Full Feature Specification
### Product Requirements Document (PRD)

---

## 1. Product Overview

**VoiceBridge** is a conversational voice-to-form SDK that integrates into TNG Digital's app, enabling underserved users to complete financial product applications through natural voice conversations in their preferred language.

**Product Vision:** Eliminate form-based barriers to financial inclusion for Malaysia's underserved populations.

**Success Metric:** Increase financial product application completion rate from ~35% to ~70% for target user segments.

---

## 2. Feature Catalog

### Feature Map

```
VoiceBridge
├── F1: Voice Conversation Engine
│   ├── F1.1: Multilingual Speech Recognition
│   ├── F1.2: Conversational AI Assistant
│   ├── F1.3: Text-to-Speech Response
│   └── F1.4: Voice Activity Detection
│
├── F2: Smart Form Intelligence
│   ├── F2.1: Dynamic Form Schema Loading
│   ├── F2.2: Field Extraction & Mapping
│   ├── F2.3: Smart Validation & Auto-correction
│   ├── F2.4: Cross-field Intelligence
│   └── F2.5: Confidence Scoring
│
├── F3: User Interface
│   ├── F3.1: Voice Chat Interface
│   ├── F3.2: Real-time Form Preview
│   ├── F3.3: Visual Confirmation Screen
│   ├── F3.4: Progress Indicator
│   └── F3.5: Accessibility Features
│
├── F4: Financial Literacy Layer
│   ├── F4.1: Term Explanations
│   ├── F4.2: Product Recommendations
│   └── F4.3: Contextual Tips
│
├── F5: Session Management
│   ├── F5.1: Save & Resume
│   ├── F5.2: Multi-device Continuity
│   └── F5.3: Session Timeout Handling
│
├── F6: Analytics & Insights
│   ├── F6.1: Conversion Tracking
│   ├── F6.2: Drop-off Analysis
│   ├── F6.3: Language Usage Analytics
│   └── F6.4: Field Difficulty Scoring
│
└── F7: Admin & Configuration
    ├── F7.1: Form Schema Builder
    ├── F7.2: Prompt Template Manager
    ├── F7.3: Language Pack Manager
    └── F7.4: A/B Testing Framework
```

---

## 3. Detailed Feature Specifications

---

### F1: Voice Conversation Engine

#### F1.1 — Multilingual Speech Recognition

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Convert user speech to text in multiple Malaysian languages |
| **Supported Languages** | Bahasa Melayu, English, Mandarin, Tamil, Bahasa Indonesia, Nepali |

**Functional Requirements:**
- FR-1.1.1: System shall detect the user's language within the first 3 seconds of speech
- FR-1.1.2: System shall handle code-switching (e.g., Manglish — mixing BM and English mid-sentence)
- FR-1.1.3: System shall recognize Malaysian number pronunciation ("lapan kosong" → 80, "dua ribu lebih" → ~2000)
- FR-1.1.4: System shall support real-time streaming transcription (not batch)
- FR-1.1.5: System shall achieve ≥90% word accuracy for each supported language
- FR-1.1.6: System shall handle background noise typical of outdoor/market environments

**Non-Functional Requirements:**
- NFR-1.1.1: Transcription latency < 500ms from end of utterance
- NFR-1.1.2: Audio streaming bitrate: 16kbps (Opus codec)
- NFR-1.1.3: Minimum device support: Android 8.0+, iOS 14+

**Acceptance Criteria:**
```
GIVEN a user speaks in Bahasa Melayu
WHEN the audio is processed by the STT engine
THEN the transcription accuracy is ≥ 90%
AND the result is returned within 500ms
AND Malaysian colloquialisms are correctly interpreted
```

---

#### F1.2 — Conversational AI Assistant

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | AI-powered conversational agent that guides users through form fields naturally |

**Functional Requirements:**
- FR-1.2.1: AI shall ask one question at a time, in the user's detected language
- FR-1.2.2: AI shall maintain conversation context across the entire form session
- FR-1.2.3: AI shall ask clarifying questions when confidence is below 0.8
- FR-1.2.4: AI shall explain financial terms when the user seems confused or asks "apa tu?"
- FR-1.2.5: AI shall adapt tone based on user profile (formal for professionals, casual for informal users)
- FR-1.2.6: AI shall handle off-topic responses gracefully and redirect to the form
- FR-1.2.7: AI shall confirm extracted values back to the user before moving to the next field
- FR-1.2.8: AI shall allow users to go back and correct previous answers

**Conversation Flow:**
```
START
  │
  ▼
Greet user in detected language
  │
  ▼
Ask field #1 (e.g., full name)
  │
  ├── User responds clearly ──▶ Extract, confirm, move to next field
  │
  ├── User response unclear ──▶ Ask clarifying question ──▶ Re-extract
  │
  ├── User asks "what does that mean?" ──▶ Explain term ──▶ Re-ask
  │
  ├── User says "go back" ──▶ Return to previous field
  │
  └── User goes off-topic ──▶ Acknowledge, redirect to current field
  │
  ▼
All fields complete
  │
  ▼
Show summary ──▶ User confirms ──▶ Submit
```

---

#### F1.3 — Text-to-Speech Response

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | AI responses are spoken aloud for users who can't read |

**Functional Requirements:**
- FR-1.3.1: System shall generate natural-sounding speech in the user's language
- FR-1.3.2: System shall support adjustable speech speed (0.75x, 1x, 1.25x)
- FR-1.3.3: System shall allow users to toggle TTS on/off
- FR-1.3.4: TTS shall use a warm, friendly voice (not robotic)

---

#### F1.4 — Voice Activity Detection (VAD)

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Detect when user starts/stops speaking to manage audio capture |

**Functional Requirements:**
- FR-1.4.1: System shall detect speech onset within 200ms
- FR-1.4.2: System shall detect end-of-speech after 1.5s of silence
- FR-1.4.3: System shall filter out non-speech sounds (coughs, background chatter)
- FR-1.4.4: System shall provide visual feedback (pulsing mic icon) during active listening

---

### F2: Smart Form Intelligence

#### F2.1 — Dynamic Form Schema Loading

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Load form definitions dynamically based on the financial product being applied for |

**Supported Form Types (MVP):**

| Form | Fields | Complexity |
|------|--------|------------|
| Micro-insurance application | 13 fields | Medium |
| Microloan application | 18 fields | High |
| Merchant onboarding | 15 fields | Medium |
| GO+ account opening | 8 fields | Low |
| eKYC verification | 10 fields | Medium |

**Schema Structure:**
```json
{
  "form_id": "micro_insurance_v1",
  "form_name": "Micro-Insurance Application",
  "version": "1.0",
  "fields": [
    {
      "field_id": "full_name",
      "type": "string",
      "required": true,
      "order": 1,
      "validation": {
        "pattern": "^[A-Za-z\\s@/]+$",
        "min_length": 2,
        "max_length": 100
      },
      "voice_prompts": {
        "ms": "Boleh beritahu nama penuh awak?",
        "en": "What is your full name?",
        "zh": "请告诉我你的全名",
        "ta": "உங்கள் முழு பெயர் என்ன?"
      },
      "explanation": {
        "ms": "Nama sama macam dalam IC awak",
        "en": "Your name as it appears on your IC"
      },
      "icon": "person",
      "smart_features": {
        "auto_capitalize": true,
        "title_case": true
      }
    }
  ]
}
```

---

#### F2.2 — Field Extraction & Mapping

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Extract structured data from natural speech and map to form fields |

**Extraction Rules:**

| Speech Pattern | Extracted Value | Field |
|---|---|---|
| "Siti binti Ahmad" | `"Siti binti Ahmad"` | full_name |
| "lapan kosong kosong dua satu empat kosong enam lima tiga dua satu" | `"800214-06-5321"` | ic_number |
| "dua ribu lebih" | `2000` | monthly_income |
| "jual nasi lemak tepi jalan" | `"Self-employed"`, `"Food & Beverage"` | employment_type, sector |
| "Kampung Baru" | `"Kampung Baru"`, `"50300"`, `"Kuala Lumpur"` | address, postcode, city |
| "lima puluh lapan tahun" | `58` | age (cross-validated with IC) |

---

#### F2.3 — Smart Validation & Auto-correction

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Validate extracted data and auto-correct common errors |

**Validation Rules:**

| Field | Validation | Auto-correction |
|---|---|---|
| IC Number | 12 digits, valid date prefix, valid state code | Add dashes if missing |
| Phone Number | 10-11 digits, starts with 01 | Add country code +60 |
| Postcode | 5 digits, valid Malaysian postcode | Lookup from area name |
| Email | Valid email format | Suggest common domains |
| Income | Positive number, reasonable range | Round to nearest 100 |
| Date of Birth | Matches IC prefix, age 18-100 | Extract from IC number |

---

#### F2.4 — Cross-field Intelligence

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Use data from one field to auto-fill or validate other fields |

**Cross-field Rules:**
```
IC Number → Date of Birth (auto-extract)
IC Number → Age (auto-calculate)
IC Number → Gender (odd/even last digit)
IC Number → State of birth (state code)
Area Name → Postcode (lookup)
Postcode → State (lookup)
Occupation description → Employment type (classify)
Occupation description → Industry sector (classify)
Monthly income + Dependents → Affordability score (calculate)
```

---

#### F2.5 — Confidence Scoring

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Assign confidence scores to each extracted field value |

**Confidence Thresholds:**

| Score | Action | Example |
|---|---|---|
| ≥ 0.95 | Auto-accept, move to next field | Clear IC number dictation |
| 0.80 - 0.94 | Accept but confirm with user | "Saya dengar RM2,000, betul?" |
| 0.60 - 0.79 | Ask user to repeat or clarify | "Maaf, boleh ulang sekali lagi?" |
| < 0.60 | Offer alternatives or manual input | "Saya tak pasti. Boleh taip atau cakap sekali lagi?" |

---

### F3: User Interface

#### F3.1 — Voice Chat Interface

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Chat-bubble style interface for voice conversation |

**UI Components:**
```
┌─────────────────────────────────┐
│  ← Micro-Insurance Application  │
│     ████████░░░░  62% complete  │
├─────────────────────────────────┤
│                                 │
│  🤖 Hai Siti! Saya nak tolong  │
│     awak mohon insurans mikro.  │
│                                 │
│  🤖 Nama penuh awak?           │
│                                 │
│            Siti binti Ahmad  👩 │
│                                 │
│  🤖 Terima kasih! Nombor IC    │
│     awak berapa?                │
│                                 │
│     800214-06-5321           👩 │
│                                 │
│  🤖 ✅ Betul! Sekarang, awak   │
│     buat kerja apa?             │
│                                 │
│                                 │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────────┐  │
│    │    🎤 Tap to speak      │  │
│    └─────────────────────────┘  │
│                                 │
│    ⌨️ Type instead  │  ⏸ Pause  │
└─────────────────────────────────┘
```

**Design Requirements:**
- Large tap targets (minimum 48x48dp)
- High contrast text (WCAG AA compliant)
- Animated pulsing mic icon during recording
- Auto-scroll to latest message
- Support for both portrait and landscape

---

#### F3.2 — Real-time Form Preview

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Side panel or swipe-up view showing the form being filled in real-time |

**UI Mockup:**
```
┌─────────────────────────────────┐
│  📋 Form Preview                │
├─────────────────────────────────┤
│                                 │
│  ✅ Full Name                   │
│     Siti binti Ahmad            │
│                                 │
│  ✅ IC Number                   │
│     800214-06-5321              │
│                                 │
│  🔄 Occupation                  │
│     (answering now...)          │
│                                 │
│  ⬜ Monthly Income              │
│  ⬜ Address                     │
│  ⬜ Phone Number                │
│  ⬜ Emergency Contact           │
│  ⬜ Coverage Amount             │
│                                 │
│  ┌─────────────────────────┐    │
│  │  ↓ Back to conversation │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

---

#### F3.3 — Visual Confirmation Screen

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Icon-based summary for final review before submission |

**Design Principles:**
- Use icons instead of labels where possible
- Large, readable text (minimum 16sp)
- Green checkmarks for validated fields
- Tap any field to voice-correct it
- Single "Confirm & Submit" button at bottom

```
┌─────────────────────────────────┐
│  ✅ Review Your Application      │
├─────────────────────────────────┤
│                                 │
│  👤  Siti binti Ahmad           │
│  🪪  800214-06-5321             │
│  💼  Peniaga Makanan            │
│  💰  RM 2,000 / bulan          │
│  📍  Kampung Baru, KL 50300    │
│  📱  012-345-6789              │
│  🛡️  Perlindungan: RM10,000    │
│  💵  Premium: RM15 / bulan     │
│                                 │
│  ┌─────────────────────────┐    │
│  │  🎤 "Tukar nama" to edit│    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  ✅ Sahkan & Hantar      │    │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

#### F3.4 — Progress Indicator

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Visual progress bar showing form completion percentage |

- Animated progress bar at top of screen
- Shows "X of Y fields complete"
- Celebrates milestones ("Halfway there! 🎉")
- Estimated time remaining

---

#### F3.5 — Accessibility Features

| Attribute | Detail |
|-----------|--------|
| **Priority** | P0 (Must-have) |
| **Description** | Ensure VoiceBridge is usable by users with disabilities |

**Requirements:**
- Screen reader compatible (TalkBack / VoiceOver)
- Minimum font size: 16sp (adjustable up to 24sp)
- Color contrast ratio ≥ 4.5:1
- Haptic feedback on key actions
- Support for external keyboards
- No time-limited interactions (user controls pace)

---

### F4: Financial Literacy Layer

#### F4.1 — Term Explanations

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Explain financial terms in simple language when users encounter them |

**Example Explanations:**

| Term | Simple Explanation (BM) |
|------|------------------------|
| Premium | "Bayaran bulanan untuk insurans awak. Macam bayar bil telefon setiap bulan." |
| Coverage | "Jumlah duit yang awak akan dapat kalau berlaku apa-apa." |
| Interest Rate | "Kos tambahan untuk pinjam duit. Kalau pinjam RM1000, kena bayar balik lebih sikit." |
| Collateral | "Barang yang awak jamin. Kalau tak bayar pinjaman, bank boleh ambil barang tu." |
| Annual Revenue | "Jumlah semua duit yang masuk dalam setahun dari perniagaan awak." |

**Trigger Conditions:**
- User explicitly asks ("apa tu premium?")
- User pauses for > 5 seconds on a financial term field
- User gives an answer that suggests misunderstanding

---

#### F4.2 — Product Recommendations

| Attribute | Detail |
|-----------|--------|
| **Priority** | P2 (Nice-to-have) |
| **Description** | Suggest appropriate financial products based on user profile |

**Recommendation Logic:**
```
IF occupation = "self-employed" AND income < 3000
  THEN suggest: micro-insurance, microloan
  
IF age > 55 AND no_existing_insurance
  THEN suggest: health micro-insurance
  
IF occupation = "migrant_worker"
  THEN suggest: remittance savings, accident insurance
  
IF has_business AND no_merchant_account
  THEN suggest: merchant onboarding, business microloan
```

---

#### F4.3 — Contextual Tips

| Attribute | Detail |
|-----------|--------|
| **Priority** | P2 (Nice-to-have) |
| **Description** | Share relevant financial tips during the conversation |

**Example Tips:**
- During income field: "Tahukah awak? Dengan simpanan RM50 sebulan dalam GO+, awak boleh dapat pulangan 3.5% setahun."
- During insurance field: "Insurans mikro bermula dari RM5 sebulan sahaja — lebih murah dari secawan kopi!"
- After completion: "Tahniah! Awak baru sahaja ambil langkah pertama untuk melindungi keluarga awak."

---

### F5: Session Management

#### F5.1 — Save & Resume

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Allow users to pause and resume applications later |

**Requirements:**
- Auto-save after each completed field
- Resume from exact point of interruption
- Session valid for 7 days
- Push notification reminder after 24 hours: "Siti, permohonan insurans awak belum selesai. Nak sambung?"

---

#### F5.2 — Multi-device Continuity

| Attribute | Detail |
|-----------|--------|
| **Priority** | P2 (Nice-to-have) |
| **Description** | Start on one device, continue on another |

---

#### F5.3 — Session Timeout Handling

| Attribute | Detail |
|-----------|--------|
| **Priority** | P1 (Should-have) |
| **Description** | Gracefully handle session timeouts and interruptions |

**Scenarios:**
- App backgrounded: Save state, resume on return
- Network lost: Queue responses, sync when reconnected
- Inactivity > 5 min: Gentle prompt "Siti, awak masih di sini?"
- Inactivity > 15 min: Auto-save and close session

---

### F6: Analytics & Insights

#### F6.1 — Conversion Tracking

| Metric | Description |
|--------|-------------|
| Form start rate | % of users who tap the mic button |
| Field completion rate | % completion per field |
| Form completion rate | % of users who submit the form |
| Time to complete | Average time from start to submission |
| Voice vs. type ratio | % of fields filled by voice vs. keyboard |

#### F6.2 — Drop-off Analysis

Track where users abandon the process:
- Which field causes the most drop-offs?
- Which language has the lowest completion rate?
- What time of day has the highest abandonment?
- Correlation between confidence scores and drop-offs

#### F6.3 — Language Usage Analytics

- Most used language per form type
- Code-switching frequency
- Language detection accuracy by region
- Dialect-specific accuracy metrics

#### F6.4 — Field Difficulty Scoring

Auto-calculate difficulty score per field based on:
- Average attempts needed
- Average confidence score
- Clarification request frequency
- Time spent on field

---

### F7: Admin & Configuration

#### F7.1 — Form Schema Builder

Web-based tool for TNG product teams to:
- Create new form schemas (drag-and-drop)
- Define validation rules per field
- Add voice prompts in multiple languages
- Set field ordering and dependencies
- Preview the voice conversation flow

#### F7.2 — Prompt Template Manager

- Edit AI conversation prompts per language
- A/B test different prompt styles
- Version control for prompt changes
- Preview conversation flow before deployment

#### F7.3 — Language Pack Manager

- Add new languages without code changes
- Upload custom vocabulary (financial terms per language)
- Manage dialect-specific rules
- Test pronunciation and recognition accuracy

#### F7.4 — A/B Testing Framework

- Test different conversation styles
- Compare completion rates across variants
- Auto-promote winning variants
- Statistical significance calculator

---

## 4. Priority Matrix

| Priority | Features | Hackathon MVP |
|----------|----------|:---:|
| **P0 — Must Have** | F1.1, F1.2, F1.4, F2.1, F2.2, F2.3, F3.1, F3.3, F3.5 | ✅ |
| **P1 — Should Have** | F1.3, F2.4, F2.5, F3.2, F3.4, F4.1, F5.1, F5.3 | ⚠️ Partial |
| **P2 — Nice to Have** | F4.2, F4.3, F5.2, F6.x, F7.x | ❌ Post-hackathon |

---

## 5. Hackathon MVP Scope

For the hackathon demo, we build:

| Feature | Scope |
|---------|-------|
| Languages | BM + English only |
| Forms | Micro-insurance (1 form) |
| Voice | Speech-to-text + conversational AI (no TTS) |
| UI | Chat interface + confirmation screen |
| Validation | IC number, phone, income (basic) |
| Session | Single session, no save/resume |

**Demo Script:** A user speaks in BM to complete a micro-insurance application in under 3 minutes, with the AI guiding them through each field conversationally.

---

*This feature spec is designed to be comprehensive for the full product vision while clearly scoping what's achievable for the hackathon.*
