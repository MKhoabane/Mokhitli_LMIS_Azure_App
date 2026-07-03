const { pool, enterpriseData, withFallback } = require('../../shared/repositories/repositoryUtils');
const authenticationRepository = require('../../authentication/repositories/authenticationRepository');

function mapInvitation(invitation) {
  return {
    ...invitation,
    status: authenticationRepository.getInvitationStatus(invitation)
  };
}

async function getEmployerPortalData(user) {
  return withFallback(
    async () => {
      const [profileResult, placementsResult, complianceResult, actionsResult] = await Promise.all([
        pool.query(`
          SELECT
            organisation,
            active_placements AS "activePlacements",
            mentors
          FROM employer_profile
          LIMIT 1
        `),
        pool.query(`
          SELECT learner, site, mentor, status
          FROM employer_placement
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT requirement, completion
          FROM employer_compliance
          ORDER BY sort_order
        `),
        pool.query(`
          SELECT action_text
          FROM employer_action
          ORDER BY sort_order
        `)
      ]);

      return {
        employer: profileResult.rows[0],
        placements: placementsResult.rows,
        compliance: complianceResult.rows,
        actions: actionsResult.rows.map((row) => row.action_text)
      };
    },
    async () => {
      const company = user?.email
        ? await authenticationRepository.findCompanyRegistrationByUserEmail(user.email)
        : null;

      if (!company) {
        return enterpriseData.employerPortal;
      }

      return {
        employer: {
          organisation: company.name,
          activePlacements: 0,
          mentors: company.users?.filter((member) => member.role === 'facilitator').length || 0
        },
        placements: enterpriseData.employerPortal.placements,
        compliance: enterpriseData.employerPortal.compliance,
        actions: enterpriseData.employerPortal.actions
      };
    }
  );
}

async function getCompanyManagementData(userEmail) {
  return withFallback(
    async () => {
      const company = await authenticationRepository.findCompanyRegistrationByUserEmail(userEmail);
      if (!company) {
        return null;
      }

      const isCompanyAdmin = await authenticationRepository.isCompanyAdmin(userEmail);

      return {
        company: {
          id: company.id,
          name: company.name,
          companyEmail: company.companyEmail,
          industry: company.industry,
          requestedUsers: company.requestedUsers,
          status: company.status
        },
        isCompanyAdmin,
        users: company.users || [],
        invitations: (company.invitations || []).map(mapInvitation)
      };
    },
    async () => {
      const company = await authenticationRepository.findCompanyRegistrationByUserEmail(userEmail);
      if (!company) {
        return null;
      }

      const isCompanyAdmin = await authenticationRepository.isCompanyAdmin(userEmail);

      return {
        company: {
          id: company.id,
          name: company.name,
          companyEmail: company.companyEmail,
          industry: company.industry,
          requestedUsers: company.requestedUsers,
          status: company.status
        },
        isCompanyAdmin,
        users: company.users || [],
        invitations: (company.invitations || []).map(mapInvitation)
      };
    }
  );
}

async function inviteCompanyUsers(userEmail, invitedUsers) {
  return authenticationRepository.inviteCompanyUsers({
    requesterEmail: userEmail,
    invitedUsers
  });
}

async function resendCompanyInvitation(userEmail, invitationId) {
  return authenticationRepository.resendCompanyInvitation({
    requesterEmail: userEmail,
    invitationId
  });
}

async function cancelCompanyInvitation(userEmail, invitationId) {
  return authenticationRepository.cancelCompanyInvitation({
    requesterEmail: userEmail,
    invitationId
  });
}

module.exports = {
  getEmployerPortalData,
  getCompanyManagementData,
  inviteCompanyUsers,
  resendCompanyInvitation,
  cancelCompanyInvitation
};
