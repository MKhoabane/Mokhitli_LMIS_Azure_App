const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getInvitationLink(invitationId) {
  return `/invite/${invitationId}`;
}

function getInvitationExpiryDate(days = 7) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

function getInvitationStatus(invitation) {
  if (invitation.status === 'cancelled' || invitation.status === 'accepted') {
    return invitation.status;
  }

  if (new Date(invitation.expiresAt).getTime() < Date.now()) {
    return 'expired';
  }

  return invitation.status || 'sent';
}

function buildInvitation({ name, email, role, companyId, companyName }) {
  const invitationId = createId('INV');

  return {
    id: invitationId,
    companyId,
    companyName,
    recipientName: name,
    recipientEmail: email,
    role,
    status: 'sent',
    sentAt: new Date().toISOString(),
    expiresAt: getInvitationExpiryDate(),
    acceptanceLink: getInvitationLink(invitationId),
    subject: `Invitation to join ${companyName}`,
    preview: `Hello ${name}, you have been invited to join ${companyName} as ${role}.`
  };
}

function buildCompanyUser({ name, email, role, status = 'Active' }) {
  return {
    id: createId('CMPUSR'),
    name,
    email,
    role,
    status
  };
}

async function findAuthUserByEmail(email) {
  return withFallback(
    async () => {
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const result = await pool.query(
        `
          SELECT id,
            name,
            email,
            role,
            default_portal AS "defaultPortal",
            password_hash AS "passwordHash"
          FROM auth_account
          WHERE LOWER(email) = LOWER($1)
        `,
        [normalizedEmail]
      );

      const dbUser = result.rows[0] || null;
      if (dbUser) {
        return dbUser;
      }

      return enterpriseData.authUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
    },
    () =>
      enterpriseData.authUsers.find(
        (user) => user.email.toLowerCase() === String(email || '').trim().toLowerCase()
      ) || null
  );
}

async function createAuthUser({ name, email, role, defaultPortal, passwordHash, companyId, companyName }) {
  return withFallback(
    async () => {
      const result = await pool.query(
        `
          INSERT INTO auth_account (name, email, role, default_portal, password_hash)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id,
            name,
            email,
            role,
            default_portal AS "defaultPortal",
            password_hash AS "passwordHash"
        `,
        [name, email, role, defaultPortal, passwordHash]
      );

      const createdUser = {
        ...result.rows[0],
        ...(companyId ? { companyId } : {}),
        ...(companyName ? { companyName } : {})
      };

      if (!enterpriseData.authUsers.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        enterpriseData.authUsers.push(createdUser);
      }

      if (!enterpriseData.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        enterpriseData.users.push({
          id: `USR-${String(createdUser.id).padStart(3, '0')}`,
          name,
          email,
          role,
          status: 'Active',
          ...(companyId ? { companyId } : {}),
          ...(companyName ? { companyName } : {})
        });
      }

      return createdUser;
    },
    () => {
      const existingIds = enterpriseData.authUsers.map((user) => Number(user.id) || 0);
      const nextId = existingIds.length ? Math.max(...existingIds) + 1 : 101;
      const createdUser = {
        id: nextId,
        name,
        email,
        role,
        defaultPortal,
        passwordHash,
        ...(companyId ? { companyId } : {}),
        ...(companyName ? { companyName } : {})
      };

      enterpriseData.authUsers.push(createdUser);
      enterpriseData.users.push({
        id: `USR-${String(nextId).padStart(3, '0')}`,
        name,
        email,
        role,
        status: 'Active',
        ...(companyId ? { companyId } : {}),
        ...(companyName ? { companyName } : {})
      });
      return createdUser;
    }
  );
}

async function findCompanyRegistration(companyName, companyEmail, adminEmail) {
  return withFallback(
    async () => {
      const result = await pool.query(
        `
          SELECT organisation
          FROM employer_profile
          WHERE LOWER(organisation) = LOWER($1)
          LIMIT 1
        `,
        [companyName]
      );

      return result.rows[0] || null;
    },
    () =>
      enterpriseData.companyRegistrations.find((company) => {
        const normalizedName = String(companyName || '').trim().toLowerCase();
        const normalizedCompanyEmail = String(companyEmail || '').trim().toLowerCase();
        const normalizedAdminEmail = String(adminEmail || '').trim().toLowerCase();

        return (
          company.name.toLowerCase() === normalizedName ||
          company.companyEmail.toLowerCase() === normalizedCompanyEmail ||
          company.adminEmail.toLowerCase() === normalizedAdminEmail
        );
      }) || null
  );
}

async function createCompanyRegistration({
  companyName,
  companyEmail,
  adminName,
  adminEmail,
  industry,
  requestedUsers,
  invitedUsers = []
}) {
  return withFallback(
    async () => {
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        await client.query(
          `
            INSERT INTO employer_profile (organisation, active_placements, mentors)
            VALUES ($1, 0, 0)
          `,
          [companyName]
        );

        const company = {
          id: createId('ORG'),
          name: companyName,
          companyEmail,
          adminName,
          adminEmail,
          industry,
          requestedUsers,
          status: 'Pending',
          users: [
            buildCompanyUser({
              name: adminName,
              email: adminEmail,
              role: 'employer'
            }),
            ...invitedUsers.map((user) =>
              buildCompanyUser({
                name: user.name,
                email: user.email,
                role: user.role,
                status: 'Invited'
              })
            )
          ],
          invitations: invitedUsers.map((user) =>
            buildInvitation({
              name: user.name,
              email: user.email,
              role: user.role,
              companyId: createId('TEMP'),
              companyName
            })
          )
        };

        company.invitations = company.invitations.map((invitation) => ({
          ...invitation,
          companyId: company.id
        }));

        enterpriseData.companyRegistrations.push(company);

        await client.query('COMMIT');
        return company;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
    () => {
      const nextId = enterpriseData.companyRegistrations.length + 1;
      const company = {
        id: `ORG-${String(nextId).padStart(3, '0')}`,
        name: companyName,
        companyEmail,
        adminName,
        adminEmail,
        industry,
        requestedUsers,
        status: 'Pending',
        users: [
          buildCompanyUser({
            name: adminName,
            email: adminEmail,
            role: 'employer'
          }),
          ...invitedUsers.map((user) =>
            buildCompanyUser({
              name: user.name,
              email: user.email,
              role: user.role,
              status: 'Invited'
            })
          )
        ],
        invitations: invitedUsers.map((user) =>
          buildInvitation({
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: `ORG-${String(nextId).padStart(3, '0')}`,
            companyName
          })
        )
      };

      enterpriseData.companyRegistrations.push(company);
      return company;
    }
  );
}

async function findCompanyRegistrationByUserEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  return (
    enterpriseData.companyRegistrations.find((company) => {
      return (
        company.adminEmail.toLowerCase() === normalizedEmail ||
        company.users?.some((user) => user.email.toLowerCase() === normalizedEmail)
      );
    }) || null
  );
}

async function isCompanyAdmin(userEmail) {
  const company = await findCompanyRegistrationByUserEmail(userEmail);
  if (!company) {
    return false;
  }

  return company.adminEmail.toLowerCase() === String(userEmail || '').trim().toLowerCase();
}

async function inviteCompanyUsers({ requesterEmail, invitedUsers }) {
  const company = enterpriseData.companyRegistrations.find(
    (item) => item.adminEmail.toLowerCase() === String(requesterEmail || '').trim().toLowerCase()
  );

  if (!company) {
    return null;
  }

  const createdInvitations = invitedUsers.map((user) =>
    buildInvitation({
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: company.id,
      companyName: company.name
    })
  );

  company.invitations = [...(company.invitations || []), ...createdInvitations];
  company.users = [
    ...(company.users || []),
    ...invitedUsers.map((user) =>
      buildCompanyUser({
        name: user.name,
        email: user.email,
        role: user.role,
        status: 'Invited'
      })
    )
  ];

  return {
    company,
    invitations: createdInvitations
  };
}

function getCompanyManagementByUserEmail(userEmail) {
  return enterpriseData.companyRegistrations.find((company) => {
    const normalizedEmail = String(userEmail || '').trim().toLowerCase();

    return (
      company.adminEmail.toLowerCase() === normalizedEmail ||
      company.users?.some((user) => user.email.toLowerCase() === normalizedEmail)
    );
  }) || null;
}

function getInvitationById(invitationId) {
  for (const company of enterpriseData.companyRegistrations) {
    const invitation = company.invitations?.find((item) => item.id === invitationId);
    if (invitation) {
      return { company, invitation };
    }
  }

  return null;
}

async function resendCompanyInvitation({ requesterEmail, invitationId }) {
  const company = getCompanyManagementByUserEmail(requesterEmail);
  if (!company) {
    return null;
  }

  const invitation = company.invitations?.find((item) => item.id === invitationId);
  if (!invitation) {
    return null;
  }

  invitation.status = 'sent';
  invitation.sentAt = new Date().toISOString();
  invitation.expiresAt = getInvitationExpiryDate();
  invitation.acceptanceLink = getInvitationLink(invitation.id);
  invitation.preview = `Hello ${invitation.recipientName}, you have been invited to join ${company.name} as ${invitation.role}.`;

  return invitation;
}

async function cancelCompanyInvitation({ requesterEmail, invitationId }) {
  const company = getCompanyManagementByUserEmail(requesterEmail);
  if (!company) {
    return null;
  }

  const invitation = company.invitations?.find((item) => item.id === invitationId);
  if (!invitation) {
    return null;
  }

  invitation.status = 'cancelled';

  company.users = (company.users || []).map((user) =>
    user.email.toLowerCase() === invitation.recipientEmail.toLowerCase() && user.status === 'Invited'
      ? {
          ...user,
          status: 'Cancelled'
        }
      : user
  );

  return invitation;
}

async function acceptInvitation({ invitationId, passwordHash }) {
  const matchedInvitation = getInvitationById(invitationId);
  if (!matchedInvitation) {
    return null;
  }

  const { company, invitation } = matchedInvitation;
  const effectiveStatus = getInvitationStatus(invitation);
  if (effectiveStatus === 'cancelled' || effectiveStatus === 'accepted' || effectiveStatus === 'expired') {
    return {
      error: effectiveStatus
    };
  }

  invitation.status = 'accepted';
  invitation.acceptedAt = new Date().toISOString();

  company.users = (company.users || []).map((user) =>
    user.email.toLowerCase() === invitation.recipientEmail.toLowerCase()
      ? {
          ...user,
          status: 'Active'
        }
      : user
  );

  const existingUser = await findAuthUserByEmail(invitation.recipientEmail);
  if (existingUser) {
    return {
      invitation,
      company,
      user: existingUser
    };
  }

  const createdUser = await createAuthUser({
    name: invitation.recipientName,
    email: invitation.recipientEmail,
    role: invitation.role,
    defaultPortal: invitation.role,
    passwordHash,
    companyId: company.id,
    companyName: company.name
  });

  return {
    invitation,
    company,
    user: createdUser
  };
}

module.exports = {
  findAuthUserByEmail,
  createAuthUser,
  findCompanyRegistration,
  createCompanyRegistration,
  findCompanyRegistrationByUserEmail,
  inviteCompanyUsers,
  getCompanyManagementByUserEmail,
  getInvitationById,
  resendCompanyInvitation,
  cancelCompanyInvitation,
  acceptInvitation,
  getInvitationStatus,
  isCompanyAdmin
};
