import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { getStudentDashboard } from "../api/dashboardApi";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStudentDashboard(user.id);
        setDashboard(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user.id]);

  if (loading) return <LoadingSpinner label="Loading your analytics..." />;
  if (!dashboard) return <p className="text-rose-600">{error || "Dashboard unavailable."}</p>;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Sessions" value={dashboard.stats.totalSessions} />
        <StatCard label="Average Score" value={`${dashboard.stats.averageScore}%`} />
        <StatCard label="Strongest Topic" value={dashboard.stats.strongestTopic} />
        <StatCard label="Weakest Topic" value={dashboard.stats.weakestTopic} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Score Over Time</h2>
          <div className="mt-4 w-full overflow-x-auto">
            <LineChart width={640} height={256} data={dashboard.scoreHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} />
            </LineChart>
          </div>
        </article>

        <article className="min-w-0 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Topic-wise Accuracy</h2>
          <div className="mt-4 w-full overflow-x-auto">
            <BarChart width={640} height={256} data={dashboard.topicPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="topic" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#0891b2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </div>
        </article>
      </div>

      <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Weak Topics (Last 3 Sessions Avg &lt; 50%)</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {dashboard.weakTopics.length > 0 ? (
            dashboard.weakTopics.map((topic) => (
              <span key={topic} className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800">
                {topic}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-600">No weak topics detected.</p>
          )}
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Activity Log</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Topic</th>
                <th className="px-2 py-2">Score</th>
                <th className="px-2 py-2">Accuracy</th>
                <th className="px-2 py-2">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.activityLog.map((row) => (
                <tr key={`${row.date}-${row.topic}`} className="border-b border-slate-100">
                  <td className="px-2 py-2">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-2 py-2">{row.topic}</td>
                  <td className="px-2 py-2">{row.score}/{row.totalQuestions}</td>
                  <td className="px-2 py-2">{row.accuracy}%</td>
                  <td className="px-2 py-2 uppercase">{row.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </section>
  );
};

export default StudentDashboardPage;
