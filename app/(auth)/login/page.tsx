"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Target,
  Sparkles,
  BarChart3,
  Brain,
  Users,
  Shield,
} from "lucide-react";

type DemoRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

const roleDashboard: Record<DemoRole, string> = {
  ADMIN: "/admin/dashboard",
  MANAGER: "/manager/dashboard",
  EMPLOYEE: "/employee/dashboard",
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const error = searchParams.get("error");

  const [selectedRole, setSelectedRole] =
    useState<DemoRole>("ADMIN");

  const [email, setEmail] = useState("admin@onside.ai");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<DemoRole | null>(null);
  const [formError, setFormError] = useState("");

  function selectRole(role: DemoRole) {
    setSelectedRole(role);

    switch (role) {
      case "EMPLOYEE":
        setEmail("employee@onside.ai");
        break;
      case "MANAGER":
        setEmail("manager@onside.ai");
        break;
      case "ADMIN":
        setEmail("admin@onside.ai");
        break;
    }

    setPassword("password123");
    setFormError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setFormError("");

    const destination =
      callbackUrl && callbackUrl !== "/"
        ? callbackUrl
        : roleDashboard[selectedRole];

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: destination,
    });

    setLoading(false);

    if (!result || result.error) {
      setFormError("Invalid email or password.");
      return;
    }

    router.replace(result.url ?? destination);
    router.refresh();
  }

  async function handleDemoLogin(role: DemoRole) {
    setDemoLoading(role);
    setFormError("");

    // Get credentials based on role
    const credentials = {
      EMPLOYEE: { email: "employee@onside.ai", password: "password123" },
      MANAGER: { email: "manager@onside.ai", password: "password123" },
      ADMIN: { email: "admin@onside.ai", password: "password123" },
    };

    const { email: demoEmail, password: demoPassword } = credentials[role];

    // Update visible form fields so users can see which credentials are being used
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSelectedRole(role);

    // Determine destination
    const destination =
      callbackUrl && callbackUrl !== "/"
        ? callbackUrl
        : roleDashboard[role];

    try {
      const result = await signIn("credentials", {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
        callbackUrl: destination,
      });

      setDemoLoading(null);

      if (!result || result.error) {
        setFormError("Invalid email or password.");
        return;
      }

      router.replace(result.url ?? destination);
      router.refresh();
    } catch (error) {
      setDemoLoading(null);
      setFormError("Authentication failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white p-16">
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Onside
            </span>
          </div>

          {/* Headline */}
          <div className="mt-12">
            <h1 className="text-6xl font-bold leading-tight tracking-tight">
              Align Goals.
              <br />
              Track Progress.
              <br />
              <span className="text-blue-100">
                Drive Performance.
              </span>
            </h1>
          </div>

          {/* Features */}
          <div className="mt-16 space-y-8 max-w-md">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">
                  AI-Powered Alignment
                </p>
                <p className="text-blue-100 text-sm">
                  Connect strategic objectives with measurable
                  outcomes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">
                  Real-time Tracking
                </p>
                <p className="text-blue-100 text-sm">
                  Monitor progress across employees and
                  departments.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">
                  Actionable Insights
                </p>
                <p className="text-blue-100 text-sm">
                  Identify risks and opportunities using AI.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-sm text-blue-100">
            Powered by Onside AI
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Welcome back
              </h2>
              <p className="text-slate-500">
                Please enter your details to access your
                dashboard.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => selectRole("EMPLOYEE")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selectedRole === "EMPLOYEE"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Employee
              </button>

              <button
                type="button"
                onClick={() => selectRole("MANAGER")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selectedRole === "MANAGER"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Manager
              </button>

              <button
                type="button"
                onClick={() => selectRole("ADMIN")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selectedRole === "ADMIN"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Admin
              </button>
            </div>

            {/* Error Message */}
            {(formError || error) && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {formError || "Authentication failed."}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-black placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-black placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                    onClick={() =>
                      setShowPassword((v) => !v)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me / Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-500">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  Remember for 30 days
                </label>

                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading || demoLoading !== null}
                className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>

              {/* Microsoft Sign-In */}
              <button
                type="button"
                disabled={loading || demoLoading !== null}
                className="w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Sign in with Microsoft
              </button>
            </form>

            {/* Demo Access Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">
                    DEMO ACCESS
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {/* Employee Demo Card */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("EMPLOYEE")}
                  disabled={loading || demoLoading !== null}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                    <Target className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {demoLoading === "EMPLOYEE" ? "Loading..." : "Employee"}
                  </span>
                </button>

                {/* Manager Demo Card */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("MANAGER")}
                  disabled={loading || demoLoading !== null}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                    <Users className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {demoLoading === "MANAGER" ? "Loading..." : "Manager"}
                  </span>
                </button>

                {/* Admin Demo Card */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("ADMIN")}
                  disabled={loading || demoLoading !== null}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                    <Shield className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">
                    {demoLoading === "ADMIN" ? "Loading..." : "Admin"}
                  </span>
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-slate-500">
                Click any role to instantly sign in with demo credentials
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <span className="text-blue-600 font-medium">
                Contact Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
