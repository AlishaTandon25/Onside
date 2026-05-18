"use client";

import { SettingsNav } from "@/components/settings/settings-nav";
import { usePathname } from "next/navigation";

const recommendedIntegrations = [
  {
    name: "Slack",
    category: "Communication",
    categoryColor: "text-blue-600 bg-blue-50",
    connected: true,
    description:
      "Receive real-time goal updates, nudge team members, and celebrate milestones directly in your channels.",
    logo: "tag",
  },
  {
    name: "Jira",
    category: "Project Mgmt",
    categoryColor: "text-blue-600 bg-blue-100",
    connected: false,
    description:
      "Automatically link Jira epics to Onside goals to track engineering velocity against OKRs.",
    logo: "bug_report",
  },
];

const allIntegrations = [
  {
    name: "Microsoft Teams",
    category: "Communication",
    description: "Sync goal progress into Teams chats.",
    connected: false,
    logo: "groups",
    logoColor: "text-indigo-600",
  },
  {
    name: "GitHub",
    category: "Development",
    description: "Link PRs to technical OKRs.",
    connected: false,
    logo: "code",
    logoColor: "text-slate-900",
  },
  {
    name: "Workday",
    category: "HRIS",
    description: "Import org structure and employee data.",
    connected: true,
    logo: "W",
    logoColor: "text-blue-800",
    isText: true,
  },
  {
    name: "BambooHR",
    category: "HRIS",
    description: "Sync user roles and reporting lines.",
    connected: false,
    logo: "B",
    logoColor: "text-green-700",
    isText: true,
  },
  {
    name: "Okta",
    category: "SSO",
    description: "Enable Single Sign-On for your org.",
    connected: true,
    logo: "O",
    logoColor: "text-blue-600",
    isText: true,
  },
];

export default function IntegrationsSettingsPage() {
  const pathname = usePathname();
  const basePath = pathname.replace(/\/settings.*/, "/settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your account preferences and platform configurations.
        </p>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <SettingsNav basePath={basePath} />

        {/* Settings Content */}
        <div className="flex w-full flex-1 flex-col gap-6">
          {/* Page Header */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Integrations
            </h2>
            <p className="mt-1 text-slate-500">
              Connect your favorite tools to sync goals, automate updates, and
              streamline your workflow.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Search integrations..."
                type="text"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {["All", "Communication", "Project Management", "HRIS"].map(
                (filter, i) => (
                  <button
                    key={filter}
                    className={`whitespace-nowrap rounded-lg border px-4 py-2 text-xs font-semibold transition-colors ${
                      i === 0
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Recommended Section */}
          <div>
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Recommended for you
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {recommendedIntegrations.map((item) => (
                <div
                  key={item.name}
                  className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-50/50" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                          <span className="material-symbols-outlined text-2xl text-slate-600">
                            {item.logo}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">
                            {item.name}
                          </h4>
                          <span
                            className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${item.categoryColor}`}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            item.connected ? "bg-green-500" : "bg-slate-300"
                          }`}
                        />
                        {item.connected ? "Connected" : "Not Connected"}
                      </span>
                    </div>

                    <p className="mb-4 text-sm text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative z-10 border-t border-slate-100 pt-4">
                    <button
                      className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        item.connected
                          ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          : "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                      }`}
                    >
                      {item.connected ? "Configure" : "Connect"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Integrations Grid */}
          <div>
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              All Integrations
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allIntegrations.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      {item.isText ? (
                        <span
                          className={`text-lg font-bold ${item.logoColor}`}
                        >
                          {item.logo}
                        </span>
                      ) : (
                        <span
                          className={`material-symbols-outlined ${item.logoColor}`}
                        >
                          {item.logo}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium leading-tight text-slate-900">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <p className="mb-4 flex-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                  <button
                    className={`w-full rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                      item.connected
                        ? "border border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    }`}
                  >
                    {item.connected ? "Configure" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
