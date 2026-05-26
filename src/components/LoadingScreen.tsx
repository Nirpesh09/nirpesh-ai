import { useEffect, useRef, useState } from "react";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fade, setFade] = useState(false);

  // Matrix rain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 18);
    const drops: number[] = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコNIRPESH<>{}[]()=>+-*/&|!?;:";

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "13px monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = Math.random() > 0.8 ? 1 : 0.3;
        ctx.fillStyle = `rgba(34,197,94,${alpha})`;
        ctx.fillText(char, i * 18, y * 18);
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 45);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, []);

  // Auto-dismiss after 2s
  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
      style={{
        background: "#000",
        opacity: fade ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: fade ? "none" : "auto",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center gap-6 select-none">
        {/* Spinning N */}
        <div className="relative">
          <div
            className="h-24 w-24 rounded-3xl grid place-items-center"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7, #22c55e)",
              animation: "spinN 2s linear infinite",
              boxShadow: "0 0 60px rgba(168,85,247,0.6), 0 0 120px rgba(34,197,94,0.3)",
            }}
          >
            <span
              className="text-5xl font-black text-white"
              style={{ fontFamily: "var(--font-display)", textShadow: "0 2px 20px rgba(255,255,255,0.5)" }}
            >
              N
            </span>
          </div>
          {/* Orbiting dot */}
          <div
            className="absolute inset-0"
            style={{ animation: "orbit 1.5s linear infinite" }}
          >
            <div
              className="absolute h-3 w-3 rounded-full top-0 left-1/2 -translate-x-1/2 -translate-y-1.5"
              style={{ background: "#4ade80", boxShadow: "0 0 12px #4ade80" }}
            />
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1
            className="text-4xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, #ffffff, #a855f7, #4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            Nirpesh
          </h1>
          <p className="text-green-400/60 text-sm font-mono mt-1 animate-pulse">
            initializing AI engine…
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #7c3aed, #4ade80)",
              animation: "loadBar 1.8s ease-out forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes spinN {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes loadBar {
          0% { width: 0%; }
          60% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
