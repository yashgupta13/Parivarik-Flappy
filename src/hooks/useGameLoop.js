// ============================================================
// MAIN GAME HOOK
// Core game loop, state management, physics integration
// ============================================================

import { useRef, useCallback, useEffect, useState } from "react";
import { GAME_CONFIG, OBSTACLE_TYPES, DEATH_MESSAGES, BG_CONFIG } from "../utils/constants.js";
import {
  createPlayer, updatePlayer, flapPlayer,
  createObstacle, updateObstacles,
  checkCollision, checkScorePassed,
} from "../utils/physics.js";
import {
  drawBackground, drawClouds, drawGround, drawObstacles,
  drawPlayer, drawScoreOverlay, drawParticles, updateParticles,
  createDeathParticles, createScoreParticle,
} from "../utils/renderer.js";
import { getCachedImage, preloadImages } from "../utils/assets.js";

// Game states
export const GAME_STATE = {
  IDLE: "idle",          // Just loaded
  PLAYING: "playing",
  PAUSED: "paused",
  DEAD: "dead",
  LEGEND: "legend",     // Score 50 celebration
};

const GROUND_HEIGHT = GAME_CONFIG.GROUND_HEIGHT;

export function useGameLoop(canvasRef, selectedCharacter, onScore, onDeath, onMilestone, soundManager) {
  const stateRef = useRef(GAME_STATE.IDLE);
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);

  // Game world state (mutable refs for performance)
  const playerRef = useRef(null);
  const obstaclesRef = useRef([]);
  const particlesRef = useRef([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const scrollXRef = useRef(0);
  const rafRef = useRef(null);

  // Timing
  const lastObstacleTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);

  // Speed modifiers (from milestones)
  const speedMultRef = useRef(1);
  const gapSizeRef = useRef(GAME_CONFIG.OBSTACLE_GAP);
  const gravMultRef = useRef(1);
  const isInvincibleRef = useRef(false);
  const isSlowMoRef = useRef(false);

  // Clouds (background decoration)
  const cloudsRef = useRef([]);

  // Track which milestones were triggered this session
  const triggeredMilestonesRef = useRef(new Set());

  // --------------------------------------------------------
  // INIT CLOUDS
  // --------------------------------------------------------
  const initClouds = useCallback(() => {
    cloudsRef.current = Array.from({ length: 6 }, (_, i) => ({
      x: (i / 6) * GAME_CONFIG.WIDTH + Math.random() * 80,
      y: 40 + Math.random() * 120,
      r: 20 + Math.random() * 25,
      speed: 0.3 + Math.random() * 0.4,
      opacity: 0.5 + Math.random() * 0.4,
    }));
  }, []);

  // --------------------------------------------------------
  // RESET / START GAME
  // --------------------------------------------------------
  const startGame = useCallback(() => {
    playerRef.current = createPlayer(
      GAME_CONFIG.CHAR_X,
      GAME_CONFIG.HEIGHT / 2
    );
    obstaclesRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    frameRef.current = 0;
    scrollXRef.current = 0;
    lastObstacleTimeRef.current = 0;
    lastFrameTimeRef.current = performance.now();

    // Reset modifiers
    speedMultRef.current = 1;
    gapSizeRef.current = GAME_CONFIG.OBSTACLE_GAP;
    gravMultRef.current = 1;
    isInvincibleRef.current = false;
    isSlowMoRef.current = false;
    triggeredMilestonesRef.current = new Set();

    initClouds();
    setGameState(GAME_STATE.PLAYING);
    stateRef.current = GAME_STATE.PLAYING;
  }, [initClouds]);

  // --------------------------------------------------------
  // FLAP
  // --------------------------------------------------------
  const flap = useCallback(() => {
    if (stateRef.current === GAME_STATE.PLAYING && playerRef.current?.alive) {
      playerRef.current = flapPlayer(playerRef.current);
      soundManager?.play("flap", 0.4);
    } else if (stateRef.current === GAME_STATE.IDLE) {
      startGame();
    }
  }, [startGame, soundManager]);

  // --------------------------------------------------------
  // PAUSE / RESUME
  // --------------------------------------------------------
  const pauseGame = useCallback(() => {
    if (stateRef.current === GAME_STATE.PLAYING) {
      stateRef.current = GAME_STATE.PAUSED;
      setGameState(GAME_STATE.PAUSED);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } else if (stateRef.current === GAME_STATE.PAUSED) {
      stateRef.current = GAME_STATE.PLAYING;
      setGameState(GAME_STATE.PLAYING);
      lastFrameTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(gameLoop);
    }
  }, []);

  // --------------------------------------------------------
  // DEATH HANDLER
  // --------------------------------------------------------
  const handleDeath = useCallback(() => {
    if (!playerRef.current) return;
    playerRef.current = { ...playerRef.current, alive: false };

    // Spawn death particles
    particlesRef.current = [
      ...particlesRef.current,
      ...createDeathParticles(playerRef.current.x, playerRef.current.y),
    ];

    soundManager?.play("collision", 0.6);

    const deathMsg = DEATH_MESSAGES[Math.floor(Math.random() * DEATH_MESSAGES.length)];
    stateRef.current = GAME_STATE.DEAD;
    setGameState(GAME_STATE.DEAD);

    onDeath?.(scoreRef.current, deathMsg);
  }, [onDeath, soundManager]);

  // --------------------------------------------------------
  // MILESTONE CHECK
  // --------------------------------------------------------
  const checkMilestones = useCallback((score) => {
    if (triggeredMilestonesRef.current.has(score)) return;

    const milestone = GAME_CONFIG.MILESTONES[score];
    if (milestone) {
      triggeredMilestonesRef.current.add(score);
      soundManager?.play("milestone", 0.7);

      // Apply effects
      switch (milestone.effect) {
        case "slow":
          isSlowMoRef.current = true;
          speedMultRef.current = 0.4;
          gravMultRef.current = 0.4;
          setTimeout(() => {
            isSlowMoRef.current = false;
            speedMultRef.current = 1;
            gravMultRef.current = 1;
          }, milestone.duration);
          break;

        case "invincible":
          isInvincibleRef.current = true;
          setTimeout(() => {
            isInvincibleRef.current = false;
          }, milestone.duration);
          break;

        case "speedup":
          speedMultRef.current = Math.min(speedMultRef.current * 1.4, 2.2);
          break;

        case "smallgap":
          gapSizeRef.current = Math.max(gapSizeRef.current - 40, 120);
          break;

        case "legend":
          stateRef.current = GAME_STATE.LEGEND;
          setGameState(GAME_STATE.LEGEND);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          break;
      }

      if (milestone.effect !== "legend") {
        onMilestone?.(score, milestone);
      } else {
        onMilestone?.(score, milestone);
      }
    }

    // Easter eggs
    const egg = GAME_CONFIG.EASTER_EGGS[score];
    if (egg && !triggeredMilestonesRef.current.has(`egg_${score}`)) {
      triggeredMilestonesRef.current.add(`egg_${score}`);
      onMilestone?.(score, { ...egg, isEgg: true });
    }
  }, [onMilestone, soundManager]);

  // --------------------------------------------------------
  // RESUME AFTER LEGEND
  // --------------------------------------------------------
  const resumeAfterLegend = useCallback(() => {
    stateRef.current = GAME_STATE.PLAYING;
    setGameState(GAME_STATE.PLAYING);
    lastFrameTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // --------------------------------------------------------
  // MAIN GAME LOOP
  // --------------------------------------------------------
  const gameLoop = useCallback((timestamp) => {
    if (stateRef.current !== GAME_STATE.PLAYING) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dt = Math.min(timestamp - lastFrameTimeRef.current, 50); // cap at 50ms
    lastFrameTimeRef.current = timestamp;

    const W = canvas.width;
    const H = canvas.height;
    const groundY = H - GROUND_HEIGHT;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // ---- Background ----
    const bgImage = getCachedImage(BG_CONFIG.IMAGE);
    drawBackground(ctx, W, H, GROUND_HEIGHT, frameRef.current, bgImage);

    // ---- Clouds ----
    cloudsRef.current = cloudsRef.current.map(c => ({
      ...c,
      x: c.x - c.speed * speedMultRef.current,
    })).map(c => ({
      ...c,
      x: c.x < -80 ? W + 80 : c.x,
    }));
    drawClouds(ctx, cloudsRef.current);

    // ---- Spawn obstacles ----
    const spawnInterval = GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL / speedMultRef.current;
    if (timestamp - lastObstacleTimeRef.current > spawnInterval) {
      const obsType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      const speed = GAME_CONFIG.INITIAL_SPEED * speedMultRef.current;
      obstaclesRef.current.push(
        createObstacle(H, GROUND_HEIGHT, obsType, speed, gapSizeRef.current)
      );
      lastObstacleTimeRef.current = timestamp;
    }

    // ---- Update obstacles ----
    const obsSpeed = GAME_CONFIG.INITIAL_SPEED * speedMultRef.current;
    obstaclesRef.current = updateObstacles(obstaclesRef.current, obsSpeed);

    // ---- Draw obstacles ----
    drawObstacles(ctx, obstaclesRef.current, H, GROUND_HEIGHT);

    // ---- Update player ----
    if (playerRef.current?.alive) {
      playerRef.current = updatePlayer(playerRef.current, gravMultRef.current);
    }

    // ---- Check scoring ----
    const { scored, obstacles: updatedObs } = checkScorePassed(
      playerRef.current,
      obstaclesRef.current
    );
    obstaclesRef.current = updatedObs;

    if (scored) {
      scoreRef.current += 1;
      onScore?.(scoreRef.current);
      soundManager?.play("point", 0.3);

      // Score particles
      particlesRef.current = [
        ...particlesRef.current,
        ...createScoreParticle(playerRef.current.x + 30, playerRef.current.y),
      ];

      checkMilestones(scoreRef.current);
    }

    // ---- Collision ----
    if (playerRef.current?.alive) {
      const hit = checkCollision(
        playerRef.current,
        obstaclesRef.current,
        groundY,
        H,
        isInvincibleRef.current
      );
      if (hit) {
        handleDeath();
        // Draw one last frame and stop
        drawPlayer(ctx, playerRef.current,
          getCachedImage(selectedCharacter?.image),
          selectedCharacter?.emoji,
          false, frameRef.current
        );
        drawGround(ctx, W, H, GROUND_HEIGHT, scrollXRef.current);
        drawParticles(ctx, particlesRef.current);
        return;
      }
    }

    // ---- Draw player ----
    const charImg = getCachedImage(selectedCharacter?.image);
    drawPlayer(
      ctx,
      playerRef.current,
      charImg,
      selectedCharacter?.emoji,
      isInvincibleRef.current,
      frameRef.current
    );

    // ---- Ground scroll ----
    scrollXRef.current += obsSpeed;
    drawGround(ctx, W, H, GROUND_HEIGHT, scrollXRef.current);

    // ---- Particles ----
    particlesRef.current = updateParticles(particlesRef.current);
    drawParticles(ctx, particlesRef.current);

    // ---- Score overlay ----
    drawScoreOverlay(ctx, scoreRef.current);

    frameRef.current++;
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [canvasRef, selectedCharacter, onScore, handleDeath, checkMilestones, soundManager]);

  // --------------------------------------------------------
  // START LOOP
  // --------------------------------------------------------
  useEffect(() => {
    if (gameState === GAME_STATE.PLAYING) {
      rafRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, gameLoop]);

  // --------------------------------------------------------
  // INPUT HANDLERS
  // --------------------------------------------------------
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        flap();
      }
      if (e.code === "Escape" || e.code === "KeyP") {
        if (stateRef.current === GAME_STATE.PLAYING || stateRef.current === GAME_STATE.PAUSED) {
          pauseGame();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [flap, pauseGame]);

  // Draw idle screen
  const drawIdleScreen = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const bgImage = getCachedImage(BG_CONFIG.IMAGE);
    drawBackground(ctx, W, H, GROUND_HEIGHT, 0, bgImage);
    drawClouds(ctx, cloudsRef.current);
    drawGround(ctx, W, H, GROUND_HEIGHT, 0);

    // "Tap to start" indicator
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(W / 2 - 120, H / 2 - 30, 240, 60);
    ctx.fillStyle = "white";
    ctx.font = 'bold 16px "Press Start 2P", Arial';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("TAP TO START", W / 2, H / 2);
    ctx.restore();
  }, [canvasRef]);

  useEffect(() => {
    if (gameState === GAME_STATE.IDLE) {
      initClouds();
      drawIdleScreen();
    }
  }, [gameState, initClouds, drawIdleScreen]);

  return {
    gameState,
    startGame,
    pauseGame,
    flap,
    resumeAfterLegend,
    currentScore: scoreRef,
  };
}
