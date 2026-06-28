const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function listQualifications() {
  return withFallback(
    async () => {
      const result = await pool.query(`
        SELECT
          code,
          title,
          nqf_level AS "nqfLevel",
          credits,
          status
        FROM qualification_record
        ORDER BY code
      `);

      return result.rows;
    },
    () => enterpriseData.qualifications
  );
}

module.exports = {
  listQualifications
};
