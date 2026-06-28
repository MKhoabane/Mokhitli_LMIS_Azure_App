import { useMemo, useState } from 'react';
import type { PortalRenderProps } from '../../shared/types';

type AdminView = 'dashboard' | 'learners' | 'programmes';

const ADMIN_VIEWS: Array<{ id: AdminView; label: string }> = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'learners', label: 'Learners' },
  { id: 'programmes', label: 'Programmes' }
];

export default function AdminPortalPage({
  dashboardData,
  dashboardLoading
}: PortalRenderProps) {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');

  const infrastructureEntries = useMemo(
    () => Object.entries(dashboardData?.infrastructure || {}),
    [dashboardData]
  );

  const stats = [
    {
      label: 'Total Enrollments',
      value: dashboardData?.learners.length ?? 0,
      detail: 'Current learner records'
    },
    {
      label: 'Accredited Programmes',
      value: dashboardData?.courses.length ?? 0,
      detail: 'Available programme records'
    },
    {
      label: 'Registered Modules',
      value: dashboardData?.modules.length ?? 0,
      detail: 'Connected backend module routes'
    }
  ];

  if (dashboardLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-brand-blue" />
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-slate-500">
            Synchronizing enterprise dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-blue">
              Admin Command Center
            </p>
            <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              Enterprise oversight and operational visibility
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {ADMIN_VIEWS.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setActiveView(view.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  activeView === view.id
                    ? 'bg-brand-blue text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-4 text-5xl font-black text-slate-900">{stat.value}</p>
            <p className="mt-3 text-sm text-slate-500">{stat.detail}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Infrastructure
          </p>
          <div className="mt-6 space-y-3">
            {infrastructureEntries.map(([name, status]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <span className="text-sm font-bold capitalize text-slate-700">{name}</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            {activeView === 'programmes' ? 'Programme Registry' : 'Learner Registry'}
          </p>

          {activeView === 'programmes' ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      SAQA
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Pass Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData?.courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{course.code}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{course.title}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{course.saqaId}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{course.passRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Learner
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData?.learners.map((learner) => (
                    <tr key={learner.id}>
                      <td className="px-4 py-4 text-sm font-bold text-slate-900">{learner.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{learner.email}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{learner.course}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">{learner.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Recent Programme Submissions
          </p>
          <div className="mt-6 space-y-4">
            {dashboardData?.recentSubmissions.map((submission) => (
              <div key={submission.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm font-bold text-slate-900">{submission.qualificationType}</p>
                <p className="mt-1 text-sm text-slate-500">SAQA ID: {submission.saqaId}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
            Connected Backend Modules
          </p>
          <div className="mt-6 space-y-3">
            {dashboardData?.modules.map((module) => (
              <div
                key={module.id}
                className="rounded-2xl border border-slate-200 px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-900">{module.name}</p>
                  <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-blue">
                    {module.basePath}
                  </span>
                </div>
                {module.aliases && module.aliases.length > 0 ? (
                  <p className="mt-2 text-xs text-slate-500">
                    Aliases: {module.aliases.join(', ')}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
