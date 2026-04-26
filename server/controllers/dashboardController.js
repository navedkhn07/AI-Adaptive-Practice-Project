const Session = require("../models/Session");
const StudentProgress = require("../models/StudentProgress");
const User = require("../models/User");

const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (req.user.role === "student" && req.user.id !== studentId) {
      return res.status(403).json({ message: "Forbidden." });
    }

    const sessions = await Session.find({ studentId, completed: true }).sort({ createdAt: 1 });

    const scoreHistory = sessions.map((s) => ({
      date: s.createdAt,
      score: s.accuracy,
      topic: s.topicName,
    }));

    const topicMap = new Map();
    sessions.forEach((s) => {
      const key = s.topicName;
      if (!topicMap.has(key)) {
        topicMap.set(key, { topic: key, correct: 0, total: 0, sessions: [] });
      }
      const item = topicMap.get(key);
      item.correct += s.score;
      item.total += s.totalQuestions;
      item.sessions.push(s.accuracy);
    });

    const topicPerformance = Array.from(topicMap.values()).map((t) => ({
      topic: t.topic,
      accuracy: t.total > 0 ? Number(((t.correct / t.total) * 100).toFixed(2)) : 0,
    }));

    const weakTopics = Array.from(topicMap.values())
      .filter((t) => {
        const lastThree = t.sessions.slice(-3);
        if (lastThree.length === 0) return false;
        const avg = lastThree.reduce((sum, n) => sum + n, 0) / lastThree.length;
        return avg < 50;
      })
      .map((t) => t.topic);

    const totalSessions = sessions.length;
    const averageScore =
      totalSessions > 0
        ? Number(
            (
              sessions.reduce((sum, s) => sum + s.accuracy, 0) /
              totalSessions
            ).toFixed(2)
          )
        : 0;

    const strongestTopic = topicPerformance.length
      ? [...topicPerformance].sort((a, b) => b.accuracy - a.accuracy)[0].topic
      : "N/A";

    const weakestTopic = topicPerformance.length
      ? [...topicPerformance].sort((a, b) => a.accuracy - b.accuracy)[0].topic
      : "N/A";

    const activityLog = [...sessions]
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((s) => ({
        date: s.createdAt,
        topic: s.topicName,
        score: s.score,
        totalQuestions: s.totalQuestions,
        accuracy: s.accuracy,
        difficulty: s.difficulty,
      }));

    return res.json({
      scoreHistory,
      topicPerformance,
      weakTopics,
      activityLog,
      stats: {
        totalSessions,
        averageScore,
        strongestTopic,
        weakestTopic,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch student dashboard.", error: error.message });
  }
};

const getTeacherDashboard = async (_req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email");

    const studentRows = await Promise.all(
      students.map(async (student) => {
        const sessions = await Session.find({ studentId: student._id, completed: true });
        const averageScore =
          sessions.length > 0
            ? Number(
                (
                  sessions.reduce((sum, s) => sum + s.accuracy, 0) /
                  sessions.length
                ).toFixed(2)
              )
            : 0;

        return {
          id: student._id,
          name: student.name,
          email: student.email,
          sessions: sessions.length,
          averageScore,
        };
      })
    );

    const allSessions = await Session.find({ completed: true });
    const heatmapMap = new Map();

    allSessions.forEach((s) => {
      const key = s.topicName;
      if (!heatmapMap.has(key)) {
        heatmapMap.set(key, { topic: key, totalCorrect: 0, totalQuestions: 0, sessions: 0 });
      }
      const item = heatmapMap.get(key);
      item.totalCorrect += s.score;
      item.totalQuestions += s.totalQuestions;
      item.sessions += 1;
    });

    const topicHeatmap = Array.from(heatmapMap.values()).map((item) => ({
      topic: item.topic,
      accuracy:
        item.totalQuestions > 0
          ? Number(((item.totalCorrect / item.totalQuestions) * 100).toFixed(2))
          : 0,
      sessions: item.sessions,
    }));

    const progressStates = await StudentProgress.find().populate("topicId", "name");

    return res.json({
      students: studentRows.sort((a, b) => b.averageScore - a.averageScore),
      topicHeatmap,
      activeProgressRecords: progressStates.length,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch teacher dashboard.", error: error.message });
  }
};

module.exports = { getStudentDashboard, getTeacherDashboard };
