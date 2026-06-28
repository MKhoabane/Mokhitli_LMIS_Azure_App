INSERT INTO moderator_profile (name, moderation_batches, compliance_score) VALUES
  ('Zanele Sithole', 6, 97)
ON CONFLICT (name) DO NOTHING;

INSERT INTO moderation_queue_item (batch, programme, sample_size, status, sort_order) VALUES
  ('MOD-2406-01', 'Logistics Management', 12, 'In review', 1),
  ('MOD-2406-02', 'Warehouse Operations', 8, 'Awaiting evidence', 2)
ON CONFLICT (batch) DO NOTHING;

INSERT INTO moderation_finding (category, total, severity, sort_order) VALUES
  ('Assessment decisions', 2, 'Medium', 1),
  ('Evidence completeness', 1, 'High', 2),
  ('Assessor feedback', 4, 'Low', 3)
ON CONFLICT (category) DO NOTHING;

INSERT INTO moderator_action (sort_order, action_text) VALUES
  (1, 'Sign off batch MOD-2406-01'),
  (2, 'Escalate incomplete workplace evidence'),
  (3, 'Review assessor calibration trend')
ON CONFLICT (sort_order) DO NOTHING;
