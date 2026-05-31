// ============================================================
// LOCAL STORAGE MANAGER
// Handles high scores and game data persistence
// ============================================================

const LS_KEY = "flappyFriendsData";

const defaultData = {
  highScore: 0,
  highScorePlayer: null,
  highScoreDate: null,
  totalGames: 0,
  bestCharacter: null,
  legendAchieved: false,
  milestonesSeen: [],
};

export function loadGameData() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...defaultData };
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return { ...defaultData };
  }
}

export function saveGameData(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    console.warn("Failed to save game data to localStorage");
  }
}

export function updateHighScore(score, characterName) {
  const data = loadGameData();
  if (score > data.highScore) {
    const updated = {
      ...data,
      highScore: score,
      highScorePlayer: characterName,
      highScoreDate: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      totalGames: (data.totalGames || 0) + 1,
    };
    saveGameData(updated);
    return { ...updated, isNewRecord: true };
  }
  const updated = { ...data, totalGames: (data.totalGames || 0) + 1 };
  saveGameData(updated);
  return { ...updated, isNewRecord: false };
}

export function markLegendAchieved() {
  const data = loadGameData();
  if (!data.legendAchieved) {
    saveGameData({ ...data, legendAchieved: true });
  }
}

export function hasSeenMilestone(score) {
  const data = loadGameData();
  return (data.milestonesSeen || []).includes(score);
}

export function markMilestoneSeen(score) {
  const data = loadGameData();
  const seen = new Set(data.milestonesSeen || []);
  seen.add(score);
  saveGameData({ ...data, milestonesSeen: Array.from(seen) });
}

export function resetAllData() {
  localStorage.removeItem(LS_KEY);
}
