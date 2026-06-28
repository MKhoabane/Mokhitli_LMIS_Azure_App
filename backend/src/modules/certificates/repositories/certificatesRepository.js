const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function listIssuedCertificates() {
  return withFallback(
    async () => {
      const result = await pool.query(`
        SELECT
          certificate_no AS "certificateNo",
          learner_name AS learner,
          qualification_name AS qualification,
          issued_date::text AS "issuedDate",
          status
        FROM issued_certificate_record
        ORDER BY certificate_no
      `);

      return result.rows;
    },
    () => enterpriseData.issuedCertificates
  );
}

module.exports = {
  listIssuedCertificates
};
