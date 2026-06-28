const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getCrmPipeline() {
  return withFallback(
    async () => {
      const [metricsResult, opportunitiesResult] = await Promise.all([
        pool.query('SELECT metric_name, metric_value FROM crm_metric ORDER BY metric_name'),
        pool.query(`
          SELECT
            account_name AS account,
            stage,
            opportunity_value::float AS value
          FROM crm_opportunity
          ORDER BY account_name
        `)
      ]);

      const metrics = Object.fromEntries(
        metricsResult.rows.map((row) => [row.metric_name, Number(row.metric_value)])
      );

      return {
        leads: metrics.leads || 0,
        activeEmployers: metrics.activeEmployers || 0,
        conversionRate: metrics.conversionRate || 0,
        opportunities: opportunitiesResult.rows
      };
    },
    () => enterpriseData.crmPipeline
  );
}

module.exports = {
  getCrmPipeline
};
