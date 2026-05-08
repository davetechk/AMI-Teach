# EduVault — Database Schema Reference

Full SQL definitions are in `supabase/schema.sql`. This document describes the purpose and key relationships of each table.

---

## Table Map

| Table | Purpose |
|---|---|
| `profiles` | One per auth user. Stores role and shared identity data. |
| `students` | Extended profile for `role: student`. Tracks school and exam targets. |
| `guardians` | Extended profile for `role: guardian`. Holds `dependent_ids[]` linking to student records. |
| `teachers` | Extended profile for `role: teacher`. Core vetting state machine and geo-location. |
| `sessions` | A scheduled or completed tutoring session between one student and one teacher. |
| `bookings` | Links a guardian or student to a session with payment status. |
| `exam_packs` | Pre-configured lesson bundles tied to a specific exam target. |
| `syllabus_topics` | The curriculum map. Each row is one examinable topic per exam and subject. |
| `student_progress` | One row per (student, topic) pair. Tracks completion. |
| `lesson_summaries` | Teacher-submitted summary after each session. Delivered to guardian/student. |
| `vetting_tests` | Stores test questions (JSONB), score, and lockout state per teacher. |
| `transactions` | Every Paystack charge or payout. Single source of truth for financial records. |
| `teacher_earnings` | Per-session earnings accrued by a teacher. Released after session completion. |

---

## Key Relationships

```
auth.users
  └── profiles (user_id)
        ├── students (profile_id)
        │     ├── student_progress (student_id)
        │     ├── lesson_summaries (student_id)
        │     └── sessions (student_id)
        ├── guardians (profile_id)
        │     └── dependent_ids[] → students.id
        └── teachers (profile_id)
              ├── sessions (teacher_id)
              ├── lesson_summaries (teacher_id)
              ├── vetting_tests (teacher_id)
              └── teacher_earnings (teacher_id)

sessions
  └── bookings (session_id)
  └── lesson_summaries (session_id)
  └── student_progress (session_id)
  └── teacher_earnings (session_id)

transactions
  └── linked to bookings via paystack_ref
```

---

## Monetary Conventions

- All monetary columns are `NUMERIC(10,2)` and stored in **NGN (Naira)**.
- Column names use the `_ngn` suffix (e.g., `amount_ngn`, `price_ngn`, `hourly_rate`).
- No currency conversion is performed in the database — all conversion is handled at the Edge Function or display layer.
