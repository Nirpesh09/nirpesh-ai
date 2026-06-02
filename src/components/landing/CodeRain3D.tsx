import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]()=>+*%#@!&|^~;:";

interface Column {
  x: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  opacity: number;
  hue: number;
}

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function CodeRain3D({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    let cols: Column[] = [];
    let animId: number;

    function init() {
      if (!canvas || !ctx) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const count = Math.floor(canvas.width / (FONT_SIZE * 1.1));
      cols = Array.from({ length: count }, (_, i) => ({
        x: i * FONT_SIZE * 1.1,
        y: Math.random() * -canvas!.height,
        speed: 1.5 + Math.random() * 3.5,
        length: 8 + Math.floor(Math.random() * 20),
        chars: Array.from({ length: 30 }, () => randomChar()),
        opacity: 0.4 + Math.random() * 0.6,
        hue: Math.random() < 0.3 ? 30 : 165, // orange or cyan
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      cols.forEach((col) => {
        // Randomly mutate a char
        if (Math.random() < 0.05) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = randomChar();
        }

        for (let j = 0; j < col.length; j++) {
          const cy = col.y - j * FONT_SIZE;
          if (cy < 0 || cy > canvas.height) continue;

          const progress = j / col.length;
          const brightness = j === 0 ? 1 : (1 - progress) * 0.85;
          const alpha = brightness * col.opacity;

          if (j === 0) {
            ctx.fillStyle = `hsla(${col.hue}, 100%, 90%, ${alpha})`;
            ctx.shadowColor = col.hue === 30 ? "#ff8800" : "#00ffcc";
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = `hsla(${col.hue}, 90%, ${40 + brightness * 30}%, ${alpha})`;
            ctx.shadowBlur = 0;
          }

          ctx.font = `${FONT_SIZE}px monospace`;
          ctx.fillText(col.chars[j % col.chars.length], col.x, cy);
        }

        col.y += col.speed;
        if (col.y - col.length * FONT_SIZE > canvas.height) {
          col.y = Math.random() * -200;
          col.speed = 1.5 + Math.random() * 3.5;
          col.hue = Math.random() < 0.3 ? 30 : 165;
          col.opacity = 0.4 + Math.random() * 0.6;
          col.length = 8 + Math.floor(Math.random() * 20);
        }
      });

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    const resizeObserver = new ResizeObserver(() => { init(); });
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{
        transform: "perspective(600px) rotateX(20deg)",
        transformOrigin: "50% 0%",
      }}
    />
  );
}
