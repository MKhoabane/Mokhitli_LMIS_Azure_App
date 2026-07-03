export const PASSWORD_RULES_MESSAGE =
  'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.';

export const PASSWORD_RULE_LABELS = [
  { key: 'minLength', label: 'At least 8 characters' },
  { key: 'uppercase', label: 'One uppercase letter' },
  { key: 'lowercase', label: 'One lowercase letter' },
  { key: 'number', label: 'One number' },
  { key: 'specialCharacter', label: 'One special character' }
] as const;

export function getPasswordRuleStatus(password: string) {
  return {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    specialCharacter: /[^A-Za-z0-9]/.test(password)
  };
}

export function validatePasswordStrength(password: string): string | null {
  const ruleStatus = getPasswordRuleStatus(password);

  if (Object.values(ruleStatus).some((value) => !value)) {
    return PASSWORD_RULES_MESSAGE;
  }

  return null;
}
