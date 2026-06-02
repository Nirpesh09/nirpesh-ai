import { motion } from "framer-motion";

const ORBIT_ITEMS = [
  { label: "neural.fit()", color: "#00ffcc", ring: 0 },
  { label: "∇loss → 0", color: "#ff8800", ring: 0 },
  { label: "embed()", color: "#aa44ff", ring: 0 },
  { label: "softmax", color: "#00ccff", ring: 1 },
  { label: "backprop", color: "#ff4466", ring: 1 },
  { label: "tokenize", color: "#44ffaa", ring: 1 },
  { label: "attention", color: "#ffcc00", ring: 1 },
  { label: "Q·Kᵀ/√d", color: "#ff6600", ring: 2 },
  { label: "RLHF", color: "#00ff88", ring: 2 },
  { label: "dropout()", color: "#cc88ff", ring: 2 },
  { label: "forward(x)", color: "#00aaff", ring: 2 },
  { label: "argmax()", color: "#ff8844", ring: 2 },
];

const RING_RADII = [90, 155, 210];
const RING_DURATION = [14, 22, 30];
const RING_TILT = [12, 20, 28];

export function CodeOrbit3D({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const byRing = ORBIT_ITEMS.reduce<Record<number, typeof ORBIT_ITEMS>>((acc, item) => {
    if (!acc[item.ring]) acc[item.ring] = [];
    acc[item.ring].push(item);
    return acc;
  }, {});

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: "700px" }}
    >
      <div style={{ transformStyle: "preserve-3d", position: "relative", width: 500, height: 500 }}>

        {/* Core sphere */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 60,
            top: "50%",
            left: "50%",
            marginTop: -30,
            marginLeft: -30,
            background: "radial-gradient(circle at 35% 35%, #44ffcc, #0055aa)",
            boxShadow: "0 0 30px #00ffcc88, 0 0 60px #0088ff44",
          }}
          animate={{ scale: [1, 1.12, 1], rotateZ: [0, 360] }}
          transition={{ scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }, rotateZ: { duration: 8, repeat: Infinity, ease: "linear" } }}
        />

        {/* "N" center label */}
        <div
          className="absolute font-orbitron font-black text-white pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: 22,
            textShadow: "0 0 20px #00ffcc",
            zIndex: 10,
          }}
        >
          N
        </div>

        {/* Rings */}
        {Object.entries(byRing).map(([ringStr, items]) => {
          const ring = Number(ringStr);
          const r = RING_RADII[ring];
          const dur = RING_DURATION[ring];
          const tilt = RING_TILT[ring];

          return (
            <motion.div
              key={ring}
              className="absolute"
              style={{
                width: r * 2,
                height: r * 2,
                top: "50%",
                left: "50%",
                marginTop: -r,
                marginLeft: -r,
                transformStyle: "preserve-3d",
                transform: `rotateX(${tilt}deg) rotateZ(${ring * 45}deg)`,
              }}
              animate={{ rotateZ: [ring * 45, ring * 45 + (ring % 2 === 0 ? 360 : -360)] }}
              transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
            >
              {/* Orbit ring circle */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px solid rgba(0,255,200,0.12)`,
                  boxShadow: "inset 0 0 8px rgba(0,255,200,0.04)",
                }}
              />

              {/* Items on this ring */}
              {items.map((item, j) => {
                const deg = (j / items.length) * 360;
                const rad = (deg * Math.PI) / 180;
                const x = r + r * Math.cos(rad) - 44;
                const y = r + r * Math.sin(rad) - 14;

                return (
                  <motion.div
                    key={j}
                    className="absolute font-mono font-bold text-xs rounded-lg px-2.5 py-1 pointer-events-none"
                    style={{
                      left: x,
                      top: y,
                      color: item.color,
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}33`,
                      boxShadow: `0 0 10px ${item.color}44`,
                      whiteSpace: "nowrap",
                      fontSize: "0.7rem",
                    }}
                    animate={{ rotateZ: [0, ring % 2 === 0 ? -360 : 360] }}
                    transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                  >
                    {item.label}
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
