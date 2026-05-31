// ============================================================
// FIREWORKS COMPONENT
// Full-screen fireworks animation using Canvas
// ============================================================

import React, { useEffect, useRef } from "react";

export default function Fireworks({ active }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = [
      "#fbbf24", "#f97316", "#ef4444", "#a78bfa",
      "#3b82f6", "#22c55e", "#ec4899", "#ffffff",
    ];

    function launchFirework() {
      const x = Math.random() * canvas.width;
      const y = canvas.height * 0.2 + Math.random() * canvas.height * 0.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const count = 60 + Math.floor(Math.random() * 40);

      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 2,
          color,
          r: 2 + Math.random() * 3,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.01,
          gravity: 0.08,
          trail: [],
        });
      }
    }

    let lastLaunch = 0;
    const launchInterval = 600;

    function loop(timestamp) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Launch fireworks periodically
      if (timestamp - lastLaunch > launchInterval) {
        launchFirework();
        if (Math.random() > 0.5) launchFirework();
        lastLaunch = timestamp;
      }

      // Update & draw particles
      particlesRef.current = particlesRef.current.filter(p => p.alpha > 0);
      particlesRef.current.forEach(p => {
        // Store trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 5) p.trail.shift();

        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        // Draw trail
        p.trail.forEach((pt, i) => {
          ctx.save();
          ctx.globalAlpha = (p.alpha * i) / p.trail.length * 0.5;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      particlesRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
