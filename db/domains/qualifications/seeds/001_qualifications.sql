INSERT INTO qualification_record (code, title, nqf_level, credits, status) VALUES
  ('QCTO-LOG-01', 'Occupational Certificate: Logistics Management', 5, 240, 'Active'),
  ('QCTO-WRH-02', 'Occupational Certificate: Warehouse Operations', 4, 180, 'Active'),
  ('QCTO-SCM-03', 'Supply Chain Practitioner', 5, 210, 'Review')
ON CONFLICT (code) DO NOTHING;
