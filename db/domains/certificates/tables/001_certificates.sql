CREATE TABLE IF NOT EXISTS certificate (
  id UUID PRIMARY KEY,
  enrollment_id UUID,
  certificate_no TEXT,
  issued_date DATE
);

CREATE TABLE IF NOT EXISTS issued_certificate_record (
  certificate_no TEXT PRIMARY KEY,
  learner_name TEXT NOT NULL,
  qualification_name TEXT NOT NULL,
  issued_date DATE NOT NULL,
  status TEXT NOT NULL,
  CONSTRAINT fk_issued_certificate_record_programme
    FOREIGN KEY (qualification_name) REFERENCES programme_catalog(programme_name)
);

CREATE INDEX IF NOT EXISTS idx_issued_certificate_record_qualification_status
  ON issued_certificate_record (qualification_name, status);
