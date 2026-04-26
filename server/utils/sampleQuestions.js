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

const tokenize = (value) =>
  String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word && word.length > 2 && !STOPWORDS.has(word));

const HTML_BANK = {
  easy: [
    {
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "High Transfer Machine Language",
        "Hyperlink Text Modeling Logic",
        "Home Tool Markup Level",
      ],
      correct: "HyperText Markup Language",
      explanation: "HTML stands for HyperText Markup Language.",
    },
    {
      question: "What is the main purpose of HTML?",
      options: [
        "To structure content on web pages",
        "To style web pages with colors and fonts",
        "To store data in databases",
        "To run server-side scripts",
      ],
      correct: "To structure content on web pages",
      explanation: "HTML defines the structure and content of web pages.",
    },
    {
      question: "Which tag is commonly used for a paragraph in HTML?",
      options: ["<p>", "<h1>", "<div>", "<span>"],
      correct: "<p>",
      explanation: "The <p> tag is used for paragraphs.",
    },
    {
      question: "Which part of an HTML document usually contains visible page content?",
      options: ["<body>", "<head>", "<meta>", "<title>"],
      correct: "<body>",
      explanation: "The <body> element contains the visible content of the page.",
    },
  ],
  medium: [
    {
      question: "Which HTML element is best for navigation links?",
      options: ["<nav>", "<section>", "<article>", "<footer>"],
      correct: "<nav>",
      explanation: "The <nav> element is intended for navigation links.",
    },
    {
      question: "Which attribute provides alternative text for an image?",
      options: ["alt", "href", "src", "title"],
      correct: "alt",
      explanation: "The alt attribute describes an image for accessibility and fallback display.",
    },
    {
      question: "Which tag is used to create an ordered list?",
      options: ["<ol>", "<ul>", "<li>", "<list>"],
      correct: "<ol>",
      explanation: "The <ol> element creates a numbered list.",
    },
    {
      question: "Which HTML element is most suitable for a standalone article or post?",
      options: ["<article>", "<span>", "<br>", "<small>"],
      correct: "<article>",
      explanation: "<article> is used for self-contained content such as a blog post or news item.",
    },
  ],
  hard: [
    {
      question: "Which element should be used to link an external stylesheet in HTML?",
      options: ["<link>", "<style>", "<script>", "<css>"],
      correct: "<link>",
      explanation: "The <link> element is used to connect external resources such as stylesheets.",
    },
    {
      question: "Which HTML feature improves accessibility by giving images descriptive text?",
      options: ["The alt attribute", "The href attribute", "The target attribute", "The rel attribute"],
      correct: "The alt attribute",
      explanation: "The alt attribute lets screen readers and browsers understand image content.",
    },
    {
      question: "Which element is best for grouping related form controls and their label?",
      options: ["<fieldset>", "<section>", "<aside>", "<main>"],
      correct: "<fieldset>",
      explanation: "<fieldset> groups related controls in a form for better structure and accessibility.",
    },
    {
      question: "What is the main reason to use semantic HTML elements?",
      options: [
        "To improve meaning, accessibility, and maintainability",
        "To make files larger",
        "To replace CSS styling completely",
        "To prevent browsers from rendering the page",
      ],
      correct: "To improve meaning, accessibility, and maintainability",
      explanation: "Semantic HTML gives content clearer meaning and helps assistive technologies.",
    },
  ],
};

const DBMS_BANK = {
  easy: [
    {
      question: "What is the full form of DBMS?",
      options: [
        "Database Management System",
        "Data Backup Management Service",
        "Digital Base Memory Structure",
        "Distributed Binary Management System",
      ],
      correct: "Database Management System",
      explanation: "DBMS stands for Database Management System.",
    },
    {
      question: "Which DBMS language is used to retrieve data from tables?",
      options: ["SQL", "HTML", "CSS", "C"],
      correct: "SQL",
      explanation: "SQL is used to query and manipulate relational database data.",
    },
    {
      question: "In a relational DBMS, what is a table row commonly called?",
      options: ["Tuple", "Schema", "Domain", "View"],
      correct: "Tuple",
      explanation: "A row in a relation is called a tuple.",
    },
    {
      question: "What is a primary key used for in DBMS?",
      options: [
        "Uniquely identifying each record",
        "Encrypting the table",
        "Sorting records alphabetically",
        "Storing duplicate values",
      ],
      correct: "Uniquely identifying each record",
      explanation: "A primary key uniquely identifies each tuple in a table.",
    },
    {
      question: "Which command is used to remove all rows from a table but keep its structure?",
      options: ["TRUNCATE", "DROP", "DELETE DATABASE", "REMOVE TABLE"],
      correct: "TRUNCATE",
      explanation: "TRUNCATE removes all rows but retains the table schema.",
    },
    {
      question: "What does normalization mainly help reduce in DBMS?",
      options: [
        "Data redundancy",
        "Network speed",
        "Disk hardware failure",
        "User authentication complexity",
      ],
      correct: "Data redundancy",
      explanation: "Normalization organizes data to minimize redundancy and anomalies.",
    },
  ],
  medium: [
    {
      question: "Which normal form removes partial dependency on a composite primary key?",
      options: ["Second Normal Form (2NF)", "First Normal Form (1NF)", "Boyce-Codd Normal Form", "Fourth Normal Form (4NF)"],
      correct: "Second Normal Form (2NF)",
      explanation: "2NF removes partial dependency of non-key attributes on a subset of a composite key.",
    },
    {
      question: "Which SQL join returns only matching rows from both joined tables?",
      options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
      correct: "INNER JOIN",
      explanation: "INNER JOIN returns rows where join condition matches in both tables.",
    },
    {
      question: "What is the role of an index in DBMS?",
      options: [
        "Speeding up data retrieval",
        "Encrypting sensitive columns",
        "Automatically normalizing tables",
        "Replacing foreign keys",
      ],
      correct: "Speeding up data retrieval",
      explanation: "Indexes provide faster lookups at the cost of extra storage and write overhead.",
    },
    {
      question: "Which ACID property ensures a transaction moves the database from one valid state to another?",
      options: ["Consistency", "Isolation", "Atomicity", "Durability"],
      correct: "Consistency",
      explanation: "Consistency enforces integrity constraints before and after transactions.",
    },
    {
      question: "What is a foreign key constraint mainly used for?",
      options: [
        "Maintaining referential integrity between tables",
        "Compressing table data",
        "Creating temporary tables",
        "Defining transaction boundaries",
      ],
      correct: "Maintaining referential integrity between tables",
      explanation: "Foreign keys ensure child rows reference valid parent rows.",
    },
    {
      question: "In SQL, which clause is used to filter grouped records?",
      options: ["HAVING", "WHERE", "ORDER BY", "LIMIT"],
      correct: "HAVING",
      explanation: "HAVING filters groups after aggregation, unlike WHERE which filters rows before grouping.",
    },
  ],
  hard: [
    {
      question: "Which concurrency issue occurs when one transaction overwrites changes made by another committed transaction?",
      options: ["Lost update", "Dirty read", "Phantom read", "Non-repeatable read"],
      correct: "Lost update",
      explanation: "Lost update happens when concurrent writes cause one transaction's update to be overwritten.",
    },
    {
      question: "In strict two-phase locking (Strict 2PL), when are exclusive locks released?",
      options: [
        "At transaction commit or rollback",
        "Immediately after each write",
        "Before lock acquisition phase ends",
        "At random intervals",
      ],
      correct: "At transaction commit or rollback",
      explanation: "Strict 2PL holds exclusive locks until commit/rollback to ensure recoverability.",
    },
    {
      question: "Which recovery concept guarantees that committed transaction effects survive system crashes?",
      options: ["Durability", "Atomicity", "Serializability", "Decomposition"],
      correct: "Durability",
      explanation: "Durability ensures committed changes are persistent despite failures.",
    },
    {
      question: "What is the main purpose of a write-ahead log (WAL) in DBMS recovery?",
      options: [
        "Record changes before writing data pages",
        "Encrypt all transaction data",
        "Normalize database schema",
        "Prevent all deadlocks",
      ],
      correct: "Record changes before writing data pages",
      explanation: "WAL logs modifications first, enabling redo/undo during recovery.",
    },
    {
      question: "Which decomposition property ensures no information is lost after splitting a relation?",
      options: ["Lossless-join decomposition", "Dependency preservation only", "Full denormalization", "Vertical scaling"],
      correct: "Lossless-join decomposition",
      explanation: "Lossless-join decomposition ensures original relation can be reconstructed exactly.",
    },
    {
      question: "Which isolation level commonly allows non-repeatable reads but prevents dirty reads?",
      options: ["Read Committed", "Read Uncommitted", "Serializable", "Snapshot-free"],
      correct: "Read Committed",
      explanation: "Read Committed prevents dirty reads while still allowing non-repeatable reads.",
    },
  ],
};

const buildGenericFallback = (topic, difficulty, topicDescription = "") => {
  const sanitizedTopic = String(topic || "General Knowledge").trim();
  const lowerTopic = sanitizedTopic.toLowerCase();
  const focusWords = [...new Set(tokenize(topicDescription).concat(tokenize(sanitizedTopic)))].slice(0, 3);
  const focusPhrase = focusWords.length > 0 ? focusWords.join(", ") : lowerTopic;

  return [
    {
      question: `What is the primary purpose of ${sanitizedTopic}?`,
      options: [
        `To explain the core ideas and practical use of ${sanitizedTopic}`,
        `To replace every other subject with unrelated facts`,
        `To avoid using examples or applications`,
        `To focus only on memorization without understanding`,
      ],
      correct: `To explain the core ideas and practical use of ${sanitizedTopic}`,
      explanation: `${sanitizedTopic} is usually learned through its basic concepts, methods, and real-world applications.`,
    },
    {
      question: `Which choice best describes a basic feature of ${sanitizedTopic}?`,
      options: [
        `${sanitizedTopic} involves ${focusPhrase || "core concepts"} and practical examples`,
        `${sanitizedTopic} has no rules, patterns, or common uses`,
        `${sanitizedTopic} is only useful when ignored`,
        `${sanitizedTopic} works best without any structure`,
      ],
      correct: `${sanitizedTopic} involves ${focusPhrase || "core concepts"} and practical examples`,
      explanation: `A basic understanding of ${sanitizedTopic} should include its key terms, structure, and examples.`,
    },
    {
      question: `Which approach is most useful when learning ${sanitizedTopic} at ${difficulty} level?`,
      options: [
        `Practicing real ${sanitizedTopic} examples and checking mistakes`,
        `Skipping the main ideas and memorizing random answers`,
        `Ignoring the topic's terminology completely`,
        `Only reading the title and moving on`,
      ],
      correct: `Practicing real ${sanitizedTopic} examples and checking mistakes`,
      explanation: `The best learning strategy is to practice the actual topic, then review errors and correct misunderstandings.`,
    },
  ];
};

const getBankForTopic = (topic, difficulty, topicDescription = "") => {
  const level = ["easy", "medium", "hard"].includes(String(difficulty || "").toLowerCase())
    ? String(difficulty).toLowerCase()
    : "easy";
  const normalizedTopic = String(topic || "").trim().toLowerCase();

  if (/\bdbms\b|database management|database system/i.test(String(topic || ""))) {
    return DBMS_BANK[level];
  }

  if (/\bhtml\b|hypertext markup language/i.test(normalizedTopic)) {
    return HTML_BANK[level];
  }

  return buildGenericFallback(topic, level, topicDescription);
};

const buildFallbackQuestions = (topic, difficulty, count, topicDescription = "") => {
  const baseBank = getBankForTopic(topic, difficulty, topicDescription);
  const randomizedBank = shuffle(baseBank).map(shuffleQuestionOptions);
  const questions = [];

  for (let i = 0; i < count; i += 1) {
    const source = randomizedBank[i % randomizedBank.length];
    questions.push({
      question: source.question,
      options: [...source.options],
      correct: source.correct,
      explanation: source.explanation,
    });
  }

  return questions;
};

module.exports = { buildFallbackQuestions, shuffleQuestionOptions, shuffle };
