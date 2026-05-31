// ============================================================
// CANVAS RENDERER
// All drawing logic for the game world
// ============================================================

import { GAME_CONFIG, OBSTACLE_TYPES } from "./constants.js";
import { drawImageOrEmoji, getCachedImage, drawPillar } from "./assets.js";

// ============================================================
// BACKGROUND
// ============================================================

export function drawBackground(ctx, width, height, groundHeight, timeRef, bgImage) {
  if (bgImage) {
    // Fill the sky area with the background image
    ctx.drawImage(bgImage, 0, 0, width, height - groundHeight);
    return;
  }

  // Sky gradient fallback
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height - groundHeight);
  skyGrad.addColorStop(0, "#1a1a4e");
  skyGrad.addColorStop(0.4, "#2563eb");
  skyGrad.addColorStop(1, "#7dd3fc");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height - groundHeight);
}

export function drawClouds(ctx, clouds) {
  ctx.save();
  clouds.forEach(cloud => {
    ctx.globalAlpha = cloud.opacity || 0.7;
    ctx.fillStyle = "white";
    // Fluffy cloud shape
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, cloud.r, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.r * 0.8, cloud.y - cloud.r * 0.3, cloud.r * 0.7, 0, Math.PI * 2);
    ctx.arc(cloud.x + cloud.r * 1.5, cloud.y, cloud.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.restore();
}

export function drawGround(ctx, width, height, groundHeight, scrollX) {
  const groundY = height - groundHeight;

  // Grass top
  ctx.fillStyle = "#22c55e";
  ctx.fillRect(0, groundY, width, 14);

  // Darker grass strip
  ctx.fillStyle = "#16a34a";
  ctx.fillRect(0, groundY + 6, width, 8);

  // Dirt
  const dirtGrad = ctx.createLinearGradient(0, groundY + 14, 0, height);
  dirtGrad.addColorStop(0, "#92400e");
  dirtGrad.addColorStop(1, "#713f12");
  ctx.fillStyle = dirtGrad;
  ctx.fillRect(0, groundY + 14, width, groundHeight - 14);

  // Scrolling grass details
  const tileW = 40;
  const offset = (scrollX % tileW + tileW) % tileW;
  ctx.fillStyle = "#15803d";
  for (let x = -offset; x < width; x += tileW) {
    // Grass tufts
    ctx.beginPath();
    ctx.moveTo(x + 10, groundY + 6);
    ctx.lineTo(x + 14, groundY - 4);
    ctx.lineTo(x + 18, groundY + 6);
    ctx.fill();
  }
}

// ============================================================
// OBSTACLES (Pillars + Icons)
// ============================================================

export function drawObstacles(ctx, obstacles, height, groundHeight) {
  obstacles.forEach(obs => {
    const obsType = OBSTACLE_TYPES.find(t => t.id === obs.type?.id) || OBSTACLE_TYPES[0];
    const img = obs.type?.image ? getCachedImage(obs.type.image) : null;
    const color = obsType.color || "#ef4444";

    // TOP PILLAR
    drawPillarWithCap(ctx, obs.x, 0, obs.width, obs.topHeight, color, true);

    // BOTTOM PILLAR
    const groundY = height - groundHeight;
    drawPillarWithCap(ctx, obs.x, obs.bottomY, obs.width, groundY - obs.bottomY, color, false);

    // OBSTACLE ICON in the gap center
    const gapCenterY = obs.topHeight + (obs.bottomY - obs.topHeight) / 2;
    const iconSize = 36;

    // Draw a background circle for the icon
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.arc(obs.x + obs.width / 2, gapCenterY, iconSize * 0.7, 0, Math.PI * 2);
    ctx.fill();

    if (img) {
      ctx.drawImage(
        img,
        obs.x + obs.width / 2 - iconSize / 2,
        gapCenterY - iconSize / 2,
        iconSize,
        iconSize
      );
    } else {
      // Emoji fallback
      ctx.font = `${iconSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(obsType.emoji, obs.x + obs.width / 2, gapCenterY);
    }

    // Label
    ctx.fillStyle = "white";
    ctx.font = "bold 9px Arial";
    ctx.textAlign = "center";
    ctx.fillText(obsType.label, obs.x + obs.width / 2, gapCenterY + iconSize * 0.8);
    ctx.restore();
  });
}

function drawPillarWithCap(ctx, x, y, width, height, color, isTop) {
  if (height <= 0) return;

  // Main pillar body
  const grad = ctx.createLinearGradient(x, 0, x + width, 0);
  grad.addColorStop(0, darkenHex(color, 30));
  grad.addColorStop(0.3, color);
  grad.addColorStop(0.7, lightenHex(color, 20));
  grad.addColorStop(1, darkenHex(color, 20));
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, width, height);

  // Cap (wider platform at the opening end)
  const capH = 16;
  const capX = x - 5;
  const capW = width + 10;
  const capY = isTop ? y + height - capH : y;

  ctx.fillStyle = lightenHex(color, 10);
  ctx.fillRect(capX, capY, capW, capH);

  // Highlight on cap
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(capX, capY, capW, 3);

  // Border
  ctx.strokeStyle = darkenHex(color, 40);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, width, height);
  ctx.strokeRect(capX, capY, capW, capH);
}

// ============================================================
// PLAYER CHARACTER
// ============================================================

export function drawPlayer(ctx, player, charImg, charEmoji = "😊", isInvincible, frameCount) {
  const { CHAR_WIDTH, CHAR_HEIGHT } = GAME_CONFIG;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate((player.rotation * Math.PI) / 180);

  // Invincibility effect - golden glow + flicker
  if (isInvincible) {
    const flickerAlpha = 0.4 + 0.6 * Math.abs(Math.sin(frameCount * 0.3));
    ctx.globalAlpha = flickerAlpha;

    // Glow
    ctx.shadowColor = "#fbbf24";
    ctx.shadowBlur = 20;
  }

  // Wing flap animation
  const wingOffset = Math.sin(frameCount * 0.3) * 3;

  if (charImg) {
    // Draw character image
    ctx.drawImage(
      charImg,
      -CHAR_WIDTH / 2,
      -CHAR_HEIGHT / 2 + wingOffset,
      CHAR_WIDTH,
      CHAR_HEIGHT
    );
  } else {
    // Fallback: draw a cute bird-like shape
    drawFallbackBird(ctx, 0, wingOffset, CHAR_WIDTH, CHAR_HEIGHT, charEmoji);
  }

  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawFallbackBird(ctx, cx, cy, width, height, emoji) {
  // Body
  ctx.fillStyle = "#fbbf24";
  ctx.beginPath();
  ctx.ellipse(cx, cy, width * 0.4, height * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.ellipse(cx - width * 0.1, cy + height * 0.05, width * 0.25, height * 0.15, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eye
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(cx + width * 0.15, cy - height * 0.08, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(cx + width * 0.17, cy - height * 0.07, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.moveTo(cx + width * 0.35, cy);
  ctx.lineTo(cx + width * 0.5, cy - 4);
  ctx.lineTo(cx + width * 0.5, cy + 4);
  ctx.closePath();
  ctx.fill();
}

// ============================================================
// SCORE / HUD ON CANVAS
// ============================================================

export function drawScoreOverlay(ctx, score) {
  // Score in the center top
  ctx.save();
  ctx.font = 'bold 42px "Press Start 2P", Arial';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillText(score, GAME_CONFIG.WIDTH / 2 + 2, 24);

  // Main text
  ctx.fillStyle = "white";
  ctx.fillText(score, GAME_CONFIG.WIDTH / 2, 22);
  ctx.restore();
}

// ============================================================
// PARTICLES
// ============================================================

export function drawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = p.glow || 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

export function updateParticles(particles) {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      vy: p.vy + 0.1,
      alpha: p.alpha - p.decay,
      r: p.r * 0.98,
    }))
    .filter(p => p.alpha > 0 && p.r > 0.5);
}

export function createDeathParticles(x, y) {
  const colors = ["#ef4444", "#f97316", "#fbbf24", "#ffffff"];
  return Array.from({ length: 25 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10 - 3,
    r: 3 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    decay: 0.03,
    glow: 8,
  }));
}

export function createScoreParticle(x, y) {
  const colors = ["#fbbf24", "#22c55e", "#3b82f6", "#a78bfa"];
  return Array.from({ length: 8 }, () => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 5,
    vy: -2 - Math.random() * 3,
    r: 2 + Math.random() * 3,
    color: colors[Math.floor(Math.random() * colors.length)],
    alpha: 1,
    decay: 0.05,
    glow: 5,
  }));
}

// ============================================================
// COLOR HELPERS
// ============================================================

function lightenHex(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darkenHex(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}
