export default function ReportsPage() {
  const reportCards = [
    {
      icon: "monitoring",
      iconBg: "bg-blue-100 text-blue-600",
      title: "Quarterly Achievement Summary",
      description:
        "A comprehensive breakdown of OKR completion rates across all departments for Q3 2023.",
      lastGenerated: "Oct 12, 10:45 AM",
    },
    {
      icon: "fact_check",
      iconBg: "bg-cyan-100 text-cyan-700",
      title: "Team Completion Audit",
      description:
        "Detailed list of individual goal statuses, identifying bottlenecks in engineering teams.",
      lastGenerated: "Today, 08:30 AM",
    },
    {
      icon: "gavel",
      iconBg: "bg-red-100 text-red-700",
      title: "Escalation Rule History",
      description:
        "Log of all automatically triggered escalations for past-due mandatory compliance goals.",
      lastGenerated: "Oct 01, 11:00 PM",
    },
  ];

  const recentDownloads = [
    {
      name: "Global Goal Alignment V2",
      format: "XLSX",
      formatIcon: "description",
      formatColor: "text-emerald-700",
      date: "Today, 09:15 AM",
      status: "Ready",
      statusReady: true,
    },
    {
      name: "Q3 Performance Review Rollup",
      format: "PDF",
      formatIcon: "picture_as_pdf",
      formatColor: "text-red-600",
      date: "Yesterday, 14:30 PM",
      status: "Ready",
      statusReady: true,
    },
    {
      name: "Annual Compliance Audit 2023",
      format: "CSV",
      formatIcon: "csv",
      formatColor: "text-slate-500",
      date: "Processing...",
      status: "Generating",
      statusReady: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Reports
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Generate and download comprehensive performance data across teams and
          objectives.
        </p>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-1 sm:flex-row sm:items-center">
        <div className="flex gap-4 overflow-x-auto pb-2 sm:pb-0">
          <button className="whitespace-nowrap border-b-2 border-blue-600 px-1 pb-2 text-sm font-bold text-blue-600">
            All Reports
          </button>
          <button className="whitespace-nowrap px-1 pb-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Achievement
          </button>
          <button className="whitespace-nowrap px-1 pb-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Compliance
          </button>
          <button className="whitespace-nowrap px-1 pb-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
            System
          </button>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="flex items-center gap-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportCards.map((report) => (
          <div
            key={report.title}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Icon & Menu */}
            <div className="mb-3 flex items-start justify-between">
              <div
                className={`flex items-center justify-center rounded-lg p-2 ${report.iconBg}`}
              >
                <span className="material-symbols-outlined">
                  {report.icon}
                </span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>

            {/* Title & Description */}
            <h3 className="mb-1 text-lg font-semibold text-slate-900">
              {report.title}
            </h3>
            <p className="mb-6 flex-1 text-sm text-slate-600">
              {report.description}
            </p>

            {/* Footer */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                <span className="material-symbols-outlined text-[16px]">
                  update
                </span>
                Last generated: {report.lastGenerated}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  Preview
                </button>
                <button className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
                  Download
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_drop_down
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Downloads Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Downloads
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View All History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-4">Report Name</th>
                <th className="p-4">Format</th>
                <th className="p-4">Generated Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentDownloads.map((download) => (
                <tr
                  key={download.name}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                >
                  <td className="p-4 font-medium text-slate-900">
                    {download.name}
                  </td>
                  <td className="p-4 text-slate-500">
                    <div className="flex items-center gap-1">
                      <span
                        className={`material-symbols-outlined text-[16px] ${download.formatColor}`}
                      >
                        {download.formatIcon}
                      </span>
                      {download.format}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{download.date}</td>
                  <td className="p-4">
                    {download.statusReady ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <span className="material-symbols-outlined text-[14px]">
                          check_circle
                        </span>
                        Ready
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                        <span className="material-symbols-outlined animate-spin text-[14px]">
                          progress_activity
                        </span>
                        Generating
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      className={`text-sm font-medium ${
                        download.statusReady
                          ? "text-blue-600 hover:text-blue-700"
                          : "cursor-not-allowed text-slate-300"
                      }`}
                      disabled={!download.statusReady}
                    >
                      Download
                    </button>
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
