const express = require("express");
const { param } = require("express-validator");
const {
  getStudentDashboard,
  getTeacherDashboard,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

router.get(
  "/student/:id",
  protect,
  [param("id").isMongoId().withMessage("Invalid student id.")],
  validateRequest,
  getStudentDashboard
);

router.get("/teacher", protect, authorize("teacher"), getTeacherDashboard);

module.exports = router;
