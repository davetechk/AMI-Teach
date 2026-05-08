-- EduVault Row Level Security policies
-- Every table must have RLS enabled and at least one policy before being queried from the frontend.
-- Service role bypasses RLS — only used inside Edge Functions.

-- Enable RLS on all tables
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE students         ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians        ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_packs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE syllabus_topics  ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vetting_tests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_earnings ENABLE ROW LEVEL SECURITY;

-- ── profiles ───────────────────────────────────────────────────────────
-- Users can read and update their own profile
CREATE POLICY "profiles: own read"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- ── students ───────────────────────────────────────────────────────────
CREATE POLICY "students: own read"
  ON students FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Guardians can read their dependents' student records
CREATE POLICY "students: guardian read dependents"
  ON students FOR SELECT
  USING (id = ANY(
    SELECT unnest(dependent_ids) FROM guardians
    WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  ));

-- ── guardians ──────────────────────────────────────────────────────────
CREATE POLICY "guardians: own read"
  ON guardians FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ── teachers ───────────────────────────────────────────────────────────
-- Verified teachers are publicly readable (mastery_score visible)
CREATE POLICY "teachers: public read verified"
  ON teachers FOR SELECT
  USING (vetting_status = 'verified');

-- Teachers can read and update their own record
CREATE POLICY "teachers: own read"
  ON teachers FOR SELECT
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "teachers: own update"
  ON teachers FOR UPDATE
  USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- ── sessions ───────────────────────────────────────────────────────────
CREATE POLICY "sessions: student own"
  ON sessions FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

CREATE POLICY "sessions: teacher own"
  ON sessions FOR SELECT
  USING (teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

-- ── bookings ───────────────────────────────────────────────────────────
CREATE POLICY "bookings: guardian own"
  ON bookings FOR SELECT
  USING (guardian_id IN (SELECT id FROM guardians WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

CREATE POLICY "bookings: student own"
  ON bookings FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

-- ── exam_packs & syllabus_topics ───────────────────────────────────────
-- Publicly readable
CREATE POLICY "exam_packs: public read"
  ON exam_packs FOR SELECT USING (true);

CREATE POLICY "syllabus_topics: public read"
  ON syllabus_topics FOR SELECT USING (true);

-- ── student_progress ───────────────────────────────────────────────────
CREATE POLICY "student_progress: own read"
  ON student_progress FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

CREATE POLICY "student_progress: guardian read"
  ON student_progress FOR SELECT
  USING (student_id = ANY(
    SELECT unnest(dependent_ids) FROM guardians
    WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  ));

-- ── lesson_summaries ───────────────────────────────────────────────────
CREATE POLICY "lesson_summaries: student read"
  ON lesson_summaries FOR SELECT
  USING (student_id IN (SELECT id FROM students WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

CREATE POLICY "lesson_summaries: teacher read own"
  ON lesson_summaries FOR SELECT
  USING (teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

-- ── vetting_tests ──────────────────────────────────────────────────────
CREATE POLICY "vetting_tests: teacher own"
  ON vetting_tests FOR SELECT
  USING (teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));

-- ── transactions ───────────────────────────────────────────────────────
CREATE POLICY "transactions: own read"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- ── teacher_earnings ───────────────────────────────────────────────────
CREATE POLICY "teacher_earnings: own read"
  ON teacher_earnings FOR SELECT
  USING (teacher_id IN (SELECT id FROM teachers WHERE profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )));
