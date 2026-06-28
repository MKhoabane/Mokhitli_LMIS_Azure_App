INSERT INTO parent_portal_profile (learner_name, programme, attendance, progress) VALUES
  ('Thabo Mbeki', 'Logistics Management', 96, 74)
ON CONFLICT (learner_name) DO NOTHING;

INSERT INTO parent_alert (sort_order, message, level) VALUES
  (1, 'Integrated summative assessment scheduled for 10 Jul 2026', 'info'),
  (2, 'Workplace mentor feedback uploaded successfully', 'success')
ON CONFLICT (sort_order) DO NOTHING;

INSERT INTO parent_milestone (title, status, sort_order) VALUES
  ('Knowledge modules completed', 'Completed', 1),
  ('Workplace evidence portfolio', 'In progress', 2),
  ('Certification review', 'Pending', 3)
ON CONFLICT (title) DO NOTHING;
