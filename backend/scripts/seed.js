const { runSqlFiles } = require('./runSqlFiles');
const { seedDirectories } = require('./sqlPlan');

async function main() {
  await runSqlFiles({
    directoryPaths: seedDirectories,
    historyTableName: 'seed_history',
    label: 'seed'
  });

  console.log('Database seeds completed.');
}

main().catch((error) => {
  console.error('Database seeding failed.');
  console.error(error);
  process.exitCode = 1;
});
