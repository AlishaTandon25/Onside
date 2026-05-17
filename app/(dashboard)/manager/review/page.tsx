export default function TeamReviewPage() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      avatar: "SC",
      avatarColor: "bg-teal-500",
      goal: "Scale Q4 Infrastructure Efficiency",
      progress: 68,
      status: "Needs Review",
      statusColor: "bg-blue-100 text-blue-700 border border-blue-200",
      progressColor: "bg-blue-600",
      progressLabel: "On Target",
      progressLabelColor: "text-blue-600",
      quote:
        "Successfully migrated 80% of legacy microservices. Encountered a slight bottleneck in CI/CD pipeline optimization but have a remediation plan in place for next week.",
      quoteBorder: "border-slate-200",
    },
    {
      name: "Marcus Thompson",
      avatar: "MT",
      avatarColor: "bg-indigo-500",
      goal: "Reduce Customer Churn by 15%",
      progress: 42,
      status: "Delayed",
      statusColor: "bg-red-100 text-red-700 border border-red-200",
      progressColor: "bg-red-500",
      progressLabel: "-12% vs Target",
      progressLabelColor: "text-red-600",
      quote:
        "Struggling with the integration of the new retention dashboard. API timeouts are causing data lags. Need support from the Engineering team to resolve technical blockers.",
      quoteBorder: "border-red-200",
    },
    {
      name: "Priya Sharma",
      avatar: "PS",
      avatarColor: "bg-amber-500",
      goal: "Increase NPS Score by 20 Points",
      progress: 91,
      status: "Ahead",
      statusColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      progressColor: "bg-emerald-500",
      progressLabel: "+8% Ahead",
      progressLabelColor: "text-emerald-600",
      quote:
        "Customer satisfaction surveys are showing consistent improvement. The new onboarding flow has been a major contributor to the positive trend.",
      quoteBorder: "border-emerald-200",
    },
  ];

  const velocityData = [
    { week: "WK 41", height: "40%", isCurrent: false },
    { week: "WK 42", height: "55%", isCurrent: false },
    { week: "WK 43", height: "45%", isCurrent: false },
    { week: "WK 44", height: "75%", isCurrent: false },
    { week: "WK 45", height: "90%", isCurrent: true },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Team Review
          </h1>
          <p className="mt-2 text-slate-600">
            Monitor team performance, approve updates, and provide coaching
            feedback.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export Report
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              done_all
            </span>
            Batch Approve
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left Column: Metrics & Feed (8/12) */}
        <div className="space-y-6 xl:col-span-8">
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Avg. Progress
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-4xl font-bold text-blue-600">72%</span>
                <span className="flex items-center text-sm font-bold text-emerald-600">
                  <span className="material-symbols-outlined text-[16px]">
                    trending_up
                  </span>
                  +4%
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Pending
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-4xl font-bold text-slate-900">14</span>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Urgent
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                At Risk
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-4xl font-bold text-red-600">3</span>
                <span className="material-symbols-outlined text-red-500">
                  warning
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Next 1:1
              </p>
              <div className="mt-3 flex items-end justify-between">
                <span className="text-xl font-semibold text-slate-900">
                  Tomorrow
                </span>
                <span className="material-symbols-outlined text-slate-400">
                  calendar_month
                </span>
              </div>
            </div>
          </div>

          {/* Main List Content */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Tab Navigation */}
            <div className="flex border-b border-slate-200 px-4">
              <button className="border-b-2 border-blue-600 px-6 py-4 text-sm font-bold text-blue-600">
                Pending Approval (14)
              </button>
              <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
                Active Reviews
              </button>
              <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700">
                Performance Trends
              </button>
              <button className="hidden px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 sm:block">
                Completed
              </button>
            </div>

            {/* Team Member Review Cards */}
            <div className="divide-y divide-slate-100">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="p-6 transition-colors hover:bg-slate-50"
                >
                  <div className="flex flex-col gap-6 md:flex-row">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-blue-100 ${member.avatarColor}`}
                      >
                        {member.avatar}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">
                            {member.name}
                          </h4>
                          <p className="text-sm font-bold text-slate-600">
                            Goal: {member.goal}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${member.statusColor}`}
                        >
                          {member.status}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="mb-1 flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">
                            {member.progress}% Complete
                          </span>
                          <span className={member.progressLabelColor}>
                            {member.progressLabel}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className={`h-full rounded-full ${member.progressColor}`}
                            style={{ width: `${member.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Quote */}
                      <p
                        className={`mb-6 border-l-4 ${member.quoteBorder} py-1 pl-4 text-sm italic text-slate-600`}
                      >
                        &ldquo;{member.quote}&rdquo;
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                          Approve Update
                        </button>
                        <button className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          Add Comment
                        </button>
                        <button className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                          Schedule 1:1
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (4/12) */}
        <aside className="space-y-6 xl:col-span-4">
          {/* Team Velocity Chart Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h4 className="mb-6 text-lg font-semibold text-slate-900">
              Team Velocity
            </h4>
            <div className="flex h-48 items-end justify-between gap-2 px-2">
              {velocityData.map((bar) => (
                <div
                  key={bar.week}
                  className={`group relative flex-1 rounded-t-lg transition-all ${
                    bar.isCurrent
                      ? "bg-blue-600"
                      : "bg-blue-100 hover:bg-blue-500"
                  }`}
                  style={{ height: bar.height }}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs font-semibold text-slate-500">
              {velocityData.map((bar) => (
                <span
                  key={bar.week}
                  className={bar.isCurrent ? "font-bold text-blue-600" : ""}
                >
                  {bar.week}
                </span>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-slate-600">
              Team is performing{" "}
              <span className="font-bold text-blue-600">12% faster</span> than
              previous sprint average.
            </p>
          </div>

          {/* AI Coaching Tips Section */}
          <div className="relative overflow-hidden rounded-xl bg-blue-600 p-6 text-white shadow-sm">
            <div className="absolute -right-4 -top-4 opacity-20">
              <span
                className="material-symbols-outlined text-[80px]"
                style={{
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                psychology
              </span>
            </div>

            <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
              <span className="material-symbols-outlined">auto_awesome</span>
              AI Coaching Tips
            </h4>

            <div className="relative z-10 space-y-4">
              <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                <p className="mb-1 text-sm font-bold">Empowerment Gap</p>
                <p className="text-sm text-blue-100">
                  Marcus is blocked by engineering. Consider scheduling a
                  cross-functional sync to unblock his API integration task.
                </p>
              </div>
              <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                <p className="mb-1 text-sm font-bold">
                  Recognition Opportunity
                </p>
                <p className="text-sm text-blue-100">
                  Sarah has exceeded her efficiency targets for 3 weeks. A
                  public shout-out in the next stand-up would boost morale.
                </p>
              </div>
            </div>

            <button className="mt-6 w-full rounded-lg bg-white py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              View Full Strategy
            </button>
          </div>

          {/* Quick Actions Section */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Quick Actions
            </h4>
            <div className="space-y-2">
              {[
                {
                  icon: "description",
                  label: "Export Team Report",
                },
                {
                  icon: "send",
                  label: "Send Team Reminder",
                },
                {
                  icon: "history",
                  label: "Audit Update Logs",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-blue-300"
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600">
                      {action.icon}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {action.label}
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-slate-400">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
