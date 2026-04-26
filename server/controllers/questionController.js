const { generateQuestionsWithAI } = require("../services/aiService");
const QuestionSet = require("../models/QuestionSet");
const Topic = require("../models/Topic");

const generateQuestions = async (req, res) => {
  try {
    const { topic, topicId, topicDescription = "", difficulty = "easy", count = 5 } = req.body;

    let topicName = topic;
    let resolvedTopicId = topicId;
    let resolvedDescription = topicDescription;

    if (topicId) {
      const topicDoc = await Topic.findById(topicId);
      if (!topicDoc) {
        return res.status(404).json({ message: "Topic not found." });
      }
      topicName = topicDoc.name;
      resolvedTopicId = topicDoc._id;
      resolvedDescription = topicDoc.description || "";
    }

    if (!topicName) {
      return res.status(400).json({ message: "Topic is required." });
    }

    const generated = await generateQuestionsWithAI({
      topic: topicName,
      topicDescription: resolvedDescription,
      difficulty,
      count,
    });

    const questionSet = await QuestionSet.create({
      topic: topicName,
      topicId: resolvedTopicId,
      difficulty,
      count,
      questions: generated.questions,
      source: generated.source || "ai",
    });

    return res.json({
      questionSetId: questionSet._id,
      topic: topicName,
      difficulty,
      source: questionSet.source,
      questions: questionSet.questions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate questions.", error: error.message });
  }
};

module.exports = { generateQuestions };
