import type { LearnerPortalData, PortalRenderProps } from '../../shared/types';
import { usePortalData } from '../../shared/hooks/usePortalData';

export default function LearnerPortalPage({ dashboardData }: PortalRenderProps) {
  const { data, loading, error } = usePortalData<LearnerPortalData>('/learner-management/portal/learner');

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-sm">Loading learner workspace...</div>;
  if (!data) return <div className="rounded-3xl bg-white p-8 shadow-sm text-brand-maroon">{error}</div>;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">Learner Overview</p>
        <h3 className="mt-3 text-3xl font-black text-slate-900">{data.learner.name}</h3>
        <p className="mt-2 text-sm text-slate-500">{data.learner.programme} | NQF {data.learner.nqfLevel}</p>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">
        {data.progress.map((item) => (
          <article key={item.title} className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{item.title}</p>
            <p className="mt-4 text-5xl font-black text-slate-900">{item.completion}%</p>
          </article>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Upcoming Assessments</p>
          <div className="mt-4 space-y-3">
            {data.upcomingAssessments.map((assessment) => (
              <div key={assessment.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{assessment.title}</p>
                <p className="text-sm text-slate-500">{assessment.type} | {assessment.dueDate}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Certificates</p>
          <div className="mt-4 space-y-3">
            {data.certificates.map((certificate) => (
              <div key={certificate.title} className="rounded-2xl border border-slate-200 p-4">
                <p className="font-bold text-slate-900">{certificate.title}</p>
                <p className="text-sm text-slate-500">Status: {certificate.status}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Portfolio Snapshot</p>
        <p className="mt-4 text-sm text-slate-600">Active learners visible to the enterprise platform: {dashboardData?.learners.length ?? 0}</p>
      </section>
    </div>
  );
}
