INSERT INTO issued_certificate_record
  (certificate_no, learner_name, qualification_name, issued_date, status)
VALUES
  ('CERT-2026-001', 'Sarah Jenkins', 'Supply Chain Essentials', DATE '2026-06-02', 'Issued'),
  ('CERT-2026-002', 'Thabo Mbeki', 'First Aid Readiness', DATE '2026-06-18', 'Issued')
ON CONFLICT (certificate_no) DO NOTHING;
