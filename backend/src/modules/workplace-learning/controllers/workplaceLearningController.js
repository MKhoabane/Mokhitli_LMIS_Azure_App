const service = require('../services/workplaceLearningService');
const authenticationService = require('../../authentication/services/authenticationService');
const authenticationRepository = require('../../authentication/repositories/authenticationRepository');

function getOptionalUser(req) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    return authenticationService.verifyToken(token);
  } catch {
    return null;
  }
}

async function getEmployerPortal(req, res) {
  res.json(await service.getEmployerPortalData(getOptionalUser(req)));
}

async function getCompanyManagement(req, res) {
  const isCompanyAdmin = await authenticationRepository.isCompanyAdmin(req.user.email);
  if (!isCompanyAdmin) {
    return res.status(403).json({ error: 'Only employer admins can manage company invitations' });
  }

  const data = await service.getCompanyManagementData(req.user.email);

  if (!data) {
    return res.status(404).json({ error: 'Company management data was not found' });
  }

  return res.json(data);
}

async function inviteCompanyUsers(req, res) {
  const isCompanyAdmin = await authenticationRepository.isCompanyAdmin(req.user.email);
  if (!isCompanyAdmin) {
    return res.status(403).json({ error: 'Only employer admins can manage company invitations' });
  }

  const invitedUsers = Array.isArray(req.body?.invitedUsers) ? req.body.invitedUsers : [];
  const normalizedInvitedUsers = invitedUsers
    .map((user) => ({
      name: String(user?.name || '').trim(),
      email: String(user?.email || '').trim().toLowerCase(),
      role: String(user?.role || '').trim().toLowerCase() || 'learner'
    }))
    .filter((user) => user.name && user.email && user.role);

  if (normalizedInvitedUsers.length === 0) {
    return res.status(400).json({ error: 'At least one company user is required for invitations' });
  }

  const result = await service.inviteCompanyUsers(req.user.email, normalizedInvitedUsers);
  if (!result) {
    return res.status(404).json({ error: 'Company management data was not found' });
  }

  return res.status(201).json(result);
}

async function resendCompanyInvitation(req, res) {
  const isCompanyAdmin = await authenticationRepository.isCompanyAdmin(req.user.email);
  if (!isCompanyAdmin) {
    return res.status(403).json({ error: 'Only employer admins can manage company invitations' });
  }

  const invitation = await service.resendCompanyInvitation(req.user.email, req.params.invitationId);
  if (!invitation) {
    return res.status(404).json({ error: 'Invitation was not found' });
  }

  return res.json({
    invitation
  });
}

async function cancelCompanyInvitation(req, res) {
  const isCompanyAdmin = await authenticationRepository.isCompanyAdmin(req.user.email);
  if (!isCompanyAdmin) {
    return res.status(403).json({ error: 'Only employer admins can manage company invitations' });
  }

  const invitation = await service.cancelCompanyInvitation(req.user.email, req.params.invitationId);
  if (!invitation) {
    return res.status(404).json({ error: 'Invitation was not found' });
  }

  return res.json({
    invitation
  });
}

module.exports = {
  getEmployerPortal,
  getCompanyManagement,
  inviteCompanyUsers,
  resendCompanyInvitation,
  cancelCompanyInvitation
};
