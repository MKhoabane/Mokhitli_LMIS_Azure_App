import type { EmployerPortalData, PortalRenderProps } from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

export default function EmployerPortalPage({}: PortalRenderProps) {
  const { data, loading, error } = usePortalData<EmployerPortalData>(
    '/workplace-learning/portal/employer'
  );

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading employer workspace...</div>;
  }

  if (!data) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
}
