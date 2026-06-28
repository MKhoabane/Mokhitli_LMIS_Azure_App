INSERT INTO ai_recommendation (sort_order, recommendation) VALUES
  (1, 'Flag LOG-2026-B for learner support intervention.'),
  (2, 'Increase workplace visits for Midrand Hub placements.'),
  (3, 'Schedule moderation follow-up for incomplete evidence packs.')
ON CONFLICT (sort_order) DO NOTHING;

INSERT INTO ai_risk_indicator (label, score) VALUES
  ('Assessment backlog risk', 63),
  ('Workplace placement risk', 48),
  ('Certification delay risk', 35)
ON CONFLICT (label) DO NOTHING;
