import { motion } from "framer-motion";
import { useMemo } from "react";

interface Node { id: string; x: number; y: number; color: string; size: number; label?: string; delay: number; }
interface Edge { from: string; to: string; color: string; idx: number; }

function buildNetwork() {
  const cols = [
    [50, 130, 210, 290],
    [80, 170, 260],
    [60, 150, 240, 330],
    [80, 180, 280],
    [100, 200, 300],
    [140, 240],
  ];
  const xPos = [40, 120, 210, 305, 400, 490];
  const COLORS = ["#00ffcc", "#ff6600", "#aa44ff", "#00aaff", "#ffcc00", "#ff4466"];
  const INPUT_LABELS = ["in", "tok", "emb", "pos"];
  const OUTPUT_LABELS = ["out", "cls"];

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let edgeIdx = 0;

  cols.forEach((ys, ci) => {
    ys.forEach((y, ni) => {
      nodes.push({
        id: `${ci}-${ni}`,
        x: xPos[ci],
        y,
        color: COLORS[ci],
        size: ci === 0 || ci === cols.length - 1 ? 8 : 5,
        label: ci === 0 ? INPUT_LABELS[ni] : ci === cols.length - 1 ? OUTPUT_LABELS[ni] : undefined,
        delay: ni * 0.15 + ci * 0.05,
      });
      if (ci > 0) {
        const prevCount = cols[ci - 1].length;
        for (let pi = 0; pi < prevCount; pi++) {
          if (Math.random() > 0.3) {
            edges.push({ from: `${ci - 1}-${pi}`, to: `${ci}-${ni}`, color: COLORS[ci - 1], idx: edgeIdx++ });
          }
        }
      }
    });
  });

  return { nodes, edges };
}

export function NeuralNet3D({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const { nodes, edges } = useMemo(() => buildNetwork(), []);
  const nodeMap = useMemo(() => {
    const m: Record<string, Node> = {};
    nodes.forEach((n) => { m[n.id] = n; });
    return m;
  }, [nodes]);

  return (
    <div
      className={`relative ${className}`}
      style={{
        transform: "perspective(700px) rotateX(6deg) rotateY(-3deg)",
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      <svg viewBox="0 0 540 400" className="w-full h-full" style={{ overflow: "visible" }}>
        <defs>
          <style>{`
            @keyframes pulseNode {
              0%, 100% { opacity: 0.6; r: inherit; }
              50% { opacity: 1; }
            }
            @keyframes edgePulse {
              0%, 100% { stroke-opacity: 0.12; }
              50% { stroke-opacity: 0.45; }
            }
          `}</style>
        </defs>

        {/* Edges */}
        {edges.map((edge) => {
          const a = nodeMap[edge.from];
          const b = nodeMap[edge.to];
          if (!a || !b) return null;
          const dur = 2.5 + (edge.idx % 5) * 0.4;
          const del = (edge.idx % 8) * 0.15;
          return (
            <line
              key={edge.idx}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={edge.color}
              strokeWidth={0.8}
              style={{
                animation: `edgePulse ${dur}s ${del}s infinite ease-in-out`,
              }}
            />
          );
        })}

        {/* Signal pulses — use motion.g + translate to avoid SVG attr issues */}
        {edges.filter((_, i) => i % 4 === 0).map((edge) => {
          const a = nodeMap[edge.from];
          const b = nodeMap[edge.to];
          if (!a || !b) return null;
          return (
            <motion.g
              key={`pulse-${edge.idx}`}
              animate={{
                x: [a.x, b.x, a.x],
                y: [a.y, b.y, a.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.8,
                delay: edge.idx * 0.35,
                repeat: Infinity,
                repeatDelay: 1.5 + (edge.idx % 4) * 0.5,
                ease: "easeInOut",
              }}
            >
              <circle r={3} fill={edge.color} style={{ filter: `drop-shadow(0 0 5px ${edge.color})` }} />
            </motion.g>
          );
        })}

        {/* Nodes — plain SVG circles */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x} cy={node.y} r={node.size + 6}
              fill="none"
              stroke={node.color}
              strokeWidth={0.8}
              strokeOpacity={0.15}
              style={{ animation: `edgePulse ${3 + node.delay}s ${node.delay}s infinite ease-in-out` }}
            />
            <circle
              cx={node.x} cy={node.y} r={node.size}
              fill={`${node.color}22`}
              stroke={node.color}
              strokeWidth={1.5}
              style={{
                filter: `drop-shadow(0 0 6px ${node.color})`,
                animation: `edgePulse 2.2s ${node.delay}s infinite ease-in-out`,
              }}
            />
            {node.label && (
              <text
                x={node.x} y={node.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                fill={node.color} fontSize={6} fontFamily="monospace" fontWeight="700"
              >
                {node.label}
              </text>
            )}
          </g>
        ))}

        {/* Layer labels */}
        {["INPUT","EMBED","ATTN","FFN","PROJ","OUTPUT"].map((lbl, i) => (
          <text
            key={i}
            x={[40,120,210,305,400,490][i]} y={378}
            textAnchor="middle"
            fill={["#00ffcc","#ff6600","#aa44ff","#00aaff","#ffcc00","#ff4466"][i]}
            fontSize={7.5} fontFamily="monospace" fontWeight="700" opacity={0.5}
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  );
}
