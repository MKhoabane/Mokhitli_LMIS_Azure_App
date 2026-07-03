const PASSWORD_RULES_MESSAGE =
  'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.';

function validatePasswordStrength(password) {
  const normalizedPassword = String(password || '');

  if (
    normalizedPassword.length < 8 ||
    !/[A-Z]/.test(normalizedPassword) ||
    !/[a-z]/.test(normalizedPassword) ||
    !/\d/.test(normalizedPassword) ||
    !/[^A-Za-z0-9]/.test(normalizedPassword)
  ) {
    return PASSWORD_RULES_MESSAGE;
  }

  return null;
}

module.exports = {
  PASSWORD_RULES_MESSAGE,
  validatePasswordStrength
};
