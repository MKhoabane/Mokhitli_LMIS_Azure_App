const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getFacilitatorPortalData() {
  return withFallback(
    async () => {
      const [profileResult, sessionsResult, cohortsResult, actionsResult] = await Promise.all([
        pool.query(`
          SELECT
            name,
            active_cohorts AS "activeCohorts",
            assigned_learners AS "assignedLearners"
          FROM facilitator_profile
          LIMIT 1
        `),
        pool.query(`
          SELECT
            cohort,
            module,
            session_date::text AS date,
            attendance
          FROM facilitator_session
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT
            name,
            completion,
            at_risk AS "atRisk"
          FROM facilitator_cohort
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT action_text
          FROM facilitator_action
          ORDER BY sort_order
        `)
      ]);

      return {
        facilitator: profileResult.rows[0],
        sessions: sessionsResult.rows,
        cohorts: cohortsResult.rows,
        actions: actionsResult.rows.map((row) => row.action_text)
      };
    },
    () => enterpriseData.facilitatorPortal
  );
}

module.exports = {
  getFacilitatorPortalData
};
