const Session = require("../models/Session");
const Topic = require("../models/Topic");
const QuestionSet = require("../models/QuestionSet");
const StudentProgress = require("../models/StudentProgress");
const crypto = require("crypto");
const { generateQuestionsWithAI, isMetaLearningQuestion } = require("../services/aiService");
const { getNextDifficulty } = require("../services/adaptiveService");

const RECENT_HASH_LIMIT = 200;
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "for",
  "to",
  "in",
  "on",
  "with",
  "is",
  "are",
  "from",
  "by",
  "at",
  "as",
  "be",
  "this",
  "that",
]);

const tokenize = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && w.length > 2 && !STOPWORDS.has(w));

const buildKeywords = (topicName, topicDescription) => {
  const raw = [...tokenize(topicName), ...tokenize(topicDescription)];
  const unique = [];
  raw.forEach((word) => {
    if (!unique.includes(word)) unique.push(word);
  });
  return unique.slice(0, 24);
};

const isRelevantToTopic = (question, topicName, topicDescription) => {
  if (isMetaLearningQuestion(question)) {
    return false;
  }

  const keywords = buildKeywords(topicName, topicDescription);
  if (keywords.length === 0) return true;

  const content = [question?.question, ...(question?.options || []), question?.explanation]
    .join(" ")
    .toLowerCase();

  const score = keywords.reduce((sum, word) => (content.includes(word) ? sum + 1 : sum), 0);
  const minScore = topicDescription ? 2 : 1;
  return score >= minScore;
};

const isValidQuestion = (question) =>
  Boolean(
    question &&
      typeof question.question === "string" &&
      typeof question.correct === "string" &&
      Array.isArray(question.options) &&
      question.options.length === 4
  );

const getQuestionHash = (question) => {
  const options = Array.isArray(question?.options)
    ? question.options.map((opt) => String(opt || "")).slice(0, 4)
    : [];

  return crypto
    .createHash("sha1")
    .update(`${String(question?.question || "")}::${String(question?.correct || "")}::${options.join("||")}`)
    .digest("hex");
};

const sampleUniqueQuestions = (questions, count) => {
  const uniqueMap = new Map();
  questions.filter(isValidQuestion).forEach((q) => {
    const key = `${q.question}::${q.correct}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, q);
    }
  });

  const unique = Array.from(uniqueMap.values());
  for (let i = unique.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }

  return unique.slice(0, count);
};

const excludeRecentQuestions = (questions, recentHashes = []) => {
  const blocked = new Set(recentHashes);
  return questions
    .filter(isValidQuestion)
    .filter((q) => !blocked.has(getQuestionHash(q)));
};

const getOrCreateProgress = async (studentId, topicId) => {
  let progress = await StudentProgress.findOne({ studentId, topicId });
  if (!progress) {
    progress = await StudentProgress.create({
      studentId,
      topicId,
      currentDifficulty: "easy",
      totalSessions: 0,
      averageAccuracy: 0,
    });
  }
  return progress;
};

const startSession = async (req, res) => {
  try {
    const { topicId, count = 5 } = req.body;
    const requestedCount = Number.isFinite(Number(count)) ? Number(count) : 5;
    const studentId = req.user.id;

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found." });
    }

    const progress = await getOrCreateProgress(studentId, topicId);

    const existingSets = await QuestionSet.find({
      topicId,
      difficulty: progress.currentDifficulty,
    }).select("questions source");

    const existingPool = existingSets
      .flatMap((set) => set.questions || [])
      .filter((q) => isRelevantToTopic(q, topic.name, topic.description || ""));
    const unseenPool = excludeRecentQuestions(existingPool, progress.recentQuestionHashes || []);
    let selectedQuestions = sampleUniqueQuestions(unseenPool, requestedCount);
    let source = "pool";
    let questionSetId = null;

    if (selectedQuestions.length < requestedCount) {
      const generated = await generateQuestionsWithAI({
        topic: topic.name,
        topicDescription: topic.description || "",
        difficulty: progress.currentDifficulty,
        count: requestedCount,
      });

      const questionSet = await QuestionSet.create({
        topic: topic.name,
        topicId,
        difficulty: progress.currentDifficulty,
        count: requestedCount,
        questions: generated.questions,
        source: generated.source || "ai",
      });

      questionSetId = questionSet._id;
      source = questionSet.source;

      const combined = [
        ...selectedQuestions,
        ...excludeRecentQuestions(questionSet.questions, progress.recentQuestionHashes || []),
      ];

      selectedQuestions = sampleUniqueQuestions(
        combined,
        requestedCount
      );

      if (selectedQuestions.length < requestedCount) {
        // If the unseen pool is exhausted, allow older items to fill the requested count.
        selectedQuestions = sampleUniqueQuestions(
          [...selectedQuestions, ...existingPool, ...questionSet.questions],
          requestedCount
        );
      }
    }

    const selectedHashes = selectedQuestions.map(getQuestionHash);
    const mergedRecentHashes = [
      ...selectedHashes,
      ...(progress.recentQuestionHashes || []).filter((h) => !selectedHashes.includes(h)),
    ].slice(0, RECENT_HASH_LIMIT);

    await StudentProgress.findByIdAndUpdate(progress._id, {
      $set: { recentQuestionHashes: mergedRecentHashes },
    });

    const session = await Session.create({
      studentId,
      topicId,
      topicName: topic.name,
      difficulty: progress.currentDifficulty,
      questions: selectedQuestions.map((q) => ({
        question: q.question,
        options: q.options,
        correct: q.correct,
        explanation: q.explanation,
      })),
      totalQuestions: selectedQuestions.length,
      questionSetId,
    });

    return res.status(201).json({
      sessionId: session._id,
      difficulty: session.difficulty,
      questions: session.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
      })),
      source,
    });
  } catch (error) {
    console.error("startSession error:", error);
    return res.status(500).json({ message: "Failed to start session.", error: error.message });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, answer } = req.body;
    const studentId = req.user.id;

    const session = await Session.findOne({ _id: sessionId, studentId });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    const question = session.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    question.studentAnswer = answer;
    question.isCorrect = answer === question.correct;
    await session.save();

    return res.json({
      isCorrect: question.isCorrect,
      correct: question.correct,
      explanation: question.explanation,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit answer.", error: error.message });
  }
};

const submitSession = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;
    const studentId = req.user.id;

    const session = await Session.findOne({ _id: sessionId, studentId });
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers array is required." });
    }

    const answerMap = new Map(answers.map((a) => [String(a.questionId), a.answer]));
    let score = 0;

    session.questions.forEach((question) => {
      const selected = answerMap.get(String(question._id)) || "";
      question.studentAnswer = selected;
      question.isCorrect = selected === question.correct;
      if (question.isCorrect) {
        score += 1;
      }
    });

    const accuracy = session.totalQuestions > 0 ? (score / session.totalQuestions) * 100 : 0;
    session.score = score;
    session.accuracy = Number(accuracy.toFixed(2));
    session.completed = true;
    await session.save();

    const progress = await getOrCreateProgress(studentId, session.topicId);
    const nextDifficulty = getNextDifficulty(progress.currentDifficulty, session.accuracy);

    const prevTotal = progress.totalSessions;
    const prevAvg = progress.averageAccuracy;
    const newTotal = prevTotal + 1;
    const newAvg = (prevAvg * prevTotal + session.accuracy) / newTotal;

    progress.currentDifficulty = nextDifficulty;
    progress.totalSessions = newTotal;
    progress.averageAccuracy = Number(newAvg.toFixed(2));
    progress.lastSession = new Date();
    await progress.save();

    return res.json({
      message: "Session submitted.",
      session: {
        id: session._id,
        topic: session.topicName,
        difficulty: session.difficulty,
        score: session.score,
        totalQuestions: session.totalQuestions,
        accuracy: session.accuracy,
        questions: session.questions,
      },
      nextDifficulty,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit session.", error: error.message });
  }
};

const getHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    const sessions = await Session.find({ studentId, completed: true })
      .sort({ createdAt: -1 })
      .select("topicName difficulty score totalQuestions accuracy createdAt");

    return res.json({ sessions });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch history.", error: error.message });
  }
};

module.exports = {
  startSession,
  submitAnswer,
  submitSession,
  getHistory,
};
