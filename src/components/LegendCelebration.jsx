// ============================================================
// LEGEND CELEBRATION COMPONENT
// Handles the score-50 special event:
//   1. Fade to black
//   2. Play legend.mp4 video
//   3. Show fireworks + "LEGEND STATUS ACHIEVED"
//   4. Let player continue
// ============================================================

import React, { useEffect, useRef, useState } from "react";
import Fireworks from "./Fireworks.jsx";

const PHASES = {
  FADE_IN: "fade_in",       // Fade screen to black
  VIDEO: "video",           // Play video
  CELEBRATION: "celebration", // Fireworks + message
  DONE: "done",
};

export default function LegendCelebration({ onContinue }) {
  const [phase, setPhase] = useState(PHASES.FADE_IN);
  const [blackOpacity, setBlackOpacity] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const videoRef = useRef(null);

  // Phase 1: Fade to black over 1 second
  useEffect(() => {
    let start = null;
    const duration = 1000;

    function animate(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setBlackOpacity(progress);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setPhase(PHASES.VIDEO);
      }
    }

    requestAnimationFrame(animate);
  }, []);

  // Phase 2: Attempt video, fallback to celebration
  useEffect(() => {
    if (phase !== PHASES.VIDEO) return;

    const video = videoRef.current;
    if (!video) {
      // No video element, jump to celebration
      setTimeout(() => setPhase(PHASES.CELEBRATION), 500);
      return;
    }

    video.play().catch(() => {
      // Video failed (no file), jump to celebration
      setPhase(PHASES.CELEBRATION);
    });

    video.onended = () => {
      setPhase(PHASES.CELEBRATION);
    };
  }, [phase]);

  // Phase 3: Show message after short delay
  useEffect(() => {
    if (phase !== PHASES.CELEBRATION) return;
    const timer = setTimeout(() => setShowMessage(true), 600);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleContinue = () => {
    setPhase(PHASES.DONE);
    onContinue?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Black overlay */}
      <div
        className="absolute inset-0 bg-black transition-opacity"
        style={{ opacity: blackOpacity, pointerEvents: phase === PHASES.DONE ? "none" : "auto" }}
      />

      {/* VIDEO PHASE */}
      {phase === PHASES.VIDEO && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          src="/videos/legend.mp4"
          playsInline
          autoPlay
          onError={() => setPhase(PHASES.CELEBRATION)}
        />
      )}

      {/* CELEBRATION PHASE */}
      {phase === PHASES.CELEBRATION && (
        <>
          <Fireworks active={true} />

          {showMessage && (
            <div className="relative z-50 flex flex-col items-center text-center px-6 milestone-in">
              {/* Trophy */}
              <div
                className="text-8xl mb-4"
                style={{
                  filter: "drop-shadow(0 0 30px gold)",
                  animation: "float 2s ease-in-out infinite",
                }}
              >
                🏆
              </div>

              {/* Legend text */}
              <div
                className="legend-text text-center mb-2"
                style={{
                  fontSize: "clamp(20px, 5vw, 36px)",
                  letterSpacing: "2px",
                  lineHeight: 1.3,
                }}
              >
                LEGEND STATUS
                <br />
                ACHIEVED
              </div>

              {/* Subtitle */}
              <div
                className="text-yellow-200 text-lg mb-6 mt-3"
                style={{ fontFamily: "'Fredoka One', cursive", opacity: 0.9 }}
              >
                You absolute madlad! 🎓✨
              </div>

              {/* Sparkles */}
              <div className="flex gap-3 text-3xl mb-8">
                {"⭐✨🌟💫⭐✨🌟".split("").map((s, i) => (
                  <span
                    key={i}
                    style={{
                      animation: `float ${1 + i * 0.2}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Continue button */}
              <button
                onClick={handleContinue}
                className="game-btn-primary text-lg px-8 py-3"
                style={{
                  fontFamily: "'Fredoka One', cursive",
                  background: "gold",
                  color: "#1a1a2e",
                  border: "3px solid #f59e0b",
                  boxShadow: "0 0 30px gold, 0 5px 0 #92400e",
                  fontSize: "1.1rem",
                }}
              >
                🚀 CONTINUE THE LEGEND
              </button>

              <div className="text-white text-opacity-40 text-xs mt-4">
                Your name will be remembered in the halls of college history
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
