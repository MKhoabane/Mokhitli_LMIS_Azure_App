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
