import type { AssessorPortalData, PortalRenderProps } from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

export default function AssessorPortalPage({}: PortalRenderProps) {
  const { data, loading, error } = usePortalData<AssessorPortalData>(
    '/assessment-engine/portal/assessor'
  );

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading assessor workspace...</div>;
  }

  if (!data) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Assessor</p>
          <h3 className="mt-4 text-3xl font-black text-slate-900">{data.assessor.name}</h3>
          <p className="mt-2 text-sm text-slate-500">
            {data.assessor.openAssessments} open | {data.assessor.dueThisWeek} due this week
          </p>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm xl:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Moderation Flags
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {data.flags.map((flag) => (
              <div
                key={flag}
                className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-800"
              >
                {flag}
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Assessment Queue
          </p>
          <div className="mt-4 space-y-3">
            {data.queue.map((item) => (
              <div
                key={item.learner + item.assessment}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="font-bold text-slate-900">{item.learner}</p>
                <p className="text-sm text-slate-500">
                  {item.assessment} | {item.status} | {item.dueDate}
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Outcome Trends
          </p>
          <div className="mt-4 space-y-3">
            {data.outcomes.map((outcome) => (
              <div key={outcome.programme} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{outcome.programme}</p>
                <p className="text-sm text-slate-500">
                  Competent {outcome.competent} | Re-assessments {outcome.reAssessments}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
