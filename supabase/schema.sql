-- EduVault database schema
-- Run via: supabase db reset
-- Requires: PostGIS extension enabled in Supabase dashboard

-- Enable PostGIS for geo-matching
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── profiles ──────────────────────────────────────────────────────────
CREATE TABLE profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'guardian', 'teacher', 'admin')),
  full_name   TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── students ───────────────────────────────────────────────────────────
CREATE TABLE students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date_of_birth DATE,
  school        TEXT,
  exam_targets  TEXT[] DEFAULT '{}'
);

-- ── guardians ──────────────────────────────────────────────────────────
CREATE TABLE guardians (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  dependent_ids  UUID[] DEFAULT '{}'
);

-- ── teachers ───────────────────────────────────────────────────────────
CREATE TABLE teachers (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id            UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subjects              TEXT[] DEFAULT '{}',
  vetting_status        TEXT NOT NULL DEFAULT 'pending'
                          CHECK (vetting_status IN ('pending','stage_1_passed','stage_2_passed','verified','suspended')),
  mastery_score         NUMERIC(5,2),
  locked_until          TIMESTAMPTZ,
  hourly_rate           NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_premium_specialist BOOLEAN DEFAULT false,
  location              GEOGRAPHY(POINT, 4326)
);

-- ── sessions ───────────────────────────────────────────────────────────
CREATE TABLE sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID REFERENCES students(id) ON DELETE SET NULL,
  teacher_id       UUID REFERENCES teachers(id) ON DELETE SET NULL,
  subject          TEXT NOT NULL,
  mode             TEXT NOT NULL CHECK (mode IN ('home', 'online')),
  status           TEXT NOT NULL DEFAULT 'scheduled'
                     CHECK (status IN ('scheduled','in_progress','completed','cancelled')),
  scheduled_at     TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  amount_ngn       NUMERIC(10,2) NOT NULL
);

-- ── bookings ───────────────────────────────────────────────────────────
CREATE TABLE bookings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id    UUID REFERENCES guardians(id) ON DELETE SET NULL,
  student_id     UUID REFERENCES students(id) ON DELETE SET NULL,
  teacher_id     UUID REFERENCES teachers(id) ON DELETE SET NULL,
  session_id     UUID REFERENCES sessions(id) ON DELETE CASCADE,
  mode           TEXT NOT NULL CHECK (mode IN ('home', 'online')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
                   CHECK (payment_status IN ('pending','paid','failed','refunded')),
  created_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── exam_packs ─────────────────────────────────────────────────────────
CREATE TABLE exam_packs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  exam_target       TEXT NOT NULL,
  duration_weeks    INTEGER NOT NULL,
  sessions_per_week INTEGER NOT NULL,
  price_ngn         NUMERIC(10,2) NOT NULL,
  mode              TEXT NOT NULL CHECK (mode IN ('home', 'online'))
);

-- ── syllabus_topics ────────────────────────────────────────────────────
CREATE TABLE syllabus_topics (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_target           TEXT NOT NULL,
  subject               TEXT NOT NULL,
  topic_name            TEXT NOT NULL,
  curriculum_objective  TEXT,
  order_index           INTEGER NOT NULL DEFAULT 0
);

-- ── student_progress ───────────────────────────────────────────────────
CREATE TABLE student_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  topic_id     UUID REFERENCES syllabus_topics(id) ON DELETE CASCADE NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  session_id   UUID REFERENCES sessions(id) ON DELETE SET NULL,
  UNIQUE (student_id, topic_id)
);

-- ── lesson_summaries ───────────────────────────────────────────────────
CREATE TABLE lesson_summaries (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  teacher_id       UUID REFERENCES teachers(id) ON DELETE SET NULL,
  student_id       UUID REFERENCES students(id) ON DELETE SET NULL,
  summary_text     TEXT NOT NULL,
  topics_covered   UUID[] DEFAULT '{}',
  submitted_at     TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── vetting_tests ──────────────────────────────────────────────────────
CREATE TABLE vetting_tests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id   UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  subject      TEXT NOT NULL,
  questions    JSONB NOT NULL DEFAULT '[]',
  score        NUMERIC(5,2),
  passed       BOOLEAN,
  attempted_at TIMESTAMPTZ,
  locked_until TIMESTAMPTZ
);

-- ── transactions ───────────────────────────────────────────────────────
CREATE TABLE transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type         TEXT NOT NULL CHECK (type IN ('payment', 'payout', 'refund')),
  amount_ngn   NUMERIC(10,2) NOT NULL,
  paystack_ref TEXT UNIQUE,
  status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','success','failed')),
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── teacher_earnings ───────────────────────────────────────────────────
CREATE TABLE teacher_earnings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  amount_ngn NUMERIC(10,2) NOT NULL,
  status     TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'released')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
