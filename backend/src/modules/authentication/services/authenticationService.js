const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticationRepository = require('../repositories/authenticationRepository');
const { validatePasswordStrength } = require('../validators/passwordRules');

const JWT_SECRET = process.env.JWT_SECRET || 'SECRET';
const appEnvironment = process.env.APP_ENV || process.env.NODE_ENV || 'development';

if (appEnvironment === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}
const ALLOWED_ROLES = new Set([
  'admin',
  'learner',
  'facilitator',
  'assessor',
  'moderator',
  'employer',
  'parent'
]);

const DEMO_PASSWORDS_BY_EMAIL = {
  'admin@mokhitli.com': 'Admin@Mokhitli2026',
  'learner@mokhitli.com': 'Learner@Mokhitli2026',
  'facilitator@mokhitli.com': 'Facilitator@Mokhitli2026',
  'assessor@mokhitli.com': 'Assessor@Mokhitli2026',
  'moderator@mokhitli.com': 'Moderator@Mokhitli2026',
  'employer@mokhitli.com': 'Employer@Mokhitli2026',
  'parent@mokhitli.com': 'Parent@Mokhitli2026'
};

async function findUserByEmail(email) {
  return authenticationRepository.findAuthUserByEmail(email);
}

function normalizeInvitedUsers(invitedUsers) {
  return Array.isArray(invitedUsers)
    ? invitedUsers
        .map((user) => ({
          name: String(user?.name || '').trim(),
          email: String(user?.email || '').trim().toLowerCase(),
          role: String(user?.role || '').trim().toLowerCase()
        }))
        .filter((user) => user.name && user.email && ALLOWED_ROLES.has(user.role))
    : [];
}

function hasIncompleteInvitedUsers(invitedUsers) {
  return Array.isArray(invitedUsers)
    ? invitedUsers.some((user) => {
        const normalizedName = String(user?.name || '').trim();
        const normalizedEmail = String(user?.email || '').trim().toLowerCase();
        const normalizedRole = String(user?.role || '').trim().toLowerCase();
        const hasAnyValue = normalizedName || normalizedEmail || normalizedRole;

        return Boolean(hasAnyValue && (!normalizedName || !normalizedEmail || !ALLOWED_ROLES.has(normalizedRole)));
      })
    : false;
}

function buildSession(user) {
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      defaultPortal: user.defaultPortal,
      ...(user.companyId ? { companyId: user.companyId } : {}),
      ...(user.companyName ? { companyName: user.companyName } : {})
    },
    JWT_SECRET
  );

  return {
    token,
    user
  };
}

function buildInvitationResponsePayload(matchedInvitation) {
  if (!matchedInvitation) {
    return null;
  }

  const { company, invitation } = matchedInvitation;

  return {
    invitation: {
      ...invitation,
      status: authenticationRepository.getInvitationStatus(invitation)
    },
    company: {
      id: company.id,
      name: company.name,
      companyEmail: company.companyEmail,
      industry: company.industry,
      requestedUsers: company.requestedUsers,
      status: company.status
    }
  };
}

async function login(email, password) {
  if (!email || !password) {
    return null;
  }

  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);
  if (!user) {
    return null;
  }

  const configuredPasswordHash = user.passwordHash;
  const demoPassword = DEMO_PASSWORDS_BY_EMAIL[normalizedEmail];
  if (!configuredPasswordHash && !demoPassword) {
    return null;
  }

  const passwordMatches = configuredPasswordHash
    ? await bcrypt.compare(String(password), String(configuredPasswordHash))
    : String(password) === String(demoPassword);

  if (!passwordMatches) {
    return null;
  }

  return buildSession(user);
}

async function register({ name, email, password, role }) {
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedRole = String(role || '').trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !password || !ALLOWED_ROLES.has(normalizedRole)) {
    return { error: 'invalid_registration' };
  }

  const passwordValidationError = validatePasswordStrength(password);
  if (passwordValidationError) {
    return {
      error: 'invalid_password_strength',
      message: passwordValidationError
    };
  }

  const existingUser = await findUserByEmail(normalizedEmail);
  if (existingUser) {
    return { error: 'email_exists' };
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await authenticationRepository.createAuthUser({
    name: normalizedName,
    email: normalizedEmail,
    role: normalizedRole,
    defaultPortal: normalizedRole,
    passwordHash
  });

  return buildSession(user);
}

async function registerCompany({
  companyName,
  companyEmail,
  adminName,
  adminEmail,
  password,
  industry,
  requestedUsers,
  invitedUsers
}) {
  const normalizedCompanyName = String(companyName || '').trim();
  const normalizedCompanyEmail = String(companyEmail || '').trim().toLowerCase();
  const normalizedAdminName = String(adminName || '').trim();
  const normalizedAdminEmail = String(adminEmail || '').trim().toLowerCase();
  const normalizedIndustry = String(industry || '').trim() || 'General';
  const normalizedRequestedUsers = Number(requestedUsers);

  if (hasIncompleteInvitedUsers(invitedUsers)) {
    return { error: 'invalid_invited_user' };
  }

  const normalizedInvitedUsers = normalizeInvitedUsers(invitedUsers);

  if (
    !normalizedCompanyName ||
    !normalizedCompanyEmail ||
    !normalizedAdminName ||
    !normalizedAdminEmail ||
    !password ||
    !Number.isFinite(normalizedRequestedUsers) ||
    normalizedRequestedUsers < 1
  ) {
    return { error: 'invalid_company_registration' };
  }

  const passwordValidationError = validatePasswordStrength(password);
  if (passwordValidationError) {
    return {
      error: 'invalid_password_strength',
      message: passwordValidationError
    };
  }

  const existingUser = await findUserByEmail(normalizedAdminEmail);
  if (existingUser) {
    return { error: 'email_exists' };
  }

  if (normalizedInvitedUsers.some((user) => user.email === normalizedAdminEmail)) {
    return { error: 'duplicate_invitation_email' };
  }

  const hasDuplicateInvitedEmails =
    new Set(normalizedInvitedUsers.map((user) => user.email)).size !== normalizedInvitedUsers.length;
  if (hasDuplicateInvitedEmails) {
    return { error: 'duplicate_invitation_email' };
  }

  for (const invitedUser of normalizedInvitedUsers) {
    const existingInvitedUser = await findUserByEmail(invitedUser.email);
    if (existingInvitedUser) {
      return { error: 'invited_user_exists' };
    }
  }

  const existingCompany = await authenticationRepository.findCompanyRegistration(
    normalizedCompanyName,
    normalizedCompanyEmail,
    normalizedAdminEmail
  );
  if (existingCompany) {
    return { error: 'company_exists' };
  }

  const company = await authenticationRepository.createCompanyRegistration({
    companyName: normalizedCompanyName,
    companyEmail: normalizedCompanyEmail,
    adminName: normalizedAdminName,
    adminEmail: normalizedAdminEmail,
    industry: normalizedIndustry,
    requestedUsers: normalizedRequestedUsers,
    invitedUsers: normalizedInvitedUsers
  });

  const passwordHash = await bcrypt.hash(String(password), 10);
  const user = await authenticationRepository.createAuthUser({
    name: normalizedAdminName,
    email: normalizedAdminEmail,
    role: 'employer',
    defaultPortal: 'employer',
    passwordHash,
    companyId: company.id,
    companyName: company.name
  });

  return {
    ...buildSession(user),
    company
  };
}

async function getInvitation(invitationId) {
  const matchedInvitation = authenticationRepository.getInvitationById(invitationId);
  return buildInvitationResponsePayload(matchedInvitation);
}

async function acceptInvitation({ invitationId, password }) {
  if (!String(password || '').trim()) {
    return { error: 'invalid_password' };
  }

  const passwordValidationError = validatePasswordStrength(password);
  if (passwordValidationError) {
    return {
      error: 'invalid_password_strength',
      message: passwordValidationError
    };
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const result = await authenticationRepository.acceptInvitation({ invitationId, passwordHash });
  if (!result) {
    return { error: 'not_found' };
  }

  if (result.error) {
    return { error: result.error };
  }

  return {
    ...buildSession(result.user),
    company: {
      id: result.company.id,
      name: result.company.name,
      companyEmail: result.company.companyEmail,
      industry: result.company.industry,
      requestedUsers: result.company.requestedUsers,
      status: result.company.status
    },
    invitation: {
      ...result.invitation,
      status: authenticationRepository.getInvitationStatus(result.invitation)
    }
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  JWT_SECRET,
  login,
  register,
  registerCompany,
  getInvitation,
  acceptInvitation,
  verifyToken
};
