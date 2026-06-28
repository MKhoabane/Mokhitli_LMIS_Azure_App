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
