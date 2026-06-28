import type { FacilitatorPortalData, PortalRenderProps } from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

export default function FacilitatorPortalPage({}: PortalRenderProps) {
  const { data, loading, error } = usePortalData<FacilitatorPortalData>('/lms/portal/facilitator');

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading facilitator workspace...</div>;
  if (!data) return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Facilitator</p>
          <h3 className="mt-4 text-3xl font-black text-slate-900">{data.facilitator.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{data.facilitator.activeCohorts} cohorts | {data.facilitator.assignedLearners} learners</p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Action Queue</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {data.actions.map((action) => (
              <div key={action} className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">{action}</div>
            ))}
          </div>
        </article>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Upcoming Sessions</p>
          <div className="mt-4 space-y-3">
            {data.sessions.map((session) => (
              <div key={session.cohort + session.module} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-bold text-slate-900">{session.cohort} | {session.module}</p>
                <p className="text-sm text-slate-500">{session.date} | Attendance target: {session.attendance}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Cohort Health</p>
          <div className="mt-4 space-y-3">
            {data.cohorts.map((cohort) => (
              <div key={cohort.name} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{cohort.name}</p>
                <p className="text-sm text-slate-500">Completion {cohort.completion}% | At-risk learners {cohort.atRisk}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
