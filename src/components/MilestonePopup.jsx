// ============================================================
// MILESTONE POPUP
// Shows a popup when a milestone is triggered
// ============================================================

import React, { useEffect, useState } from "react";

export default function MilestonePopup({ milestone, onDone }) {
  const [phase, setPhase] = useState("in"); // "in" | "hold" | "out"

  useEffect(() => {
    const holdDuration = milestone.isEgg ? 2000 : 2800;

    const holdTimer = setTimeout(() => {
      setPhase("out");
    }, holdDuration);

    const doneTimer = setTimeout(() => {
      onDone?.();
    }, holdDuration + 400);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [milestone, onDone]);

  const color = milestone.color || "#fbbf24";
  const isEgg = milestone.isEgg;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 pointer-events-none`}
      style={{ perspective: "800px" }}
    >
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, transparent 70%)",
          opacity: phase === "out" ? 0 : 1,
        }}
      />

      {/* Popup card */}
      <div
        className={`relative px-8 py-6 rounded-3xl text-center max-w-sm mx-4 shadow-2xl
          ${phase === "in" ? "milestone-in" : phase === "out" ? "milestone-out" : ""}`}
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.9), rgba(30,30,60,0.95))`,
          border: `3px solid ${color}`,
          boxShadow: `0 0 40px ${color}60, 0 20px 60px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Icon/emoji on top */}
        <div
          className="text-5xl mb-3"
          style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }}
        >
          {isEgg ? "🥚" : getMilestoneIcon(milestone.effect)}
        </div>

        {/* Score badge */}
        {!isEgg && (
          <div
            className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-3"
            style={{
              background: `${color}25`,
              border: `1px solid ${color}80`,
              color: color,
              fontFamily: "'Press Start 2P', cursive",
              fontSize: "10px",
            }}
          >
            MILESTONE UNLOCKED
          </div>
        )}

        {/* Main message */}
        <div
          className="text-white font-bold text-lg leading-tight mb-2"
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: "clamp(16px, 4vw, 22px)",
            textShadow: `0 0 20px ${color}`,
          }}
        >
          {milestone.message}
        </div>

        {/* Sub text */}
        {milestone.subtext && (
          <div
            className="text-sm mt-2"
            style={{ color: `${color}cc`, fontFamily: "'Nunito', sans-serif" }}
          >
            {milestone.subtext}
          </div>
        )}

        {/* Decorative lines */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-px" style={{ background: `${color}40` }} />
          <span style={{ color: `${color}80`, fontSize: "10px" }}>✦ ✦ ✦</span>
          <div className="flex-1 h-px" style={{ background: `${color}40` }} />
        </div>
      </div>
    </div>
  );
}

function getMilestoneIcon(effect) {
  const icons = {
    slow: "🐌",
    invincible: "🛡️",
    speedup: "⚡",
    smallgap: "😰",
    legend: "🏆",
  };
  return icons[effect] || "🎉";
}
