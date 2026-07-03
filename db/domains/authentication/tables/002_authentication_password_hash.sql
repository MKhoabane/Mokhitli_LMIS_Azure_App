ALTER TABLE auth_account
  ADD COLUMN IF NOT EXISTS password_hash TEXT;
