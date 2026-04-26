const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const questionRoutes = require("./routes/questionRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
connectDB();

const app = express();
const clientDistPath = path.resolve(__dirname, "../client/dist");
const clientIndexPath = path.join(clientDistPath, "index.html");

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  if (fs.existsSync(clientIndexPath)) {
    res.sendFile(clientIndexPath);
    return;
  }

  res.type("html").send(`
    <h1>AdaptivePractice API</h1>
    <p>The server is running.</p>
    <ul>
      <li><a href="/api/health">/api/health</a></li>
    </ul>
  `);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "AdaptivePractice API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/dashboard", dashboardRoutes);

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(clientIndexPath);
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error.", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
