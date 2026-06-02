import { motion } from "framer-motion";

const FACES = [
  { label: "front",  code: ["import AI", "from nirpesh", "model.run()", "→ output"], bg: "rgba(0,255,204,0.06)", border: "#00ffcc" },
  { label: "back",   code: ["loss = 0", "backward()", "step(lr=1e-4)", "epoch++"], bg: "rgba(255,100,0,0.06)", border: "#ff6600" },
  { label: "left",   code: ["encode(x)", "attention", "Q·Kᵀ/√d", "softmax"], bg: "rgba(170,68,255,0.06)", border: "#aa44ff" },
  { label: "right",  code: ["decode(z)", "generate", "sample(τ)", "detach()"], bg: "rgba(0,170,255,0.06)", border: "#00aaff" },
  { label: "top",    code: ["N=512 heads", "d_model=4096", "ctx=256K", "NIRPESH"], bg: "rgba(255,200,0,0.06)", border: "#ffcc00" },
  { label: "bottom", code: ["∇L(θ) → 0", "RLHF loop", "reward(r)", "align AI"], bg: "rgba(255,60,100,0.06)", border: "#ff3c64" },
];

const SIZE = 160;
const HALF = SIZE / 2;

const faceTransforms: Record<string, string> = {
  front:  `translateZ(${HALF}px)`,
  back:   `rotateY(180deg) translateZ(${HALF}px)`,
  left:   `rotateY(-90deg) translateZ(${HALF}px)`,
  right:  `rotateY(90deg) translateZ(${HALF}px)`,
  top:    `rotateX(90deg) translateZ(${HALF}px)`,
  bottom: `rotateX(-90deg) translateZ(${HALF}px)`,
};

export function CubeCode3D({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ perspective: "700px", width: SIZE + 80, height: SIZE + 80 }}
    >
      <motion.div
        animate={{ rotateX: [15, 25, 10, 20, 15], rotateY: [0, 360] }}
        transition={{
          rotateY: { duration: 18, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 9, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          width: SIZE,
          height: SIZE,
          position: "relative",
          transformStyle: "preserve-3d",
        }}
      >
        {FACES.map((face) => (
          <div
            key={face.label}
            style={{
              position: "absolute",
              inset: 0,
              transform: faceTransforms[face.label],
              background: face.bg,
              border: `1px solid ${face.border}44`,
              boxShadow: `inset 0 0 20px ${face.border}22, 0 0 15px ${face.border}22`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              borderRadius: 4,
              backfaceVisibility: "hidden",
            }}
          >
            {face.code.map((line, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: face.border,
                  textShadow: `0 0 6px ${face.border}`,
                  letterSpacing: "0.04em",
                  opacity: i === face.code.length - 1 ? 1 : 0.7,
                  fontWeight: i === face.code.length - 1 ? 700 : 400,
                }}
              >
                {line}
              </span>
            ))}
          </div>
        ))}

        {/* Glow at center */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 4,
          boxShadow: "0 0 40px rgba(0,255,204,0.15)",
          pointerEvents: "none",
        }} />
      </motion.div>
    </div>
  );
}
