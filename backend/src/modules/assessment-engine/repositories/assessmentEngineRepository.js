const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getAssessorPortalData() {
  return withFallback(
    async () => {
      const [profileResult, queueResult, outcomesResult, flagsResult] = await Promise.all([
        pool.query(`
          SELECT
            name,
            open_assessments AS "openAssessments",
            due_this_week AS "dueThisWeek"
          FROM assessor_profile
          LIMIT 1
        `),
        pool.query(`
          SELECT
            learner,
            assessment,
            due_date::text AS "dueDate",
            status
          FROM assessor_queue_item
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT
            programme,
            competent,
            re_assessments AS "reAssessments"
          FROM assessor_outcome
          ORDER BY programme
        `),
        pool.query(`
          SELECT flag_text
          FROM assessor_flag
          ORDER BY sort_order
        `)
      ]);

      return {
        assessor: profileResult.rows[0],
        queue: queueResult.rows,
        outcomes: outcomesResult.rows,
        flags: flagsResult.rows.map((row) => row.flag_text)
      };
    },
    () => enterpriseData.assessorPortal
  );
}

module.exports = {
  getAssessorPortalData
};
