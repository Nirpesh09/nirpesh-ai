import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CODE_SNIPPETS = [
  "import { AI } from 'nirpesh'",
  "const model = new NLP()",
  "await predict(input)",
  "nn.train(dataset)",
  "loss.backward()",
  "optimizer.step()",
  "return embedding",
  "if confidence > 0.9",
  "tensor.reshape()",
  "layer.forward(x)",
  "dropout(p=0.3)",
  "softmax(logits)",
  "model.eval()",
  "with torch.no_grad()",
  "batch_size = 512",
  "epochs = 100",
  "lr_scheduler.step()",
  "F.cross_entropy()",
  "attention_mask",
  "hidden_states[0]",
  "def __init__(self):",
  "super().__init__()",
  "0x4E495250455348",
  "∇L(θ) → 0",
  "argmax(Q(s,a))",
];

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

interface Particle {
  id: number;
  text: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  size: number;
  drift: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    text: CODE_SNIPPETS[i % CODE_SNIPPETS.length],
    x: getRandom(0, 95),
    y: getRandom(0, 95),
    duration: getRandom(14, 28),
    delay: getRandom(0, 10),
    opacity: getRandom(0.06, 0.22),
    size: getRandom(9, 13),
    drift: getRandom(-40, 40),
  }));
}

interface FloatingCodeProps {
  count?: number;
  className?: string;
}

export function FloatingCode({ count = 18, className = "" }: FloatingCodeProps) {
  const particles = useRef<Particle[]>(generateParticles(count));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className}`}>
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute font-mono text-cyan-400 whitespace-nowrap"
          initial={{ x: `${p.x}vw`, y: `${p.y}%`, opacity: 0 }}
          animate={{
            y: [`${p.y}%`, `${Math.max(0, p.y + p.drift)}%`],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: getRandom(2, 6),
            ease: "linear",
          }}
          style={{ fontSize: `${p.size}px`, left: `${p.x}%` }}
        >
          {p.text}
        </motion.div>
      ))}
    </div>
  );
}
