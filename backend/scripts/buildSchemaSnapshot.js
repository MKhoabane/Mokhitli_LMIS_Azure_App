const fs = require('fs');
const path = require('path');
const { migrationDirectories } = require('./sqlPlan');

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

function main() {
  const projectRoot = path.resolve(__dirname, '..', '..');
  const snapshotPath = path.join(projectRoot, 'db', 'schema.sql');
  const files = migrationDirectories.flatMap((directoryPath) => collectSqlFiles(directoryPath));

  const snapshot = files
    .map((filePath) => {
      const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
      const sql = fs.readFileSync(filePath, 'utf8').trim();

      if (!sql) {
        return '';
      }

      return `-- ${relativePath}\n${sql}`;
    })
    .filter(Boolean)
    .join('\n\n');

  fs.writeFileSync(snapshotPath, `${snapshot}\n`, 'utf8');
  console.log(`Schema snapshot written to ${snapshotPath}`);
}

main();
