import React, { useState } from 'react';
import BrandLogo from '../components/BrandLogo';
import {
  PASSWORD_RULE_LABELS,
  getPasswordRuleStatus,
  validatePasswordStrength
} from '../components/passwordRules';
import StatusChip from '../components/StatusChip';
import type { AuthSession } from '../portals/shared/types';
import api from '../services/api';

interface LoginProps {
  onLogin: (session: AuthSession) => void;
}

interface CompanyUserDraft {
  name: string;
  email: string;
  role: string;
}

const SAMPLE_ACCOUNTS = [
  { role: 'Admin', email: 'admin@mokhitli.com', password: 'Admin@Mokhitli2026' },
  { role: 'Learner', email: 'learner@mokhitli.com', password: 'Learner@Mokhitli2026' },
  { role: 'Facilitator', email: 'facilitator@mokhitli.com', password: 'Facilitator@Mokhitli2026' },
  { role: 'Assessor', email: 'assessor@mokhitli.com', password: 'Assessor@Mokhitli2026' },
  { role: 'Moderator', email: 'moderator@mokhitli.com', password: 'Moderator@Mokhitli2026' },
  { role: 'Employer', email: 'employer@mokhitli.com', password: 'Employer@Mokhitli2026' },
  { role: 'Parent', email: 'parent@mokhitli.com', password: 'Parent@Mokhitli2026' }
];

const ROLE_OPTIONS = [
  { label: 'Learner', value: 'learner' },
  { label: 'Facilitator', value: 'facilitator' },
  { label: 'Assessor', value: 'assessor' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Employer', value: 'employer' },
  { label: 'Parent', value: 'parent' },
  { label: 'Admin', value: 'admin' }
];

function createCompanyUserDraft(): CompanyUserDraft {
  return {
    name: '',
    email: '',
    role: 'learner'
  };
}

function EyeIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12Z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.585 10.586A2 2 0 0013.414 13.414M9.88 5.092A10.958 10.958 0 0112 5c4.477 0 8.268 2.943 9.542 7a11.05 11.05 0 01-4.132 5.411M6.228 6.228A11.025 11.025 0 002.458 12C3.732 16.057 7.523 19 12 19c1.561 0 3.046-.358 4.37-.998"
      />
    </svg>
  );
}

interface PasswordToggleButtonProps {
  isVisible: boolean;
  showLabel: string;
  hideLabel: string;
  onToggle: () => void;
}

function PasswordToggleButton({ isVisible, showLabel, hideLabel, onToggle }: PasswordToggleButtonProps) {
  const label = isVisible ? hideLabel : showLabel;

  return (
    <div className="absolute inset-y-0 right-2 flex items-center">
      <div className="group relative">
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand-blue transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
          aria-label={label}
          aria-pressed={isVisible}
          title={label}
        >
          {isVisible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
        <span className="pointer-events-none absolute right-0 top-full z-10 mt-2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100">
          {label}
        </span>
      </div>
    </div>
  );
}

function PasswordRuleChecklist({ password }: { password: string }) {
  const ruleStatus = getPasswordRuleStatus(password);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Password Rules</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {PASSWORD_RULE_LABELS.map((rule) => {
          const isPassed = ruleStatus[rule.key];

          return (
            <div
              key={rule.key}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-slate-500'
              }`}
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                  isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
                aria-hidden="true"
              >
                {isPassed ? 'OK' : '-'}
              </span>
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getErrorMessage(requestError: unknown, fallbackMessage: string) {
  return typeof requestError === 'object' &&
    requestError !== null &&
    'response' in requestError &&
    typeof requestError.response === 'object' &&
    requestError.response !== null &&
    'data' in requestError.response &&
    typeof requestError.response.data === 'object' &&
    requestError.response.data !== null &&
    'error' in requestError.response.data &&
    typeof requestError.response.data.error === 'string'
    ? requestError.response.data.error
    : fallbackMessage;
}

export default function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'register-user' | 'register-company'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [registerRole, setRegisterRole] = useState('learner');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAdminName, setCompanyAdminName] = useState('');
  const [companyAdminEmail, setCompanyAdminEmail] = useState('');
  const [companyPassword, setCompanyPassword] = useState('');
  const [companyConfirmPassword, setCompanyConfirmPassword] = useState('');
  const [showCompanyPassword, setShowCompanyPassword] = useState(false);
  const [showCompanyConfirmPassword, setShowCompanyConfirmPassword] = useState(false);
  const [companyIndustry, setCompanyIndustry] = useState('Logistics');
  const [requestedUsers, setRequestedUsers] = useState('10');
  const [companyUsers, setCompanyUsers] = useState<CompanyUserDraft[]>([
    createCompanyUserDraft(),
    createCompanyUserDraft()
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post<AuthSession>('/auth/login', { email, password });
      onLogin(response.data);
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (registerPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordValidationError = validatePasswordStrength(registerPassword);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<AuthSession>('/auth/register', {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: registerRole
      });
      onLogin(response.data);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to register right now. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (companyPassword !== companyConfirmPassword) {
      setError('Company administrator passwords do not match.');
      return;
    }

    const passwordValidationError = validatePasswordStrength(companyPassword);
    if (passwordValidationError) {
      setError(passwordValidationError);
      return;
    }

    const normalizedCompanyUsers = companyUsers
      .map((user) => ({
        name: user.name.trim(),
        email: user.email.trim(),
        role: user.role
      }))
      .filter((user) => user.name || user.email);

    const hasIncompleteCompanyUser = normalizedCompanyUsers.some(
      (user) => !user.name || !user.email || !user.role
    );
    if (hasIncompleteCompanyUser) {
      setError('Each additional company user must have a name, email, and role.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<AuthSession>('/auth/register-company', {
        companyName,
        companyEmail,
        adminName: companyAdminName,
        adminEmail: companyAdminEmail,
        password: companyPassword,
        industry: companyIndustry,
        requestedUsers: Number(requestedUsers),
        invitedUsers: normalizedCompanyUsers
      });
      onLogin(response.data);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, 'Unable to register the company right now. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: 'login' | 'register-user' | 'register-company') => {
    setMode(nextMode);
    setError('');
    setShowLoginPassword(false);
    setShowRegisterPassword(false);
    setShowRegisterConfirmPassword(false);
    setShowCompanyPassword(false);
    setShowCompanyConfirmPassword(false);
  };

  const updateCompanyUser = (index: number, field: keyof CompanyUserDraft, value: string) => {
    setCompanyUsers((currentUsers) =>
      currentUsers.map((user, userIndex) =>
        userIndex === index
          ? {
              ...user,
              [field]: value
            }
          : user
      )
    );
  };

  const addCompanyUser = () => {
    setCompanyUsers((currentUsers) => [...currentUsers, createCompanyUserDraft()]);
  };

  const removeCompanyUser = (index: number) => {
    setCompanyUsers((currentUsers) =>
      currentUsers.length > 1 ? currentUsers.filter((_, userIndex) => userIndex !== index) : currentUsers
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <BrandLogo className="mx-auto w-full max-w-[430px]" />
        <p className="mt-4 text-center text-sm font-medium text-brand-blue uppercase tracking-widest">
          QCTO Learner Management System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          <div className="mb-6 rounded-2xl bg-slate-100 p-1">
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  mode === 'login' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register-user')}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  mode === 'register-user' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500'
                }`}
              >
                Register User
              </button>
              <button
                type="button"
                onClick={() => switchMode('register-company')}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${
                  mode === 'register-company' ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500'
                }`}
              >
                Register Company
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'login'
                ? 'Access your portal'
                : mode === 'register-user'
                  ? 'Register a new user'
                  : 'Register a company and its users'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'login'
                ? 'Sign in with an existing account to continue.'
                : mode === 'register-user'
                  ? 'Create a user account and sign in immediately.'
                  : 'Create the company profile, primary administrator, and planned user capacity in one step.'}
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={
              mode === 'login'
                ? handleLoginSubmit
                : mode === 'register-user'
                  ? handleRegisterUserSubmit
                  : handleRegisterCompanySubmit
            }
          >
            {mode === 'register-user' && (
              <div>
                <label htmlFor="register-name" className="block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="register-name"
                    name="register-name"
                    type="text"
                    autoComplete="name"
                    required
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
            )}

            {mode === 'register-company' && (
              <>
                <div>
                  <label htmlFor="company-name" className="block text-sm font-semibold text-slate-700">
                    Company Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="company-name"
                      name="company-name"
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                      placeholder="Enter company name"
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company-email" className="block text-sm font-semibold text-slate-700">
                      Company Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="company-email"
                        name="company-email"
                        type="email"
                        required
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company-industry" className="block text-sm font-semibold text-slate-700">
                      Industry
                    </label>
                    <div className="mt-1">
                      <input
                        id="company-industry"
                        name="company-industry"
                        type="text"
                        required
                        value={companyIndustry}
                        onChange={(e) => setCompanyIndustry(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                        placeholder="Logistics"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="company-admin-name" className="block text-sm font-semibold text-slate-700">
                      Primary Administrator
                    </label>
                    <div className="mt-1">
                      <input
                        id="company-admin-name"
                        name="company-admin-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={companyAdminName}
                        onChange={(e) => setCompanyAdminName(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                        placeholder="Administrator full name"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company-admin-email" className="block text-sm font-semibold text-slate-700">
                      Admin Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="company-admin-email"
                        name="company-admin-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={companyAdminEmail}
                        onChange={(e) => setCompanyAdminEmail(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                        placeholder="admin@company.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="requested-users" className="block text-sm font-semibold text-slate-700">
                      Planned Users
                    </label>
                    <div className="mt-1">
                      <input
                        id="requested-users"
                        name="requested-users"
                        type="number"
                        min="1"
                        required
                        value={requestedUsers}
                        onChange={(e) => setRequestedUsers(e.target.value)}
                        className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                        placeholder="10"
                      />
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                    Capture the company plus its expected user count here. Additional users can then be onboarded under the company account.
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
                        Company Users
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Add multiple named users now. Invitation emails are prepared for each listed user.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addCompanyUser}
                      className="rounded-xl bg-brand-blue px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
                    >
                      Add User
                    </button>
                  </div>

                  <div className="mt-5 space-y-4">
                    {companyUsers.map((user, index) => (
                      <div key={`company-user-${index}`} className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900">User {index + 1}</p>
                            <StatusChip
                              label="Invite On Submit"
                              toneClassName="bg-blue-100 text-brand-blue"
                            />
                          </div>
                          {companyUsers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCompanyUser(index)}
                              className="text-xs font-bold uppercase tracking-[0.2em] text-brand-maroon"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-3">
                          <input
                            type="text"
                            value={user.name}
                            onChange={(e) => updateCompanyUser(index, 'name', e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm"
                            placeholder="Full name"
                          />
                          <input
                            type="email"
                            value={user.email}
                            onChange={(e) => updateCompanyUser(index, 'email', e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm"
                            placeholder="user@company.com"
                          />
                          <select
                            value={user.role}
                            onChange={(e) => updateCompanyUser(index, 'role', e.target.value)}
                            className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm"
                          >
                            {ROLE_OPTIONS.filter((roleOption) => roleOption.value !== 'admin').map((roleOption) => (
                              <option key={roleOption.value} value={roleOption.value}>
                                {roleOption.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(mode === 'login' || mode === 'register-user') && (
              <div>
                <label htmlFor={mode === 'login' ? 'email' : 'register-email'} className="block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id={mode === 'login' ? 'email' : 'register-email'}
                    name={mode === 'login' ? 'email' : 'register-email'}
                    type="email"
                    autoComplete="email"
                    required
                    value={mode === 'login' ? email : registerEmail}
                    onChange={(e) => (mode === 'login' ? setEmail(e.target.value) : setRegisterEmail(e.target.value))}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>
            )}

            {mode === 'register-user' && (
              <div>
                <label htmlFor="register-role" className="block text-sm font-semibold text-slate-700">
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="register-role"
                    name="register-role"
                    value={registerRole}
                    onChange={(e) => setRegisterRole(e.target.value)}
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent sm:text-sm"
                  >
                    {ROLE_OPTIONS.map((roleOption) => (
                      <option key={roleOption.value} value={roleOption.value}>
                        {roleOption.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {(mode === 'register-user' || mode === 'register-company') && (
              <div>
                <label htmlFor={mode === 'login' ? 'password' : 'register-password'} className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="mt-1">
                  <div className="relative">
                    <input
                      id={mode === 'login' ? 'password' : 'register-password'}
                      name={mode === 'login' ? 'password' : 'register-password'}
                      type={
                        mode === 'login'
                          ? showLoginPassword
                            ? 'text'
                            : 'password'
                          : showRegisterPassword
                            ? 'text'
                            : 'password'
                      }
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      required
                      value={mode === 'login' ? password : registerPassword}
                      onChange={(e) => (mode === 'login' ? setPassword(e.target.value) : setRegisterPassword(e.target.value))}
                      className="appearance-none block w-full rounded-xl border border-slate-200 px-4 py-3 pr-14 shadow-sm placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm"
                      placeholder="••••••••"
                    />
                    {(mode === 'login' || mode === 'register-user') && (
                      <PasswordToggleButton
                        isVisible={mode === 'login' ? showLoginPassword : showRegisterPassword}
                        onToggle={() =>
                          mode === 'login'
                            ? setShowLoginPassword((currentValue) => !currentValue)
                            : setShowRegisterPassword((currentValue) => !currentValue)
                        }
                        showLabel={mode === 'login' ? 'Show password' : 'Show registration password'}
                        hideLabel={mode === 'login' ? 'Hide password' : 'Hide registration password'}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {mode === 'register-user' && <PasswordRuleChecklist password={registerPassword} />}

            {mode === 'register-user' && (
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <div className="relative">
                    <input
                      id="confirm-password"
                      name="confirm-password"
                      type={showRegisterConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full rounded-xl border border-slate-200 px-4 py-3 pr-14 shadow-sm placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm"
                      placeholder="Repeat your password"
                    />
                    <PasswordToggleButton
                      isVisible={showRegisterConfirmPassword}
                      onToggle={() => setShowRegisterConfirmPassword((currentValue) => !currentValue)}
                      showLabel="Show confirm password"
                      hideLabel="Hide confirm password"
                    />
                  </div>
                </div>
              </div>
            )}

            {mode === 'register-company' && (
              <>
                <div>
                  <label htmlFor="company-password" className="block text-sm font-semibold text-slate-700">
                    Admin Password
                  </label>
                  <div className="mt-1">
                    <div className="relative">
                      <input
                        id="company-password"
                        name="company-password"
                        type={showCompanyPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={companyPassword}
                        onChange={(e) => setCompanyPassword(e.target.value)}
                        className="appearance-none block w-full rounded-xl border border-slate-200 px-4 py-3 pr-14 shadow-sm placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm"
                        placeholder="••••••••"
                      />
                      <PasswordToggleButton
                        isVisible={showCompanyPassword}
                        onToggle={() => setShowCompanyPassword((currentValue) => !currentValue)}
                        showLabel="Show admin password"
                        hideLabel="Hide admin password"
                      />
                    </div>
                  </div>
                </div>

                <PasswordRuleChecklist password={companyPassword} />

                <div>
                  <label htmlFor="company-confirm-password" className="block text-sm font-semibold text-slate-700">
                    Confirm Admin Password
                  </label>
                  <div className="mt-1">
                    <div className="relative">
                      <input
                        id="company-confirm-password"
                        name="company-confirm-password"
                        type={showCompanyConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        value={companyConfirmPassword}
                        onChange={(e) => setCompanyConfirmPassword(e.target.value)}
                        className="appearance-none block w-full rounded-xl border border-slate-200 px-4 py-3 pr-14 shadow-sm placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm"
                        placeholder="Repeat the admin password"
                      />
                      <PasswordToggleButton
                        isVisible={showCompanyConfirmPassword}
                        onToggle={() => setShowCompanyConfirmPassword((currentValue) => !currentValue)}
                        showLabel="Show confirm admin password"
                        hideLabel="Hide confirm admin password"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border-l-4 border-brand-maroon p-4 rounded-r-xl">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-brand-maroon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-brand-maroon">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-brand-blue hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all ${loading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:-translate-y-0.5 active:scale-95'}`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {mode === 'login'
                      ? 'Authenticating...'
                      : mode === 'register-user'
                        ? 'Creating user...'
                        : 'Creating company...'}
                  </div>
                ) : mode === 'login' ? (
                  'Access Portal'
                ) : mode === 'register-user' ? (
                  'Register User'
                ) : (
                  'Register Company'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-3 bg-white text-slate-400">
                  {mode === 'login'
                    ? 'Security Warning'
                    : mode === 'register-user'
                      ? 'User Registration Guidance'
                      : 'Company Registration Guidance'}
                </span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400 leading-relaxed">
              {mode === 'login'
                ? 'This system is for authorized personnel of Mokhitli Enterprises only. All activities are monitored and logged.'
                : mode === 'register-user'
                  ? 'Register the user with the correct role so the system can route them to the matching portal after sign-in.'
                  : 'Company onboarding creates the primary employer account and captures how many users the company plans to manage.'}
            </p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                {mode === 'login'
                  ? 'Demo Accounts'
                  : mode === 'register-user'
                    ? 'Registration Notes'
                    : 'Company Notes'}
              </p>
              {mode === 'login' ? (
                <>
                  <div className="mt-3 space-y-2">
                    {SAMPLE_ACCOUNTS.map((account) => (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => {
                          setEmail(account.email);
                          setPassword(account.password);
                          setShowLoginPassword(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-100"
                      >
                        <span className="flex items-center gap-2">
                          <span>{account.role}</span>
                          <StatusChip
                            label="Active"
                            toneClassName="bg-emerald-100 text-emerald-700"
                          />
                        </span>
                        <span className="flex flex-col items-end">
                          <span>{account.email}</span>
                          <span className="mt-1 font-mono text-[11px] text-slate-400">{account.password}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-400">
                    Click a demo account to auto-fill both email and password.
                  </p>
                </>
              ) : mode === 'register-user' ? (
                <div className="mt-3 space-y-2 text-xs text-slate-500">
                  <p>New users are signed in immediately after registration.</p>
                  <p>The selected role determines the default landing portal.</p>
                  <p>Use a unique email address for each user account.</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2 text-xs text-slate-500">
                  <p>The primary administrator is signed in immediately after company registration.</p>
                  <p>The company is routed to the employer portal by default.</p>
                  <p>Listed company users are stored as invitation recipients with named email invites.</p>
                  <p>Planned users capture the expected team size for the company onboarding request.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
