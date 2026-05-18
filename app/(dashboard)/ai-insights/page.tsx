export default function AIInsightsPage() {
  const chatMessages = [
    {
      role: "ai",
      content:
        "Hello! I'm your Onside AI assistant. I can analyze team performance, predict goal outcomes, and identify bottlenecks across your organization. How can I help you optimize your Q3 objectives today?",
    },
    {
      role: "user",
      content:
        "Why is the Sales department lagging behind their Q3 revenue targets?",
    },
    {
      role: "ai",
      content: null,
      richContent: true,
    },
  ];

  const suggestedQueries = [
    "Identify goal bottlenecks",
    "Predict Q4 completion",
    "Draft feedback for low performers",
  ];

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6 xl:flex-row">
      {/* Left: Chat Interface */}
      <section className="flex min-h-[500px] flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Chat Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <span className="material-symbols-outlined text-blue-600">
                auto_awesome
              </span>
              Onside AI Assistant
            </h2>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
              Analyzing Q3 2024 Data | All Departments
            </div>
          </div>
          <button className="rounded-lg border border-transparent p-2 text-slate-500 hover:border-slate-200 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-slate-50/50 p-6">
          {/* AI Welcome */}
          <div className="flex max-w-[85%] gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <span className="material-symbols-outlined text-[18px]">
                psychology
              </span>
            </div>
            <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-700">
                Hello! I&apos;m your Onside AI assistant. I can analyze team
                performance, predict goal outcomes, and identify bottlenecks
                across your organization. How can I help you optimize your Q3
                objectives today?
              </p>
            </div>
          </div>

          {/* User Query */}
          <div className="ml-auto flex max-w-[85%] flex-row-reverse gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              U
            </div>
            <div className="rounded-2xl rounded-tr-none bg-blue-600 p-4 text-white shadow-sm">
              <p className="text-sm">
                Why is the Sales department lagging behind their Q3 revenue
                targets?
              </p>
            </div>
          </div>

          {/* AI Response */}
          <div className="flex max-w-[85%] gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <span className="material-symbols-outlined text-[18px]">
                psychology
              </span>
            </div>
            <div className="space-y-3 rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-700">
                Based on the Q3 data, the Sales department is currently at{" "}
                <strong>64%</strong> of their target with 3 weeks remaining.
                I&apos;ve identified three primary factors causing the delay:
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>
                  <strong>Resource Allocation:</strong> The &apos;Enterprise
                  Pipeline&apos; goal is under-resourced by 2 FTEs compared to
                  Q2.
                </li>
                <li>
                  <strong>External Bottleneck:</strong> Lead qualification times
                  have increased by 40% due to the new CRM rollout.
                </li>
                <li>
                  <strong>Historical Trend:</strong> Sales typically closes 30%
                  of their quarterly revenue in the final two weeks.
                </li>
              </ul>
              <p className="text-sm text-slate-700">
                I&apos;ve generated a detailed Risk Analysis and Opportunity
                assessment in the panel to your right.
              </p>
            </div>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="shrink-0 border-t border-slate-200 bg-white px-6 py-3">
          <p className="mb-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
            <span className="material-symbols-outlined text-[14px]">
              lightbulb
            </span>
            Suggested Queries
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestedQueries.map((query) => (
              <button
                key={query}
                className="shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 border-t border-slate-200 bg-white p-6">
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <button className="shrink-0 p-2 text-slate-400 hover:text-blue-600 transition-colors">
              <span className="material-symbols-outlined">attach_file</span>
            </button>
            <textarea
              className="min-h-[40px] max-h-[120px] w-full resize-none border-none bg-transparent px-1 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0"
              placeholder="Ask AI about goals, risks, or team performance..."
              rows={1}
            />
            <button className="shrink-0 rounded-lg bg-blue-600 p-2 text-white shadow-sm hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-slate-400">
            AI can make mistakes. Verify important metrics before acting.
          </p>
        </div>
      </section>

      {/* Right: Interactive Analysis Panel */}
      <aside className="flex w-full shrink-0 flex-col gap-6 overflow-y-auto pb-6 xl:w-[400px] xl:pb-0">
        {/* Risk Prediction Widget */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="pointer-events-none absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full bg-red-50 blur-2xl" />
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Risk Prediction
              </h3>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                High Risk Goals
              </p>
            </div>
            <span className="material-symbols-outlined text-red-500">
              warning
            </span>
          </div>

          <div className="relative z-10 space-y-4">
            {/* Risk Item 1 */}
            <div className="rounded-lg border border-red-200 border-l-4 border-l-red-500 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  Enterprise Pipeline
                </span>
                <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                  At Risk
                </span>
              </div>
              <div className="mb-2 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{ width: "45%" }}
                />
              </div>
              <p className="text-[12px] leading-tight text-slate-500">
                Projected to miss Q3 target by $1.2M. Resource bottleneck
                identified in lead qualification.
              </p>
            </div>

            {/* Risk Item 2 */}
            <div className="rounded-lg border border-slate-200 border-l-4 border-l-cyan-500 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900">
                  Q3 Feature Launch
                </span>
                <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-700">
                  Delayed
                </span>
              </div>
              <div className="mb-2 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-cyan-500"
                  style={{ width: "72%" }}
                />
              </div>
              <p className="text-[12px] leading-tight text-slate-500">
                QA phase extended by 4 days. Unlikely to impact overall
                quarterly OKR.
              </p>
            </div>
          </div>

          <button className="relative z-10 mt-4 w-full rounded-lg border border-slate-200 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            View Full Risk Report
          </button>
        </div>

        {/* Opportunity / Action Card */}
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="pointer-events-none absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full bg-blue-50 blur-2xl" />
          <div className="relative z-10 mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                AI Suggestion
              </h3>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Resource Reallocation
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-600">
              trending_up
            </span>
          </div>

          <div className="relative z-10 mb-4 rounded-lg bg-slate-50 p-4">
            <p className="mb-3 text-sm text-slate-700">
              Shift 2 SDRs from &apos;SMB Outreach&apos; to &apos;Enterprise
              Pipeline&apos; to mitigate the $1.2M projected shortfall.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-red-500">
                  trending_down
                </span>
                SMB Growth (-2%)
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  trending_up
                </span>
                Ent. Pipeline (+14%)
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-2">
            <button className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors">
              Apply Draft
            </button>
            <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
