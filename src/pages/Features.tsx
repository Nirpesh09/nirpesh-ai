import { useState, useRef } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { CodeOrbit3D } from "@/components/landing/CodeOrbit3D";
import { NeuralNet3D } from "@/components/landing/NeuralNet3D";
import { CubeCode3D } from "@/components/landing/CubeCode3D";
import { Brain, Cpu, Zap, Activity, Layers, Infinity as InfinityIcon, ArrowRight, Check } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const FEATURES = [
  {
    icon: Brain, title: "Neural Processing", color: "#00ffcc", glyph: "∇",
    desc: "Advanced cognitive pathways that mirror and surpass human reasoning at every scale.",
    sub: ["Human-like reasoning chains", "Deep pattern recognition", "Persistent contextual memory"],
    stat: "1.2T", statLabel: "Parameters",
  },
  {
    icon: Cpu, title: "Quantum Reasoning", color: "#ff6600", glyph: "Ω",
    desc: "Solving complex multi-dimensional inference problems in single-digit milliseconds.",
    sub: ["Multi-dimensional compute", "Zero-latency response", "Parallel inference threads"],
    stat: "42ms", statLabel: "Avg Latency",
  },
  {
    icon: Zap, title: "Adaptive Learning", color: "#aa44ff", glyph: "λ",
    desc: "Self-optimizing algorithms that evolve with every single interaction and feedback signal.",
    sub: ["Continuous fine-tuning", "Dynamic weight updates", "Reinforcement loops"],
    stat: "∞", statLabel: "Improvement",
  },
  {
    icon: Layers, title: "Multimodal Intelligence", color: "#00aaff", glyph: "Σ",
    desc: "Seamless understanding fused across text, image, audio, video, and native code.",
    sub: ["Cross-modal synthesis", "Native video processing", "Audio + image generation"],
    stat: "6", statLabel: "Modalities",
  },
  {
    icon: Activity, title: "Real-time Synthesis", color: "#ffcc00", glyph: "∂",
    desc: "Instantaneous data assimilation — from raw bytes to intelligence in one pipeline.",
    sub: ["Streaming token architecture", "Live web grounding", "Instant data insights"],
    stat: "150K", statLabel: "Req/sec",
  },
  {
    icon: InfinityIcon, title: "Infinite Scale", color: "#ff3c64", glyph: "∞",
    desc: "Boundless architectural capacity for planetary-scale enterprise operations.",
    sub: ["Global distributed nodes", "Auto-scaling infra", "Zero cold-start latency"],
    stat: "150+", statLabel: "Countries",
  },
];

const STEPS = [
  { num: "01", title: "Data Ingestion", color: "#00ffcc", desc: "Raw unstructured data streams into the intake matrix from every source simultaneously with zero fidelity loss." },
  { num: "02", title: "Contextual Processing", color: "#ff6600", desc: "The cognitive core evaluates relationships, intents, and hidden contexts across the full 256K token window." },
  { num: "03", title: "Neural Synthesis", color: "#aa44ff", desc: "Deep transformer layers synthesize optimal responses and generate probabilistic forward paths." },
  { num: "04", title: "Execution Delivery", color: "#00aaff", desc: "High-fidelity output is routed back through the global edge mesh with sub-50ms guaranteed latency." },
];

function FeatureCard({ feature, i }: { feature: typeof FEATURES[0]; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(my, [0, 1], ["0%", "100%"]);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08, duration: 0.6, ease: "backOut" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 800 }}
      className="relative rounded-2xl overflow-hidden cursor-default"
    >
      {/* Dynamic gradient background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowX} ${glowY}, ${feature.color}18 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* Card body */}
      <div
        className="relative p-7 h-full flex flex-col"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${feature.color}0e 0%, rgba(0,0,0,0.85) 100%)`
            : "rgba(4,8,20,0.8)",
          border: `1px solid ${hovered ? feature.color + "44" : "rgba(255,255,255,0.07)"}`,
          boxShadow: hovered ? `0 0 40px ${feature.color}22, 0 20px 60px rgba(0,0,0,0.5)` : "0 4px 20px rgba(0,0,0,0.4)",
          transition: "all 0.3s",
          borderRadius: "1rem",
        }}
      >
        {/* Glyph watermark */}
        <div
          className="absolute top-4 right-5 font-mono font-black select-none pointer-events-none"
          style={{ fontSize: 64, color: feature.color, opacity: hovered ? 0.12 : 0.05, transition: "opacity 0.3s", lineHeight: 1 }}
        >
          {feature.glyph}
        </div>

        {/* Icon */}
        <motion.div
          animate={hovered ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: `${feature.color}14`,
            border: `1px solid ${feature.color}44`,
            boxShadow: hovered ? `0 0 25px ${feature.color}44` : `0 0 10px ${feature.color}22`,
            transition: "box-shadow 0.3s",
          }}
        >
          <feature.icon size={26} style={{ color: feature.color }} />
        </motion.div>

        {/* Stat badge */}
        <div
          className="absolute top-6 left-6 hidden lg:block"
          style={{
            background: `${feature.color}11`,
            border: `1px solid ${feature.color}33`,
            borderRadius: 8,
            padding: "2px 8px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          <span className="font-orbitron font-black text-xs" style={{ color: feature.color }}>{feature.stat}</span>
          <span className="font-mono text-xs text-gray-500 ml-1">{feature.statLabel}</span>
        </div>

        <h3 className="font-orbitron font-black text-xl text-white mb-3">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-5">{feature.desc}</p>

        <ul className="space-y-2.5 mt-auto">
          {feature.sub.map((item, j) => (
            <motion.li
              key={j}
              initial={{ opacity: 0, x: -10 }}
              animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0.6, x: 0 }}
              transition={{ delay: j * 0.05 }}
              className="flex items-center gap-3 text-sm"
              style={{ color: "rgba(200,230,255,0.7)" }}
            >
              <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                style={{ background: `${feature.color}22`, border: `1px solid ${feature.color}55` }}>
                <Check size={9} style={{ color: feature.color }} />
              </div>
              {item}
            </motion.li>
          ))}
        </ul>

        {/* Bottom accent bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5"
          animate={hovered ? { width: "100%", opacity: 1 } : { width: "0%", opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <MatrixRain opacity={0.35} speed={1} className="z-0 pointer-events-none" />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 70%, black 100%)" }} />

        {/* Floating side cubes */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none hidden xl:block z-[2]">
          <CubeCode3D />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none hidden xl:block z-[2]" style={{ transform: "translateY(-50%) scaleX(-1)" }}>
          <CubeCode3D />
        </div>

        <div className="relative z-[3] text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full font-mono text-xs"
            style={{ background: "rgba(0,255,204,0.07)", border: "1px solid rgba(0,255,204,0.2)", color: "#00ffcc" }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            COGNITIVE ARCHITECTURE v3.1
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="font-orbitron font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
          >
            <span className="text-white">COGNITIVE</span>
            <br />
            <span style={{
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, #00ffcc 0%, #0088ff 40%, #aa44ff 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(0,255,204,0.4))",
            }}>ARCHITECTURE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed"
          >
            The six pillars of superintelligence. Every capability built from silicon up.
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-cyan-500/30 flex items-center justify-center">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURE CARDS ═══ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,255,204,0.02) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 relative overflow-hidden border-y border-white/5">
        <MatrixRain opacity={0.08} speed={0.5} className="pointer-events-none z-0" />
        <div className="relative z-10 container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// pipeline</p>
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white">
              How It <span style={{
                color: "transparent",
                backgroundImage: "linear-gradient(90deg, #ff6600, #ff3c64)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Works</span>
            </h2>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: "backOut" }}
                className="flex gap-6 md:gap-12 mb-10 group"
              >
                {/* Step number bubble */}
                <div className="flex-shrink-0 flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center font-orbitron text-2xl md:text-3xl font-black relative"
                    style={{
                      background: `radial-gradient(circle, ${step.color}18 0%, rgba(0,0,0,0.8) 100%)`,
                      border: `2px solid ${step.color}44`,
                      color: step.color,
                      boxShadow: `0 0 30px ${step.color}22, inset 0 0 20px ${step.color}0a`,
                    }}
                  >
                    {step.num}
                    <div className="absolute inset-0 rounded-full animate-ping opacity-10"
                      style={{ background: step.color }} />
                  </motion.div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 mt-3 min-h-[60px]"
                      style={{ background: `linear-gradient(to bottom, ${step.color}44, transparent)` }} />
                  )}
                </div>

                <div className="flex-1 pb-10 pt-3">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-orbitron text-2xl md:text-3xl font-black text-white">{step.title}</h3>
                    <div className="h-px flex-1 max-w-[120px]"
                      style={{ background: `linear-gradient(90deg, ${step.color}66, transparent)` }} />
                  </div>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEURAL NET DIAGRAM ═══ */}
      <section className="py-20 relative overflow-hidden bg-black">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-purple-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// transformer internals</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4">
              Live Neural Path
            </h2>
          </motion.div>
          <NeuralNet3D className="w-full max-w-4xl mx-auto" style={{ height: 420 }} />
        </div>
      </section>

      {/* ═══ CODE ORBIT ═══ */}
      <section className="relative py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(0,136,255,0.04) 0%, transparent 70%)" }} />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <p className="text-cyan-400 font-orbitron text-xs tracking-[0.35em] uppercase mb-3">// live ai core</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4">
              Every Feature,{" "}
              <span style={{ color: "transparent", backgroundImage: "linear-gradient(90deg, #00ffcc, #0088ff)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Orbiting the Core
              </span>
            </h2>
          </motion.div>
          <CodeOrbit3D className="w-full mx-auto" style={{ height: 560, maxWidth: 620 }} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
