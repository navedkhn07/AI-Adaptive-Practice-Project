import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { startSession, submitSingleAnswer, submitSession } from "../api/sessionApi";
import LoadingSpinner from "../components/LoadingSpinner";

const PracticePage = () => {
  const { topicId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedCount = Math.min(
    20,
    Math.max(1, Number(searchParams.get("count")) || 5)
  );

  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await startSession({ topicId, count: requestedCount });
        setSession(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to start practice.");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [topicId, requestedCount]);

  const question = useMemo(() => session?.questions?.[index], [session, index]);

  const onSelectAnswer = async (answer) => {
    if (!question || submitting) return;

    setAnswers((prev) => ({ ...prev, [question._id]: answer }));

    try {
      const data = await submitSingleAnswer({
        sessionId: session.sessionId,
        questionId: question._id,
        answer,
      });
      setFeedback((prev) => ({
        ...prev,
        [question._id]: data,
      }));
    } catch {
      setFeedback((prev) => ({
        ...prev,
        [question._id]: null,
      }));
    }
  };

  const onNext = () => {
    if (index < session.questions.length - 1) {
      setIndex((prev) => prev + 1);
    }
  };

  const onFinish = async () => {
    setSubmitting(true);
    try {
      const payload = {
        sessionId: session.sessionId,
        answers: session.questions.map((q) => ({
          questionId: q._id,
          answer: answers[q._id] || "",
        })),
      };

      const data = await submitSession(payload);
      localStorage.setItem("latestResult", JSON.stringify(data));
      navigate("/student/results");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit session.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Generating AI questions..." />;
  if (!session) return <p className="text-rose-600">{error || "Session not available."}</p>;

  const currentFeedback = question ? feedback[question._id] : null;
  const isLast = index === session.questions.length - 1;

  return (
    <section className="mx-auto w-full max-w-3xl rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-slate-700">Difficulty: <span className="uppercase text-cyan-700">{session.difficulty}</span></p>
        <p className="text-slate-500">Question {index + 1} / {session.questions.length}</p>
      </div>

      <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">{question.question}</h1>

      <div className="mt-5 space-y-3">
        {question.options.map((option) => {
          const active = answers[question._id] === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelectAnswer(option)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                active
                  ? "border-cyan-500 bg-cyan-50"
                  : "border-slate-200 hover:border-cyan-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {currentFeedback ? (
        <div className={`mt-4 rounded-xl p-3 text-sm ${currentFeedback.isCorrect ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
          <p className="font-semibold">{currentFeedback.isCorrect ? "Correct" : "Needs review"}</p>
          <p className="mt-1">{currentFeedback.explanation}</p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {!isLast ? (
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={onNext}>
            Next Question
          </button>
        ) : (
          <button type="button" className="btn-primary w-full sm:w-auto" onClick={onFinish} disabled={submitting}>
            {submitting ? "Submitting..." : "Finish Session"}
          </button>
        )}
      </div>
    </section>
  );
};

export default PracticePage;
