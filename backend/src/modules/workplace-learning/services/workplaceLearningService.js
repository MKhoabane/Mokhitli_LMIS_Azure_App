const workplaceLearningRepository = require('../repositories/workplaceLearningRepository');

async function getEmployerPortalData(user) {
  return workplaceLearningRepository.getEmployerPortalData(user);
}

async function getCompanyManagementData(userEmail) {
  return workplaceLearningRepository.getCompanyManagementData(userEmail);
}

async function inviteCompanyUsers(userEmail, invitedUsers) {
  return workplaceLearningRepository.inviteCompanyUsers(userEmail, invitedUsers);
}

async function resendCompanyInvitation(userEmail, invitationId) {
  return workplaceLearningRepository.resendCompanyInvitation(userEmail, invitationId);
}

async function cancelCompanyInvitation(userEmail, invitationId) {
  return workplaceLearningRepository.cancelCompanyInvitation(userEmail, invitationId);
}

module.exports = {
  getEmployerPortalData,
  getCompanyManagementData,
  inviteCompanyUsers,
  resendCompanyInvitation,
  cancelCompanyInvitation
};
