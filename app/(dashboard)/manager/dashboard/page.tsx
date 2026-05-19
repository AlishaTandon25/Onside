"use client";

import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function ManagerDashboardPage() {
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

  const teamPerformance = stats?.teamPerformance || [];
  const goalsForApproval = stats?.goalsForApproval || [];

  const departments = [
    { name: "Eng", value: 85, color: "bg-blue-600" },
    { name: "Sales", value: 60, color: "bg-cyan-600" },
    { name: "Mktg", value: 72, color: "bg-indigo-500" },
    { name: "Ops", value: 45, color: "bg-slate-400" },
  ];

  function getPerformanceBadge(avgProgress: number) {
    if (avgProgress >= 90) return { label: "Excels", class: "bg-emerald-100 text-emerald-700 border border-emerald-200" };
    if (avgProgress >= 70) return { label: "On Track", class: "bg-blue-100 text-blue-700 border border-blue-200" };
    if (avgProgress >= 50) return { label: "Meets", class: "bg-slate-100 text-slate-600 border border-slate-200" };
    return { label: "At Risk", class: "bg-red-100 text-red-700 border border-red-200" };
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Pending Approvals */}
        <div className="col-span-12 md:col-span-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Approvals
            </span>
            <div className="rounded-md bg-amber-100 p-2">
              <span className="text-amber-600 text-sm">✓</span>
            </div>
          </div>

          <div className="text-5xl font-bold tracking-tight text-slate-900">
            {stats?.pendingApprovals || 0}
          </div>

          <div className="mt-3 flex items-center gap-1 text-sm text-slate-500">
            <span className="text-amber-600">!</span>
            <span>Requires your review</span>
          </div>
        </div>

        {/* Team Completion */}
        <div className="col-span-12 md:col-span-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Team Completion
            </span>
            <div className="rounded-md bg-blue-100 p-2">
              <span className="text-blue-600 text-sm">◔</span>
            </div>
          </div>

          <div className="text-5xl font-bold tracking-tight text-slate-900">
            {stats?.teamAvgCompletion || 0}%
          </div>

          <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${stats?.teamAvgCompletion || 0}%` }} />
          </div>

          <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
            <span>↗</span>
            <span>Team average progress</span>
          </div>
        </div>

        {/* At-Risk Goals */}
        <div className="col-span-12 md:col-span-4 rounded-xl border border-slate-200 border-l-4 border-l-red-500 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              At-Risk Goals
            </span>
            <div className="rounded-md bg-red-100 p-2">
              <span className="text-red-600 text-sm">⚠</span>
            </div>
          </div>

          <div className="text-5xl font-bold tracking-tight text-slate-900">
            {stats?.atRiskGoals || 0}
          </div>

          <div className="mt-3 flex items-center gap-1 text-sm text-red-600">
            <span>↘</span>
            <span>Needs immediate attention</span>
          </div>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Team Performance Heatmap */}
        <div className="col-span-12 lg:col-span-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Team Performance Heatmap
            </h2>
            <button className="rounded p-1 text-slate-400 hover:bg-slate-100">
              ⋯
            </button>
          </div>

          <div className="overflow-x-auto p-6">
            <table className="min-w-[600px] w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500">
                  <th className="pb-3 w-1/3">Team Member</th>
                  <th className="pb-3 text-center">Q1</th>
                  <th className="pb-3 text-center">Q2</th>
                  <th className="pb-3 text-center">Q3</th>
                  <th className="pb-3 text-center">Q4 (Current)</th>
                </tr>
              </thead>

              <tbody>
                {teamPerformance.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No team members found
                    </td>
                  </tr>
                ) : (
                  teamPerformance.map((member: any) => {
                    const badge = getPerformanceBadge(member.avgProgress);
                    return (
                      <tr
                        key={member.userId}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-4 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                              {getInitials(member.name || "NA")}
                            </div>
                            {member.name}
                          </div>
                        </td>

                        <td className="py-4 px-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-full items-center justify-center rounded text-xs font-medium ${badge.class}`}
                          >
                            {badge.label}
                          </div>
                        </td>

                        <td className="py-4 px-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-full items-center justify-center rounded text-xs font-medium ${badge.class}`}
                          >
                            {badge.label}
                          </div>
                        </td>

                        <td className="py-4 px-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-full items-center justify-center rounded text-xs font-medium ${badge.class}`}
                          >
                            {badge.label}
                          </div>
                        </td>

                        <td className="py-4 px-1 text-center">
                          <div
                            className={`mx-auto flex h-8 w-full items-center justify-center rounded text-xs font-medium ${badge.class}`}
                          >
                            {member.avgProgress}%
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Average */}
        <div className="col-span-12 lg:col-span-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Department Avg
            </h2>
            <span className="text-slate-400">📊</span>
          </div>

          <div className="relative h-48">
            <div className="absolute inset-0 flex flex-col justify-between">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="border-t border-slate-100"
                />
              ))}
            </div>

            <div className="relative z-10 flex h-full items-end justify-around">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className={`w-12 rounded-t-sm ${dept.color}`}
                    style={{ height: `${dept.value}%` }}
                    title={`${dept.value}%`}
                  />
                  <span className="text-xs text-slate-500">
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Queue */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Approval Queue
          </h2>

          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
            {stats?.pendingApprovals || 0} Pending
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-white text-left text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  Employee
                </th>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  Goal Title
                </th>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  Submission Date
                </th>
                <th className="border-b border-slate-200 px-6 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {goalsForApproval.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No goals pending approval
                  </td>
                </tr>
              ) : (
                goalsForApproval.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.owner?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(item.submittedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          Request Rework
                        </button>
                        <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700">
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}