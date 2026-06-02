import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LETTERS = ["N", "i", "r", "p", "e", "s", "h"];

interface Spark {
  id: number;
  angle: number;
  dist: number;
  dur: number;
  size: number;
  delay: number;
  color: string;
}

const SPARKS: Spark[] = Array.from({ length: 32 }, (_, i) => ({
  id: i,
  angle: (i / 32) * 360 + Math.random() * 15,
  dist: 90 + Math.random() * 180,
  dur: 0.7 + Math.random() * 0.6,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 0.4,
  color: `hsl(${10 + Math.random() * 30}, 100%, ${50 + Math.random() * 20}%)`,
}));

export function LoadingScreen() {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2200),
      setTimeout(() => setVisible(false), 3500),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  const pct = phase < 2 ? "0%" : phase < 3 ? "42%" : phase < 4 ? "78%" : "100%";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,60,0,0.018) 2px, rgba(255,60,0,0.018) 4px)",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
            }}
          />

          {/* Expanding pulse rings */}
          {phase >= 2 && [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full pointer-events-none"
              style={{ border: `1px solid rgba(255,${60 - i * 18},0,0.3)` }}
              initial={{ width: "10vw", height: "10vw", opacity: 0.7 }}
              animate={{ width: "160vmax", height: "160vmax", opacity: 0 }}
              transition={{ duration: 2.6, delay: i * 0.3, ease: "easeOut", repeat: Infinity, repeatDelay: 0.8 }}
            />
          ))}

          {/* Ground glow line */}
          {phase >= 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute pointer-events-none"
              style={{
                width: "55vw",
                height: "2px",
                top: "calc(50% + 5.5rem)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "linear-gradient(90deg, transparent, #ff6600 20%, #ff2200 50%, #ff6600 80%, transparent)",
                boxShadow: "0 0 30px 8px rgba(255,80,0,0.5)",
                filter: "blur(0.5px)",
              }}
            />
          )}

          {/* Spark burst */}
          {phase === 2 && SPARKS.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: s.size,
                height: s.size,
                background: s.color,
                boxShadow: `0 0 8px 2px ${s.color}99`,
                top: "50%",
                left: "50%",
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((s.angle * Math.PI) / 180) * s.dist,
                y: Math.sin((s.angle * Math.PI) / 180) * s.dist,
                opacity: 0,
                scale: 0.2,
              }}
              transition={{ duration: s.dur, delay: s.delay, ease: "easeOut" }}
            />
          ))}

          {/* ── Main text ── */}
          <div className="relative z-20 flex flex-col items-center select-none" style={{ perspective: "800px" }}>

            {/* Letter row */}
            <div className="flex items-end">
              {LETTERS.map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 80, rotateX: -80 }}
                  animate={phase >= 1 ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="font-orbitron font-black leading-none"
                  style={{
                    fontSize: "clamp(3.8rem, 13vw, 10rem)",
                    letterSpacing: "-0.02em",
                    color: "transparent",
                    backgroundImage: "linear-gradient(160deg, #ffaa00 0%, #ff6600 30%, #ff2200 65%, #cc0000 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    paintOrder: "stroke fill",
                    filter:
                      "drop-shadow(0 0 14px rgba(255,80,0,0.8)) drop-shadow(0 0 35px rgba(255,30,0,0.5))",
                  }}
                >
                  {letter}
                </motion.span>
              ))}

              {/* "ai" badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.4, y: 20 }}
                animate={phase >= 2 ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.08, ease: "backOut" }}
                className="font-orbitron font-bold self-end leading-none"
                style={{
                  fontSize: "clamp(0.9rem, 3vw, 2.4rem)",
                  marginBottom: "0.55em",
                  marginLeft: "0.1em",
                  letterSpacing: "0.08em",
                  color: "transparent",
                  backgroundImage: "linear-gradient(135deg, #ffffff 0%, #ffcc00 40%, #ff8800 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(255,180,0,0.9))",
                }}
              >
                ai
              </motion.span>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="font-orbitron font-semibold uppercase tracking-[0.45em] mt-3 text-center"
              style={{
                fontSize: "clamp(0.5rem, 1.4vw, 0.8rem)",
                color: "#ff8800",
                textShadow: "0 0 14px rgba(255,120,0,0.9), 0 0 40px rgba(255,60,0,0.5)",
              }}
            >
              The Intelligence Behind Tomorrow
            </motion.p>

            {/* Glitch overlay — separate from gradient text so it doesn't break clip */}
            {phase >= 2 && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    x: [0, -4, 3, -2, 0, 0, 0, 0, 0, 0],
                    opacity: [0, 0.5, 0.5, 0.5, 0, 0, 0, 0, 0, 0],
                    skewX: [0, -3, 3, -2, 0, 0, 0, 0, 0, 0],
                  }}
                  transition={{ duration: 0.14, delay: 2.5, repeat: Infinity, repeatDelay: 3.2 }}
                  style={{
                    background: "rgba(255,40,0,0.08)",
                    clipPath: "polygon(0 25%, 100% 25%, 100% 55%, 0 55%)",
                  }}
                />
              </div>
            )}
          </div>

          {/* Loading bar */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
            style={{
              width: "clamp(160px, 26vw, 280px)",
              height: "3px",
              background: "rgba(255,60,0,0.12)",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 3.2, ease: [0.4, 0, 0.2, 1] }}
              className="h-full w-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #aa1100, #ff4400, #ff9900, #ffdd00)",
                boxShadow: "0 0 12px 3px rgba(255,100,0,0.7)",
              }}
            />
          </div>

          {/* Corner brackets */}
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <motion.div
              key={pos}
              className="absolute pointer-events-none"
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                top: pos[0] === "t" ? "1.5rem" : "auto",
                bottom: pos[0] === "b" ? "1.5rem" : "auto",
                left: pos[1] === "l" ? "1.5rem" : "auto",
                right: pos[1] === "r" ? "1.5rem" : "auto",
                width: "1.8rem",
                height: "1.8rem",
                borderTop: pos[0] === "t" ? "2px solid rgba(255,80,0,0.5)" : "none",
                borderBottom: pos[0] === "b" ? "2px solid rgba(255,80,0,0.5)" : "none",
                borderLeft: pos[1] === "l" ? "2px solid rgba(255,80,0,0.5)" : "none",
                borderRight: pos[1] === "r" ? "2px solid rgba(255,80,0,0.5)" : "none",
              }}
            />
          ))}

          {/* % counter */}
          <motion.span
            className="absolute bottom-14 right-8 font-mono text-xs font-bold"
            initial={{ opacity: 0 }}
            animate={phase >= 1 ? { opacity: 1 } : {}}
            style={{ color: "rgba(255,100,0,0.55)", letterSpacing: "0.1em" }}
          >
            {pct}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
