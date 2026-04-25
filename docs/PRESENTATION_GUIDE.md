# FormBuddy — Presentation Guide
## TNG Digital FinHack 2026 | Track 1: Financial Inclusion

> For the presenter. Read this before demo day.

---

## THE ONE SENTENCE

**"FormBuddy lets anyone use TNG eWallet by voice — no reading, no typing, no forms."**

Say this early. Judges need to understand what you built in 5 seconds.

---

## WHAT YOU BUILT (know this cold)

FormBuddy is an AI assistant that lives INSIDE the TNG eWallet app. It's not a separate app — it's a floating chat panel that overlays the real TNG interface. Users tap the mic, speak in any language, and the assistant:

1. **Understands** what they want (transfer, fuel, bills, etc.)
2. **Asks clarifying questions** if the request is vague
3. **Navigates** to the right form page and pre-fills it
4. **Confirms** with biometric verification
5. **Executes** the real transaction (balance deducts, history updates)

### Why it matters
- 1.2 million unbanked Malaysians (World Bank 2021)
- BNM Financial Inclusion Framework identifies "digital onboarding complexity" as key barrier
- Elderly, migrant workers, low-literacy users can't read English forms or type on small screens
- They abandon digital payments or rely on others (security risk)

### Tech stack (for technical judges)
- **AI**: AWS Bedrock Claude Sonnet 4.6 with tool_use for structured JSON
- **Backend**: FastAPI on AWS Lambda (serverless, zero-ops)
- **Database**: Alibaba Cloud RDS MySQL in Kuala Lumpur (data stays in Malaysia)
- **Frontend**: React + TypeScript on AWS Amplify
- **Voice**: Browser Web Speech API (free, zero latency)
- **IaC**: Terraform (both clouds)
- **Multi-cloud**: Data on Alibaba Cloud (same as TNG production), compute + AI on AWS

---

## DEMO SCRIPT (4 minutes)

### Before you start
1. Open https://main.d3is7aj4mo28yv.amplifyapp.com on your laptop browser
2. Reset accounts: tap the user name (top-right) → "Reset all accounts"
3. Make sure you're on Ahmad Razak (BM user)
4. Have Chrome's microphone permission granted
5. Set language to BM (globe icon → Bahasa Melayu)

### 0:00–0:20 — The Problem
> "8 million Malaysians can't use digital payments. Not because they don't have phones — because they can't fill the forms. My uncle can't read English. My grandmother can't type on a small screen. They're excluded from digital finance."

### 0:20–0:40 — Show the App
> "This is TNG eWallet." [show home screen with real balance]
> "Looks exactly like the real app. Real balance, real transactions. But watch this."
> [point to the blue mic button at bottom-right]
> "Uncle just taps this."

### 0:40–1:30 — Demo 1: Conversational (THE MONEY SHOT)
1. Tap the mic button → chat panel slides up
2. Say: **"Tolong saya"** (help me)
3. AI responds in chat: "Saya boleh bantu! Nak buat apa?" + speaks via TTS
4. Say: **"Nak hantar duit"** (want to send money)
5. AI asks: "Kepada siapa dan berapa?" (to whom and how much?)
6. Say: **"Ahmad seratus ringgit"**
7. AI classifies → panel minimizes → app navigates to Transfer page → fields pre-filled!
8. Show the "Pre-filled by FormBuddy" banner
9. Tap Submit → balance deducts → success

> "Uncle had a conversation. He didn't read a single word. He didn't type anything. The AI understood him in Malay and filled the form."

### 1:30–2:10 — Demo 2: One-Shot (Fast Path)
1. Tap mic again
2. Say: **"Nak pump minyak RON95 lima puluh"** (want to pump RON95 fuel fifty)
3. AI classifies immediately → navigates to Fuel page → pre-filled
4. Submit → balance deducts

> "If uncle knows exactly what he wants, one sentence is enough. No conversation needed."

### 2:10–2:40 — Demo 3: Manual Forms Still Work
1. Tap Transfer button on home → show proper form UI
2. Tap Services → show all 14 actions with proper forms
3. Tap Toll → TaskPage with generic form

> "Every action works manually too. Same backend, same real balance. The voice assistant is an overlay — it doesn't replace the app, it enhances it."

### 2:40–3:10 — Demo 4: Multi-User + Multi-Language
1. Tap user name (top-right) → switch to John Smith (EN)
2. Tap mic → "Check my balance" → AI responds in English with real balance
3. Switch to Mei Ling (ZH) → show different balance
4. Show 5 demo users with different balances

> "5 languages. 14 actions. 5 demo users. Real transactions. Real fraud detection."

### 3:10–3:40 — Architecture
> "Data stays in Malaysia on Alibaba Cloud RDS — same database engine TNG uses in production. Compute and AI run on AWS Singapore — Bedrock Claude Sonnet 4.6 for intent detection. Terraform manages both clouds."

Show the architecture if you have a slide, or just say it.

### 3:40–4:00 — Close
> "1.2 million Malaysians are excluded from digital finance because they can't fill forms. FormBuddy fixes that. One voice at a time."

---

## WHAT JUDGES WILL ASK (and your answers)

### "How does the AI understand Malay?"
> "We use AWS Bedrock Claude Sonnet 4.6 with tool_use. The model natively understands Malay, English, Chinese, Tamil, and even rojak (mixed language). We auto-detect the language from the transcript and respond in the same language."

### "Why two clouds?"
> "TNG Digital runs on Alibaba Cloud — their production database is OceanBase. We put user data on Alibaba Cloud RDS MySQL in KL so data stays in Malaysia. But the best AI models are on AWS Bedrock, and Lambda gives us zero-ops serverless. Terraform unifies deployment across both."

### "Is this a real app or a mockup?"
> "Everything is real. The balance deducts. Transactions persist in the database. Fraud detection flags large amounts and first-time recipients. You can open the URL on your phone right now." [give them the URL]

### "What about security?"
> "Every transaction requires biometric verification — Face ID, Touch ID, or PIN. The AI suggests, the human confirms. No transaction executes without explicit user approval."

### "How do you handle when the AI doesn't understand?"
> "The AI asks clarifying questions. It's multi-turn — if you say 'help me', it asks what you need. After a few back-and-forth messages, it understands. If it still can't classify, it shows a menu of available actions."

### "What languages do you support?"
> "English, Bahasa Melayu, Mandarin, Cantonese, and Tamil. The browser handles speech recognition, and the AI handles understanding. It even works with rojak — mixed Malay-English."

### "What's the latency?"
> "Speech recognition is instant (browser-native). AI classification takes 1-2 seconds via Bedrock. Total time from speech to form pre-fill is about 3 seconds."

### "How would this work in production?"
> "The architecture is production-ready. Replace RDS MySQL with OceanBase (same driver, zero code change). Add Bedrock AgentCore for session memory. Add WhatsApp integration for users without smartphones. The core pipeline — voice → AI → action — stays the same."

---

## THINGS THAT CAN GO WRONG (and recovery)

| Problem | Recovery |
|---------|----------|
| Mic doesn't work | Type in the chat input instead. Say "You can also type." |
| AI misclassifies | Say "Let me try again with more detail" and be more specific |
| Lambda cold start (slow) | Say "First request warms up the serverless function — subsequent ones are instant" |
| TTS doesn't speak | Ignore it, the chat bubbles show the response. Say "TTS varies by browser" |
| Balance is wrong | Tap user name → Reset all accounts |
| Venue is noisy | Use the type input. Say "In noisy environments, users can type too" |

---

## KEY NUMBERS TO REMEMBER

- **1.2 million** unbanked Malaysians (World Bank 2021)
- **5** languages supported
- **14** TNG actions by voice
- **5** demo users with different balances
- **3 seconds** speech to form pre-fill
- **2 clouds** — Alibaba (data, Malaysia) + AWS (compute + AI, Singapore)
- **Claude Sonnet 4.6** — latest model, tool_use for structured JSON
- **Zero local dependency** — judges can open the URL on their phone

---

## LIVE URL

**https://main.d3is7aj4mo28yv.amplifyapp.com**

Give this to judges. It works on any phone or laptop with Chrome.
