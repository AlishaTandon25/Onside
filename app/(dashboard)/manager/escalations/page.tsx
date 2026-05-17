export default function EscalationsPage() {
  const escalations = [
    {
      id: "#ESC-1042",
      severity: "Critical",
      severityColor:
        "bg-red-100 text-red-800 border border-red-200",
      borderColor: "bg-red-500",
      title: "Budget Overrun - Q4 Marketing Campaign",
      goal: "Increase Q4 Lead Gen by 25%",
      time: "2 days ago",
      assignees: 2,
      status: "Escalated",
      statusDot: "bg-red-500",
      actionLabel: "Take Action",
      actionPrimary: true,
    },
    {
      id: "#ESC-1041",
      severity: "High",
      severityColor:
        "bg-amber-100 text-amber-800 border border-amber-200",
      borderColor: "bg-amber-500",
      title: "API Integration Delays with Third-Party Vendor",
      goal: "Launch New Partner Portal v2.0",
      time: "3 days ago",
      assignees: 1,
      status: "In Review",
      statusDot: "bg-amber-500",
      actionLabel: "Resolve",
      actionPrimary: false,
    },
    {
      id: "#ESC-1038",
      severity: "Medium",
      severityColor:
        "bg-blue-100 text-blue-800 border border-blue-200",
      borderColor: "bg-blue-400",
      title: "Resource Bottleneck in QA Testing Phase",
      goal: "Q3 Feature Release Train",
      time: "1 week ago",
      assignees: 2,
      status: "Pending Input",
      statusDot: "bg-blue-400",
      actionLabel: "Resolve",
      actionPrimary: false,
    },
  ];

  const activityLog = [
    {
      time: "10 mins ago",
      dotColor: "bg-slate-300",
      content: (
        <>
          <span className="font-semibold">Sarah J.</span> changed status of{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            #ESC-1042
          </span>{" "}
          to <span className="font-semibold text-red-600">Escalated</span>.
        </>
      ),
    },
    {
      time: "1 hour ago",
      dotColor: "bg-blue-600",
      content: (
        <>
          <span className="font-semibold">Mike T.</span> added a comment on{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">
            #ESC-1042
          </span>
          .
        </>
      ),
      quote:
        '"We need approval from Finance before proceeding with the revised marketing spend."',
    },
    {
      time: "Yesterday",
      dotColor: "bg-emerald-500",
      content: (
        <>
          <span className="font-semibold">David L.</span> resolved escalation{" "}
          <span className="text-blue-600 line-through hover:underline cursor-pointer">
            #ESC-1035
          </span>
          .
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Left Column: Main Dashboard & List */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Header Section */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Escalations
              </h1>
              <p className="mt-1 text-slate-600">
                Manage and resolve critical blockers affecting strategic goals.
              </p>
            </div>
            <div className="mt-4 flex gap-3 md:mt-0">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  download
                </span>
                Export Report
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  add
                </span>
                New Escalation
              </button>
            </div>
          </div>

          {/* Dashboard KPI Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-red-500">
                  warning
                </span>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Active Escalations
              </h3>
              <div className="mt-2 text-3xl font-bold text-slate-900">12</div>
              <div className="mt-2 flex items-center gap-1 text-sm text-red-600">
                <span className="material-symbols-outlined text-[16px]">
                  trending_up
                </span>
                +2 this week
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-blue-600">
                  timer
                </span>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg. Resolution Time
              </h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">4.2</span>
                <span className="text-sm text-slate-500">days</span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                <span className="material-symbols-outlined text-[16px]">
                  trending_down
                </span>
                -1.1 days
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-red-500">
                  priority_high
                </span>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                High Priority
              </h3>
              <div className="mt-2 text-3xl font-bold text-red-600">3</div>
              <div className="mt-2 text-sm text-slate-500">
                Require immediate action
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-emerald-600">
                  check_circle
                </span>
              </div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Resolution Rate
              </h3>
              <div className="mt-2 text-3xl font-bold text-slate-900">86%</div>
              <div className="mt-2 flex items-center gap-1 text-sm text-emerald-600">
                <span className="material-symbols-outlined text-[16px]">
                  trending_up
                </span>
                +5% this month
              </div>
            </div>
          </div>

          {/* Escalation Management Center */}
          <div className="flex min-h-[500px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Tabs */}
            <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-4">
              <button className="whitespace-nowrap border-b-2 border-blue-600 py-4 text-sm font-bold text-blue-600">
                All Active
              </button>
              <button className="whitespace-nowrap border-b-2 border-transparent py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Pending Review
              </button>
              <button className="whitespace-nowrap border-b-2 border-transparent py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Critical Blockers
              </button>
              <button className="whitespace-nowrap border-b-2 border-transparent py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                Recently Resolved
              </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 p-4 sm:flex-row">
              <div className="relative w-full sm:w-80">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                  filter_list
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  placeholder="Filter by keyword, owner, or goal..."
                  type="text"
                />
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <button className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Severity
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </button>
                <button className="flex items-center gap-2 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Department
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </button>
              </div>
            </div>

            {/* Escalation List */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {escalations.map((esc) => (
                <div
                  key={esc.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <div
                    className={`absolute bottom-0 left-0 top-0 w-1 ${esc.borderColor}`}
                  />
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${esc.severityColor}`}
                        >
                          {esc.severity}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {esc.id}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <span className="material-symbols-outlined text-[14px]">
                            schedule
                          </span>
                          {esc.time}
                        </span>
                      </div>
                      <h4 className="mb-1 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {esc.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="material-symbols-outlined text-[16px] text-blue-600">
                          track_changes
                        </span>
                        Goal: {esc.goal}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 lg:justify-end">
                      <div className="flex flex-col">
                        <span className="mb-1 text-xs font-semibold text-slate-500">
                          Assigned To
                        </span>
                        <div className="flex -space-x-2">
                          {Array.from({ length: esc.assignees }).map(
                            (_, i) => (
                              <div
                                key={i}
                                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-300 text-xs font-bold text-slate-600"
                                style={{ zIndex: esc.assignees - i }}
                              >
                                {String.fromCharCode(65 + i)}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="mb-1 text-xs font-semibold text-slate-500">
                          Status
                        </span>
                        <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${esc.statusDot}`}
                          />
                          {esc.status}
                        </span>
                      </div>

                      <div className="hidden gap-2 lg:flex">
                        <button
                          className="rounded border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 transition-colors"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            visibility
                          </span>
                        </button>
                        <button
                          className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
                            esc.actionPrimary
                              ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {esc.actionLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Panels */}
        <div className="flex w-full shrink-0 flex-col gap-6 xl:w-80">
          {/* AI Assistant Panel */}
          <div className="relative flex flex-col overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 100% 0%, #2563eb 0%, transparent 50%)",
              }}
            />
            <div className="z-10 flex items-center gap-3 border-b border-slate-200/50 bg-white/50 p-4 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  psychology
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  AI Resolution Assistant
                </h3>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Context-Aware Insights
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-4 p-4">
              <p className="text-sm text-slate-600">
                Based on historical data for{" "}
                <strong>#ESC-1042</strong>, similar budget overruns were resolved
                by reallocating Q3 surplus funds.
              </p>

              <div className="space-y-2">
                <div className="group cursor-pointer rounded border border-slate-200 bg-white p-3 hover:border-blue-300 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-blue-600">
                      lightbulb
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        Recommended Action
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                        Request emergency budget transfer from &apos;General
                        Ops&apos; pool. Approval likelihood: 85%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group cursor-pointer rounded border border-slate-200 bg-white p-3 hover:border-cyan-300 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined mt-0.5 text-[16px] text-cyan-600">
                      group_add
                    </span>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
                        Identify Stakeholder
                      </h4>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                        Include Finance VP (Robert Chen) in this escalation loop
                        to expedite approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="flex w-full items-center justify-center gap-2 rounded border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                Generate Draft Proposal
                <span className="material-symbols-outlined text-[14px]">
                  auto_awesome
                </span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <span className="material-symbols-outlined text-[18px]">
                  history
                </span>
                Recent Activity
              </h3>
              <button className="text-[11px] font-semibold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {activityLog.map((item, idx) => (
                <div
                  key={idx}
                  className="relative border-l-2 border-slate-200 pb-4 pl-6 last:border-0 last:pb-0"
                >
                  <div
                    className={`absolute -left-[5px] top-0 h-2 w-2 rounded-full border border-white ${item.dotColor}`}
                  />
                  <div className="mb-1 text-[10px] font-semibold uppercase text-slate-500">
                    {item.time}
                  </div>
                  <div className="text-sm text-slate-700">{item.content}</div>
                  {item.quote && (
                    <div className="mt-2 rounded border border-slate-200 bg-slate-50 p-2 text-[12px] italic text-slate-500">
                      {item.quote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
