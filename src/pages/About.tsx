import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { AnimatedButton } from "@/components/landing/AnimatedButton";
import { FloatingCode } from "@/components/landing/FloatingCode";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { DigitalHelix } from "@/components/landing/DigitalHelix";
import { CubeCode3D } from "@/components/landing/CubeCode3D";
import { HoloTerminal } from "@/components/landing/HoloTerminal";
import { NeuralNet3D } from "@/components/landing/NeuralNet3D";
import { HologramGrid } from "@/components/landing/HologramGrid";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";
import { WebGLErrorBoundary } from "@/components/landing/WebGLErrorBoundary";
import { Building, Target, Zap, Users, Mail, MessageSquare, LifeBuoy, Code2, Cpu, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";

function Globe3D() {
  const globeRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      globeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const dots = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.2;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      temp.push([x, y, z] as [number, number, number]);
    }
    return temp;
  }, []);

  return (
    <group ref={globeRef}>
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <lineSegments>
          <edgesGeometry args={[new THREE.IcosahedronGeometry(2, 2)]} />
          <lineBasicMaterial color="#00ffff" transparent opacity={0.3} />
        </lineSegments>
        
        {dots.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <MatrixRain opacity={0.28} speed={1.1} className="pointer-events-none z-0" />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.82) 65%, black 100%)" }} />

        {/* Decorative corner brackets */}
        {[
          { top: 80, left: 40 }, { top: 80, right: 40 },
          { bottom: 40, left: 40 }, { bottom: 40, right: 40 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none z-[2] hidden lg:block"
            style={{ ...pos, width: 40, height: 40 }}
            initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: i * 0.1 + 0.5 }}
          >
            <svg viewBox="0 0 40 40" fill="none" stroke="#00ffcc" strokeWidth="1.5">
              {i === 0 && <><path d="M0 20 L0 0 L20 0" /><circle cx="0" cy="0" r="3" fill="#00ffcc" /></>}
              {i === 1 && <><path d="M40 20 L40 0 L20 0" /><circle cx="40" cy="0" r="3" fill="#00ffcc" /></>}
              {i === 2 && <><path d="M0 20 L0 40 L20 40" /><circle cx="0" cy="40" r="3" fill="#00ffcc" /></>}
              {i === 3 && <><path d="M40 20 L40 40 L20 40" /><circle cx="40" cy="40" r="3" fill="#00ffcc" /></>}
            </svg>
          </motion.div>
        ))}

        <div className="relative z-[3] text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full font-mono text-xs"
            style={{ background: "rgba(0,255,204,0.07)", border: "1px solid rgba(0,255,204,0.2)", color: "#00ffcc" }}
          >
            <motion.span animate={{ opacity: [1,0,1] }} transition={{ duration: 1.2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-cyan-400" />
            NIRPESH AI · EST. 2023 · BUILDING THE FUTURE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9 }}
            className="font-orbitron font-black leading-none mb-8"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            <span className="text-white">WE ARE</span>
            <br />
            <span style={{
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, #00ffcc 0%, #0088ff 40%, #aa44ff 80%, #ff6600 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 35px rgba(0,255,204,0.45))",
            }}>NIRPESH AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-gray-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-4"
          >
            Pioneering the boundary between synthetic logic and human intuition. Systems that don't just compute — they <em style={{ color: "#00ffcc", fontStyle: "normal" }}>understand</em>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
            className="text-gray-500 text-lg max-w-2xl mx-auto"
          >
            Our mission: democratize advanced intelligence and make cognitive architecture accessible to every innovator on Earth.
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3]"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-cyan-500/25 flex items-start justify-center pt-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-cyan-400" />
          </div>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="relative border-y border-white/5 overflow-hidden">
        <MatrixRain opacity={0.08} speed={0.5} className="pointer-events-none z-0" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/5">
            {[
              { label: "Enterprise Clients", value: "200+", color: "#00ffcc" },
              { label: "Countries Served", value: "150+", color: "#ff6600" },
              { label: "Queries Daily", value: "10M+", color: "#aa44ff" },
              { label: "Rating", value: "4.9/5", color: "#00aaff" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center py-10 px-6"
              >
                <motion.div
                  className="font-orbitron font-black text-4xl md:text-5xl mb-2"
                  style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}66` }}
                  animate={{ textShadow: [`0 0 15px ${stat.color}44`, `0 0 30px ${stat.color}88`, `0 0 15px ${stat.color}44`] }}
                  transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-gray-500 uppercase tracking-[0.2em] font-mono">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Timeline */}
      <section className="py-24 container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-orbitron font-bold text-white mb-6">Our Origin</h2>
            <p className="text-cyan-400 font-medium mb-8 text-lg">Founded in 2023 by a team of AI researchers and engineers from leading institutions.</p>
            <div className="space-y-6 text-gray-400 font-sans leading-relaxed">
              <p>Nirpesh AI was born out of frustration with brittle, narrow models. We saw a world where AI could be more than just a party trick—it could be a foundational layer for human progress.</p>
              <p>We gathered a coalition of physicists, software architects, and cognitive scientists to rethink intelligence from the ground up, starting with multi-modal neural reasoning.</p>
              <p>Today, our systems power everything from financial modeling to creative generative tools, always driven by our core belief: technology should empower, not replace.</p>
            </div>
          </div>
          
          <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent pointer-events-none" />
            <h3 className="font-orbitron text-2xl font-bold text-white mb-8 relative z-10">The Journey</h3>
            
            <div className="space-y-8 relative z-10">
              {[
                { year: "2023", event: "Founded" },
                { year: "2024", event: "First Model" },
                { year: "2024", event: "10K Users" },
                { year: "2025", event: "Enterprise" },
                { year: "2026", event: "Global Launch" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6">
                  <div className="w-16 font-orbitron font-bold text-cyan-400 text-lg">{item.year}</div>
                  <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.8)] relative">
                    {i !== 4 && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-cyan-500/30" />}
                  </div>
                  <div className="text-gray-300 font-sans">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-black relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-center text-white mb-16">Mission & Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Target, title: "Innovation", desc: "Pushing beyond current paradigms to invent the future of compute." },
              { icon: Building, title: "Integrity", desc: "Transparent, accountable, and secure models you can trust." },
              { icon: Zap, title: "Impact", desc: "Building technology that creates measurable, positive change." },
              { icon: Users, title: "Inclusivity", desc: "Designing systems that serve global, diverse communities." }
            ].map((val, i) => (
              <div key={i} className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-6">
                  <val.icon size={28} className="text-cyan-400" />
                </div>
                <h3 className="font-orbitron text-xl font-bold text-white mb-4">{val.title}</h3>
                <p className="text-gray-400 text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Global Reach */}
      <section className="relative h-[500px] w-full bg-background overflow-hidden border-y border-white/5">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h2 className="text-6xl md:text-8xl font-orbitron font-black text-white/10 uppercase tracking-[0.2em] whitespace-nowrap">Global Reach</h2>
        </div>
        <WebGLErrorBoundary fallback={<div className="w-full h-full bg-blue-900/10" />}>
          <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            <Globe3D />
          </Canvas>
        </WebGLErrorBoundary>
      </section>

      {/* ── Founder ── */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20"><FloatingCode count={10} /></div>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-cyan-400 font-orbitron text-xs tracking-[0.35em] uppercase mb-3">The Architect</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white">The Mind Behind It</h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
            {/* Left — helix + cube */}
            <div className="flex flex-col items-center gap-6">
              <DigitalHelix className="h-[440px]" />
              <CubeCode3D className="mt-2" />
            </div>

            {/* Center — Founder card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "backOut" }}
              className="flex-shrink-0"
            >
              <div
                className="relative rounded-3xl overflow-hidden text-center p-10"
                style={{
                  background: "linear-gradient(135deg, rgba(0,255,204,0.06) 0%, rgba(0,100,255,0.08) 50%, rgba(170,68,255,0.06) 100%)",
                  border: "1px solid rgba(0,255,204,0.25)",
                  boxShadow: "0 0 60px rgba(0,255,204,0.12), 0 0 120px rgba(0,100,255,0.08)",
                  width: 320,
                }}
              >
                {/* Animated halo rings */}
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: 140 + i * 40,
                      height: 140 + i * 40,
                      top: "50%", left: "50%",
                      marginTop: -(70 + i * 20) - 30,
                      marginLeft: -(70 + i * 20),
                      border: `1px solid rgba(0,255,204,${0.2 - i * 0.06})`,
                    }}
                    animate={{ rotate: i % 2 === 0 ? [0, 360] : [0, -360], scale: [1, 1.05, 1] }}
                    transition={{ rotate: { duration: 10 + i * 4, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                  />
                ))}

                {/* Avatar */}
                <div className="relative mx-auto mb-6" style={{ width: 110, height: 110 }}>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg, #00ffcc, #0066ff, #aa44ff, #ff6600, #00ffcc)",
                      padding: 2,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-black" />
                  </motion.div>
                  <div
                    className="absolute inset-[3px] rounded-full flex items-center justify-center font-orbitron font-black text-5xl"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #00ffcc22, #0011330)",
                      color: "transparent",
                      backgroundImage: "linear-gradient(135deg, #00ffcc 0%, #0088ff 50%, #aa44ff 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 16px rgba(0,255,204,0.8))",
                    }}
                  >
                    N
                  </div>
                </div>

                {/* Name */}
                <h3
                  className="font-orbitron font-black text-4xl mb-2"
                  style={{
                    color: "transparent",
                    backgroundImage: "linear-gradient(135deg, #ffffff 0%, #00ffcc 50%, #0088ff 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "none",
                    filter: "drop-shadow(0 0 12px rgba(0,255,204,0.5))",
                  }}
                >
                  Nirpesh
                </h3>

                <div
                  className="font-orbitron font-bold text-sm tracking-[0.2em] uppercase mb-6"
                  style={{ color: "#00ffcc", textShadow: "0 0 12px rgba(0,255,204,0.7)" }}
                >
                  Founder &amp; CEO
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Vision", val: "∞" },
                    { label: "Models", val: "3+" },
                    { label: "Impact", val: "Global" },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl py-2 px-1" style={{ background: "rgba(0,255,204,0.06)", border: "1px solid rgba(0,255,204,0.12)" }}>
                      <div className="font-orbitron font-black text-cyan-400 text-lg">{s.val}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-wider mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Visionary builder redefining the boundary of artificial intelligence. Architected Nirpesh AI from the ground up — from model training to global deployment.
                </p>

                {/* Skill bars */}
                {[
                  { skill: "AI Engineering", pct: 98, color: "#00ffcc" },
                  { skill: "System Architecture", pct: 95, color: "#0088ff" },
                  { skill: "Product Vision", pct: 99, color: "#aa44ff" },
                ].map((bar, i) => (
                  <div key={i} className="mb-3 text-left">
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-xs text-gray-400">{bar.skill}</span>
                      <span className="font-mono text-xs" style={{ color: bar.color }}>{bar.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${bar.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${bar.color}88, ${bar.color})`, boxShadow: `0 0 8px ${bar.color}` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Contact */}
                <motion.a
                  href="mailto:ainirpesh@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-sm font-bold text-black"
                  style={{ background: "linear-gradient(135deg, #00ffcc, #0088ff)", boxShadow: "0 0 20px rgba(0,255,204,0.4)" }}
                >
                  <Mail size={14} />
                  ainirpesh@gmail.com
                </motion.a>
              </div>
            </motion.div>

            {/* Right — terminal */}
            <div className="flex flex-col gap-6 w-full max-w-sm">
              <HoloTerminal />
              <div
                className="glass-panel rounded-2xl p-5 border-cyan-500/20"
                style={{ background: "rgba(0,0,0,0.7)" }}
              >
                <p className="text-cyan-400 font-orbitron text-xs tracking-widest uppercase mb-3">Founder Philosophy</p>
                {[
                  { icon: BrainCircuit, text: "Build AI that empowers, not replaces." },
                  { icon: Code2, text: "Every line of code is a step toward the future." },
                  { icon: Cpu, text: "Intelligence without limits, ethics without compromise." },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 mb-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <item.icon size={14} className="text-cyan-400" />
                    </div>
                    <p className="text-gray-300 text-sm">{item.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Neural Network Visualizer ── */}
      <section className="py-20 bg-black relative z-10 overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-purple-400 font-orbitron text-xs tracking-[0.35em] uppercase mb-3">Under the Hood</p>
            <h2 className="text-3xl md:text-5xl font-orbitron font-black text-white mb-4">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Neural Architecture</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">Every inference request travels this exact path — from raw input tokens to intelligent output.</p>
          </motion.div>
          <NeuralNet3D className="w-full max-w-3xl mx-auto" style={{ height: 480 }} />
        </div>
      </section>

      {/* ── Hologram Grid ── */}
      <section className="relative z-10 overflow-hidden bg-black" style={{ height: 320 }}>
        <HologramGrid className="h-full" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <h2 className="font-orbitron font-black text-white/8 text-[5rem] md:text-[8rem] uppercase tracking-[0.2em] whitespace-nowrap select-none">
            NIRPESH AI
          </h2>
        </div>
      </section>

      {/* Press Quotes */}
      <section className="py-20 bg-black relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { outlet: "TechCrunch", quote: "\"Nirpesh AI is fundamentally rewriting the playbook on generative reasoning.\"" },
              { outlet: "Wired", quote: "\"A masterclass in scalable cognitive architecture that feels years ahead of the curve.\"" },
              { outlet: "Forbes", quote: "\"The enterprise AI solution that finally delivers on the promise of true contextual intelligence.\"" }
            ].map((press, i) => (
              <div key={i} className="border border-white/10 p-8 rounded-xl relative">
                <div className="text-4xl text-cyan-500/40 font-serif absolute top-4 left-4">"</div>
                <p className="text-gray-300 font-sans text-lg italic mb-6 relative z-10 pt-4">{press.quote}</p>
                <div className="font-orbitron font-bold text-white tracking-widest">{press.outlet}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 relative z-10 bg-black/60">
        <FloatingCode count={10} className="opacity-50" />
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-cyan-400 font-orbitron text-xs tracking-[0.3em] uppercase mb-4">Need Help?</p>
            <h2 className="text-4xl md:text-6xl font-orbitron font-black text-white mb-6">
              We're Here to <span className="text-cyan-400">Support You</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have a question, feedback, or need assistance? Our team responds within 24 hours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-14">
            {[
              {
                icon: Mail,
                title: "Email Support",
                desc: "Drop us a message and we'll get back to you promptly.",
                action: "mailto:ainirpesh@gmail.com",
                label: "ainirpesh@gmail.com",
                highlight: true,
              },
              {
                icon: MessageSquare,
                title: "Live Chat",
                desc: "Chat with our team directly on the platform.",
                action: "https://nirpesh-ai.lovable.app",
                label: "Open Platform",
                highlight: false,
              },
              {
                icon: LifeBuoy,
                title: "Help Center",
                desc: "Browse guides, tutorials, and FAQs.",
                action: "https://nirpesh-ai.lovable.app",
                label: "Visit Docs",
                highlight: false,
              },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.action}
                target={item.action.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`glass-panel p-8 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all group
                  ${item.highlight ? "border-cyan-500/40 shadow-[0_0_30px_rgba(0,255,255,0.08)]" : "border-white/10"}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-colors
                  ${item.highlight ? "bg-cyan-500/20 border border-cyan-500/40 group-hover:bg-cyan-500/30" : "bg-white/5 border border-white/10 group-hover:border-cyan-500/30"}`}>
                  <item.icon size={26} className={item.highlight ? "text-cyan-400" : "text-gray-400 group-hover:text-cyan-400"} />
                </div>
                <h3 className="font-orbitron font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                <span className={`text-sm font-medium font-mono ${item.highlight ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"} transition-colors`}>
                  {item.label}
                </span>
              </motion.a>
            ))}
          </div>

          {/* Big email CTA */}
          <div className="text-center">
            <motion.a
              href="mailto:ainirpesh@gmail.com"
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-orbitron font-bold text-black text-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #00ffff 0%, #0088ff 100%)",
                boxShadow: "0 0 30px rgba(0,255,255,0.4), 0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <Mail size={22} />
              Send us an Email
            </motion.a>
            <p className="text-gray-600 text-xs mt-4 font-mono">ainirpesh@gmail.com</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 text-center relative z-10 container mx-auto px-4">
        <div className="absolute inset-0 bg-blue-900/10 mix-blend-screen pointer-events-none" />
        <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white mb-10">
          Join the <span className="text-cyan-400">Revolution</span>
        </h2>
        <a href="https://nirpesh-ai.lovable.app" target="_blank" rel="noopener noreferrer">
          <AnimatedButton variant="primary" className="text-xl px-12 py-6">
            Get Started
          </AnimatedButton>
        </a>
      </section>

      <Footer />
    </div>
  );
}
