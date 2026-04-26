const mongoose = require("mongoose");

const studentProgressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },
    currentDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    averageAccuracy: {
      type: Number,
      default: 0,
    },
    lastSession: {
      type: Date,
      default: null,
    },
    recentQuestionHashes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

studentProgressSchema.index({ studentId: 1, topicId: 1 }, { unique: true });

module.exports = mongoose.model("StudentProgress", studentProgressSchema);
