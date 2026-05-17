"use client";

import { SettingsNav } from "@/components/settings/settings-nav";
import { usePathname } from "next/navigation";

const departments = [
  { icon: "domain", label: "All Departments", count: 142, active: true },
  { icon: "code", label: "Engineering", count: 48, active: false },
  { icon: "campaign", label: "Marketing", count: 24, active: false },
  { icon: "support_agent", label: "Customer Success", count: 35, active: false },
  { icon: "sell", label: "Sales", count: 35, active: false },
];

const teamMembers = [
  {
    name: "Elena Rodriguez",
    email: "elena.r@onside.inc",
    initials: "ER",
    role: "Admin",
    roleColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    department: "Executive",
    status: "Active",
    statusColor: "bg-green-500",
    action: "Edit Role",
  },
  {
    name: "Marcus Chen",
    email: "m.chen@onside.inc",
    initials: "MC",
    role: "Manager",
    roleColor: "bg-blue-50 text-blue-600 border-blue-200",
    department: "Engineering",
    status: "Active",
    statusColor: "bg-green-500",
    action: "Edit Role",
  },
  {
    name: "Sarah Jenkins",
    email: "s.jenkins@onside.inc",
    initials: "SJ",
    role: "Contributor",
    roleColor: "bg-slate-100 text-slate-600 border-slate-200",
    department: "Marketing",
    status: "Pending",
    statusColor: "bg-yellow-500",
    action: "Resend",
  },
];

export default function TeamManagementPage() {
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
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">
                  Settings
                </span>
                <span className="material-symbols-outlined text-[14px]">
                  chevron_right
                </span>
                <span className="text-slate-900">Team Management</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Team Management
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                Manage user access, roles, and departmental structure within the
                Onside platform.
              </p>
            </div>
            <button className="flex items-center gap-2 self-start whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors sm:self-auto">
              <span className="material-symbols-outlined text-[18px]">
                person_add
              </span>
              Invite Member
            </button>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left Sidebar (Departments) */}
            <div className="flex flex-col gap-4 lg:col-span-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">
                  Departments
                </h3>
                <div className="space-y-1">
                  {departments.map((dept) => (
                    <button
                      key={dept.label}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                        dept.active
                          ? "bg-blue-50 font-medium text-blue-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">
                          {dept.icon}
                        </span>
                        {dept.label}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] ${
                          dept.active
                            ? "border border-slate-200 bg-white text-slate-900"
                            : ""
                        }`}
                      >
                        {dept.count}
                      </span>
                    </button>
                  ))}
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">
                    add
                  </span>
                  Add Department
                </button>
              </div>

              {/* Seat Utilization Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Seat Utilization
                </h3>
                <div className="mb-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">142</span>
                  <span className="text-sm text-slate-500">/ 150</span>
                </div>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: "94%" }}
                  />
                </div>
                <p className="flex items-center gap-1 text-xs font-semibold text-red-600">
                  <span className="material-symbols-outlined text-[14px]">
                    warning
                  </span>
                  Approaching limit
                </p>
              </div>
            </div>

            {/* Main Content Area (Table) */}
            <div className="flex flex-col gap-4 lg:col-span-9">
              {/* Toolbar */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-slate-400">
                      filter_list
                    </span>
                    <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100">
                      <option>All Roles</option>
                      <option>Admin</option>
                      <option>Manager</option>
                      <option>Contributor</option>
                    </select>
                  </div>
                  <div className="relative flex-1 sm:w-48">
                    <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100">
                      <option>Active Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Showing 1-10 of 142</span>
                  <div className="ml-2 flex gap-1">
                    <button className="rounded border border-slate-200 p-1 hover:bg-slate-50 disabled:opacity-50">
                      <span className="material-symbols-outlined text-[16px]">
                        chevron_left
                      </span>
                    </button>
                    <button className="rounded border border-slate-200 p-1 hover:bg-slate-50">
                      <span className="material-symbols-outlined text-[16px]">
                        chevron_right
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50">
                        <th className="w-12 px-4 py-3 text-xs font-semibold text-slate-500">
                          <input
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            type="checkbox"
                          />
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Member
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Role
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Department
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {teamMembers.map((member) => (
                        <tr
                          key={member.email}
                          className="group transition-colors hover:bg-slate-50"
                        >
                          <td className="px-4 py-3">
                            <input
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              type="checkbox"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-600">
                                {member.initials}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">
                                  {member.name}
                                </p>
                                <p className="text-[12px] text-slate-500">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${member.roleColor}`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            {member.department}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-sm">
                              <span
                                className={`h-2 w-2 rounded-full ${member.statusColor}`}
                              />
                              <span
                                className={
                                  member.status === "Active"
                                    ? "text-slate-900"
                                    : "text-slate-500"
                                }
                              >
                                {member.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                              <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[12px] font-medium text-blue-600 hover:border-blue-300 transition-colors">
                                {member.action}
                              </button>
                              <button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">
                                  more_vert
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
