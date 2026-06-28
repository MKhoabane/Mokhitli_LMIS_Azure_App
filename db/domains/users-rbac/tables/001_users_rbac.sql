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
