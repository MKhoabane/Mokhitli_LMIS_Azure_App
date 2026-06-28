const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getParentPortalData() {
  return withFallback(
    async () => {
      const [profileResult, alertsResult, milestonesResult] = await Promise.all([
        pool.query(`
          SELECT
            learner_name AS name,
            programme,
            attendance,
            progress
          FROM parent_portal_profile
          LIMIT 1
        `),
        pool.query(`
          SELECT message, level
          FROM parent_alert
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT title, status
          FROM parent_milestone
          ORDER BY sort_order
        `)
      ]);

      return {
        learner: profileResult.rows[0],
        alerts: alertsResult.rows,
        milestones: milestonesResult.rows
      };
    },
    () => enterpriseData.parentPortal
  );
}

module.exports = {
  getParentPortalData
};
