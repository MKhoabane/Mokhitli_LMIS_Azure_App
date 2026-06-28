INSERT INTO reporting_metric (metric_name, metric_value) VALUES
  ('completionRate', 88),
  ('placementRate', 79),
  ('certificationRate', 84)
ON CONFLICT (metric_name) DO NOTHING;

INSERT INTO reporting_monthly_trend (sort_order, month_label, learners, certificates) VALUES
  (1, 'Apr', 98, 24),
  (2, 'May', 110, 29),
  (3, 'Jun', 121, 33)
ON CONFLICT (sort_order) DO NOTHING;
