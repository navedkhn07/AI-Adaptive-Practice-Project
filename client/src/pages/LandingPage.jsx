import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-cyan-100/80 bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-5 shadow-xl shadow-cyan-100/60 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -left-20 -top-16 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
          <div className="fade-lift">
            <p className="mb-4 inline-flex rounded-full bg-cyan-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">
              AI-powered adaptive learning
            </p>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Study smarter.
              <span className="block bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
                Improve faster.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
              AdaptivePractice generates fresh topic-based questions, evaluates responses instantly,
              and adjusts difficulty based on student performance so every practice session feels personal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/register" className="btn-primary w-full sm:w-auto">
                Start Practicing
              </Link>
              <Link to="/login" className="btn-ghost w-full sm:w-auto">
                Continue Learning
              </Link>
            </div>
            <div className="mt-7 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-xl border border-cyan-100 bg-white/80 p-3">
                <p className="text-xs uppercase tracking-wider text-cyan-700">Adaptive Engine</p>
                <p className="mt-1 font-semibold text-slate-800">Difficulty shifts as you improve</p>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-white/80 p-3">
                <p className="text-xs uppercase tracking-wider text-cyan-700">Progress Analytics</p>
                <p className="mt-1 font-semibold text-slate-800">Track weak and strong topics</p>
              </div>
              <div className="rounded-xl border border-cyan-100 bg-white/80 p-3">
                <p className="text-xs uppercase tracking-wider text-cyan-700">Teacher Insights</p>
                <p className="mt-1 font-semibold text-slate-800">Class-level performance view</p>
              </div>
            </div>
          </div>

          <div className="float-y rounded-2xl border border-cyan-100 bg-white/85 p-4 shadow-lg shadow-cyan-100/70 backdrop-blur-sm sm:p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">Today&apos;s Practice Snapshot</p>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Improving
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Current topic</p>
                <p className="font-semibold text-slate-800">Data Structures</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Adaptive level</p>
                <p className="font-semibold uppercase text-cyan-700">Medium -&gt; Hard</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-slate-500">Session trend</p>
                <p className="font-semibold text-slate-800">+18% accuracy over last 5 sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Dynamic MCQs", text: "Fresh AI-generated questions by topic and level." },
          { title: "No Repetition", text: "Avoids serving the same questions repeatedly." },
          { title: "Instant Feedback", text: "Explanations appear right after each answer." },
          { title: "Actionable Dashboard", text: "See weak topics and progress over time." },
        ].map((item) => (
          <article key={item.title} className="glass-panel fade-lift rounded-2xl p-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LandingPage;
