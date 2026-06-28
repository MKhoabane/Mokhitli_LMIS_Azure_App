CREATE TABLE IF NOT EXISTS parent_portal_profile (
  learner_name TEXT PRIMARY KEY,
  programme TEXT NOT NULL,
  attendance INTEGER NOT NULL,
  progress INTEGER NOT NULL,
  CONSTRAINT fk_parent_portal_profile_programme
    FOREIGN KEY (programme) REFERENCES programme_catalog(programme_name)
);

CREATE TABLE IF NOT EXISTS parent_alert (
  sort_order INTEGER PRIMARY KEY,
  message TEXT NOT NULL,
  level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS parent_milestone (
  title TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_parent_alert_level
  ON parent_alert (level);
