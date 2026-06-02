import { useEffect, useRef } from "react";

const CHARS = "01アイウエオカキクケコNIRPESHAI∇λΩΨπΣ∞≈{}[]<>/\\|∂∑⊗⊕⊙⊚";

interface Props {
  opacity?: number;
  speed?: number;
  className?: string;
}

export function MatrixRain({ opacity = 0.85, speed = 1, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    let cols: number[] = [];
    let animId: number;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
      const numCols = Math.ceil(canvas!.width / FONT_SIZE);
      cols = Array.from({ length: numCols }, () => Math.floor(Math.random() * canvas!.height / FONT_SIZE));
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let last = 0;
    const INTERVAL = 40 / speed;

    function draw(ts: number) {
      animId = requestAnimationFrame(draw);
      if (ts - last < INTERVAL) return;
      last = ts;

      ctx!.fillStyle = "rgba(0,0,0,0.055)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < cols.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = cols[i] * FONT_SIZE;

        // Head char — bright
        const isNirpesh = char === "N" || char === "I" || char === "R" || char === "P";
        if (isNirpesh) {
          ctx!.fillStyle = `rgba(255, 100, 0, ${opacity})`;
        } else if (cols[i] % 7 === 0) {
          ctx!.fillStyle = `rgba(0, 255, 204, ${opacity})`;
        } else {
          ctx!.fillStyle = `rgba(0, 180, 100, ${opacity * 0.6})`;
        }
        ctx!.fillText(char, x, y);

        // Reset column when it hits bottom (random chance)
        if (y > canvas!.height && Math.random() > 0.975) {
          cols[i] = 0;
        } else {
          cols[i]++;
        }
      }
    }

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [opacity, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}
