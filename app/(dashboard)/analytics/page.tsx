export default function AnalyticsPage() {
  const departments = [
    { name: "Sales", value: 92, color: "bg-emerald-500" },
    { name: "Engineering", value: 85, color: "bg-emerald-500" },
    { name: "Finance", value: 78, color: "bg-blue-600" },
    { name: "HR", value: 64, color: "bg-amber-500" },
    { name: "Operations", value: 42, color: "bg-red-500" },
  ];

  const quarterlyTrends = [
    { quarter: "Q1", value: 45, height: "40%", opacity: "bg-blue-200" },
    { quarter: "Q2", value: 73, height: "65%", opacity: "bg-blue-300" },
    { quarter: "Q3", value: 78, height: "80%", opacity: "bg-blue-500" },
    {
      quarter: "Q4 (Proj)",
      value: "85% proj",
      height: "90%",
      opacity: "bg-slate-200 border-t-2 border-slate-400 border-dashed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Analytics &amp; Insights
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Comprehensive view of organizational performance and goal tracking.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-1">
            <select className="cursor-pointer border-none bg-transparent py-1 pl-2 pr-8 text-xs font-semibold text-slate-900 focus:ring-0">
              <option>Q3 2026</option>
              <option>Q2 2026</option>
              <option>Q1 2026</option>
            </select>
            <div className="h-4 w-px bg-slate-200" />
            <select className="cursor-pointer border-none bg-transparent py-1 pl-2 pr-8 text-xs font-semibold text-slate-900 focus:ring-0">
              <option>All Depts</option>
              <option>Sales</option>
              <option>Engineering</option>
            </select>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Overall Achievement
            </span>
            <span className="material-symbols-outlined text-[20px] text-blue-600">
              monitoring
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold text-slate-900">78%</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span className="material-symbols-outlined text-[16px]">
              trending_up
            </span>
            <span>+5% vs Q2</span>
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: "78%" }}
            />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Goal Distribution
            </span>
            <span className="material-symbols-outlined text-[20px] text-cyan-600">
              pie_chart
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold text-slate-900">428</div>
          <div className="text-xs font-semibold text-slate-500">
            Active Goals
          </div>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full">
            <div
              className="bg-blue-600"
              style={{ width: "30%" }}
              title="Sales: 30%"
            />
            <div
              className="bg-cyan-600"
              style={{ width: "25%" }}
              title="Eng: 25%"
            />
            <div
              className="bg-indigo-600"
              style={{ width: "20%" }}
              title="Ops: 20%"
            />
            <div
              className="bg-slate-300"
              style={{ width: "25%" }}
              title="Other: 25%"
            />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Manager Effectiveness
            </span>
            <span className="material-symbols-outlined text-[20px] text-emerald-600">
              star
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold text-slate-900">
            8.4<span className="text-sm text-slate-500">/10</span>
          </div>
          <div className="text-xs font-semibold text-slate-500">
            Based on 1.2k check-ins
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-slate-200">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: "84%" }}
            />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl border border-slate-200 border-l-4 border-l-red-500 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              At-Risk Goals
            </span>
            <span className="material-symbols-outlined text-[20px] text-red-500">
              warning
            </span>
          </div>
          <div className="mb-1 text-2xl font-bold text-slate-900">12</div>
          <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
            <span className="material-symbols-outlined text-[16px]">
              trending_down
            </span>
            <span>Needs attention</span>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Most in Operations
          </div>
        </div>
      </div>

      {/* Main Charts Area - Bento Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart 1: Trend (Spans 2 cols) */}
        <div className="flex h-[400px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Achievement Trends
            </h3>
            <button className="rounded-md p-1 text-slate-500 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          </div>
          <div className="flex flex-1 items-end gap-4 border-b border-l border-slate-100 px-2 pb-2">
            {quarterlyTrends.map((q) => (
              <div
                key={q.quarter}
                className={`group relative w-1/4 rounded-t ${q.opacity}`}
                style={{ height: q.height }}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700 opacity-0 transition-opacity group-hover:opacity-100">
                  {q.value}
                  {typeof q.value === "number" ? "%" : ""}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-around text-xs font-semibold text-slate-500">
            {quarterlyTrends.map((q) => (
              <span key={q.quarter}>{q.quarter}</span>
            ))}
          </div>
        </div>

        {/* Chart 2: Completion by Dept */}
        <div className="flex h-[400px] flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Dept Completion
            </h3>
          </div>
          <div className="flex flex-1 flex-col justify-around">
            {departments.map((dept) => (
              <div key={dept.name}>
                <div className="mb-1 flex justify-between text-xs font-semibold">
                  <span className="text-slate-900">{dept.name}</span>
                  <span className="text-slate-500">{dept.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-200">
                  <div
                    className={`h-1.5 rounded-full ${dept.color}`}
                    style={{ width: `${dept.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
