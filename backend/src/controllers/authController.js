const authenticationService = require('../modules/authentication/services/authenticationService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const session = await authenticationService.login(email, password);

  if (!session) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json(session);
};

exports.register = async (req, res) => {
  const session = await authenticationService.register(req.body);

  if (session?.error === 'email_exists') {
    return res.status(409).json({ error: 'An account with that email already exists' });
  }

  if (session?.error === 'invalid_password_strength') {
    return res.status(400).json({ error: session.message });
  }

  if (session?.error) {
    return res.status(400).json({ error: 'Invalid registration details' });
  }

  return res.status(201).json(session);
};

exports.registerCompany = async (req, res) => {
  const session = await authenticationService.registerCompany(req.body);

  if (session?.error === 'email_exists') {
    return res.status(409).json({ error: 'An account with that admin email already exists' });
  }

  if (session?.error === 'company_exists') {
    return res.status(409).json({ error: 'That company is already registered' });
  }

  if (session?.error === 'duplicate_invitation_email') {
    return res.status(409).json({ error: 'Company user invitation emails must be unique' });
  }

  if (session?.error === 'invited_user_exists') {
    return res.status(409).json({ error: 'One or more invited users already exist in the system' });
  }

  if (session?.error === 'invalid_password_strength') {
    return res.status(400).json({ error: session.message });
  }

  if (session?.error) {
    return res.status(400).json({ error: 'Invalid company registration details' });
  }

  return res.status(201).json(session);
};

exports.getInvitation = async (req, res) => {
  const data = await authenticationService.getInvitation(req.params.invitationId);

  if (!data) {
    return res.status(404).json({ error: 'Invitation was not found' });
  }

  return res.json(data);
};

exports.acceptInvitation = async (req, res) => {
  const session = await authenticationService.acceptInvitation({
    invitationId: req.params.invitationId,
    password: req.body?.password
  });

  if (session?.error === 'not_found') {
    return res.status(404).json({ error: 'Invitation was not found' });
  }

  if (session?.error === 'invalid_password') {
    return res.status(400).json({ error: 'A password is required to accept the invitation' });
  }

  if (session?.error === 'invalid_password_strength') {
    return res.status(400).json({ error: session.message });
  }

  if (session?.error === 'expired') {
    return res.status(410).json({ error: 'This invitation has expired' });
  }

  if (session?.error === 'cancelled') {
    return res.status(410).json({ error: 'This invitation has been cancelled' });
  }

  if (session?.error === 'accepted') {
    return res.status(409).json({ error: 'This invitation has already been accepted' });
  }

  return res.status(200).json(session);
};

exports.me = (req, res) => {
  res.json({
    user: req.user
  });
};
