/** Pure canvas confetti burst — no extra dependencies. */
import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  shape: "rect" | "circle" | "star";
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];

function randomBetween(a: number, b: number) { return a + Math.random() * (b - a); }

export function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);

  const burst = (x?: number, y?: number) => {
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
      canvasRef.current = canvas;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const cx = x ?? window.innerWidth / 2;
    const cy = y ?? window.innerHeight * 0.4;

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: cx, y: cy,
      vx: randomBetween(-12, 12),
      vy: randomBetween(-18, -4),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: randomBetween(0, Math.PI * 2),
      rotationSpeed: randomBetween(-0.2, 0.2),
      size: randomBetween(5, 10),
      opacity: 1,
      shape: ["rect", "circle", "star"][Math.floor(Math.random() * 3)] as Particle["shape"],
    }));

    cancelAnimationFrame(animRef.current);
    let frame = 0;
    const TOTAL = 140;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      for (const p of particles) {
        p.vy += 0.45;   // gravity
        p.vx *= 0.99;   // air resistance
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - frame / TOTAL);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // 5-pointed star
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? p.size / 2 : p.size / 4;
            i === 0 ? ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r)
                    : ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (frame < TOTAL) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.remove();
        canvasRef.current = null;
      }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => { cancelAnimationFrame(animRef.current); canvasRef.current?.remove(); }, []);

  return burst;
}
