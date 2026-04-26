const express = require("express");
const { body, param } = require("express-validator");
const { getTopics, createTopic, deleteTopic } = require("../controllers/topicController");
const { protect, authorize } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get("/", protect, getTopics);

router.post(
  "/",
  protect,
  authorize("teacher"),
  [
    body("name").trim().notEmpty().withMessage("Topic name is required."),
    body("description").optional().isString(),
  ],
  validateRequest,
  createTopic
);

router.delete(
  "/:id",
  protect,
  authorize("teacher"),
  [param("id").isMongoId().withMessage("Invalid topic id.")],
  validateRequest,
  deleteTopic
);

module.exports = router;
