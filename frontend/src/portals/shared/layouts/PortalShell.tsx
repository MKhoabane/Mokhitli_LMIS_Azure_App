import type { PropsWithChildren } from 'react';
import type { AuthUser, PortalDefinition } from '../types';

interface PortalShellProps extends PropsWithChildren {
  portals: PortalDefinition[];
  activePortalId: string;
  onPortalChange: (portalId: string) => void;
  onLogout: () => void;
  authUser: AuthUser;
}

export default function PortalShell({
  portals,
  activePortalId,
  onPortalChange,
  onLogout,
  authUser,
  children
}: PortalShellProps) {
  const activePortal = portals.find((portal) => portal.id === activePortalId) || portals[0];
  const initials = authUser.name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <aside className="w-full bg-brand-blue text-white lg:min-h-screen lg:w-80">
        <div className="border-b border-white/10 px-8 py-8">
          <div className="flex items-end">
            <span className="text-5xl font-bold leading-none text-white">m</span>
            <div className="mb-1 ml-[-12px] flex h-8 w-20 items-center justify-center rounded-full border border-white/20 bg-brand-gray opacity-80">
              <div className="h-6 w-16 rounded-full bg-white/20" />
            </div>
            <span className="ml-[-12px] text-5xl font-bold leading-none text-brand-orange">E</span>
          </div>
          <h1 className="mt-4 text-2xl font-light tracking-tight">
            Mokhitli <span className="font-bold text-brand-orange">Enterprises</span>
          </h1>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-slate-300">
            QCTO Enterprise Suite
          </p>
        </div>

        <div className="px-4 py-6">
          <p className="px-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-300">
            Portals
          </p>
          <nav className="mt-4 space-y-2">
            {portals.map((portal) => {
              const isActive = portal.id === activePortalId;

              return (
                <button
                  key={portal.id}
                  type="button"
                  onClick={() => onPortalChange(portal.id)}
                  className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                    isActive
                      ? 'border-white/20 bg-white/10 shadow-lg'
                      : 'border-transparent bg-transparent hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <p className="text-sm font-bold text-white">{portal.name}</p>
                  <p className="mt-1 text-xs text-slate-300">{portal.summary}</p>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 px-4 py-6">
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-2xl bg-brand-maroon px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">
                Active Portal
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                {activePortal.name}
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-500">{activePortal.summary}</p>
            </div>

            <div className="flex items-center gap-4 self-start rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-lg font-black text-white">
                {initials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{authUser.name}</p>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                  {authUser.role}
                </p>
                <p className="mt-1 text-xs text-slate-500">{activePortal.name}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
