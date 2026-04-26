const axios = require("axios");
const { buildFallbackQuestions } = require("../utils/sampleQuestions");

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "of",
  "for",
  "to",
  "in",
  "on",
  "with",
  "is",
  "are",
  "from",
  "by",
  "at",
  "as",
  "be",
  "this",
  "that",
]);

const LETTER_TO_INDEX = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
};

const META_LEARNING_PATTERNS = [
  /structured academic concept/i,
  /concept-focused practice/i,
  /review of errors/i,
  /studying only one time/i,
  /mastery/i,
  /progress over sessions/i,
  /indicator of progress/i,
  /answering quickly without checking correctness/i,
  /focusing only on easy questions/i,
  /studying/i,
  /exam/i,
  /sessions/i,
  /accuracy/i,
  /learning strategy/i,
];

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const shuffleQuestionOptions = (question) => {
  const options = shuffle(question.options);
  return {
    ...question,
    options,
    correct: question.correct,
  };
};

const stripOptionPrefix = (value) => {
  const text = String(value || "").trim();
  return text.replace(/^[A-D][\).:\-]\s*/i, "").trim();
};

const parseJsonFromText = (value) => {
  if (!value) return null;

  const raw = String(value).trim();
  try {
    return JSON.parse(raw);
  } catch (_err) {
    // Try extracting JSON from fenced blocks or mixed text.
  }

  const fenced = raw.match(/```json\s*([\s\S]*?)```/i) || raw.match(/```\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch (_err) {
      // Continue to brace slicing fallback.
    }
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) {
    const candidate = raw.slice(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (_err) {
      return null;
    }
  }

  return null;
};

const resolveCorrectAnswer = (rawCorrect, options) => {
  if (!rawCorrect || !Array.isArray(options) || options.length !== 4) {
    return "";
  }

  const cleaned = String(rawCorrect).trim();
  const upper = cleaned.toUpperCase();

  if (Object.prototype.hasOwnProperty.call(LETTER_TO_INDEX, upper)) {
    return options[LETTER_TO_INDEX[upper]] || "";
  }

  const cleanedText = stripOptionPrefix(cleaned);
  const match = options.find((opt) => stripOptionPrefix(opt).toLowerCase() === cleanedText.toLowerCase());
  return match || cleanedText;
};

const tokenize = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && w.length > 2 && !STOPWORDS.has(w));

const buildRelevanceKeywords = (topic, topicDescription) => {
  const words = [...tokenize(topic), ...tokenize(topicDescription)];
  const unique = [];
  words.forEach((word) => {
    if (!unique.includes(word)) unique.push(word);
  });
  return unique.slice(0, 20);
};

const relevanceScore = (question, keywords) => {
  const content = [question.question, ...(question.options || []), question.explanation]
    .join(" ")
    .toLowerCase();

  return keywords.reduce((score, keyword) => (content.includes(keyword) ? score + 1 : score), 0);
};

const filterRelevantQuestions = (questions, topic, topicDescription) => {
  const keywords = buildRelevanceKeywords(topic, topicDescription);
  if (keywords.length === 0) return questions;

  return questions.filter((q) => relevanceScore(q, keywords) >= 1);
};

const isMetaLearningQuestion = (question) => {
  const content = [question?.question, ...(question?.options || []), question?.explanation]
    .join(" ")
    .toLowerCase();

  return META_LEARNING_PATTERNS.some((pattern) => pattern.test(content));
};

const getDifficultyGuidance = (difficulty) => {
  if (difficulty === "easy") {
    return "Focus on foundational definitions, basic concepts, and straightforward recall-level MCQs.";
  }
  if (difficulty === "medium") {
    return "Focus on conceptual understanding, comparisons, and moderate application scenarios.";
  }
  return "Focus on advanced application, scenario-based reasoning, and deeper conceptual nuance.";
};

const normalizeQuestions = (data, count) => {
  const list = Array.isArray(data?.questions) ? data.questions : [];

  return list
    .slice(0, count)
    .map((item) => {
      const options = Array.isArray(item.options)
        ? item.options.slice(0, 4).map((opt) => stripOptionPrefix(opt))
        : [];
      const correct = resolveCorrectAnswer(item.correct, options);
      return {
        question: String(item.question || "").trim(),
        options: options.map((option) => String(option).trim()),
        correct: String(correct || "").trim(),
        explanation: String(item.explanation || "").trim(),
      };
    })
    .filter(
      (q) =>
        q.question &&
        q.options.length === 4 &&
        q.correct &&
        q.options.includes(q.correct)
    )
    .map(shuffleQuestionOptions);
};

const callGemini = async ({ apiKey, model, prompt }) => {
  const endpoint = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
  const response = await axios.post(
    endpoint,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${prompt}\n\nReturn ONLY pure JSON, no markdown or extra text.`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json",
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    }
  );

  const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return parseJsonFromText(text);
};

const callOpenAI = async ({ apiKey, model, prompt }) => {
  const response = await axios.post(
    OPENAI_ENDPOINT,
    {
      model,
      messages: [
        {
          role: "system",
          content: "You are an educational assessment generator that returns strict JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  const raw = response?.data?.choices?.[0]?.message?.content;
  return parseJsonFromText(raw);
};

const generateQuestionsWithAI = async ({ topic, topicDescription = "", difficulty, count }) => {
  const prompt = `Generate ${count} multiple choice questions on the topic '${topic}' at ${difficulty} difficulty level for a student.

Topic details from teacher: '${topicDescription || "No additional description provided."}'
Difficulty guidance: ${getDifficultyGuidance(difficulty)}

Return valid JSON only in this format:
{"questions":[{"question":"","options":["option text 1","option text 2","option text 3","option text 4"],"correct":"option text 1","explanation":""}]}

Rules:
1) Questions must be strictly about '${topic}' and its valid subtopics.
2) 4 distinct options only.
3) correct must match an option text exactly, not just A/B/C/D.
4) Do not repeat question stems.
5) Keep curriculum alignment and factual accuracy.
6) Do not create meta-learning questions about studying, progress, mastery, or exam strategy.
7) Ask about real topic knowledge such as purpose, structure, terminology, components, examples, or usage.`;

  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    const fallbackQuestions = buildFallbackQuestions(topic, difficulty, count, topicDescription);
    return { questions: fallbackQuestions, source: "fallback" };
  }

  try {
    const provider = (process.env.AI_PROVIDER || "gemini").toLowerCase();
    const model = process.env.AI_MODEL || (provider === "gemini" ? "gemini-1.5-flash" : "gpt-4o-mini");

    let bestQuestions = [];

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const parsed =
        provider === "openai"
          ? await callOpenAI({ apiKey, model, prompt })
          : await callGemini({ apiKey, model, prompt });

      const normalized = normalizeQuestions(parsed, count + 3);
      const relevant = filterRelevantQuestions(normalized, topic, topicDescription).filter(
        (question) => !isMetaLearningQuestion(question)
      );

      if (relevant.length > bestQuestions.length) {
        bestQuestions = relevant;
      }

      if (relevant.length >= count) {
        return { questions: relevant.slice(0, count), source: "ai", provider };
      }
    }

    if (bestQuestions.length < count) {
      const fallback = buildFallbackQuestions(topic, difficulty, count - bestQuestions.length, topicDescription);
      return { questions: [...bestQuestions, ...fallback], source: "fallback" };
    }

    return { questions: bestQuestions.slice(0, count), source: "ai", provider };
  } catch (error) {
    const fallbackQuestions = buildFallbackQuestions(topic, difficulty, count, topicDescription);
    return { questions: fallbackQuestions, source: "fallback", error: error.message };
  }
};

module.exports = { generateQuestionsWithAI, isMetaLearningQuestion };
