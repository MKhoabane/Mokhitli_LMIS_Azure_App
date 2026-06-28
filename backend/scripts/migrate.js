const { runSqlFiles } = require('./runSqlFiles');
const { migrationDirectories } = require('./sqlPlan');

async function main() {
  await runSqlFiles({
    directoryPaths: migrationDirectories,
    historyTableName: 'schema_migrations',
    label: 'migration'
  });

  console.log('Database migrations completed.');
}

main().catch((error) => {
  console.error('Database migration failed.');
  console.error(error);
  process.exitCode = 1;
});
