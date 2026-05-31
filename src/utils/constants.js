// ============================================================
// GAME CONFIGURATION & CONSTANTS
// ============================================================

export const GAME_CONFIG = {
  // Canvas dimensions
  WIDTH: 480,
  HEIGHT: 640,

  // Physics
  GRAVITY: 0.5,
  FLAP_STRENGTH: -9,
  INITIAL_SPEED: 3,
  MAX_SPEED: 8,

  // Obstacles
  OBSTACLE_WIDTH: 70,
  OBSTACLE_GAP: 180,        // vertical gap between top/bottom pipe
  OBSTACLE_SPAWN_INTERVAL: 1800, // ms between spawns
  MIN_OBSTACLE_HEIGHT: 60,

  // Character
  CHAR_WIDTH: 56,
  CHAR_HEIGHT: 56,
  CHAR_X: 100,

  // Ground
  GROUND_HEIGHT: 80,

  // Milestones
  MILESTONES: {
    10: {
      message: "Attendance still safe! 🎉",
      subtext: "Slow Motion Activated",
      effect: "slow",
      duration: 5000,
      color: "#22c55e",
    },
    20: {
      message: "Free Period Unlocked! 🕊️",
      subtext: "INVINCIBLE for 3 seconds!",
      effect: "invincible",
      duration: 3000,
      color: "#3b82f6",
    },
    30: {
      message: "Professor Entered The Classroom 😱",
      subtext: "Speed Increased!",
      effect: "speedup",
      duration: null,
      color: "#ef4444",
    },
    40: {
      message: "Mid Sem Panic Mode 😰",
      subtext: "Gap Reduced!",
      effect: "smallgap",
      duration: null,
      color: "#f97316",
    },
    50: {
      message: "LEGEND STATUS ACHIEVED 🏆",
      subtext: "You absolute legend!",
      effect: "legend",
      duration: null,
      color: "#fbbf24",
    },
  },

  // Easter eggs
  EASTER_EGGS: {
    69: { message: "Nice. 😏", color: "#ec4899" },
    75: { message: "Attendance Secured! ✅", color: "#22c55e" },
    100: { message: "Touch Grass Achievement Unlocked 🌱", color: "#84cc16" },
  },
};

// Characters
export const CHARACTERS = [
  {
    id: "yash",
    name: "Yash",
    image: "/characters/yash.png",
    emoji: "😎",
    tagline: "The one who always has the answers",
    messages: [
      "Debugging life since day one.",
      "Ctrl+Z doesn't work in real life.",
      "404: Sleep not found.",
    ],
    color: "#6366f1",
  },
  {
    id: "anshul",
    name: "Anshul",
    image: "/characters/anshul.png",
    emoji: "🤓",
    tagline: "Submits at 11:59 PM every time",
    messages: [
      "Last minute submissions are my cardio.",
      "I'll start studying after one more reel.",
      "The assignment was due YESTERDAY?!",
    ],
    color: "#f59e0b",
  },
  {
    id: "priyal",
    name: "Priyal",
    image: "/characters/priyal.png",
    emoji: "💅",
    tagline: "Notes so good they're illegal",
    messages: [
      "Borrow my notes? Sure, after the exam.",
      "I came, I saw, I aced it.",
      "Extra credit? I invented extra credit.",
    ],
    color: "#ec4899",
  },
  {
    id: "madhur",
    name: "Madhur",
    image: "/characters/madhur.png",
    emoji: "🚀",
    tagline: "Cafeteria queue speedrunner",
    messages: [
      "Skip class? Never heard of it.",
      "My GPA and my phone battery: both low.",
      "Nap in lecture, ace the exam.",
    ],
    color: "#10b981",
  },
  {
    id: "tanish",
    name: "Tanish",
    image: "/characters/tanish.png",
    emoji: "🧐",
    tagline: "Proxy attendance specialist",
    messages: [
      "I got your back for proxy!",
      "Has the professor started taking roll?",
      "Wait, is attendance mandatory today?",
    ],
    color: "#8b5cf6",
  },
];

// Obstacles (college life hazards)
export const OBSTACLE_TYPES = [
  {
    id: "assignment",
    label: "Ashima Tyagi",
    image: "/obstacles/assignment.png",
    emoji: "📝",
    color: "#ef4444",
  },
  {
    id: "exam",
    label: "Bacche",
    image: "/obstacles/exam.png",
    emoji: "📋",
    color: "#dc2626",
  },
  {
    id: "professor",
    label: "Nigga",
    image: "/obstacles/professor.png",
    emoji: "👨‍🏫",
    color: "#7c3aed",
  },
  {
    id: "deadline",
    label: "Minor",
    image: "/obstacles/deadline.png",
    emoji: "⏰",
    color: "#f97316",
  },
  {
    id: "attendance",
    label: "Attendance Warning",
    image: "/obstacles/attendance.png",
    emoji: "🚨",
    color: "#eab308",
  },
  {
    id: "viva",
    label: "Ch**t",
    image: "/obstacles/viva.png",
    emoji: "🎤",
    color: "#06b6d4",
  },
];

// Death messages
export const DEATH_MESSAGES = [
  "Assignment not submitted. 📝",
  "Caught sleeping in class. 😴",
  "Git push failed. 💀",
  "Laptop battery died. 🔋",
  "Attendance below 75%. 🚨",
  "Exam started before preparation. 😱",
  "WiFi disconnected during online exam. 📡",
  "Copy-pasted wrong code in viva. 🤡",
  "Forgot to save before submission. 💾",
  "Teacher said 'close your books'. 📚",
  "Phone confiscated during lecture. 📱",
  "Lab practical starts in 5 mins. 🧪",
];

// Background layers (parallax)
export const BG_CONFIG = {
  IMAGE: "/bg.png",
  SKY_COLORS: ["#87CEEB", "#b0e0e6"],
  CLOUD_COUNT: 6,
  STAR_COUNT: 0,
};
