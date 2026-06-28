INSERT INTO learner_record
  (id, name, email, status, course, attendance, progress, next_assessment, mentor)
VALUES
  (1, 'Thabo Mbeki', 'thabo@example.co.za', 'Active', 'Logistics Management', 96, 74, 'Integrated summative assessment', 'Nomsa Dlamini'),
  (2, 'Sarah Jenkins', 'sarah.j@example.com', 'Completed', 'Supply Chain Essentials', 99, 100, 'Completed', 'Kagiso Mthembu'),
  (3, 'Lerato Khumalo', 'lerato@example.co.za', 'In Workplace', 'Warehouse Operations', 92, 81, 'Practical observation', 'Zanele Sithole')
ON CONFLICT (id) DO NOTHING;

INSERT INTO learner_portal_profile (learner_id, name, programme, nqf_level, facilitator) VALUES
  ('LRN-1001', 'Thabo Mbeki', 'Occupational Certificate: Logistics Management', 5, 'Nomsa Dlamini')
ON CONFLICT (learner_id) DO NOTHING;

INSERT INTO learner_portal_progress (learner_id, sort_order, title, completion) VALUES
  ('LRN-1001', 1, 'Knowledge modules', 82),
  ('LRN-1001', 2, 'Practical modules', 68),
  ('LRN-1001', 3, 'Workplace modules', 74)
ON CONFLICT (learner_id, sort_order) DO NOTHING;

INSERT INTO learner_portal_assessment
  (learner_id, sort_order, title, due_date, assessment_type)
VALUES
  ('LRN-1001', 1, 'Warehouse simulation', DATE '2026-07-02', 'Practical'),
  ('LRN-1001', 2, 'Integrated summative assessment', DATE '2026-07-10', 'Summative')
ON CONFLICT (learner_id, sort_order) DO NOTHING;

INSERT INTO learner_portal_certificate (learner_id, sort_order, title, status) VALUES
  ('LRN-1001', 1, 'First Aid Readiness', 'Issued'),
  ('LRN-1001', 2, 'Workplace Safety Orientation', 'Eligible')
ON CONFLICT (learner_id, sort_order) DO NOTHING;
