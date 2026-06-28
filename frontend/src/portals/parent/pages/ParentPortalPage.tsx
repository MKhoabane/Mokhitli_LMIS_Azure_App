import type { ParentPortalData, PortalRenderProps } from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

export default function ParentPortalPage({}: PortalRenderProps) {
  const { data, loading, error } = usePortalData<ParentPortalData>('/notifications/portal/parent');

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading parent workspace...</div>;
  }

  if (!data) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Learner Progress Snapshot
        </p>
        <h3 className="mt-4 text-3xl font-black text-slate-900">{data.learner.name}</h3>
        <p className="mt-2 text-sm text-slate-500">
          {data.learner.programme} | Attendance {data.learner.attendance}% | Progress{' '}
          {data.learner.progress}%
        </p>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Notifications
          </p>
          <div className="mt-4 space-y-3">
            {data.alerts.map((alert) => (
              <div key={alert.message} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-bold text-slate-900">{alert.message}</p>
                <p className="text-sm text-slate-500">Alert level: {alert.level}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Milestones</p>
          <div className="mt-4 space-y-3">
            {data.milestones.map((milestone) => (
              <div key={milestone.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{milestone.title}</p>
                <p className="text-sm text-slate-500">Status: {milestone.status}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
