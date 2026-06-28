CREATE TABLE IF NOT EXISTS moderator_profile (
  name TEXT PRIMARY KEY,
  moderation_batches INTEGER NOT NULL,
  compliance_score INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS moderation_queue_item (
  batch TEXT PRIMARY KEY,
  programme TEXT NOT NULL,
  sample_size INTEGER NOT NULL,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE,
  CONSTRAINT fk_moderation_queue_item_programme
    FOREIGN KEY (programme) REFERENCES programme_catalog(programme_name)
);

CREATE TABLE IF NOT EXISTS moderation_finding (
  category TEXT PRIMARY KEY,
  total INTEGER NOT NULL,
  severity TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS moderator_action (
  sort_order INTEGER PRIMARY KEY,
  action_text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moderation_queue_item_status_programme
  ON moderation_queue_item (status, programme);
