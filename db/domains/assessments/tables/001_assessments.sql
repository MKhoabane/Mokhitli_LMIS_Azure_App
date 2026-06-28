CREATE TABLE IF NOT EXISTS assessment (
  id UUID PRIMARY KEY,
  enrollment_id UUID,
  result TEXT,
  score NUMERIC,
  assessment_date DATE
);

CREATE TABLE IF NOT EXISTS assessor_profile (
  name TEXT PRIMARY KEY,
  open_assessments INTEGER NOT NULL,
  due_this_week INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS assessor_queue_item (
  sort_order INTEGER PRIMARY KEY,
  learner TEXT NOT NULL,
  assessment TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assessor_outcome (
  programme TEXT PRIMARY KEY,
  competent INTEGER NOT NULL,
  re_assessments INTEGER NOT NULL,
  CONSTRAINT fk_assessor_outcome_programme
    FOREIGN KEY (programme) REFERENCES programme_catalog(programme_name)
);

CREATE TABLE IF NOT EXISTS assessor_flag (
  sort_order INTEGER PRIMARY KEY,
  flag_text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessor_queue_item_status_due_date
  ON assessor_queue_item (status, due_date);
