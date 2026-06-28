import type { PortalRenderProps } from '../types';

interface PortalPlaceholderProps extends PortalRenderProps {
  portalName: string;
  focus: string;
}

export default function PortalPlaceholder({
  portalName,
  focus,
  dashboardData,
  dashboardLoading
}: PortalPlaceholderProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">
          {portalName}
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          Portal workspace scaffolded
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
          This portal is connected to the shared application shell and is ready for
          role-specific pages, services, and workflow screens.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Primary Focus
          </p>
          <p className="mt-4 text-xl font-bold text-slate-900">{focus}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Learners In View
          </p>
          <p className="mt-4 text-4xl font-black text-slate-900">
            {dashboardLoading ? '...' : dashboardData?.learners.length ?? 0}
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Programmes In View
          </p>
          <p className="mt-4 text-4xl font-black text-slate-900">
            {dashboardLoading ? '...' : dashboardData?.courses.length ?? 0}
          </p>
        </div>
      </section>
    </div>
  );
}
