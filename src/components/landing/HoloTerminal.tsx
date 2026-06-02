import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const LINES = [
  { prompt: "nirpesh@ai:~$", cmd: " init --model=gpt-nirpesh-v3", out: null },
  { prompt: null, cmd: null, out: "► Loading neural weights... [██████████] 100%" },
  { prompt: null, cmd: null, out: "► Context window: 256K tokens ✓" },
  { prompt: null, cmd: null, out: "► RLHF alignment layer: active ✓" },
  { prompt: "nirpesh@ai:~$", cmd: " predict --input='Build the future'", out: null },
  { prompt: null, cmd: null, out: "► Tokenizing input [18 tokens]..." },
  { prompt: null, cmd: null, out: "► Running attention × 32 heads..." },
  { prompt: null, cmd: null, out: "► Output: ∞ possibilities computed." },
  { prompt: "nirpesh@ai:~$", cmd: " status --verbose", out: null },
  { prompt: null, cmd: null, out: "► Uptime: 99.9% | Latency: 42ms | Load: optimal" },
  { prompt: null, cmd: null, out: "► Model: NIRPESH-ULTRA-v3.1 | Ready ✓" },
  { prompt: "nirpesh@ai:~$", cmd: " _", out: null },
];

const CHAR_SPEED = 28; // ms per char
const LINE_GAP = 180;  // ms between lines

export function HoloTerminal({ className = "" }: { className?: string }) {
  type Line = { prompt: string | null; cmd: string | null; out: string | null };
  const [visibleLines, setVisibleLines] = useState<Line[]>([]);
  const [typed, setTyped] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= LINES.length) { setDone(true); return; }

    const line = LINES[lineIdx];
    const text = line.cmd ?? line.out ?? "";

    if (charIdx < text.length) {
      const t = setTimeout(() => {
        setTyped(text.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, CHAR_SPEED);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((v) => [...v, { ...line, cmd: line.cmd ? text : line.cmd, out: line.out ? text : line.out }]);
        setTyped("");
        setCharIdx(0);
        setLineIdx((l) => l + 1);
      }, LINE_GAP);
      return () => clearTimeout(t);
    }
  }, [lineIdx, charIdx, done]);

  // Restart loop
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setVisibleLines([]);
      setTyped("");
      setLineIdx(0);
      setCharIdx(0);
      setDone(false);
    }, 3500);
    return () => clearTimeout(t);
  }, [done]);

  const currentLine = LINES[lineIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative rounded-xl overflow-hidden select-none ${className}`}
      style={{
        background: "rgba(6, 8, 16, 0.96)",
        border: "1px solid rgba(0,255,204,0.2)",
        boxShadow: "0 0 40px rgba(0,255,204,0.1), 0 0 80px rgba(0,100,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        transform: "perspective(900px) rotateX(3deg)",
        transformOrigin: "50% 0%",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.015) 2px, rgba(0,255,204,0.015) 4px)",
        }}
      />

      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(0,255,204,0.12)", background: "rgba(0,0,0,0.6)" }}
      >
        {["#ff5f56","#ffbd2e","#27c93f"].map((c) => (
          <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
        ))}
        <span className="ml-3 font-mono text-xs" style={{ color: "rgba(0,255,204,0.6)" }}>
          nirpesh-ai — inference engine — bash
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs text-green-400/70">LIVE</span>
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-sm" style={{ minHeight: 300, color: "#ccffee" }}>
        {visibleLines.map((line, i) => (
          <div key={i} className="mb-1 leading-relaxed">
            {line.prompt && (
              <>
                <span style={{ color: "#00ffcc" }}>{line.prompt}</span>
                <span style={{ color: "#ffffff" }}>{line.cmd}</span>
              </>
            )}
            {!line.prompt && line.out && (
              <span style={{ color: "rgba(0,255,180,0.65)", fontSize: "0.85em" }}>{line.out}</span>
            )}
          </div>
        ))}

        {/* Currently typing */}
        {!done && currentLine && (
          <div className="mb-1 leading-relaxed">
            {currentLine.prompt && (
              <>
                <span style={{ color: "#00ffcc" }}>{currentLine.prompt}</span>
                <span style={{ color: "#ffffff" }}>{typed}</span>
                <span
                  className="inline-block w-2 h-4 ml-0.5 align-middle animate-pulse"
                  style={{ background: "#00ffcc", marginBottom: 1 }}
                />
              </>
            )}
            {!currentLine.prompt && (
              <span style={{ color: "rgba(0,255,180,0.65)", fontSize: "0.85em" }}>
                {typed}
                <span className="inline-block w-1.5 h-3 ml-0.5 align-middle animate-pulse" style={{ background: "#00ffcc88" }} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div
        className="px-4 py-2 flex items-center gap-4 border-t"
        style={{ borderColor: "rgba(0,255,204,0.1)", background: "rgba(0,255,204,0.04)" }}
      >
        <span className="font-mono text-xs" style={{ color: "rgba(0,255,204,0.4)" }}>bash</span>
        <span className="font-mono text-xs ml-auto" style={{ color: "rgba(0,255,204,0.4)" }}>
          NIRPESH-ULTRA-v3.1 · UTF-8
        </span>
      </div>
    </motion.div>
  );
}
