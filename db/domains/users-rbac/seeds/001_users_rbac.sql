INSERT INTO role_definition (role_name, description) VALUES
  ('admin', 'Platform administrators'),
  ('learner', 'Learner portal users'),
  ('facilitator', 'Facilitator portal users'),
  ('assessor', 'Assessor portal users'),
  ('moderator', 'Moderator portal users'),
  ('employer', 'Employer portal users'),
  ('parent', 'Parent portal users')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO portal_definition (portal_key, description) VALUES
  ('admin', 'Administrative operations portal'),
  ('learner', 'Learner self-service portal'),
  ('facilitator', 'Facilitator delivery portal'),
  ('assessor', 'Assessment operations portal'),
  ('moderator', 'Moderation oversight portal'),
  ('employer', 'Employer workplace portal'),
  ('parent', 'Parent progress portal')
ON CONFLICT (portal_key) DO NOTHING;

INSERT INTO app_user (id, name, email, role, status) VALUES
  ('USR-001', 'Amina Naidoo', 'admin@mokhitli.com', 'admin', 'Active'),
  ('USR-002', 'Nomsa Dlamini', 'facilitator@mokhitli.com', 'facilitator', 'Active'),
  ('USR-003', 'Kagiso Mthembu', 'assessor@mokhitli.com', 'assessor', 'Active'),
  ('USR-004', 'Zanele Sithole', 'moderator@mokhitli.com', 'moderator', 'Active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO rbac_role_permission (role_name, user_count, permission) VALUES
  ('admin', 5, 'manage_users'),
  ('admin', 5, 'view_finance'),
  ('admin', 5, 'configure_rbac'),
  ('admin', 5, 'view_reports'),
  ('facilitator', 12, 'view_lms'),
  ('facilitator', 12, 'manage_cohorts'),
  ('facilitator', 12, 'submit_evidence'),
  ('assessor', 7, 'review_assessments'),
  ('assessor', 7, 'capture_outcomes'),
  ('assessor', 7, 'request_moderation'),
  ('employer', 18, 'view_workplace_learning'),
  ('employer', 18, 'upload_feedback'),
  ('employer', 18, 'track_placements')
ON CONFLICT (role_name, permission) DO NOTHING;
