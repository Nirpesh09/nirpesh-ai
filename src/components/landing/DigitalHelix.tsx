import { motion } from "framer-motion";

const CODE_CHARS = "01アイウ{}[]∇λΩΨπΣ∞≈≠±√∫∂∑NIRPESH";

function randomChar() {
  return CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
}

const PAIRS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  charA: randomChar(),
  charB: randomChar(),
  color: i % 4 === 0 ? "#ff6600" : i % 4 === 1 ? "#00ffcc" : i % 4 === 2 ? "#aa44ff" : "#00aaff",
  delay: i * 0.06,
}));

export function DigitalHelix({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ perspective: "600px" }}
    >
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: "preserve-3d", position: "relative", width: 200, height: 440 }}
      >
        {PAIRS.map((pair, i) => {
          const y = (i / PAIRS.length) * 440;
          const angle = (i / PAIRS.length) * 720; // two full rotations = double helix
          const rad = (angle * Math.PI) / 180;
          const radius = 70;
          const xA = radius * Math.cos(rad);
          const xB = radius * Math.cos(rad + Math.PI);
          const zA = radius * Math.sin(rad);
          const zB = radius * Math.sin(rad + Math.PI);

          return (
            <div key={pair.id} style={{ position: "absolute", top: y, left: 100, transformStyle: "preserve-3d" }}>
              {/* Node A */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, delay: pair.delay, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  transform: `translate3d(${xA - 14}px, -10px, ${zA}px)`,
                  color: pair.color,
                  fontFamily: "monospace",
                  fontSize: 13,
                  fontWeight: 700,
                  textShadow: `0 0 8px ${pair.color}`,
                  whiteSpace: "nowrap",
                }}
              >
                {pair.charA}
              </motion.div>

              {/* Node B */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ duration: 2, delay: pair.delay + 0.3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  transform: `translate3d(${xB - 14}px, -10px, ${zB}px)`,
                  color: pair.color,
                  fontFamily: "monospace",
                  fontSize: 13,
                  fontWeight: 700,
                  textShadow: `0 0 8px ${pair.color}`,
                  whiteSpace: "nowrap",
                }}
              >
                {pair.charB}
              </motion.div>

              {/* Connecting bridge */}
              <div
                style={{
                  position: "absolute",
                  top: -1,
                  left: Math.min(xA, xB) - 14,
                  width: Math.abs(xA - xB) + 28,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${pair.color}66, transparent)`,
                  transform: `translateZ(${(zA + zB) / 2}px)`,
                }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
