const { Pool } = require('pg');

function getNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

module.exports = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'db',
  database: process.env.PGDATABASE || 'qcto_lmis',
  password: process.env.PGPASSWORD || 'password',
  port: getNumber(process.env.PGPORT, 5432)
});
