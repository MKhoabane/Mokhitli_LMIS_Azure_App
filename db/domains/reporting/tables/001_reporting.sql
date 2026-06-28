CREATE TABLE IF NOT EXISTS reporting_metric (
  metric_name TEXT PRIMARY KEY,
  metric_value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reporting_monthly_trend (
  sort_order INTEGER PRIMARY KEY,
  month_label TEXT NOT NULL,
  learners INTEGER NOT NULL,
  certificates INTEGER NOT NULL
);
