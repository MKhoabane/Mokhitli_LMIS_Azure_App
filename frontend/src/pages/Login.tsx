import React, { useState } from 'react';
import type { AuthSession } from '../portals/shared/types';
import api from '../services/api';

interface LoginProps {
  onLogin: (session: AuthSession) => void;
}

const SAMPLE_ACCOUNTS = [
  { role: 'Admin', email: 'admin@mokhitli.com' },
  { role: 'Learner', email: 'learner@mokhitli.com' },
  { role: 'Facilitator', email: 'facilitator@mokhitli.com' },
  { role: 'Assessor', email: 'assessor@mokhitli.com' },
  { role: 'Moderator', email: 'moderator@mokhitli.com' },
  { role: 'Employer', email: 'employer@mokhitli.com' },
  { role: 'Parent', email: 'parent@mokhitli.com' }
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2">
          <div className="flex flex-col items-center">
            <div className="flex items-end mb-2">
              <span className="text-6xl font-bold text-brand-maroon leading-none">m</span>
              <div className="h-10 w-24 bg-brand-gray rounded-full -ml-4 -mb-1 opacity-80 flex items-center justify-center transform -rotate-12">
                <div className="h-8 w-20 bg-brand-blue rounded-full opacity-60"></div>
              </div>
              <span className="text-6xl font-bold text-brand-orange leading-none -ml-4">E</span>
            </div>
            <h2 className="text-3xl font-light tracking-tight text-slate-800">
              Mokhitli <span className="font-bold">Enterprises</span>
            </h2>
          </div>
        </div>
        <p className="mt-4 text-center text-sm font-medium text-brand-blue uppercase tracking-widest">
          QCTO Learner Management System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

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
                    Authenticating...
                  </div>
                ) : 'Access Portal'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                <span className="px-3 bg-white text-slate-400">Security Warning</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-slate-400 leading-relaxed">
              This system is for authorized personnel of Mokhitli Enterprises only.
              All activities are monitored and logged.
            </p>
            <div className="mt-6 rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Demo Accounts
              </p>
              <div className="mt-3 space-y-2">
                {SAMPLE_ACCOUNTS.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => setEmail(account.email)}
                    className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 shadow-sm transition hover:bg-slate-100"
                  >
                    <span>{account.role}</span>
                    <span>{account.email}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Use any non-empty password to access the role-specific default portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
