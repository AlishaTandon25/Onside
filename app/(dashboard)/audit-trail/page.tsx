export default function AuditTrailPage() {
  const auditLogs = [
    {
      timestamp: "Oct 26, 14:22",
      user: "David Lee",
      avatar: "DL",
      avatarColor: "bg-cyan-500",
      isSystem: false,
      role: "Manager",
      entity: "Goal #452",
      action: "Weightage Update",
      actionColor: "bg-indigo-100 text-indigo-700 border border-indigo-200",
      oldValue: "15%",
      newValue: "20%",
    },
    {
      timestamp: "Oct 26, 11:05",
      user: "System AI",
      avatar: null,
      avatarColor: "bg-slate-200",
      isSystem: true,
      role: "System",
      entity: "Cycle #2",
      action: "Status Change",
      actionColor: "bg-blue-100 text-blue-700 border border-blue-200",
      oldValue: "Closed",
      newValue: "Open",
    },
    {
      timestamp: "Oct 25, 09:15",
      user: "Sarah Chen",
      avatar: "SC",
      avatarColor: "bg-teal-500",
      isSystem: false,
      role: "Director",
      entity: "Goal #489",
      action: "Goal Created",
      actionColor: "bg-cyan-100 text-cyan-700 border border-cyan-200",
      oldValue: "-",
      newValue: "New Entry",
    },
    {
      timestamp: "Oct 25, 08:30",
      user: "Marcus Johnson",
      avatar: "MJ",
      avatarColor: "bg-blue-600",
      isSystem: false,
      role: "Admin",
      entity: "User #1042",
      action: "Role Changed",
      actionColor: "bg-red-100 text-red-700 border border-red-200",
      oldValue: "Contributor",
      newValue: "Manager",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Audit Trail
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            System-wide log of user actions and automated events.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[16px]">
              download
            </span>
            CSV
          </button>
          <button className="flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[16px]">
              grid_on
            </span>
            Excel
          </button>
          <button className="flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[16px]">
              picture_as_pdf
            </span>
            PDF
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row">
        <div className="w-full lg:w-1/4">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Date Range
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
              calendar_today
            </span>
            <input
              className="w-full cursor-pointer rounded border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Last 30 Days"
              readOnly
              type="text"
              defaultValue="Oct 01 - Oct 31, 2023"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            User Search
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
              search
            </span>
            <input
              className="w-full rounded border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Name or ID"
              type="text"
            />
          </div>
        </div>
        <div className="w-full lg:w-1/4">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Action Type
          </label>
          <select className="w-full cursor-pointer appearance-none rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
            <option>All Actions</option>
            <option>Goal Created</option>
            <option>Weightage Changed</option>
            <option>Status Updated</option>
            <option>Role Changed</option>
          </select>
        </div>
        <div className="w-full lg:w-1/4">
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Department
          </label>
          <select className="w-full cursor-pointer appearance-none rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
            <option>All Departments</option>
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
          </select>
        </div>
        <button className="flex h-[38px] w-full shrink-0 items-center justify-center gap-2 rounded bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors lg:w-auto">
          <span className="material-symbols-outlined text-[16px]">
            filter_alt
          </span>
          Apply
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Entity
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Action
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Old Value
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  New Value
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {auditLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {log.timestamp}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${log.avatarColor}`}
                      >
                        {log.isSystem ? (
                          <span className="material-symbols-outlined text-[14px] text-slate-600">
                            smart_toy
                          </span>
                        ) : (
                          log.avatar
                        )}
                      </div>
                      <span
                        className={`font-medium text-slate-900 ${
                          log.isSystem ? "italic" : ""
                        }`}
                      >
                        {log.user}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {log.role}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-blue-600">
                    {log.entity}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${log.actionColor}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500 line-through">
                    {log.oldValue}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                    {log.newValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
          <p className="text-sm text-slate-500">
            Showing <span className="font-medium text-slate-900">1</span> to{" "}
            <span className="font-medium text-slate-900">4</span> of{" "}
            <span className="font-medium text-slate-900">1,240</span> results
          </p>
          <nav className="inline-flex -space-x-px rounded-md shadow-sm">
            <button className="inline-flex items-center rounded-l-md border border-slate-200 bg-white px-2 py-2 text-slate-500 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[16px]">
                chevron_left
              </span>
            </button>
            <button className="relative z-10 inline-flex items-center border border-blue-600 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
              1
            </button>
            <button className="inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
              3
            </button>
            <span className="inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
              ...
            </span>
            <button className="inline-flex items-center border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors">
              124
            </button>
            <button className="inline-flex items-center rounded-r-md border border-slate-200 bg-white px-2 py-2 text-slate-500 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[16px]">
                chevron_right
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
