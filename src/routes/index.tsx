import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Zap, Globe, Shield } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero3D } from "@/components/landing/Hero3D";
import { ParticleField } from "@/components/landing/ParticleField";
import { AnimatedButton } from "@/components/landing/AnimatedButton";
import { LaptopScroll } from "@/components/landing/LaptopScroll";
import { FloatingCode } from "@/components/landing/FloatingCode";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirpesh AI — The Intelligence Behind Tomorrow" },
      { name: "description", content: "Nirpesh AI learns, adapts, and evolves — purpose-built to unlock possibilities you haven't imagined yet." },
    ],
  }),
  component: Landing,
});

const stats = [
  { icon: Zap, value: "10M+", label: "Queries Processed" },
  { icon: Globe, value: "150+", label: "Countries Served" },
  { icon: Shield, value: "99.9%", label: "Uptime Guarantee" },
];

function Landing() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".stats-row", start: "top 80%" },
        }
      );
    }, statsRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "hsl(220 20% 5%)" }}>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingCode count={20} />
      </div>
      <Navbar />
      <ParticleField />

      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <Hero3D />
        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 inline-block glass-panel px-6 py-2 rounded-full border border-cyan-500/30 neon-glow"
          >
            <span className="text-cyan-400 font-orbitron text-sm font-bold tracking-widest uppercase">
              The Next Evolution
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-8xl lg:text-9xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-900 mb-6 neon-glow leading-tight"
          >
            Nirpesh AI
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
            className="text-2xl md:text-4xl font-sans font-light text-cyan-100 mb-8 max-w-3xl leading-relaxed"
          >
            The Intelligence Behind Tomorrow
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-sans"
          >
            Nirpesh AI learns, adapts, and evolves — purpose-built to unlock
            possibilities you haven't imagined yet.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-6 pointer-events-auto"
          >
            <Link to="/dashboard">
              <AnimatedButton variant="primary">Get Started Free</AnimatedButton>
            </Link>
            <a href="/features">
              <AnimatedButton variant="outline">Explore Features</AnimatedButton>
            </a>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-cyan-500/50"
        >
          <span className="text-xs uppercase tracking-widest mb-2 font-orbitron">Scroll</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-500 to-transparent" />
        </motion.div>
      </section>

      <LaptopScroll />

      <section ref={statsRef} className="relative py-24 bg-black/60 border-y border-white/5">
        <div className="grid-bg absolute inset-0 opacity-10" />
        <div className="container mx-auto px-4 stats-row">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="stat-item glass-panel rounded-2xl p-8 flex flex-col items-center text-center border border-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <s.icon size={28} className="text-cyan-400" />
                </div>
                <span className="text-5xl font-orbitron font-black text-white mb-2 neon-glow">
                  {s.value}
                </span>
                <span className="text-gray-400 font-sans text-sm uppercase tracking-widest">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-orbitron font-black text-white mb-8"
          >
            Ready to <span className="text-cyan-400">Initialize?</span>
          </motion.h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join the elite organizations powering their future with Nirpesh AI. System access is currently available.
          </p>
          <Link to="/dashboard">
            <AnimatedButton variant="primary" className="text-xl px-16 py-6">
              Get Access Now
            </AnimatedButton>
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black pt-16 pb-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-gray-600 text-sm gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold font-orbitron text-xs">N</span>
            </div>
            <span className="font-orbitron text-white font-bold">Nirpesh AI</span>
          </div>
          <p>© {new Date().getFullYear()} Nirpesh AI Systems. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
