// ============================================================
// GAME CANVAS COMPONENT
// Wraps the HTML5 canvas and game loop hook
// ============================================================

import React, { useRef, useEffect, useCallback } from "react";
import { GAME_CONFIG } from "../utils/constants.js";

export default function GameCanvas({ onCanvasReady, onTap }) {
  const canvasRef = useRef(null);

  // Report canvas element to parent
  useEffect(() => {
    if (canvasRef.current) {
      onCanvasReady?.(canvasRef.current);
    }
  }, [onCanvasReady]);

  // Responsive sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function resize() {
      const maxW = GAME_CONFIG.WIDTH;
      const maxH = GAME_CONFIG.HEIGHT;
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const scale = Math.min(winW / maxW, winH / maxH, 1);

      canvas.width = maxW;
      canvas.height = maxH;
      canvas.style.width = `${maxW * scale}px`;
      canvas.style.height = `${maxH * scale}px`;
    }

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handlePointer = useCallback((e) => {
    e.preventDefault();
    onTap?.();
  }, [onTap]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointer}
      className="block touch-none select-none"
      style={{
        imageRendering: "crisp-edges",
        cursor: "pointer",
        borderRadius: "12px",
        boxShadow: "0 0 0 3px rgba(255,255,255,0.08), 0 30px 80px rgba(0,0,0,0.8)",
      }}
    />
  );
}
