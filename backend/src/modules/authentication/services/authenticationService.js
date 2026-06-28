const jwt = require('jsonwebtoken');
const authenticationRepository = require('../repositories/authenticationRepository');

const JWT_SECRET = 'SECRET';

async function findUserByEmail(email) {
  return authenticationRepository.findAuthUserByEmail(email);
}

async function login(email, password) {
  if (!email || !password) {
    return null;
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      defaultPortal: user.defaultPortal
    },
    JWT_SECRET
  );

  return {
    token,
    user
  };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  JWT_SECRET,
  login,
  verifyToken
};
