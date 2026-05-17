"use client";

import { SettingsNav } from "@/components/settings/settings-nav";
import { usePathname } from "next/navigation";

const notificationMatrix = [
  {
    category: "Goal Updates",
    items: [
      {
        label: "Goal Created",
        description: "When a new goal is assigned to you.",
        email: true,
        push: true,
        inApp: true,
      },
      {
        label: "Goal Status Updated",
        description: "When a tracked metric changes state.",
        email: false,
        push: true,
        inApp: true,
      },
    ],
  },
  {
    category: "Team Collaboration",
    items: [
      {
        label: "Comments & Mentions",
        description: "When someone @mentions you in a review.",
        email: true,
        push: true,
        inApp: true,
      },
    ],
  },
  {
    category: "System & Reminders",
    items: [
      {
        label: "Quarterly Deadlines",
        description: "Reminders to submit your reviews.",
        email: true,
        push: false,
        inApp: true,
      },
    ],
  },
];

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-slate-300"
      }`}
    >
      <div
        className={`absolute h-3 w-3 rounded-full bg-white shadow-sm transition-all ${
          enabled ? "right-1" : "left-1"
        }`}
      />
    </div>
  );
}

export default function NotificationSettingsPage() {
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
          {/* Notification Settings Header */}
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Notification Settings
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Control how and when you receive alerts from the Onside platform.
              Tailor your experience to minimize noise while staying informed on
              critical updates.
            </p>
          </div>

          {/* Global Preferences Card */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <span className="text-sm font-medium text-slate-900">
                Global Preferences
              </span>
              <p className="text-sm text-slate-500">
                Pause all non-critical notifications across all channels
                temporarily.
              </p>
            </div>
            <Toggle enabled={false} />
          </div>

          {/* Notification Matrix Card */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header Row */}
            <div className="grid grid-cols-12 items-center gap-4 border-b border-slate-200 bg-slate-50 p-4">
              <div className="col-span-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Activity Type
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="material-symbols-outlined text-[16px]">
                  mail
                </span>
                Email
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="material-symbols-outlined text-[16px]">
                  ad_units
                </span>
                Push
              </div>
              <div className="col-span-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <span className="material-symbols-outlined text-[16px]">
                  laptop_mac
                </span>
                In-App
              </div>
            </div>

            <div className="flex flex-col">
              {notificationMatrix.map((group, gi) => (
                <div key={group.category}>
                  {/* Category Header */}
                  <div
                    className={`border-b border-slate-100 bg-slate-50/50 px-4 py-2 ${
                      gi > 0 ? "mt-2 border-t" : ""
                    }`}
                  >
                    <h3 className="text-sm font-medium text-slate-900">
                      {group.category}
                    </h3>
                  </div>

                  {/* Items */}
                  {group.items.map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-12 items-center gap-4 border-b border-slate-100 p-4 transition-colors hover:bg-slate-50/50"
                    >
                      <div className="col-span-6 flex flex-col">
                        <span className="text-sm font-medium text-slate-900">
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.description}
                        </span>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Toggle enabled={item.email} />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Toggle enabled={item.push} />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <Toggle enabled={item.inApp} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button className="rounded-lg px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
