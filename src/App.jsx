// ============================================================
// APP ROOT
// State machine: menu → playing → dead → menu
// ============================================================

import React, { useState, useCallback, useRef } from "react";
import CharacterSelect from "./components/CharacterSelect.jsx";
import GameCanvas from "./components/GameCanvas.jsx";
import GameHUD from "./components/GameHUD.jsx";
import GameOver from "./components/GameOver.jsx";
import MilestonePopup from "./components/MilestonePopup.jsx";
import LegendCelebration from "./components/LegendCelebration.jsx";
import { useGameLoop, GAME_STATE } from "./hooks/useGameLoop.js";
import { useSoundManager } from "./hooks/useSoundManager.js";
import { updateHighScore, loadGameData } from "./utils/storage.js";
import { preloadImages } from "./utils/assets.js";
import { CHARACTERS, OBSTACLE_TYPES, BG_CONFIG } from "./utils/constants.js";

// App-level screens
const SCREEN = {
  MENU: "menu",
  GAME: "game",
};

export default function App() {
  const [screen, setScreen] = useState(SCREEN.MENU);
  const [selectedChar, setSelectedChar] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [deathInfo, setDeathInfo] = useState(null);   // { score, message }
  const [milestone, setMilestone] = useState(null);    // current popup
  const [milestoneQueue, setMilestoneQueue] = useState([]);
  const [muted, setMuted] = useState(false);
  const canvasRefHolder = useRef(null);

  const soundManager = useSoundManager();

  // ---- Score callback ----
  const handleScore = useCallback((score) => {
    setCurrentScore(score);
  }, []);

  // ---- Death callback ----
  const handleDeath = useCallback((score, message) => {
    const result = updateHighScore(score, selectedChar?.name);
    setHighScore(result.highScore);
    setDeathInfo({ score, message });
  }, [selectedChar]);

  // ---- Milestone callback ----
  const handleMilestone = useCallback((score, milestoneData) => {
    if (milestoneData.effect === "legend") {
      // Legend is handled by game state transition, not a popup
      return;
    }
    setMilestoneQueue(q => [...q, milestoneData]);
  }, []);

  // ---- Game loop hook ----
  const {
    gameState,
    startGame,
    pauseGame,
    flap,
    resumeAfterLegend,
  } = useGameLoop(
    canvasRefHolder,
    selectedChar,
    handleScore,
    handleDeath,
    handleMilestone,
    soundManager
  );

  // ---- Milestone queue management ----
  const currentMilestone = milestoneQueue[0] || null;
  const dismissMilestone = useCallback(() => {
    setMilestoneQueue(q => q.slice(1));
  }, []);

  // ---- Character selected → start game ----
  const handleCharSelect = useCallback(async (char) => {
    setSelectedChar(char);
    setScreen(SCREEN.GAME);
    setCurrentScore(0);
    setDeathInfo(null);

    // Preload assets in background
    const imageSrcs = [
      char.image,
      ...CHARACTERS.map(c => c.image),
      ...OBSTACLE_TYPES.map(o => o.image),
      BG_CONFIG.IMAGE,
    ].filter(Boolean);

    preloadImages(imageSrcs);

    // Load high score
    const data = loadGameData();
    setHighScore(data.highScore || 0);

    soundManager.startBgMusic();
  }, [soundManager]);

  // ---- Restart ----
  const handleRestart = useCallback(() => {
    setDeathInfo(null);
    setCurrentScore(0);
    setMilestoneQueue([]);
    startGame();
  }, [startGame]);

  // ---- Back to menu ----
  const handleMenu = useCallback(() => {
    soundManager.stopBgMusic();
    setScreen(SCREEN.MENU);
    setDeathInfo(null);
    setCurrentScore(0);
    setMilestoneQueue([]);
    setSelectedChar(null);
  }, [soundManager]);

  // ---- Tap / flap ----
  const handleTap = useCallback(() => {
    if (gameState === GAME_STATE.IDLE || gameState === GAME_STATE.PLAYING) {
      flap();
    }
  }, [gameState, flap]);

  // ---- Toggle mute ----
  const handleMute = useCallback(() => {
    const nowMuted = soundManager.toggleMute();
    setMuted(nowMuted);
  }, [soundManager]);

  // ---- Canvas ref holder ----
  const handleCanvasReady = useCallback((ref) => {
    canvasRefHolder.current = ref;
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  if (screen === SCREEN.MENU) {
    return (
      <div className="w-full h-full" style={{ height: "100dvh" }}>
        <CharacterSelect onSelect={handleCharSelect} />
      </div>
    );
  }

  const isPlaying = gameState === GAME_STATE.PLAYING;
  const isPaused = gameState === GAME_STATE.PAUSED;
  const isDead = gameState === GAME_STATE.DEAD;
  const isLegend = gameState === GAME_STATE.LEGEND;
  const gameStarted = gameState !== GAME_STATE.IDLE;

  return (
    <div
      className="w-full flex items-center justify-center relative overflow-hidden"
      style={{
        height: "100dvh",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      }}
    >
      {/* Decorative background dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      {/* Game canvas container */}
      <div className="relative" style={{ touchAction: "none" }}>
        <GameCanvas
          onCanvasReady={handleCanvasReady}
          onTap={handleTap}
        />

        {/* HUD overlay - sits on top of canvas */}
        <div className="absolute inset-0 pointer-events-none">
          <GameHUD
            score={currentScore}
            highScore={highScore}
            character={selectedChar}
            isPaused={isPaused}
            isMuted={muted}
            onPause={pauseGame}
            onMute={handleMute}
            onRestart={handleRestart}
            gameStarted={gameStarted}
          />
        </div>

        {/* Idle "tap to start" prompt */}
        {gameState === GAME_STATE.IDLE && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none"
          >
            <div
              className="animate-bounce text-white text-center px-5 py-3 rounded-2xl"
              style={{
                background: "rgba(0,0,0,0.5)",
                fontFamily: "'Fredoka One', cursive",
                fontSize: "1.1rem",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              👆 Tap or press SPACE to flap!
            </div>
          </div>
        )}
      </div>

      {/* Milestone popup (above canvas, full screen) */}
      {currentMilestone && (
        <MilestonePopup
          milestone={currentMilestone}
          onDone={dismissMilestone}
        />
      )}

      {/* Game Over screen */}
      {isDead && deathInfo && (
        <GameOver
          score={deathInfo.score}
          deathMessage={deathInfo.message}
          character={selectedChar}
          onRestart={handleRestart}
          onMenu={handleMenu}
        />
      )}

      {/* Legend celebration (score 50) */}
      {isLegend && (
        <LegendCelebration
          onContinue={() => {
            soundManager.startBgMusic();
            resumeAfterLegend();
          }}
        />
      )}
    </div>
  );
}
