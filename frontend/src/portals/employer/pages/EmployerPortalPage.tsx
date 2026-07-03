import { useCallback, useEffect, useState } from 'react';
import StatusChip from '../../../components/StatusChip';
import {
  getEffectiveInvitationStatus,
  getInvitationCountdownChip,
  getInvitationStatusChip
} from '../../../components/invitationStatus';
import api from '../../../services/api';
import type {
  CompanyInvitation,
  CompanyManagementData,
  EmployerPortalData,
  PortalRenderProps
} from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

const COMPANY_ROLE_OPTIONS = [
  { label: 'Learner', value: 'learner' },
  { label: 'Facilitator', value: 'facilitator' },
  { label: 'Assessor', value: 'assessor' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'Employer', value: 'employer' },
  { label: 'Parent', value: 'parent' }
];

function getManagementRoute() {
  return '/employer/company-management';
}

function isManagementRoute() {
  return window.location.pathname === getManagementRoute();
}

export default function EmployerPortalPage({}: PortalRenderProps) {
  const { data, loading, error } = usePortalData<EmployerPortalData>('/workplace-learning/portal/employer');
  const [managementData, setManagementData] = useState<CompanyManagementData | null>(null);
  const [managementLoading, setManagementLoading] = useState(true);
  const [managementError, setManagementError] = useState('');
  const [activeView, setActiveView] = useState<'overview' | 'management'>(() =>
    isManagementRoute() ? 'management' : 'overview'
  );
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('learner');
  const [inviteSubmitting, setInviteSubmitting] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState('');
  const [invitationActionMessage, setInvitationActionMessage] = useState('');
  const [now, setNow] = useState(() => Date.now());

  const loadManagementData = useCallback((silent = false) => {
    if (!silent) {
      setManagementLoading(true);
    }

    api
      .get<CompanyManagementData>('/workplace-learning/company-management')
      .then((response) => {
        setManagementData(response.data);
        setManagementError('');
      })
      .catch((requestError: unknown) => {
        const status =
          typeof requestError === 'object' &&
          requestError !== null &&
          'response' in requestError &&
          typeof requestError.response === 'object' &&
          requestError.response !== null &&
          'status' in requestError.response &&
          typeof requestError.response.status === 'number'
            ? requestError.response.status
            : 0;

        setManagementError(
          status === 403
            ? 'Only employer admins can manage company invitations.'
            : 'Unable to load company management right now.'
        );
      })
      .finally(() => {
        if (!silent) {
          setManagementLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    loadManagementData();
  }, [loadManagementData]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
      loadManagementData(true);
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [loadManagementData]);

  useEffect(() => {
    const handlePopState = () => {
      setActiveView(isManagementRoute() ? 'management' : 'overview');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigateToView = (nextView: 'overview' | 'management') => {
    const nextPath = nextView === 'management' ? getManagementRoute() : '/employer';
    window.history.pushState({}, '', nextPath);
    setActiveView(nextView);
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSubmitting(true);
    setInviteFeedback('');
    setInvitationActionMessage('');

    try {
      await api.post('/workplace-learning/company-management/users/invite', {
        invitedUsers: [
          {
            name: inviteName,
            email: inviteEmail,
            role: inviteRole
          }
        ]
      });

      setInviteName('');
      setInviteEmail('');
      setInviteRole('learner');
      setInviteFeedback('Invitation email queued successfully.');
      loadManagementData();
    } catch {
      setInviteFeedback('Unable to send the invitation right now.');
    } finally {
      setInviteSubmitting(false);
    }
  };

  const handleInvitationAction = async (invitationId: string, action: 'resend' | 'cancel') => {
    setInvitationActionMessage('');

    try {
      await api.post(`/workplace-learning/company-management/invitations/${invitationId}/${action}`);
      setInvitationActionMessage(
        action === 'resend'
          ? 'Invitation resent and expiry refreshed.'
          : 'Invitation cancelled successfully.'
      );
      loadManagementData();
    } catch {
      setInvitationActionMessage(`Unable to ${action} this invitation right now.`);
    }
  };

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading employer workspace...</div>;
  }

  if (!data) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigateToView('overview')}
            className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
              activeView === 'overview'
                ? 'bg-brand-blue text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Employer Overview
          </button>
          <button
            type="button"
            onClick={() => navigateToView('management')}
            className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
              activeView === 'management'
                ? 'bg-brand-blue text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Company Management
          </button>
        </div>
      </section>

      {activeView === 'overview' ? (
        <>
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Employer Profile
            </p>
            <h3 className="mt-4 text-3xl font-black text-slate-900">{data.employer.organisation}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {data.employer.activePlacements} placements | {data.employer.mentors} mentors
            </p>
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Placement Tracker
              </p>
              <div className="mt-4 space-y-3">
                {data.placements.map((placement) => (
                  <div
                    key={placement.learner + placement.site}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <p className="font-bold text-slate-900">{placement.learner}</p>
                    <p className="text-sm text-slate-500">
                      {placement.site} | Mentor {placement.mentor} | {placement.status}
                    </p>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Compliance</p>
              <div className="mt-4 space-y-3">
                {data.compliance.map((item) => (
                  <div key={item.requirement} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-bold text-slate-900">{item.requirement}</p>
                    <p className="text-sm text-slate-500">Completion {item.completion}%</p>
                  </div>
                ))}
              </div>
            </article>
          </section>
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Employer Actions
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {data.actions.map((action) => (
                <div key={action} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                  {action}
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Company Management Route
            </p>
            {managementLoading ? (
              <p className="mt-4 text-sm text-slate-500">Loading company management workspace...</p>
            ) : managementError || !managementData ? (
              <p className="mt-4 text-sm text-brand-maroon">{managementError}</p>
            ) : (
              <>
                <h3 className="mt-4 text-3xl font-black text-slate-900">
                  {managementData.company.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {managementData.company.industry} | {managementData.company.companyEmail} | Planned users {managementData.company.requestedUsers}
                </p>
                <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-brand-blue">
                  {managementData.company.status}
                </p>
              </>
            )}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Team Members
              </p>
              <div className="mt-4 space-y-3">
                {managementData?.users.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-slate-200 p-4">
                    <p className="font-bold text-slate-900">{user.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {user.email} | {user.role}
                    </p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
                      {user.status}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Invite Company Users
              </p>
              <form className="mt-4 space-y-4" onSubmit={handleInviteUser}>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  required
                  className="block w-full rounded-2xl border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  placeholder="Full name"
                />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  className="block w-full rounded-2xl border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                  placeholder="user@company.com"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  {COMPANY_ROLE_OPTIONS.map((roleOption) => (
                    <option key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={inviteSubmitting}
                  className="w-full rounded-2xl bg-brand-blue px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  {inviteSubmitting ? 'Sending Invitation...' : 'Invite User'}
                </button>
                {inviteFeedback && (
                  <p className={`text-sm ${inviteFeedback.includes('successfully') ? 'text-green-700' : 'text-brand-maroon'}`}>
                    {inviteFeedback}
                  </p>
                )}
              </form>
            </article>
          </section>

          {invitationActionMessage && (
            <section className="rounded-3xl bg-white p-4 shadow-sm">
              <p className={`text-sm ${invitationActionMessage.includes('Unable') ? 'text-brand-maroon' : 'text-green-700'}`}>
                {invitationActionMessage}
              </p>
            </section>
          )}

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              Invitation Emails
            </p>
            <div className="mt-4 space-y-3">
              {managementData?.invitations.map((invitation: CompanyInvitation) => (
                (() => {
                  const statusChip = getInvitationStatusChip(invitation, now);
                  const countdownChip = getInvitationCountdownChip(invitation, now);
                  const effectiveStatus = getEffectiveInvitationStatus(invitation, now);

                  return (
                    <div key={invitation.id} className="rounded-2xl bg-slate-50 p-4">
                      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold text-slate-900">
                              {invitation.recipientName} ({invitation.role})
                            </p>
                            <StatusChip
                              label={statusChip.label}
                              toneClassName={statusChip.toneClassName}
                            />
                            {countdownChip.label !== statusChip.label && (
                              <StatusChip
                                label={countdownChip.label}
                                toneClassName={countdownChip.toneClassName}
                              />
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{invitation.recipientEmail}</p>
                          <p className="mt-2 text-sm text-slate-600">{invitation.subject}</p>
                          <p className="mt-1 text-xs text-slate-500">{invitation.preview}</p>
                          <a
                            href={invitation.acceptanceLink}
                            className="mt-3 inline-block text-sm font-bold text-brand-blue underline"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open Acceptance Link
                          </a>
                        </div>
                        <div className="min-w-[220px]">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
                            {effectiveStatus}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Sent {new Date(invitation.sentAt).toLocaleString()}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Expires {new Date(invitation.expiresAt).toLocaleString()}
                          </p>
                          {invitation.acceptedAt && (
                            <p className="mt-1 text-xs text-slate-500">
                              Accepted {new Date(invitation.acceptedAt).toLocaleString()}
                            </p>
                          )}
                          <div className="mt-4 grid gap-2">
                            <button
                              type="button"
                              onClick={() => handleInvitationAction(invitation.id, 'resend')}
                              disabled={effectiveStatus === 'accepted'}
                              className="rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-blue shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Resend
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInvitationAction(invitation.id, 'cancel')}
                              disabled={effectiveStatus !== 'sent'}
                              className="rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-maroon shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
