export default function QuarterlyUpdatesPage() {
  const previousQuarters = [
    {
      quarter: "Q2 2024",
      status: "Completed",
      summary:
        "Achieved $1.2M vs $1.0M target. Expanded into UK market successfully.",
    },
    {
      quarter: "Q1 2024",
      status: "Completed",
      summary:
        "Achieved $800k vs $750k target. Foundation laid for enterprise sales team.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Quarterly Updates - Q3 2024
        </h1>
        <p className="mt-2 text-slate-600">
          Record your progress and submit achievement updates for manager review.
        </p>
      </div>

      {/* Goal Selection */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Select Active Goal
        </label>
        <select className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:w-1/2 lg:w-1/3">
          <option>Expand Enterprise Client Base</option>
          <option>Launch New Partner Portal</option>
          <option>Reduce Cloud Infrastructure Costs by 15%</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Form Area */}
        <div className="space-y-6 xl:col-span-2">
          {/* Goal Overview Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Thrust Area: Market Growth
                </p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Expand Enterprise Client Base
                </h2>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                📈 Q3 Active
              </span>
            </div>

            {/* KPI Cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Planned Target
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  $2.0M
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actual Achievement (QTD)
                </p>
                <p className="mt-2 text-4xl font-bold text-blue-600">
                  $1.7M
                </p>
                <p className="mt-1 text-sm text-emerald-600">
                  ↑ 85% of target
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm font-medium text-slate-500">
                <span>Progress</span>
                <span>85%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[85%] rounded-full bg-blue-600" />
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold text-slate-900">
              Update Q3 Progress
            </h3>

            {/* Two-column fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Actual Achievement */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actual Achievement
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="text"
                    defaultValue="1,700,000"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2 px-4 pl-8 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Completion Date */}
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Completion Date
                </label>
                <input
                  type="date"
                  defaultValue="2024-09-30"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 px-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </label>
              <select 
                defaultValue="On Track"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 md:w-1/2">
                <option>Not Started</option>
                <option>On Track</option>
                <option>Behind</option>
                <option>Completed</option>
              </select>
            </div>

            {/* Self Comment */}
            <div className="mt-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Self-Comment
              </label>
              <textarea
                rows={4}
                placeholder="Detail your achievements, blockers, and next steps..."
                className="w-full rounded-lg border border-slate-300 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">
                Save Draft
              </button>

              <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow hover:bg-blue-700">
                Submit Update
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Previous Quarters */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Previous Quarters
            </h3>

            <div className="space-y-4">
              {previousQuarters.map((item, index) => (
                <div
                  key={`${item.quarter}-${index}`}
                  className="border-l-2 border-slate-300 pl-4"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900">
                      {item.quarter}
                    </span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Manager Feedback */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Manager Feedback
            </h3>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 text-xs font-bold text-white">
                  SM
                </div>

                <div>
                  <p className="font-medium text-slate-900">
                    Sarah Miller
                  </p>
                  <p className="text-xs text-slate-500">
                    VP of Sales • Oct 2
                  </p>
                </div>
              </div>

              <p className="italic text-slate-600">
                "Great momentum in the Northeast region. Keep it up!
                Let's make sure we clearly document any blockers moving
                into the final stretch of Q3."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}