CREATE TABLE IF NOT EXISTS facilitator_profile (
  name TEXT PRIMARY KEY,
  active_cohorts INTEGER NOT NULL,
  assigned_learners INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS facilitator_cohort (
  name TEXT PRIMARY KEY,
  completion INTEGER NOT NULL,
  at_risk INTEGER NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS facilitator_session (
  sort_order INTEGER PRIMARY KEY,
  cohort TEXT NOT NULL,
  module TEXT NOT NULL,
  session_date DATE NOT NULL,
  attendance INTEGER NOT NULL,
  CONSTRAINT fk_facilitator_session_cohort
    FOREIGN KEY (cohort) REFERENCES facilitator_cohort(name)
);

CREATE TABLE IF NOT EXISTS facilitator_action (
  sort_order INTEGER PRIMARY KEY,
  action_text TEXT NOT NULL
);
