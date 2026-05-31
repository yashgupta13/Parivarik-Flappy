// ============================================================
// GAME HUD OVERLAY
// Score, high score, character, pause/mute buttons
// ============================================================

import React from "react";

export default function GameHUD({
  score,
  highScore,
  character,
  isPaused,
  isMuted,
  onPause,
  onMute,
  onRestart,
  gameStarted,
}) {
  if (!gameStarted) return null;

  return (
    <>
      {/* Top bar: high score + buttons */}
      <div className="absolute top-0 left-0 right-0 flex items-start justify-between px-3 pt-3 pointer-events-none z-20">
        {/* Left: character + high score */}
        <div className="flex items-center gap-2">
          {character && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{
                background: "rgba(0,0,0,0.45)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span className="text-lg">{character.emoji}</span>
              <div>
                <div
                  className="text-white font-bold leading-none text-xs"
                  style={{ fontFamily: "'Fredoka One', cursive" }}
                >
                  {character.name}
                </div>
                <div
                  className="text-yellow-300 text-xs leading-none mt-0.5"
                  style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "8px" }}
                >
                  BEST: {highScore}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: control buttons */}
        <div className="flex gap-2 pointer-events-auto">
          {/* Mute */}
          <button
            onClick={onMute}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            title="Toggle sound"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

          {/* Pause */}
          <button
            onClick={onPause}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            title="Pause (ESC)"
          >
            {isPaused ? "▶️" : "⏸"}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all active:scale-90"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
            title="Restart"
          >
            🔄
          </button>
        </div>
      </div>

      {/* PAUSED overlay */}
      {isPaused && (
        <div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
        >
          <div
            className="text-white text-center px-8 py-5 rounded-2xl milestone-in"
            style={{
              background: "rgba(30,27,75,0.9)",
              border: "2px solid rgba(255,255,255,0.15)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
          >
            <div
              className="text-3xl mb-2"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(16px, 4vw, 28px)" }}
            >
              PAUSED
            </div>
            <div className="text-white text-opacity-50 text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Press ESC or tap ▶️ to resume
            </div>
            <div className="text-4xl mt-3">⏸️</div>
          </div>
        </div>
      )}
    </>
  );
}
