# FormBuddy — Execution Plan: TNG Agent Pivot

> Commander's execution plan. Created: 25 Apr 2026, 6:45 PM MYT
> Ref: MASTER_PLAN.md (source of truth), Decision D12

---

## 1. WHAT WE'RE BUILDING

**Before:** FormBuddy fills forms by voice.
**After:** FormBuddy is a built-in AI assistant inside TNG eWallet. It understands what users want to do — pay bills, pump fuel, send money, apply for loans — and does it for them.

### The Demo Moment
Old uncle opens TNG app → taps mic → says "Nak pump minyak RON95 lima puluh" in rojak → AI shows "Pay RM50 for RON95 fuel?" → uncle confirms with Face ID → done. No forms, no typing, no English required.

---

## 2. DESIGN PRINCIPLES (from research)

### Voice Agent UX (InfoWorld, Fluid AI, Ideanics)
- **Acknowledge while processing**: "Got it, looking that up..." feels collaborative
- **Implicit confirmation > explicit yes/no**: "Sending RM100 to Ahmad" beats "Did you say send RM100? Say yes or no"
- **Recovery > performance**: When AI gets it wrong, offer graceful correction, not error messages
- **200ms response rhythm**: Silence = broken. Always show/say something within 200ms
- **Social risk**: Voice failure in front of others is embarrassing. Make the happy path feel effortless

### Fintech UX 2026 (Eleken, Markswebb)
- **Safe, transparent, easy to understand**: Users focus on money, not interface
- **No hybrid trap**: Don't force users to switch between voice and GUI mid-task
- **Trust builds gradually**: Show what the AI understood, let user confirm, then execute

### Agentic Coding (vibecoding.app, Karpathy)
- **Plan → Execute → Verify → Ship** loop
- **4-layer guardrails**: scope (target files), quality (lint/test), policy (no secrets), human decisions (architecture)
- **Each worker task needs**: target files, non-goals, acceptance criteria
- **Prevent prompt tribal knowledge**: prompts are documented, not in someone's head

---

## 3. ARCHITECTURE CHANGES

### Frontend (complete rewrite of pages, keep infra)
```
CURRENT                          → NEW
─────────────────────────────────────────────────────
Dashboard.tsx (hero + stats)     → TNGHome.tsx (mock TNG home screen)
FormTemplates.tsx (template list)→ Services.tsx (what assistant can do)
VoiceAssistant.tsx (form filler) → Agent.tsx (action executor)
Layout.tsx (nav bar)             → AppShell.tsx (phone frame + bottom tabs)
```

### Backend (expand detect-intent, add action types)
```
CURRENT                          → NEW
─────────────────────────────────────────────────────
detect-intent returns template   → returns action type + params
6 form templates only            → 6 templates + 4 quick actions
No action execution              → Mock execution + confirmation flow
```

### New Action Types (beyond form templates)
| Action | Params | Mock Response |
|--------|--------|---------------|
| fuel_payment | fuel_type, amount, station | "Pay RM50 for RON95?" |
| check_balance | — | "Your balance is RM1,234.56" |
| scan_pay | merchant, amount | "Pay RM25.00 to 7-Eleven?" |
| pin_reload | phone, amount, carrier | "Reload RM30 to 012-345-6789?" |

---

## 4. FILE OWNERSHIP MAP (zero conflicts)

| Worker | Files to CREATE | Files to MODIFY | DO NOT TOUCH |
|--------|----------------|-----------------|--------------|
| **Alpha** | — | `backend/services/ai_service.py`, `backend/api/routes/analysis.py`, `backend/schemas/transaction.py` | Any frontend file |
| **Bravo** | `frontend/src/pages/TNGHome.tsx` | — | Any backend file, any other page |
| **Charlie** | `frontend/src/pages/Agent.tsx` | — | Any backend file, any other page |
| **Delta** | `frontend/src/components/AppShell.tsx`, `frontend/src/pages/Services.tsx` | `frontend/src/App.tsx`, `frontend/src/index.css` | Any backend file, TNGHome, Agent |

---

## 5. WORKER PROMPTS

### ALPHA — Backend: Expand AI Agent Capabilities

```
WORKING DIRECTORY: /Users/nt/dev/temp/mtsssss

CONTEXT:
FormBuddy is pivoting from "form filler" to "built-in TNG eWallet AI agent."
The detect-intent endpoint already works — it matches user speech to form
templates and extracts fields. Now we need to expand it to handle ACTIONS
beyond just form templates (fuel payment, check balance, scan & pay, etc.)

WHAT TO CHANGE:

1. backend/schemas/transaction.py
   - Add a new Pydantic model `DetectIntentResponse`:
     ```python
     class DetectIntentResponse(BaseModel):
         action_type: str  # "form_fill", "fuel_payment", "check_balance", "scan_pay", "pin_reload", "unknown"
         template_id: Optional[int] = None  # only for form_fill
         template_name: Optional[str] = None
         action_label: Optional[str] = None  # human-readable: "Pay RM50 for RON95 fuel"
         fields: Dict[str, Optional[Any]] = {}
         confidence: float = 0.0
         confirmation_message: Optional[str] = None  # "Send RM100 to Ahmad for sewa?"
     ```

2. backend/services/ai_service.py
   - Fix Python 3.9 bug: line ~89, change `list[float]` to `List[float]`
   - Modify `detect_intent()` method:
     - Add quick actions to the prompt alongside templates:
       ```
       Quick actions (no form needed):
       - "fuel_payment": user wants to pay for fuel (params: fuel_type, amount, station)
       - "check_balance": user wants to check their eWallet balance (no params)
       - "scan_pay": user wants to scan and pay a merchant (params: merchant, amount)
       - "pin_reload": user wants to reload prepaid (params: phone, amount, carrier)
       ```
     - Update the expected JSON response format to include action_type
     - If AI returns a template match, set action_type="form_fill"
     - If AI returns a quick action, set action_type to that action
     - Generate a confirmation_message from the extracted params
       e.g., "Pay RM50 for RON95 fuel at nearest station?"

3. backend/api/routes/analysis.py
   - Update the detect-intent endpoint to return DetectIntentResponse
   - Keep backward compatibility: template_id still returned for form_fill actions

PATTERNS TO FOLLOW:
- Use Optional[] and List[] (Python 3.9 compat, no X | Y syntax)
- Use logger, not print()
- Keep _parse_json() fence-stripping logic
- Bedrock model: apac.anthropic.claude-sonnet-4-20250514-v1:0

DO NOT:
- Touch any frontend files
- Change the /voice/extract or /voice/sessions endpoints
- Change database models or migrations
- Add new dependencies to requirements.txt

ACCEPTANCE CRITERIA:
- `python -c "from main import app; print('OK')"` passes
- POST /api/v1/voice/detect-intent with "nak pump RON95 lima puluh" returns action_type="fuel_payment"
- POST /api/v1/voice/detect-intent with "check my balance" returns action_type="check_balance"
- POST /api/v1/voice/detect-intent with "send money to Ahmad" still returns action_type="form_fill" with template_id

COMMIT MESSAGE: feat: expand detect-intent to support quick actions beyond form templates
```

### BRAVO — Frontend: TNG Home Screen

```
WORKING DIRECTORY: /Users/nt/dev/temp/mtsssss

CONTEXT:
We're building a mock TNG eWallet home screen. This replaces Dashboard.tsx.
The app should look like a real mobile eWallet when viewed on a phone or
in a phone-width viewport. The design should feel premium and TNG-inspired.

WHAT TO CREATE:

1. frontend/src/pages/TNGHome.tsx
   A mock TNG eWallet home screen with:

   a) TOP SECTION — User greeting + balance
      - "Good evening, Ahmad 👋"
      - Large balance: "RM 1,234.56" (hardcoded mock)
      - Small text: "Available Balance"

   b) QUICK ACTIONS — 2x3 grid of circular icon buttons
      - Send Money (💸), Pay Bills (🧾), Scan & Pay (📷)
      - Reload (📱), Fuel ⛽, More (•••)
      - Each button: icon + label below, tap navigates to /agent?action=<type>

   c) RECENT TRANSACTIONS — list of 4-5 mock items
      - "RON95 Fuel - Petronas" → -RM50.00
      - "Transfer to Ahmad" → -RM100.00
      - "TNB Bill Payment" → -RM156.80
      - "Prepaid Reload" → -RM30.00
      - "Received from Siti" → +RM200.00
      Each with icon, name, amount (red for debit, green for credit), date

   d) FLOATING MIC BUTTON — bottom-right, above the tab bar
      - Circular, 56px, blue (#0066FF), white mic icon
      - Subtle shadow + pulse animation
      - onClick → navigate to /agent (no action param = free speech)
      - This is the hero element — the entry point to FormBuddy

   DESIGN:
   - Background: #F5F5F5 (light gray, like TNG app)
   - Cards: white, rounded-2xl, subtle shadow
   - Balance section: blue gradient header (#0066FF → #0052CC)
   - Typography: clean, Inter font (already loaded)
   - Mobile-first: looks native on 390px width

   NAVIGATION:
   - Use the onNavigate prop passed from App.tsx
   - Quick action buttons: onNavigate(`/agent?action=${actionType}`)
   - Floating mic: onNavigate('/agent')

   COMPONENT SIGNATURE:
   ```tsx
   export default function TNGHome({ onNavigate }: { onNavigate: (path: string) => void })
   ```

DO NOT:
- Touch any backend files
- Modify App.tsx (Delta handles routing)
- Modify Layout.tsx or AppShell.tsx (Delta handles that)
- Import from recharts or any new dependency
- Make API calls — this page is all mock data

ACCEPTANCE CRITERIA:
- File compiles: `npx tsc --noEmit` passes
- Looks like a real eWallet home screen on mobile viewport
- Floating mic button is visible and prominent
- All quick actions navigate to /agent?action=<type>

COMMIT MESSAGE: feat: TNG eWallet home screen with balance, quick actions, floating mic
```

### CHARLIE — Frontend: Agent Action Page

```
WORKING DIRECTORY: /Users/nt/dev/temp/mtsssss

CONTEXT:
This replaces VoiceAssistant.tsx. Instead of just filling forms, this page
handles ALL agent actions: form filling, fuel payment, balance check, etc.
It uses the expanded detect-intent API that Alpha is building.

The flow is:
1. User arrives (from mic button or quick action)
2. If ?action= param exists, show pre-context ("Fuel Payment")
3. User speaks or types
4. AI detects intent → returns action_type + fields + confirmation_message
5. Show confirmation card with extracted info
6. User confirms → show success animation
7. For form_fill actions, show the existing form field extraction UI

WHAT TO CREATE:

1. frontend/src/pages/Agent.tsx

   PHASES: idle → listening → processing → confirm → success

   a) IDLE PHASE
      - If ?action= param: show action context card at top
        "⛽ Fuel Payment — Tell me the details"
      - If no param: show "What would you like to do?"
      - Large mic button (same style as current VoiceAssistant)
      - "Tap to speak" label
      - "or type below" with text input

   b) LISTENING PHASE
      - Red mic button with ripple animation
      - Live transcript card
      - Equalizer bars (reuse from current VoiceAssistant)
      - "Done" and "Cancel" buttons

   c) PROCESSING PHASE
      - Spinner with "Understanding your request..."
      - Brief — should only last 1-3 seconds

   d) CONFIRM PHASE
      - Action type badge: "⛽ Fuel Payment" or "💸 Fund Transfer"
      - Confirmation message in large text:
        "Pay RM50 for RON95 fuel?"
      - Extracted fields shown as key-value pairs
      - Confidence bar
      - Two buttons:
        [✓ Confirm] (green, prominent)
        [✗ Cancel] (outline)
      - "🔊 Read Back" button
      - For form_fill: show full field list like current VoiceAssistant

   e) SUCCESS PHASE
      - Green checkmark animation (popIn)
      - "Payment Successful" or "Form Submitted"
      - "Done" button → navigate to /

   API CALLS:
   - Use detectIntent(transcript, language) from api.ts
   - The response now includes action_type, confirmation_message, etc.
   - For form_fill with template_id: also call getTemplate() to get field definitions
   - For quick actions: just show confirmation_message, no template needed

   SPEECH:
   - Import { speak, stopSpeaking } from "../lib/speech"
   - On confirm phase: auto-speak the confirmation_message
   - "Read Back" button: speak extracted fields

   COMPONENT SIGNATURE:
   ```tsx
   export default function Agent({ onNavigate, language }: { onNavigate: (path: string) => void; language?: string })
   ```

   REUSE from current VoiceAssistant.tsx:
   - SpeechRecognition setup (startRecognition/stopRecognition)
   - Equalizer component
   - MicIcon, StopIcon, CheckIcon SVGs
   - Type-to-fill input pattern

DO NOT:
- Touch any backend files
- Modify App.tsx (Delta handles routing)
- Modify api.ts (the existing detectIntent function works, Alpha's backend changes are backward-compatible)
- Create new files other than Agent.tsx

ACCEPTANCE CRITERIA:
- File compiles: `npx tsc --noEmit` passes
- /agent shows mic + "What would you like to do?"
- /agent?action=fuel_payment shows "⛽ Fuel Payment" context
- After speaking, shows confirmation card with action details
- Confirm → success animation → navigate home

COMMIT MESSAGE: feat: agent action page — voice-powered TNG assistant with action confirmation
```

### DELTA — Frontend: App Shell + Routing + Services Page

```
WORKING DIRECTORY: /Users/nt/dev/temp/mtsssss

CONTEXT:
Delta owns the app shell (phone frame + bottom tabs), routing, and the
Services page. This ties everything together.

WHAT TO CHANGE:

1. frontend/src/components/AppShell.tsx (CREATE)
   Replace Layout.tsx as the app wrapper. Two modes:

   a) DESKTOP (viewport > 480px):
      - Center a phone-shaped frame (390x844px) on screen
      - Dark background behind it
      - Phone frame: white, rounded-[2.5rem], with subtle shadow
      - Status bar at top (time, battery, signal — all fake/decorative)
      - Content area fills the phone frame
      - Bottom tab bar inside the frame

   b) MOBILE (viewport <= 480px):
      - No phone frame — content fills screen naturally
      - Bottom tab bar at actual bottom
      - Status bar hidden (real phone has its own)

   BOTTOM TAB BAR:
   - 5 tabs: Home (🏠), Services (📋), [Mic Button], Scan (📷), Profile (👤)
   - Center mic button is larger, raised, blue (#0066FF), circular
   - Active tab: blue icon + label. Inactive: gray
   - Home → /, Services → /services, Mic → /agent, Scan → /agent?action=scan_pay, Profile → (no-op, mock)
   - Fixed at bottom of phone frame

   LANGUAGE SELECTOR:
   - Small globe icon in the status bar area (top-right of phone frame)
   - Dropdown with EN/BM/中文/தமிழ் options
   - Same functionality as current Layout.tsx language selector

   COMPONENT SIGNATURE:
   ```tsx
   export default function AppShell({
     children,
     currentPath,
     onNavigate,
     language,
     onLanguageChange,
   }: {
     children: ReactNode;
     currentPath: string;
     onNavigate: (path: string) => void;
     language: string;
     onLanguageChange: (lang: string) => void;
   })
   ```

2. frontend/src/pages/Services.tsx (CREATE)
   Replaces FormTemplates.tsx. Shows what the assistant can do.

   a) QUICK ACTIONS section (top)
      - Same 2x3 grid as TNGHome but with descriptions
      - Each card: icon, title, description, "Try it →" link
      - Links to /agent?action=<type>

   b) FORM TEMPLATES section (below)
      - "Need to fill a form?" header
      - List of form templates from API (same as current FormTemplates)
      - Each card links to /agent?template=<id>
      - Grouped by category with emoji icons (reuse current pattern)

   COMPONENT SIGNATURE:
   ```tsx
   export default function Services({ onNavigate, language }: { onNavigate: (path: string) => void; language: string })
   ```

3. frontend/src/App.tsx (MODIFY)
   - Replace Layout import with AppShell
   - Replace page imports: Dashboard→TNGHome, FormTemplates→Services, VoiceAssistant→Agent
   - Update routes:
     / → TNGHome
     /services → Services
     /agent → Agent (replaces /voice and /templates)
   - Keep language state and localStorage logic

4. frontend/src/index.css (MODIFY)
   - Add phone-frame styles if needed
   - Add bottom-tab-bar styles
   - Keep all existing animations (mic-pulse, ripple, eq-bar, etc.)
   - Add any new animations for tab transitions

DO NOT:
- Touch any backend files
- Modify TNGHome.tsx (Bravo owns it)
- Modify Agent.tsx (Charlie owns it)
- Remove existing CSS animations — only add new ones
- Delete the old files (Dashboard.tsx, FormTemplates.tsx, VoiceAssistant.tsx, Layout.tsx) — just stop importing them. Commander will clean up after verification.

ACCEPTANCE CRITERIA:
- `npx tsc --noEmit` passes
- `npm run build` succeeds
- On desktop: phone frame centered on screen with bottom tabs
- On mobile: full-screen with bottom tabs
- All routes work: /, /services, /agent
- Language selector works
- Center mic button in tab bar navigates to /agent

COMMIT MESSAGE: feat: TNG app shell with phone frame, bottom tabs, and services page
```

---

## 6. EXECUTION ORDER

```
ROUND 1 (parallel — all 4 workers):
  Alpha: Backend expand detect-intent
  Bravo: TNGHome.tsx
  Charlie: Agent.tsx
  Delta: AppShell.tsx + Services.tsx + App.tsx routing

ROUND 2 (Commander — sequential):
  1. Review all worker output
  2. Run: cd backend && python -c "from main import app"
  3. Run: cd frontend && npx tsc --noEmit && npm run build
  4. Fix any integration issues
  5. Test detect-intent with new action types
  6. Deploy: ./scripts/deploy-lambda.sh
  7. Deploy: rebuild frontend → upload to Amplify
  8. Verify live endpoints
  9. Commit + push

ROUND 3 (if time permits):
  - Update pitch-deck.html with new screenshots
  - Update MASTER_PLAN.md execution TODO
  - Record demo video
```

---

## 7. API CONTRACT (Alpha ↔ Charlie)

Charlie's Agent.tsx calls `detectIntent()` from api.ts. Alpha's backend returns:

```json
{
  "action_type": "fuel_payment",
  "template_id": null,
  "template_name": null,
  "action_label": "Fuel Payment",
  "fields": {"fuel_type": "RON95", "amount": 50},
  "confidence": 0.92,
  "confirmation_message": "Pay RM50 for RON95 fuel at nearest station?"
}
```

For form_fill actions:
```json
{
  "action_type": "form_fill",
  "template_id": 2,
  "template_name": "Pindahan Wang",
  "action_label": "Fund Transfer",
  "fields": {"penerima": "Ahmad", "jumlah": 100, "rujukan": "sewa"},
  "confidence": 0.95,
  "confirmation_message": "Send RM100 to Ahmad for sewa?"
}
```

Charlie should handle both — check action_type to decide the UI flow.

---

## 8. AUDIT ISSUES TO FIX (Commander does these)

| # | Issue | Fix | When |
|---|-------|-----|------|
| 1 | `ai_service.py:89` list[float] → List[float] | Alpha fixes in their prompt | Round 1 |
| 2 | `config.py` default DATABASE_URL stale | Commander updates after Round 1 | Round 2 |
| 3 | `outputs.tf` stale OceanBase placeholder | Commander updates | Round 2 |
| 4 | `oceanbase.tf` dead resource | Commander removes | Round 2 |
| 5 | `recharts` unused dep | Commander runs `npm uninstall recharts` | Round 2 |
| 6 | 3 manual resources not in Terraform | Document in MASTER_PLAN, import later | Round 2 |
| 7 | MASTER_PLAN execution TODO outdated | Commander rewrites | Round 2 |

---

## 9. RISK MITIGATION

| Risk | Mitigation |
|------|-----------|
| Workers create conflicting code | File ownership map (section 4) — zero overlap |
| Alpha's API changes break Charlie | API contract defined (section 7) — Charlie codes to contract |
| Phone frame looks bad | Delta tests at 390px and 1440px — Commander reviews |
| Voice doesn't work on Amplify | Already verified — HTTPS + SPA routing working |
| Bedrock prompt too complex | Alpha keeps existing prompt structure, just adds action types |

---

## REFERENCES

- Ideanics: Agentic AI UX Phased Implementation Guide (Dec 2025) — phased trust model
- InfoWorld: Building Enterprise Voice AI Agents (Apr 2026) — social risk, 200ms rhythm, implicit confirmation
- Markswebb: Hybrid Trap (2026) — don't force mode switching
- Eleken: Fintech UX Best Practices (2026) — safe, transparent, easy
- Fluid AI: Agentic Voice Platform for Banks (2026) — multilingual banking voice agents
- vibecoding.app: Agentic Engineering for Software Teams (2026) — plan→execute→verify→ship, 4-layer guardrails
- morphllm.com: Agentic Engineering Post-Vibe-Coding (2026) — Karpathy's conductor model

Content was rephrased for compliance with licensing restrictions.
