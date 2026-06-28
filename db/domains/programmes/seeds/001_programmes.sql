INSERT INTO programme_catalog (programme_name, programme_type) VALUES
  ('Occupational Certificate: Logistics Management', 'qualification'),
  ('Occupational Certificate: Warehouse Operations', 'qualification'),
  ('Supply Chain Practitioner', 'qualification'),
  ('Logistics Management', 'programme'),
  ('Warehouse Operations', 'programme'),
  ('Supply Chain Essentials', 'programme'),
  ('First Aid Readiness', 'short-course')
ON CONFLICT (programme_name) DO NOTHING;
