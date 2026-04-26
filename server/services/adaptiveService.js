const levels = ["easy", "medium", "hard"];

const clampDifficulty = (difficulty) => {
  if (!levels.includes(difficulty)) {
    return "easy";
  }
  return difficulty;
};

const getNextDifficulty = (currentDifficulty, accuracy) => {
  const current = clampDifficulty(currentDifficulty);
  const currentIdx = levels.indexOf(current);

  if (accuracy >= 80 && currentIdx < levels.length - 1) {
    return levels[currentIdx + 1];
  }

  if (accuracy < 50 && currentIdx > 0) {
    return levels[currentIdx - 1];
  }

  return current;
};

module.exports = { getNextDifficulty, clampDifficulty };
