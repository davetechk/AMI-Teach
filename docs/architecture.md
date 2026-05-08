# EduVault — Architecture Reference

## Overview

EduVault is a static-frontend / managed-backend architecture. The frontend is pure HTML/CSS/Vanilla JS deployed on Vercel. All data, auth, and server logic lives in Supabase (PostgreSQL + Edge Functions). There is no Node.js server.

---

## Data Flow

### Booking Flow
```
User (browser)
  → select-subject.html        — picks subject + exam target
  → select-mode.html           — picks Home or Online
  → select-teacher.html        — calls geo-match-teachers Edge Function (Home) OR queries teachers table directly (Online)
  → confirm-booking.html       — Paystack inline charge
       → transactions INSERT (status: pending) before charge initiates
       → Paystack callback → process-payment Edge Function
           → Paystack API verify
           → transactions UPDATE (status: success)
           → bookings INSERT
           → sessions INSERT
           → teacher_earnings INSERT (status: pending)
           → send-notification Edge Function (confirmation SMS/email)
```

### Teacher Vetting Flow
```
register-teacher.html → profiles INSERT (role: teacher) + teachers INSERT (vetting_status: pending)
  → stage-1-test.html        — timed quiz, submits answers
       → grade-vetting-test Edge Function
           → score calculated
           → vetting_tests UPDATE (score, passed)
           → If pass: teachers UPDATE (vetting_status: stage_1_passed, mastery_score)
           → If fail: teachers UPDATE (locked_until: now() + 7 days)
  → stage-2-video.html       — video upload to Supabase Storage
       → teachers UPDATE (vetting_status: stage_2_passed)
  → admin.html (admin)       — admin reviews video, conducts interview
       → teachers UPDATE (vetting_status: verified)
       → mastery_score now publicly visible
```

### Auth & Role Routing
```
login.html → supabase.auth.signInWithPassword()
  → on success: read profiles.role
      → student   → /pages/dashboards/student.html
      → guardian  → /pages/dashboards/guardian.html
      → teacher   → /pages/dashboards/teacher.html (or vetting page if not verified)
      → admin     → /pages/dashboards/admin.html
```

---

## Security Model

- **Anon key** is used client-side. RLS policies enforce all data access at the database level.
- **Service role key** is only used inside Deno Edge Functions — never exposed to the browser.
- Teacher records with `vetting_status != 'verified'` are not readable by other users (see `rls-policies.sql`).
- Payments are verified server-side (Edge Function) before any access is released.

---

## PostGIS Geo-Matching

The `teachers.location` column is a `GEOGRAPHY(POINT, 4326)`. The `geo-match-teachers` Edge Function runs:

```sql
SELECT * FROM teachers
WHERE vetting_status = 'verified'
  AND $subject = ANY(subjects)
  AND ST_DWithin(
    location,
    ST_Point($longitude, $latitude)::geography,
    $radius_km * 1000
  )
ORDER BY ST_Distance(location, ST_Point($longitude, $latitude)::geography);
```

Teachers update their location via a one-time prompt in their dashboard using the browser Geolocation API.

---

## CDN Dependencies

| Library | CDN URL |
|---|---|
| GSAP 3 | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` |
| ScrollTrigger | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js` |
| Three.js | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` |
| Supabase JS | `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js` |
| Paystack Inline | `https://js.paystack.co/v1/inline.js` |

---

## Environment Variables

| Variable | Where Used | Notes |
|---|---|---|
| `SUPABASE_URL` | Frontend (via `window.__ENV__`) | Injected by Vercel at build time |
| `SUPABASE_ANON_KEY` | Frontend | Safe for client — RLS enforces access |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Functions only | Never in frontend code |
| `PAYSTACK_PUBLIC_KEY` | Frontend (`paystack.js`) | Injected via `.env` |
| `PAYSTACK_SECRET_KEY` | Edge Functions only | Never in frontend code |
