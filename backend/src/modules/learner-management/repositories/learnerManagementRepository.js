const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function listLearners() {
  return withFallback(
    async () => {
      const result = await pool.query(`
        SELECT
          id,
          name,
          email,
          status,
          course,
          attendance,
          progress,
          next_assessment AS "nextAssessment",
          mentor
        FROM learner_record
        ORDER BY id
      `);

      return result.rows;
    },
    () => enterpriseData.learners
  );
}

async function getLearnerPortalData() {
  return withFallback(
    async () => {
      const profileResult = await pool.query(`
        SELECT
          learner_id AS id,
          name,
          programme,
          nqf_level AS "nqfLevel",
          facilitator
        FROM learner_portal_profile
        LIMIT 1
      `);

      const learner = profileResult.rows[0];
      if (!learner) {
        return enterpriseData.learnerPortal;
      }

      const [progressResult, assessmentsResult, certificatesResult] = await Promise.all([
        pool.query(
          `
            SELECT title, completion
            FROM learner_portal_progress
            WHERE learner_id = $1
            ORDER BY sort_order
          `,
          [learner.id]
        ),
        pool.query(
          `
            SELECT
              title,
              due_date::text AS "dueDate",
              assessment_type AS type
            FROM learner_portal_assessment
            WHERE learner_id = $1
            ORDER BY sort_order
          `,
          [learner.id]
        ),
        pool.query(
          `
            SELECT title, status
            FROM learner_portal_certificate
            WHERE learner_id = $1
            ORDER BY sort_order
          `,
          [learner.id]
        )
      ]);

      return {
        learner,
        progress: progressResult.rows,
        upcomingAssessments: assessmentsResult.rows,
        certificates: certificatesResult.rows
      };
    },
    () => enterpriseData.learnerPortal
  );
}

module.exports = {
  listLearners,
  getLearnerPortalData
};
