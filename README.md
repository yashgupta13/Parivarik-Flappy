# 🐦 Parivarik Flappy

A Flappy Bird clone themed around college life and your friend group. Built with React + Vite + HTML5 Canvas + Tailwind CSS.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
flappy-friends/
├── public/
│   ├── characters/          ← Drop your character PNGs here
│   │   ├── yash.png
│   │   ├── vedansh.png
│   │   ├── arjun.png
│   │   └── priya.png
│   ├── obstacles/           ← Drop obstacle PNGs here
│   │   ├── assignment.png
│   │   ├── exam.png
│   │   ├── professor.png
│   │   ├── deadline.png
│   │   ├── attendance.png
│   │   └── viva.png
│   ├── audio/               ← Drop audio files here
│   │   ├── flap.mp3
│   │   ├── collision.mp3
│   │   ├── milestone.mp3
│   │   ├── celebration.mp3
│   │   ├── point.mp3
│   │   └── bgmusic.mp3
│   └── videos/
│       └── legend.mp4       ← The score-50 celebration video
│
└── src/
    ├── components/
    │   ├── CharacterSelect.jsx   ← Pre-game character picker
    │   ├── GameCanvas.jsx        ← HTML5 canvas wrapper
    │   ├── GameHUD.jsx           ← Score/pause/mute overlay
    │   ├── GameOver.jsx          ← Death screen
    │   ├── MilestonePopup.jsx    ← Score milestone notifications
    │   ├── LegendCelebration.jsx ← Score-50 special event
    │   └── Fireworks.jsx         ← Canvas fireworks animation
    ├── hooks/
    │   ├── useGameLoop.js        ← Main game loop & state machine
    │   └── useSoundManager.js    ← Audio management
    ├── utils/
    │   ├── constants.js          ← All game config & data
    │   ├── physics.js            ← Physics, collision, obstacles
    │   ├── renderer.js           ← All canvas drawing functions
    │   ├── assets.js             ← Image/audio loader
    │   └── storage.js            ← localStorage manager
    └── App.jsx                   ← Root app + screen routing
```

---

## 🎮 Controls

| Action | Control |
|--------|---------|
| Flap | SPACE / Click / Tap |
| Pause | ESC / P / Pause button |
| Restart | Restart button |

---

## 🖼️ Adding Your Own Assets

### Characters
- Place PNG images in `/public/characters/`
- Recommended size: **200×200px** or larger (will be scaled to 56×56 in game)
- Name them to match the `id` in `src/utils/constants.js`
- If an image fails to load, a cute bird emoji fallback is used

### Obstacles
- Place PNG images in `/public/obstacles/`
- Recommended size: **128×128px**
- Icons are shown in the gap between pillars
- Fallback: emoji icons are drawn if image not found

### Adding More Characters
Edit `CHARACTERS` in `src/utils/constants.js`:
```js
{
  id: "myFriend",
  name: "My Friend",
  image: "/characters/myfriend.png",
  emoji: "😄",
  tagline: "Their funny tagline",
  messages: ["Quote 1", "Quote 2", "Quote 3"],
  color: "#ff6b6b",
}
```

---

## 🎵 Audio

All audio is optional — the game works fine without sound files.

| File | Used for |
|------|---------|
| `flap.mp3` | Each flap |
| `collision.mp3` | Hitting an obstacle/ground |
| `point.mp3` | Passing an obstacle |
| `milestone.mp3` | Milestone unlocked |
| `celebration.mp3` | Not currently used (extend as needed) |
| `bgmusic.mp3` | Looping background music |

---

## 🏆 Milestone Events

| Score | Event |
|-------|-------|
| 10 | Slow motion for 5 seconds |
| 20 | Invincibility for 3 seconds |
| 30 | Speed increases permanently |
| 40 | Gap becomes smaller permanently |
| 50 | **LEGEND MODE** — video + fireworks |
| 69 | Easter egg: "Nice." |
| 75 | Easter egg: "Attendance Secured!" |
| 100 | Easter egg: "Touch Grass Achievement Unlocked" |

---

## 🛠️ Configuration

All tunable values are in `src/utils/constants.js`:

```js
export const GAME_CONFIG = {
  GRAVITY: 0.5,             // Adjust for floatier/heavier feel
  FLAP_STRENGTH: -9,        // How hard the flap pushes up
  INITIAL_SPEED: 3,         // Starting obstacle speed
  OBSTACLE_GAP: 180,        // Vertical gap size (pixels)
  OBSTACLE_SPAWN_INTERVAL: 1800, // ms between obstacles
  // ...
};
```

---

## 📱 Mobile Support

- Touch controls via `onPointerDown` on the canvas
- Viewport meta tag prevents zoom on mobile
- Canvas scales to fit any screen size
- `height: 100dvh` accounts for mobile browser chrome

---

## 💾 High Score Storage

High scores are stored in `localStorage` under the key `flappyFriendsData`:
```json
{
  "highScore": 42,
  "highScorePlayer": "Yash",
  "highScoreDate": "31 May 2026",
  "totalGames": 15,
  "legendAchieved": false
}
```

---

## 🏗️ Tech Stack

- **React 18** — Component architecture
- **Vite 5** — Build tooling & HMR
- **HTML5 Canvas** — All game rendering
- **Tailwind CSS 3** — UI styling
- **localStorage** — Score persistence
- **Web Audio API** — Sound effects
- **requestAnimationFrame** — Game loop

---

## 🎓 Have fun! Don't forget to submit your assignments.
