"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const logoSrc =
  "https://lh3.googleusercontent.com/aida/ADBb0ujX_dM4o7NUbIQJ25JS7WCatA6qckellrU-o3Via4Nor4_asuA-FVkU9sUaVtMTfuSKBeUqp5NXTKltAxMKL9KpnGXwFtcTgYrOBlhVVgX6BVXXEb-jEpUWoc7upbFXvvH5ZoNrudl06LKEn4ftnXR1UBqo56MPY48Moe_L1_1wVV7T_AqcawQLr7ZS9slzYIMgRC_0w5mSAHkLwyoOF1Gzh3NfoTu8GFBAIdYrTuHh4TQW8vSeKoXAqCM";

const dashboardSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDy0PZVbhW_TrnmFCPfxKAUhnt2keL34DPRpo9_c4A6MYsLDegbk61Wk7U7Re2SljWuj2nUOE5Hjod7ydESeROrJNKwTyZ-JfZ3LJ398Z9irpd1-OQwSyJkvXd0aBHl38TRNbtNuHyxaVjdDBq5x3xRqkA8aIop_hJ7Kxmf8JLpjJxJte2JaSABTUW5lZOC25rGlRq6SWiU65D7xqQga0CeLlW_owOueZDlZ5zvfQfafnMM_ByZDnr2Acu_qizxxLLwWzws1GfkuJk";

const insightsSrc =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzxfIa7Ek0eTvvlUenAtkbtLGe-MOnPvk2guy0o9XTb_rKqfxaQFRm2PBmiRGmaZe7SIjWo9wFRi-BIUnhB0CmAWmHjUOjnmDh7vrrdNEbqGu_eoYw6RwNSWGdPiU4XZZ2xHliTdI9z6jg2PMObZ8Mf6B5EWDoFZ5XlOFsMka1kE3HOioQHaLYcra5sMnD1jwNnp4VPdZjwo7RPFrgmdRecdRY5TD2dWhKYzUkI_m_ANSNtqJqJHEl5pzDLZII7eWxgKjeapyAI4Y";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("landing-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("landing-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return (
    <div className={`landing-page ${theme} bg-background text-on-background font-body-md antialiased pt-20`}>
      <style>{landingStyles}</style>
      <nav className="bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-md fixed top-0 w-full border-b border-outline-variant/30 shadow-sm z-50 transition-all duration-200">
        <div className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
          <div className="flex items-center gap-4">
            <img
              alt="Onside Logo"
              className="w-10 h-10 object-contain rounded-md"
              src={logoSrc}
            />
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">
              Onside
            </span>
          </div>
          <ul className="hidden md:flex gap-8 items-center">
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:opacity-80" href="#">
                Product
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:opacity-80" href="#">
                Solutions
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:opacity-80" href="#">
                Pricing
              </a>
            </li>
            <li>
              <a className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md hover:opacity-80" href="#">
                Resources
              </a>
            </li>
          </ul>
          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-container-low transition-colors"
              aria-label="Toggle dark mode"
            >
              {mounted && theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" href="/login">
              Log In
            </Link>
            <Link className="font-label-md text-label-md bg-primary text-on-primary px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm" href="/login">
              Get Started
            </Link>
          </div>
          <button className="md:hidden text-on-surface p-2">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      <main>
        <section className="py-section-padding-md md:py-section-padding-lg px-gutter max-w-container-max mx-auto">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 space-y-6">
              <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface">
                Turn Ambition into Performance with AI-Powered Goals.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                The enterprise platform that aligns every team, predicts every blocker, and drives measurable growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link className="font-label-md text-label-md bg-primary text-on-primary px-8 py-4 rounded-lg hover:bg-primary-container transition-colors shadow-sm text-center" href="/login">
                  Get Started Free
                </Link>
                <a className="font-label-md text-label-md border border-primary text-primary px-8 py-4 rounded-lg hover:bg-surface-container-low transition-colors text-center flex items-center justify-center gap-2" href="#">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </a>
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(15,23,42,0.08)] border border-outline-variant bg-surface-container-lowest">
                <img
                  alt="Onside Dashboard Mockup"
                  className="w-full h-full object-cover"
                  data-alt="A clean, high-fidelity UI mockup of an enterprise SaaS dashboard. The interface is light and minimalist, featuring a sidebar, top navigation, and a main content area displaying data visualization charts in shades of primary blue (#2563eb). The style is modern corporate, emphasizing generous whitespace and sharp typography to convey a sense of 'Performance Intelligence'."
                  src={dashboardSrc}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-outline-variant/30 bg-surface-container-lowest">
          <div className="max-w-container-max mx-auto px-gutter text-center">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-8">
              Trusted by industry leaders
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
              <div className="h-8 w-32 bg-outline-variant/30 rounded"></div>
              <div className="h-8 w-32 bg-outline-variant/30 rounded"></div>
              <div className="h-8 w-32 bg-outline-variant/30 rounded"></div>
              <div className="h-8 w-32 bg-outline-variant/30 rounded hidden md:block"></div>
            </div>
          </div>
        </section>

        <section className="py-section-padding-md md:py-section-padding-lg px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4">
              Enterprise-grade alignment
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Everything you need to connect strategy to execution across thousands of employees.
            </p>
          </div>
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-shadow">
              <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined filled-symbol">insights</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                AI-Driven Insights
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6 max-w-lg">
                Proactive blocker detection algorithms analyze team velocity and project dependencies to flag risks before they impact your OKRs.
              </p>
              <div className="h-48 rounded-lg bg-surface-container-low border border-outline-variant/50 relative overflow-hidden">
                <img
                  alt="Insights Chart"
                  className="w-full h-full object-cover opacity-80"
                  data-alt="A stylized, abstract line chart showing predictive growth trends. The background is a soft light gray, with a vibrant primary blue (#2563eb) line sweeping upwards. Dotted secondary lines indicate predictive paths. The overall look is clean, analytical, and highly professional, fitting an enterprise performance dashboard."
                  src={insightsSrc}
                />
              </div>
            </div>
            <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-shadow">
              <div className="w-12 h-12 bg-secondary-fixed rounded-lg flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined filled-symbol">account_tree</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                Dynamic Alignment
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Connect individual daily work directly to top-level company OKRs. Ensure everyone knows how their tasks impact the bottom line.
              </p>
            </div>
            <div className="md:col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-[0_4px_20px_rgba(15,23,42,0.05)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-shadow flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-tertiary-fixed rounded-lg flex items-center justify-center text-tertiary mb-6">
                  <span className="material-symbols-outlined filled-symbol">admin_panel_settings</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-3">
                  Automated Governance
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Enterprise-grade security, comprehensive audit trails, and role-based access control built in. Keep your data secure while moving fast.
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="h-32 rounded-lg bg-surface-container-low border border-outline-variant/50 relative overflow-hidden flex items-center justify-center">
                  <span className="text-on-surface-variant font-label-sm">
                    Security Dashboard Visualization
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-padding-md bg-surface-container px-gutter">
          <div className="max-w-4xl mx-auto">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 md:p-12 shadow-[0_4px_20px_rgba(15,23,42,0.05)] text-center relative">
              <span className="material-symbols-outlined absolute top-8 left-8 text-outline-variant/30 text-6xl">
                format_quote
              </span>
              <p className="font-headline-lg text-headline-lg text-on-surface mb-8 relative z-10 leading-relaxed">
                &quot;Since implementing Onside, our engineering teams have improved sprint velocity by 25%. The predictive insights allowed us to realign resources before bottlenecks occurred.&quot;
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div className="text-left">
                  <p className="font-label-md text-label-md text-on-surface">
                    Sarah Jenkins
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    CTO, TechLogix
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-padding-lg bg-primary text-on-primary px-gutter text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-headline-xl text-headline-xl mb-6">
              Ready to align your organization?
            </h2>
            <p className="font-body-lg text-body-lg opacity-90 mb-10">
              Join thousands of enterprise leaders who trust Onside for Performance Intelligence.
            </p>
            <button className="bg-on-primary text-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-surface-container-low transition-colors shadow-lg">
              Book a Demo
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest dark:bg-inverse-surface border-t border-outline-variant w-full transition-colors duration-200">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-gutter py-section-padding-md px-gutter max-w-container-max mx-auto">
          <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <img
                alt="Onside Logo"
                className="w-8 h-8 object-contain rounded-md grayscale opacity-80"
                src={logoSrc}
              />
              <span className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">
                Onside
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              © 2026 Onside. All rights reserved.
            </p>
          </div>
          <FooterColumn title="Company" items={["About Us", "Careers"]} />
          <FooterColumn title="Product" items={["Features", "Pricing"]} />
          <FooterColumn title="Legal" items={["Privacy Policy", "Terms of Service"]} />
          <FooterColumn title="Social" items={["LinkedIn", "Twitter"]} />
        </div>
      </footer>
    </div>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="font-label-md text-label-md text-on-surface font-semibold mb-4">
        {title}
      </h4>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item}>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

const landingStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.landing-page.light {
  --surface-container-low: #f2f4f6;
  --primary-container: #2563eb;
  --inverse-on-surface: #eff1f3;
  --surface-variant: #e0e3e5;
  --inverse-surface: #2d3133;
  --tertiary-fixed: #d3e4fe;
  --surface-container: #eceef0;
  --on-primary: #ffffff;
  --background: #f7f9fb;
  --tertiary-fixed-dim: #b7c8e1;
  --primary-fixed: #dbe1ff;
  --secondary-fixed-dim: #bec6e0;
  --surface: #f7f9fb;
  --on-error-container: #93000a;
  --on-background: #191c1e;
  --surface-bright: #f7f9fb;
  --on-tertiary-fixed: #0b1c30;
  --surface-container-highest: #e0e3e5;
  --secondary: #565e74;
  --surface-dim: #d8dadc;
  --on-tertiary-container: #e9f0ff;
  --on-surface-variant: #434655;
  --on-surface: #191c1e;
  --primary: #004ac6;
  --surface-container-lowest: #ffffff;
  --secondary-fixed: #dae2fd;
  --on-secondary: #ffffff;
  --on-primary-container: #eeefff;
  --on-primary-fixed-variant: #003ea8;
  --tertiary: #46566c;
  --on-secondary-fixed: #131b2e;
  --on-tertiary: #ffffff;
  --tertiary-container: #5e6e85;
  --error-container: #ffdad6;
  --on-error: #ffffff;
  --surface-tint: #0053db;
  --on-primary-fixed: #00174b;
  --on-secondary-fixed-variant: #3f465c;
  --on-tertiary-fixed-variant: #38485d;
  --error: #ba1a1a;
  --on-secondary-container: #5c647a;
  --outline-variant: #c3c6d7;
  --surface-container-high: #e6e8ea;
  --inverse-primary: #b4c5ff;
  --outline: #737686;
  --primary-fixed-dim: #b4c5ff;
  --secondary-container: #dae2fd;
  min-height: 100vh;
}

.landing-page.dark {
  --surface-container-low: #1a1c1e;
  --primary-container: #1e3a8a;
  --inverse-on-surface: #191c1e;
  --surface-variant: #2d3133;
  --inverse-surface: #e0e3e5;
  --tertiary-fixed: #1e293b;
  --surface-container: #1e1e1e;
  --on-primary: #ffffff;
  --background: #0f1419;
  --tertiary-fixed-dim: #334155;
  --primary-fixed: #1e3a8a;
  --secondary-fixed-dim: #475569;
  --surface: #0f1419;
  --on-error-container: #ffdad6;
  --on-background: #e0e3e5;
  --surface-bright: #2d3133;
  --on-tertiary-fixed: #cbd5e1;
  --surface-container-highest: #2d3133;
  --secondary: #94a3b8;
  --surface-dim: #0a0d11;
  --on-tertiary-container: #1e293b;
  --on-surface-variant: #cbd5e1;
  --on-surface: #e0e3e5;
  --primary: #3b82f6;
  --surface-container-lowest: #0a0d11;
  --secondary-fixed: #1e293b;
  --on-secondary: #ffffff;
  --on-primary-container: #dbeafe;
  --on-primary-fixed-variant: #60a5fa;
  --tertiary: #94a3b8;
  --on-secondary-fixed: #cbd5e1;
  --on-tertiary: #ffffff;
  --tertiary-container: #475569;
  --error-container: #7f1d1d;
  --on-error: #ffffff;
  --surface-tint: #3b82f6;
  --on-primary-fixed: #dbeafe;
  --on-secondary-fixed-variant: #94a3b8;
  --on-tertiary-fixed-variant: #94a3b8;
  --error: #ef4444;
  --on-secondary-container: #cbd5e1;
  --outline-variant: #475569;
  --surface-container-high: #1e1e1e;
  --inverse-primary: #1e3a8a;
  --outline: #64748b;
  --primary-fixed-dim: #2563eb;
  --secondary-container: #1e293b;
  min-height: 100vh;
}

.landing-page {
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.landing-page, .landing-page .font-body-md, .landing-page .font-body-lg,
.landing-page .font-display-lg-mobile, .landing-page .font-headline-lg,
.landing-page .font-headline-xl, .landing-page .font-display-lg,
.landing-page .font-label-md, .landing-page .font-headline-md,
.landing-page .font-label-sm, .landing-page .font-headline-sm {
  font-family: Inter, sans-serif;
}

.landing-page .material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.landing-page .filled-symbol {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.landing-page .max-w-container-max { max-width: 1280px; }
.landing-page .px-gutter { padding-left: 24px; padding-right: 24px; }
.landing-page .gap-gutter { gap: 24px; }
.landing-page .py-section-padding-md { padding-top: 80px; padding-bottom: 80px; }
.landing-page .py-section-padding-lg { padding-top: 120px; padding-bottom: 120px; }

.landing-page .text-body-lg { font-size: 18px; line-height: 28px; font-weight: 400; }
.landing-page .text-body-md { font-size: 16px; line-height: 24px; font-weight: 400; }
.landing-page .text-display-lg-mobile { font-size: 40px; line-height: 48px; letter-spacing: -0.02em; font-weight: 700; }
.landing-page .text-headline-lg { font-size: 36px; line-height: 44px; letter-spacing: -0.01em; font-weight: 600; }
.landing-page .text-headline-xl { font-size: 48px; line-height: 56px; letter-spacing: -0.02em; font-weight: 600; }
.landing-page .text-display-lg { font-size: 60px; line-height: 72px; letter-spacing: -0.02em; font-weight: 700; }
.landing-page .text-label-md { font-size: 14px; line-height: 20px; letter-spacing: 0.01em; font-weight: 500; }
.landing-page .text-headline-md { font-size: 30px; line-height: 38px; font-weight: 600; }
.landing-page .text-label-sm { font-size: 12px; line-height: 16px; letter-spacing: 0.05em; font-weight: 600; }
.landing-page .text-headline-sm { font-size: 24px; line-height: 32px; font-weight: 600; }

@media (min-width: 768px) {
  .landing-page .md\\:py-section-padding-lg { padding-top: 120px; padding-bottom: 120px; }
  .landing-page .md\\:font-display-lg { font-family: Inter, sans-serif; }
  .landing-page .md\\:text-display-lg { font-size: 60px; line-height: 72px; letter-spacing: -0.02em; font-weight: 700; }
}

.landing-page .bg-background { background-color: var(--background); }
.landing-page .bg-surface\\/80 { background-color: rgb(247 249 251 / 0.8); }
.landing-page .bg-surface-container-lowest { background-color: var(--surface-container-lowest); }
.landing-page .bg-surface-container-low { background-color: var(--surface-container-low); }
.landing-page .bg-surface-container { background-color: var(--surface-container); }
.landing-page .bg-primary { background-color: var(--primary); }
.landing-page .bg-primary-fixed { background-color: var(--primary-fixed); }
.landing-page .bg-secondary-fixed { background-color: var(--secondary-fixed); }
.landing-page .bg-tertiary-fixed { background-color: var(--tertiary-fixed); }
.landing-page .bg-on-primary { background-color: var(--on-primary); }
.landing-page .bg-outline-variant\\/30 { background-color: rgb(195 198 215 / 0.3); }

.landing-page .text-on-background { color: var(--on-background); }
.landing-page .text-primary { color: var(--primary); }
.landing-page .text-on-primary { color: var(--on-primary); }
.landing-page .text-on-surface { color: var(--on-surface); }
.landing-page .text-on-surface-variant { color: var(--on-surface-variant); }
.landing-page .text-secondary { color: var(--secondary); }
.landing-page .text-tertiary { color: var(--tertiary); }
.landing-page .text-outline-variant\\/30 { color: rgb(195 198 215 / 0.3); }

.landing-page .border-primary { border-color: var(--primary); }
.landing-page .border-outline-variant { border-color: var(--outline-variant); }
.landing-page .border-outline-variant\\/30 { border-color: rgb(195 198 215 / 0.3); }
.landing-page .border-outline-variant\\/50 { border-color: rgb(195 198 215 / 0.5); }

.landing-page .hover\\:text-primary:hover { color: var(--primary); }
.landing-page .hover\\:bg-primary-container:hover { background-color: var(--primary-container); }
.landing-page .hover\\:bg-surface-container-low:hover { background-color: var(--surface-container-low); }

.landing-page.dark .bg-surface\\/80 { background-color: rgb(15 20 25 / 0.8); }
.landing-page.dark .bg-outline-variant\\/30 { background-color: rgb(71 85 105 / 0.3); }
.landing-page.dark .text-outline-variant\\/30 { color: rgb(71 85 105 / 0.3); }
.landing-page.dark .border-outline-variant\\/30 { border-color: rgb(71 85 105 / 0.3); }
.landing-page.dark .border-outline-variant\\/50 { border-color: rgb(71 85 105 / 0.5); }

/* Smooth transitions for all elements */
.landing-page * {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
`;