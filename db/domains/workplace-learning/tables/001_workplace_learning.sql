CREATE TABLE IF NOT EXISTS organization_catalog (
  organization_name TEXT PRIMARY KEY,
  organization_type TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employer_profile (
  organisation TEXT PRIMARY KEY,
  active_placements INTEGER NOT NULL,
  mentors INTEGER NOT NULL,
  CONSTRAINT fk_employer_profile_organisation
    FOREIGN KEY (organisation) REFERENCES organization_catalog(organization_name)
);

CREATE TABLE IF NOT EXISTS employer_placement (
  sort_order INTEGER PRIMARY KEY,
  learner TEXT NOT NULL,
  site TEXT NOT NULL,
  mentor TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS employer_compliance (
  requirement TEXT PRIMARY KEY,
  completion INTEGER NOT NULL,
  sort_order INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employer_action (
  sort_order INTEGER PRIMARY KEY,
  action_text TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_employer_placement_status_site
  ON employer_placement (status, site);
