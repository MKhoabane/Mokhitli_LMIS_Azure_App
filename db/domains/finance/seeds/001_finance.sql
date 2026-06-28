INSERT INTO finance_metric (metric_name, metric_value) VALUES
  ('invoiced', 1480000),
  ('collected', 1195000),
  ('outstanding', 285000),
  ('bursaries', 740000)
ON CONFLICT (metric_name) DO NOTHING;

INSERT INTO finance_transaction (reference, customer, amount, status) VALUES
  ('INV-240601', 'SETA Grant', 320000, 'Paid'),
  ('INV-240619', 'Mokhitli Logistics Partners', 185000, 'Pending')
ON CONFLICT (reference) DO NOTHING;
