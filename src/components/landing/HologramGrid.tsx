import { motion } from "framer-motion";

const COLS = 12;
const ROWS = 8;
const NODES = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  return {
    id: i, col, row,
    delay: (col + row) * 0.06,
    color: (col + row) % 4 === 0 ? "#00ffcc" : (col + row) % 4 === 1 ? "#ff6600" : (col + row) % 4 === 2 ? "#aa44ff" : "#00aaff",
    lit: Math.random() > 0.55,
    size: 2 + Math.random() * 3,
  };
});

export function HologramGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        perspective: "800px",
      }}
    >
      {/* Main grid plane */}
      <motion.div
        initial={{ rotateX: 55, opacity: 0 }}
        whileInView={{ rotateX: 55, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        style={{
          transformOrigin: "50% 100%",
          transformStyle: "preserve-3d",
          position: "relative",
          padding: "20px 10px 60px",
        }}
      >
        {/* SVG grid lines */}
        <svg
          viewBox={`0 0 ${COLS * 52} ${ROWS * 52}`}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.15 }}
        >
          {Array.from({ length: COLS + 1 }, (_, i) => (
            <line key={`v${i}`} x1={i * 52} y1={0} x2={i * 52} y2={ROWS * 52} stroke="#00ffcc" strokeWidth={0.5} />
          ))}
          {Array.from({ length: ROWS + 1 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 52} x2={COLS * 52} y2={i * 52} stroke="#00ffcc" strokeWidth={0.5} />
          ))}
        </svg>

        {/* Grid nodes */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            gap: "28px 28px",
            padding: "10px",
          }}
        >
          {NODES.map((node) => (
            <motion.div
              key={node.id}
              className="relative flex items-center justify-center"
              animate={node.lit ? {
                opacity: [0.3, 1, 0.6, 1, 0.3],
                scale: [0.8, 1.4, 1, 1.2, 0.8],
              } : { opacity: [0.08, 0.18, 0.08] }}
              transition={{
                duration: node.lit ? 3 + Math.random() * 2 : 4 + Math.random() * 3,
                delay: node.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                style={{
                  width: node.size * 2,
                  height: node.size * 2,
                  borderRadius: "50%",
                  background: node.lit ? node.color : "#ffffff22",
                  boxShadow: node.lit ? `0 0 ${node.size * 4}px ${node.color}` : "none",
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Fade at top for depth */}
      <div
        className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, black, transparent)" }}
      />

      {/* Vertical beam lights */}
      {[0.2, 0.5, 0.8].map((x, i) => (
        <motion.div
          key={i}
          className="absolute top-0 bottom-0 w-px pointer-events-none"
          style={{
            left: `${x * 100}%`,
            background: `linear-gradient(to bottom, transparent, ${["#00ffcc","#ff6600","#aa44ff"][i]}66, transparent)`,
          }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 3, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
