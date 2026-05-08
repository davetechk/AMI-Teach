-- EduVault seed data — development and staging use only
-- Populates exam_packs and syllabus_topics; does not create real auth users

-- ── Exam packs ─────────────────────────────────────────────────────────
INSERT INTO exam_packs (name, exam_target, duration_weeks, sessions_per_week, price_ngn, mode) VALUES
  ('JAMB Intensive (Online)',     'JAMB/UTME',    10, 4, 120000.00, 'online'),
  ('JAMB Intensive (Home)',       'JAMB/UTME',    10, 4, 180000.00, 'home'),
  ('WAEC Masterclass (Online)',   'WAEC/NECO',    12, 4, 130000.00, 'online'),
  ('WAEC Masterclass (Home)',     'WAEC/NECO',    12, 4, 200000.00, 'home'),
  ('SAT Prep (Online)',           'SAT',          12, 3, 150000.00, 'online'),
  ('Post-UTME Sprint (Online)',   'Post-UTME',     5, 5,  80000.00, 'online'),
  ('Standard Hourly (Online)',    'Standard',      0, 0,   8000.00, 'online'),
  ('Standard Hourly (Home)',      'Standard',      0, 0,  12000.00, 'home');

-- ── Sample syllabus topics — JAMB Mathematics ──────────────────────────
INSERT INTO syllabus_topics (exam_target, subject, topic_name, curriculum_objective, order_index) VALUES
  ('JAMB/UTME', 'Mathematics', 'Number Bases',          'Convert between bases and perform arithmetic in non-decimal systems', 1),
  ('JAMB/UTME', 'Mathematics', 'Fractions and Indices', 'Simplify expressions involving fractions, surds, and index laws',      2),
  ('JAMB/UTME', 'Mathematics', 'Logarithms',            'Apply laws of logarithms to solve equations',                         3),
  ('JAMB/UTME', 'Mathematics', 'Linear Equations',      'Solve simultaneous and quadratic equations',                          4),
  ('JAMB/UTME', 'Mathematics', 'Sets',                  'Use Venn diagrams to solve set theory problems',                      5),
  ('JAMB/UTME', 'Mathematics', 'Geometry',              'Apply properties of triangles, circles, and polygons',                6),
  ('JAMB/UTME', 'Mathematics', 'Trigonometry',          'Solve problems using SOHCAHTOA and trigonometric identities',         7),
  ('JAMB/UTME', 'Mathematics', 'Statistics',            'Calculate mean, median, mode, and standard deviation',                8);
