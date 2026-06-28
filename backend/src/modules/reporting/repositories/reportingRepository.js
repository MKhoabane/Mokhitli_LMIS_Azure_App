const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getReportingSummary() {
  return withFallback(
    async () => {
      const [metricsResult, trendResult] = await Promise.all([
        pool.query('SELECT metric_name, metric_value FROM reporting_metric ORDER BY metric_name'),
        pool.query(`
          SELECT month_label AS month, learners, certificates
          FROM reporting_monthly_trend
          ORDER BY sort_order
        `)
      ]);

      const metrics = Object.fromEntries(
        metricsResult.rows.map((row) => [row.metric_name, Number(row.metric_value)])
      );

      return {
        completionRate: metrics.completionRate || 0,
        placementRate: metrics.placementRate || 0,
        certificationRate: metrics.certificationRate || 0,
        monthlyTrend: trendResult.rows
      };
    },
    () => enterpriseData.reportingSummary
  );
}

module.exports = {
  getReportingSummary
};
