INSERT INTO assessor_profile (name, open_assessments, due_this_week) VALUES
  ('Kagiso Mthembu', 18, 7)
ON CONFLICT (name) DO NOTHING;

INSERT INTO assessor_queue_item (sort_order, learner, assessment, due_date, status) VALUES
  (1, 'Thabo Mbeki', 'Integrated summative assessment', DATE '2026-07-01', 'Ready for marking'),
  (2, 'Lerato Khumalo', 'Practical observation', DATE '2026-07-03', 'Evidence submitted')
ON CONFLICT (sort_order) DO NOTHING;

INSERT INTO assessor_outcome (programme, competent, re_assessments) VALUES
  ('Logistics Management', 42, 6),
  ('Warehouse Operations', 27, 4)
ON CONFLICT (programme) DO NOTHING;

INSERT INTO assessor_flag (sort_order, flag_text) VALUES
  (1, '2 evidence packs require workplace verification'),
  (2, '1 assessor decision awaiting moderator confirmation')
ON CONFLICT (sort_order) DO NOTHING;
