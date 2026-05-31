// ============================================================
// GAME OVER SCREEN
// Shows score, death message, high score, restart button
// ============================================================

import React, { useEffect, useState } from "react";
import { loadGameData } from "../utils/storage.js";

export default function GameOver({ score, deathMessage, character, onRestart, onMenu }) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const freshData = loadGameData();
    setData(freshData);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const isNewRecord = data && score === data.highScore && score > 0;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <div
        className={`relative max-w-sm w-full rounded-3xl overflow-hidden transition-all duration-500
          ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-8"}`}
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          border: "2px solid rgba(255,255,255,0.15)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header gradient stripe */}
        <div
          className="h-2 w-full"
          style={{ background: "linear-gradient(90deg, #ef4444, #f97316, #fbbf24)" }}
        />

        <div className="p-6">
          {/* Death heading */}
          <div className="text-center mb-4">
            <div
              className="text-3xl font-bold text-red-400 mb-1"
              style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "clamp(14px, 5vw, 22px)" }}
            >
              GAME OVER
            </div>
            <div className="text-2xl">💀</div>
          </div>

          {/* Death message */}
          <div
            className="text-center py-3 px-4 rounded-xl mb-4"
            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            <div className="text-red-300 text-sm font-semibold" style={{ fontFamily: "'Nunito', sans-serif" }}>
              {deathMessage || "You crashed! 💥"}
            </div>
          </div>

          {/* Score display */}
          <div className="flex gap-3 mb-5">
            <div
              className="flex-1 text-center py-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div className="text-white text-opacity-60 text-xs uppercase tracking-wider mb-1"
                style={{ fontFamily: "'Nunito', sans-serif" }}>
                Score
              </div>
              <div
                className="text-white font-bold text-2xl"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                {score}
              </div>
            </div>

            <div
              className="flex-1 text-center py-3 rounded-xl"
              style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}
            >
              <div className="text-yellow-400 text-xs uppercase tracking-wider mb-1"
                style={{ fontFamily: "'Nunito', sans-serif" }}>
                Best
              </div>
              <div
                className="text-yellow-300 font-bold text-2xl"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
              >
                {data?.highScore || 0}
              </div>
            </div>
          </div>

          {/* New record banner */}
          {isNewRecord && (
            <div
              className="text-center py-2 px-4 rounded-xl mb-4 milestone-in"
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.2))",
                border: "1px solid rgba(251,191,36,0.5)",
              }}
            >
              <span className="text-yellow-300 font-bold text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
                🎉 NEW HIGH SCORE! 🎉
              </span>
              {data?.highScoreDate && (
                <div className="text-white text-opacity-40 text-xs mt-1">{data.highScoreDate}</div>
              )}
            </div>
          )}

          {/* Character played as */}
          {character && (
            <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="text-2xl">{character.emoji}</div>
              <div>
                <div className="text-white text-xs text-opacity-50">Played as</div>
                <div className="text-white font-semibold text-sm" style={{ fontFamily: "'Fredoka One', cursive" }}>
                  {character.name}
                </div>
              </div>
              <div className="ml-auto text-white text-opacity-30 text-xs italic">
                "{character.messages[Math.floor(Math.random() * character.messages.length)]}"
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="flex-1 game-btn-primary text-center"
              style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1rem" }}
            >
              🔄 Retry
            </button>
            <button
              onClick={onMenu}
              className="flex-1 game-btn-secondary text-center"
              style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1rem" }}
            >
              🏠 Menu
            </button>
          </div>

          {/* Total games */}
          {data?.totalGames > 1 && (
            <div className="text-center mt-3 text-white text-opacity-25 text-xs">
              Game #{data.totalGames}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
