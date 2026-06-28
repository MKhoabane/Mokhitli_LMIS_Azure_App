CREATE TABLE IF NOT EXISTS ai_recommendation (
  sort_order INTEGER PRIMARY KEY,
  recommendation TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_risk_indicator (
  label TEXT PRIMARY KEY,
  score INTEGER NOT NULL
);
