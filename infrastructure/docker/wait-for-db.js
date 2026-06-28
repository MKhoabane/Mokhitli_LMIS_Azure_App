const { Client } = require('pg');

const retries = Number(process.env.DB_WAIT_RETRIES || 30);
const delayMs = Number(process.env.DB_WAIT_DELAY_MS || 2000);

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function canConnect() {
  const client = new Client({
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'db',
    database: process.env.PGDATABASE || 'qcto_lmis',
    password: process.env.PGPASSWORD || 'password',
    port: Number(process.env.PGPORT || 5432)
  });

  try {
    await client.connect();
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

async function main() {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    if (await canConnect()) {
      console.log('PostgreSQL connection established.');
      return;
    }

    console.log(`PostgreSQL not ready yet (${attempt}/${retries}).`);
    await sleep(delayMs);
  }

  throw new Error('PostgreSQL did not become available before timeout.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
