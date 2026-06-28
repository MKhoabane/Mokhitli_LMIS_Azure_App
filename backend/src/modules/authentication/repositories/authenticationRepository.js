const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

async function findAuthUserByEmail(email) {
  return withFallback(
    async () => {
      const result = await pool.query(
        `
          SELECT id, name, email, role, default_portal AS "defaultPortal"
          FROM auth_account
          WHERE LOWER(email) = LOWER($1)
        `,
        [email]
      );

      return result.rows[0] || null;
    },
    () =>
      enterpriseData.authUsers.find(
        (user) => user.email.toLowerCase() === String(email || '').trim().toLowerCase()
      ) || null
  );
}

module.exports = {
  findAuthUserByEmail
};
