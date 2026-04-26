const Topic = require("../models/Topic");

const getTopics = async (_req, res) => {
  try {
    const topics = await Topic.find().sort({ createdAt: -1 });
    return res.json({ topics });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch topics.", error: error.message });
  }
};

const createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;

    const exists = await Topic.findOne({ name: name.trim() });
    if (exists) {
      return res.status(409).json({ message: "Topic already exists." });
    }

    const topic = await Topic.create({
      name: name.trim(),
      description: description || "",
      createdBy: req.user.id,
    });

    return res.status(201).json({ message: "Topic added.", topic });
  } catch (error) {
    return res.status(500).json({ message: "Failed to add topic.", error: error.message });
  }
};

const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Topic.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Topic not found." });
    }

    return res.json({ message: "Topic removed." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to remove topic.", error: error.message });
  }
};

module.exports = { getTopics, createTopic, deleteTopic };
