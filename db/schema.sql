-- db/domains/users-rbac/tables/001_users_rbac.sql
CREATE TABLE IF NOT EXISTS role_definition (
  role_name TEXT PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portal_definition (
  portal_key TEXT PRIMARY KEY,
  description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  CONSTRAINT fk_app_user_role
    FOREIGN KEY (role) REFERENCES role_definition(role_name)
);

CREATE TABLE IF NOT EXISTS rbac_role_permission (
  role_name TEXT NOT NULL,
  user_count INTEGER NOT NULL,
  permission TEXT NOT NULL,
  PRIMARY KEY (role_name, permission),
  CONSTRAINT fk_rbac_role_permission_role_name
    FOREIGN KEY (role_name) REFERENCES role_definition(role_name) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_app_user_email_lower
  ON app_user (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_app_user_role_status
  ON app_user (role, status);

-- db/domains/authentication/tables/001_authentication.sql
CREATE TABLE IF NOT EXISTS auth_account (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  default_portal TEXT NOT NULL,
  CONSTRAINT fk_auth_account_role
    FOREIGN KEY (role) REFERENCES role_definition(role_name),
  CONSTRAINT fk_auth_account_default_portal
    FOREIGN KEY (default_portal) REFERENCES portal_definition(portal_key)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_auth_account_email_lower
  ON auth_account (LOWER(email));

-- db/domains/programmes/tables/001_programmes.sql
CREATE TABLE IF NOT EXISTS programme_catalog (
  programme_name TEXT PRIMARY KEY,
  programme_type TEXT NOT NULL
);

-- db/domains/qualifications/tables/001_qualifications.sql
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

-- db/domains/certificates/tables/001_certificates.sql
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

-- db/domains/learners/tables/001_learners.sql
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

-- db/domains/lms/tables/001_lms.sql
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

-- db/domains/assessments/tables/001_assessments.sql
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

-- db/domains/audit/tables/001_audit.sql
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

-- db/domains/workplace-learning/tables/001_workplace_learning.sql
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

-- db/domains/notifications/tables/001_notifications.sql
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

-- db/domains/reporting/tables/001_reporting.sql
CREATE TABLE IF NOT EXISTS reporting_metric (
  metric_name TEXT PRIMARY KEY,
  metric_value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reporting_monthly_trend (
  sort_order INTEGER PRIMARY KEY,
  month_label TEXT NOT NULL,
  learners INTEGER NOT NULL,
  certificates INTEGER NOT NULL
);

-- db/domains/finance/tables/001_finance.sql
CREATE TABLE IF NOT EXISTS finance_metric (
  metric_name TEXT PRIMARY KEY,
  metric_value NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS finance_transaction (
  reference TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_finance_transaction_status
  ON finance_transaction (status);

-- db/domains/crm/tables/001_crm.sql
CREATE TABLE IF NOT EXISTS crm_metric (
  metric_name TEXT PRIMARY KEY,
  metric_value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS crm_opportunity (
  account_name TEXT PRIMARY KEY,
  stage TEXT NOT NULL,
  opportunity_value NUMERIC NOT NULL,
  CONSTRAINT fk_crm_opportunity_account_name
    FOREIGN KEY (account_name) REFERENCES organization_catalog(organization_name)
);

CREATE INDEX IF NOT EXISTS idx_crm_opportunity_stage
  ON crm_opportunity (stage);

-- db/domains/ai/tables/001_ai.sql
CREATE TABLE IF NOT EXISTS ai_recommendation (
  sort_order INTEGER PRIMARY KEY,
  recommendation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_risk_indicator (
  label TEXT PRIMARY KEY,
  score INTEGER NOT NULL
);
