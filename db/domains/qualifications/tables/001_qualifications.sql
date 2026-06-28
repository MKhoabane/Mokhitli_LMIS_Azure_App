CREATE TABLE IF NOT EXISTS provider (
  provider_id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  accreditation_no TEXT,
  contact_email TEXT
);

CREATE TABLE IF NOT EXISTS qualification (
  qualification_id UUID PRIMARY KEY,
  qcto_id TEXT,
  title TEXT,
  nqf_level INT
);

CREATE TABLE IF NOT EXISTS qualification_record (
  code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  nqf_level INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  status TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_qualification_record_title
  ON qualification_record (title);
