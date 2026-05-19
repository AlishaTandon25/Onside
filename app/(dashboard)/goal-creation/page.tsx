export default function NewGoalPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-600">
            <span>Goal Management</span>
            <span>›</span>
            <span>Drafts</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Create New Goal
          </h1>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
          <span className="flex items-center gap-2 font-medium text-blue-600">
            <span className="block h-2 w-2 rounded-full bg-blue-600" />
            Step 1: Details
          </span>
          <span>→</span>
          <span className="opacity-50">Step 2: Metrics</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Side */}
        <div className="space-y-6 lg:col-span-8">
          {/* Goal Details */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="absolute left-0 top-0 h-1 w-full bg-blue-600" />

            <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <span className="text-blue-600">📝</span>
              Goal Details
            </h2>

            <div className="space-y-5">
              {/* Thrust Area */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Thrust Area <span className="text-red-500">*</span>
                </label>

                <select className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                  <option value="">Select an organizational focus area</option>
                  <option>Revenue Growth</option>
                  <option>Customer Retention</option>
                  <option>Operational Efficiency</option>
                  <option>Product Innovation</option>
                </select>
              </div>

              {/* Goal Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Goal Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g., Increase Q3 Enterprise Renewals by 15%"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description & Success Criteria
                </label>

                <textarea
                  rows={4}
                  placeholder="Describe the specifics of achieving this goal and any dependencies..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </div>

          {/* Metrics & Measurement */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-slate-900">
              <span className="text-cyan-600">📊</span>
              Metrics & Measurement
            </h2>

            <div className="space-y-6">
              {/* Unit of Measurement */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Unit of Measurement
                </label>

                <div className="flex flex-wrap gap-3">
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-blue-600 bg-blue-50 px-4 py-2">
                    <input
                      type="radio"
                      name="uom"
                      defaultChecked
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-900">
                      Percentage (%)
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="uom"
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-900">
                      Numeric Value
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 hover:bg-slate-50">
                    <input
                      type="radio"
                      name="uom"
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-slate-900">
                      Timeline / Milestone
                    </span>
                  </label>
                </div>
              </div>

              {/* Target & Deadline */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Target Value
                  </label>

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="100"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 pr-10 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                      %
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Deadline
                  </label>

                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Weightage */}
              <div className="border-t border-slate-200 pt-5">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Goal Weightage
                </label>

                <p className="mb-3 text-sm text-slate-500">
                  Assign a relative importance to this goal within your overall
                  performance portfolio.
                </p>

                <div className="relative w-32">
                  <input
                    type="number"
                    defaultValue={15}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 pr-10 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="space-y-6 lg:col-span-4">
          {/* Total Weightage */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Total Weightage
              </h3>

              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                FY 2026
              </span>
            </div>

            <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full w-[70%] bg-blue-600" />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                <strong className="text-slate-900">70%</strong> allocated
              </span>
              <span className="text-cyan-600">
                <strong className="text-slate-900">30%</strong> remaining
              </span>
            </div>

            <p className="mt-4 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500">
              Total active goal weightage must equal 100% before the final
              performance review cycle locks.
            </p>
          </div>

          {/* AI Suggestion */}
          <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  ✨
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    AI Suggestion
                  </h3>

                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    Based on your role as{" "}
                    <span className="font-medium text-slate-900">
                      Senior Account Manager
                    </span>
                    , a goal focused on{" "}
                    <strong>'Customer Retention'</strong> may be highly relevant
                    this quarter.
                  </p>

                  <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Apply Suggestion →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end gap-4 border-t border-slate-200 pt-6 pb-8">
        <button className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50">
          Save Draft
        </button>

        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow hover:bg-blue-700">
          Submit for Approval
          <span>➜</span>
        </button>
      </div>
    </div>
  );
}