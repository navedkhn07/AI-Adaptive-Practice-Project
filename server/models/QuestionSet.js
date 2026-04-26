const mongoose = require("mongoose");

const generatedQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4,
        message: "Each MCQ must have exactly 4 options.",
      },
      required: true,
    },
    correct: { type: String, required: true },
    explanation: { type: String, default: "" },
  },
  { _id: true }
);

const questionSetSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    count: { type: Number, required: true, min: 1, max: 20 },
    questions: { type: [generatedQuestionSchema], required: true },
    source: {
      type: String,
      enum: ["ai", "fallback"],
      default: "ai",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("QuestionSet", questionSetSchema);
