// ============================================================
// CHARACTER SELECTION SCREEN
// ============================================================

import React, { useState } from "react";
import { CHARACTERS } from "../utils/constants.js";
import { loadGameData } from "../utils/storage.js";

export default function CharacterSelect({ onSelect }) {
  const [selected, setSelected] = useState(CHARACTERS[0]);
  const [hoveredId, setHoveredId] = useState(null);
  const savedData = loadGameData();

  const handleStart = () => {
    if (selected) onSelect(selected);
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        minHeight: "100dvh",
      }}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animation: `pulse ${1 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Game title */}
      <div className="relative z-10 mb-8 text-center px-4">
        <div
          className="text-4xl sm:text-5xl font-bold mb-2"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            color: "#fbbf24",
            textShadow: "0 0 20px #fbbf24, 0 0 40px #f97316, 3px 3px 0 rgba(0,0,0,0.8)",
            animation: "legendPulse 2s ease-in-out infinite",
            letterSpacing: "-1px",
            fontSize: "clamp(18px, 5vw, 36px)",
          }}
        >
          PARIVARIK FLAPPY
        </div>
        <div
          className="text-lg sm:text-xl text-yellow-300"
          style={{
            fontFamily: "'Fredoka One', cursive",
            textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          🎓 College Edition 🎓
        </div>
      </div>

      {/* High score banner */}
      {savedData.highScore > 0 && (
        <div
          className="relative z-10 mb-6 px-6 py-2 rounded-full border border-yellow-500 border-opacity-50 text-center"
          style={{ background: "rgba(251,191,36,0.1)" }}
        >
          <span className="text-yellow-400 font-bold" style={{ fontFamily: "'Fredoka One', cursive" }}>
            🏆 Best: {savedData.highScore}
          </span>
          {savedData.highScorePlayer && (
            <span className="text-white text-opacity-70 text-sm ml-2">
              by {savedData.highScorePlayer}
            </span>
          )}
        </div>
      )}

      {/* Select character heading */}
      <div className="relative z-10 text-white text-opacity-80 mb-4 text-sm font-bold uppercase tracking-widest"
        style={{ fontFamily: "'Nunito', sans-serif" }}>
        Choose Your Character
      </div>

      {/* Character cards */}
      <div className="relative z-10 flex gap-3 mb-8 px-4 overflow-x-auto char-scroll w-full max-w-lg justify-center">
        {CHARACTERS.map((char) => {
          const isSelected = selected?.id === char.id;
          const isHovered = hoveredId === char.id;

          return (
            <button
              key={char.id}
              onClick={() => setSelected(char)}
              onMouseEnter={() => setHoveredId(char.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex-shrink-0 relative flex flex-col items-center rounded-2xl p-3 transition-all duration-200 cursor-pointer select-none"
              style={{
                width: 100,
                background: isSelected
                  ? `linear-gradient(135deg, ${char.color}40, ${char.color}20)`
                  : "rgba(255,255,255,0.05)",
                border: isSelected
                  ? `2px solid ${char.color}`
                  : "2px solid rgba(255,255,255,0.1)",
                transform: isSelected ? "scale(1.08) translateY(-4px)" : isHovered ? "scale(1.03)" : "scale(1)",
                boxShadow: isSelected ? `0 8px 24px ${char.color}60` : "none",
              }}
            >
              {/* Character avatar */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center mb-2 overflow-hidden"
                style={{ background: `${char.color}30` }}
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
                <div
                  className="hidden w-full h-full items-center justify-center text-4xl"
                  style={{ display: "none" }}
                >
                  {char.emoji}
                </div>
              </div>

              {/* Name */}
              <div
                className="text-white font-bold text-sm"
                style={{ fontFamily: "'Fredoka One', cursive" }}
              >
                {char.name}
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ background: char.color, boxShadow: `0 0 10px ${char.color}` }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected character info */}
      {selected && (
        <div
          className="relative z-10 mx-4 mb-6 px-5 py-3 rounded-2xl text-center max-w-xs"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <div
            className="text-lg font-bold mb-1"
            style={{ color: selected.color, fontFamily: "'Fredoka One', cursive" }}
          >
            {selected.emoji} {selected.name}
          </div>
          <div className="text-white text-opacity-60 text-xs">
            {selected.tagline}
          </div>
          <div className="text-white text-opacity-40 text-xs mt-2 italic">
            "{selected.messages[0]}"
          </div>
        </div>
      )}

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!selected}
        className="relative z-10 game-btn-primary text-xl px-10 py-4 animate-bounce-slow"
        style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.3rem" }}
      >
        🚀 START FLYING!
      </button>

      {/* Controls hint */}
      <div className="relative z-10 mt-4 text-white text-opacity-30 text-xs text-center px-4">
        SPACE / TAP / CLICK to flap • ESC to pause
      </div>

      {/* Version tag */}
      <div className="absolute bottom-3 right-4 text-white text-opacity-20 text-xs">
        v1.0 — Parivarik Edition
      </div>
    </div>
  );
}
