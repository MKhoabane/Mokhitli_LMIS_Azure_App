const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');
const { migrationDirectories } = require('./sqlPlan');

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

async function main() {
  const expectedMigrations = migrationDirectories
    .flatMap((directoryPath) => collectSqlFiles(directoryPath))
    .map((filePath) => path.relative(projectRoot, filePath).replace(/\\/g, '/'));

  const result = await pool.query('SELECT name FROM schema_migrations');
  const appliedMigrations = new Set(result.rows.map((row) => row.name));
  const missingMigrations = expectedMigrations.filter((name) => !appliedMigrations.has(name));

  if (missingMigrations.length > 0) {
    console.error('Production migration gate failed. Apply these migrations before deploying:');
    missingMigrations.forEach((name) => console.error(`- ${name}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Migration gate passed. ${expectedMigrations.length} migration files are applied.`);
}

main()
  .catch((error) => {
    console.error('Migration gate failed.');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end().catch(() => {});
  });
