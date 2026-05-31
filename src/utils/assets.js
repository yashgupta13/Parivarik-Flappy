// ============================================================
// ASSET LOADER
// Preloads images and creates canvas-ready Image objects
// Falls back to emoji/canvas drawing if image missing
// ============================================================

const imageCache = new Map();
const audioCache = new Map();

/**
 * Load an image, returns a Promise<HTMLImageElement>
 * If the image fails to load, resolves with null (fallback to emoji)
 */
export function loadImage(src) {
  if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = () => {
      imageCache.set(src, null); // cache null so we don't retry
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Preload multiple images at once
 */
export async function preloadImages(srcs) {
  return Promise.all(srcs.map(loadImage));
}

/**
 * Load an audio file
 */
export function loadAudio(src) {
  if (audioCache.has(src)) return audioCache.get(src);

  const audio = new Audio();
  audio.src = src;
  audio.preload = "auto";
  audioCache.set(src, audio);
  return audio;
}

/**
 * Play a sound effect (fire and forget)
 */
export function playSound(src, volume = 0.5) {
  try {
    const audio = loadAudio(src);
    const clone = audio.cloneNode();
    clone.volume = Math.max(0, Math.min(1, volume));
    clone.play().catch(() => {});
  } catch {
    // Silently fail - sound is optional
  }
}

/**
 * Draw a character/obstacle fallback using emoji on canvas
 */
export function drawEmojiOnCanvas(ctx, emoji, x, y, size) {
  ctx.save();
  ctx.font = `${size}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, x, y);
  ctx.restore();
}

/**
 * Draw an image or fallback to emoji
 */
export function drawImageOrEmoji(ctx, img, emoji, x, y, width, height) {
  if (img) {
    ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
  } else {
    drawEmojiOnCanvas(ctx, emoji, x, y, Math.min(width, height) * 0.8);
  }
}

/**
 * Get cached image synchronously (returns null if not cached)
 */
export function getCachedImage(src) {
  return imageCache.get(src) || null;
}

// Color utility for drawing colored rectangles as fallback obstacles
export function drawPillar(ctx, x, y, width, height, color = "#4ade80", label = "") {
  // Main body
  const grad = ctx.createLinearGradient(x, 0, x + width, 0);
  grad.addColorStop(0, color);
  grad.addColorStop(0.5, lightenColor(color, 30));
  grad.addColorStop(1, darkenColor(color, 20));
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, width, height);

  // Border
  ctx.strokeStyle = darkenColor(color, 40);
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Label
  if (label) {
    ctx.save();
    ctx.fillStyle = "white";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + width / 2, y + height / 2);
    ctx.restore();
  }
}

function lightenColor(hex, amount) {
  return adjustColor(hex, amount);
}

function darkenColor(hex, amount) {
  return adjustColor(hex, -amount);
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `rgb(${r},${g},${b})`;
}
