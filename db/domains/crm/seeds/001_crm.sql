INSERT INTO crm_metric (metric_name, metric_value) VALUES
  ('leads', 34),
  ('activeEmployers', 12),
  ('conversionRate', 41)
ON CONFLICT (metric_name) DO NOTHING;

INSERT INTO crm_opportunity (account_name, stage, opportunity_value) VALUES
  ('Blue Crane Logistics', 'Proposal', 260000),
  ('Gauteng Warehousing Group', 'Negotiation', 410000)
ON CONFLICT (account_name) DO NOTHING;
