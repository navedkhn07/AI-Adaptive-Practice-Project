import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopics } from "../api/topicApi";
import TopicCard from "../components/TopicCard";
import LoadingSpinner from "../components/LoadingSpinner";

const StudentHomePage = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [practiceCount, setPracticeCount] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTopics();
        setTopics(data.topics || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load topics.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const onStart = (topic) => {
    navigate(`/student/practice/${topic._id}?count=${practiceCount}`);
  };

  if (loading) return <LoadingSpinner label="Loading available topics..." />;

  return (
    <section className="space-y-6">
      <div className="glass-panel rounded-2xl p-4 sm:p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Student Practice Hub</p>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">Choose a Topic</h1>
            <p className="mt-1 text-sm text-slate-600">Practice starts at your current adaptive difficulty for each topic.</p>
          </div>
          <div className="w-full sm:w-48">
            <label className="label">Questions to practice</label>
            <select
              className="input"
              value={practiceCount}
              onChange={(e) => setPracticeCount(Number(e.target.value))}
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-xl bg-white/80 p-3">
            <p className="text-slate-500">Current mode</p>
            <p className="font-semibold text-slate-800">Adaptive practice</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <p className="text-slate-500">Question count</p>
            <p className="font-semibold text-slate-800">{practiceCount} per session</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <p className="text-slate-500">Feedback style</p>
            <p className="font-semibold text-slate-800">Instant explanations</p>
          </div>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}

      {topics.length === 0 ? (
        <p className="rounded-xl border border-cyan-100 bg-white p-6 text-slate-600">No topics available yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <TopicCard key={topic._id} topic={topic} onStart={onStart} />
          ))}
        </div>
      )}
    </section>
  );
};

export default StudentHomePage;
