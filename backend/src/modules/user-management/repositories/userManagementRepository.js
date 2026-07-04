const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

function mergeActiveDemoUsers(users) {
  const existingEmails = new Set(
    (Array.isArray(users) ? users : []).map((user) => String(user.email || '').trim().toLowerCase())
  );
  const mergedUsers = Array.isArray(users) ? [...users] : [];

  enterpriseData.users.forEach((demoUser) => {
    const normalizedEmail = String(demoUser.email || '').trim().toLowerCase();

    if (!existingEmails.has(normalizedEmail)) {
      mergedUsers.push(demoUser);
    }
  });

  return mergedUsers.sort((left, right) => String(left.id).localeCompare(String(right.id)));
}

async function listUsers() {
  return withFallback(
    async () => {
      const result = await pool.query(`
        SELECT id, name, email, role, status
        FROM app_user
        ORDER BY id
      `);

      return mergeActiveDemoUsers(result.rows);
    },
    () => mergeActiveDemoUsers(enterpriseData.users)
  );
}

module.exports = {
  listUsers
};
