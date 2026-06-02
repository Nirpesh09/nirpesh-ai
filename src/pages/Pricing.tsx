import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { MatrixRain } from "@/components/landing/MatrixRain";
import { AnimatedButton } from "@/components/landing/AnimatedButton";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Check, Zap, Shield, Crown, ChevronRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const TIERS = [
  {
    name: "Starter",
    price: "Free",
    color: "#00ffcc",
    icon: Zap,
    desc: "Launch pad for builders and side projects.",
    features: [
      "1,000 queries per month",
      "Standard response speed",
      "Community support",
      "Basic API access",
      "Public playground access",
    ],
    button: "Start for Free",
    variant: "outline" as const,
    cta: "https://nirpesh-ai.lovable.app",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    color: "#aa44ff",
    icon: Crown,
    desc: "Full power for professional developers.",
    features: [
      "100,000 queries per month",
      "Priority response speed",
      "Email support (< 2hr)",
      "Full API & Webhooks",
      "Custom system prompts",
      "Advanced analytics",
    ],
    button: "Get Pro Access",
    variant: "primary" as const,
    popular: true,
    cta: "https://nirpesh-ai.lovable.app",
  },
  {
    name: "Enterprise",
    price: "Custom",
    color: "#ff6600",
    icon: Shield,
    desc: "Mission-critical AI for large orgs.",
    features: [
      "Unlimited queries",
      "Zero-latency SLA",
      "24/7 Phone & Slack",
      "Dedicated Account Manager",
      "On-premise deployment",
      "Custom model fine-tuning",
    ],
    button: "Contact Sales",
    variant: "secondary" as const,
    cta: "https://nirpesh-ai.lovable.app",
  },
];

const FAQS = [
  { q: "Can I cancel my subscription at any time?", a: "Yes, cancel anytime from your billing dashboard. Access continues until end of the billing cycle — no penalties, no friction." },
  { q: "What counts as a query?", a: "A single inference request to our API or web interface, regardless of token length up to your plan's context window." },
  { q: "Do you offer discounts for non-profits or education?", a: "Yes — 50% discount for verified educational institutions and non-profits. Contact sales to apply." },
  { q: "How secure is my data?", a: "End-to-end encryption, SOC2 Type II, HIPAA compliance. Your data is never used to train base models without explicit opt-in." },
  { q: "Can I upgrade from Pro to Enterprise later?", a: "Absolutely. Upgrade seamlessly at any time with prorated cost from your existing Pro subscription." },
];

function PricingCard({ tier, i }: { tier: typeof TIERS[0]; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 25 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 25 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: tier.popular ? -16 : 0, scale: 1 }}
      transition={{ delay: i * 0.12, duration: 0.7, ease: "backOut" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); setHovered(false); }}
      onMouseEnter={() => setHovered(true)}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", perspective: 900 }}
      className="relative flex flex-col rounded-3xl overflow-hidden"
    >
      {/* Popular badge */}
      {tier.popular && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full font-orbitron font-black text-xs text-black"
          style={{
            background: "linear-gradient(90deg, #aa44ff, #0088ff)",
            boxShadow: "0 0 20px rgba(170,68,255,0.6)",
          }}
        >
          ★ MOST POPULAR
        </motion.div>
      )}

      {/* Card body */}
      <div
        className="flex flex-col flex-1 p-8 relative"
        style={{
          background: tier.popular
            ? `linear-gradient(135deg, rgba(170,68,255,0.12) 0%, rgba(0,0,0,0.9) 100%)`
            : `linear-gradient(135deg, ${tier.color}0a 0%, rgba(0,0,0,0.85) 100%)`,
          border: `1px solid ${hovered || tier.popular ? tier.color + "55" : tier.color + "22"}`,
          boxShadow: tier.popular
            ? `0 0 60px ${tier.color}22, 0 20px 80px rgba(0,0,0,0.6)`
            : hovered ? `0 0 40px ${tier.color}18, 0 10px 40px rgba(0,0,0,0.4)` : "none",
          borderRadius: "1.5rem",
          transition: "all 0.3s",
        }}
      >
        {/* Top glow for popular */}
        {tier.popular && (
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${tier.color}99, transparent)` }} />
        )}

        {/* Icon + Name */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${tier.color}14`, border: `1px solid ${tier.color}44` }}>
            <tier.icon size={22} style={{ color: tier.color }} />
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-lg"
            style={{ color: tier.color, background: `${tier.color}11`, border: `1px solid ${tier.color}33` }}>
            {tier.name}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-6 min-h-[36px]">{tier.desc}</p>

        {/* Price */}
        <div className="mb-8">
          <div className="flex items-end gap-1">
            <span
              className="font-orbitron font-black"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                color: "transparent",
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${tier.color} 100%)`,
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                filter: `drop-shadow(0 0 15px ${tier.color}66)`,
              }}
            >
              {tier.price}
            </span>
            {(tier as any).period && (
              <span className="text-gray-400 font-mono text-lg mb-2">{(tier as any).period}</span>
            )}
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {tier.features.map((feat, j) => (
            <motion.li
              key={j}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + j * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${tier.color}18`, border: `1px solid ${tier.color}55` }}>
                <Check size={10} style={{ color: tier.color }} />
              </div>
              <span className="text-gray-300 text-sm">{feat}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <motion.a
          href={tier.cta}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-orbitron font-black text-sm"
          style={
            tier.popular
              ? {
                  background: `linear-gradient(135deg, ${tier.color}, #0088ff)`,
                  color: "#fff",
                  boxShadow: `0 0 30px ${tier.color}44`,
                }
              : {
                  background: `${tier.color}12`,
                  border: `1px solid ${tier.color}44`,
                  color: tier.color,
                }
          }
        >
          {tier.button}
          <ChevronRight size={16} />
        </motion.a>

        {/* Scan line */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 pointer-events-none"
          animate={hovered || tier.popular ? { opacity: [0.3, 1, 0.3] } : { opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ background: `linear-gradient(90deg, transparent, ${tier.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <MatrixRain opacity={0.2} speed={0.8} className="pointer-events-none z-0" />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(170,68,255,0.08) 0%, rgba(0,0,0,0.85) 70%)" }} />

        <div className="relative z-[2] text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full font-mono text-xs"
            style={{ background: "rgba(170,68,255,0.08)", border: "1px solid rgba(170,68,255,0.25)", color: "#aa44ff" }}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            TRANSPARENT PRICING · NO HIDDEN FEES
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="font-orbitron font-black leading-none mb-6"
            style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
          >
            <span className="text-white">SCALE YOUR</span>
            <br />
            <span style={{
              color: "transparent",
              backgroundImage: "linear-gradient(135deg, #aa44ff 0%, #0088ff 50%, #00ffcc 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(170,68,255,0.4))",
            }}>INTELLIGENCE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto"
          >
            Scale your AI infrastructure predictably. From side project to planetary operation.
          </motion.p>
        </div>
      </section>

      {/* ═══ PRICING CARDS ═══ */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-end">
            {TIERS.map((tier, i) => <PricingCard key={i} tier={tier} i={i} />)}
          </div>
        </div>
      </section>

      {/* ═══ COMPARISON TABLE ═══ */}
      <section className="py-24 relative overflow-hidden border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-cyan-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// compare</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white">
              What You Get
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(4,8,20,0.8)" }}
          >
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-white/8"
              style={{ background: "rgba(0,255,204,0.03)" }}>
              <div className="p-5 font-orbitron text-xs text-gray-500 uppercase tracking-wider">Feature</div>
              {["Starter", "Pro", "Enterprise"].map((t, i) => (
                <div key={i} className="p-5 text-center font-orbitron font-black text-sm"
                  style={{ color: [TIERS[0].color, TIERS[1].color, TIERS[2].color][i] }}>
                  {t}
                </div>
              ))}
            </div>

            {[
              ["Queries / month", "1,000", "100,000", "Unlimited"],
              ["Response speed", "Standard", "Priority", "Zero-latency SLA"],
              ["Context window", "32K", "128K", "256K (infinite)"],
              ["API access", "Basic", "Full + Webhooks", "Dedicated endpoints"],
              ["Support", "Community", "Email < 2hr", "24/7 Slack + Phone"],
              ["Fine-tuning", "✗", "✗", "✓ Custom models"],
            ].map((row, ri) => (
              <div key={ri} className="grid grid-cols-4 border-b border-white/5 group"
                style={{ background: ri % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                <div className="p-4 font-mono text-sm text-gray-400 group-hover:text-gray-200 transition-colors">
                  {row[0]}
                </div>
                {row.slice(1).map((val, ci) => (
                  <div key={ci} className="p-4 text-center font-mono text-sm"
                    style={{ color: val === "✗" ? "#333" : ci === 1 ? TIERS[1].color + "cc" : "rgba(200,220,255,0.7)" }}>
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-orange-400 font-mono text-xs tracking-[0.35em] uppercase mb-3">// faq</p>
            <h2 className="text-4xl md:text-5xl font-orbitron font-black text-white">
              Frequently Asked
            </h2>
          </motion.div>

          <div className="rounded-3xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(4,8,20,0.7)" }}>
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}
                  className="border-b border-white/5 last:border-0">
                  <AccordionTrigger
                    className="px-7 py-6 text-left font-orbitron font-bold text-white hover:text-cyan-400 hover:no-underline data-[state=open]:text-cyan-400 transition-colors"
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-7 pb-6 text-gray-400 font-mono text-sm leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-32 overflow-hidden">
        <MatrixRain opacity={0.15} speed={0.6} className="pointer-events-none z-0" />
        <div className="absolute inset-0 z-[1]"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(170,68,255,0.07) 0%, rgba(0,0,0,0.92) 70%)" }} />
        <div className="relative z-[2] text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-orbitron font-black text-5xl md:text-7xl text-white mb-6">
              Start{" "}
              <span style={{
                color: "transparent",
                backgroundImage: "linear-gradient(135deg, #aa44ff, #0088ff, #00ffcc)",
                WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 25px rgba(170,68,255,0.4))",
              }}>Free</span>
            </h2>
            <p className="text-gray-400 text-xl mb-10">No credit card. No commitment. Just intelligence.</p>
            <a href="https://nirpesh-ai.lovable.app" target="_blank" rel="noopener noreferrer">
              <AnimatedButton variant="primary" className="text-xl px-16 py-6 font-orbitron font-black">
                Launch for Free →
              </AnimatedButton>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
