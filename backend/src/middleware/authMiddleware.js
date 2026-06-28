const authenticationService = require('../modules/authentication/services/authenticationService');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token' });
  }

  try {
    req.user = authenticationService.verifyToken(token);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
