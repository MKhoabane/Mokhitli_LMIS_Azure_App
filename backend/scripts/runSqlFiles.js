const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

const projectRoot = path.resolve(__dirname, '..', '..');

function collectSqlFiles(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs
    .readdirSync(directoryPath, { withFileTypes: true })
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return collectSqlFiles(entryPath);
      }

      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.sql')) {
        return [];
      }

      return [entryPath];
    });
}

async function ensureHistoryTable(client, historyTableName) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS ${historyTableName} (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function runSqlFiles({ directoryPaths, historyTableName, label }) {
  const client = await pool.connect();

  try {
    await ensureHistoryTable(client, historyTableName);

    const files = directoryPaths.flatMap((directoryPath) => collectSqlFiles(directoryPath));
    if (files.length === 0) {
      console.log(`No ${label} files found.`);
      return;
    }

    for (const filePath of files) {
      const fileName = path.relative(projectRoot, filePath).replace(/\\/g, '/');
      const historyResult = await client.query(
        `SELECT 1 FROM ${historyTableName} WHERE name = $1`,
        [fileName]
      );

      if (historyResult.rowCount > 0) {
        console.log(`Skipping ${label} ${fileName}`);
        continue;
      }

      const sql = fs.readFileSync(filePath, 'utf8').trim();

      if (!sql) {
        console.log(`Skipping empty ${label} ${fileName}`);
        continue;
      }

      console.log(`Applying ${label} ${fileName}`);
      await client.query('BEGIN');
      await client.query(sql);
      await client.query(`INSERT INTO ${historyTableName} (name) VALUES ($1)`, [fileName]);
      await client.query('COMMIT');
    }
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

module.exports = {
  runSqlFiles
};
