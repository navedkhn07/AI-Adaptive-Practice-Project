const express = require("express");
const { body } = require("express-validator");
const { generateQuestions } = require("../controllers/questionController");
const { protect } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.post(
  "/generate",
  protect,
  [
    body("topic").optional().isString(),
    body("topicId").optional().isMongoId(),
    body("difficulty").isIn(["easy", "medium", "hard"]),
    body("count").optional().isInt({ min: 1, max: 20 }),
  ],
  validateRequest,
  generateQuestions
);

module.exports = router;
