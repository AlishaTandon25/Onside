"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function EmployeeDashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-red-600">Error loading dashboard: {error}</p>
      </div>
    );
  }

  const goals = stats?.goals || [];

  function getStatusClasses(status: string) {
    switch (status) {
      case "APPROVED":
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "SUBMITTED":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "DRAFT":
        return "bg-slate-100 text-slate-700 border border-slate-200";
      case "REJECTED":
      case "RETURNED_FOR_REWORK":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  }

  function getProgressColor(progress: number, status: string) {
    if (status === "REJECTED" || status === "RETURNED_FOR_REWORK") return "bg-amber-500";
    if (progress === 100 || status === "COMPLETED") return "bg-emerald-500";
    return "bg-blue-600";
  }

  function formatStatus(status: string) {
    return status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  }

  const insights = [
    {
      title: 'Your "Increase Sales" goal is at risk due to recent trends.',
      description:
        "Pipeline velocity has decreased by 12% over the last 14 days.",
      type: "warning",
      action: "View Pipeline Analysis",
    },
    {
      title: "Excellent progress on Enterprise Clients.",
      description:
        "You are tracking 15% ahead of schedule for Q3.",
      type: "success",
    },
    {
      title: "Weekly update due soon.",
      description:
        "It has been 6 days since your last status update.",
      type: "info",
      action: "Add Update",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100 blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Good morning, Alex.
          </h1>
          <p className="mt-2 flex items-center gap-2 text-slate-600">
            <span className="text-emerald-600">✓</span>
            You're on track for Q3. Keep up the momentum.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Goals Created
          </p>
          <div className="mt-3 text-4xl font-bold text-slate-900">
            {stats?.totalGoals || 0}
          </div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-emerald-600">
            {stats?.approvedGoals || 0} approved
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Completion
          </p>
          <div className="mt-3 text-4xl font-bold text-slate-900">{stats?.avgProgress || 0}%</div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500">
            Overall across {stats?.totalGoals || 0} active goals
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Progress
          </p>
          <div className="mt-4 h-2 rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${stats?.avgProgress || 0}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-500">
            <span>Q3 Target</span>
            <span>{stats?.avgProgress || 0}%</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Needs Update
          </p>
          <div className="mt-3 text-4xl font-bold text-red-600">{stats?.goalsNeedingUpdate || 0}</div>
          <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-red-600">
            {stats?.goalsNeedingUpdate > 0 ? "Requires attention" : "All up to date"}
          </p>
        </div>
      </div>

      {/* Annual Cycle Progress */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Annual Cycle Progress
        </h2>
        <div className="grid grid-cols-5 gap-4 text-center">
          {[
            ["Goal Setting", true],
            ["Q1", true],
            ["Q2", true],
            ["Q3", "current"],
            ["Annual Review", false],
          ].map(([label, state]) => (
            <div key={String(label)} className="space-y-2">
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  state === true
                    ? "bg-emerald-500 text-white"
                    : state === "current"
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {state === true ? "✓" : label === "Annual Review" ? "Y/E" : "Q3"}
              </div>
              <p
                className={`text-xs font-medium ${
                  state === "current"
                    ? "text-blue-600"
                    : "text-slate-500"
                }`}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Current Goals */}
        <div className="xl:col-span-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Current Goals
            </h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Thrust Area</th>
                  <th className="px-6 py-3 text-center">Weightage</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {goals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No goals found. Create your first goal to get started!
                    </td>
                  </tr>
                ) : (
                  goals.map((goal: any) => (
                    <tr
                      key={goal.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {goal.title}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {goal.thrustArea}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {goal.weightage}%
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 rounded-full bg-slate-200">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(
                                goal.progress,
                                goal.status
                              )}`}
                              style={{ width: `${goal.progress}%` }}
                            />
                          </div>
                          <span className="w-10 text-right text-xs text-slate-500">
                            {Math.round(goal.progress)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                            goal.status
                          )}`}
                        >
                          {formatStatus(goal.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Coach */}
        <div className="xl:col-span-4">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                ✨
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">AI Coach</h3>
                <p className="text-xs text-slate-500">Real-time insights</p>
              </div>
            </div>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div
                  key={`${insight.title}-${index}`}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <h4 className="font-medium text-slate-900">
                    {insight.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600">
                    {insight.description}
                  </p>
                  {insight.action && (
                    <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                      {insight.action}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI about your goals..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

