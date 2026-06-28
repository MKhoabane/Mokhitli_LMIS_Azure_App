CREATE TABLE IF NOT EXISTS learner_record (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  course TEXT NOT NULL,
  attendance INTEGER NOT NULL,
  progress INTEGER NOT NULL,
  next_assessment TEXT NOT NULL,
  mentor TEXT NOT NULL,
  CONSTRAINT fk_learner_record_course
    FOREIGN KEY (course) REFERENCES programme_catalog(programme_name)
);

CREATE TABLE IF NOT EXISTS learner_portal_profile (
  learner_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  programme TEXT NOT NULL,
  nqf_level INTEGER NOT NULL,
  facilitator TEXT NOT NULL,
  CONSTRAINT fk_learner_portal_profile_programme
    FOREIGN KEY (programme) REFERENCES programme_catalog(programme_name)
);

CREATE TABLE IF NOT EXISTS learner_portal_progress (
  learner_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  completion INTEGER NOT NULL,
  PRIMARY KEY (learner_id, sort_order),
  CONSTRAINT fk_learner_portal_progress_profile
    FOREIGN KEY (learner_id) REFERENCES learner_portal_profile(learner_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learner_portal_assessment (
  learner_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  assessment_type TEXT NOT NULL,
  PRIMARY KEY (learner_id, sort_order),
  CONSTRAINT fk_learner_portal_assessment_profile
    FOREIGN KEY (learner_id) REFERENCES learner_portal_profile(learner_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS learner_portal_certificate (
  learner_id TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (learner_id, sort_order),
  CONSTRAINT fk_learner_portal_certificate_profile
    FOREIGN KEY (learner_id) REFERENCES learner_portal_profile(learner_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_learner_record_status_course
  ON learner_record (status, course);

CREATE INDEX IF NOT EXISTS idx_learner_portal_profile_programme
  ON learner_portal_profile (programme);
