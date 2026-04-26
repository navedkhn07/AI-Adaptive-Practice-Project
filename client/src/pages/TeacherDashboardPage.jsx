import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { addTopic, getTopics, removeTopic } from "../api/topicApi";
import { getTeacherDashboard } from "../api/dashboardApi";
import LoadingSpinner from "../components/LoadingSpinner";

const TeacherDashboardPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [topics, setTopics] = useState([]);
  const [topicForm, setTopicForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dashboardData, topicData] = await Promise.all([getTeacherDashboard(), getTopics()]);
      setDashboard(dashboardData);
      setTopics(topicData.topics || []);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load teacher dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const onAddTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.name.trim()) return;
    try {
      await addTopic(topicForm);
      setTopicForm({ name: "", description: "" });
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add topic.");
    }
  };

  const onDeleteTopic = async (id) => {
    try {
      await removeTopic(id);
      await loadAll();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete topic.");
    }
  };

  if (loading) return <LoadingSpinner label="Loading class analytics..." />;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Teacher Dashboard</h1>

      <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Class Topic Performance</h2>
        <div className="mt-4 w-full overflow-x-auto">
          <BarChart width={720} height={288} data={dashboard?.topicHeatmap || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="accuracy" fill="#0891b2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Students Overview</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Sessions</th>
                <th className="px-2 py-2">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.students?.map((student) => (
                <tr key={student.id} className="border-b border-slate-100">
                  <td className="px-2 py-2">{student.name}</td>
                  <td className="px-2 py-2">{student.email}</td>
                  <td className="px-2 py-2">{student.sessions}</td>
                  <td className="px-2 py-2">{student.averageScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Manage Topics</h2>
        <form onSubmit={onAddTopic} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input
            className="input"
            placeholder="Topic name"
            value={topicForm.name}
            onChange={(e) => setTopicForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Description"
            value={topicForm.description}
            onChange={(e) => setTopicForm((prev) => ({ ...prev, description: e.target.value }))}
          />
          <button type="submit" className="btn-primary">Add Topic</button>
        </form>

        <div className="mt-4 space-y-2">
          {topics.map((topic) => (
            <div key={topic._id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
              <div>
                <p className="font-medium text-slate-900">{topic.name}</p>
                <p className="text-sm text-slate-600">{topic.description || "No description"}</p>
              </div>
              <button type="button" onClick={() => onDeleteTopic(topic._id)} className="rounded-lg bg-rose-50 px-3 py-1 text-sm text-rose-700">
                Remove
              </button>
            </div>
          ))}
        </div>
      </article>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </section>
  );
};

export default TeacherDashboardPage;
