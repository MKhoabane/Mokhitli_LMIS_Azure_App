const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function listRoles() {
  return withFallback(
    async () => {
      const result = await pool.query(`
        SELECT
          role_name AS name,
          MAX(user_count)::int AS users,
          ARRAY_AGG(permission ORDER BY permission) AS permissions
        FROM rbac_role_permission
        GROUP BY role_name
        ORDER BY role_name
      `);

      return result.rows;
    },
    () => enterpriseData.roles
  );
}

module.exports = {
  listRoles
};
