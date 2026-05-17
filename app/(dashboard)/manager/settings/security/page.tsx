"use client";

import { SettingsNav } from "@/components/settings/settings-nav";
import { usePathname } from "next/navigation";

export default function SecuritySettingsPage() {
  const pathname = usePathname();
  const basePath = pathname.replace(/\/settings.*/, "/settings");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>
        <p className="mt-1 text-slate-600">
          Manage your account preferences and security configurations.
        </p>
      </div>

      <div className="flex flex-col items-start gap-6 lg:flex-row">
        <SettingsNav basePath={basePath} />

        {/* Settings Content */}
        <div className="flex w-full flex-1 flex-col gap-6 max-w-3xl">
          {/* Password Section */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Password</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ensure your account is using a long, random password to stay
                secure.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400">
                  password
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    Current Password
                  </p>
                  <p className="text-sm text-slate-500">
                    Last changed 3 months ago
                  </p>
                </div>
              </div>
              <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors">
                Change Password
              </button>
            </div>
          </section>

          {/* Two-Factor Authentication Section */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Two-Factor Authentication
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add additional security to your account using two-factor
                  authentication.
                </p>
              </div>
              <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                Enabled
              </span>
            </div>

            <div className="space-y-4">
              {/* Authenticator App */}
              <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-blue-600">
                    smartphone
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Authenticator App
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      Use an authenticator app to generate one time security
                      codes.
                    </p>
                  </div>
                </div>
                <button className="self-start rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors sm:self-center">
                  Configured
                </button>
              </div>

              {/* SMS Recovery */}
              <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 opacity-70 sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-slate-400">
                    sms
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      SMS Recovery
                    </p>
                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                      Receive recovery codes via SMS if you lose access to your
                      authenticator app.
                    </p>
                  </div>
                </div>
                <button className="self-start rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors sm:self-center">
                  Set Up
                </button>
              </div>
            </div>
          </section>

          {/* Active Sessions Section */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Active Sessions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Manage and log out your active sessions on other browsers and
                  devices.
                </p>
              </div>
              <button className="whitespace-nowrap rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                Log Out All Other
              </button>
            </div>

            <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {/* Current Session */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined">
                      laptop_mac
                    </span>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-medium text-slate-900">
                      MacBook Pro
                      <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        This Device
                      </span>
                    </p>
                    <p className="text-sm text-slate-500">
                      San Francisco, USA • Active now
                    </p>
                  </div>
                </div>
              </div>

              {/* Other Session */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <span className="material-symbols-outlined">
                      phone_iphone
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      iPhone 15
                    </p>
                    <p className="text-sm text-slate-500">
                      London, UK • 2 hours ago
                    </p>
                  </div>
                </div>
                <button className="rounded-lg p-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                  Log Out
                </button>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button className="rounded-lg px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
