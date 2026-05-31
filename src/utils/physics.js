// ============================================================
// PHYSICS ENGINE
// Handles player movement, gravity, and flap mechanics
// ============================================================

import { GAME_CONFIG } from "./constants.js";

export function createPlayer(x, y) {
  return {
    x,
    y,
    vy: 0,         // vertical velocity
    rotation: 0,   // visual tilt
    alive: true,
  };
}

export function updatePlayer(player, gravityMultiplier = 1) {
  const newPlayer = { ...player };

  // Apply gravity
  newPlayer.vy += GAME_CONFIG.GRAVITY * gravityMultiplier;

  // Terminal velocity
  newPlayer.vy = Math.min(newPlayer.vy, 12);

  // Update position
  newPlayer.y += newPlayer.vy;

  // Smooth rotation based on velocity
  const targetRotation = newPlayer.vy > 0
    ? Math.min(newPlayer.vy * 3, 70)   // nose down when falling
    : Math.max(newPlayer.vy * 2, -25); // slight nose up when rising

  newPlayer.rotation += (targetRotation - newPlayer.rotation) * 0.12;

  return newPlayer;
}

export function flapPlayer(player) {
  return {
    ...player,
    vy: GAME_CONFIG.FLAP_STRENGTH,
    rotation: -20,
  };
}

// ============================================================
// OBSTACLE PHYSICS
// ============================================================

export function createObstacle(canvasHeight, groundHeight, obstacleType, speed, gapSize) {
  const minH = GAME_CONFIG.MIN_OBSTACLE_HEIGHT;
  const playableHeight = canvasHeight - groundHeight;
  const maxTopH = playableHeight - gapSize - minH;
  const topHeight = minH + Math.random() * (maxTopH - minH);

  return {
    x: GAME_CONFIG.WIDTH + GAME_CONFIG.OBSTACLE_WIDTH,
    topHeight,
    bottomY: topHeight + gapSize,
    bottomHeight: playableHeight - topHeight - gapSize,
    width: GAME_CONFIG.OBSTACLE_WIDTH,
    passed: false,
    type: obstacleType,
    speed,
    id: Math.random().toString(36).slice(2),
  };
}

export function updateObstacles(obstacles, speed) {
  return obstacles
    .map(obs => ({ ...obs, x: obs.x - speed }))
    .filter(obs => obs.x + obs.width > -10);
}

// ============================================================
// COLLISION DETECTION
// ============================================================

export function checkCollision(player, obstacles, groundY, canvasHeight, isInvincible) {
  if (isInvincible) return false;

  const { CHAR_WIDTH, CHAR_HEIGHT } = GAME_CONFIG;
  const hitboxPadding = 8; // Slightly smaller hitbox than visual for fairness

  const px = player.x - CHAR_WIDTH / 2 + hitboxPadding;
  const py = player.y - CHAR_HEIGHT / 2 + hitboxPadding;
  const pw = CHAR_WIDTH - hitboxPadding * 2;
  const ph = CHAR_HEIGHT - hitboxPadding * 2;

  // Ground collision
  if (player.y + CHAR_HEIGHT / 2 >= groundY) return true;

  // Ceiling collision
  if (player.y - CHAR_HEIGHT / 2 <= 0) return true;

  // Obstacle collision
  for (const obs of obstacles) {
    const ox = obs.x;
    const ow = obs.width;

    // Check horizontal overlap
    if (px + pw < ox || px > ox + ow) continue;

    // Check vertical overlap with top pillar
    if (py < obs.topHeight) return true;

    // Check vertical overlap with bottom pillar
    if (py + ph > obs.bottomY) return true;
  }

  return false;
}

// ============================================================
// SCORE DETECTION
// ============================================================

export function checkScorePassed(player, obstacles) {
  let scored = false;
  const updatedObstacles = obstacles.map(obs => {
    if (!obs.passed && obs.x + obs.width < player.x - GAME_CONFIG.CHAR_WIDTH / 2) {
      scored = true;
      return { ...obs, passed: true };
    }
    return obs;
  });
  return { scored, obstacles: updatedObstacles };
}
