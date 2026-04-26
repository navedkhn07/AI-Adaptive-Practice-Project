import { Link } from "react-router-dom";

const ResultsPage = () => {
  const raw = localStorage.getItem("latestResult");
  const result = raw ? JSON.parse(raw) : null;

  if (!result) {
    return (
      <section className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-slate-700">No recent result found.</p>
        <Link to="/student/home" className="btn-primary mt-4 inline-flex w-full sm:w-auto">Go to Practice</Link>
      </section>
    );
  }

  const { session, nextDifficulty } = result;

  return (
    <section className="space-y-6">
      <article className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
        <h1 className="text-2xl font-bold text-slate-900">Session Completed</h1>
        <p className="mt-1 text-slate-600">Topic: {session.topic}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-cyan-50 p-4">
            <p className="text-xs uppercase text-cyan-700">Score</p>
            <p className="text-2xl font-bold text-slate-900">{session.score}/{session.totalQuestions}</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-4">
            <p className="text-xs uppercase text-cyan-700">Accuracy</p>
            <p className="text-2xl font-bold text-slate-900">{session.accuracy}%</p>
          </div>
          <div className="rounded-xl bg-cyan-50 p-4">
            <p className="text-xs uppercase text-cyan-700">Next Difficulty</p>
            <p className="text-2xl font-bold uppercase text-slate-900">{nextDifficulty}</p>
          </div>
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Explanations</h2>
        <div className="mt-4 space-y-3">
          {session.questions.map((q) => (
            <div key={q._id} className="rounded-xl border border-slate-200 p-3">
              <p className="font-medium text-slate-900">{q.question}</p>
              <p className="mt-1 text-sm text-slate-700">Your answer: {q.studentAnswer || "Not answered"}</p>
              <p className="text-sm text-slate-700">Correct answer: {q.correct}</p>
              <p className="mt-1 text-sm text-cyan-700">{q.explanation}</p>
            </div>
          ))}
        </div>
      </article>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/student/home" className="btn-primary w-full sm:w-auto">Practice Again</Link>
        <Link to="/student/dashboard" className="btn-ghost w-full sm:w-auto">View Dashboard</Link>
      </div>
    </section>
  );
};

export default ResultsPage;
