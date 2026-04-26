const express = require("express");
const { body, param } = require("express-validator");
const {
  startSession,
  submitAnswer,
  submitSession,
  getHistory,
} = require("../controllers/sessionController");
const { protect, authorize } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/start",
  protect,
  authorize("student"),
  [
    body("topicId").isMongoId().withMessage("Valid topicId is required."),
    body("count").optional().isInt({ min: 1, max: 20 }),
  ],
  validateRequest,
  startSession
);

router.post(
  "/answer",
  protect,
  authorize("student"),
  [
    body("sessionId").isMongoId(),
    body("questionId").isMongoId(),
    body("answer").isString().notEmpty(),
  ],
  validateRequest,
  submitAnswer
);

router.post(
  "/submit",
  protect,
  authorize("student"),
  [
    body("sessionId").isMongoId().withMessage("Valid sessionId is required."),
    body("answers").isArray({ min: 1 }).withMessage("Answers are required."),
    body("answers.*.questionId").isMongoId(),
    body("answers.*.answer").isString().notEmpty(),
  ],
  validateRequest,
  submitSession
);

router.get(
  "/history/:studentId",
  protect,
  [param("studentId").isMongoId().withMessage("Invalid student id.")],
  validateRequest,
  getHistory
);

module.exports = router;
