export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Notifications
          </h1>
          <p className="mt-1 text-slate-600">
            Stay updated on goals, approvals, and team activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              done_all
            </span>
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button className="whitespace-nowrap rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            All
          </button>
          <button className="flex items-center gap-1 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Unread
            <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] text-white">
              12
            </span>
          </button>
          <button className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Mentions
          </button>
          <button className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            Goals
          </button>
          <button className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            System
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 items-start gap-6 pb-10 lg:grid-cols-12">
        {/* Left Column: Notification Feed */}
        <div className="flex flex-col gap-3 lg:col-span-8 xl:col-span-9">
          {/* Timeline Header */}
          <div className="mb-2 pl-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Today
          </div>

          {/* Notification: Goal Update (Unread) */}
          <div className="group relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-blue-300 transition-all">
            <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-blue-600" />
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    Sarah Chen
                  </span>{" "}
                  updated the progress on{" "}
                  <span className="cursor-pointer font-medium text-blue-600 hover:underline">
                    Q3 Enterprise Expansion
                  </span>
                  .
                </p>
                <span className="mt-1 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500">
                  2 mins ago
                </span>
              </div>

              {/* Embedded Info Card */}
              <div className="mt-3 flex w-full items-center gap-4 rounded-lg border border-slate-200/50 bg-slate-50 p-3 sm:w-fit">
                <div className="flex-1">
                  <div className="mb-1 text-xs font-semibold text-slate-400">
                    Progress update
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      75%
                    </span>
                  </div>
                </div>
                <div className="hidden h-8 w-px bg-slate-200 sm:block" />
                <p className="hidden text-sm italic text-slate-500 sm:block">
                  &quot;Secured 2 new pilot agreements.&quot;
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                  View Goal
                </button>
                <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Acknowledge
                </button>
              </div>
            </div>
          </div>

          {/* Notification: AI Insight (Unread) */}
          <div className="group relative flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-300 transition-all">
            <div className="absolute bottom-0 left-0 top-0 w-1 rounded-l-xl bg-indigo-600" />
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-indigo-600">
                    Onside AI
                  </span>{" "}
                  identified a potential blocker for your goal{" "}
                  <span className="cursor-pointer font-medium text-blue-600 hover:underline">
                    Reduce Churn Rate
                  </span>
                  .
                </p>
                <span className="mt-1 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500">
                  1 hour ago
                </span>
              </div>
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">
                Historical data suggests that customer support response times in
                the APAC region are trending upwards, which correlates strongly
                with churn in previous quarters.
              </p>
              <div className="mt-3 flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <button className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    bar_chart
                  </span>
                  View Analysis
                </button>
                <button className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          {/* Notification: Approval (Read) */}
          <div className="group flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white p-4 opacity-75 hover:opacity-100 transition-all">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500">
              <span className="material-symbols-outlined">fact_check</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Pending approval for{" "}
                  <span className="font-medium text-slate-700">
                    Q4 Budget Allocation
                  </span>{" "}
                  from{" "}
                  <span className="font-semibold text-slate-700">
                    Marcus Thompson
                  </span>
                  .
                </p>
                <span className="mt-1 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-400">
                  3 hours ago
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors">
                  Review Details
                </button>
                <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                  Remind Marcus
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Header */}
          <div className="mb-2 mt-4 pl-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Yesterday
          </div>

          {/* Notification: Mention (Read) */}
          <div className="group flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white p-4 opacity-75 hover:opacity-100 transition-all">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-blue-100 text-sm font-bold text-blue-700">
              DC
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">
                    David Chen
                  </span>{" "}
                  mentioned you in a comment on{" "}
                  <span className="font-medium text-slate-700">
                    Platform Redesign
                  </span>
                  .
                </p>
                <span className="mt-1 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-400">
                  Yesterday, 4:30 PM
                </span>
              </div>
              <div className="mt-2 border-l-2 border-slate-200 pl-4">
                <p className="text-sm italic text-slate-500">
                  &quot;@user, can you verify the new metrics integration on
                  the dashboard component?&quot;
                </p>
              </div>
              <div className="mt-3 flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                <button className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    reply
                  </span>
                  Reply
                </button>
              </div>
            </div>
          </div>

          {/* Load More */}
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 hover:border-blue-300 hover:bg-white hover:text-blue-600 transition-all">
            <span className="material-symbols-outlined text-[18px]">
              expand_more
            </span>
            Load Older Notifications
          </button>
        </div>

        {/* Right Column: Sidebar */}
        <div className="sticky top-6 flex flex-col gap-6 lg:col-span-4 xl:col-span-3">
          {/* Summary Card */}
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="pointer-events-none absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-2xl" />
            <h2 className="relative z-10 mb-4 text-lg font-semibold text-slate-900">
              Today&apos;s Activity
            </h2>
            <div className="relative z-10 grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200/50 bg-slate-50 p-3 text-center">
                <span className="text-4xl font-bold text-blue-600">4</span>
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  Goal Updates
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200/50 bg-slate-50 p-3 text-center">
                <span className="text-4xl font-bold text-indigo-600">1</span>
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  AI Insights
                </span>
              </div>
              <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-slate-200/50 bg-slate-50 p-3 text-center">
                <span className="text-xl font-semibold text-slate-900">
                  2 Pending
                </span>
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  Approvals require your attention
                </span>
                <button className="mt-2 w-full text-xs font-semibold text-blue-600 hover:underline">
                  Review Now
                </button>
              </div>
            </div>
          </div>

          {/* Settings Shortcuts */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-700">
              <span className="material-symbols-outlined text-[18px]">
                tune
              </span>
              Notification Settings
            </h3>
            <ul className="space-y-1">
              {[
                { icon: "mail", label: "Email Preferences" },
                { icon: "notifications_active", label: "Push Notifications" },
                { icon: "schedule", label: "Digest Schedule" },
              ].map((item) => (
                <li key={item.label}>
                  <button className="group flex w-full items-center justify-between rounded-md p-2 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-blue-600 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-sm text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <span className="material-symbols-outlined text-[16px] text-slate-300">
                      chevron_right
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
