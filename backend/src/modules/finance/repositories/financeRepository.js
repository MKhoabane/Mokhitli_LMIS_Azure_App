const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getFinanceOverview() {
  return withFallback(
    async () => {
      const [metricsResult, transactionsResult] = await Promise.all([
        pool.query('SELECT metric_name, metric_value FROM finance_metric ORDER BY metric_name'),
        pool.query(`
          SELECT reference, customer, amount::float AS amount, status
          FROM finance_transaction
          ORDER BY reference
        `)
      ]);

      const metrics = Object.fromEntries(
        metricsResult.rows.map((row) => [row.metric_name, Number(row.metric_value)])
      );

      return {
        invoiced: metrics.invoiced || 0,
        collected: metrics.collected || 0,
        outstanding: metrics.outstanding || 0,
        bursaries: metrics.bursaries || 0,
        recentTransactions: transactionsResult.rows
      };
    },
    () => enterpriseData.financeOverview
  );
}

module.exports = {
  getFinanceOverview
};
