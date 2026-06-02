import { useRef, useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { CodeRain3D } from "@/components/landing/CodeRain3D";
import { CodePanels3D } from "@/components/landing/CodePanels3D";
import { NeuralNet3D } from "@/components/landing/NeuralNet3D";
import { DigitalHelix } from "@/components/landing/DigitalHelix";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Cpu, Zap, Database, Globe, Lock, Code2, ChevronRight } from "lucide-react";

const SPECS = [
  { label: "Model Parameters", value: "1.2 Trillion", detail: "Dynamic Sparse Routing", pct: 98, color: "#00ffcc" },
  { label: "Average Latency", value: "~42ms", detail: "Edge-cached globally", pct: 95, color: "#ff6600" },
  { label: "Context Window", value: "256K Tokens", detail: "Infinite rolling buffer via RAG", pct: 92, color: "#aa44ff" },
  { label: "Throughput", value: "150,000 req/s", detail: "Per inference shard", pct: 88, color: "#00aaff" },
  { label: "Modality Support", value: "6 Modalities", detail: "Text, Image, Audio, Code, Video, 3D", pct: 82, color: "#ffcc00" },
  { label: "Security Protocol", value: "SOC2 Type II", detail: "HIPAA + End-to-End Encryption", pct: 100, color: "#ff3c64" },
];

const ARCH_LAYERS = [
  { icon: Globe, step: "01", title: "Input Layer", color: "#00ffcc",
    desc: "Multi-modal ingestion pipeline — normalizes all data formats with zero fidelity loss at intake." },
  { icon: Cpu, step: "02", title: "Processing Core", color: "#ff6600",
    desc: "Distributed GPU clusters running sparse transformer inference with predictive request caching." },
  { icon: Code2, step: "03", title: "Output Synthesis", color: "#aa44ff",
    desc: "Contextual refinement and adaptive formatting, tuned to each query's intent and protocol." },
  { icon: Zap, step: "04", title: "Edge Distribution", color: "#00aaff",
    desc: "Global edge mesh delivering sub-50ms guaranteed latency to 150+ countries without exception." },
];

const TECH_STACK = [
  { name: "CUDA 12.4", color: "#76b900", desc: "Custom CUDA kernels for flash attention" },
  { name: "PyTorch 2.3", color: "#ee4c2c", desc: "Distributed training & FSDP" },
  { name: "Triton", color: "#00aaff", desc: "GPU kernel auto-tuning" },
  { name: "Rust (core)", color: "#f97316", desc: "Zero-latency inference server" },
  { name: "ONNX Runtime", color: "#ff6600", desc: "Cross-platform optimization" },
  { name: "WebGPU", color: "#aa44ff", desc: "Browser-native inference" },
  { name: "FlashAttention v3", color: "#00ffcc", desc: "O(n) memory attention" },
  { name: "vLLM", color: "#ffcc00", desc: "Continuous batching engine" },
];

function SpecBar({ spec, i }: { spec: typeof SPECS[0]; i: number }) {
  const [visible, setVisible] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: i * 0.08, duration: 0.6 }}
      onViewportEnter={() => setVisible(true)}
      className="group relative p-5 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(4,8,20,0.7)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}
      whileHover={{ scale: 1.01, borderColor: spec.color + "55", boxShadow: `0 0 30px ${spec.color}15` } as any}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">{spec.label}</p>
          <p className="font-orbitron font-black text-xl text-white">{spec.value}</p>
        </div>
        <div className="text-right">
          <span className="font-orbitron font-black text-2xl" style={{ color: spec.color }}>{spec.pct}%</span>
        </div>
      </div>
      <p className="font-mono text-xs text-gray-500 mb-3">{spec.detail}</p>

      {/* Bar */}
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={visible ? { width: `${spec.pct}%` } : { width: 0 }}
          transition={{ duration: 1.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${spec.color}88, ${spec.color})`,
            boxShadow: `0 0 10px ${spec.color}66`,
          }}
        />
      </div>

      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 0% 50%, ${spec.color}08, transparent 60%)` }} />
    </motion.div>
  );
}

export default function Technology() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        <MatrixRain opacity={0.3} speed={1} className="pointer-events-none z-0" />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 80% at 30% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.88) 60%, black 100%)" }} />

        <div className="container mx-auto px-4 md:px-8 relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full font-mono text-xs"
                  style={{ background: "rgba(255,100,0,0.08)", border: "1px solid rgba(255,100,0,0.25)", color: "#ff6600" }}>
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  UNDER THE HOOD
                </div>

                <h1 className="font-orbitron font-black leading-none mb-6"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
                  <span className="text-white">QUANTUM-</span>
                  <br />
                  <span style={{
                    color: "transparent",
                    backgroundImage: "linear-gradient(135deg, #00ffcc 0%, #0088ff 60%, #aa44ff 100%)",
                    WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 0 25px rgba(0,255,204,0.35))",
                  }}>RESILIENT CORE</span>
                </h1>

                <p className="text-xl text-gray-400 leading-relaxed mb-10">
                  Nirpesh AI runs on a bespoke polymorphic inference engine. We rebuilt the entire neural stack from bare silicon — minimizing latency while maximizing contextual depth.
                </p>

                <div className="flex flex-wrap gap-3">
                  {["Custom CUDA kernels", "Flash Attention v3", "FSDP distributed", "256K context"].map((tag) => (
                    <span key={tag} className="flex items-center gap-2 px-3 py-2 rounded-xl font-mono text-xs"
                      style={{ background: "rgba(0,255,204,0.06)", border: "1px solid rgba(0,255,204,0.18)", color: "#00ffcc99" }}>
                      <ChevronRight size={11} style={{ color: "#00ffcc" }} />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — helix */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <DigitalHelix className="h-[480px]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ARCH LAYERS ═══ */}
      <section className="py-24 relative overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,136,255,0.03) 0%, transparent 70%)" }} />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// architecture</p>
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white">
              Architecture <span style={{
                color: "transparent", backgroundImage: "linear-gradient(90deg, #0088ff, #aa44ff)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Overview</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {ARCH_LAYERS.map((layer, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: "backOut" }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative rounded-2xl p-6 overflow-hidden group cursor-default"
                style={{
                  background: `linear-gradient(135deg, ${layer.color}0a 0%, rgba(0,0,0,0.8) 100%)`,
                  border: `1px solid ${layer.color}22`,
                  boxShadow: `0 0 20px ${layer.color}0a`,
                  transition: "all 0.3s",
                }}
              >
                <div className="absolute top-3 right-4 font-orbitron font-black text-5xl pointer-events-none select-none"
                  style={{ color: layer.color, opacity: 0.06 }}>{layer.step}</div>

                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${layer.color}14`, border: `1px solid ${layer.color}44` }}>
                  <layer.icon size={22} style={{ color: layer.color }} />
                </div>

                <h3 className="font-orbitron font-bold text-white text-lg mb-2">{layer.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{layer.desc}</p>

                {/* Connector arrow */}
                {i < ARCH_LAYERS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: `${layer.color}22`, border: `1px solid ${layer.color}44` }}>
                      <ChevronRight size={11} style={{ color: layer.color }} />
                    </div>
                  </div>
                )}

                <motion.div
                  className="absolute bottom-0 left-0 h-0.5"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
                  style={{ background: `linear-gradient(90deg, ${layer.color}88, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEURAL TOPOLOGY ═══ */}
      <section className="py-24 relative bg-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <CodeRain3D />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-purple-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// neural topology</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4">
              Self-Organizing{" "}
              <span style={{
                color: "transparent", backgroundImage: "linear-gradient(90deg, #aa44ff, #ff3c64)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Semantic Network</span>
            </h2>
          </motion.div>
          <NeuralNet3D className="w-full max-w-4xl mx-auto" style={{ height: 440 }} />
        </div>
      </section>

      {/* ═══ SPECS ═══ */}
      <section className="py-24 relative border-y border-white/5 overflow-hidden">
        <MatrixRain opacity={0.07} speed={0.4} className="pointer-events-none z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// technical specs</p>
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white">
              Technical <span style={{
                color: "transparent", backgroundImage: "linear-gradient(90deg, #00ffcc, #ff6600)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Specifications</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {SPECS.map((spec, i) => <SpecBar key={i} spec={spec} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-orange-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// engine room</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white mb-4">
              The Code That <span style={{
                color: "transparent", backgroundImage: "linear-gradient(90deg, #ff6600, #ff3c64)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>Thinks</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            {TECH_STACK.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.08, y: -4 }}
                className="relative px-5 py-4 rounded-2xl cursor-default overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${t.color}10, rgba(0,0,0,0.7))`,
                  border: `1px solid ${t.color}33`,
                  boxShadow: `0 0 20px ${t.color}11`,
                  minWidth: 160,
                }}
              >
                <p className="font-orbitron font-black text-white text-sm mb-1">{t.name}</p>
                <p className="font-mono text-xs" style={{ color: t.color + "88" }}>{t.desc}</p>
                <div className="absolute bottom-0 left-0 w-full h-0.5"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.color}66, transparent)` }} />
              </motion.div>
            ))}
          </div>

          {/* 3D code panels */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full"
            style={{ height: 560 }}
          >
            <CodePanels3D className="w-full h-full" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
