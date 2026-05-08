# EduVault

**"Not a tutoring marketplace. An Education Authority."**

EduVault is a premium, institutional-grade tutoring and exam mastery platform targeting Nigerian secondary and university students, their guardians, and professional educators.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) — no frameworks |
| Animations | GSAP 3 via CDN (ScrollTrigger, Timelines, staggers) |
| 3D Visuals | Three.js via CDN (3D Knowledge Graph) |
| Backend | Supabase (Auth, PostgreSQL, Realtime, RLS, Edge Functions/Deno) |
| Geo-Matching | PostGIS via Supabase |
| Payments | Paystack (NGN-first) |
| Deployment | Vercel (frontend) + Supabase (backend) |

---

## Folder Structure

```
eduvault/
├── index.html                  # Landing page
├── assets/                     # Static assets (fonts, icons, images)
├── css/                        # All stylesheets
│   ├── tokens.css              # Design system CSS custom properties
│   ├── global.css              # Resets and base styles
│   ├── components.css          # Shared UI components
│   └── dashboard-*.css         # Role-specific dashboard styles
├── js/                         # All JavaScript modules
│   ├── supabase-client.js      # Single Supabase client instance
│   ├── auth.js                 # Auth helpers
│   ├── router.js               # Client-side router
│   ├── gsap-animations.js      # Shared GSAP animation utilities
│   ├── three-knowledge-graph.js # Three.js 3D Knowledge Graph
│   └── paystack.js             # Paystack payment integration
├── pages/                      # All HTML pages by feature
│   ├── auth/                   # Login and registration flows
│   ├── dashboards/             # Role-based dashboards
│   ├── vetting/                # Teacher vetting stages 1–3
│   ├── booking/                # Lesson booking flow
│   └── reports/                # Progress reports and invoices
├── supabase/                   # Database and backend
│   ├── schema.sql              # Table definitions
│   ├── rls-policies.sql        # Row Level Security policies
│   ├── seed.sql                # Seed data
│   └── functions/              # Deno Edge Functions
└── docs/                       # Technical documentation
```

---

## Setup

### Prerequisites
- Node.js (for Supabase CLI and Vercel CLI)
- Supabase CLI: `npm install -g supabase`
- Vercel CLI: `npm install -g vercel`

### Environment Variables

Create a `.env` file at the project root:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

> **Never commit `.env` to version control.** The service role key is used only in Edge Functions and never exposed to the frontend.

### Local Development

```bash
# Initialise Supabase locally
supabase init
supabase start

# Apply schema and RLS policies
supabase db reset

# Deploy Edge Functions
supabase functions deploy process-payment
supabase functions deploy send-notification
supabase functions deploy generate-report
supabase functions deploy grade-vetting-test
supabase functions deploy geo-match-teachers

# Deploy frontend to Vercel
vercel
```

---

## Account Types

### Independent Student
Self-managed account. Books sessions independently, tracks syllabus progress, accesses the 3D Knowledge Graph, and pays directly via Paystack.

### Guardian
Proxy account managing one or more dependent children. Controls lesson mode (home or online), receives Lesson Summary Notes after each session, and downloads PDF progress reports and professional invoices.

### Teacher (Vetted Specialist)
Invisible to students until fully vetted through a 3-stage process:
1. **Stage 1** — Automated timed subject proficiency test (pass threshold: 70%)
2. **Stage 2** — In-dashboard video teaching demo reviewed by admin
3. **Stage 3** — Human admin interview → grants `verified` status

Verified teachers receive a publicly visible **Mastery Score (%)** on their profile.

### Admin
Internal role. Reviews Stage 2 video demos, conducts Stage 3 interviews, and approves or rejects teacher applications.

---

## Documentation

See [`docs/architecture.md`](docs/architecture.md) for the full technical reference including data flow diagrams, Edge Function specifications, and the PostGIS geo-matching implementation.
