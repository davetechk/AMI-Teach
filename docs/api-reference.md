# EduVault — API Reference

All server-side logic runs as Supabase Deno Edge Functions. Functions are called from the frontend via `fetch` with a Bearer token (Supabase anon key). The service role key is injected automatically inside the function runtime.

---

## Edge Functions

### `process-payment`
**POST** `/functions/v1/process-payment`

Verifies a Paystack transaction and releases access.

**Request body:**
```json
{ "paystack_ref": "txn_abc123" }
```

**Actions:**
1. Calls Paystack `/transaction/verify/:reference`
2. On success: updates `transactions.status = 'success'`, inserts `bookings`, inserts `sessions`, inserts `teacher_earnings` with `status: 'pending'`
3. Calls `send-notification` for booking confirmation

---

### `send-notification`
**POST** `/functions/v1/send-notification`

Dispatches email and/or SMS to a user.

**Request body:**
```json
{
  "user_id": "uuid",
  "type": "booking_confirmed | session_reminder | vetting_update",
  "payload": {}
}
```

---

### `generate-report`
**POST** `/functions/v1/generate-report`

Compiles a student's progress data into a structured report object.

**Request body:**
```json
{ "student_id": "uuid" }
```

**Response:**
```json
{
  "student": {},
  "sessions": [],
  "topics_completed": [],
  "lesson_summaries": [],
  "completion_pct": 0.0
}
```

---

### `grade-vetting-test`
**POST** `/functions/v1/grade-vetting-test`

Scores a teacher's Stage 1 proficiency test.

**Request body:**
```json
{
  "teacher_id": "uuid",
  "test_id": "uuid",
  "answers": [{ "question_id": "uuid", "selected": "A" }]
}
```

**Response:**
```json
{
  "score": 85.0,
  "passed": true,
  "new_status": "stage_1_passed",
  "locked_until": null
}
```

---

### `geo-match-teachers`
**POST** `/functions/v1/geo-match-teachers`

Returns verified teachers within range for home tutoring.

**Request body:**
```json
{
  "latitude": 6.5244,
  "longitude": 3.3792,
  "subject": "Mathematics",
  "radius_km": 10
}
```

**Response:**
```json
{
  "teachers": [
    {
      "id": "uuid",
      "full_name": "...",
      "mastery_score": 91.5,
      "hourly_rate": 12000,
      "distance_km": 3.2
    }
  ]
}
```
