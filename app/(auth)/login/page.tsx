"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Target,
  Sparkles,
  BarChart3,
  Brain,
  Users,
  Shield,
  Sun,
  Moon,
  ArrowLeft,
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

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

    try {
      // Call demo login API that bypasses authentication
      const response = await fetch("/api/demo/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
        credentials: "include", // Ensure cookies are sent
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setDemoLoading(null);
        setFormError(data.error || "Demo login failed. Please try again.");
        return;
      }

      // Store demo session in localStorage as backup
      if (data.user) {
        localStorage.setItem("demo-session", JSON.stringify(data.user));
      }

      // Small delay to ensure cookie is set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force full page redirect to ensure cookies are read
      window.location.href = data.redirectUrl;
    } catch (error) {
      setDemoLoading(null);
      setFormError("Demo login failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white p-16">
        <div className="relative z-10 flex flex-col h-full">
          {/* Back to Main Page Button */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors mb-8 w-fit"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Back to Main Page</span>
          </Link>

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
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 lg:p-10 transition-colors">
            {/* Dark Mode Toggle - Top Right */}
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {mounted && theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </button>
            </div>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Please enter your details to access your
                dashboard.
              </p>
            </div>

            {/* Error Message */}
            {(formError || error) && (
              <div className="mb-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {formError || "Authentication failed."}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={
                      showPassword ? "text" : "password"
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400"
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
                <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  Remember for 30 days
                </label>

                <button
                  type="button"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
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
            </form>

            {/* Demo Access Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
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
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 flex items-center justify-center mb-2 transition-colors">
                    <Target className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {demoLoading === "EMPLOYEE" ? "Loading..." : "Employee"}
                  </span>
                </button>

                {/* Manager Demo Card */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("MANAGER")}
                  disabled={loading || demoLoading !== null}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 flex items-center justify-center mb-2 transition-colors">
                    <Users className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {demoLoading === "MANAGER" ? "Loading..." : "Manager"}
                  </span>
                </button>

                {/* Admin Demo Card */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin("ADMIN")}
                  disabled={loading || demoLoading !== null}
                  className="group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-600 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 flex items-center justify-center mb-2 transition-colors">
                    <Shield className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {demoLoading === "ADMIN" ? "Loading..." : "Admin"}
                  </span>
                </button>
              </div>

              <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                Click any role to instantly sign in with demo credentials
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <span className="text-blue-600 dark:text-blue-400 font-medium">
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
