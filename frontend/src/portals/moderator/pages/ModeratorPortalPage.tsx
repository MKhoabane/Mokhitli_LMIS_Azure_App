import type { ModeratorPortalData, PortalRenderProps } from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

export default function ModeratorPortalPage({}: PortalRenderProps) {
  const { data, loading, error } = usePortalData<ModeratorPortalData>('/audit/portal/moderator');

  if (loading) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading moderator workspace...</div>;
  }

  if (!data) {
    return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Moderator Profile
        </p>
        <h3 className="mt-4 text-3xl font-black text-slate-900">{data.moderator.name}</h3>
        <p className="mt-2 text-sm text-slate-500">
          {data.moderator.moderationBatches} batches | Compliance {data.moderator.complianceScore}%
        </p>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Moderation Queue
          </p>
          <div className="mt-4 space-y-3">
            {data.moderationQueue.map((batch) => (
              <div key={batch.batch} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-bold text-slate-900">
                  {batch.batch} | {batch.programme}
                </p>
                <p className="text-sm text-slate-500">
                  Sample size {batch.sampleSize} | {batch.status}
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Findings</p>
          <div className="mt-4 space-y-3">
            {data.findings.map((finding) => (
              <div key={finding.category} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{finding.category}</p>
                <p className="text-sm text-slate-500">
                  {finding.total} findings | Severity {finding.severity}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
          Required Actions
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
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
