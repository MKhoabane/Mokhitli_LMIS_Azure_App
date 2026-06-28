const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getEmployerPortalData() {
  return withFallback(
    async () => {
      const [profileResult, placementsResult, complianceResult, actionsResult] = await Promise.all([
        pool.query(`
          SELECT
            organisation,
            active_placements AS "activePlacements",
            mentors
          FROM employer_profile
          LIMIT 1
        `),
        pool.query(`
          SELECT learner, site, mentor, status
          FROM employer_placement
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT requirement, completion
          FROM employer_compliance
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT action_text
          FROM employer_action
          ORDER BY sort_order
        `)
      ]);

      return {
        employer: profileResult.rows[0],
        placements: placementsResult.rows,
        compliance: complianceResult.rows,
        actions: actionsResult.rows.map((row) => row.action_text)
      };
    },
    () => enterpriseData.employerPortal
  );
}

module.exports = {
  getEmployerPortalData
};
