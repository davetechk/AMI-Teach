# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## SECTION 1 — PROJECT IDENTITY

- **Platform name:** AMI-Teach
- **Tagline:** "Not a tutoring marketplace. An Education Authority."
- **Target market:** Nigerian secondary and university students, their guardians, and professional educators
- **Core value proposition:** Trust through vetting, technology through real-time data, results through syllabus-mapped learning
- **Developer:** David (Lead Developer)
- **Payment processor:** Paystack (Nigerian-first)
- All monetary values default to **NGN (Nigerian Naira)** unless explicitly stated otherwise

---

## SECTION 2 — TECH STACK (NON-NEGOTIABLE)

| Layer | Technology | Notes |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) | No frontend frameworks |
| Animations | GSAP 3 (CDN) | Always use ScrollTrigger, Timelines, and staggers. Never skip on any page with UI transitions |
| 3D Visuals | Three.js (CDN) | 3D Knowledge Graph and premium visuals. Disable OrbitControls on mobile |
| Backend | Supabase | Auth, PostgreSQL, Realtime, Row Level Security, Edge Functions (Deno) |
| Geo-Matching | PostGIS via Supabase | Home tutoring teacher-student proximity |
| Payments | Paystack | Lesson billing, exam pack purchases, teacher earnings wallet |
| Notifications | Email + SMS | Via Supabase Edge Functions |
| Deployment | Vercel (frontend) + Supabase (backend) | |
| Version Control | Git + GitHub | |

---

## SECTION 3 — FOLDER STRUCTURE

Enforce this exact structure across all sessions:

```
eduvault/
├── index.html
├── CLAUDE.md
├── README.md
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── css/
│   ├── tokens.css
│   ├── global.css
│   ├── components.css
│   ├── dashboard-student.css
│   ├── dashboard-guardian.css
│   ├── dashboard-teacher.css
│   └── dashboard-admin.css
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── router.js
│   ├── supabase-client.js
│   ├── paystack.js
│   ├── gsap-animations.js
│   ├── three-knowledge-graph.js
│   └── utils.js
├── pages/
│   ├── auth/
│   │   ├── login.html
│   │   ├── register-student.html
│   │   ├── register-guardian.html
│   │   └── register-teacher.html
│   ├── dashboards/
│   │   ├── student.html
│   │   ├── guardian.html
│   │   ├── teacher.html
│   │   └── admin.html
│   ├── vetting/
│   │   ├── stage-1-test.html
│   │   ├── stage-2-video.html
│   │   └── stage-3-interview.html
│   ├── booking/
│   │   ├── select-subject.html
│   │   ├── select-mode.html
│   │   ├── select-teacher.html
│   │   └── confirm-booking.html
│   └── reports/
│       ├── progress-report.html
│       └── invoice.html
├── supabase/
│   ├── schema.sql
│   ├── rls-policies.sql
│   ├── seed.sql
│   └── functions/
│       ├── process-payment/
│       ├── send-notification/
│       ├── generate-report/
│       ├── grade-vetting-test/
│       └── geo-match-teachers/
└── docs/
    ├── architecture.md
    ├── database-schema.md
    └── api-reference.md
```

---

## SECTION 4 — MASTER DESIGN SYSTEM (SOURCE OF TRUTH: index.html)

The approved landing page (`index.html`) is the visual and design authority for this entire project. Every UI decision must reference it. Below are the extracted rules that govern every file.

---

### APPROVED COLOR PALETTE — DEEP ACADEMIC DARK

**Primary backgrounds:**
```
--bg: #060A0F          (deepest background — page base)
--bg-2: #0B1118        (section alternating background)
--bg-3: #101820        (tertiary background)
--surface: #131C26     (card backgrounds)
--surface-2: #1A2535   (elevated surfaces, nav overlays)
```

**Borders:**
```
--border: #1E2D40      (default border)
--border-2: #253548    (stronger border, button outlines)
```

**Accent (PRIMARY BRAND COLOR — use for all highlights, CTAs, icons):**
```
--em: #00C896
--em-dim: #00A07A                       (hover state of accent)
--em-glow: rgba(0,200,150,0.12)         (subtle accent backgrounds)
--em-glow-s: rgba(0,200,150,0.22)       (stronger glow)
```

**Secondary accent:**
```
--amber: #F5A623                        (WAEC tags and secondary highlights)
--amber-glow: rgba(245,166,35,0.1)
```

**Text:**
```
--t1: #F0F4F8   (primary text — headings, important content)
--t2: #8A9BAE   (secondary text — body, descriptions)
--t3: #4A5C6E   (muted text — labels, metadata, placeholders)
--t4: #2A3C50   (very muted — footer copy, disabled states)
```

---

### APPROVED TYPOGRAPHY

- **Primary font:** `'Syne'` — all headings, nav, buttons, UI labels
- **Serif accent:** `'Instrument Serif'` italic — used sparingly inside headings for the italic accent word (e.g. "Three Gates. No *Exceptions.*")
- **Monospace:** `'JetBrains Mono'` — labels, kicker text, terminal blocks, stat labels, tags, badge text

**Heading scale:** font-weight 800, letter-spacing -.035em to -.05em, line-height 1.05 or tighter  
**Body:** font-weight 400, color var(--t2), line-height 1.85  
**Labels:** JetBrains Mono, .6rem–.68rem, letter-spacing .1em–.18em, uppercase, color var(--t3) or var(--em)

---

### APPROVED COMPONENT PATTERNS (replicate exactly)

**1. SECTION KICKER**
```html
<div class="section-kicker">
  <div class="kicker-line"></div>
  <span class="kicker-text">Label Text</span>
</div>
```
A 24px green line + uppercase mono label. Used above every section H2.

**2. SECTION TITLE**
```html
<h2 class="section-title">
  Main Title.<br><span class="serif">Italic Word.</span>
</h2>
```
Always has one Instrument Serif italic accent word in green.

**3. CARD PATTERN**
- `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 10px or 12px`
- `padding: 2rem to 2.75rem`, `position: relative`, `overflow: hidden`
- On hover: border-color toward var(--em), `translateY(-4px)` or background lightens to var(--surface-2)
- Hover reveal line: `::after` pseudo, bottom 0, height 1.5px, `linear-gradient(transparent→em→transparent)`, `scaleX(0)→scaleX(1)` on hover

**4. BUTTON: `.btn-em` (primary CTA)**
- `background: var(--em)`, `color: #020D08` (near-black)
- Font: Syne, .76rem–.82rem, weight 700, letter-spacing .05em–.06em
- `border-radius: 4px`
- Hover: `box-shadow: 0 0 28px rgba(0,200,150,.35)`, `translateY(-1px)`
- No border-radius-full — always sharp 4px radius

**5. BUTTON: `.btn-out` (secondary)**
- `background: transparent`, `border: 1px solid var(--border-2)`, `color: var(--t2)`
- `border-radius: 4px`
- Hover: `border-color: var(--em)`, `color: var(--em)`

**6. TAG/BADGE PATTERN**
- `.pack-tag` base: inline-flex, JetBrains Mono, .6rem, letter-spacing .1em, uppercase, border-radius 100px
- `.t-em`: em-glow background, em border 0.25 opacity, em color
- `.t-am`: amber-glow background, amber border, amber color
- `.t-nt`: surface-2 background, border-2 border, t3 color

**7. HERO TICKER PATTERN**
- inline-flex pill, `border: 1px solid rgba(0,200,150,.25)`, `border-radius: 100px`
- Contains animated blink dot + mono label

**8. STAT BLOCK PATTERN**
- Large number: font-weight 800, letter-spacing -.05em, color var(--t1)
- Accent parts: color var(--em)
- Label: JetBrains Mono, .6rem, letter-spacing .1em, color var(--t3), uppercase

**9. SECTION BACKGROUND ALTERNATION**
```
Hero:    var(--bg)
Who:     var(--bg)   with padding 7rem
Vetting: var(--bg-2)
Packs:   var(--bg)
Mission: var(--bg-2)
Footer:  var(--bg)   with border-top var(--border)
```
This bg-2/bg alternation pattern must be maintained across all pages.

**10. GRID OVERLAY (hero background effect)**
```css
background-image: linear-gradient(rgba(0,200,150,.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,200,150,.03) 1px, transparent 1px);
background-size: 72px 72px;
animation: gridDrift 30s ease infinite;
```
Used only on hero/header sections.

**11. WATERMARK TEXT EFFECT**
```css
position: absolute; font-size: 20vw; font-weight: 800;
color: rgba(255,255,255,.015); pointer-events: none; white-space: nowrap;
```
Decorative background text on feature sections (e.g. the word "GAUNTLET" in the vetting section).

**12. TERMINAL BLOCK**
- `background: var(--bg)`, `border: var(--border)`, `.term-bar` with traffic light dots
- `.term-body`: JetBrains Mono .72rem, line-height 2
- `.term-p` (prompt) = var(--em), `.term-c` (command) = var(--t2), `.term-o` (output) = var(--t3) with indent, `.term-em` (highlighted output) = var(--em)

**13. ANIMATIONS — APPROVED PATTERNS**
- Page reveal: `.reveal` class, `opacity: 0 + translateY(28px)`, transition `.75s cubic-bezier(.22,1,.36,1)`. Triggered by IntersectionObserver adding `.in` class.
- Stagger delays: `.d1` .1s, `.d2` .2s, `.d3` .3s, `.d4` .4s
- Count-up: `data-target` attribute, eased over 1400ms
- Parallax on hero h1 and subtitle: `scrollY * .15` and `scrollY * .08`
- Custom cursor: 8px dot + 36px ring, ring lags behind with lerp factor .12, expands on hover
- Hero entry: `@keyframes fadeSlide` — opacity 0 + translateY(24px) with staggered `animation-delay` per element

---

### THINGS THAT ARE FORBIDDEN IN THIS PROJECT

- No white or light backgrounds anywhere
- No `border-radius` above 12px on cards (use 10px or 12px only)
- No rounded pill buttons — always 4px radius on `.btn-em` and `.btn-out`
- No blue color anywhere — the only accent is `#00C896` green
- No heavy drop shadows with color — use `rgba(0,0,0,.6)` only
- No gradient backgrounds on full sections — only flat `var(--bg)` or `var(--bg-2)` alternation
- No font other than Syne, Instrument Serif, or JetBrains Mono
- No inline styles in any new file — all styles in CSS files using CSS custom properties
- No GSAP CDN — this project uses vanilla CSS animations and IntersectionObserver as demonstrated in `index.html`
- No Three.js on inner pages — only if building the 3D Knowledge Graph feature specifically

---

### RESPONSIVE BREAKPOINTS (exact from index.html)

- `max-width: 1080px` — collapse multi-column grids, hide hero visual
- `max-width: 640px` — single column everything, hide nav-center, disable custom cursor

---

## SECTION 5 — THREE ACCOUNT TYPES

### 1. Independent Student (`role: 'student'`)
Self-managed learning and payments. Dashboard: Syllabus Mastery Tracker, session booking, online classroom, 3D Knowledge Graph, session history.

### 2. Guardian (`role: 'guardian'`)
Proxy account managing one or more dependent children. Dashboard: child progress overview, lesson history, financial controls, home/online mode selection, Lesson Summary Notes, PDF progress reports, professional invoicing.

### 3. Teacher (`role: 'teacher'`)
Vetted specialist. Begins in `pending` state — zero student visibility until fully vetted. States: `pending → stage_1_passed → stage_2_passed → verified → active`. Dashboard: schedule heatmap, earnings wallet, student syllabus alignment tools. Mastery Score (%) displayed prominently on public profile after `verified`.

### 4. Admin (`role: 'admin'`)
Reviews Stage 2 video demos and conducts Stage 3 interviews. Approves or rejects teacher applications.

---

## SECTION 6 — TEACHER VETTING STATE MACHINE

**State flow:** `pending` → `stage_1_passed` → `stage_2_passed` → `verified` → `suspended`

| Stage | Mechanism | Details |
|---|---|---|
| Stage 1 | Automated timed subject proficiency test | Auto-graded by Edge Function. Pass threshold: 70%. Failure penalty: 7-day lockout (`locked_until` in DB). Score stored as `mastery_score` |
| Stage 2 | In-dashboard video teaching demo | Teacher records and uploads inside dashboard. Stored in Supabase Storage. Status → `stage_2_passed` after upload, pending admin review |
| Stage 3 | Human admin interview | Admin reviews video, conducts interview, triggers `verified` status. `mastery_score` made publicly visible on approval |

---

## SECTION 7 — DATABASE TABLES

Always reference these core tables:

| Table | Key Columns |
|---|---|
| `profiles` | id, user_id, role, full_name, email, phone, avatar_url, created_at |
| `students` | id, profile_id, date_of_birth, school, exam_targets[] |
| `guardians` | id, profile_id, dependent_ids[] |
| `teachers` | id, profile_id, subjects[], vetting_status, mastery_score, locked_until, hourly_rate, is_premium_specialist, location GEOGRAPHY(POINT) |
| `sessions` | id, student_id, teacher_id, subject, mode[home/online], status, scheduled_at, duration_minutes, amount_ngn |
| `bookings` | id, guardian_id OR student_id, teacher_id, session_id, mode, payment_status, created_at |
| `exam_packs` | id, name, exam_target, duration_weeks, sessions_per_week, price_ngn, mode |
| `syllabus_topics` | id, exam_target, subject, topic_name, curriculum_objective, order_index |
| `student_progress` | id, student_id, topic_id, is_completed, completed_at, session_id |
| `lesson_summaries` | id, session_id, teacher_id, student_id, summary_text, topics_covered[], submitted_at |
| `vetting_tests` | id, teacher_id, subject, questions JSONB, score, passed, attempted_at, locked_until |
| `transactions` | id, user_id, type[payment/payout/refund], amount_ngn, paystack_ref, status, created_at |
| `teacher_earnings` | id, teacher_id, session_id, amount_ngn, status[pending/released], created_at |

---

## SECTION 8 — STANDING RULES

### Layout
- Never use HTML `<table>` for layout — CSS Grid and Flexbox only
- Never use inline styles — all styles in dedicated CSS files using CSS custom properties
- Every component must be responsive: tested at **375px** (mobile), **768px** (tablet), **1280px** (desktop)

### Supabase
- Every database table must have **Row Level Security enabled**
- Every Supabase query must have a corresponding RLS policy before it is used in the frontend
- Never expose the **service role key** on the frontend — Edge Functions only
- Always use `js/supabase-client.js` as the single import point for the Supabase client

### GSAP
- Import GSAP and ScrollTrigger from CDN in **every HTML file** that uses animation
- Use ScrollTrigger for all scroll-based reveals
- Default stagger: **0.15s** between sibling elements
- Default reveal: `y: 30, opacity: 0 → y: 0, opacity: 1, duration: 0.6s`
- Page entry animation: always fade + slide on `DOMContentLoaded`

### Forms & Validation
- All forms must have client-side validation before any Supabase call
- Show inline error messages using `--color-error`
- Never disable the submit button after one click without visual feedback
- Use skeleton loaders on all async data-fetching operations

### Naming Conventions
| Type | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `teacher-dashboard.js` |
| JS classes | PascalCase | `class SessionManager` |
| CSS classes | BEM kebab-case | `.dashboard-card__header--active` |
| Supabase tables | snake_case | `student_progress` |
| JS variables | camelCase | `sessionData` |

### Security
- Never store sensitive data in `localStorage` — use Supabase session management
- All user inputs must be sanitized before database insertion
- RLS policies must enforce role-based access at the **database level**, not just the frontend

### After Every Implementation
- Verify no console errors
- Check responsive layout at all three breakpoints (375px / 768px / 1280px)
- Confirm RLS policy exists for any new table queried
- Confirm GSAP animations fire correctly on page load and scroll

---

## SECTION 9 — EXAM TARGETS SUPPORTED

| Exam | Duration | Frequency |
|---|---|---|
| JAMB / UTME | 2–3 months | 3–5 days/week |
| WAEC / NECO | 2–4 months | 3–5 days/week |
| SAT | 2–4 months | 2–4 days/week |
| Post-UTME Prep | 3–6 weeks | 4–5 days/week |
| Standard Hourly | On-demand | Any subject |

---

## SECTION 10 — PAYSTACK INTEGRATION RULES

- Always use Paystack's **inline JS** for payment initiation
- Store transaction reference in `transactions` table **before** redirecting
- Verify payment server-side via Supabase Edge Function before releasing access
- Teacher earnings held in `teacher_earnings` with `status: 'pending'` until session confirmed complete
- Paystack public key goes in a `.env` file — **never hardcoded in JS files**
