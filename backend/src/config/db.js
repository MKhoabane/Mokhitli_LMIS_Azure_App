const { Pool } = require('pg');

function getNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getSslConfig() {
  const sslMode = String(process.env.DB_SSL || '').trim().toLowerCase();

  if (!sslMode || sslMode === 'false' || sslMode === '0' || sslMode === 'off') {
    return undefined;
  }

  return {
    rejectUnauthorized: sslMode !== 'no-verify'
  };
}

const connectionString = process.env.DATABASE_URL;
const ssl = getSslConfig();

const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ...(ssl ? { ssl } : {})
      }
    : {
        user: process.env.PGUSER || 'postgres',
        host: process.env.PGHOST || 'db',
        database: process.env.PGDATABASE || 'qcto_lmis',
        password: process.env.PGPASSWORD || 'password',
        port: getNumber(process.env.PGPORT, 5432),
        ...(ssl ? { ssl } : {})
      }
);

module.exports = pool;
