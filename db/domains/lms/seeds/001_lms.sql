INSERT INTO facilitator_profile (name, active_cohorts, assigned_learners) VALUES
  ('Nomsa Dlamini', 4, 118)
ON CONFLICT (name) DO NOTHING;

INSERT INTO facilitator_cohort (name, completion, at_risk, sort_order) VALUES
  ('LOG-2026-A', 71, 3, 1),
  ('LOG-2026-B', 65, 5, 2),
  ('WRH-2026-A', 78, 2, 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO facilitator_session (sort_order, cohort, module, session_date, attendance) VALUES
  (1, 'LOG-2026-A', 'Inventory Planning', DATE '2026-06-29', 29),
  (2, 'LOG-2026-B', 'Transport Operations', DATE '2026-06-30', 31)
ON CONFLICT (sort_order) DO NOTHING;

INSERT INTO facilitator_action (sort_order, action_text) VALUES
  (1, 'Approve learner catch-up plans'),
  (2, 'Upload moderated evidence pack'),
  (3, 'Confirm workplace visit schedule')
ON CONFLICT (sort_order) DO NOTHING;
