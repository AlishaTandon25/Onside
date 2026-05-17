export default function AdminDashboardPage() {
  const departmentPerformance = [
    { name: "Sales", value: 94, color: "bg-blue-600" },
    { name: "Engineering", value: 88, color: "bg-blue-500" },
    { name: "HR", value: 82, color: "bg-cyan-500" },
    { name: "Finance", value: 79, color: "bg-cyan-400" },
    { name: "Operations", value: 65, color: "bg-amber-500" },
  ];

  const cycleSteps = [
    {
      name: "Goal Setting",
      dates: "Jan 1 - Jan 31",
      status: "Closed",
      state: "closed",
    },
    {
      name: "Q1 Review",
      dates: "Apr 1 - Apr 15",
      status: "Open",
      state: "active",
    },
    {
      name: "Q2 Review",
      dates: "Jul 1 - Jul 15",
      status: "Pending",
      state: "pending",
    },
    {
      name: "Annual Review",
      dates: "Dec 1 - Dec 31",
      status: "Pending",
      state: "pending",
    },
  ];

  const auditRows = [
    {
      timestamp: "Today, 10:42 AM",
      user: "Sarah Jenkins",
      action: "Force Approval",
      entity: "Goal ID #4928",
      status: "Success",
      statusType: "success",
    },
    {
      timestamp: "Today, 09:15 AM",
      user: "System Auto",
      action: "Cycle Transition",
      entity: "Q1 Review → Open",
      status: "Success",
      statusType: "success",
    },
    {
      timestamp: "Yesterday, 4:30 PM",
      user: "Mike Chen",
      action: "Role Modification",
      entity: "User ID #882",
      status: "Logged",
      statusType: "info",
    },
    {
      timestamp: "Yesterday, 2:05 PM",
      user: "API Integration",
      action: "Bulk Sync",
      entity: "HRIS Data",
      status: "Partial Fail",
      statusType: "error",
    },
  ];

  const heatmapCells = [
    "bg-blue-200",
    "bg-blue-300",
    "bg-blue-500",
    "bg-blue-600",
    "bg-blue-100",
    "bg-blue-200",
    "bg-blue-400",
    "bg-blue-600",
    "bg-red-200",
    "bg-red-300",
    "bg-blue-300",
    "bg-blue-500",
  ];

  function getStatusClasses(type: string) {
    switch (type) {
      case "success":
        return "bg-emerald-100 text-emerald-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Employees
          </p>
          <p className="mt-3 text-4xl font-bold text-slate-900">1,240</p>
          <p className="mt-2 text-sm text-blue-600">+24 this quarter</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Goals Submitted
          </p>
          <p className="mt-3 text-4xl font-bold text-slate-900">88%</p>
          <p className="mt-2 text-sm text-emerald-600">
            On Track vs 85% target
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Approval Rate
          </p>
          <p className="mt-3 text-4xl font-bold text-slate-900">92%</p>
          <div className="mt-3 h-2 rounded-full bg-slate-200">
            <div className="h-2 w-[92%] rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Q1 Completion
          </p>
          <p className="mt-3 text-4xl font-bold text-slate-900">74%</p>
          <p className="mt-2 text-sm text-amber-600">
            Requires attention
          </p>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm col-span-2 md:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
            Active Escalations
          </p>
          <p className="mt-3 text-4xl font-bold text-slate-900">12</p>
          <p className="mt-2 text-sm text-red-600">
            3 Critical requires action
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Side */}
        <div className="space-y-6 lg:col-span-2">
          {/* Trend Chart */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Goal Achievement Trend (QoQ)
              </h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View Details
              </button>
            </div>

            <div className="flex h-64 items-end justify-between gap-2">
              {[45, 60, 50, 80, 75, 92].map((value, index) => (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full items-end">
                    <div
                      className="w-full rounded-t bg-blue-600"
                      style={{ height: `${value * 2}px` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">
                    {["Q1 '23", "Q2 '23", "Q3 '23", "Q4 '23", "Q1 '24", "Current"][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Department Performance */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Dept Performance
              </h2>

              <div className="space-y-4">
                {departmentPerformance.map((dept, index) => (
                  <div key={`${dept.name}-${index}`}>
                    <div className="mb-1 flex justify-between text-sm text-slate-600">
                      <span>{dept.name}</span>
                      <span>{dept.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className={`h-2 rounded-full ${dept.color}`}
                        style={{ width: `${dept.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Heatmap */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Submission Heatmap
              </h2>

              <div className="grid grid-cols-4 gap-2">
                {heatmapCells.map((color, index) => (
                  <div
                    key={index}
                    className={`h-10 rounded ${color}`}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
                Open New Cycle
              </button>

              <button className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Export Global Report
              </button>

              <button className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Manage Roles
              </button>
            </div>
          </div>

          {/* Cycle Management */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Cycle Management
            </h2>

            <div className="space-y-5 border-l-2 border-slate-200 pl-6">
              {cycleSteps.map((step, index) => (
                <div key={`${step.name}-${index}`} className="relative">
                  <div
                    className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-4 border-white ${
                      step.state === "active"
                        ? "bg-blue-600"
                        : step.state === "closed"
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">
                        {step.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {step.dates}
                      </p>
                    </div>

                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        step.state === "active"
                          ? "bg-blue-600 text-white"
                          : step.state === "closed"
                          ? "bg-slate-100 text-slate-700"
                          : "border border-slate-300 text-slate-500"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Activity */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Audit Activity
          </h2>

          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-white text-left text-slate-500">
              <tr>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  Timestamp
                </th>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  User
                </th>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  Action
                </th>
                <th className="border-b border-slate-200 px-6 py-3 font-medium">
                  Entity
                </th>
                <th className="border-b border-slate-200 px-6 py-3 text-right font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {auditRows.map((row, index) => (
                <tr
                  key={`${row.timestamp}-${index}`}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-slate-500">
                    {row.timestamp}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {row.user}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {row.action}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {row.entity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(
                        row.statusType
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}