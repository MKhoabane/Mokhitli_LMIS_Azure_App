import type { CompanyInvitation } from '../portals/shared/types';

interface ChipConfig {
  label: string;
  toneClassName: string;
}

export function getEffectiveInvitationStatus(invitation: Pick<CompanyInvitation, 'status' | 'expiresAt'>, now = Date.now()) {
  if (invitation.status === 'accepted' || invitation.status === 'cancelled') {
    return invitation.status;
  }

  return new Date(invitation.expiresAt).getTime() <= now ? 'expired' : invitation.status;
}

export function getInvitationStatusChip(
  invitation: Pick<CompanyInvitation, 'status' | 'expiresAt'>,
  now = Date.now()
): ChipConfig {
  const effectiveStatus = getEffectiveInvitationStatus(invitation, now);

  switch (effectiveStatus) {
    case 'accepted':
      return { label: 'Accepted', toneClassName: 'bg-green-100 text-green-700' };
    case 'cancelled':
      return { label: 'Cancelled', toneClassName: 'bg-rose-100 text-rose-700' };
    case 'expired':
      return { label: 'Expired', toneClassName: 'bg-rose-100 text-rose-700' };
    default:
      return { label: 'Active', toneClassName: 'bg-emerald-100 text-emerald-700' };
  }
}

export function getInvitationCountdownChip(
  invitation: Pick<CompanyInvitation, 'status' | 'expiresAt'>,
  now = Date.now()
): ChipConfig {
  const effectiveStatus = getEffectiveInvitationStatus(invitation, now);

  if (effectiveStatus !== 'sent') {
    return getInvitationStatusChip(invitation, now);
  }

  const diffMs = new Date(invitation.expiresAt).getTime() - now;
  const totalHours = Math.max(Math.floor(diffMs / (1000 * 60 * 60)), 0);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  return {
    label: days > 0 ? `Expires in ${days}d ${hours}h` : `Expires in ${Math.max(hours, 1)}h`,
    toneClassName: days <= 1 ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-brand-blue'
  };
}
