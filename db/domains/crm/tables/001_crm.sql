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
