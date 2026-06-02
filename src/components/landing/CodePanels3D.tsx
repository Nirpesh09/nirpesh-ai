import { motion } from "framer-motion";

const PANELS = [
  {
    title: "neural_network.py",
    lang: "python",
    color: "#00ffcc",
    code: [
      { t: "kw", v: "class" },    { t: "sp", v: " " },
      { t: "fn", v: "NirpeshModel" }, { t: "txt", v: ":" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "def" }, { t: "sp", v: " " },
      { t: "fn", v: "__init__" }, { t: "txt", v: "(self, layers):" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "fn", v: "super" }, { t: "txt", v: "().__init__()" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "self.layers = nn." },
      { t: "fn", v: "Sequential" }, { t: "txt", v: "(*layers)" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "self.attn = " },
      { t: "fn", v: "MultiHeadAttn" }, { t: "txt", v: "(512, 8)" },
      { t: "br", v: "" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "def" }, { t: "sp", v: " " },
      { t: "fn", v: "forward" }, { t: "txt", v: "(self, x):" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "kw", v: "return" },
      { t: "txt", v: " self.attn(self.layers(x))" },
    ],
  },
  {
    title: "inference.ts",
    lang: "typescript",
    color: "#ff8800",
    code: [
      { t: "kw", v: "async" }, { t: "sp", v: " " },
      { t: "kw", v: "function" }, { t: "sp", v: " " },
      { t: "fn", v: "predict" },
      { t: "txt", v: "(prompt: " }, { t: "kw", v: "string" }, { t: "txt", v: ") {" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "const" }, { t: "txt", v: " tokens = " },
      { t: "fn", v: "tokenize" }, { t: "txt", v: "(prompt);" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "const" }, { t: "txt", v: " emb = " },
      { t: "kw", v: "await" }, { t: "txt", v: " model." },
      { t: "fn", v: "embed" }, { t: "txt", v: "(tokens);" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "const" }, { t: "txt", v: " logits = " },
      { t: "kw", v: "await" }, { t: "txt", v: " model." },
      { t: "fn", v: "decode" }, { t: "txt", v: "(emb);" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "return" }, { t: "sp", v: " " },
      { t: "fn", v: "softmax" }, { t: "txt", v: "(logits);" },
      { t: "br", v: "" },
      { t: "txt", v: "}" },
    ],
  },
  {
    title: "train.py",
    lang: "python",
    color: "#aa44ff",
    code: [
      { t: "kw", v: "for" }, { t: "txt", v: " epoch " },
      { t: "kw", v: "in" }, { t: "txt", v: " " },
      { t: "fn", v: "range" }, { t: "txt", v: "(100):" },
      { t: "br", v: "" },
      { t: "sp", v: "  " }, { t: "kw", v: "for" },
      { t: "txt", v: " x, y " }, { t: "kw", v: "in" },
      { t: "txt", v: " loader:" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "optimizer." },
      { t: "fn", v: "zero_grad" }, { t: "txt", v: "()" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "pred = model(x)" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "loss = F." },
      { t: "fn", v: "cross_entropy" }, { t: "txt", v: "(pred, y)" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "loss." },
      { t: "fn", v: "backward" }, { t: "txt", v: "()" },
      { t: "br", v: "" },
      { t: "sp", v: "    " }, { t: "txt", v: "optimizer." },
      { t: "fn", v: "step" }, { t: "txt", v: "()" },
    ],
  },
];

type Token = { t: string; v: string };

function renderCode(code: Token[], accentColor: string) {
  return code.map((tok, i) => {
    if (tok.t === "br") return <br key={i} />;
    if (tok.t === "sp") return <span key={i}>{tok.v}</span>;
    if (tok.t === "kw")
      return <span key={i} style={{ color: accentColor, fontWeight: 700 }}>{tok.v}</span>;
    if (tok.t === "fn")
      return <span key={i} style={{ color: "#ffffff" }}>{tok.v}</span>;
    return <span key={i} style={{ color: "#aaaaaa" }}>{tok.v}</span>;
  });
}

interface PanelProps {
  panel: typeof PANELS[number];
  index: number;
  total: number;
}

function CodePanel({ panel, index, total }: PanelProps) {
  const angle = (index / total) * 360;
  const radius = 320;
  const tiltY = index % 2 === 0 ? 6 : -6;

  return (
    <motion.div
      className="absolute"
      style={{
        width: 300,
        left: "50%",
        top: "50%",
        marginLeft: -150,
        marginTop: -130,
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateY: [angle, angle + 360],
        z: [0, 20, 0],
      }}
      transition={{
        rotateY: { duration: 22 + index * 4, repeat: Infinity, ease: "linear" },
        z: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 1.2 },
      }}
    >
      {/* Inner — the actual panel that counter-rotates to stay readable */}
      <motion.div
        style={{
          transform: `translateX(${radius}px) rotateY(${tiltY}deg)`,
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: [0, 3, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
      >
        <div
          className="rounded-xl overflow-hidden select-none"
          style={{
            background: "rgba(10,10,18,0.92)",
            border: `1px solid ${panel.color}44`,
            boxShadow: `0 0 30px ${panel.color}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-2 px-4 py-2 border-b"
            style={{ borderColor: `${panel.color}22`, background: "rgba(0,0,0,0.4)" }}
          >
            <div className="flex gap-1.5">
              {["#ff5f56", "#ffbd2e", "#27c93f"].map((c) => (
                <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <span className="font-mono text-xs ml-2" style={{ color: panel.color + "cc" }}>
              {panel.title}
            </span>
          </div>

          {/* Code body */}
          <div className="px-4 py-3" style={{ minHeight: 160 }}>
            {/* Line numbers + code */}
            <div className="flex gap-4 font-mono text-xs leading-relaxed">
              <div className="flex flex-col items-end" style={{ color: "rgba(255,255,255,0.15)", userSelect: "none" }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <div className="flex-1 overflow-hidden">
                {renderCode(panel.code, panel.color)}
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div
            className="px-4 py-1 flex items-center gap-3"
            style={{
              background: `${panel.color}11`,
              borderTop: `1px solid ${panel.color}22`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: panel.color }} />
            <span className="font-mono text-xs" style={{ color: panel.color + "99" }}>
              {panel.lang} • AI inference engine
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CodePanels3D({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{ perspective: "900px", perspectiveOrigin: "50% 50%" }}
    >
      <div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {PANELS.map((p, i) => (
          <CodePanel key={i} panel={p} index={i} total={PANELS.length} />
        ))}
      </div>
    </div>
  );
}
