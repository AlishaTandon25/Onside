"use client";

import { SettingsNav } from "@/components/settings/settings-nav";
import { usePathname } from "next/navigation";

export default function SettingsPage() {
  const pathname = usePathname();
  const basePath = pathname.replace(/\/settings.*/, "/settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your account preferences and system configuration.
        </p>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <SettingsNav basePath={basePath} />

        {/* Settings Content Canvas */}
        <div className="flex w-full flex-1 flex-col gap-6">
          {/* Profile Settings Card */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                Profile Settings
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Update your personal information and how others see you on the
                platform.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-200 bg-blue-100 text-2xl font-bold text-blue-600">
                    JD
                  </div>
                  <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">
                      edit
                    </span>
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="inline-flex items-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">
                      upload
                    </span>
                    Upload New Picture
                  </button>
                  <p className="text-xs font-semibold text-slate-400">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    type="text"
                    defaultValue="Jane Doe"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Email Address
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    type="email"
                    defaultValue="jane.doe@onside.com"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Job Title
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    type="text"
                    defaultValue="Senior Product Manager"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* System Preferences Card */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-4 border-b border-slate-200 pb-3">
              <h3 className="text-lg font-semibold text-slate-900">
                System Preferences
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Customize your platform experience and localization settings.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Language
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                      <option>English (United States)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      expand_more
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Timezone
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                      <option>(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                      <option>(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT+01:00) Paris</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">
                    Dark Mode
                  </h4>
                  <p className="text-sm text-slate-500">
                    Switch between light and dark themes.
                  </p>
                </div>
                <button className="relative flex h-6 w-11 items-center rounded-full bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="absolute left-1 h-4 w-4 rounded-full bg-white shadow transition-transform" />
                </button>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button className="rounded-lg border border-slate-200 bg-transparent px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
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
