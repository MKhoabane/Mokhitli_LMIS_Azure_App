const authenticationService = require('../modules/authentication/services/authenticationService');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const session = await authenticationService.login(email, password);

  if (!session) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json(session);
};

exports.me = (req, res) => {
  res.json({
    user: req.user
  });
};
