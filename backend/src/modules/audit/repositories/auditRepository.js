const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function getModeratorPortalData() {
  return withFallback(
    async () => {
      const [profileResult, queueResult, findingsResult, actionsResult] = await Promise.all([
        pool.query(`
          SELECT
            name,
            moderation_batches AS "moderationBatches",
            compliance_score AS "complianceScore"
          FROM moderator_profile
          LIMIT 1
        `),
        pool.query(`
          SELECT
            batch,
            programme,
            sample_size AS "sampleSize",
            status
          FROM moderation_queue_item
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT
            category,
            total,
            severity
          FROM moderation_finding
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT action_text
          FROM moderator_action
          ORDER BY sort_order
        `)
      ]);

      return {
        moderator: profileResult.rows[0],
        moderationQueue: queueResult.rows,
        findings: findingsResult.rows,
        actions: actionsResult.rows.map((row) => row.action_text)
      };
    },
    () => enterpriseData.moderatorPortal
  );
}

module.exports = {
  getModeratorPortalData
};
