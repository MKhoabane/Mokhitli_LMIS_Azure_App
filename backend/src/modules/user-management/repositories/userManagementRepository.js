const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function listUsers() {
  return withFallback(
    async () => {
      const result = await pool.query(`
        SELECT id, name, email, role, status
        FROM app_user
        ORDER BY id
      `);

      return result.rows;
    },
    () => enterpriseData.users
  );
}

module.exports = {
  listUsers
};
