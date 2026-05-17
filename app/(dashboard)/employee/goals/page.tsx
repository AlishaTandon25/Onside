export default function MyGoalsPage() {
  const goals = [
    {
      category: "Strategic",
      quarter: "Q3 2023",
      title: "Increase Enterprise Sales Velocity",
      description:
        "Reduce average sales cycle length for Tier 1 enterprise accounts from 120 days to 90 days through optimized enablement resources.",
      status: "On Track",
      progress: 75,
      statusColor:
        "bg-sky-50 text-sky-700 border border-sky-200",
      progressColor: "bg-sky-500",
      action: "Update Progress",
      actionColor: "text-blue-600 hover:text-blue-700",
    },
    {
      category: "Operations",
      quarter: "Q3 2023",
      title: "Complete Security Audit Phase 2",
      description:
        "Finalize SOC2 compliance documentation and remediate outstanding high-priority vulnerabilities identified in Q2 pentest.",
      status: "At Risk",
      progress: 30,
      statusColor:
        "bg-red-50 text-red-700 border border-red-200",
      progressColor: "bg-amber-500",
      action: "View Details",
      actionColor: "text-red-600 hover:text-red-700",
      atRisk: true,
    },
  ];

  const suggestions = [
    {
      title: "Expand EMEA Partner Network",
      description:
        "Aligns with global expansion OKR. Suggested target: 5 new Tier 1 partners.",
      tag: "High Impact",
    },
    {
      title: "Implement Q3 Sales Training",
      description:
        "Addresses skill gap identified in Q2 performance reviews.",
      tag: "Skill Development",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            My Goals
          </h1>
          <p className="mt-1 text-slate-600">
            Track, manage, and review your quarterly objectives.
          </p>
        </div>

        <a
          href="/employee/goals/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          <span className="text-lg leading-none">+</span>
          Create New Goal
        </a>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-100" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Goals
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-bold text-slate-900">8</span>
              <span className="mb-1 text-sm text-slate-500">
                Active this Q
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-100" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              On Track
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-bold text-slate-900">5</span>
              <span className="mb-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                66%
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-100" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              At Risk
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-bold text-slate-900">2</span>
              <span className="mb-1 rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                Needs Attn
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-100" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Completion
            </p>
            <div className="mt-3 flex items-end gap-3">
              <span className="text-5xl font-bold text-slate-900">
                64%
              </span>
              <span className="mb-1 text-sm text-slate-500">QTD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tabs */}
          <div className="overflow-x-auto border-b border-slate-200">
            <div className="flex min-w-max gap-6">
              <button className="relative border-b-2 border-blue-600 px-1 pb-3 text-sm font-medium text-blue-600">
                Active Goals
                <span className="absolute -right-4 top-0 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  8
                </span>
              </button>
              <button className="border-b-2 border-transparent px-1 pb-3 text-sm text-slate-500 hover:text-slate-900">
                Pending
              </button>
              <button className="border-b-2 border-transparent px-1 pb-3 text-sm text-slate-500 hover:text-slate-900">
                Completed
              </button>
              <button className="border-b-2 border-transparent px-1 pb-3 text-sm text-slate-500 hover:text-slate-900">
                Archived
              </button>
            </div>
          </div>

          {/* Goal Cards */}
          <div className="space-y-4">
            {goals.map((goal, index) => (
              <div
                key={`${goal.title}-${index}`}
                className={`relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${
                  goal.atRisk ? "overflow-hidden" : ""
                }`}
              >
                {goal.atRisk && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-red-500" />
                )}

                {/* Top */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                        {goal.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        📅 {goal.quarter}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-slate-900">
                      {goal.title}
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {goal.description}
                    </p>
                  </div>

                  <button className="text-slate-400 hover:text-slate-600">
                    ⋮
                  </button>
                </div>

                {/* Progress */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-end justify-between">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${goal.statusColor}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {goal.status}
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className={`h-2 rounded-full ${goal.progressColor}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full bg-slate-300 ring-2 ring-white" />
                    <div className="h-6 w-6 rounded-full bg-slate-400 ring-2 ring-white" />
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 ring-2 ring-white">
                      +2
                    </div>
                  </div>

                  <button
                    className={`inline-flex items-center gap-1 text-sm font-semibold ${goal.actionColor}`}
                  >
                    {goal.action}
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}

            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Load More Goals
              <span>⌄</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Suggestions */}
          <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                ✨
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Recommended for You
                </h3>
                <p className="text-xs text-slate-500">
                  AI-driven goal suggestions
                </p>
              </div>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              Based on your role as VP of Sales and recent company
              OKRs, consider adding these objectives:
            </p>

            <div className="space-y-3">
              {suggestions.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600">
                      {item.title}
                    </h4>
                    <span className="text-blue-600">＋</span>
                  </div>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                      + {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700">
              View All Suggestions
            </button>
          </div>

          {/* Resources */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Goal Setting Resources
            </h3>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                >
                  📘 SMART Goals Framework Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                >
                  ▶️ Video: Writing Effective OKRs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}