const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getAiInsights() {
  return withFallback(
    async () => {
      const [recommendationsResult, riskIndicatorsResult] = await Promise.all([
        pool.query(`
          SELECT recommendation
          FROM ai_recommendation
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT label, score
          FROM ai_risk_indicator
          ORDER BY label
        `)
      ]);

      return {
        recommendations: recommendationsResult.rows.map((row) => row.recommendation),
        riskIndicators: riskIndicatorsResult.rows
      };
    },
    () => enterpriseData.aiInsights
  );
}

module.exports = {
  getAiInsights
};
