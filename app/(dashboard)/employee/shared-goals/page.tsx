export default function SharedGoalsPage() {
  const sharedGoals = [
    {
      title: "Product & Marketing: Q4 Launch",
      description:
        "Deliver the unified dashboard experience to enterprise beta customers and launch the associated GTM campaign.",
      progress: 75,
      progressColor: "bg-blue-500",
      borderColor: "border-l-blue-600",
      bgHighlight: "",
      isAtRisk: false,
      teams: [
        { initials: "PR", label: "Product Team" },
        { initials: "MK", label: "Marketing Team" },
      ],
    },
    {
      title: "Sales & Engineering: SOC2 Compliance",
      description:
        "Implement required security infrastructure upgrades to unlock enterprise sales tier.",
      progress: 40,
      progressColor: "bg-blue-600",
      borderColor: "border-l-cyan-600",
      bgHighlight: "",
      isAtRisk: false,
      teams: [
        { initials: "SA", label: "Sales" },
        { initials: "EN", label: "Engineering" },
        { initials: "LE", label: "Legal" },
      ],
    },
    {
      title: "Design & Data: User Insight Pipeline",
      description:
        "Automate UX research tagging with raw data telemetry flows.",
      progress: 15,
      progressColor: "bg-red-500",
      borderColor: "border-l-red-500",
      bgHighlight: "bg-red-50",
      isAtRisk: true,
      teams: [
        { initials: "DE", label: "Design" },
        { initials: "DA", label: "Data" },
      ],
    },
  ];

  const activities = [
    {
      avatar: "SJ",
      avatarColor: "bg-blue-500",
      name: "Sarah Jenkins",
      action: "completed a milestone",
      detail: 'Q4 Launch: "Beta Assets Approved"',
      time: "2 hours ago",
    },
    {
      avatar: "DC",
      avatarColor: "bg-indigo-500",
      name: "David Chen",
      action: "commented",
      detail: '"We need to align the data schema before Friday."',
      time: "5 hours ago",
      isQuote: true,
    },
    {
      avatar: null,
      avatarColor: "bg-cyan-600",
      icon: "flag",
      name: null,
      action: "New shared goal created",
      detail: '"Customer Retention Q1" (Support & Product)',
      time: "Yesterday",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Shared Goals
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Monitor cross-functional alignment and track the progress of
            collaborative objectives bridging multiple departments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            All Departments
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
          </button>
          <button className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">sort</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* KPI 1 */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Shared Goals
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <span className="material-symbols-outlined text-[18px]">
                account_tree
              </span>
            </div>
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900">24</div>
          <div className="flex items-center gap-1 text-sm text-emerald-600">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            <span>+3 initiated this quarter</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Cross-Team Alignment
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
              <span className="material-symbols-outlined text-[18px]">
                handshake
              </span>
            </div>
          </div>
          <div className="mt-1 text-3xl font-bold text-slate-900">88%</div>
          <div className="flex items-center gap-1 text-sm text-emerald-600">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            <span>+5% vs last quarter</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-red-200 bg-white p-5 shadow-sm">
          <div className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-red-50" />
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              At-Risk Collaborations
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <span className="material-symbols-outlined text-[18px]">
                warning
              </span>
            </div>
          </div>
          <div className="mt-1 text-3xl font-bold text-red-600">2</div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Requires executive review</span>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
        {/* Left Column: Collaborative Goal List (8 cols) */}
        <div className="flex flex-col gap-4 xl:col-span-8">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Active Collaborations
            </h2>
            <button className="text-sm font-medium text-blue-600 hover:underline">
              View All
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {sharedGoals.map((goal) => (
              <div
                key={goal.title}
                className={`cursor-pointer rounded-xl border border-slate-200 border-l-4 ${goal.borderColor} ${goal.bgHighlight} bg-white p-5 shadow-sm transition-shadow hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {goal.title}
                      </h3>
                      {goal.isAtRisk && (
                        <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          At Risk
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-1 text-sm text-slate-600">
                      {goal.description}
                    </p>
                  </div>

                  {/* Team Avatars */}
                  <div className="flex -space-x-2">
                    {goal.teams.map((team, idx) => (
                      <div
                        key={team.initials}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-700"
                        title={team.label}
                        style={{ zIndex: goal.teams.length - idx }}
                      >
                        {team.initials}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      {goal.isAtRisk ? "Progress (Blocked)" : "Progress"}
                    </span>
                    <span
                      className={
                        goal.isAtRisk
                          ? "text-red-600"
                          : "text-slate-900"
                      }
                    >
                      {goal.progress}%
                    </span>
                  </div>
                  <div
                    className={`h-2 w-full overflow-hidden rounded-full ${
                      goal.isAtRisk ? "bg-red-100" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`h-full rounded-full ${goal.progressColor}`}
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Alignment Map & Activity (4 cols) */}
        <div className="flex flex-col gap-6 xl:col-span-4">
          {/* Alignment Map Preview */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Alignment Map
              </h2>
              <button className="flex h-8 w-8 items-center justify-center rounded text-slate-500 hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  open_in_new
                </span>
              </button>
            </div>
            <div className="relative flex min-h-[240px] flex-col items-center justify-center bg-slate-50 p-6">
              {/* Dot grid background */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, #0b1c30 1px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10 flex w-full flex-col items-center">
                {/* Top OKR Node */}
                <div className="relative z-10 mb-12 rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-white shadow-md">
                  Company Objective: Q4 Revenue
                  {/* Connectors */}
                  <div className="absolute -bottom-8 left-1/2 h-8 w-px -translate-x-1/2 bg-slate-300" />
                  <div className="absolute -bottom-8 left-[20%] h-px w-[60%] bg-slate-300" />
                  <div className="absolute -bottom-4 left-[20%] h-4 w-px bg-slate-300" />
                  <div className="absolute -bottom-4 right-[20%] h-4 w-px bg-slate-300" />
                </div>

                {/* Sub Nodes */}
                <div className="flex w-full justify-between px-4">
                  <div className="w-24 rounded border border-slate-200 bg-white px-3 py-1.5 text-center text-xs font-semibold text-slate-700 shadow-sm">
                    Sales Goal
                  </div>
                  <div className="w-28 rounded border-2 border-blue-500 bg-blue-600 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm ring-2 ring-blue-200 ring-offset-2">
                    Shared Hub
                  </div>
                  <div className="w-24 rounded border border-slate-200 bg-white px-3 py-1.5 text-center text-xs font-semibold text-slate-700 shadow-sm">
                    Mktg Goal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Recent Activity
            </h2>
            <div className="relative flex flex-col gap-5 before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-slate-200">
              {activities.map((activity, idx) => (
                <div key={idx} className="relative z-10 flex gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white ${activity.avatarColor}`}
                  >
                    {activity.icon ? (
                      <span className="material-symbols-outlined text-[16px]">
                        {activity.icon}
                      </span>
                    ) : (
                      activity.avatar
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    <div className="text-sm text-slate-700">
                      {activity.name ? (
                        <>
                          <span className="font-semibold">{activity.name}</span>{" "}
                          {activity.action}
                        </>
                      ) : (
                        activity.action
                      )}
                    </div>
                    {activity.isQuote ? (
                      <div className="mt-1 rounded border border-slate-100 bg-slate-50 p-2 text-sm italic text-slate-600">
                        {activity.detail}
                      </div>
                    ) : (
                      <div className="mt-0.5 text-sm text-slate-500">
                        {activity.detail}
                      </div>
                    )}
                    <div className="mt-1 text-xs font-semibold text-slate-400">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
