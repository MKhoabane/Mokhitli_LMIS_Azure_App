import { useCallback, useEffect, useMemo, useState } from 'react';
import BrandLogo from '../components/BrandLogo';
import StatusChip from '../components/StatusChip';
import {
  getEffectiveInvitationStatus,
  getInvitationCountdownChip,
  getInvitationStatusChip
} from '../components/invitationStatus';
import api from '../services/api';
import type { AuthSession, CompanyInvitation } from '../portals/shared/types';

interface InvitationAcceptancePageProps {
  onAccept: (session: AuthSession) => void;
}

interface InvitationPayload {
  invitation: CompanyInvitation;
  company: {
    id: string;
    name: string;
    companyEmail: string;
    industry: string;
    requestedUsers: number;
    status: string;
  };
}

export default function InvitationAcceptancePage({ onAccept }: InvitationAcceptancePageProps) {
  const invitationId = useMemo(() => window.location.pathname.split('/').pop() || '', []);
  const [data, setData] = useState<InvitationPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [acceptedSession, setAcceptedSession] = useState<AuthSession | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const loadInvitation = useCallback(() => {
    let mounted = true;

    api
      .get<InvitationPayload>(`/auth/invitations/${invitationId}`)
      .then((response) => {
        if (mounted) {
          setData(response.data);
        }
      })
      .catch(() => {
        if (mounted) {
          setError('Invitation details could not be loaded.');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [invitationId]);

  useEffect(() => loadInvitation(), [loadInvitation]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
      if (!acceptedSession) {
        loadInvitation();
      }
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [acceptedSession, loadInvitation]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await api.post<AuthSession>(`/auth/invitations/${invitationId}/accept`, {
        password
      });
      setAcceptedSession(response.data);
    } catch (requestError: unknown) {
      const requestMessage =
        typeof requestError === 'object' &&
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
          : 'Unable to accept this invitation right now.';

      setError(requestMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const statusChip = data ? getInvitationStatusChip(data.invitation, now) : null;
  const countdownChip = data ? getInvitationCountdownChip(data.invitation, now) : null;
  const effectiveInvitationStatus = data ? getEffectiveInvitationStatus(data.invitation, now) : 'sent';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <BrandLogo className="mx-auto w-full max-w-[430px]" />
        <p className="mt-4 text-center text-sm font-medium text-brand-blue uppercase tracking-widest">
          Company Invitation
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
          {loading ? (
            <p className="text-sm text-slate-500">Loading invitation...</p>
          ) : error && !data ? (
            <p className="text-sm text-brand-maroon">{error}</p>
          ) : data ? (
            <>
              {acceptedSession ? (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                    Invitation Accepted
                  </p>
                  <h1 className="mt-4 text-3xl font-black text-slate-900">
                    Welcome to {data.company.name}
                  </h1>
                  <p className="mt-3 text-sm text-slate-500">
                    Your invitation has been confirmed and your account is ready.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {statusChip && (
                      <StatusChip
                        label={statusChip.label}
                        toneClassName={statusChip.toneClassName}
                      />
                    )}
                  </div>
                  <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm text-green-800">
                    <p>
                      <span className="font-bold">Signed in as:</span> {acceptedSession.user.email}
                    </p>
                    <p className="mt-2">
                      <span className="font-bold">Role:</span> {acceptedSession.user.role}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAccept(acceptedSession)}
                    className="mt-6 w-full rounded-2xl bg-brand-blue px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800"
                  >
                    Continue To Portal
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Invitation Details
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {statusChip && (
                        <StatusChip
                          label={statusChip.label}
                          toneClassName={statusChip.toneClassName}
                        />
                      )}
                      {countdownChip && countdownChip.label !== statusChip?.label && (
                        <StatusChip
                          label={countdownChip.label}
                          toneClassName={countdownChip.toneClassName}
                        />
                      )}
                    </div>
                  </div>
                  <h1 className="mt-4 text-3xl font-black text-slate-900">
                    Join {data.company.name}
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    {data.invitation.recipientName} invited as {data.invitation.role}
                  </p>
                  <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p><span className="font-bold text-slate-900">Email:</span> {data.invitation.recipientEmail}</p>
                    <p className="mt-2"><span className="font-bold text-slate-900">Status:</span> {effectiveInvitationStatus}</p>
                    <p className="mt-2"><span className="font-bold text-slate-900">Expires:</span> {new Date(data.invitation.expiresAt).toLocaleString()}</p>
                  </div>

                  <form className="mt-6 space-y-4" onSubmit={handleAccept}>
                    <div>
                      <label htmlFor="invitation-password" className="block text-sm font-semibold text-slate-700">
                        Set Your Password
                      </label>
                      <input
                        id="invitation-password"
                        name="invitation-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                        placeholder="Create a password"
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-brand-maroon">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting || effectiveInvitationStatus === 'cancelled' || effectiveInvitationStatus === 'expired'}
                      className="w-full rounded-2xl bg-brand-blue px-4 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {submitting ? 'Accepting Invitation...' : 'Accept Invitation'}
                    </button>
                  </form>
                </>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
